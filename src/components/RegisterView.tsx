/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Donor, ViewType } from '../types';
import { BLOOD_GROUPS, GENDERS, HEALTH_STATUSES } from '../data';
import { PersonStanding, Contact, Locate, HeartHandshake, KeyRound, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface RegisterViewProps {
  onRegisterDonor: (newDonor: Omit<Donor, 'id' | 'createdAt'>) => void;
  onViewChange: (view: ViewType) => void;
}

// Quick selection of preloaded diverse premium healthcare avatars for simulation
const SIMULATED_AVATARS = [
  { name: 'Dr. Sarah', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSj3t72E90Pyaar1hG6sZ2Wqz2JZhtOpS7vxSVsdwwQbj-FHCmqVFW9W_4B-7mTljk-dnMi-D8ZLGZjcBCiH2OZ_IaNcy8eD7ZFfq2pxwQPIk72HogEWrnQze5t_FLaufCtEXvYP21en7SVlpIF8E2W7SGo2F9p9nXS-eLAHxRBZPOusQNxMX4oKE4uSmQJ7tMA5zGsgMbwLal55g8aNPfrZYWYRPiRQ4OL_r1j5HtaYhm_XASkDnjBCjc3Y6hrobTMcNyryx_q9pl' },
  { name: 'Ariful', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4qxJ2J9UggllSz7HiATn-QW2jMKqGNxXK8sxAdiOkPdnWgDVk0Ro1aqLCrkz9BrIFGXew407wQs6y5aOqZMXT5DseV6efHGMV9J2JUSVSWeRloGR6nXGx8IYx00hKUcpR3uLAUyuzMTwkfMhNQLr7BVfPPd6ByB5uImr8gOupOGokgdjY_IVbso3j0aFYq3xwe34HvLINgwFMSWslRmmpX8l4L6CH0sjktpE1prPVcRNQJ2ANSuZ3Af06LGJDWSdSpgewEaAm6dd1' },
  { name: 'Elena', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTHDsiGZ0HOZ4983yb_sS6NyBFBtVG94I2UU2xQVeJZhDK5VKE-Zr34UgqSvxKe491y4iL8ePc5fisQcOHdUCsEqMROgzhXfUf_0xnu0wSAS-eefqiCQ6EmtxZT2Fc7-ycbdb56shnLD4Ag8XwaX1NRFSfEJKa3PASwJShQ3hQIRwiqohGsaMh9QWZiVz-f402-o6YaijdbNd5wozhgQwPaNzzlIUVCy-Q0hSGVaqpXIuwBj8lx2n0aZIuYHuzlQtPF-xtiUoMv7VN' },
  { name: 'Nusrat', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy1niqMJ4sAtUUDYd2-j-6RJ2JoaOViJ91352pWL_cghBBAAQDyX4isT07IZeap7lKDYwfoab2wLxv3Vi6oUpVbzwmGaOBnXd_hT9dxCI7FFeNLzXDQIXfK6xogD3_PDaE3jbURh3asCd81x2g4AhIFkLPrQE6GGaiKRrvSyy5_TCCD7HcHos39H5xC_N6Q1QyCjw5cFrnoVxcdBqKwfPXUwHWLpn415jHuInpdF2WZ4MSFV5nwvKjgSmCaHmRtjTwfJvvM-NxRu05' },
  { name: 'Kamrul', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZyIP6R_rwNJE0drrpPzxRyQLI8-CcwNDQDmWnslNvnIFiTjBWaYGjGlk3AeqHSXi_QNRVpmSI5-xZDv08d_XrMkG17PQ04OhgeXd1--ft4HWHCIqMj-n25TRpyF92So1zznZfF3hqgY9rwpEXDsLUUC3N32tH40PwKIze-9gjosmmbbin5mETKN60T63fj6GW4LV4qlDpd24-Z_GZ7UPA8WQ4UW4NVtH8Q4S0aQpt2j1YtnYcDPj7A-A9lK6FTS6zIKNbkO4kuPrf' },
  { name: 'Marcus', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEj-hUuVp4_dPMZDp3gQMRQ-XPL3NgQdoOF7kBwxHxiKeJFswPxUS-V4SGakk6rOCSthb_qchJPbEDCuovC0GWvERnU09YMF2HLcQfhiX_KvUupJbIorEffBspnNpcFJg9H8BFY1oLo__Oia4PenN8pD9CeeLsuz07UrFJyVT5PpSA5B45OZJ-I927b5ivnq0joX3Z77aiaEWdeCNu8Fn7y0bJP_FvFVwu8f4-CnWRHJhUY5U4ro6hFkMQ4igv1jKxJq2G1lja023s' },
];

export default function RegisterView({ onRegisterDonor, onViewChange }: RegisterViewProps) {
  // Form states matching Donor payload
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [dob, setDob] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  const [country, setCountry] = useState('United States');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [address, setAddress] = useState('');

  const [lastDonationDate, setLastDonationDate] = useState('');
  const [emergency, setEmergency] = useState<'yes' | 'no' | ''>('');
  const [weight, setWeight] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy & Fit');

  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(SIMULATED_AVATARS[0].url);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI feedback states
  const [formError, setFormError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setFormError('');

    // Custom validations
    if (!selectedBloodGroup) {
      setFormError('Please select your blood group from the chips grid.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify your entry.');
      return;
    }

    // Prepare new donor payload
    const finalAvailability = emergency === 'yes' ? 'emergency' : 'available';

    onRegisterDonor({
      name: fullName,
      fatherName,
      gender,
      dob,
      bloodGroup: selectedBloodGroup,
      mobile,
      whatsapp,
      email,
      country,
      division,
      district,
      upazila,
      address,
      lastDonationDate,
      availability: finalAvailability as 'available' | 'emergency',
      weight: weight ? parseInt(weight) : undefined,
      healthStatus,
      avatarUrl: selectedAvatarUrl,
      status: 'Pending', // New registrations go into "Pending" status for Admin Panel approval simulation!
    });

    setRegisteredName(fullName);
    setRegSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form inputs
  const handleReset = () => {
    setFullName('');
    setFatherName('');
    setGender('');
    setDob('');
    setSelectedBloodGroup('');
    setMobile('');
    setWhatsapp('');
    setEmail('');
    setDivision('');
    setDistrict('');
    setUpazila('');
    setAddress('');
    setLastDonationDate('');
    setEmergency('');
    setWeight('');
    setHealthStatus('Healthy & Fit');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  };

  if (regSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl font-black select-none animate-bounce">
            verified
          </span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans mb-3">
          Congratulations, {registeredName}!
        </h1>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto mb-8">
          Your donor profile is registered successfully! As a security protocol, your profile has been queued as <strong className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Pending</strong> for review.
        </p>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm text-left max-w-md mx-auto mb-10 leading-relaxed space-y-3">
          <div className="font-semibold text-xs text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
            Profile Status Overview
          </div>
          <div className="text-xs text-neutral-600 space-y-1">
            <p>• <strong>Name:</strong> {registeredName}</p>
            <p>• <strong>Blood Unit:</strong> {selectedBloodGroup}</p>
            <p>• <strong>Status:</strong> Pending Admin Approval</p>
            <p>• <strong>Location:</strong> {upazila || 'N/A'}, {district || 'N/A'}</p>
          </div>
          <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-150">
            💡 <strong>Simulation tip:</strong> Head over to the <strong>Admin Panel</strong> in the top header and click <strong>Approve</strong> next to your name to change your status to <strong>Approved</strong>. Once approved, you will immediately appear in the <strong>Find Donors</strong> directory search results!
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <button
            onClick={() => onViewChange('admin')}
            className="px-6 py-3 bg-red-700 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Go to Admin Panel
          </button>
          <button
            onClick={() => {
              setRegSuccess(false);
              handleReset();
            }}
            className="px-6 py-3 border border-neutral-300 rounded-xl text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-all"
          >
            Register Another Donor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 dark:text-red-500 mb-4 font-sans tracking-tight">
          Be a Hero, Save a Life
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Complete your donor profile today. Your contribution can provide the gift of life to someone in urgent need.
        </p>
      </div>

      {formError && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-2.5 font-medium text-xs leading-normal animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        
        {/* Section 1: Personal Details */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 md:p-8 hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-sans font-bold">
              <PersonStanding className="w-5 h-5 text-red-700" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Personal Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="fullName">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="fatherName">
                Father's Name
              </label>
              <input
                id="fatherName"
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="Michael Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="gender">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                id="gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-700 focus:ring-2 focus:ring-red-100 outline-none"
              >
                <option value="">Select Gender</option>
                {GENDERS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="dob">
                Date of Birth <span className="text-red-600">*</span>
              </label>
              <input
                id="dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
            </div>

            {/* Blood Group Chips Select Grid */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                Blood Group <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((group) => {
                  const isSelected = selectedBloodGroup === group;
                  return (
                    <button
                      type="button"
                      key={group}
                      onClick={() => setSelectedBloodGroup(group)}
                      className={`py-2 px-1 border rounded-lg text-xs font-bold text-center transition-all ${
                        isSelected
                          ? 'bg-red-100 text-red-700 border-red-700 shadow-sm'
                          : 'bg-white dark:bg-neutral-850 text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 md:p-8 hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-sans font-bold">
              <Contact className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="mobile">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="whatsapp">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="email">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location Details */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 md:p-8 hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-sans font-bold">
              <Locate className="w-5 h-5 text-teal-700" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Location Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="country">
                Country <span className="text-red-600">*</span>
              </label>
              <select
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-700 focus:ring-2 focus:ring-red-100 outline-none"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="division">
                Division / State <span className="text-red-600">*</span>
              </label>
              <input
                id="division"
                type="text"
                required
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="California"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="district">
                District / County <span className="text-red-600">*</span>
              </label>
              <input
                id="district"
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="Los Angeles"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="upazila">
                Upazila / Town <span className="text-red-600">*</span>
              </label>
              <input
                id="upazila"
                type="text"
                required
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="Westwood"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="address">
              Full Residential Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
              placeholder="123 Clinical Way, Apt 4B, Westwood, CA"
            />
          </div>
        </div>

        {/* Section 4: Donation & Health */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 md:p-8 hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-sans font-bold">
              <HeartHandshake className="w-5 h-5 text-red-700" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Donation & Health
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="lastDonation">
                Last Donation Date
              </label>
              <input
                id="lastDonation"
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
              <span className="text-[10px] text-neutral-400 block pt-0.5">Leave blank if this is your first time.</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                Available for Emergency? <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-neutral-700">
                  <input
                    type="radio"
                    name="emergencyChoice"
                    required
                    checked={emergency === 'yes'}
                    onChange={() => setEmergency('yes')}
                    className="text-red-700 focus:ring-red-600 w-4 h-4 border-neutral-300"
                  />
                  <span>Yes, anytime</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-neutral-700">
                  <input
                    type="radio"
                    name="emergencyChoice"
                    required
                    checked={emergency === 'no'}
                    onChange={() => setEmergency('no')}
                    className="text-red-700 focus:ring-red-600 w-4 h-4 border-neutral-300"
                  />
                  <span>No, call ahead</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="weight_kg">
                Body Weight (kg)
              </label>
              <input
                id="weight_kg"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="healthStatus">
                General Health Status
              </label>
              <select
                id="healthStatus"
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-700 focus:ring-2 focus:ring-red-100 outline-none"
              >
                {HEALTH_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Account & Security */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 md:p-8 hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-sans font-bold">
              <KeyRound className="w-5 h-5 text-stone-700" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
              Account & Security
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Custom Interactive Avatar Picker for Simulated Upload */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 bg-neutral-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-250/20">
              <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-red-700 shadow-sm bg-neutral-200">
                <img referrerPolicy="no-referrer" src={selectedAvatarUrl} className="w-full h-full object-cover" alt="Selected placeholder profile" />
              </div>

              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 block font-sans">
                  Choose Simulation Photo Profile
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Toggle between preloaded avatars to simulate your card representation perfectly in the verified listing:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SIMULATED_AVATARS.map((avatar, idx) => {
                    const isSelected = selectedAvatarUrl === avatar.url;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedAvatarUrl(avatar.url)}
                        className={`text-[10px] px-2 py-1 rounded border font-semibold transition-all ${
                          isSelected
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {avatar.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="password">
                Create Password <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block" htmlFor="confirmPassword">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 outline-none"
                placeholder="••••••••"
              />
            </div>

          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current text-white inline shrink-0" />
            Register as Donor
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="sm:w-32 py-3.5 border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 font-semibold rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Reset Form
          </button>
        </div>

      </form>

      {/* Footer Legal Terms */}
      <p className="max-w-4xl mx-auto text-center mt-8 text-xs text-neutral-400">
        By registering, you agree to our <a href="#" className="text-red-700 hover:underline">Privacy Policy</a> and <a href="#" className="text-red-700 hover:underline">Terms of Service</a>. Your data is encrypted and handled only by certified healthcare systems.
      </p>

    </div>
  );
}
