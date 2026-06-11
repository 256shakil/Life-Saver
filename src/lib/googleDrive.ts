/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Donor } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

// Configure Google OAuth provider with full Google Drive scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');

// In-memory token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize Authentication status listener.
 * This runs on app load and manages the active sessions.
 */
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If logged into Firebase but we don't have the cached OAuth token (e.g., page refresh),
        // we prompt sign in again so GoogleAuthProvider returns fresh credentials.
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

/**
 * Authenticate with Google and capture the Drive OAuth access token
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Failed to capture Google Drive access token from authentication.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('OAuth Authentication Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Returns the active OAuth token from local in-memory cache
 */
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Performs application sign out
 */
export const googleSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

/* ==========================================================================
   Google Drive API Services
   ========================================================================== */

/**
 * Helper to execute standard custom GET/POST fetch requests to the Google Drive API
 */
async function driveFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Unauthenticated: Google Drive access token is missing. Please sign in.');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  } as any;

  const response = await fetch(`https://www.googleapis.com/drive/v3/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API Error: ${response.status} - ${errText}`);
  }

  // Handle media downloads which are not JSON
  if (options.headers && (options.headers as any)['Accept'] === 'application/octet-stream' || endpoint.includes('alt=media')) {
    return response;
  }

  return response.json();
}

/**
 * Retrieve or create a workspace directory in Google Drive
 */
export async function getOrCreateFolder(folderName: string): Promise<string> {
  // Search for the folder first
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const list = await driveFetch(`files?q=${query}&fields=files(id,name)`);
  
  if (list.files && list.files.length > 0) {
    return list.files[0].id;
  }

  // Create folder if it doesn't exist
  const createFolderData = await driveFetch('files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  return createFolderData.id;
}

/**
 * Generates and uploads a donor roster JSON backup file to Google Drive.
 * Writes to the custom "LifeSaver_App_Backups" folder.
 */
export async function backupDonorsToDrive(donors: Donor[]): Promise<{ fileId: string; name: string }> {
  const folderId = await getOrCreateFolder('LifeSaver_App_Backups');
  const now = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `LifeSaver_Donors_Backup_${now}.json`;
  const fileContent = JSON.stringify(donors, null, 2);

  const boundary = 'lifesaver_multipart_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
  };

  const multipartBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    'Content-Type: application/json\r\n\r\n',
    fileContent,
    closeDelim
  ], { type: `multipart/related; boundary=${boundary}` });

  const token = getAccessToken();
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: multipartBody,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload backup: ${res.status} - ${errText}`);
  }

  const responseJson = await res.json();
  return { fileId: responseJson.id, name: fileName };
}

/**
 * Retrieve back list of available donor backup files from the Google Drive backup directory
 */
export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
}

export async function listBackupsFromDrive(): Promise<DriveBackupFile[]> {
  const folderId = await getOrCreateFolder('LifeSaver_App_Backups');
  const query = encodeURIComponent(`'${folderId}' in parents and name contains 'LifeSaver_Donors_Backup' and trashed = false`);
  const list = await driveFetch(`files?q=${query}&fields=files(id,name,createdTime)&orderBy=createdTime desc`);
  return list.files || [];
}

/**
 * Load the content of a specific backup file and parse the donor roster
 */
export async function downloadBackupFile(fileId: string): Promise<Donor[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Unauthenticated');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download backup content: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload general attachments (e.g. medical certificates, blood reports) to Google Drive.
 * Stores files under a dedicated "LifeSaver_Donor_Documents" folder.
 */
export async function uploadDonorFileToDrive(
  donorName: string,
  file: File
): Promise<{ fileId: string; webViewLink: string }> {
  const rootFolderId = await getOrCreateFolder('LifeSaver_Donor_Documents');
  
  // Create or retrieve a subfolder specifically for this donor
  const donorFolderName = `${donorName.replace(/[^a-zA-Z0-9 ]/g, '')}_Docs`;
  const query = encodeURIComponent(`name = '${donorFolderName}' and '${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const folderList = await driveFetch(`files?q=${query}&fields=files(id,name)`);
  
  let donorFolderId = '';
  if (folderList.files && folderList.files.length > 0) {
    donorFolderId = folderList.files[0].id;
  } else {
    const newFolder = await driveFetch('files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: donorFolderName,
        parents: [rootFolderId],
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    donorFolderId = newFolder.id;
  }

  // Construct standard boundary multipart uploader for the binary payload
  const boundary = 'lifesaver_binary_multipart_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: file.name,
    parents: [donorFolderId],
    mimeType: file.type || 'application/octet-stream',
  };

  const multipartBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
    file,
    closeDelim
  ], { type: `multipart/related; boundary=${boundary}` });

  const token = getAccessToken();
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: multipartBody,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`File upload failed: ${res.status} - ${errText}`);
  }

  const responseJson = await res.json();
  
  // Set permissions to "anyone with link can view" so it's readable if clicked,
  // or simply return the link directly since the administrative user has permission.
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${responseJson.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (err) {
    console.warn('Could not set public preview permission for file:', err);
  }

  return {
    fileId: responseJson.id,
    webViewLink: responseJson.webViewLink || `https://drive.google.com/open?id=${responseJson.id}`,
  };
}
