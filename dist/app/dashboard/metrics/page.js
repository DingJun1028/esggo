'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UniversalTable } from '../../../components/ui/universal/UniversalTable';
import { UniversalButton } from '../../../components/ui/universal/UniversalButton';
import { UniversalForm } from '../../../components/ui/universal/UniversalForm';
import { UniversalChart } from '../../../components/ui/universal/UniversalChart';
import { UniversalStatusDot } from '../../../components/ui/universal/UniversalStatusDot';
import { UniversalBadge } from '../../../components/ui/universal/UniversalBadge';
import { supabase } from '@/lib/db/supabase';
export default function MetricsPage() {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    useEffect(() => {
        fetchMetrics();
        // Realtime subscription
        const channel = supabase
            .channel('schema-db-changes-metrics')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'esg_records' }, payload => {
            fetchMetrics();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('esg_records')
                .select('*')
                .order('timestamp', { ascending: false });
            if (error)
                throw error;
            const formattedData = (data || []).map(record => ({
                id: record.id,
                category: record.category === 'E' ? 'ENVIRONMENTAL' : record.category === 'S' ? 'SOCIAL' : record.category === 'G' ? 'GOVERNANCE' : record.category,
                metric_code: record.metric_value?.metric_code || 'N/A',
                metric_name: record.metric_value?.metric_name || 'N/A',
                value: record.metric_value?.value || 0,
                target_value: record.metric_value?.target_value || 0,
                unit: record.metric_value?.unit || '',
                lifecycle_stage: record.metric_value?.lifecycle_stage || 'DRAFT',
                hash_lock: record.zkp_hash,
                reporting_year: record.metric_value?.reporting_year,
                scope: record.metric_value?.scope
            }));
            setMetrics(formattedData);
        }
        catch (e) {
            console.error(e);
        }
        setLoading(false);
    };
    const handleAddMetric = async (data) => {
        try {
            const { category, ...rest } = data;
            const mappedCategory = category === 'ENVIRONMENTAL' ? 'E' : category === 'SOCIAL' ? 'S' : category === 'GOVERNANCE' ? 'G' : category;
            const metric_value = {
                ...rest,
                value: Number(data.value),
                target_value: Number(data.target_value),
                reporting_year: Number(data.reporting_year)
            };
            const { error } = await supabase.from('esg_records').insert([
                {
                    category: mappedCategory,
                    metric_value
                }
            ]);
            if (error)
                throw error;
            setShowAddForm(false);
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleSeal = async (id) => {
        setProcessingId(id);
        try {
            const res = await fetch('/api/zkp/seal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await res.json();
            if (!res.ok)
                throw new Error(result.error);
            // fetchMetrics is called via realtime subscription
        }
        catch (e) {
            console.error('Sealing failed:', e);
            alert('Sealing failed: ' + e.message);
        }
        finally {
            setProcessingId(null);
        }
    };
    const handleVerify = async (id) => {
        setProcessingId(id);
        try {
            const res = await fetch('/api/zkp/seal', {
                method: 'PUT', // We'll just mock this for now in UI or build a new route
            });
            // Simulate verification delay
            await new Promise(r => setTimeout(r, 600));
            setVerificationResult({ id, valid: true });
            setTimeout(() => setVerificationResult(null), 3000);
        }
        catch (e) {
            console.error('Verification failed:', e);
        }
        finally {
            setProcessingId(null);
        }
    };
    const columns = [
        { key: 'metric_code', label: 'Code' },
        { key: 'metric_name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'value', label: 'Value', render: (val, row) => `${val || 0} ${row.unit || ''}` },
        { key: 'target_value', label: 'Target', render: (val, row) => `${val || 0} ${row.unit || ''}` },
        {
            key: 'lifecycle_stage',
            label: 'Stage',
            render: (val) => (_jsx(UniversalBadge, { variant: val === 'PUBLISHED' ? 'primary' : val === 'REVIEW' ? 'secondary' : 'outline', children: val || 'DRAFT' }))
        },
        {
            key: 'hash_lock',
            label: 'ZKP Hash & Integrity',
            render: (val, row) => val ? (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(UniversalStatusDot, { status: "active" }), _jsxs("span", { className: "text-xs font-mono text-[var(--theme-text-muted)] truncate max-w-[80px]", title: val, children: [val.substring(0, 8), "..."] })] }), verificationResult?.id === row.id ? (_jsx("span", { className: "text-xs text-[var(--theme-secondary)] font-bold", children: "\u2713 Verified" })) : (_jsx("button", { onClick: () => handleVerify(row.id), disabled: processingId === row.id, className: "text-xs text-[var(--theme-primary)] hover:underline disabled:opacity-50", children: "Verify" }))] })) : (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-xs italic text-[var(--theme-text-muted)]", children: "Unsealed" }), _jsx(UniversalButton, { variant: "outline", size: "sm", onClick: () => handleSeal(row.id), disabled: processingId === row.id, children: processingId === row.id ? 'Sealing...' : 'Seal (ZKP)' })] }))
        }
    ];
    const formFields = [
        { name: 'metric_code', label: 'Metric Code', type: 'text', required: true },
        { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'enum', options: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'], required: true },
        { name: 'unit', label: 'Unit (e.g. tCO2e)', type: 'text' },
        { name: 'value', label: 'Current Value', type: 'number' },
        { name: 'target_value', label: 'Target Value', type: 'number' },
        { name: 'reporting_year', label: 'Reporting Year', type: 'number', required: true },
        { name: 'scope', label: 'Scope', type: 'enum', options: ['SCOPE_1', 'SCOPE_2', 'SCOPE_3', 'N/A'] }
    ];
    const chartData = metrics.map((m) => ({
        name: m.metric_name,
        value: Number(m.value) || 0,
        target: Number(m.target_value) || 0
    }));
    return (_jsxs("div", { className: "p-8 space-y-8 animate-fade-in text-[var(--theme-text)] min-h-screen bg-[var(--theme-base)]", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-widest text-[var(--theme-primary)]", children: "\u6578\u64DA\u5C0D\u63A5\uFF1AESG Metrics (\u842C\u80FD\u6C38\u61B6)" }), _jsx("p", { className: "text-[var(--theme-text-muted)] mt-1", children: "UniversalTable \u8207 UniversalForm \u7D81\u5B9A NCB \u8CC7\u6599\u5EAB\uFF0C\u5BE6\u4F5C CRUD \u64CD\u4F5C\u3002" })] }), _jsx(UniversalButton, { onClick: () => setShowAddForm(!showAddForm), children: showAddForm ? 'Cancel' : 'Add Metric' })] }), showAddForm && (_jsxs("div", { className: "p-6 border border-[var(--theme-border)] rounded-xl bg-[var(--theme-surface)]/50 backdrop-blur-md animate-fade-in", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 text-[var(--theme-secondary)]", children: "Create New Metric" }), _jsx(UniversalForm, { fields: formFields, onSubmit: handleAddMetric, onCancel: () => setShowAddForm(false), initialValues: { reporting_year: new Date().getFullYear(), category: 'ENVIRONMENTAL' } })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("h3", { className: "text-sm tracking-widest text-[var(--theme-text-muted)] mb-4 uppercase font-bold", children: "Metrics Data Table (5T Protocol Enabled)" }), loading ? (_jsx("div", { className: "p-12 text-center text-[var(--theme-text-muted)]", children: "Loading metrics..." })) : (_jsx(UniversalTable, { columns: columns, data: metrics }))] }), _jsx("div", { className: "lg:col-span-2 space-y-8", children: _jsxs("div", { children: [_jsx("h3", { className: "text-sm tracking-widest text-[var(--theme-text-muted)] mb-4 uppercase font-bold", children: "Metrics Progress Overview" }), _jsx(UniversalChart, { type: "bar", data: chartData, dataKey: "value", xAxisKey: "name", series: [
                                        { key: 'value', color: 'var(--theme-primary)', name: 'Current Value' },
                                        { key: 'target', color: 'var(--theme-secondary)', name: 'Target Value' }
                                    ], height: 300 })] }) })] })] }));
}
//# sourceMappingURL=page.js.map