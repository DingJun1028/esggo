'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Badge } from '@/components/ui/Badge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalInput } from '@/components/ui/universal/UniversalInput';
import { useToast } from '@/components/ui/toast-provider';
import { useGetMyCompanyProfile, useUpsertCompanyProfile } from '@/src/dataconnect-generated/react';
import { dataConnect } from '@/lib/firebase';
import { Building2, MapPin, Target, Lightbulb, Users, DollarSign, Activity, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import { usePedersenProof } from '@/hooks/usePedersenProof';

const profileSchema = z.object({
  name: z.string().min(1, '企業名稱 Company Name 為必填項目'),
  industry: z.string().optional(),
  headquarters: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  employeeCount: z.string().optional(),
  revenueTwd: z.string().optional(),
  capitalTwd: z.string().optional(),
});

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    headquarters: '',
    vision: '',
    mission: '',
    employeeCount: '',
    revenueTwd: '',
    capitalTwd: '',
  });

  const { data, isLoading, error } = useGetMyCompanyProfile(dataConnect);
  const { mutateAsync: upsertProfile, isPending: isSaving } = useUpsertCompanyProfile(dataConnect);
  const { toast } = useToast();
  const { sealValue, isProcessing: isSealing } = usePedersenProof();

  // 🌟 深度刻印狀態
  const [isDeepEngraved, setIsDeepEngraved] = useState(false);
  const [commitment, setCommitment] = useState<string | null>(null);

  useEffect(() => {
    if (data?.companyProfiles && data.companyProfiles.length > 0) {
      const profile = data.companyProfiles[0];
      setFormData({
        name: profile.name || '',
        industry: profile.industry || '',
        headquarters: profile.headquarters || '',
        vision: profile.vision || '',
        mission: profile.mission || '',
        employeeCount: profile.employeeCount?.toString() || '',
        revenueTwd: profile.revenueTwd?.toString() || '',
        capitalTwd: profile.capitalTwd?.toString() || '',
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeepEngrave = async () => {
    if (!formData.capitalTwd) {
      toast('請先輸入實收資本額以進行深度刻印', 'warning');
      return;
    }
    
    const val = parseFloat(formData.capitalTwd);
    const result = await sealValue(val);
    setCommitment(result.commitment);
    setIsDeepEngraved(true);
    toast('組織資產已成功執行 Pedersen 深度刻印', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Validation
    const validationResult = profileSchema.safeParse(formData);
    if (!validationResult.success) {
      toast(validationResult.error.issues[0].message, 'error');
      return;
    }

    try {
      const existingId = data?.companyProfiles?.[0]?.id;
      
      await upsertProfile({
        id: existingId,
        name: formData.name,
        industry: formData.industry,
        vision: formData.vision,
        mission: formData.mission,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount, 10) : null,
        revenueTwd: formData.revenueTwd ? parseFloat(formData.revenueTwd) : null,
        capitalTwd: formData.capitalTwd ? parseFloat(formData.capitalTwd) : null,
      });

      toast('Profile updated successfully!', 'success');
    } catch (err: unknown) {
      console.error('Error saving profile:', err);
      toast(err.message || 'Failed to save profile.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-600 p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-slate-400">Loading Profile Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-600 p-8 flex items-center justify-center">
        <UniversalCard title="Error Loading Profile" variant="glow" className="max-w-md border-red-200 bg-white">
          <p className="text-red-500 text-sm mb-4">{error.message}</p>
        </UniversalCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            Onboarding 旅程
          </UniversalBadge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            企業管理 <span className="text-slate-400 font-light">| Profile</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl font-medium">
            企業管理頁是企業基本設定與治理架構的主控頁。此處填寫的資料將作為 ESG 報告與數位雙生的核心基石。
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UniversalCard
              title="基本資料 Basic Information"
              variant="glow"
              className="flex flex-col gap-4 md:col-span-2 bg-white/80 backdrop-blur-xl border-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UniversalInput
                  label="企業名稱 Company Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<Building2 size={16} className="text-cyan-600" />}
                  placeholder="輸入企業全名"
                  className="bg-slate-50/50"
                />
                <UniversalInput
                  label="所屬產業 Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  icon={<Building2 size={16} className="text-cyan-600" />}
                  placeholder="例如: 半導體業, 製造業..."
                  className="bg-slate-50/50"
                />
                <UniversalInput
                  label="總部位置 Headquarters"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  icon={<MapPin size={16} className="text-cyan-600" />}
                  placeholder="例如: 台灣台北市"
                  className="bg-slate-50/50"
                />
                <UniversalInput
                  label="員工人數 Employee Count"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  icon={<Users size={16} className="text-cyan-600" />}
                  placeholder="輸入總員工人數"
                  className="bg-slate-50/50"
                />
              </div>
            </UniversalCard>

            <UniversalCard
              title="願景與使命 Vision & Mission"
              variant="bordered"
              className="flex flex-col gap-4 md:col-span-2 bg-white/80 backdrop-blur-xl border-slate-100 shadow-sm"
            >
               <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-2 w-full">
                    <label className="text-xs font-black uppercase tracking-widest text-cyan-700 flex items-center gap-2">
                      <Lightbulb size={14} /> 企業願景 Vision
                    </label>
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleChange}
                      rows={3}
                      className="rounded-xl border text-sm transition-all duration-300 w-full bg-slate-50/50 text-slate-900 placeholder:text-slate-300 p-4 border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                      placeholder="請描述企業的長期願景..."
                    />
                 </div>
                 <div className="flex flex-col gap-2 w-full">
                    <label className="text-xs font-black uppercase tracking-widest text-cyan-700 flex items-center gap-2">
                      <Target size={14} /> 企業使命 Mission
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      rows={3}
                      className="rounded-xl border text-sm transition-all duration-300 w-full bg-slate-50/50 text-slate-900 placeholder:text-slate-300 p-4 border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                      placeholder="請描述企業的具體使命..."
                    />
                 </div>
               </div>
            </UniversalCard>

            <UniversalCard
              title="財務概況 Financials (TWD)"
              variant="glass"
              className="flex flex-col gap-4 md:col-span-2 bg-white/80 backdrop-blur-xl border-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UniversalInput
                  label="年營業額 Revenue"
                  name="revenueTwd"
                  type="number"
                  step="0.01"
                  value={formData.revenueTwd}
                  onChange={handleChange}
                  icon={<DollarSign size={16} className="text-emerald-600" />}
                  placeholder="輸入年營業額 (新台幣)"
                  className="bg-slate-50/50"
                />
                <UniversalInput
                  label="實收資本額 Capital"
                  name="capitalTwd"
                  type="number"
                  step="0.01"
                  value={formData.capitalTwd}
                  onChange={handleChange}
                  icon={<DollarSign size={16} className="text-emerald-600" />}
                  placeholder="輸入資本額 (新台幣)"
                  className="bg-slate-50/50"
                />
              </div>

              {/* 🛡️ Deep Engraving Action */}
              <div className="mt-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Fingerprint size={80} className="text-cyan-600" />
                </div>
                <div className="space-y-1 relative z-10 text-center md:text-left">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 justify-center md:justify-start">
                    <ShieldCheck size={16} className="text-cyan-600" />
                    Pedersen 深度刻印 (Deep Engraving)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium max-w-md">
                    透過同態加密技術封印企業財務邊界，確保第三方可在不讀取原始數據的情況下驗證財務一致性。
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0 relative z-10">
                   {isDeepEngraved ? (
                      <div className="flex flex-col items-end gap-1">
                         <Badge variant="verified" className="px-3 py-1 text-[10px]">VERIFIED_COMMITMENT</Badge>
                         <span className="text-[9px] font-mono text-cyan-600/60 truncate max-w-[150px]">
                           {commitment}
                         </span>
                      </div>
                   ) : (
                      <button 
                        type="button"
                        onClick={handleDeepEngrave}
                        disabled={isSealing}
                        className="px-6 py-2 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        <Lock size={12} /> 執行資產封印
                      </button>
                   )}
                </div>
              </div>
            </UniversalCard>
          </div>

          <div className="flex justify-end pt-8 pb-12">
            <UniversalButton 
              type="submit" 
              variant="primary" 
              disabled={isSaving}
              className="min-w-[240px] h-12 rounded-xl bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-100 font-black text-sm uppercase tracking-[0.2em]"
            >
              {isSaving ? '儲存中 Saving...' : '儲存設定 Save Profile'}
            </UniversalButton>
          </div>
        </form>
      </div>
    </div>
  );
}
