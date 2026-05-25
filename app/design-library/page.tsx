'use client';

import React, { useState } from 'react';
import { 
  Bot, Terminal, Zap, Shield, Globe, Layers, Activity, 
  Search, Bell, Mail, Lock, User, CheckCircle, AlertCircle,
  Info, ArrowUpRight, Download, Share2, Plus, Filter,
  LayoutDashboard, FileText, Database, Code, Settings
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandInput, 
  BrandStatusDot, BrandTabs, BrandCardHeader, BrandAvatar,
  BrandProgress, BrandTable, BrandT5Strip, BrandPageHeader
} from '../../components/brand';

const COLOR_TOKENS = [
  { name: 'Berkeley Blue', hex: '#003262', desc: 'Primary Base' },
  { name: 'California Gold', hex: '#FDB515', desc: 'Seal Color' },
  { name: 'Stitch Teal', hex: '#009E9D', desc: 'Primary Action' },
  { name: 'Lethal Red', hex: '#FF4D6D', desc: 'Critical Alert' },
  { name: 'Optimal Cyan', hex: '#219EBC', desc: 'Success State' },
  { name: 'Stitch Amber', hex: '#FFB703', desc: 'Warning State' },
];

export default function DesignLibraryPage() {
  const [activeTab, setActiveTab] = useState('atoms');
  const [inputText, setInputText] = useState('');

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
          { id: 'tokens', label: '設計標籤 (Tokens)', icon: <Zap size={14}/> },
          { id: 'atoms', label: '原子組件 (Atoms)', icon: <Activity size={14}/> },
          { id: 'molecules', label: '複合組件 (Molecules)', icon: <Layers size={14}/> },
        ]}
      />

      <div className="mt-8">
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
