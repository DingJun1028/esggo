'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BrandTable, StandardPage, BrandCard } from '../../components/brand';
import { useAuth } from '../../hooks/useAuth';
export default function ReportPage() {
    const { user } = useAuth();
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());
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
    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id))
            newSet.delete(id);
        else
            newSet.add(id);
        setSelectedIds(newSet);
    };
    const generateReport = async () => {
        if (selectedIds.size === 0)
            return;
        setGenerating(true);
        try {
            const selectedEvidence = evidence.filter((e) => selectedIds.has(e.id));
            const description = `基於以下憑證產生報告：\n` + selectedEvidence.map((e) => `- ${e.file_name} (${e.gri_reference})`).join('\n');
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
        }
        catch (e) {
            alert('生成失敗');
        }
        finally {
            setGenerating(false);
        }
    };
    const pageConfig = {
        id: 'report-generator',
        title: '自動化報告生成 Report Generation',
        subtitle: '選定已封印 (T5_SEALED) 之憑證指標，呼叫 OmniAgent 進行智慧排版與撰寫。',
        activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
        icon: _jsx(FileText, { size: 32 }),
        primaryActions: [
            { id: 'generate', label: '生成報告', icon: _jsx(Sparkles, { size: 16 }), onClick: generateReport, loading: generating, variant: 'primary', disabled: selectedIds.size === 0 }
        ],
        sections: [
            {
                id: 'selection',
                title: '選擇已封印之憑證',
                columns: 12,
                component: (_jsx(BrandCard, { padding: "none", className: "glass-panel border-none shadow-premium overflow-hidden", children: _jsx(BrandTable, { loading: loading, columns: [
                            { label: '選擇', key: 'select' },
                            { label: '檔案名稱', key: 'name' },
                            { label: 'GRI 指標', key: 'gri' }
                        ], data: evidence.map((f) => ({
                            select: _jsx("input", { type: "checkbox", checked: selectedIds.has(f.id), onChange: () => toggleSelection(f.id), className: "w-4 h-4 accent-[#003262]" }),
                            name: _jsx("span", { className: "font-bold text-[#003262]", children: f.file_name }),
                            gri: _jsx("span", { className: "font-mono text-sm bg-slate-100 px-2 py-1 rounded", children: f.gri_reference || '-' })
                        })) }) }))
            }
        ]
    };
    return _jsx(StandardPage, { config: pageConfig });
}
//# sourceMappingURL=page.js.map