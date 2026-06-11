/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Donor, ViewType } from './types';
import { INITIAL_DONORS } from './data';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import FindDonorsView from './components/FindDonorsView';
import RegisterView from './components/RegisterView';
import AdminView from './components/AdminView';
import AdminLoginView from './components/AdminLoginView';
import { 
  fetchDonorsFromSupabase, 
  saveDonorToSupabase, 
  updateDonorInSupabase, 
  deleteDonorFromSupabase,
  bulkOverwriteDonors
} from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [supabaseStatus, setSupabaseStatus] = useState<{ type: 'success' | 'error' | 'pending'; message: string | null }>({
    type: 'pending',
    message: 'Synchronizing with Supabase database backend...'
  });

  // Fetch live sync database records from Supabase on launch
  useEffect(() => {
    async function loadInitialData() {
      try {
        const fetched = await fetchDonorsFromSupabase();
        if (fetched.length === 0) {
          // Table exists but has no records. Seed with beautiful high-quality INITIAL_DONORS
          console.info('Supabase database is empty. Auto-seeding initial blood donor directory...');
          for (const item of INITIAL_DONORS) {
            await saveDonorToSupabase(item);
          }
          setDonors(INITIAL_DONORS);
          setSupabaseStatus({
            type: 'success',
            message: 'Successfully connected and auto-seeded first-time default records to Supabase!'
          });
        } else {
          setDonors(fetched);
          setSupabaseStatus({
            type: 'success',
            message: `Connected to Supabase! Successfully synchronized ${fetched.length} live records.`
          });
        }
      } catch (err: any) {
        console.warn('Supabase not fully setup yet or missing table. Defaulting to local repository.', err);
        setDonors(INITIAL_DONORS);
        setSupabaseStatus({
          type: 'error',
          message: 'Supabase table not detected. App running safely in offline mode. Paste SQL schema in Supabase dashboard to activate live synchronization!'
        });
      }
    }
    loadInitialData();
  }, []);

  // Callback to register a new donor (inserts directly to Supabase)
  const handleRegisterDonor = async (newDonor: Omit<Donor, 'id' | 'createdAt'>) => {
    const finalNewDonor: Donor = {
      ...newDonor,
      id: `donor-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update React Client state instantly
    setDonors((prev) => [finalNewDonor, ...prev]);

    try {
      await saveDonorToSupabase(finalNewDonor);
      setSupabaseStatus({
        type: 'success',
        message: `Donor "${finalNewDonor.name}" registered and uploaded live to Supabase!`
      });
    } catch (err) {
      console.error('Supabase write failure:', err);
    }
  };

  // Callback to approve a pending donor in Admin Panel
  const handleApproveDonor = async (id: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Approved' as const } : d))
    );

    try {
      await updateDonorInSupabase(id, { status: 'Approved' });
      setSupabaseStatus({
        type: 'success',
        message: 'Donor listing status approved live on Supabase!'
      });
    } catch (err) {
      console.error('Supabase update failure:', err);
    }
  };

  // Callback to delete a donor in Admin Panel
  const handleDeleteDonor = async (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));

    try {
      await deleteDonorFromSupabase(id);
      setSupabaseStatus({
        type: 'success',
        message: 'Donor listing deleted successfully from Supabase!'
      });
    } catch (err) {
      console.error('Supabase delete failure:', err);
    }
  };

  // Callback to edit donor details
  const handleEditDonor = async (id: string, updatedFields: Partial<Donor>) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );

    try {
      await updateDonorInSupabase(id, updatedFields);
    } catch (err) {
      console.error('Supabase update failure:', err);
    }
  };

  // Callback for restoring bulk directories
  const handleRestoreDonors = async (restored: Donor[]) => {
    setDonors(restored);
    setSupabaseStatus({
      type: 'pending',
      message: 'Uploading restored database package to Supabase...'
    });
    try {
      await bulkOverwriteDonors(restored);
      setSupabaseStatus({
        type: 'success',
        message: `Successfully synchronized restored list of ${restored.length} donors to your Supabase backend!`
      });
    } catch (err) {
      console.error('Supabase restore failed:', err);
      setSupabaseStatus({
        type: 'error',
        message: 'Could not upload restored directory package to Supabase.'
      });
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-800">
      {/* Top sticky navigation header */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {/* Supabase connection alert status bar banner (authenticated admin only) */}
      {currentView === 'admin' && isAdminAuthenticated && supabaseStatus.message && (
        <div className={`text-[11px] font-semibold text-center py-2 px-4 shadow-inner border-b transition-all flex items-center justify-center gap-2 select-none duration-300 animate-fade-in ${
          supabaseStatus.type === 'success'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
            : supabaseStatus.type === 'error'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-stone-50 border-stone-150 text-neutral-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
            supabaseStatus.type === 'success' ? 'bg-emerald-600 animate-pulse' : supabaseStatus.type === 'error' ? 'bg-amber-600' : 'bg-neutral-500 animate-spin'
          }`} />
          <span>{supabaseStatus.message}</span>
          <button 
            onClick={() => setSupabaseStatus({ ...supabaseStatus, message: null })}
            className="hover:text-black font-extrabold focus:outline-hidden hover:scale-110 ml-2 cursor-pointer transition-transform text-[11px]"
            title="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main viewport canvas */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView onViewChange={setCurrentView} totalDonorsCount={donors.length} />
        )}
        
        {currentView === 'find-donors' && (
          <FindDonorsView donors={donors} />
        )}

        {currentView === 'register' && (
          <RegisterView onRegisterDonor={handleRegisterDonor} onViewChange={setCurrentView} />
        )}

        {currentView === 'admin' && (
          isAdminAuthenticated ? (
            <AdminView
              donors={donors}
              onApproveDonor={handleApproveDonor}
              onDeleteDonor={handleDeleteDonor}
              onEditDonor={handleEditDonor}
              onRestoreDonors={handleRestoreDonors}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginView 
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                sessionStorage.setItem('isAdminAuthenticated', 'true');
              }}
              onGoHome={() => setCurrentView('home')}
            />
          )
        )}
      </div>

      {/* Footer (Hidden on Admin screen to preserve its custom desktop dashboard layout space) */}
      {currentView !== 'admin' && (
        <footer className="bg-neutral-900 text-neutral-400 py-12 px-4 md:px-16 border-t border-neutral-800 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <span className="text-lg font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-red-600 font-bold select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                Life Saver
              </span>
              <p className="text-xs text-neutral-500 mt-2 max-w-sm">
                A state-of-the-art decentralized donor synchronization network helping save local patient lives.
              </p>
            </div>

            <div className="text-xs space-y-2 md:text-right flex flex-col md:items-end">
              <button 
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 border border-neutral-750 hover:border-red-500 text-neutral-300 hover:text-red-400 text-[11px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                Oversight Admin Console
              </button>
              <p>© 2026 Life Saver Network. All rights reserved.</p>
              <p className="text-neutral-500">
                Created with precision. Styled using Tailwind CSS v4 & Lucide Icons.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
