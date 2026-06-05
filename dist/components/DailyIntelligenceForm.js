'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useOmniTable } from '@/lib/omni-table/useOmniTable';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalInput, UniversalTextarea } from '@/components/ui/universal/UniversalInput';
import { Loader2, PlusCircle, CheckCircle } from 'lucide-react';
export function DailyIntelligenceForm({ datasheetId, onSuccess }) {
    const { createRecords, loading, error } = useOmniTable();
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        Title: '',
        Content: '',
        Source: '商情中心',
        Severity: '3', // 預設嚴重程度
        Date: new Date().toISOString().split('T')[0],
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
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
            if (onSuccess)
                onSuccess();
            // 3秒後移除成功提示
            setTimeout(() => setIsSuccess(false), 3000);
        }
        catch (err) {
            console.error('新增情資失敗:', err);
        }
    };
    return (_jsxs(UniversalCard, { variant: "glass", className: "p-6", children: [_jsxs("h2", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(PlusCircle, { className: "text-cyan-400", size: 24 }), "\u65B0\u589E\u6BCF\u65E5\u60C5\u8CC7"] }), error && (_jsxs("div", { className: "bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-md mb-4 text-sm", children: ["\u5BEB\u5165\u5931\u6557: ", error] })), isSuccess && (_jsxs("div", { className: "bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-2 rounded-md mb-4 text-sm flex items-center gap-2", children: [_jsx(CheckCircle, { size: 16 }), " \u6210\u529F\u540C\u6B65\u81F3 OmniTable\uFF01"] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(UniversalInput, { label: "\u60C5\u8CC7\u6A19\u984C", name: "Title", value: formData.Title, onChange: handleChange, placeholder: "\u8F38\u5165\u60C5\u8CC7\u6A19\u984C...", required: true, disabled: loading }), _jsx(UniversalInput, { label: "\u8CC7\u6599\u4F86\u6E90", name: "Source", value: formData.Source, onChange: handleChange, disabled: loading }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(UniversalInput, { label: "\u65E5\u671F", type: "date", name: "Date", value: formData.Date, onChange: handleChange, required: true, disabled: loading }), _jsx(UniversalInput, { label: "\u56B4\u91CD\u7A0B\u5EA6 (1-5)", type: "number", name: "Severity", min: "1", max: "5", value: formData.Severity, onChange: handleChange, required: true, disabled: loading })] }), _jsx(UniversalTextarea, { label: "\u60C5\u8CC7\u5167\u5BB9", name: "Content", value: formData.Content, onChange: handleChange, placeholder: "\u8ACB\u8CBC\u4E0A\u5546\u60C5\u4E2D\u5FC3\u50B3\u4F86\u7684\u60C5\u8CC7\u5167\u5BB9...", required: true, disabled: loading, rows: 4 }), _jsx(UniversalButton, { type: "submit", variant: "primary", className: "w-full", disabled: loading || !formData.Title, children: loading ? _jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin mr-2", size: 18 }), " \u5BEB\u5165\u4E2D..."] }) : '同步至控制中心' })] })] }));
}
//# sourceMappingURL=DailyIntelligenceForm.js.map