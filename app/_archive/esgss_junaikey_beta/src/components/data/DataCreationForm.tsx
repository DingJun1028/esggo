/**
 * 數據創建表單組件
 * --------------------------------------------------
 * [功能] 創建符合 5T (5可) 協議的 ESG 數據
 * [特色] 自動 5T 結構生成、六德指標輸入、即時 5T 驗證
 */

import React, { useState, useEffect } from 'react';
import {
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
  Plus,
  X,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react';
import { FiveTValidator } from '@/omni/services/FiveTValidator';
import type { IComponentCore, MeridianFlow, IMeritProfile10, LifecycleHook } from '@/types/core';

interface DataCreationFormProps {
  initialData?: Partial<IComponentCore>;
  onSave?: (data: IComponentCore) => void;
  onCancel?: () => void;
}

export const DataCreationForm: React.FC<DataCreationFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  // 表單狀態
  const [formData, setFormData] = useState<Partial<IComponentCore>>({
    uuid: crypto.randomUUID(),
    version: '7.0.0',
    timestamp: Date.now(),
    meridian: 'INWARD_REN',
    virtues: {
      intelligence: 5,
      benevolence: 5,
      integrity: 5,
      courage: 5,
      temperance: 5,
      harmony: 5,
    },
    evidence: {
      tangible: {
        metric: '',
        visual_grade: 'GOLD',
      },
      traceable: {
        source_origin: '',
      },
      trackable: {
        lifecycle_hooks: [],
      },
      transparent: {
        formula: '',
      },
      trustworthy: {
        hash_lock: '',
        is_frozen: false,
      },
    },
    data: {},
    ...initialData,
  });

  // 驗證狀態
  const [validationReport, setValidationReport] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  // 即時驗證
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (formData.evidence?.traceable?.source_origin && formData.evidence?.trustworthy?.hash_lock) {
      setIsValidating(true);
      timer = setTimeout(() => {
        const report = FiveTValidator.validate5T(formData as IComponentCore);
        setValidationReport(report);
        setIsValidating(false);
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData]);

  // 更新基礎欄位
  const updateField = (field: keyof IComponentCore, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 更新證據欄位
  const updateEvidenceField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      evidence: {
        ...prev.evidence!,
        [field]: value,
      },
    }));
  };

  // 更新六德指標
  const updateVirtues = (field: keyof IMeritProfile10, value: number) => {
    setFormData(prev => ({
      ...prev,
      virtues: {
        ...prev.virtues!,
        [field]: value,
      },
    }));
  };

  // 計算雜湊鎖定
  const calculateHashLock = async () => {
    const dataToHash = JSON.stringify({
      uuid: formData.uuid,
      timestamp: formData.timestamp,
      meridian: formData.meridian,
      virtues: formData.virtues,
      evidence: {
        traceable: { source_origin: formData.evidence?.traceable?.source_origin },
        transparent: { formula: formData.evidence?.transparent?.formula },
      },
      data: formData.data,
    });

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataToHash));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    updateEvidenceField('hash_lock', hashHex);
  };

  // 保存數據
  const handleSave = () => {
    const completeData: IComponentCore = {
      ...formData,
      timestamp: Date.now(),
      evidence: {
        ...formData.evidence!,
        trackable: {
          lifecycle_hooks: [
            ...(formData.evidence?.trackable?.lifecycle_hooks || []),
            {
              event: 'created',
              timestamp: Date.now(),
              actor: 'user',
              metadata: { action: 'manual_5t_creation' },
            } as LifecycleHook,
          ],
        },
      },
    } as IComponentCore;

    // 驗證
    const report = FiveTValidator.validate5T(completeData);
    if (!report.trustworthy) {
      alert('數據未達 5T Trustworthy 等級，請檢查必填欄位');
      return;
    }

    // 凍結數據
    Object.freeze(completeData);
    // 遞迴凍結內部對象
    Object.freeze(completeData.evidence);
    Object.freeze(completeData.virtues);

    onSave?.(completeData);
  };

  return (
    <div className="glass-panel-premium p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto my-8">
      <div className="gradient-border-top from-emerald-500 via-blue-500 to-purple-500" />

      {/* 头部區域 */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-slate-400 mb-2 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            晶粹化 5T 數據資產
          </h2>
          <p className="text-slate-400 text-sm font-light">
            符合 5T 協議：5可 (溯、蹤、透、測、信)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="btn-glow-primary px-6 py-2 rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            刻印資產
          </button>
        </div>
      </div>

      {/* --- 驗證報告欄 --- */}
      {validationReport && (
        <div
          className={`mb-8 p-4 rounded-xl border flex items-center gap-4 ${validationReport.trustworthy
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-amber-500/10 border-amber-500/20'
            }`}
        >
          <div
            className={`p-2 rounded-full ${validationReport.trustworthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
          >
            {validationReport.trustworthy ? <Shield size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1">
            <h4
              className={`font-bold ${validationReport.trustworthy ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {validationReport.trustworthy ? '5T 協議驗證通過' : '數據完整性不足'}
            </h4>
            <div className="flex gap-4 mt-1 text-xs font-mono opacity-80">
              {['t1', 't2', 't3', 't4', 't5'].map(key => (
                <span
                  key={key}
                  className={
                    validationReport.results[key].passed ? 'text-emerald-300' : 'text-rose-300'
                  }
                >
                  {key.toUpperCase()}: {validationReport.results[key].passed ? 'PASS' : 'FAIL'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- 左列：核心協議 & 德行 --- */}
        <div className="space-y-6">
          {/* 5T Protocol Core */}
          <div className="glass-panel p-6 border border-blue-500/10 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-4 text-blue-300 font-bold text-sm uppercase tracking-wider">
              <Zap className="w-4 h-4" /> 5T 協議核心 (Core)
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs text-slate-400 ml-1">UUID / Version</label>
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-[10px] text-slate-500 bg-black/40 p-2.5 rounded-lg border border-white/5 truncate">
                    {formData.uuid}
                  </div>
                  <div className="w-24 font-mono text-[10px] text-slate-500 bg-black/40 p-2.5 rounded-lg border border-white/5 text-center">
                    {formData.version}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">任督二脈 (Meridian)</label>
                <select
                  className="input-glass w-full text-sm"
                  value={formData.meridian}
                  onChange={e => updateField('meridian', e.target.value)}
                >
                  <option value="INWARD_REN">任脈 (內化/治理)</option>
                  <option value="OUTWARD_DU">督脈 (外顯/影響)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">資產等級 (Grade)</label>
                <select
                  className="input-glass w-full text-sm"
                  value={formData.evidence?.tangible?.visual_grade}
                  onChange={e =>
                    updateEvidenceField('tangible', {
                      ...formData.evidence?.tangible,
                      visual_grade: e.target.value,
                    })
                  }
                >
                  <option value="GOLD">基本金 (Gold)</option>
                  <option value="PLATINUM">精煉鉑 (Platinum)</option>
                  <option value="SOVEREIGN">主權級 (Sovereign)</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs text-slate-400 ml-1">數據來源 (Source Origin) *</label>
                <input
                  type="text"
                  className="input-glass w-full"
                  placeholder="e.g. CSR_Report_2025, Sensor_Hub_A1"
                  value={formData.evidence?.traceable?.source_origin || ''}
                  onChange={e => updateEvidenceField('traceable', {
                    ...formData.evidence?.traceable,
                    source_origin: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs text-slate-400 ml-1">
                  透明演算公式 (Logic Formula) *
                </label>
                <textarea
                  className="input-glass w-full h-16 font-mono text-xs"
                  placeholder="e.g. CO2e = Energy_Consumed * Emission_Factor"
                  value={formData.evidence?.transparent?.formula || ''}
                  onChange={e => updateEvidenceField('transparent', {
                    ...formData.evidence?.transparent,
                    formula: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs text-slate-400 ml-1">信實鎖定 (Hash Lock)</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-glass w-full font-mono text-[10px] pr-8"
                    value={formData.evidence?.trustworthy?.hash_lock || ''}
                    readOnly
                    placeholder="請點擊右側圖標生成雜湊..."
                  />
                  <button
                    onClick={calculateHashLock}
                    className="absolute right-1 top-1 p-1.5 hover:bg-white/10 rounded text-emerald-400 hover:text-white transition-colors"
                    title="計算 5T 雜湊"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 右列：六德指標 (Virtues) --- */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-emerald-500/10 bg-emerald-500/5 h-full">
            <div className="flex items-center gap-2 mb-6 text-emerald-300 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> 善向六德指標 (Virtue Radar)
            </div>

            <div className="space-y-5">
              {[
                { key: 'intelligence', label: '智 (Intelligence)', desc: 'AI 賦能、知識產權' },
                { key: 'benevolence', label: '仁 (Benevolence)', desc: '社會回饋、員工福祉' },
                { key: 'integrity', label: '誠 (Integrity)', desc: '數據真實、合規披露' },
                { key: 'courage', label: '勇 (Courage)', desc: '技術突破、淨零決心' },
                { key: 'temperance', label: '節 (Temperance)', desc: '資源節約、減量成效' },
                { key: 'harmony', label: '和 (Harmony)', desc: '供應鏈共生、多元包容' },
              ].map(v => (
                <div key={v.key} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-xs text-slate-200">{v.label}</label>
                    <span className="text-xs font-mono text-emerald-400">
                      {(formData.virtues as any)[v.key]}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      className="flex-1 accent-emerald-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                      value={(formData.virtues as any)[v.key]}
                      onChange={e =>
                        updateVirtues(v.key as keyof IMeritProfile10, parseInt(e.target.value))
                      }
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{v.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-black/30 border border-white/5 text-center">
              <p className="text-[10px] text-slate-500 mb-1">Hash Lock Status</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() =>
                    updateEvidenceField('trustworthy', {
                      ...formData.evidence?.trustworthy,
                      is_frozen: !formData.evidence?.trustworthy?.is_frozen,
                    })
                  }
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${formData.evidence?.manifest?.is_crystallized
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                >
                  {formData.evidence?.trustworthy?.is_frozen ? '💎 已鎖定' : '⚙️ 等待鎖定'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
