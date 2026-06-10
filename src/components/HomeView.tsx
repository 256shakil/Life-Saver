/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ViewType, Campaign, Hospital } from '../types';
import { CAMPAIGNS, HOSPITALS } from '../data';
import { Heart, Users, ShieldAlert, Award, Calendar, Phone, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomeViewProps {
  onViewChange: (view: ViewType) => void;
  totalDonorsCount: number;
}

export default function HomeView({ onViewChange, totalDonorsCount }: HomeViewProps) {
  // Counters for statistics
  const [donorsCount, setDonorsCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);

  useEffect(() => {
    // Basic counter animation on mount
    let startTime = Date.now();
    const duration = 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      
      setDonorsCount(Math.floor(easeProgress * totalDonorsCount));
      setLivesCount(parseFloat((easeProgress * 48.2).toFixed(1)));

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [totalDonorsCount]);

  return (
    <div className="bg-gradient-to-br from-rose-50/40 via-white to-sky-50/10 min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 md:px-16 pt-12 pb-20 flex flex-col items-center text-center overflow-hidden">
        {/* Abstract blur background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl z-10"
        >
          {/* Urgent Need Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold text-xs rounded-full mb-8 border border-red-100 dark:border-red-900/40">
            <span className="material-symbols-outlined text-sm select-none animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            Urgent Need: Type O- Negative
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 font-sans leading-none">
            Every Drop Counts.<br />
            <span className="text-red-700 dark:text-red-500 relative">
              Save a Life Today.
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-red-200 dark:bg-red-900/60 -z-10 rounded-full" />
            </span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the world's most efficient blood donation network. Connecting donors with hospitals and patients in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onViewChange('register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-current" />
              Blood Donor
            </button>
            <button
              onClick={() => onViewChange('find-donors')}
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-red-700 text-red-700 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Patient View
            </button>
          </div>
        </motion.div>
      </section>

      {/* Awareness Banner (Bento Style) */}
      <section className="px-4 md:px-16 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Card (Donation Journey) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-sm group min-h-[320px] lg:min-h-full">
            <img 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBafOej3GTqWCaUtCfz_Y06_BpX9psr0uExw3R7cGdWA0DNyf_BOhcw806xW1IzK3vJkcOUn4aVTCZ17893BPx2hqEjEvqdM-9ky_h1Lz4zOR1pSBOY5UaFvfifJn2p5Fr1PtWGWlHZdcXMLS06eIKASe0cYlNore3zG7BNFw6mLQ4okRktzNPSLMmLP1nUssJ4kGkz1AEZFgcc9zctGgkWlpZhsahEijSJwOV_1c4h-AaGIuZ4Mcj3SsWezcnWPiXo7jNqow2AdUgF" 
              alt="Donation journey"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent flex flex-col justify-end p-8">
              <span className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Spotlight
              </span>
              <h3 className="text-2xl font-bold text-white mb-2 font-sans">
                Your Donation Journey
              </h3>
              <p className="text-sm text-neutral-200 max-w-lg leading-relaxed">
                Giving blood is a simple 15-minute process that can save up to three lives. Start your journey today and make an impact.
              </p>
            </div>
          </div>

          {/* Right Sub-Panels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-sky-600 text-white rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden h-[180px] shadow-sm transform transition-all hover:scale-[1.01]">
              <div className="z-10">
                <h4 className="text-xl font-bold mb-1 font-sans">Real-Time Impact</h4>
                <p className="text-xs text-sky-100 max-w-sm leading-relaxed">
                  Track where your blood goes and how it helps hospitals in your local community. Get live feeds on approvals.
                </p>
              </div>
              <span className="material-symbols-outlined absolute right-4 bottom-2 text-8xl text-sky-500/20 select-none">
                query_stats
              </span>
            </div>

            <div className="bg-emerald-700 text-white rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden h-[180px] shadow-sm transform transition-all hover:scale-[1.01]">
              <div className="z-10">
                <h4 className="text-xl font-bold mb-1 font-sans">Campaigns 2026</h4>
                <p className="text-xs text-emerald-100 max-w-sm leading-relaxed">
                  Join our upcoming community-wide donation drives, earn physical and digital donor badges.
                </p>
              </div>
              <span className="material-symbols-outlined absolute right-4 bottom-2 text-8xl text-emerald-500/20 select-none">
                campaign
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Indicators / Statistics */}
      <section className="bg-neutral-50 dark:bg-neutral-900 px-4 md:px-16 py-16 mt-12 border-y border-neutral-100 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white font-sans">
              Our Community Impact
            </h2>
            <div className="w-16 h-1 bg-red-700 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-red-600 mb-3 select-none">
                groups
              </span>
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-sans">
                {donorsCount > 0 ? (donorsCount / 1000).toFixed(1) : '12'}k
              </span>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Total Donors
              </span>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-red-600 mb-3 select-none">
                favorite
              </span>
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-sans">
                {livesCount}k
              </span>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Lives Saved
              </span>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-red-600 mb-3 select-none">
                local_hospital
              </span>
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-sans">
                340+
              </span>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Partner Hospitals
              </span>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-red-600 mb-3 select-none">
                location_on
              </span>
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-sans">
                12
              </span>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Active Cities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns & Drives section */}
      <section id="campaigns-section" className="px-4 md:px-16 py-16 max-w-7xl mx-auto scrolling-mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-sans">
              Active Community Drives
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Participate in active campaigns to help stock blood for regional medical centers.
            </p>
          </div>
          <button 
            onClick={() => onViewChange('register')}
            className="text-red-700 font-semibold hover:underline text-sm flex items-center gap-1 mt-4 md:mt-0"
          >
            Join Campaigns <Sparkles className="w-4 h-4 text-red-600 inline" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGNS.map((camp) => (
            <div key={camp.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 font-bold px-3 py-1 text-xs rounded-bl-xl border-l border-b border-red-200/50 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-red-600" /> {camp.badge}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 font-sans w-4/5">
                {camp.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
                {camp.description}
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-700 pt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span><strong>Date:</strong> {camp.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span><strong>Location:</strong> {camp.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Hospitals Listing */}
      <section id="hospitals-section" className="px-4 md:px-16 py-12 max-w-7xl mx-auto border-t border-neutral-100 dark:border-neutral-800 scrolling-mt-12">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 font-sans text-center">
          Partner Healthcare Centers
        </h2>
        <p className="text-sm text-neutral-500 text-center mb-10 max-w-lg mx-auto">
          These verified clinical systems have live digital integrations with Life Saver to request urgent blood inventory.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOSPITALS.map((hosp) => (
            <div key={hosp.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans leading-snug">
                    {hosp.name}
                  </h3>
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-[10px] font-bold rounded">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 inline text-neutral-400" /> {hosp.location}
                </p>
              </div>

              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                    Urgent blood request
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hosp.bloodNeeded.map((blood) => (
                      <span key={blood} className="px-2 py-0.5 bg-red-700 text-white font-bold text-xs rounded">
                        {blood}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`tel:${hosp.contact}`}
                  className="w-full py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Hotline
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="px-4 md:px-16 py-12 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-800 to-red-600 p-8 md:p-16 text-center text-white shadow-xl">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 font-sans leading-tight">
              Ready to make a difference?
            </h2>
            <p className="text-sm md:text-base opacity-90 mb-8 leading-relaxed">
              It takes less than 15 minutes to register and start saving lives. Your donation could be the one someone is waiting for.
            </p>
            <button
              onClick={() => onViewChange('register')}
              className="px-8 py-3 bg-white text-red-700 font-bold text-sm md:text-base rounded-lg hover:bg-red-50 hover:shadow-lg active:scale-95 transition-all"
            >
              Register Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
