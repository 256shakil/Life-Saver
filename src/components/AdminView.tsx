/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Donor } from '../types';
import { BLOOD_GROUPS } from '../data';
import { 
  Users, UserCheck, Trash2, Edit2, Play, Search, TrendingUp, TrendingDown, 
  FileDown, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart2 
} from 'lucide-react';

interface AdminViewProps {
  donors: Donor[];
  onApproveDonor: (id: string) => void;
  onDeleteDonor: (id: string) => void;
  onEditDonor: (id: string, updatedFields: Partial<Donor>) => void;
}

export default function AdminView({ donors, onApproveDonor, onDeleteDonor, onEditDonor }: AdminViewProps) {
  const [subTab, setSubTab] = useState<'dashboard' | 'donors' | 'inventory' | 'requests' | 'settings'>('dashboard');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Editing modal state
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editAvailability, setEditAvailability] = useState<'available' | 'emergency' | 'unavailable'>('available');

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

  // Filter the donors dynamically based on search
  const filteredDonors = donors.filter(donor => {
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

        {/* Dynamic List Table Section */}
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

    </div>
  );
}
