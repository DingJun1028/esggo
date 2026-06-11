'use client';

import { useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BrandTable, StandardPage, BrandCard } from '../../components/brand';
import { useAuth } from '../../hooks/useAuth';

export default function ReportPage() {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('evidence_vault').select('*').eq('status', 'verified');
    setEvidence(data || []);
    setLoading(false);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const generateReport = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    try {
      const selectedEvidence = evidence.filter((e: any) => selectedIds.has(e.id));
      const description = `基於以下憑證產生報告：\n` + selectedEvidence.map((e: any) => `- ${e.file_name} (${e.gri_reference})`).join('\n');
      
      await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user?.email || 'report_user',
          taskType: 'report_generation',
          title: `自動化 ESG 報告生成`,
          description,
          skillKey: 'gri_report_draft'
        })
      });
      alert('報告生成任務已排入蜂群！請至 OmniAgent 監控畫面查看。');
      setSelectedIds(new Set());
    } catch (e) {
      alert('生成失敗');
    } finally {
      setGenerating(false);
    }
  };

  const pageConfig = {
    id: 'report-generator',
    title: '自動化報告生成 Report Generation',
    subtitle: '選定已封印 (T5_SEALED) 之憑證指標，呼叫 OmniAgent 進行智慧排版與撰寫。',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'] as any,
    icon: <FileText size={32} />,
    primaryActions: [
      { id: 'generate', label: '生成報告', icon: <Sparkles size={16}/>, onClick: generateReport, loading: generating, variant: 'primary' as any, disabled: selectedIds.size === 0 }
    ],
    sections: [
      {
        id: 'selection',
        title: '選擇已封印之憑證',
        columns: 12 as const,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
             <BrandTable 
               loading={loading} 
               columns={[
                 { label: '選擇', key: 'select' }, 
                 { label: '檔案名稱', key: 'name' }, 
                 { label: 'GRI 指標', key: 'gri' }
               ]}
               data={evidence.map((f: any) => ({
                 select: <input type="checkbox" checked={selectedIds.has(f.id)} onChange={() => toggleSelection(f.id)} className="w-4 h-4 accent-[#003262]" />,
                 name: <span className="font-bold text-[#003262]">{f.file_name}</span>,
                 gri: <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{f.gri_reference || '-'}</span>
               }))}
             />
          </BrandCard>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
