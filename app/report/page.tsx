// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { supabase } from '../../lib/supabase';

export default function ReportPage() {
  const [evidence, setEvidence] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    if (!supabase) {
      setEvidence([]);
      setLoading(false);
      return;
    }
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
      const description =
        '基於以下憑證產生報告：\n' +
        selectedEvidence.map((e: any) => `- ${e.file_name} (${e.gri_reference})`).join('\n');
      await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: 'report_user',
          taskType: 'report_generation',
          title: '自動化 ESG 報告生成',
          description,
          skillKey: 'gri_report_draft',
        }),
      });
      alert('報告生成任務已排入蜂群！');
      setSelectedIds(new Set());
    } catch (e) {
      alert('生成失敗');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-center gap-4 pb-6 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            <FileText size={20} className="text-neutral-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">自動化報告生成</h1>
            <p className="text-sm text-neutral-500">
              選定已封印之憑證指標，呼叫 OmniAgent 進行智慧排版與撰寫
            </p>
          </div>
        </header>

        <Card variant="default" padding="md">
          <SectionHeader
            title="選擇已封印之憑證"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={generateReport}
                loading={generating}
                disabled={selectedIds.size === 0}
                icon={<Sparkles size={14} />}
              >
                生成報告
              </Button>
            }
          />
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  {['選擇', '檔案名稱', 'GRI 指標'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                      載入中...
                    </td>
                  </tr>
                ) : evidence.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                      暫無已封印憑證
                    </td>
                  </tr>
                ) : (
                  evidence.map((f: any) => (
                    <tr key={f.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(f.id)}
                          onChange={() => toggleSelection(f.id)}
                          className="w-4 h-4 accent-neutral-900"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                        {f.file_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
                          {f.gri_reference || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
