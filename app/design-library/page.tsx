'use client';

import React, { useState } from 'react';
import { 
  Bot, Terminal, Zap, Shield, Globe, Layers, Activity, 
  Search, Bell, Mail, Lock, User, CheckCircle, AlertCircle,
  Info, ArrowUpRight, Download, Share2, Plus, Filter,
  LayoutDashboard, FileText, Database, Code, Settings,
  Moon, Sun, Monitor
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandInput, 
  BrandStatusDot, BrandTabs, BrandCardHeader, BrandAvatar,
  BrandProgress, BrandTable, BrandT5Strip, BrandPageHeader
} from '../../components/brand';
import { useTheme } from '../../contexts/ThemeContext';
import { AppMode, AppFlavor } from '../../lib/theme-store';
import { UniversalCard, UniversalCardHeader } from '../../components/ui/universal/UniversalCard';
import { UniversalButton } from '../../components/ui/universal/UniversalButton';
import { UniversalBadge } from '../../components/ui/universal/UniversalBadge';
import { UniversalInput } from '../../components/ui/universal/UniversalInput';
import { UniversalStatusDot } from '../../components/ui/universal/UniversalStatusDot';
import { UniversalProgress } from '../../components/ui/universal/UniversalProgress';
import { UniversalTable } from '../../components/ui/universal/UniversalTable';
import { UniversalForm } from '../../components/ui/universal/UniversalForm';
import { UniversalChart } from '../../components/ui/universal/UniversalChart';

const COLOR_TOKENS = [
  { name: 'Berkeley Blue', hex: '#003262', desc: 'Primary Base' },
  { name: 'California Gold', hex: '#FDB515', desc: 'Seal Color' },
  { name: 'Stitch Teal', hex: '#009E9D', desc: 'Primary Action' },
  { name: 'Lethal Red', hex: '#FF4D6D', desc: 'Critical Alert' },
  { name: 'Optimal Cyan', hex: '#219EBC', desc: 'Success State' },
  { name: 'Stitch Amber', hex: '#FFB703', desc: 'Warning State' },
];

export default function DesignLibraryPage() {
  const [activeTab, setActiveTab] = useState('universal');
  const [inputText, setInputText] = useState('');
  
  // Universal Theme Context
  const themeContext = useTheme();

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-8 fade-in">
      <BrandPageHeader 
        title="萬能品牌原子庫"
        subtitle="Google Stitch Edition v2.0 · 5T 誠信視覺系統"
        eyebrow="Design System & Component Library"
        icon={<Settings size={32} />}
        actions={
          <BrandBadge variant="gold" size="md" dot>Stitch Verified</BrandBadge>
        }
      />

      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        tabs={[
          { id: 'universal', label: '萬能原子庫 (Universal)', icon: <Globe size={14}/> },
          { id: 'tokens', label: '設計標籤 (Tokens)', icon: <Zap size={14}/> },
          { id: 'atoms', label: '原子組件 (Legacy Atoms)', icon: <Activity size={14}/> },
          { id: 'molecules', label: '複合組件 (Legacy Molecules)', icon: <Layers size={14}/> },
        ]}
      />

      <div className="mt-8">
        {activeTab === 'universal' && (
          <div className="space-y-8 fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                   <BrandCard padding="md">
                      <BrandCardHeader title="Theme Controls" subtitle="Select flavor and mode" />
                      
                      <div className="mt-4 space-y-4">
                         <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Flavor</p>
                            <div className="flex flex-col gap-2">
                               {(['berkeley', 'sustainable', 'minimalist', 'best-practice'] as AppFlavor[]).map((flavor) => (
                                  <button
                                    key={flavor}
                                    onClick={() => themeContext?.setFlavor(flavor)}
                                    className={`text-left px-3 py-2 text-sm rounded-lg font-medium border transition-all ${themeContext?.flavor === flavor ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-transparent border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                  >
                                    {flavor.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </button>
                               ))}
                            </div>
                         </div>
                         
                         <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mode</p>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => themeContext?.setMode('light')}
                                 className={`flex-1 flex justify-center py-2 rounded-lg border transition-all ${themeContext?.mode === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                               >
                                 <Sun size={16} />
                               </button>
                               <button 
                                 onClick={() => themeContext?.setMode('dark')}
                                 className={`flex-1 flex justify-center py-2 rounded-lg border transition-all ${themeContext?.mode === 'dark' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                               >
                                 <Moon size={16} />
                               </button>
                               <button 
                                 onClick={() => themeContext?.setMode('system')}
                                 className={`flex-1 flex justify-center py-2 rounded-lg border transition-all ${themeContext?.mode === 'system' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                               >
                                 <Monitor size={16} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </BrandCard>
                </div>
                
                {/* Showcase */}
                <div className="lg:col-span-3 space-y-6">
                   <UniversalCard>
                      <UniversalCardHeader 
                        title="Universal Preview" 
                        subtitle={`Currently showcasing ${themeContext?.flavor} flavor in ${themeContext?.mode} mode`}
                        action={<UniversalBadge variant="primary" dot>Live Sync</UniversalBadge>}
                      />
                      
                      <div className="p-6 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] mt-4 space-y-8">
                         
                         <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Buttons</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                               <UniversalButton variant="primary">Primary Action</UniversalButton>
                               <UniversalButton variant="secondary">Secondary</UniversalButton>
                               <UniversalButton variant="outline">Outline</UniversalButton>
                               <UniversalButton variant="ghost">Ghost Link</UniversalButton>
                               <UniversalButton variant="primary" loading>Processing</UniversalButton>
                            </div>
                         </div>
                         
                         
                         <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Badges</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                               <UniversalBadge variant="primary">Primary Badge</UniversalBadge>
                               <UniversalBadge variant="secondary">Secondary</UniversalBadge>
                               <UniversalBadge variant="accent">Accent</UniversalBadge>
                               <UniversalBadge variant="outline">Outline</UniversalBadge>
                               <UniversalBadge variant="primary" dot>Active</UniversalBadge>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Inputs & Form</h4>
                               <div className="space-y-4">
                                  <UniversalInput label="Email Address" placeholder="Enter your email..." icon={<Mail size={16} />} />
                                  <UniversalInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={16} />} error="Password must be at least 8 characters" />
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Status & Indicators</h4>
                               <div className="flex flex-wrap gap-6 p-4 border border-[var(--theme-border)] rounded-lg bg-[var(--theme-base)]">
                                  <UniversalStatusDot status="active" label="System Online" pulse />
                                  <UniversalStatusDot status="warning" label="High Load" />
                                  <UniversalStatusDot status="error" label="Failing" pulse />
                                  <UniversalStatusDot status="inactive" label="Offline" />
                               </div>
                               <div className="mt-4">
                                  <UniversalProgress value={78} label="Migration Progress" />
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Data Table (Theme Adaptive)</h4>
                            <UniversalTable 
                              compact
                              columns={[
                                { key: 'name', label: 'Atomic Component' },
                                { key: 'type', label: 'Type', render: (v) => <UniversalBadge variant="outline">{v}</UniversalBadge> },
                                { key: 'status', label: 'Status', render: (v) => <UniversalStatusDot status={v === 'Stable' ? 'active' : 'warning'} label={v} size="sm" /> }
                              ]}
                              data={[
                                { id: 1, name: 'UniversalButton', type: 'Action', status: 'Stable' },
                                { id: 2, name: 'UniversalCard', type: 'Layout', status: 'Stable' },
                                { id: 3, name: 'UniversalTable', type: 'Data', status: 'Beta' },
                              ]}
                            />
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text-muted)]">Form & Chart (ZKP Visualization)</h4>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                               <UniversalForm 
                                 fields={[
                                   { name: 'evidence', label: 'Evidence Input', type: 'text', placeholder: 'Upload or type evidence...' },
                                   { name: 'category', label: 'ZKP Category', type: 'enum', options: ['Environment', 'Social', 'Governance'] }
                                 ]}
                                 onSubmit={(d) => console.log('Submitted', d)}
                                 submitLabel="Seal with ZKP"
                               />
                               
                               <UniversalChart 
                                 type="pie"
                                 dataKey="value"
                                 xAxisKey="name"
                                 title="ZKP Sealed Status"
                                 data={[
                                   { name: 'Sealed', value: 75 },
                                   { name: 'Pending', value: 15 },
                                   { name: 'Failed', value: 10 }
                                 ]}
                               />
                            </div>
                         </div>
                         
                      </div>
                   </UniversalCard>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <UniversalCard variant="glass">
                         <UniversalCardHeader title="Glass Card" subtitle="Backdrop blur variant" />
                         <p className="text-sm text-[var(--theme-text-muted)] mt-2">
                           This card automatically adapts its glassmorphism effect based on the chosen theme and light/dark mode.
                         </p>
                      </UniversalCard>
                      <UniversalCard variant="outline">
                         <UniversalCardHeader title="Outline Card" subtitle="Transparent background" />
                         <p className="text-sm text-[var(--theme-text-muted)] mt-2">
                           Provides clear boundaries without background fills.
                         </p>
                      </UniversalCard>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {COLOR_TOKENS.map(color => (
              <BrandCard key={color.name} padding="md" className="group">
                <div 
                  className="w-full h-24 rounded-lg mb-4 shadow-inner group-hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex justify-between items-end">
                   <div>
                      <h4 className="font-bold text-slate-800">{color.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{color.hex}</p>
                   </div>
                   <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">{color.desc}</p>
                </div>
              </BrandCard>
            ))}
          </div>
        )}

        {activeTab === 'atoms' && (
          <div className="space-y-12 fade-in">
            {/* Buttons */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <BrandButton variant="primary">Primary Button</BrandButton>
                <BrandButton variant="secondary">Secondary Button</BrandButton>
                <BrandButton variant="secondary">Outline Button</BrandButton>
                <BrandButton variant="ghost">Ghost Button</BrandButton>
                <BrandButton variant="primary" loading>Loading</BrandButton>
                <BrandButton variant="primary" disabled>Disabled</BrandButton>
              </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Badges</h3>
              <div className="flex flex-wrap gap-4">
                <BrandBadge variant="default">Default</BrandBadge>
                <BrandBadge variant="blue">Blue</BrandBadge>
                <BrandBadge variant="gold">Gold</BrandBadge>
                <BrandBadge variant="success" dot>Success</BrandBadge>
                <BrandBadge variant="warning" dot>Warning</BrandBadge>
                <BrandBadge variant="error" dot>Error</BrandBadge>
                <BrandBadge variant="outline">Outline</BrandBadge>
              </div>
            </section>

            {/* Inputs */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Inputs (Stitch Minimalist)</h3>
              <div className="max-w-md space-y-4">
                <BrandInput 
                  label="Standard Input" 
                  placeholder="Focus for Teal border..." 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <BrandInput 
                  label="With Icon" 
                  icon={<Search size={16}/>}
                  placeholder="Searching..." 
                />
                <BrandInput 
                  label="Error State" 
                  error="This field is required according to GRI 305"
                  defaultValue="Invalid data"
                />
              </div>
            </section>

            {/* Status Dots */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Status Dots</h3>
              <div className="flex flex-wrap gap-8">
                <BrandStatusDot status="active" label="Active / Online" pulse />
                <BrandStatusDot status="inactive" label="Inactive / Offline" />
                <BrandStatusDot status="warning" label="Warning" pulse />
                <BrandStatusDot status="error" label="Critical Error" pulse />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'molecules' && (
          <div className="space-y-8 fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BrandCard padding="lg">
                   <BrandCardHeader 
                     title="Stitch Card Header" 
                     subtitle="Information density is key"
                     action={<BrandButton variant="ghost" size="sm">Action</BrandButton>}
                   />
                   <div className="mt-6 space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Cards follow the Liquid Glass principle: 80% white opacity with 12px backdrop blur.
                      </p>
                      <BrandProgress value={65} color="blue" label="Implementation Progress" />
                   </div>
                </BrandCard>

                <BrandCard padding="lg" className="bg-[#003262] text-white">
                   <BrandCardHeader title="Dark Context Card" subtitle="Berkeley Blue Base" />
                   <div className="mt-6">
                      <BrandT5Strip items={['T1','T2','T3','T4','T5'].map(c => ({ code: c as any, active: true }))} />
                   </div>
                </BrandCard>
             </div>

             <BrandCard padding="none">
                <BrandCardHeader title="Atomic Data Table" subtitle="Bento-style data presentation" />
                <div className="mt-4">
                   <BrandTable 
                     columns={[
                       { key: 'name', label: 'Component', render: (v) => <span className="font-bold text-slate-800">{v}</span> },
                       { key: 'type', label: 'Category', render: (v) => <BrandBadge variant="outline" size="xs">{v}</BrandBadge> },
                       { key: 'status', label: 'Stitch Status', render: (v) => (
                         <BrandStatusDot status="active" label={v} size="sm" />
                       )}
                     ]}
                     data={[
                       { name: 'BrandButton', type: 'Atom', status: 'Verified' },
                       { name: 'BrandCard', type: 'Molecule', status: 'Verified' },
                       { name: 'BrandT5Strip', type: 'Organism', status: 'Sealed' },
                     ]}
                   />
                </div>
             </BrandCard>
          </div>
        )}
      </div>
    </div>
  );
}
