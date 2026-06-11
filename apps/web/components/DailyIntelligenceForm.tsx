'use client';

import React, { useState } from 'react';
import { useOmniTable } from '@/lib/omni-table/useOmniTable';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniInput, OmniTextarea } from '@/components/ui/omni/OmniInput';
import { Loader2, PlusCircle, CheckCircle } from 'lucide-react';

interface DailyIntelligenceFormProps {
    datasheetId: string; // 目標 OmniTable 的表格 ID
    onSuccess?: () => void; // 新增成功後的回呼函式 (例如用來重新整理列表)
}

export function DailyIntelligenceForm({ datasheetId, onSuccess }: DailyIntelligenceFormProps) {
    const { createRecords, loading, error } = useOmniTable();

    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        Title: '',
        Content: '',
        Source: '商情中心',
        Severity: '3', // 預設嚴重程度
        Date: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(false);

        try {
            // 呼叫 hook 提供的 createRecords 方法寫入資料
            // 注意：fields 內的 Key 必須對應 OmniTable 上設定的「欄位名稱」
            await createRecords(datasheetId, [
                {
                    fields: {
                        'Title': formData.Title,
                        'Content': formData.Content,
                        'Source': formData.Source,
                        'Severity': Number(formData.Severity),
                        'Date': formData.Date,
                    }
                }
            ]);

            setIsSuccess(true);

            // 清空表單內容
            setFormData(prev => ({ ...prev, Title: '', Content: '' }));

            if (onSuccess) onSuccess();

            // 3秒後移除成功提示
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (err) {
            console.error('新增情資失敗:', err);
        }
    };

    return (
        <OmniBaseCard variant="glass" className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="text-cyan-400" size={24} />
                新增每日情資
            </h2>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-md mb-4 text-sm">
                    寫入失敗: {error}
                </div>
            )}

            {isSuccess && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-2 rounded-md mb-4 text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> 成功同步至 OmniTable！
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <OmniInput label="情資標題" name="Title" value={formData.Title} onChange={handleChange} placeholder="輸入情資標題..." required disabled={loading} />
                <OmniInput label="資料來源" name="Source" value={formData.Source} onChange={handleChange} disabled={loading} />
                <div className="grid grid-cols-2 gap-4">
                    <OmniInput label="日期" type="date" name="Date" value={formData.Date} onChange={handleChange} required disabled={loading} />
                    <OmniInput label="嚴重程度 (1-5)" type="number" name="Severity" min="1" max="5" value={formData.Severity} onChange={handleChange} required disabled={loading} />
                </div>
                <OmniTextarea label="情資內容" name="Content" value={formData.Content} onChange={handleChange} placeholder="請貼上商情中心傳來的情資內容..." required disabled={loading} rows={4} />

                <OmniButton type="submit" variant="primary" className="w-full" disabled={loading || !formData.Title}>
                    {loading ? <><Loader2 className="animate-spin mr-2" size={18} /> 寫入中...</> : '同步至控制中心'}
                </OmniButton>
            </form>
        </OmniBaseCard>
    );
}