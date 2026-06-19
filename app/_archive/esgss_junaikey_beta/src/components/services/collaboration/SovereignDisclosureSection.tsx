import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Gavel, Landmark, ShieldAlert } from 'lucide-react';

interface SovereignDisclosureProps {
  jurisdiction?: string;
  residency?: string;
  legalFramework?: string;
  isDark?: boolean;
}

export const SovereignDisclosureSection: React.FC<SovereignDisclosureProps> = ({
  jurisdiction = 'Taiwan (R.O.C)',
  residency = 'Local Sovereign Vault',
  legalFramework = 'ESGSS-5T Regulation v2.0',
  isDark = true,
}) => {
  return (
    <div
      className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Landmark size={18} className="text-emerald-500" />
        <h3
          className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}
        >
          Sovereign Disclosure
        </h3>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DisclosureItem
          icon={<Globe size={14} />}
          label="Jurisdiction"
          value={jurisdiction}
          isDark={isDark}
        />
        <DisclosureItem
          icon={<ShieldAlert size={14} />}
          label="Data Residency"
          value={residency}
          isDark={isDark}
        />
        <DisclosureItem
          icon={<Gavel size={14} />}
          label="Legal Framework"
          value={legalFramework}
          isDark={isDark}
        />
      </div>

      <p
        className={`mt-4 text-[10px] leading-relaxed italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
      >
        "This data block is anchored in sovereign-compliant infrastructure, ensuring jurisdictional
        integrity and immutable proof of origin under the 5T Protocol."
      </p>
    </div>
  );
};

const DisclosureItem = ({
  icon,
  label,
  value,
  isDark,
}: {
  icon: any;
  label: string;
  value: string;
  isDark: boolean;
}) => (
  <div
    className={`flex flex-col gap-1 p-2 rounded border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}
  >
    <div className="flex items-center gap-1.5 opacity-60">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </div>
    <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      {value}
    </div>
  </div>
);
