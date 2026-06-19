'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button.tsx';
import { Card } from '@/components/ui/Card.tsx';
import { Input } from '@/components/ui/Input.tsx';

export function AIReportGenerator() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState<'GRI' | 'TCFD' | 'ISO-14064'>('GRI');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/ai/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, type }),
            });

            const result = await response.json();
            if (result.success) {
                setReport(result.data.content);
            } else {
                alert('生成失敗：' + (result.error?.message || result.error || '不明錯誤'));
            }
        } catch (error) {
            alert('發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card glow>
                <h2 className="text-2xl font-bold mb-4 text-white">AI 報告生成器 🤖</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                        type="number"
                        label="報告年度"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    />

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">報告類型</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#63a6b0]/50"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                        >
                            <option value="GRI">GRI 永續報告</option>
                            <option value="TCFD">TCFD 氣候報告</option>
                            <option value="ISO-14064">ISO 14064 碳盤查</option>
                        </select>
                    </div>
                </div>

                <Button onClick={handleGenerate} loading={loading} disabled={loading} className="w-full">
                    {loading ? 'AI 正從永恆宮殿提取數據生成中...' : '啟動 AI 智慧生成'}
                </Button>
            </Card>

            {report && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">生成結果</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(report)}>
                            複製內容
                        </Button>
                    </div>
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 max-h-[600px] overflow-y-auto scrollbar-hide">
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">{report}</pre>
                    </div>
                </Card>
            )}
        </div>
    );
}
