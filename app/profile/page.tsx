'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalInput } from '@/components/ui/universal/UniversalInput';
import { useToast } from '@/components/ui/toast-provider';
import { useGetMyCompanyProfile, useUpsertCompanyProfile } from '@/src/dataconnect-generated/react';
import { dataConnect } from '@/lib/firebase';
import { Building2, MapPin, Target, Lightbulb, Users, DollarSign, Activity } from 'lucide-react';

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
  const [upsertProfile, { isLoading: isSaving }] = useUpsertCompanyProfile(dataConnect);
  const { toast } = useToast();

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
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast(err.message || 'Failed to save profile.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void-stark text-white p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-cyan-core animate-spin" />
          <p className="text-white/60">Loading Profile Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void-stark text-white p-8 flex items-center justify-center">
        <UniversalCard title="Error Loading Profile" variant="glow" className="max-w-md border-red-500/50">
          <p className="text-red-400 text-sm mb-4">{error.message}</p>
        </UniversalCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            Onboarding 旅程
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            企業管理 Profile
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            企業管理頁是企業基本設定與治理架構的主控頁。此處填寫的資料將作為 ESG 報告與數位雙生的核心基石。
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UniversalCard
              title="基本資料 Basic Information"
              variant="glow"
              className="flex flex-col gap-4 md:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UniversalInput
                  label="企業名稱 Company Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<Building2 size={16} />}
                  placeholder="輸入企業全名"
                />
                <UniversalInput
                  label="所屬產業 Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  icon={<Building2 size={16} />}
                  placeholder="例如: 半導體業, 製造業..."
                />
                <UniversalInput
                  label="總部位置 Headquarters"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  icon={<MapPin size={16} />}
                  placeholder="例如: 台灣台北市"
                />
                <UniversalInput
                  label="員工人數 Employee Count"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  icon={<Users size={16} />}
                  placeholder="輸入總員工人數"
                />
              </div>
            </UniversalCard>

            <UniversalCard
              title="願景與使命 Vision & Mission"
              variant="bordered"
              className="flex flex-col gap-4 md:col-span-2"
            >
               <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-bold uppercase tracking-widest text-cyan-core/80 flex items-center gap-2">
                      <Lightbulb size={14} /> 企業願景 Vision
                    </label>
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleChange}
                      rows={3}
                      className="rounded-lg border text-sm transition-all duration-normal w-full bg-[var(--theme-base)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]/50 p-3 border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] focus:outline-none"
                      placeholder="請描述企業的長期願景..."
                    />
                 </div>
                 <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-bold uppercase tracking-widest text-cyan-core/80 flex items-center gap-2">
                      <Target size={14} /> 企業使命 Mission
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      rows={3}
                      className="rounded-lg border text-sm transition-all duration-normal w-full bg-[var(--theme-base)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]/50 p-3 border-[var(--theme-border)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] focus:outline-none"
                      placeholder="請描述企業的具體使命..."
                    />
                 </div>
               </div>
            </UniversalCard>

            <UniversalCard
              title="財務概況 Financials (TWD)"
              variant="glass"
              className="flex flex-col gap-4 md:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UniversalInput
                  label="年營業額 Revenue"
                  name="revenueTwd"
                  type="number"
                  step="0.01"
                  value={formData.revenueTwd}
                  onChange={handleChange}
                  icon={<DollarSign size={16} />}
                  placeholder="輸入年營業額 (新台幣)"
                />
                <UniversalInput
                  label="實收資本額 Capital"
                  name="capitalTwd"
                  type="number"
                  step="0.01"
                  value={formData.capitalTwd}
                  onChange={handleChange}
                  icon={<DollarSign size={16} />}
                  placeholder="輸入資本額 (新台幣)"
                />
              </div>
            </UniversalCard>
          </div>

          <div className="flex justify-end pt-4">
            <UniversalButton 
              type="submit" 
              variant="primary" 
              disabled={isSaving}
              className="min-w-[200px]"
            >
              {isSaving ? '儲存中 Saving...' : '儲存設定 Save Profile'}
            </UniversalButton>
          </div>
        </form>
      </div>
    </div>
  );
}
