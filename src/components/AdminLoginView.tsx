/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onGoHome: () => void;
}

export default function AdminLoginView({ onLoginSuccess, onGoHome }: AdminLoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate subtle server processing time for immersive professional feedback
    setTimeout(() => {
      const fixedEmail = '256shakil@gmail.com';
      const fixedPassword = 'shakiladmin256';

      if (email.trim().toLowerCase() === fixedEmail.toLowerCase() && password === fixedPassword) {
        onLoginSuccess();
      } else {
        setError('Invalid Admin credentials. Please verify your email and passkey.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-stone-50 dark:bg-neutral-950 font-sans transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        {/* Subtle decorative top border */}
        <div className="h-1.5 bg-red-700 dark:bg-red-600 w-full" />
        
        <div className="p-8">
          {/* Header area with shield check badge */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-xl flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                System Administration
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                Access is restricted to authorized personnel. Please enter your terminal clearance keys.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-pulse">
              <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                gpp_bad
              </span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email"
                className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block"
              >
                Clearance Email (User ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="256shakil@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all text-neutral-800 dark:text-white placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-pass"
                className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block"
              >
                Security Access Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password keys"
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all text-neutral-800 dark:text-white placeholder-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign in Submission Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unlocking Vault...</span>
                </>
              ) : (
                'Authenticate Clearance'
              )}
            </button>
          </form>

          {/* Quick Helper Credentials Reminder Box */}
          <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest text-center mb-2">
              Cleared Authorization Keys
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">User ID:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-200 select-all">256shakil@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Access Key:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-200 select-all">shakiladmin256</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link bottom tray */}
        <div className="bg-neutral-50 dark:bg-neutral-850 px-8 py-4 flex justify-center border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-300 font-semibold cursor-pointer select-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
}
