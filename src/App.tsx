/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Donor, ViewType } from './types';
import { INITIAL_DONORS } from './data';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import FindDonorsView from './components/FindDonorsView';
import RegisterView from './components/RegisterView';
import AdminView from './components/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);

  // Callback to register a new donor
  const handleRegisterDonor = (newDonor: Omit<Donor, 'id' | 'createdAt'>) => {
    const finalNewDonor: Donor = {
      ...newDonor,
      id: `donor-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDonors((prev) => [finalNewDonor, ...prev]);
  };

  // Callback to approve a pending donor in Admin Panel
  const handleApproveDonor = (id: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Approved' as const } : d))
    );
  };

  // Callback to delete a donor in Admin Panel
  const handleDeleteDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
  };

  // Callback to edit donor details
  const handleEditDonor = (id: string, updatedFields: Partial<Donor>) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-800">
      {/* Top sticky navigation header */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

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
          <AdminView
            donors={donors}
            onApproveDonor={handleApproveDonor}
            onDeleteDonor={handleDeleteDonor}
            onEditDonor={handleEditDonor}
          />
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

            <div className="text-xs space-y-1.5 md:text-right">
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
