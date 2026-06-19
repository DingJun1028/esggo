'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { ShieldCheck, Globe } from 'lucide-react';

export default function TripleLayerV2Page() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
            <ShieldCheck size={24} className="text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#003262] tracking-tight">
              Triple Layer Ascension Validation
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              5T Protocol · Full-Stack Verification
            </p>
          </div>
        </header>

        {/* Alliance Hub Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OmniBaseCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-[#003262]">Alliance Hub</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              The Alliance Hub facilitates cross-organizational ESG collaboration
              through secure data sharing and joint audit mechanisms.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Partners Synced:</span>
                <span className="font-mono text-[#003262]">42</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Data Integrity:</span>
                <span className="font-mono text-emerald-600">5T VERIFIED</span>
              </div>
            </div>
          </OmniBaseCard>

          <OmniBaseCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={20} className="text-cyan-600" />
              <h2 className="text-lg font-bold text-[#003262]">5T Verification Matrix</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Truth', 'Goodness', 'Beauty', 'Trust', 'Transfer'].map((layer) => (
                <div
                  key={layer}
                  className={cn(
                    'p-3 rounded-lg border text-center',
                    'border-slate-200 bg-slate-50/50'
                  )}
                >
                  <span className="text-xs font-bold text-slate-600">{layer}</span>
                </div>
              ))}
            </div>
          </OmniBaseCard>
        </section>
      </div>
    </div>
  );
}