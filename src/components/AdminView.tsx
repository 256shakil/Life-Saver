/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Donor } from '../types';
import { BLOOD_GROUPS } from '../data';
import { 
  Users, UserCheck, Trash2, Edit2, Play, Search, TrendingUp, TrendingDown, 
  FileDown, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart2, Cloud, HardDrive, LogOut, Database, UploadCloud, FolderOpen
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  auth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  backupDonorsToDrive,
  listBackupsFromDrive,
  downloadBackupFile,
  uploadDonorFileToDrive,
  DriveBackupFile 
} from '../lib/googleDrive';

interface AdminViewProps {
  donors: Donor[];
  onApproveDonor: (id: string) => void;
  onDeleteDonor: (id: string) => void;
  onEditDonor: (id: string, updatedFields: Partial<Donor>) => void;
  onRestoreDonors?: (restored: Donor[]) => void;
}

export default function AdminView({ donors, onApproveDonor, onDeleteDonor, onEditDonor, onRestoreDonors }: AdminViewProps) {
  const [subTab, setSubTab] = useState<'dashboard' | 'donors' | 'inventory' | 'requests' | 'google-drive'>('dashboard');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Editing modal state
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editAvailability, setEditAvailability] = useState<'available' | 'emergency' | 'unavailable'>('available');

  // Google Drive & Authentication states
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [backups, setBackups] = useState<DriveBackupFile[]>([]);
  const [driveMessage, setDriveMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Document Vault modal state
  const [vaultDonor, setVaultDonor] = useState<Donor | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Sync Google Session status on mount
  useEffect(() => {
    const checkSession = () => {
      const token = getAccessToken();
      if (token && auth.currentUser) {
        setGoogleUser(auth.currentUser);
        setDriveToken(token);
        refreshBackups(token);
      }
    };
    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsDriveLoading(true);
    setDriveMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setDriveToken(res.accessToken);
        setDriveMessage({ type: 'success', text: 'Connected to Google Drive successfully!' });
        await refreshBackups(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setDriveMessage({ type: 'error', text: `Authentication failed: ${err.message || err}` });
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await googleSignOut();
      setGoogleUser(null);
      setDriveToken(null);
      setBackups([]);
      setDriveMessage({ type: 'info', text: 'Disconnected from Google Drive.' });
    } catch (err: any) {
      console.error(err);
    }
  };

  const refreshBackups = async (tokenOverride?: string) => {
    const token = tokenOverride || driveToken || getAccessToken();
    if (!token) return;
    setIsDriveLoading(true);
    try {
      const files = await listBackupsFromDrive();
      setBackups(files);
    } catch (err: any) {
      console.error(err);
      setDriveMessage({ type: 'error', text: `Failed to load backup repository list: ${err.message}` });
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleBackup = async () => {
    if (!driveToken) return;
    const confirmed = window.confirm('Are you sure you want to back up the current donor roster to your Google Drive?');
    if (!confirmed) return;
    
    setIsDriveLoading(true);
    setDriveMessage({ type: 'info', text: 'Uploading roster package to Google Drive...' });
    try {
      const result = await backupDonorsToDrive(donors);
      setDriveMessage({ type: 'success', text: `Roster backup done! Saved as: "${result.name}"` });
      await refreshBackups();
    } catch (err: any) {
      console.error(err);
      setDriveMessage({ type: 'error', text: `Roster backup failed: ${err.message}` });
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleRestore = async (backupId: string, backupName: string) => {
    if (!driveToken) return;
    const confirmed = window.confirm(
      `CRITICAL ACTION:\nAre you sure you want to RESTORE the database from "${backupName}"?\n\nThis will OVERWRITE all current donors in the app with the database content from this backup. This operation cannot be undone.`
    );
    if (!confirmed) return;

    setIsDriveLoading(true);
    setDriveMessage({ type: 'info', text: 'Retrieving backup content from Google Drive...' });
    try {
      const restoredDonors = await downloadBackupFile(backupId);
      if (restoredDonors && Array.isArray(restoredDonors)) {
        if (onRestoreDonors) {
          onRestoreDonors(restoredDonors);
          setDriveMessage({ type: 'success', text: `Database restored safely! Loaded ${restoredDonors.length} donors.` });
        } else {
          setDriveMessage({ type: 'error', text: 'Overwrite handler callback is missing on parent App.' });
        }
      } else {
        throw new Error('Invalid backup file payload format.');
      }
    } catch (err: any) {
      console.error(err);
      setDriveMessage({ type: 'error', text: `Restore failed: ${err.message}` });
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!vaultDonor || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploadingDoc(true);
    try {
      const uploadRes = await uploadDonorFileToDrive(vaultDonor.name, file);
      const newDoc = {
        name: file.name,
        fileId: uploadRes.fileId,
        webViewLink: uploadRes.webViewLink,
        uploadedAt: new Date().toISOString()
      };
      const updatedDocs = [...(vaultDonor.googleDriveDocs || []), newDoc];
      
      onEditDonor(vaultDonor.id, { googleDriveDocs: updatedDocs });
      setVaultDonor({ ...vaultDonor, googleDriveDocs: updatedDocs });
      setDriveMessage({ type: 'success', text: `File "${file.name}" uploaded successfully to Google Drive.` });
    } catch (err: any) {
      console.error(err);
      alert(`Failed to upload proof to Google Drive: ${err.message}`);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Export simulation feedback
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Trigger export simulation file prompt
  const triggerExport = (type: 'PDF' | 'Excel' | 'Report') => {
    setExportMessage(`Generating system export of ${type}...`);
    setTimeout(() => {
      setExportMessage(`Successfully generated and dispatched Life_Saver_${type}_Export.bin!`);
      setTimeout(() => setExportMessage(null), 3000);
    }, 1500);
  };

  // Filter the donors dynamically based on search & sub-tab selection
  const filteredDonors = donors.filter(donor => {
    if (subTab === 'requests' && donor.status !== 'Pending') return false;
    if (subTab === 'donors' && donor.status !== 'Approved') return false;

    if (tableSearch.trim() === '') return true;
    const q = tableSearch.toLowerCase();
    return (
      donor.name.toLowerCase().includes(q) ||
      donor.bloodGroup.toLowerCase().includes(q) ||
      donor.division.toLowerCase().includes(q) ||
      donor.district.toLowerCase().includes(q) ||
      donor.status.toLowerCase().includes(q)
    );
  });

  // Calculate stats dynamically based on live state
  const totalDonorsOffset = 12845 + donors.filter(d => d.status === 'Approved').length - 5;
  const pendingCount = donors.filter(d => d.status === 'Pending').length;
  const approvedCount = donors.filter(d => d.status === 'Approved').length;

  // Inventory count mapping for chart
  const bloodTypeCounts = BLOOD_GROUPS.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Populate inventory counts from live approved donors
  donors.forEach(donor => {
    if (donor.status === 'Approved' && bloodTypeCounts[donor.bloodGroup] !== undefined) {
      bloodTypeCounts[donor.bloodGroup] += 1;
    }
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openEditModal = (donor: Donor) => {
    setEditingDonor(donor);
    setEditBloodGroup(donor.bloodGroup);
    setEditAvailability(donor.availability);
  };

  const handleSaveEdit = () => {
    if (editingDonor) {
      onEditDonor(editingDonor.id, {
        bloodGroup: editBloodGroup,
        availability: editAvailability,
      });
      setEditingDonor(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-50 text-neutral-800 font-sans">
      
      {/* Sidebar for Admin Panel (Mockup 4 Left bar) */}
      <aside className="w-full lg:w-64 shrink-0 bg-neutral-100 dark:bg-neutral-950 border-r border-neutral-200/80 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="text-xl font-bold text-red-700 tracking-tight font-sans">
              Admin Panel
            </h1>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">
              System Oversight
            </p>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setSubTab('dashboard')}
              className={`w-full flex items-center gap-2.5 rounded-lg p-3 text-xs font-semibold text-left transition-all ${
                subTab === 'dashboard'
                  ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setSubTab('donors')}
              className={`w-full flex items-center gap-2.5 rounded-lg p-3 text-xs font-semibold text-left transition-all ${
                subTab === 'donors'
                  ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Manage Donors ({donors.length})</span>
            </button>
            <button
              onClick={() => setSubTab('inventory')}
              className={`w-full flex items-center gap-2.5 rounded-lg p-3 text-xs font-semibold text-left transition-all ${
                subTab === 'inventory'
                  ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">bloodtype</span>
              <span>Inventory Stock</span>
            </button>
            <button
              onClick={() => setSubTab('requests')}
              className={`w-full flex items-center gap-2.5 rounded-lg p-3 text-xs font-semibold text-left transition-all ${
                subTab === 'requests'
                  ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">description</span>
              <span>Pending Requests ({pendingCount})</span>
            </button>
            <button
              onClick={() => setSubTab('google-drive')}
              className={`w-full flex items-center gap-2.5 rounded-lg p-3 text-xs font-semibold text-left transition-all ${
                subTab === 'google-drive'
                  ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>Google Drive Cloud</span>
            </button>
          </nav>
        </div>

        {/* Profile Card Bottom component */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-red-200 shrink-0 shadow-sm">
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSj3t72E90Pyaar1hG6sZ2Wqz2JZhtOpS7vxSVsdwwQbj-FHCmqVFW9W_4B-7mTljk-dnMi-D8ZLGZjcBCiH2OZ_IaNcy8eD7ZFfq2pxwQPIk72HogEWrnQze5t_FLaufCtEXvYP21en7SVlpIF8E2W7SGo2F9p9nXS-eLAHxRBZPOusQNxMX4oKE4uSmQJ7tMA5zGsgMbwLal55g8aNPfrZYWYRPiRQ4OL_r1j5HtaYhm_XASkDnjBCjc3Y6hrobTMcNyryx_q9pl"
                alt="Sarah Jenkins profile"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-800">Dr. Sarah Jenkins</span>
              <span className="text-[10px] text-neutral-400 font-medium font-sans">System Admin</span>
            </div>
          </div>
          
          <button 
            onClick={() => triggerExport('Report')}
            className="w-full py-2.5 bg-red-700 text-white hover:bg-red-800 text-xs font-bold rounded-lg cursor-pointer active:scale-95 transition-transform"
          >
            Export Report
          </button>
        </div>
      </aside>

      {/* Main Content Area Canvas */}
      <main className="flex-1 p-4 md:p-8">
        
        {/* Export action notification pill */}
        {exportMessage && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-800 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{exportMessage}</span>
          </div>
        )}

        {/* Google Drive Status pill */}
        {driveMessage && (
          <div className={`mb-4 border p-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in shadow-xs ${
            driveMessage.type === 'error'
              ? 'bg-rose-50 border-rose-100 text-rose-800'
              : driveMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-stone-50 border-stone-200 text-neutral-700'
          }`}>
            <div className="flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 shrink-0" />
              <span>{driveMessage.text}</span>
            </div>
            <button onClick={() => setDriveMessage(null)} className="text-[10px] font-bold opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Section Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 font-sans">
              System Overview
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Real-time health statistics of the collaborative blood bank operations.
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => triggerExport('PDF')}
              className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold text-xs rounded-lg shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-red-600" />
              Export PDF
            </button>
            <button
              onClick={() => triggerExport('Excel')}
              className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold text-xs rounded-lg shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-red-600" />
              Export Excel
            </button>
          </div>
        </header>

        {/* Bento Grid layout statistics */}
        {subTab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Donors */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-red-700" />
              </div>
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5 font-sans bg-emerald-55/70 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5" /> 12%
              </span>
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
              Total Donors
            </h3>
            <p className="text-neutral-900 font-extrabold text-2xl mt-1 font-sans">
              {totalDonorsOffset.toLocaleString()}
            </p>
          </div>

          {/* Card 2: Active Today */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-sky-700" />
              </div>
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5 font-sans bg-emerald-55/70 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5" /> 5%
              </span>
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
              Active Today
            </h3>
            <p className="text-neutral-900 font-extrabold text-2xl mt-1 font-sans">
              {(4102 + approvedCount).toLocaleString()}
            </p>
          </div>

          {/* Card 3: New Registrations */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-emerald-700">how_to_reg</span>
              </div>
              <span className="text-red-600 text-xs font-bold flex items-center gap-0.5 font-sans bg-rose-55/70 px-1.5 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5" /> 2%
              </span>
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
              Pending Requests
            </h3>
            <p className="text-neutral-900 font-extrabold text-2xl mt-1 font-sans">
              {pendingCount}
            </p>
          </div>

          {/* Card 4: Inventory Health Visual Chart */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-2">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
                Inventory Weight
              </h3>
              <span className="text-[10px] text-neutral-400 font-bold font-mono">4.2k units</span>
            </div>

            {/* Custom columns diagram */}
            <div className="flex items-end gap-2.5 h-10 mt-1 pb-1">
              {/* O+ bar (static offset + dynamic value) */}
              <div className="flex-1 bg-red-700 rounded-xs h-[100%] hover:brightness-95 transition-all relative group cursor-pointer">
                <div className="absolute -top-7 left-1/2 -to-x-1/2 scale-0 group-hover:scale-100 duration-200 bg-neutral-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded shadow z-10 select-none whitespace-nowrap">
                  O+: High (59 units)
                </div>
              </div>
              {/* A+ bar */}
              <div className="flex-1 bg-red-700/80 rounded-xs h-[75%] hover:brightness-95 transition-all relative group cursor-pointer">
                <div className="absolute -top-7 left-1/2 -to-x-1/2 scale-0 group-hover:scale-100 duration-200 bg-neutral-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded shadow z-10 select-none whitespace-nowrap">
                  A+: Health (42 units)
                </div>
              </div>
              {/* B+ bar */}
              <div className="flex-1 bg-red-700/60 rounded-xs h-[45%] hover:brightness-95 transition-all relative group cursor-pointer">
                <div className="absolute -top-7 left-1/2 -to-x-1/2 scale-0 group-hover:scale-100 duration-200 bg-neutral-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded shadow z-10 select-none whitespace-nowrap">
                  B+: Med (26 units)
                </div>
              </div>
              {/* O- bar */}
              <div className="flex-1 bg-rose-300 rounded-xs h-[25%] hover:brightness-95 transition-all relative group cursor-pointer">
                <div className="absolute -top-7 left-1/2 -to-x-1/2 scale-0 group-hover:scale-100 duration-200 bg-neutral-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded shadow z-10 select-none whitespace-nowrap">
                  O-: Urgent (12 units)
                </div>
              </div>
              {/* AB- bar */}
              <div className="flex-1 bg-rose-400 rounded-xs h-[15%] hover:brightness-95 transition-all relative group cursor-pointer">
                <div className="absolute -top-7 left-1/2 -to-x-1/2 scale-0 group-hover:scale-100 duration-200 bg-neutral-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded shadow z-10 select-none whitespace-nowrap">
                  AB-: Urgent (6 units)
                </div>
              </div>
            </div>
          </div>

        </div>
        )}

        {/* Google Drive Tab Section */}
        {subTab === 'google-drive' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-red-700 animate-pulse" />
                    Google Drive Integration
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Securely back up, sync, and restore your donor directory roster using your own personal Google Drive cloud workspace.
                  </p>
                </div>
                {googleUser && (
                  <button
                    onClick={handleGoogleSignOut}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                )}
              </div>

              <div className="mt-6 border-t border-stone-100 pt-6">
                {!driveToken ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <Cloud className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
                    <h4 className="text-sm font-bold text-neutral-800">No active Google Drive connection</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mb-6">
                      Connect your Google Workspace Drive to enable full backup history sync, medical validation storage, and roster directory imports.
                    </p>
                    
                    {/* Standard GSI Material Sign-in button */}
                    <button 
                      onClick={handleGoogleSignIn}
                      className="gsi-material-button font-sans"
                      disabled={isDriveLoading}
                    >
                      <div className="gsi-material-button-state"></div>
                      <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                          </svg>
                        </div>
                        <span className="gsi-material-button-contents text-neutral-700 font-semibold">{isDriveLoading ? "Authorizing..." : "Sign in with Google"}</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {/* Authenticated user banner */}
                    <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-200 shrink-0">
                        <img
                          referrerPolicy="no-referrer"
                          src={googleUser?.photoURL || 'https://lh3.googleusercontent.com/a/default-user'}
                          className="w-full h-full object-cover"
                          alt="Google Profile"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-800">Connected as {googleUser?.displayName || 'Google User'}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{googleUser?.email}</p>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                        Live Sync Connected
                      </span>
                    </div>

                    {/* Storage actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Trigger Now</h4>
                          <h5 className="text-sm font-bold text-neutral-900 mt-1">Back up Local Database</h5>
                          <p className="text-xs text-neutral-500 mt-1">
                            Upload your current donor records securely to your Google Drive inside the dedicated folder. Keep your records offline-safe.
                          </p>
                        </div>
                        <button
                          onClick={handleBackup}
                          disabled={isDriveLoading}
                          className="mt-4 py-2 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer w-full"
                        >
                          <Database className="w-3.5 h-3.5" />
                          Create Live Cloud Backup
                        </button>
                      </div>

                      <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Database Overwrite</h4>
                          <h5 className="text-sm font-bold text-neutral-900 mt-1">Restore from Google Drive</h5>
                          <p className="text-xs text-neutral-500 mt-1">
                            Overwrite local records with historical backups. Make sure to download a copy beforehand so you do not lose any modifications.
                          </p>
                        </div>
                        <button
                          onClick={() => refreshBackups()}
                          disabled={isDriveLoading}
                          className="mt-4 py-2 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-neutral-800 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? 'animate-spin' : ''}`} />
                          Refresh Backups List
                        </button>
                      </div>
                    </div>

                    {/* Backups List Table */}
                    <div className="mt-8">
                      <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-rose-700" />
                        Available Backups in Google Drive File Repository
                      </h4>
                      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
                        {backups.length === 0 ? (
                          <div className="p-8 text-center text-neutral-400 text-xs text-stone-400">
                            {isDriveLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin text-red-700" />
                                <span>Searching Google Drive folder...</span>
                              </div>
                            ) : (
                              'No backup file found in "LifeSaver_App_Backups" folder. Create your first backup above!'
                            )}
                          </div>
                        ) : (
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-50 border-b border-rose-100 font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-6 py-3 whitespace-nowrap">Filename</th>
                                <th className="px-6 py-3 whitespace-nowrap">Creation Date</th>
                                <th className="px-6 py-3 text-right whitespace-nowrap">Data Operations</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                              {backups.map((bk) => (
                                <tr key={bk.id} className="hover:bg-stone-50/50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-neutral-800 truncate" style={{ maxWidth: '250px' }}>{bk.name}</td>
                                  <td className="px-6 py-4 text-neutral-500">{new Date(bk.createdTime).toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleRestore(bk.id, bk.name)}
                                      disabled={isDriveLoading}
                                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-[10px] active:scale-95 transition-transform cursor-pointer"
                                    >
                                      Restore
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic List Table Section */}
        {subTab !== 'google-drive' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-8">
          
          <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-neutral-900 font-sans">
                {subTab === 'requests' ? 'Pending Donor Requests' : 'Verified Donor directory'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage registration updates, approvals, delete listings, and profile edits.
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border-0 rounded-lg text-xs outline-none focus:ring-2 focus:ring-red-250 placeholder:text-neutral-400"
                placeholder="Search donors..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-neutral-200">
                  <th className="px-6 py-3.5 font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 font-bold text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3.5 font-bold text-neutral-500 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-3.5 font-bold text-neutral-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3.5 font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedDonors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                      No donor matches found inside directory.
                    </td>
                  </tr>
                ) : (
                  paginatedDonors.map((donor) => {
                    const isPending = donor.status === 'Pending';
                    return (
                      <tr key={donor.id} className="hover:bg-neutral-50 transition-colors group">
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isPending 
                              ? 'bg-rose-50 text-red-700 border border-rose-100' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                              <img referrerPolicy="no-referrer" src={donor.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                            <span className="font-bold text-neutral-800">{donor.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 font-bold rounded">
                            {donor.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-neutral-500 font-medium">
                          {donor.upazila}, {donor.district}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isPending && (
                              <button
                                onClick={() => onApproveDonor(donor.id)}
                                className="text-emerald-700 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                title="Approve Donor"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => openEditModal(donor)}
                              className="text-neutral-500 hover:text-red-700 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                              title="Edit Credentials"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setVaultDonor(donor)}
                              className="text-cyan-600 hover:text-cyan-800 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                              title="Google Drive Document Vault"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteDonor(donor.id)}
                              className="text-red-600 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-stone-50 border-t border-neutral-200 flex justify-between items-center text-xs">
            <p className="text-neutral-400">
              Showing {paginatedDonors.length} of {filteredDonors.length} registered system donors
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 bg-white border border-neutral-200 rounded text-neutral-700 font-semibold hover:bg-neutral-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 bg-white border border-neutral-200 rounded text-neutral-700 font-semibold hover:bg-neutral-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </div>
        )}

      </main>

      {/* Quick Edit Popup Modal */}
      {editingDonor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              Quick Edit: {editingDonor.name}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-500 block">Blood Group</label>
                <select
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 bg-stone-50 outline-none"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-500 block">Availability Selection</label>
                <select
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value as any)}
                  className="w-full border border-neutral-300 rounded-lg p-2 bg-stone-50 outline-none"
                >
                  <option value="available">Available Now</option>
                  <option value="emergency">Emergency Only</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-lg text-xs"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingDonor(null)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Document Vault Popup Modal */}
      {vaultDonor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-cyan-600" />
                  Drive Document Vault: {vaultDonor.name}
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Secure health clearances, regulatory certificates, or medical documents stored on Google Drive.
                </p>
              </div>
              <button
                onClick={() => setVaultDonor(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Check if authenticated in order to use Vault */}
            {!driveToken ? (
              <div className="p-6 bg-stone-50 text-center rounded-xl border border-dashed border-stone-200 space-y-3">
                <Cloud className="w-10 h-10 text-stone-300 mx-auto animate-bounce" />
                <h4 className="text-xs font-bold text-neutral-800">Connection required to open Vault</h4>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  Accessing the Document Vault requires connecting to your Google Account. Click below or visit the "Google Drive Cloud" tab to authenticate.
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isDriveLoading}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  {isDriveLoading ? 'Connecting...' : 'Connect Google Drive'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Uploader */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-700">Attach medical/verification file</h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={handleUploadDoc}
                      disabled={isUploadingDoc}
                      className="text-xs block w-full text-stone-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 select-none cursor-pointer"
                    />
                    {isUploadingDoc && (
                      <RefreshCw className="w-4 h-4 text-red-700 animate-spin shrink-0" />
                    )}
                  </div>
                </div>

                {/* Vault list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest block font-sans">
                    Uploaded Credentials / Direct Storage
                  </h4>
                  {(!vaultDonor.googleDriveDocs || vaultDonor.googleDriveDocs.length === 0) ? (
                    <p className="text-[11px] text-neutral-400 py-6 text-center border border-dashed border-stone-200 rounded-lg">
                      No document proof uploaded. Use the uploader above to save a document to Google Drive.
                    </p>
                  ) : (
                    <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                      {vaultDonor.googleDriveDocs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg border border-neutral-200 text-xs">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-neutral-800 truncate" style={{ maxWidth: '220px' }} title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-[9px] text-neutral-400">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                            </p>
                          </div>
                          
                          <a
                            href={doc.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            View on Drive
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setVaultDonor(null)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
