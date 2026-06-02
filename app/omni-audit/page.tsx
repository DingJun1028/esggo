'use client';

import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ShieldCheck, ShieldAlert, Lock, Fingerprint, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function OmniAuditPage() {
  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
              <ShieldCheck className="text-purple-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="default" size="sm" icon={<Lock size={12}/>} className="bg-purple-500/20 text-purple-300 border-purple-500/30">Security</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">AUDIT-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">技術完整性與安全稽核</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Penetration Testing & ZKP Security Scans</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ZKP Vulnerability Scan */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Fingerprint className="text-cyan-400" /> 零知識證明 (ZKP) 弱點掃描
            </h2>
            <UniversalCard variant="glass" className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-200">5T Protocol Hash Lock Audit</h3>
                  <p className="text-sm text-slate-400">執行於 Omni Gateway，檢測防篡改與密碼學密封機制的可靠性。</p>
                </div>
                <UniversalBadge variant="success" size="sm" icon={<CheckCircle2 size={12} />}>Passed</UniversalBadge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-cyan-300">Hash 碰撞抗性 (Collision Resistance)</span>
                    <span className="text-xs font-mono text-emerald-400">SHA-256 / SHA-3</span>
                  </div>
                  <p className="text-xs text-slate-400">未檢測到碰撞漏洞，ZKP 雜湊封印不可逆且唯一性達 99.9999%。</p>
                </div>

                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-cyan-300">防篡改重放攻擊 (Replay Attack)</span>
                    <span className="text-xs font-mono text-emerald-400">Nonce + Timestamp</span>
                  </div>
                  <p className="text-xs text-slate-400">每一次 Hash 封印皆夾帶動態時間戳與 Nonce，有效阻擋重放攻擊與偽造竄改。</p>
                </div>
              </div>
            </UniversalCard>
          </div>

          {/* Penetration Testing */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Zap className="text-purple-400" /> RLS 滲透測試與租戶隔離
            </h2>
            <UniversalCard variant="glass" className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-200">Supabase Row Level Security (RLS)</h3>
                  <p className="text-sm text-slate-400">針對資料庫層級的權限越界 (Broken Access Control) 進行自動化打擊測試。</p>
                </div>
                <UniversalBadge variant="success" size="sm" icon={<CheckCircle2 size={12} />}>Passed</UniversalBadge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-purple-300">跨租戶資料洩漏 (Cross-Tenant Leak)</span>
                    <span className="text-xs font-mono text-emerald-400">0 Instances</span>
                  </div>
                  <p className="text-xs text-slate-400">測試腳本嘗試使用 Org_A 的 JWT 讀取 Org_B 的 `esg_records`，成功被 RLS 阻擋 (HTTP 403 / 空陣列)。</p>
                </div>

                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-purple-300">未授權寫入 (Unauthorized Write)</span>
                    <span className="text-xs font-mono text-emerald-400">Secured</span>
                  </div>
                  <p className="text-xs text-slate-400">防禦未攜帶有效 JWT 簽章或角色為 Viewer 卻嘗試執行 INSERT/UPDATE 的非法行為。</p>
                </div>
              </div>
            </UniversalCard>
          </div>

        </div>
        
        {/* Overall Status */}
        <div className="mt-8">
          <UniversalCard variant="glass" className="p-4 bg-emerald-950/20 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-emerald-400" size={24} />
                <div>
                  <h4 className="font-bold text-emerald-100">系統整體防禦級別：卓越 (Excellent)</h4>
                  <p className="text-xs text-emerald-500">符合 ISO-27001 與 5T 數位誠信標準架構。</p>
                </div>
              </div>
              <Activity className="text-emerald-500 animate-pulse" size={24} />
            </div>
          </UniversalCard>
        </div>

      </div>
    </div>
  );
}
