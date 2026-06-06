"use client";

import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniInput, OmniSelect, OmniTextarea } from '@/components/ui/omni/OmniInput';
import { ShieldCheck, Loader2, PlusCircle, AlertTriangle, Info } from 'lucide-react';
import { type BestPractice, BestPracticeSchema } from '@/lib/agent/best-practice-registry';
import { useState, useEffect } from 'react';
import { z } from 'zod';



export default function OmniWorkflowsPage() {
  const [bestPractices, setBestPractices] = useState<BestPractice[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<BestPractice>>({
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
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/omni-workflows').then(r => r.json()).then(({ data, error }) => {
      if (error) {
        setFetchError(error);
      } else {
        setBestPractices(data || []);
      }
      setIsLoading(false);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (name === 'impact_score') {
      setFormData(prev => ({ ...prev, impact_score: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleComplianceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        const refetchRes = await fetch('/api/omni-workflows');
        const { data: updatedPractices } = await refetchRes.json();
        setBestPractices(updatedPractices || []);
      } else {
        const mockError = [{ path: [], message: result.error || 'Unknown error' }] as unknown as z.ZodIssue[];
        setFormErrors(mockError);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors(error.errors);
      } else {
        const mockError = [{ path: [], message: 'Client-side error: ' + (error as Error).message }] as unknown as z.ZodIssue[];
        setFormErrors(mockError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
              <ShieldCheck className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm">
                  Workflow Management
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  OMNI-WF-001
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                工作流程最佳實踐 (Workflow Best Practices)
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                管理與追蹤您的自動化工作流程邏輯
              </p>
            </div>
          </div>
          <OmniButton onClick={() => setShowForm(!showForm)} variant="primary" size="lg" className="flex items-center gap-2">
            <PlusCircle size={18} /> {showForm ? '取消新增' : '新增最佳實踐'}
          </OmniButton>
        </header>

        {showForm && (
          <OmniBaseCard variant="glass" className="p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">新增工作流程最佳實踐</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formErrors.length > 0 && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md">
                  <p className="font-bold mb-2">請修正以下錯誤:</p>
                  <ul className="list-disc list-inside">
                    {formErrors.map((err, index) => (
                      <li key={index}>{err.path.join('.')} - {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <OmniInput
                label="ID (自動生成，可選填)"
                name="id"
                value={formData.id || ''}
                onChange={handleInputChange}
                placeholder="例如: bp-new-workflow"
                disabled={isSubmitting}
              />
              <OmniSelect
                label="類別"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="E">E - 環境 (Environmental)</option>
                <option value="S">S - 社會 (Social)</option>
                <option value="G">G - 治理 (Governance)</option>
              </OmniSelect>
              <OmniInput
                label="適用產業"
                name="industry"
                value={formData.industry || ''}
                onChange={handleInputChange}
                placeholder="例如: General Corporate, High-Tech Manufacturing"
                disabled={isSubmitting}
                required
              />
              <OmniInput
                label="標題"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="例如: Render Workflow: New Task"
                disabled={isSubmitting}
                required
              />
              <OmniTextarea
                label="策略詳情"
                name="strategy"
                value={formData.strategy || ''}
                onChange={handleInputChange}
                placeholder="詳細描述工作流程的策略與目標"
                disabled={isSubmitting}
                required
              />
              <OmniInput
                label="標竿來源"
                name="benchmark_source"
                value={formData.benchmark_source || ''}
                onChange={handleInputChange}
                placeholder="例如: Render Workflows SDK Examples"
                disabled={isSubmitting}
              />
              <div className="grid grid-cols-2 gap-4">
                <OmniInput
                  label="影響分數 (0-100)"
                  name="impact_score"
                  type="number"
                  value={formData.impact_score !== undefined ? formData.impact_score.toString() : '50'}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
                <OmniInput
                  label="標籤 (以逗號分隔)"
                  name="tags"
                  value={formData.tags ? formData.tags.join(', ') : ''}
                  onChange={handleInputChange}
                  placeholder="例如: DataPipeline, Automation"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">T5 Compliance:</p>
                {Object.keys(formData.t5_compliance || {}).map(key => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={(formData.t5_compliance as any)?.[key] || false}
                      onChange={handleComplianceChange}
                      disabled={isSubmitting}
                      className="form-checkbox h-4 w-4 text-cyan-600 transition duration-150 ease-in-out bg-slate-700 border-slate-600 rounded"
                    />
                    <label htmlFor={key} className="text-sm text-slate-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              
              <OmniButton type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {isSubmitting ? '提交中...' : '提交新的最佳實踐'}
              </OmniButton>
            </form>
          </OmniBaseCard>
        )}

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">已註冊的工作流程邏輯</h2>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-cyan-400" size={32} />
            </div>
          ) : fetchError ? (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4">
              <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-400 font-bold text-lg mb-1">OmniBlueTable 連線異常或讀取失敗</h3>
                <p className="text-red-300/80 mb-3">{String(fetchError)}</p>
                <div className="bg-red-950/50 p-3 rounded-lg border border-red-500/20 text-sm text-red-200">
                  <strong>排解建議：</strong> 請確認 Supabase 服務是否正常運行，且 <code>SUPABASE_SERVICE_ROLE_KEY</code> 等環境變數皆已正確設定。
                </div>
              </div>
            </div>
          ) : bestPractices.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
              <Info className="text-slate-500 mb-4" size={48} />
              <p className="text-slate-400 text-lg font-medium">目前尚未同步任何工作流程</p>
              <p className="text-slate-500 text-sm mt-2">請嘗試執行同步腳本或確認資料庫中是否存在最佳實踐資料。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestPractices.map((bp: BestPractice) => (
                <OmniBaseCard key={bp.id} variant="glass" className="p-6 transition-all duration-300 hover:border-cyan-500/30">
                  <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
                    <ShieldCheck size={18} className="text-cyan-400" /> {bp.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{bp.strategy}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bp.tags.map(tag => (
                      <OmniBadge key={tag} variant="secondary" size="xs">{tag}</OmniBadge>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Category: <span className="text-slate-300">{bp.category}</span></p>
                    <p>Industry: <span className="text-slate-300">{bp.industry}</span></p>
                    <p>Impact Score: <span className="text-slate-300">{bp.impact_score}</span></p>
                    <p>Last Verified: <span className="text-slate-300">{bp.last_verified}</span></p>
                  </div>
                </OmniBaseCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
