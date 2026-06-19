'use client';

import { Badge } from '@/components/ui/Badge.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { Card } from '@/components/ui/Card.tsx';
import { Eye, CheckCircle } from 'lucide-react';

interface EvidenceTableProps {
    data: any[];
}

export function EvidenceTable({ data }: EvidenceTableProps) {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('zh-TW');
    };

    return (
        <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                UUID
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                公式
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                來源
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                狀態
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                建立時間
                            </th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((evidence) => (
                            <tr key={evidence.uuid} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 text-xs font-mono text-slate-300">
                                    {evidence.uuid.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-300">
                                    {evidence.formula}
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-300">
                                    {evidence.source_origin}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge status={evidence.lifecycle_stage}>
                                        {evidence.lifecycle_stage}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {formatDate(evidence.timestamp)}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Eye size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <CheckCircle size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                                    尚無任何證據記錄
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
