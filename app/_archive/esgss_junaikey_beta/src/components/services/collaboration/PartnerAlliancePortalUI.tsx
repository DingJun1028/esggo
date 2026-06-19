import React, { useState } from 'react';
import {
  Handshake,
  Globe,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Search,
  Filter,
  Box,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { allianceManager, Partner } from '../../../services/AllianceManager';

export const PartnerAlliancePortalUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [partners] = useState<Partner[]>(() => allianceManager.getPartners());

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Handshake size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Partner Alliance Portal</h2>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Global ESG Ecosystem & Strategic Linkage
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isDark ? 'bg-slate-900 border-white/5 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'} transition-all`}
          >
            Register Alliance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {partners.map(partner => (
          <div
            key={partner.id}
            className={`group p-6 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} relative overflow-hidden flex flex-col`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
              <div
                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] ${
                  partner.status === 'Strategic'
                    ? 'bg-indigo-500 text-white'
                    : partner.status === 'Gold'
                      ? 'bg-primary text-black'
                      : 'bg-slate-500 text-white'
                }`}
              >
                {partner.status}
              </div>
              <div className="flex gap-2">
                <ShieldCheck
                  size={16}
                  className="text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity"
                />
                <Globe
                  size={16}
                  className="text-cyan-400 opacity-30 group-hover:opacity-60 transition-opacity"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold mb-1">{partner.name}</h3>
            <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-6">
              {partner.id}
            </div>

            <div className="flex-1 flex flex-col justify-end gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-[9px] font-black opacity-30 uppercase mb-1">Synergy</div>
                  <div className="text-lg font-black text-cyan-400">{partner.synergyScore}%</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-[9px] font-black opacity-30 uppercase mb-1">Status</div>
                  <div className="text-xs font-bold text-emerald-400">Stable</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1 opacity-30">
                  <Calendar size={12} /> {partner.lastActivity}
                </div>
                <a
                  href={partner.agreementUrl}
                  className="flex items-center gap-1 text-cyan-400 hover:gap-2 transition-all"
                >
                  View Contract <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Ecosystem Growth Card */}
        <div
          className={`p-6 rounded-3xl border border-dashed ${isDark ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-indigo-200 bg-indigo-50/50'} flex flex-col relative overflow-hidden`}
        >
          <div className="relative z-10">
            <TrendingUp size={32} className="text-indigo-400 mb-4" />
            <h3 className="text-md font-bold mb-2">Ecosystem Growth</h3>
            <p className="text-[10px] opacity-60 leading-relaxed mb-4">
              Strategic synergies have improved collective ROI by 14% this quarter. Expansion into
              Southeast Asia clusters recommended.
            </p>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
              Explore Opportunities <ArrowRight size={10} />
            </button>
          </div>
          <Box size={80} className="absolute -bottom-10 -right-10 opacity-5" />
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default PartnerAlliancePortalUI;
