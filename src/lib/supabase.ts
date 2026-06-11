/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Donor } from '../types';

// Supabase Connection Credentials (as provided by the user)
const SUPABASE_PROJECT_ID = 'bqvfdoesbrxntxokyjsj';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = 'sb_publishable_xyt7IfO_i50-dQWVALt8HA_ISejp3As';

// Support optional env overrides
const url = (import.meta as any).env?.VITE_SUPABASE_URL || SUPABASE_URL;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);

/* ==========================================================================
   SQL Schema Setup Script for Supabase SQL Editor
   ==========================================================================
   Paste the following block into your SQL editor at: https://supabase.com/dashboard/project/bqvfdoesbrxntxokyjsj/sql

   -- Create the donors table with double-quotes to retain exact camelCase mapping 
   -- so TypeScript types align 1:1 with database columns effortlessly!
   CREATE TABLE IF NOT EXISTS public.donors (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     "fatherName" TEXT,
     gender TEXT CHECK (gender IN ('male', 'female', 'other', '')),
     dob TEXT NOT NULL,
     "bloodGroup" TEXT NOT NULL,
     mobile TEXT NOT NULL,
     whatsapp TEXT,
     email TEXT NOT NULL,
     country TEXT NOT NULL,
     division TEXT NOT NULL,
     district TEXT NOT NULL,
     upazila TEXT NOT NULL,
     address TEXT,
     "lastDonationDate" TEXT,
     availability TEXT CHECK (availability IN ('available', 'emergency', 'unavailable')) DEFAULT 'available',
     weight NUMERIC,
     "healthStatus" TEXT NOT NULL,
     "avatarUrl" TEXT NOT NULL,
     status TEXT CHECK (status IN ('Pending', 'Approved')) DEFAULT 'Pending',
     "createdAt" TEXT NOT NULL,
     "googleDriveDocs" JSONB
   );

   -- Enable Row Level Security (RLS) to manage safety securely
   ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

   -- Create public security policy giving full CRUD read/write abilities
   CREATE POLICY "Allow public read and write access" 
     ON public.donors 
     FOR ALL 
     USING (true) 
     WITH CHECK (true);
   ========================================================================== */

/**
 * Fetch all donors from the Supabase table, ordered by creation time descending.
 */
export async function fetchDonorsFromSupabase(): Promise<Donor[]> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return (data as Array<any> || []).map((row) => ({
      id: row.id,
      name: row.name,
      fatherName: row.fatherName || '',
      gender: row.gender || '',
      dob: row.dob,
      bloodGroup: row.bloodGroup,
      mobile: row.mobile,
      whatsapp: row.whatsapp || '',
      email: row.email,
      country: row.country,
      division: row.division,
      district: row.district,
      upazila: row.upazila,
      address: row.address || '',
      lastDonationDate: row.lastDonationDate || '',
      availability: row.availability || 'available',
      weight: row.weight ? Number(row.weight) : undefined,
      healthStatus: row.healthStatus || 'Good',
      avatarUrl: row.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      status: row.status || 'Pending',
      createdAt: row.createdAt,
      googleDriveDocs: row.googleDriveDocs || []
    }));
  } catch (err) {
    console.warn('Could not load donors from Supabase (falling back to initial records). Error:', err);
    throw err;
  }
}

/**
 * Inserts a new donor into the Supabase table.
 */
export async function saveDonorToSupabase(donor: Donor): Promise<Donor> {
  const { data, error } = await supabase
    .from('donors')
    .insert([donor])
    .select();

  if (error) {
    console.error('Failed to saver donor in Supabase:', error);
    throw error;
  }

  return donor;
}

/**
 * Updates an existing donor in the Supabase table.
 */
export async function updateDonorInSupabase(id: string, updatedFields: Partial<Donor>): Promise<void> {
  const { error } = await supabase
    .from('donors')
    .update(updatedFields)
    .eq('id', id);

  if (error) {
    console.error(`Failed to update donor ${id} in Supabase:`, error);
    throw error;
  }
}

/**
 * Deletes a donor from the Supabase table.
 */
export async function deleteDonorFromSupabase(id: string): Promise<void> {
  const { error } = await supabase
    .from('donors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Failed to delete donor ${id} from Supabase:`, error);
    throw error;
  }
}

/**
 * Overwrite the whole roster (for restores or bulk operations)
 */
export async function bulkOverwriteDonors(donors: Donor[]): Promise<void> {
  // First clear current table
  const { error: deleteError } = await supabase
    .from('donors')
    .delete()
    .neq('id', 'placeholder-does-not-exist');

  if (deleteError) {
    throw deleteError;
  }

  if (donors.length === 0) return;

  // Bulk insert
  const { error: insertError } = await supabase
    .from('donors')
    .insert(donors);

  if (insertError) {
    throw insertError;
  }
}
