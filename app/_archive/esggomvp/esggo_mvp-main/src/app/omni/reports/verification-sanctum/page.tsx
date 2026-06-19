'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, Database, Link as LinkIcon, BadgeCheck, BarChart3, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useOmniAtoms, IOmniAtom, calculateStability } from '@/hooks/useOmniAtoms';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { useOmniGenesis } from '@/context/OmniGenesisContext';
import { omniLogger, LogCategory } from '@/core/omniLogger';
import { sealReport } from '@/core/ncb/report-actions';
import { OmniFunnel } from '@/components/omni/Visualizations/FunnelChart';
import { OmniTable } from '@/components/omni/liquid-glass/OmniTable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function VerificationSanctumPage() {
  const { locale } = useLanguage();
  const { atoms, loading } = useOmniAtoms();
  const { setResonating } = useOmniGenesis();

  const langKey = locale === 'en' ? 'en' : 'tw';

  const handleSeal = async (uuid: string) => {
    try {
      setResonating(true);
      omniLogger.info(LogCategory.SYSTEM, `Starting Amber Freeze ceremony for ${uuid}`);

      const result = await sealReport(uuid);

      if (result.success) {
        omniLogger.info(LogCategory.SYSTEM, `Atom ${uuid} has been permanently sealed with Hash: ${result.hash}`);
        // 觸發全域成功反饋
        alert(`🔒 5T 封存成功！\n已被鎖定於永恆宮殿。\nSHA-256: ${result.hash}`);
      } else {
        throw new Error('Sealing action returned failure');
      }
    } catch (e) {
      omniLogger.error(LogCategory.SECURITY, `Sealing failed for ${uuid}`, e);
      alert('❌ 封存失敗：請檢查 5T 協議連結狀態。');
    } finally {
      setResonating(false);
    }
  };

  return (
    <div className="min-h-screen bg-omni-surface text-omni-text-main p-4 lg:p-8">
      <PageHeader
        title={langKey === 'tw' ? '永續聖殿' : 'Sealing Sanctum'}
        subtitle={langKey === 'tw' ? '「琥珀封存」：透過 SHA-256 協議鎖定流動數據，轉化為永恆知識資產。' : 'Amber Freeze: Locking fluid data via SHA-256 into immutable knowledge assets.'}
        category="TRUST LAYER"
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 p-8 bg-omni-primary/5 border border-omni-primary/20 rounded-[2.5rem] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-omni-primary/10 to-transparent pointer-events-none" />
              <div className="size-16 bg-omni-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,166,176,0.4)] relative z-10">
                <ShieldCheck size={32} />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-black">{langKey === 'tw' ? '5T 協議狀態：Trustworthy (不可篡改)' : '5T Protocol: Trustworthy Status'}</h2>
                <p className="text-xs text-omni-primary font-bold tracking-[0.2em] mt-1">
                  {loading ? 'SYNCHRONIZING GRAVITY...' : `STABILITY LEVEL: TRANSCENDED | ${atoms.filter(a => a.is_frozen).length} ASSETS SEALED`}
                </p>
                <div className="mt-4 flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-omni-text-muted font-bold uppercase">共鳴動能</span>
                    <span className="text-lg font-black text-omni-text-main">98.2%</span>
                  </div>
                  <div className="w-px h-8 bg-omni-glass-border self-center" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-omni-text-muted font-bold uppercase">系統熵值</span>
                    <span className="text-lg font-black text-omni-danger">0.02</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <OmniFunnel
            totalStability={98}
            steps={[
              { id: 'perceive', label: 'Perceive', value: 95, indicator: 'Tangible' },
              { id: 'forge', label: 'Forge', value: 82, indicator: 'Traceable' },
              { id: 'verify', label: 'Verify', value: 70, indicator: 'Transparent' },
              { id: 'seal', label: 'Seal', value: 50, indicator: 'Trustworthy' },
            ]}
          />
        </div>

        <div className="col-span-full">
          <OmniTable
            title={langKey === 'tw' ? '聖殿資產清單' : 'Sanctum Asset Ledger'}
            subtitle="5T_ATOMIC_RESONANCE_INDEX"
            data={atoms.map(a => ({
              ...a,
              name: a.data?.title || a.data?.name || 'Unnamed',
              status_label: a.is_frozen ? 'AMBER FROZEN' : 'ACTIVE DRAFT',
              stability: calculateStability(a).score + '%'
            }))}
            columns={[
              { key: 'name', header: '資產名稱' },
              { key: 'status_label', header: '狀態' },
              { key: 'stability', header: '5T 穩定度' },
              { key: 'uuid', header: '原子唯一碼 (UUID)' }
            ]}
            onSeal={(uuid) => handleSeal(uuid)}
          />
        </div>
      </div>

      {/* Teaching Column: Dharma of Trust */}
      <div className="mt-20 p-10 bg-omni-accent/5 border border-dashed border-omni-accent/20 rounded-[3rem] text-center max-w-4xl mx-auto">
        <BadgeCheck className="text-omni-accent mx-auto mb-6" size={48} />
        <h3 className="text-2xl font-black text-omni-accent mb-4 tracking-tight">服務即教學：何謂「琥珀封存」？</h3>
        <p className="text-omni-text-main leading-relaxed max-w-2xl mx-auto mb-8">
          在聖殿中，數據不再只是變數。透過不變性雜湊鎖定 (Hash Lock)，我們將數據「凍結」在最真實的瞬間。這不僅是技術上的安全性，更是對「知識即資產」的最高承諾。每一次封存，都是在為您的數位誠信增添一塊永恆的基石。
        </p>
        <div className="flex justify-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="size-2 rounded-full bg-omni-accent opacity-30 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-center gap-12 text-gray-600">
        <LinkIcon size={48} className="opacity-20" />
        <Database size={48} className="opacity-20" />
        <BadgeCheck size={48} className="opacity-20" />
      </div>
    </div>
  );
}