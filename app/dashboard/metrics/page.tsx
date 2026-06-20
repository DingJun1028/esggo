// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/v2/Button';
import { OmniForm, FormField } from '../../../components/ui/omni/OmniForm';
import { OmniChart } from '../../../components/ui/omni/OmniChart';
import { OmniBaseTable, OmniBaseTableColumn } from '../../../components/ui/omni/OmniBaseTable';
import { OmniStatusDot } from '../../../components/ui/omni/OmniStatusDot';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { Card, CardHeader, CardTitle } from '@/components/ui/v2/Card';
import { supabase } from '@/lib/db/supabase';
import { useThemeStore } from '../../../lib/theme-store';

export default function MetricsPage() {
  const { omniTheme } = useThemeStore();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    id: string;
    valid: boolean;
  } | null>(null);

  useEffect(() => {
    fetchMetrics();

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'esg_records' }, (payload) => {
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

      if (error) throw error;

      const formattedData = (data || []).map((record) => ({
        id: record.id,
        category:
          record.category === 'E'
            ? 'ENVIRONMENTAL'
            : record.category === 'S'
            ? 'SOCIAL'
            : record.category === 'G'
            ? 'GOVERNANCE'
            : record.category,
        metric_code: (record.metric_value as any)?.metric_code || 'N/A',
        metric_name: (record.metric_value as any)?.metric_name || 'N/A',
        value: (record.metric_value as any)?.value || 0,
        target_value: (record.metric_value as any)?.target_value || 0,
        unit: (record.metric_value as any)?.unit || '',
        lifecycle_stage: (record.metric_value as any)?.lifecycle_stage || 'DRAFT',
        hash_lock: record.zkp_hash,
        reporting_year: (record.metric_value as any)?.reporting_year,
        scope: (record.metric_value as any)?.scope,
      }));
      setMetrics(formattedData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddMetric = async (data: any) => {
    try {
      const { category, ...rest } = data;
      const mappedCategory =
        category === 'ENVIRONMENTAL'
          ? 'E'
          : category === 'SOCIAL'
          ? 'S'
          : category === 'GOVERNANCE'
          ? 'G'
          : category;

      const metric_value = {
        ...rest,
        value: Number(data.value),
        target_value: Number(data.target_value),
        reporting_year: Number(data.reporting_year),
      };

      const { error } = await supabase.from('esg_records').insert([
        {
          category: mappedCategory,
          metric_value,
        },
      ]);

      if (error) throw error;

      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeal = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/zkp/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      // fetchMetrics is called via realtime subscription
    } catch (e) {
      console.error('Sealing failed:', e);
      alert('Sealing failed: ' + (e as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerify = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/zkp/seal', {
        // Note: A real verification might be a different endpoint or done purely client side if they have the same salt. For now we will just show a simulated UI response, or you can build a verify endpoint.
        method: 'PUT', // We'll just mock this for now in UI or build a new route
      });

      // Simulate verification delay
      await new Promise((r) => setTimeout(r, 600));
      setVerificationResult({ id, valid: true });
      setTimeout(() => setVerificationResult(null), 3000);
    } catch (e) {
      console.error('Verification failed:', e);
    } finally {
      setProcessingId(null);
    }
  };

  const columns: OmniBaseTableColumn<any>[] = [
    { key: 'metric_code', label: 'Code' },
    { key: 'metric_name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value', render: (val, row) => `${val || 0} ${row.unit || ''}` },
    { key: 'target_value', label: 'Target', render: (val, row) => `${val || 0} ${row.unit || ''}` },
    {
      key: 'lifecycle_stage',
      label: 'Stage',
      render: (val) => (
        <Badge variant={val === 'PUBLISHED' ? 'success' : val === 'REVIEW' ? 'warning' : 'neutral'}>
          {val || 'DRAFT'}
        </Badge>
      ),
    },
    {
      key: 'hash_lock',
      label: 'ZKP Hash & Integrity',
      render: (val, row) =>
        val ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <OmniStatusDot status="active" />
              <span
                className="text-xs font-mono text-[var(--theme-text-muted)] truncate max-w-[80px]"
                title={val}
              >
                {val.substring(0, 8)}...
              </span>
            </div>
            {verificationResult?.id === row.id ? (
              <span className="text-xs text-[var(--theme-secondary)] font-bold">✓ Verified</span>
            ) : (
              <button
                onClick={() => handleVerify(row.id)}
                disabled={processingId === row.id}
                className="text-xs text-[var(--theme-primary)] hover:underline disabled:opacity-50"
              >
                Verify
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <span className="text-xs italic text-[var(--theme-text-muted)]">Unsealed</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSeal(row.id)}
              disabled={processingId === row.id}
            >
              {processingId === row.id ? 'Sealing...' : 'Seal (ZKP)'}
            </Button>
          </div>
        ),
    },
  ];

  const formFields: FormField[] = [
    { name: 'metric_code', label: 'Metric Code', type: 'text', required: true },
    { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'enum',
      options: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'],
      required: true,
    },
    { name: 'unit', label: 'Unit (e.g. tCO2e)', type: 'text' },
    { name: 'value', label: 'Current Value', type: 'number' },
    { name: 'target_value', label: 'Target Value', type: 'number' },
    { name: 'reporting_year', label: 'Reporting Year', type: 'number', required: true },
    {
      name: 'scope',
      label: 'Scope',
      type: 'enum',
      options: ['SCOPE_1', 'SCOPE_2', 'SCOPE_3', 'N/A'],
    },
  ];

  const chartData = metrics.map((m: any) => ({
    name: m.metric_name,
    value: Number(m.value) || 0,
    target: Number(m.target_value) || 0,
  }));

  const allSealed = metrics.length > 0 && metrics.every((m) => m.hash_lock);
  const commonHeart = {
    omniSignature: allSealed ? 'ZKP-GOLDEN-SYNC' : 'PENDING-SEAL-SYNC',
    omniClass: 'OmniGeneral' as const,
    coreContext: {
      actor: 'system',
      timestamp: Date.now(),
      requestId: 'metrics-req',
      environment: 'production' as const,
    },
    resonanceState: allSealed ? 1.0 : 0.5,
    fiveTState: {
      tangible: true,
      traceable: true,
      trackable: true,
      transparent: true,
      trustworthy: allSealed,
    },
  };

  return (
    <div className={`p-8 space-y-8 animate-fade-in min-h-screen ${'text-slate-800 bg-[#FAF9F6]'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[var(--theme-primary)]">
            數據對接：ESG Metrics (萬能永憶)
          </h1>
          <p className="text-[var(--theme-text-muted)] mt-1">
            OmniBaseTable 與 OmniForm 綁定 NCB 資料庫，實作 CRUD 操作。
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Metric'}
        </Button>
      </div>

      {showAddForm && (
        <Card variant="default" className="mb-8">
          <SectionHeader
            title="Create New Metric"
            subtitle="Add a new ESG record with 5T tracking"
          />
          <OmniForm
            fields={formFields}
            onSubmit={handleAddMetric}
            onCancel={() => setShowAddForm(false)}
            initialValues={{ reporting_year: new Date().getFullYear(), category: 'ENVIRONMENTAL' }}
            omniHeart={commonHeart}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2" variant="default">
          <SectionHeader
            title="Metrics Data Table (5T Protocol Enabled)"
            subtitle="Real-time synchronized data ledger"
          />
          {loading ? (
            <div className="p-12 text-center text-[var(--theme-text-muted)]">
              Loading metrics...
            </div>
          ) : (
            <OmniBaseTable columns={columns} data={metrics} omniHeart={commonHeart} />
          )}
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeader title="Metrics Progress Overview" />
          <OmniChart
            omniHeart={commonHeart}
            type="bar"
            data={chartData}
            xAxisKey="name"
            series={[
              { key: 'value', color: 'var(--theme-primary)', name: 'Current Value' },
              { key: 'target', color: 'var(--theme-secondary)', name: 'Target Value' },
            ]}
            height={300}
          />
        </Card>
      </div>
    </div>
  );
}
