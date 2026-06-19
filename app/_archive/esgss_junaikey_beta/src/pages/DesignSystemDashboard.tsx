import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import ProgressRing from '@/components/ui/ProgressRing';
import RadarChart from '@/components/ui/RadarChart';
import StateMachineDisplay, { VerificationState } from '@/components/ui/StateMachineDisplay';
import ServiceJourneyBelt from '@/components/ui/ServiceJourneyBelt';
import GuidanceHalo from '@/components/ui/GuidanceHalo';
import MentorshipBubble from '@/components/ui/MentorshipBubble';

export default function DesignSystemDashboard() {
  const [verifyState, setVerifyState] = useState<VerificationState>('PASS');

  const journeySteps = [
    { id: '1', label: 'Selection', zh_label: '模組選擇', status: 'DONE' as const },
    { id: '2', label: 'Input', zh_label: '數據錄入', status: 'CURRENT' as const },
    { id: '3', label: 'Analysis', zh_label: '分析生成', status: 'PENDING' as const },
  ];

  const radarData = [
    { label: 'Tangible', value: 85 },
    { label: 'Traceable', value: 72 },
    { label: 'Trackable', value: 90 },
    { label: 'Transparent', value: 65 },
    { label: 'Trustworthy', value: 88 },
  ];

  return (
    <div className="min-h-screen mesh-gradient text-white p-8 lg:p-12 font-display overflow-y-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 text-primary mb-4">
          <span className="material-symbols-outlined text-4xl">auto_awesome</span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Tiffany & 5T Design System
          </h1>
        </div>
        <p className="text-[#9cbab7] text-lg max-w-3xl leading-relaxed">
          原子組件庫 (Atomic Components) v1.0.4 • 主題：
          <span className="text-primary font-bold">Tiffany 藍液態玻璃美學</span>。 整合 5T
          數據視覺化與教育導向引導流程。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left Column: Components */}
        <div className="xl:col-span-8 space-y-16">
          {/* Section 1: Buttons */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">01 按鈕交互 (Button States)</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="liquid-glass p-8 rounded-2xl flex flex-wrap gap-6 items-center">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Primary & Glow
                </p>
                <Button variant="primary">Tiffany Action</Button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Secondary Glass
                </p>
                <Button variant="secondary">Logic Check</Button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Outline Spec
                </p>
                <Button variant="outline">Secondary</Button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Hash Lock Style
                </p>
                <Button variant="danger">Locked Action</Button>
              </div>
            </div>
          </section>

          {/* Section 2: Inputs & Tags */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">02 輸入框 (Input)</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="liquid-glass p-8 rounded-2xl space-y-6">
                <Input label="Normal State" placeholder="請輸入主權位址..." />
                <Input
                  label="Error State (Hash Lock)"
                  error="SHA-256 驗證不匹配"
                  defaultValue="0xINVALID"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">03 5T 標籤 (Tags)</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="liquid-glass p-8 rounded-2xl grid grid-cols-1 gap-4">
                <Tag category="Tangible" value="98%" />
                <Tag category="Trustworthy" value="Consensus" />
                <Tag category="Trackable" />
              </div>
            </div>
          </section>

          {/* Section 3: Journey Belt */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">04 服務旅程 (Journey)</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <ServiceJourneyBelt steps={journeySteps} />
          </section>

          {/* Section 4: States & Logic */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">05 狀態機 (Logic Gate)</h2>
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setVerifyState('PASS')}>
                  PASS
                </Button>
                <Button size="sm" variant="danger" onClick={() => setVerifyState('LOCKED')}>
                  LOCK
                </Button>
              </div>
            </div>
            <StateMachineDisplay state={verifyState} />
          </section>
        </div>

        {/* Right Column: Visuals & Guides */}
        <div className="xl:col-span-4 space-y-12">
          {/* Charts */}
          <section className="liquid-glass p-8 rounded-3xl space-y-12">
            <h2 className="text-xl font-bold font-display border-b border-white/10 pb-4">
              Data Vitals
            </h2>

            <div className="flex flex-col items-center gap-12">
              <div className="space-y-4 flex flex-col items-center">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  Liquid Progress
                </p>
                <ProgressRing value={72} size={160} />
              </div>

              <div className="space-y-4 flex flex-col items-center">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  Octagon Radar
                </p>
                <RadarChart data={radarData} size={220} />
              </div>
            </div>
          </section>

          {/* Assistant Preview */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold font-display border-b border-white/10 pb-4 px-2">
              Mentorship Preview
            </h2>
            <MentorshipBubble
              role="MENTOR"
              message="你好！我是教學小助手。點擊左側的「數據錄入」圖標，我將引導你完成首份 ESG 報告的數據申報。"
            />
            <div className="flex justify-center py-4">
              <GuidanceHalo>
                <div className="size-16 rounded-xl bg-primary/20 border-2 border-primary flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
              </GuidanceHalo>
            </div>
            <MentorshipBubble role="LEARNER" message="好的，我現在開始錄入。" />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/10 pt-8 text-center">
        <p className="text-xs text-[#5c7a77] uppercase tracking-[0.3em]">
          © 2024 ESGss JunAiKey Design System Portal • v1.0.4-STELLAR
        </p>
      </footer>
    </div>
  );
}
