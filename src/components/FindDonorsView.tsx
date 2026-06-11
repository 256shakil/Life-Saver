/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Donor } from '../types';
import { BLOOD_GROUPS, GEOGRAPHY } from '../data';
import { Search, MapPin, CheckCircle, Calendar, ShieldAlert, Ban, Phone, MessageSquare, RotateCcw, ChevronDown, Check, Sparkles } from 'lucide-react';

interface FindDonorsViewProps {
  donors: Donor[];
}

export default function FindDonorsView({ donors }: FindDonorsViewProps) {
  // Filter States
  const [selectedBloodGroups, setSelectedBloodGroups] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'emergency'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Pagination & limits
  const [visibleCount, setVisibleCount] = useState<number>(3);

  // Simulation Modals state
  const [simulationAction, setSimulationAction] = useState<{
    type: 'call' | 'whatsapp';
    donor: Donor;
  } | null>(null);

  // Get dynamic divisions, districts, upazilas based on selection
  const countries = Object.keys(GEOGRAPHY);
  const divisions = selectedCountry && GEOGRAPHY[selectedCountry] ? Object.keys(GEOGRAPHY[selectedCountry].upazilas) : [];
  const districts = selectedCountry && GEOGRAPHY[selectedCountry] ? GEOGRAPHY[selectedCountry].districts : [];
  
  // Available upazilas based on division
  const upazilas = selectedCountry && selectedDivision && GEOGRAPHY[selectedCountry]?.upazilas[selectedDivision] 
    ? GEOGRAPHY[selectedCountry].upazilas[selectedDivision] 
    : [];

  // Reset filter selections when country changes
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedUpazila('');
  };

  // Toggle blood group selection
  const handleBloodGroupToggle = (group: string) => {
    if (selectedBloodGroups.includes(group)) {
      setSelectedBloodGroups(selectedBloodGroups.filter(g => g !== group));
    } else {
      setSelectedBloodGroups([...selectedBloodGroups, group]);
    }
  };

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('donor-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedBloodGroups([]);
    setSelectedCountry('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setAvailabilityFilter('all');
    setSearchQuery('');
  };

  // Quick recommendations trigger
  const handleQuickNearbySearch = (term: string) => {
    setSearchQuery(term);
  };

  // Apply filters over BOTH static/registered donors (Only approved or eligible shown, or all if designated)
  const filteredDonors = donors.filter(donor => {
    // Only search approved donors in general donor view (pending must be approved by admin first)
    if (donor.status !== 'Approved') return false;

    // Search query matches: name, mobile, location fields
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(q);
      const matchMobile = donor.mobile.includes(q);
      const matchEmail = donor.email.toLowerCase().includes(q);
      const matchCountry = donor.country.toLowerCase().includes(q);
      const matchDiv = donor.division.toLowerCase().includes(q);
      const matchDistrict = donor.district.toLowerCase().includes(q);
      const matchUpazila = donor.upazila.toLowerCase().includes(q);
      const matchBlood = donor.bloodGroup.toLowerCase() === q.replace(/\s+/g, '');
      
      const combinedMatch = matchName || matchMobile || matchEmail || matchCountry || matchDiv || matchDistrict || matchUpazila || matchBlood;
      if (!combinedMatch) return false;
    }

    // Blood groups filter
    if (selectedBloodGroups.length > 0) {
      if (!selectedBloodGroups.includes(donor.bloodGroup)) return false;
    }

    // Geo filter
    if (selectedCountry && donor.country !== selectedCountry) return false;
    if (selectedDivision && donor.division !== selectedDivision) return false;
    if (selectedDistrict && donor.district !== selectedDistrict) return false;
    if (selectedUpazila && donor.upazila !== selectedUpazila) return false;

    // Availability filter
    if (availabilityFilter === 'available' && donor.availability !== 'available') return false;
    if (availabilityFilter === 'emergency' && donor.availability !== 'emergency') return false;

    return true;
  });

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900">
      
      {/* Side Filters Sidebar */}
      <aside className="w-full md:w-76 shrink-0 bg-neutral-100 dark:bg-neutral-950/40 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto max-h-[none] md:max-h-[calc(100vh-72px)] sticky top-[72px]">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-red-700 select-none">
              filter_list
            </span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Advanced Filters
            </h2>
          </div>

          {/* Blood Group Grid */}
          <div className="mb-6">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 block font-sans">
              BLOOD GROUP
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map(group => {
                const isSelected = selectedBloodGroups.includes(group);
                return (
                  <button
                    key={group}
                    onClick={() => handleBloodGroupToggle(group)}
                    className={`py-2 rounded-lg font-semibold text-xs border text-center transition-all ${
                      isSelected
                        ? 'bg-red-700 text-white border-red-700 shadow-sm'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="mb-6 space-y-4">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block font-sans">
              LOCATION
            </label>
            
            <div className="space-y-2">
              {/* Select Country */}
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* Select Division based on country */}
              <select
                value={selectedDivision}
                onChange={(e) => { setSelectedDivision(e.target.value); setSelectedUpazila(''); }}
                disabled={!selectedCountry}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none disabled:opacity-50 disabled:bg-neutral-50"
              >
                <option value="">Select Division / State</option>
                {divisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>

              {/* Select District / County can be generic or based on country */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCountry}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none disabled:opacity-50 disabled:bg-neutral-50"
              >
                <option value="">Select District / County</option>
                {districts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>

              {/* Select Upazila / Area based on division */}
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                disabled={!selectedDivision}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none disabled:opacity-50 disabled:bg-neutral-50"
              >
                <option value="">Select Upazila / Town</option>
                {upazilas.map(up => (
                  <option key={up} value={up}>{up}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Radio Option */}
          <div className="mb-6">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 block font-sans">
              AVAILABILITY STATUS
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group text-xs text-neutral-700 dark:text-neutral-300">
                <input
                  type="radio"
                  name="avail-options"
                  checked={availabilityFilter === 'all'}
                  onChange={() => setAvailabilityFilter('all')}
                  className="text-red-700 focus:ring-red-600 w-3.5 h-3.5 border-neutral-300"
                />
                <span className="group-hover:text-red-700 transition-colors">All Donors</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group text-xs text-emerald-700 font-medium">
                <input
                  type="radio"
                  name="avail-options"
                  checked={availabilityFilter === 'available'}
                  onChange={() => setAvailabilityFilter('available')}
                  className="text-red-700 focus:ring-red-600 w-3.5 h-3.5 border-neutral-300"
                />
                <span className="group-hover:underline flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Available Now
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group text-xs text-red-600 font-bold">
                <input
                  type="radio"
                  name="avail-options"
                  checked={availabilityFilter === 'emergency'}
                  onChange={() => setAvailabilityFilter('emergency')}
                  className="text-red-700 focus:ring-red-600 w-3.5 h-3.5 border-neutral-300"
                />
                <span className="group-hover:underline flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Emergency Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Clear Filters Call-to-Action */}
        <button
          onClick={handleClearFilters}
          className="w-full mt-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-xs text-neutral-700 dark:text-neutral-300 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      </aside>

      {/* Main Listing View area */}
      <section className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {/* Search Header Bar */}
        <div className="mb-8 relative max-w-3xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-red-700 transition-colors" />
            <input
              id="donor-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-20 py-3.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950/50 outline-none transition-all placeholder:text-neutral-400"
              placeholder="Search by Name, Mobile, or Location..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center">
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-[10px] text-neutral-400 font-mono rounded border border-neutral-200 dark:border-neutral-600 shadow-sm">
                Ctrl
              </kbd>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-[10px] text-neutral-400 font-mono rounded border border-neutral-200 dark:border-neutral-600 shadow-sm">
                K
              </kbd>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 text-xs items-center pl-1">
            <span className="text-neutral-400">Nearby:</span>
            <button 
              onClick={() => handleQuickNearbySearch('Dhaka Medical')} 
              className="text-red-700 hover:underline hover:text-red-800 font-medium font-sans"
            >
              Dhaka Medical
            </button>
            <span className="text-neutral-300">•</span>
            <button 
              onClick={() => handleQuickNearbySearch('Mirpur-10')} 
              className="text-red-700 hover:underline hover:text-red-800 font-medium font-sans"
            >
              Mirpur-10
            </button>
            <span className="text-neutral-300">•</span>
            <button 
              onClick={() => handleQuickNearbySearch('Uttara Sector 4')} 
              className="text-red-700 hover:underline hover:text-red-800 font-medium font-sans"
            >
              Uttara Sector 4
            </button>
            {searchQuery && (
              <>
                <span className="text-neutral-300">|</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-500 underline font-semibold font-sans hover:text-red-700"
                >
                  Clear search
                </button>
              </>
            )}
          </div>

          {/* Quick Filters Panel inside Finder Column */}
          <div className="mt-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-750 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-750 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-red-700 dark:text-red-500">tune</span>
                Quick Filters Panel
              </span>
              {(selectedBloodGroups.length > 0 || selectedCountry || availabilityFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[10px] text-red-750 dark:text-red-400 hover:underline hover:scale-105 transition-transform"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Blood Group Quick Selection Block */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-sans">
                  Blood Group Type
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map(group => {
                    const isSelected = selectedBloodGroups.includes(group);
                    return (
                      <button
                        type="button"
                        key={group}
                        onClick={() => handleBloodGroupToggle(group)}
                        className={`py-1.5 px-1 rounded-lg font-bold text-xs border text-center transition-all ${
                          isSelected
                            ? 'bg-red-700 dark:bg-red-650 text-white border-red-750 dark:border-red-600 shadow-sm'
                            : 'bg-stone-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Territory Block */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-sans">
                  Location Geography
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none cursor-pointer"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDivision}
                    onChange={(e) => { setSelectedDivision(e.target.value); setSelectedUpazila(''); }}
                    disabled={!selectedCountry}
                    className="w-full bg-stone-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">All Divisions</option>
                    {divisions.map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>
                
                {selectedCountry && (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in pt-1">
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none cursor-pointer"
                    >
                      <option value="">All Districts</option>
                      {districts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>

                    <select
                      value={selectedUpazila}
                      onChange={(e) => setSelectedUpazila(e.target.value)}
                      disabled={!selectedDivision}
                      className="w-full bg-stone-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-700 dark:text-neutral-300 focus:ring-1 focus:ring-red-600 outline-none disabled:opacity-50 cursor-pointer"
                    >
                      <option value="">All Upazilas / areas</option>
                      {upazilas.map(up => (
                        <option key={up} value={up}>{up}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Active filters badges feedback bar */}
            {(selectedBloodGroups.length > 0 || selectedCountry || availabilityFilter !== 'all') && (
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-750 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="font-bold">Active:</span>
                
                {selectedBloodGroups.map(bg => (
                  <span key={bg} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold rounded-lg border border-red-100 dark:border-red-900/30">
                    {bg}
                    <button type="button" onClick={() => handleBloodGroupToggle(bg)} className="hover:text-neutral-900 dark:hover:text-white font-extrabold ml-1">✕</button>
                  </span>
                ))}

                {selectedCountry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-100 dark:bg-neutral-900 text-stone-700 dark:text-neutral-300 font-bold rounded-lg border border-stone-200 dark:border-neutral-700">
                    📍 {selectedUpazila || selectedDistrict || selectedDivision || selectedCountry}
                    <button type="button" onClick={() => handleCountryChange('')} className="hover:text-neutral-900 dark:hover:text-white font-extrabold ml-1">✕</button>
                  </span>
                )}

                {availabilityFilter !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold border ${
                    availabilityFilter === 'available' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-150' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-330 border-amber-150'
                  }`}>
                    ⚡ {availabilityFilter === 'available' ? 'Available' : 'Emergency Only'}
                    <button type="button" onClick={() => setAvailabilityFilter('all')} className="hover:opacity-100 opacity-60 ml-1 font-extrabold">✕</button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Donors Listing Body */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-1.5">
              Verified Donors Listing
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 text-[10px] font-bold rounded-full">
                {filteredDonors.length} Available
              </span>
            </h3>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 p-12 text-center rounded-xl border border-neutral-200/50 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-neutral-300 select-none mb-3">
                search_off
              </span>
              <h4 className="text-base font-bold text-neutral-700 dark:text-neutral-200 font-sans">
                No verified donors found
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                No matches fit your selected combination of filters. Try clearing searches or selecting broad criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredDonors.slice(0, visibleCount).map((donor) => {
              const isAvailable = donor.availability === 'available';
              const isEmergency = donor.availability === 'emergency';
              const isUnavailable = donor.availability === 'unavailable';

              return (
                <div
                  key={donor.id}
                  className={`bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-center hover:shadow-md transition-shadow relative overflow-hidden group ${
                    isUnavailable ? 'opacity-75' : ''
                  }`}
                >
                  {/* Decorative Left Active Accent */}
                  <div className={`absolute top-0 left-0 h-full w-1 scale-y-0 group-hover:scale-y-100 transition-transform ${
                    isUnavailable ? 'bg-neutral-400' : 'bg-red-700'
                  }`} />

                  {/* Profile avatar frame */}
                  <div className={`w-20 h-20 rounded-full overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-700 border-2 ${
                    isAvailable ? 'border-emerald-100' : isEmergency ? 'border-rose-100' : 'border-neutral-300 grayscale'
                  }`}>
                    <img
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={donor.avatarUrl}
                      alt={donor.name}
                    />
                  </div>

                  {/* Profile Info details */}
                  <div className="flex-1 text-center sm:text-left space-y-1 w-full">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className={`text-base font-bold font-sans ${isUnavailable ? 'text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                        {donor.name}
                      </h4>
                      <span className={`font-bold px-2.5 py-0.5 rounded-lg text-xs leading-none ${
                        isUnavailable ? 'bg-neutral-200 text-neutral-600' : 'bg-red-700 text-white shadow-sm'
                      }`}>
                        {donor.bloodGroup}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600/70" />
                      {donor.upazila}, {donor.district}, {donor.country}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-1.5 text-[11px]">
                      {isAvailable && (
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold font-sans">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>AVAILABLE NOW</span>
                        </div>
                      )}
                      {isEmergency && (
                        <div className="flex items-center gap-1 text-red-600 font-bold font-sans">
                          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                          <span>EMERGENCY ONLY</span>
                        </div>
                      )}
                      {isUnavailable && (
                        <div className="flex items-center gap-1 text-neutral-400 font-medium font-sans">
                          <Ban className="w-3.5 h-3.5" />
                          <span>UNAVAILABLE</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Last Donated: {donor.lastDonationDate ? donor.lastDonationDate : 'First Time'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      disabled={isUnavailable}
                      onClick={() => setSimulationAction({ type: 'call', donor })}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 bg-red-700 text-white rounded-lg font-bold text-xs transition-colors hover:bg-red-800 ${
                        isUnavailable ? 'opacity-50 pointer-events-none bg-neutral-400' : ''
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </button>
                    {!isUnavailable && (
                      <button
                        onClick={() => setSimulationAction({ type: 'whatsapp', donor })}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors bg-white dark:bg-neutral-800 font-semibold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp Contact
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Show Load More Button */}
          {filteredDonors.length > visibleCount && (
            <div className="pt-6 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="flex items-center gap-1 font-semibold text-xs text-red-700 bg-white border border-red-200 hover:border-red-600 px-6 py-2.5 rounded-xl hover:bg-neutral-50 shadow-sm transition-all active:scale-95"
              >
                Load More Donors
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Action Simulator Backdrop Modal */}
      {simulationAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 shadow-xl max-w-sm w-full p-6 text-center">
            
            <span className="material-symbols-outlined text-5xl text-red-700 mb-3 block select-none">
              {simulationAction.type === 'call' ? 'contact_phone' : 'sms'}
            </span>

            <h3 className="text-lg font-bold text-neutral-900 font-sans">
              {simulationAction.type === 'call' ? 'Simulating Voice Call' : 'WhatsApp Outreach'}
            </h3>
            <p className="text-xs text-neutral-500 mt-2">
              In production, this handles native communication links. Here is the direct contact payload:
            </p>

            <div className="bg-neutral-50 rounded-xl p-4 my-4 font-mono text-left text-xs leading-relaxed text-neutral-600">
              <div className="font-semibold text-red-700 font-sans text-xs mb-1">
                {simulationAction.donor.name} ({simulationAction.donor.bloodGroup})
              </div>
              <div><strong>Mobile:</strong> {simulationAction.donor.mobile}</div>
              <div><strong>WhatsApp:</strong> {simulationAction.donor.whatsapp || 'N/A'}</div>
              <div><strong>Email:</strong> {simulationAction.donor.email}</div>
              <div><strong>Region:</strong> {simulationAction.donor.upazila}, {simulationAction.donor.district}</div>
            </div>

            <div className="flex gap-2">
              <a
                href={simulationAction.type === 'call' ? `tel:${simulationAction.donor.mobile}` : `https://wa.me/${simulationAction.donor.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSimulationAction(null)}
                className="flex-1 bg-red-700 text-white font-bold py-2 rounded-lg hover:brightness-95 text-xs inline-flex items-center justify-center gap-1"
              >
                Launch Device Native
              </a>
              <button
                onClick={() => setSimulationAction(null)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
