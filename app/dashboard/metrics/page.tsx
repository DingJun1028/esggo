'use client';

import React, { useState, useEffect } from 'react';
import { UniversalTable, UniversalTableColumn } from '../../../components/ui/universal/UniversalTable';
import { UniversalButton } from '../../../components/ui/universal/UniversalButton';
import { UniversalForm, FormField } from '../../../components/ui/universal/UniversalForm';
import { UniversalChart } from '../../../components/ui/universal/UniversalChart';
import { UniversalStatusDot } from '../../../components/ui/universal/UniversalStatusDot';
import { UniversalBadge } from '../../../components/ui/universal/UniversalBadge';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data/list/esg_metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddMetric = async (data: any) => {
    try {
      // Basic transformations
      const payload = {
        ...data,
        value: Number(data.value),
        target_value: Number(data.target_value),
        reporting_year: Number(data.reporting_year)
      };
      
      const res = await fetch('/api/data/create/esg_metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddForm(false);
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const columns: UniversalTableColumn<any>[] = [
    { key: 'metric_code', label: 'Code' },
    { key: 'metric_name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value', render: (val, row) => `${val || 0} ${row.unit || ''}` },
    { key: 'target_value', label: 'Target', render: (val, row) => `${val || 0} ${row.unit || ''}` },
    { 
      key: 'lifecycle_stage', 
      label: 'Stage',
      render: (val) => (
        <UniversalBadge variant={val === 'PUBLISHED' ? 'primary' : val === 'REVIEW' ? 'secondary' : 'outline'}>
          {val || 'DRAFT'}
        </UniversalBadge>
      )
    },
    { 
      key: 'hash_lock', 
      label: 'ZKP Hash',
      render: (val) => val ? (
        <div className="flex items-center space-x-2">
          <UniversalStatusDot status="active" />
          <span className="text-xs font-mono text-[var(--theme-text-muted)]">{val.substring(0, 8)}...</span>
        </div>
      ) : (
        <span className="text-xs italic text-[var(--theme-text-muted)]">Unsealed</span>
      )
    }
  ];

  const formFields: FormField[] = [
    { name: 'metric_code', label: 'Metric Code', type: 'text', required: true },
    { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'enum', options: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'], required: true },
    { name: 'unit', label: 'Unit (e.g. tCO2e)', type: 'text' },
    { name: 'value', label: 'Current Value', type: 'number' },
    { name: 'target_value', label: 'Target Value', type: 'number' },
    { name: 'reporting_year', label: 'Reporting Year', type: 'number', required: true },
    { name: 'scope', label: 'Scope', type: 'enum', options: ['SCOPE_1', 'SCOPE_2', 'SCOPE_3', 'N/A'] }
  ];

  const chartData = metrics.map((m: any) => ({
    name: m.metric_name,
    value: Number(m.value) || 0,
    target: Number(m.target_value) || 0
  }));

  return (
    <div className="p-8 space-y-8 animate-fade-in text-[var(--theme-text)] min-h-screen bg-[var(--theme-base)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[var(--theme-primary)]">
            數據對接：ESG Metrics (萬能永憶)
          </h1>
          <p className="text-[var(--theme-text-muted)] mt-1">
            UniversalTable 與 UniversalForm 綁定 NCB 資料庫，實作 CRUD 操作。
          </p>
        </div>
        <UniversalButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Metric'}
        </UniversalButton>
      </div>

      {showAddForm && (
        <div className="p-6 border border-[var(--theme-border)] rounded-xl bg-[var(--theme-surface)]/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold mb-4 text-[var(--theme-secondary)]">Create New Metric</h2>
          <UniversalForm 
            fields={formFields} 
            onSubmit={handleAddMetric} 
            onCancel={() => setShowAddForm(false)} 
            initialValues={{ reporting_year: new Date().getFullYear(), category: 'ENVIRONMENTAL' }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm tracking-widest text-[var(--theme-text-muted)] mb-4 uppercase font-bold">Metrics Data Table</h3>
          {loading ? (
             <div className="p-12 text-center text-[var(--theme-text-muted)]">Loading metrics...</div>
          ) : (
            <UniversalTable columns={columns} data={metrics} />
          )}
        </div>
        
        <div className="space-y-8">
          <div>
             <h3 className="text-sm tracking-widest text-[var(--theme-text-muted)] mb-4 uppercase font-bold">Metrics Progress Overview</h3>
             <UniversalChart 
               type="bar" 
               data={chartData} 
               dataKey="value"
               xAxisKey="name"
               series={[
                 { key: 'value', color: 'var(--theme-primary)', name: 'Current Value' },
                 { key: 'target', color: 'var(--theme-secondary)', name: 'Target Value' }
               ]}
               height={300}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
