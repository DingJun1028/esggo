'use client';
import { useState } from 'react';
import { Leaf, Users, ShieldCheck, Plus, Loader2, Check } from 'lucide-react';
import { ESG_TEMPLATES, type ESGTemplate } from '@/lib/omni-table/templates';
import { Modal } from './Modal';

const CAT_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  E: { icon: <Leaf size={13} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Environmental' },
  S: { icon: <Users size={13} />, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Social' },
  G: { icon: <ShieldCheck size={13} />, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Governance' },
};

export function TemplatePickerModal({ open, onClose, onConfirm, creating }: {
  open: boolean; onClose: () => void;
  onConfirm: (t: ESGTemplate) => Promise<void>; creating: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const templates = filter === 'all' ? ESG_TEMPLATES : ESG_TEMPLATES.filter(t => t.category === filter);
  const tmpl = ESG_TEMPLATES.find(t => t.id === selected);

  return (
    <Modal open={open} onClose={onClose} title="Create ESG Datasheet from Template" width="max-w-2xl">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'E', 'S', 'G'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${filter === f ? 'bg-berkeley-blue text-white border-berkeley-blue' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>
            {f === 'all' ? 'All' : CAT_META[f].label}
          </button>
        ))}
      </div>
      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {templates.map(t => {
          const meta = CAT_META[t.category];
          return (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${selected === t.id ? 'border-berkeley-blue bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${meta.color}`}>
                  {meta.icon} {t.category}
                </span>
              </div>
              <p className="text-[12px] font-bold text-slate-700">{t.nameZh}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t.name}</p>
              <p className="text-[10px] text-slate-300 mt-1">{t.fields.length} fields</p>
            </button>
          );
        })}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400">{selected ? `Selected: ${tmpl?.nameZh}` : 'Select a template'}</p>
        <button disabled={!selected || creating} onClick={() => tmpl && onConfirm(tmpl)}
          className="flex items-center gap-2 px-5 py-2.5 bg-berkeley-blue text-white rounded-xl text-[11px] font-bold disabled:opacity-40 hover:bg-berkeley-blue/90 transition-all">
          {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          {creating ? 'Creating...' : 'Create Datasheet'}
        </button>
      </div>
    </Modal>
  );
}
