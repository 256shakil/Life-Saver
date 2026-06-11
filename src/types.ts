/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Donor {
  id: string;
  name: string;
  fatherName?: string;
  gender: 'male' | 'female' | 'other' | '';
  dob: string;
  bloodGroup: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  country: string;
  division: string;
  district: string;
  upazila: string;
  address?: string;
  lastDonationDate?: string; // empty means first-time
  availability: 'available' | 'emergency' | 'unavailable';
  weight?: number;
  healthStatus: string;
  avatarUrl: string;
  status: 'Pending' | 'Approved';
  createdAt: string;
  googleDriveDocs?: Array<{
    name: string;
    fileId: string;
    webViewLink: string;
    uploadedAt: string;
  }>;
}

export type ViewType = 'home' | 'find-donors' | 'register' | 'admin';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  badge: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  contact: string;
  bloodNeeded: string[];
}
