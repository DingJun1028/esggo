'use client';
import React, { useState, useEffect } from 'react';
import { X, History, FileText, Bot, User, CheckCircle, ChevronRight, Link2, ExternalLink } from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandTimeline } from '../brand';

export interface ProvenanceStep {
  id: string;
  type: 'source' | 'processing' | 'review' | 'result';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  details?: string;
  link?: string;
}

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: ProvenanceStep[];
  currentValue?: string;
  unit?: string;
}

export default function ProvenanceDrawer({
  isOpen,
  onClose,
  title,
  steps,
  currentValue,
  unit
}: ProvenanceDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className={`fixed inset-0 z-[2100] transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <aside className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <History size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">T2 Traceable · 數據溯源</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Current Value Card */}
            {currentValue && (
              <div className="bg-[#EBF2FA] rounded-3xl p-6 border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-2">當前採用數值</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#003262] font-mono">{currentValue}</span>
                  <span className="text-sm font-bold text-blue-700/60 uppercase">{unit}</span>
                </div>
              </div>
            )}

            {/* Traceability Timeline */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">溯源路徑 (Provenance Path)</h3>
              <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />
                
                {steps.map((step, idx) => (
                  <div key={step.id} className="relative flex gap-6 pb-10 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${
                      step.type === 'source' ? 'bg-slate-100 text-slate-500' :
                      step.type === 'processing' ? 'bg-purple-50 text-purple-600' :
                      step.type === 'review' ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {step.type === 'source' ? <FileText size={16} /> :
                       step.type === 'processing' ? <Bot size={16} /> :
                       step.type === 'review' ? <User size={16} /> :
                       <CheckCircle size={16} />}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                        <span className="text-[10px] font-medium text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
                      
                      {step.details && (
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 border border-slate-100 mb-3">
                          {step.details}
                        </div>
                      )}
                      
                      {step.link && (
                        <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 transition-colors">
                          <Link2 size={12} /> {step.link} <ExternalLink size={10} className="opacity-50" />
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">Actor: {step.actor}</span>
                        {idx === 0 && <BrandBadge variant="outline" size="xs" className="text-[8px]">ROOT_ORIGIN</BrandBadge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Footer */}
          <footer className="p-6 border-t border-slate-100 bg-slate-50/50">
            <BrandButton variant="primary" fullWidth onClick={onClose}>確認溯源無誤</BrandButton>
            <p className="text-[9px] text-center text-slate-400 mt-4 px-4 leading-relaxed">
              此溯源軌跡由 5T Protocol 自動生成，所有步驟均帶有 SHA-256 Hash 驗證，不可刪改。
            </p>
          </footer>
        </div>
      </aside>
    </div>
  );
}
