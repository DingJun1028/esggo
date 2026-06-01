import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';

export interface AtomicTabItem {
  id: string;
  label: React.ReactNode;
}

export interface AtomicTabsProps {
  tabs: AtomicTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const AtomicTabs: React.FC<AtomicTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className
}) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_TAB_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Navigation Spec v1.1',
        intent: 'Tabbed View Switcher',
        governanceNode: 'UI_LAYOUT_ENGINE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  return (
    <div 
      className={cn('flex items-center p-1.5 rounded-xl bg-[#020617]/40 backdrop-blur-md border border-white/10 w-fit shadow-inner', className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'relative px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 focus:outline-none flex-1',
              isActive 
                ? 'text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#10b981] rounded-lg -z-10 shadow-[0_2px_10px_rgba(6,182,212,0.3)]" aria-hidden="true" />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
