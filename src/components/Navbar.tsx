/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-16 py-4 w-full bg-white dark:bg-neutral-900 border-b border-rose-100 dark:border-neutral-800 shadow-sm transition-all duration-300">
      <div 
        className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        onClick={() => onViewChange('home')}
      >
        <span className="text-xl md:text-2xl font-black tracking-tight text-red-700 dark:text-red-500 flex items-center gap-1.5 font-sans">
          <span className="material-symbols-outlined text-red-600 select-none animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          Life Saver
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={() => onViewChange('find-donors')}
          className={`font-semibold text-sm transition-all pb-1 border-b-2 ${
            currentView === 'find-donors'
              ? 'text-red-700 border-red-700 dark:text-red-500 dark:border-red-500'
              : 'text-neutral-600 hover:text-red-700 border-transparent dark:text-neutral-400 dark:hover:text-red-400'
          }`}
        >
          Find Donors
        </button>
        <button
          onClick={() => onViewChange('home')}
          className={`font-semibold text-sm transition-all pb-1 border-b-2 ${
            currentView === 'home'
              ? 'text-red-700 border-red-700 dark:text-red-500 dark:border-red-500'
              : 'text-neutral-600 hover:text-red-700 border-transparent dark:text-neutral-400 dark:hover:text-red-400'
          }`}
        >
          About & Impact
        </button>
        
        {/* Helper quick anchors */}
        <a 
          href="#hospitals-section" 
          onClick={(e) => {
            onViewChange('home');
            setTimeout(() => {
              document.getElementById('hospitals-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="font-semibold text-sm text-neutral-600 hover:text-red-700 dark:text-neutral-400 dark:hover:text-red-400 pb-1 border-b-2 border-transparent transition-all"
        >
          Hospitals
        </a>
        <a 
          href="#campaigns-section"
          onClick={(e) => {
            onViewChange('home');
            setTimeout(() => {
              document.getElementById('campaigns-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="font-semibold text-sm text-neutral-600 hover:text-red-700 dark:text-neutral-400 dark:hover:text-red-400 pb-1 border-b-2 border-transparent transition-all"
        >
          Campaigns
        </a>
      </div>

      {/* Right Side buttons */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onViewChange('admin')}
          className={`px-4 py-2 font-semibold text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-sans ${
            currentView === 'admin' 
              ? 'bg-neutral-100 text-red-700 border-red-200' 
              : 'text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <span className="hidden sm:inline">Admin Panel</span>
          <span className="sm:hidden">Admin</span>
        </button>

        <button 
          onClick={() => onViewChange('register')}
          className={`px-4 py-2 font-semibold text-xs text-white rounded-lg active:scale-95 transition-all shadow-sm font-sans ${
            currentView === 'register'
              ? 'bg-red-800 ring-2 ring-red-400'
              : 'bg-red-700 hover:bg-red-800'
          }`}
        >
          Register as Donor
        </button>
      </div>
    </nav>
  );
}
