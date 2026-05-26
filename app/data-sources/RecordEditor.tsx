'use client';
import { useState } from 'react';
import { Save, Loader2, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import type { AITableField, AITableRecord } from '@/lib/aitable/client';

export function RecordEditorModal({ open, onClose, fields, record, onSave, onDelete, saving }: {
  open: boolean; onClose: () => void;
  fields: AITableField[]; record: AITableRecord | null;
  onSave: (fields: Record<string, unknown>, recordId?: string) => Promise<void>;
  onDelete?: (recordId: string) => Promise<void>;
  saving: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (!record) return {};
    const v: Record<string, string> = {};
    fields.forEach(f => { v[f.name] = String(record.fields[f.name] ?? ''); });
    return v;
  });

  const isEdit = !!record;

  const handleSubmit = async () => {
    const parsed: Record<string, unknown> = {};
    fields.forEach(f => {
      const raw = values[f.name] ?? '';
      if (!raw && !isEdit) return; // skip empty for new
      if (f.type === 'Number' || f.type === 'Currency') parsed[f.name] = Number(raw) || 0;
      else if (f.type === 'Checkbox') parsed[f.name] = raw === 'true';
      else parsed[f.name] = raw;
    });
    await onSave(parsed, record?.recordId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Record' : 'New Record'} width="max-w-xl">
      <div className="space-y-3 mb-5 max-h-[50vh] overflow-y-auto">
        {fields.filter(f => !f.isPrimary || !isEdit).map(f => (
          <div key={f.id}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {f.name} <span className="text-slate-300 font-mono">({f.type})</span>
            </label>
            {f.type === 'Text' ? (
              <textarea value={values[f.name] || ''} onChange={e => setValues(p => ({ ...p, [f.name]: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-berkeley-blue/40 resize-y min-h-[60px]" />
            ) : f.type === 'Checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={values[f.name] === 'true'}
                  onChange={e => setValues(p => ({ ...p, [f.name]: String(e.target.checked) }))}
                  className="w-4 h-4 rounded" />
                <span className="text-[11px] text-slate-500">{values[f.name] === 'true' ? 'Yes' : 'No'}</span>
              </label>
            ) : (
              <input value={values[f.name] || ''} onChange={e => setValues(p => ({ ...p, [f.name]: e.target.value }))}
                type={f.type === 'Number' || f.type === 'Currency' ? 'number' : 'text'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-berkeley-blue/40" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          {isEdit && onDelete && (
            <button onClick={() => { onDelete(record!.recordId); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-[11px] font-bold transition-colors">
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
        <button disabled={saving} onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-berkeley-blue text-white rounded-xl text-[11px] font-bold disabled:opacity-40 hover:bg-berkeley-blue/90 transition-all">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}
