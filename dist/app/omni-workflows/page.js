import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { omniBlueTableService } from '@/src/server/services/omni-blue-table.service';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalInput, UniversalSelect, UniversalTextarea } from '@/components/ui/universal/UniversalInput';
import { ShieldCheck, Loader2, PlusCircle, AlertTriangle, Info } from 'lucide-react';
import { BestPracticeSchema } from '@/lib/agent/best-practice-registry';
import { useState, useEffect } from 'react';
import { z } from 'zod';
export const revalidate = 0;
export default function OmniWorkflowsPage() {
    const [bestPractices, setBestPractices] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        category: 'G',
        industry: '',
        title: '',
        strategy: '',
        benchmark_source: '',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 50,
        tags: [],
        last_verified: new Date().toISOString().split('T')[0],
    });
    const [formErrors, setFormErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        omniBlueTableService.getBestPracticesFromSupabase().then(({ data, error }) => {
            if (error) {
                setFetchError(error);
            }
            else {
                setBestPractices(data || []);
            }
            setIsLoading(false);
        });
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tags') {
            setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
        }
        else if (name === 'impact_score') {
            setFormData(prev => ({ ...prev, impact_score: parseInt(value) || 0 }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleComplianceChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            t5_compliance: {
                traceable: prev.t5_compliance?.traceable ?? true,
                transparent: prev.t5_compliance?.transparent ?? true,
                tangible: prev.t5_compliance?.tangible ?? true,
                trackable: prev.t5_compliance?.trackable ?? true,
                trustworthy: prev.t5_compliance?.trustworthy ?? true,
                [name]: checked,
            },
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors([]);
        try {
            // Client-side validation
            const dataToValidate = {
                ...formData,
                id: formData.id || `bp-${Date.now()}`, // Generate ID if not provided
                last_verified: formData.last_verified || new Date().toISOString().split('T')[0],
            };
            const validatedData = BestPracticeSchema.parse(dataToValidate);
            const response = await fetch('/api/omni-workflows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedData),
            });
            const result = await response.json();
            if (response.ok) {
                setBestPractices(prev => [...prev, result.data]);
                setShowForm(false);
                setFormData({
                    id: '',
                    category: 'G',
                    industry: '',
                    title: '',
                    strategy: '',
                    benchmark_source: '',
                    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
                    impact_score: 50,
                    tags: [],
                    last_verified: new Date().toISOString().split('T')[0],
                });
                // Re-fetch all best practices to ensure consistency after adding
                const { data: updatedPractices } = await omniBlueTableService.getBestPracticesFromSupabase();
                setBestPractices(updatedPractices || []);
            }
            else {
                const mockError = [{ path: [], message: result.error || 'Unknown error' }];
                setFormErrors(mockError);
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                setFormErrors(error.errors);
            }
            else {
                const mockError = [{ path: [], message: 'Client-side error: ' + error.message }];
                setFormErrors(mockError);
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative", children: _jsx(ShieldCheck, { className: "text-cyan-400 relative z-10", size: 28 }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx(UniversalBadge, { variant: "primary", size: "sm", children: "Workflow Management" }), _jsx("span", { className: "text-xs font-mono text-slate-500 uppercase tracking-widest", children: "OMNI-WF-001" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-black text-white tracking-tight", children: "\u5DE5\u4F5C\u6D41\u7A0B\u6700\u4F73\u5BE6\u8E10 (Workflow Best Practices)" }), _jsx("p", { className: "text-slate-400 font-mono text-sm tracking-widest uppercase mt-2", children: "\u7BA1\u7406\u8207\u8FFD\u8E64\u60A8\u7684\u81EA\u52D5\u5316\u5DE5\u4F5C\u6D41\u7A0B\u908F\u8F2F" })] })] }), _jsxs(UniversalButton, { onClick: () => setShowForm(!showForm), variant: "primary", size: "lg", className: "flex items-center gap-2", children: [_jsx(PlusCircle, { size: 18 }), " ", showForm ? '取消新增' : '新增最佳實踐'] })] }), showForm && (_jsxs(UniversalCard, { variant: "glass", className: "p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "\u65B0\u589E\u5DE5\u4F5C\u6D41\u7A0B\u6700\u4F73\u5BE6\u8E10" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [formErrors.length > 0 && (_jsxs("div", { className: "bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md", children: [_jsx("p", { className: "font-bold mb-2", children: "\u8ACB\u4FEE\u6B63\u4EE5\u4E0B\u932F\u8AA4:" }), _jsx("ul", { className: "list-disc list-inside", children: formErrors.map((err, index) => (_jsxs("li", { children: [err.path.join('.'), " - ", err.message] }, index))) })] })), _jsx(UniversalInput, { label: "ID (\u81EA\u52D5\u751F\u6210\uFF0C\u53EF\u9078\u586B)", name: "id", value: formData.id || '', onChange: handleInputChange, placeholder: "\u4F8B\u5982: bp-new-workflow", disabled: isSubmitting }), _jsxs(UniversalSelect, { label: "\u985E\u5225", name: "category", value: formData.category, onChange: handleInputChange, disabled: isSubmitting, children: [_jsx("option", { value: "E", children: "E - \u74B0\u5883 (Environmental)" }), _jsx("option", { value: "S", children: "S - \u793E\u6703 (Social)" }), _jsx("option", { value: "G", children: "G - \u6CBB\u7406 (Governance)" })] }), _jsx(UniversalInput, { label: "\u9069\u7528\u7522\u696D", name: "industry", value: formData.industry || '', onChange: handleInputChange, placeholder: "\u4F8B\u5982: General Corporate, High-Tech Manufacturing", disabled: isSubmitting, required: true }), _jsx(UniversalInput, { label: "\u6A19\u984C", name: "title", value: formData.title || '', onChange: handleInputChange, placeholder: "\u4F8B\u5982: Render Workflow: New Task", disabled: isSubmitting, required: true }), _jsx(UniversalTextarea, { label: "\u7B56\u7565\u8A73\u60C5", name: "strategy", value: formData.strategy || '', onChange: handleInputChange, placeholder: "\u8A73\u7D30\u63CF\u8FF0\u5DE5\u4F5C\u6D41\u7A0B\u7684\u7B56\u7565\u8207\u76EE\u6A19", disabled: isSubmitting, required: true }), _jsx(UniversalInput, { label: "\u6A19\u7AFF\u4F86\u6E90", name: "benchmark_source", value: formData.benchmark_source || '', onChange: handleInputChange, placeholder: "\u4F8B\u5982: Render Workflows SDK Examples", disabled: isSubmitting }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(UniversalInput, { label: "\u5F71\u97FF\u5206\u6578 (0-100)", name: "impact_score", type: "number", value: formData.impact_score !== undefined ? formData.impact_score.toString() : '50', onChange: handleInputChange, min: "0", max: "100", disabled: isSubmitting }), _jsx(UniversalInput, { label: "\u6A19\u7C64 (\u4EE5\u9017\u865F\u5206\u9694)", name: "tags", value: formData.tags ? formData.tags.join(', ') : '', onChange: handleInputChange, placeholder: "\u4F8B\u5982: DataPipeline, Automation", disabled: isSubmitting })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium text-slate-300", children: "T5 Compliance:" }), Object.keys(formData.t5_compliance || {}).map(key => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: key, name: key, checked: formData.t5_compliance?.[key] || false, onChange: handleComplianceChange, disabled: isSubmitting, className: "form-checkbox h-4 w-4 text-cyan-600 transition duration-150 ease-in-out bg-slate-700 border-slate-600 rounded" }), _jsx("label", { htmlFor: key, className: "text-sm text-slate-400", children: key.charAt(0).toUpperCase() + key.slice(1) })] }, key)))] }), _jsxs(UniversalButton, { type: "submit", variant: "primary", size: "lg", disabled: isSubmitting, className: "w-full", children: [isSubmitting ? _jsx(Loader2, { className: "animate-spin mr-2", size: 18 }) : null, isSubmitting ? '提交中...' : '提交新的最佳實踐'] })] })] })), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "\u5DF2\u8A3B\u518A\u7684\u5DE5\u4F5C\u6D41\u7A0B\u908F\u8F2F" }), isLoading ? (_jsx("div", { className: "flex justify-center p-8", children: _jsx(Loader2, { className: "animate-spin text-cyan-400", size: 32 }) })) : fetchError ? (_jsxs("div", { className: "p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4", children: [_jsx(AlertTriangle, { className: "text-red-400 mt-1 flex-shrink-0", size: 24 }), _jsxs("div", { children: [_jsx("h3", { className: "text-red-400 font-bold text-lg mb-1", children: "OmniBlueTable \u9023\u7DDA\u7570\u5E38\u6216\u8B80\u53D6\u5931\u6557" }), _jsx("p", { className: "text-red-300/80 mb-3", children: String(fetchError) }), _jsxs("div", { className: "bg-red-950/50 p-3 rounded-lg border border-red-500/20 text-sm text-red-200", children: [_jsx("strong", { children: "\u6392\u89E3\u5EFA\u8B70\uFF1A" }), " \u8ACB\u78BA\u8A8D Supabase \u670D\u52D9\u662F\u5426\u6B63\u5E38\u904B\u884C\uFF0C\u4E14 ", _jsx("code", { children: "SUPABASE_SERVICE_ROLE_KEY" }), " \u7B49\u74B0\u5883\u8B8A\u6578\u7686\u5DF2\u6B63\u78BA\u8A2D\u5B9A\u3002"] })] })] })) : bestPractices.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed", children: [_jsx(Info, { className: "text-slate-500 mb-4", size: 48 }), _jsx("p", { className: "text-slate-400 text-lg font-medium", children: "\u76EE\u524D\u5C1A\u672A\u540C\u6B65\u4EFB\u4F55\u5DE5\u4F5C\u6D41\u7A0B" }), _jsx("p", { className: "text-slate-500 text-sm mt-2", children: "\u8ACB\u5617\u8A66\u57F7\u884C\u540C\u6B65\u8173\u672C\u6216\u78BA\u8A8D\u8CC7\u6599\u5EAB\u4E2D\u662F\u5426\u5B58\u5728\u6700\u4F73\u5BE6\u8E10\u8CC7\u6599\u3002" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: bestPractices.map((bp) => (_jsxs(UniversalCard, { variant: "glass", className: "p-6 transition-all duration-300 hover:border-cyan-500/30", children: [_jsxs("h3", { className: "font-bold text-slate-300 flex items-center gap-2 mb-4", children: [_jsx(ShieldCheck, { size: 18, className: "text-cyan-400" }), " ", bp.title] }), _jsx("p", { className: "text-sm text-slate-400 mb-4", children: bp.strategy }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: bp.tags.map(tag => (_jsx(UniversalBadge, { variant: "secondary", size: "xs", children: tag }, tag))) }), _jsxs("div", { className: "text-xs text-slate-500 space-y-1", children: [_jsxs("p", { children: ["Category: ", _jsx("span", { className: "text-slate-300", children: bp.category })] }), _jsxs("p", { children: ["Industry: ", _jsx("span", { className: "text-slate-300", children: bp.industry })] }), _jsxs("p", { children: ["Impact Score: ", _jsx("span", { className: "text-slate-300", children: bp.impact_score })] }), _jsxs("p", { children: ["Last Verified: ", _jsx("span", { className: "text-slate-300", children: bp.last_verified })] })] })] }, bp.id))) }))] })] }) }));
}
//# sourceMappingURL=page.js.map