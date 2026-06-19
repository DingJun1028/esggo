import React, { useState, useEffect } from 'react';
import {
  Zap,
  Shield,
  Cpu,
  Settings,
  Activity,
  AlertCircle,
  ExternalLink,
  Search,
  Info,
  ChevronRight,
  Volume2,
  Gamepad2,
  Lightbulb,
} from 'lucide-react';
import { Badge, Button, Progress } from '../ui';

/**
 * Faith Tower Repair Mission (v8.4.1)
 * Steampunk Lab Aesthetic
 */
export const FaithTowerRepair: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [energy, setEnergy] = useState(85);
  const [stability, setStability] = useState(68);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [rayActive, setRayActive] = useState(false);

  const dialogues = [
    {
      name: '熵增幽靈',
      title: 'Entropy Ghost',
      text: '這座塔的數據正在崩解...你能看見那些隱藏在 ISO 14067 之後的真相嗎？丁俊洪，若無法釐清生命週期的邊界，信實之塔終將化為數據塵埃。',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHx89fV-XEpvWC91s2sg8GlP_KGqBPkjPYA0n2U8sByGEBiu1gH3py5TmYuQTUC19pcpyXxlrKv9dTzvsrnRqdswBgH6LYWhyYL25ZOofLpVsnyoDx9oC0oOPVoztY6tg-6tGKAHYeuOcBmhJryLjwrWfztMubM0g0eLdQDmouA5p2RKXgFcp481hAAZ5dzsg4hcQD4no81W71Ti7CYYQKPOGCiLx4AH3yUupPhzfEiXqCK0CQ-nbveUqvh7tzIqabycZz_QwwYcc',
    },
    {
      name: '熵增幽靈',
      title: 'Entropy Ghost',
      text: '實證射線是唯一能擊穿虛偽數據的利刃。對準那個不穩定的核心，釋放你的驗證能量！',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHx89fV-XEpvWC91s2sg8GlP_KGqBPkjPYA0n2U8sByGEBiu1gH3py5TmYuQTUC19pcpyXxlrKv9dTzvsrnRqdswBgH6LYWhyYL25ZOofLpVsnyoDx9oC0oOPVoztY6tg-6tGKAHYeuOcBmhJryLjwrWfztMubM0g0eLdQDmouA5p2RKXgFcp481hAAZ5dzsg4hcQD4no81W71Ti7CYYQKPOGCiLx4AH3yUupPhzfEiXqCK0CQ-nbveUqvh7tzIqabycZz_QwwYcc',
    },
  ];

  const handleFireRay = () => {
    setRayActive(true);
    setTimeout(() => {
      setRayActive(false);
      setStability(prev => Math.min(100, prev + 5));
      setEnergy(prev => Math.max(0, prev - 10));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#102222] text-white overflow-hidden flex flex-col font-sans z-[300]">
      {/* Background with Depth */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-sm brightness-[0.3] transition-all duration-700"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnV7FIKQkrFh2mNFkMTInTh9U2UC8AV8m-EZcb97FHiWFs4mz-lHF3pSAYPH7_AG7SoL2rBzKmSBC2W_KNs_rAis80WQRGuQt76r8my9PfFw-wvzLyTGziMQrhIJ3ZGi7PEamtF18i105dwE_vjcjrza6DsnekrzewQykZZnVxrCR7ZFopQwGWGFr4ZT-NUFPsGKslcFCEYgpJ_Zq_RFbgA5jUpD4l7geAU8iLCT44l3YBngYb_VybQfL3jcOyjT7QUegL8bwy_r0')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#102222] via-transparent to-transparent opacity-90" />

      {/* Header Overlay */}
      <header className="relative flex items-center justify-between px-10 py-4 border-b border-[#283939] bg-[#102222]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#0df2eb]/10 rounded-lg text-[#0df2eb]">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            InfoOne <span className="text-[#0df2eb]/60 font-light">信實之塔</span>
          </h2>
        </div>
        <div className="flex items-center gap-8">
          <Button
            className="bg-[#0df2eb] text-[#102222] font-black hover:brightness-110 shadow-[0_0_15px_rgba(13,242,235,0.4)]"
            onClick={onExit}
          >
            退出副本
          </Button>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold">DingJun Hong</p>
              <p className="text-[10px] text-[#0df2eb] uppercase tracking-widest">Master Auditor</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#0df2eb]/50 bg-black/40 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBCosPk55yCP3cMWrd7sjESsO3QyghlDj9JnW5MMtvmT-4LlOMY-aNNoLaG109u1Z1rp6WdQV9npvkDQv6d2QPqqjro9FHYFwBnIhOlBdfkfNlhpQFihg48EEOE_vrj68PDSNor48zGyQdv_mvnG792C5_dfdMhfaRmjiRXrIjIUkDp9d1LjDI871wb-LupxFjnohnZLWAbtNMOnmZ23ulwLHA8XPrnHC37WqFmzcPfKaYo7TD98TM1bVeUKtHV-g_uq3eRcKRVgc"
                alt="Avatar"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Perspective */}
      <main className="relative flex-1">
        {/* HUD: Left Stats */}
        <div className="absolute left-10 top-12 z-20 space-y-4">
          <div className="bg-[#0df2eb]/5 backdrop-blur-xl border border-[#0df2eb]/30 p-5 rounded-2xl min-w-[240px] shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-[#0df2eb] font-black uppercase tracking-[0.2em]">
                Tower Stability
              </span>
              <span className="text-sm font-black text-white">{stability}%</span>
            </div>
            <Progress
              value={stability}
              className="h-2 bg-white/10"
              indicatorClassName="bg-[#0df2eb]"
            />
          </div>

          <div className="bg-[#0df2eb]/5 backdrop-blur-xl border border-[#0df2eb]/20 p-4 rounded-xl flex items-center gap-4">
            <Activity className="text-[#0df2eb]" size={20} />
            <div>
              <p className="text-[9px] text-[#0df2eb]/70 font-black uppercase">Active Mission</p>
              <p className="text-sm font-bold">修復 ISO 14067 感測器</p>
            </div>
          </div>
        </div>

        {/* Gameplay Center: Evidence Ray Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Focal Point */}
            <div
              className={`w-16 h-16 rounded-full border-2 border-[#0df2eb] flex items-center justify-center bg-[#0df2eb]/10 backdrop-blur-md animate-pulse ${rayActive ? 'scale-150 border-white' : ''} transition-transform duration-300`}
            >
              <div className="w-3 h-3 bg-[#0df2eb] rounded-full shadow-[0_0_20px_#0df2eb]" />
            </div>

            {/* Visual Ray Line */}
            {rayActive && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[2px] bg-[#0df2eb] shadow-[0_0_25px_#0df2eb] rotate-45 z-10 animate-in fade-in zoom-in-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[4px] bg-white opacity-40 blur-sm rotate-45 z-10" />
              </>
            )}
          </div>
        </div>

        {/* Floating Knowledge Bubbles */}
        <div className="absolute top-1/4 right-20 z-30 space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl max-w-[300px] transition-all hover:border-[#0df2eb]/40 hover:bg-white/10 transform rotate-2">
            <div className="flex items-center gap-2 mb-3 text-[#0df2eb]">
              <Info size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Knowledge Point
              </span>
            </div>
            <h3 className="text-xl font-black mb-2">ISO 14067</h3>
            <p className="text-xs text-white/70 leading-relaxed font-medium">
              產品碳足跡標準。涵蓋從原材料開採、製造、運輸、使用至廢棄處理的完整生命週期 (LCA)。
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl max-w-[260px] transform -rotate-2 translate-x-10 hover:border-[#0df2eb]/40">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <Lightbulb size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Expert Tip</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-medium">
              量化數據是修復「信實之塔」的唯一能量。使用實證射線來驗證碳排係數。
            </p>
          </div>
        </div>

        {/* Action Button HUD */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <Button
            className="flex items-center gap-4 bg-[#0df2eb]/20 hover:bg-[#0df2eb]/30 border border-[#0df2eb]/50 backdrop-blur-xl px-12 py-4 rounded-full transition-all group scale-110"
            onClick={handleFireRay}
            disabled={energy < 10 || rayActive}
          >
            <span className="text-[#0df2eb] font-black tracking-[0.2em] uppercase text-sm">
              發射實證射線 [E]
            </span>
            <div className="w-10 h-10 bg-[#0df2eb] text-[#102222] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap />
            </div>
          </Button>
          <p className="text-[10px] text-[#0df2eb]/50 font-black uppercase tracking-widest animate-pulse">
            Target Locked: ISO 14067 Core
          </p>
        </div>

        {/* Dialogue Box */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[1100px] z-40">
          <div
            className="bg-black/60 backdrop-blur-2xl p-8 rounded-[32px] flex items-start gap-8 border-l-8 border-l-[#0df2eb] border border-white/10 cursor-pointer group hover:bg-black/70 transition-all"
            onClick={() => setDialogueIndex(prev => (prev + 1) % dialogues.length)}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-2xl bg-cover bg-center border-2 border-[#0df2eb]/50 shadow-[0_0_30px_rgba(13,242,235,0.3)] group-hover:scale-105 transition-transform"
                style={{ backgroundImage: `url('${dialogues[dialogueIndex].avatar}')` }}
              />
              <Badge className="bg-[#0df2eb]/20 text-[#0df2eb] border-0 text-[10px] font-black tracking-widest">
                NPC
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-4">
                  <h4 className="text-[#0df2eb] font-black text-2xl tracking-wide">
                    {dialogues[dialogueIndex].name}
                  </h4>
                  <span className="text-white/30 font-mono text-sm uppercase">
                    {dialogues[dialogueIndex].title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Volume2 size={14} />
                  <span className="text-[10px] font-black tracking-widest">
                    AUTO_PLAY_RESONANCE
                  </span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gradient-to-r from-[#0df2eb]/40 to-transparent" />

              <p className="text-xl text-gray-200 font-medium leading-relaxed">
                {dialogues[dialogueIndex].text}
              </p>

              <div className="flex justify-end pt-4">
                <div className="flex items-center gap-3 text-[#0df2eb]/60 text-xs font-black animate-pulse">
                  <span>點擊繼續 CONTINUE_STREAM</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Health Overlay */}
        <div className="absolute right-10 bottom-44 z-20 flex flex-col items-end gap-5">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                Protagonist
              </p>
              <p className="text-lg font-black tracking-tight underline decoration-[#0df2eb]/50">
                DingJun Hong
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-[#0df2eb] p-1 shadow-2xl">
              <div
                className="w-full h-full bg-cover bg-center rounded-full"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1a7bbnPE2TxKdavLiwO3Ew9MBMR-LnoPG0qM7L3MiFOUtTruN6pFgos1VxtzatnH38Z1-zILqU4MPUbsH9V-APt7l0f0S6vFgQD6KcvlqYQ6Lu_Zbt8qszAYl1cBf-iqHYyzpewkI_NMS7bQQ1i7cViIpqeTN8n8GjvlNBWK4lWnF6DsJoHRVEV69Bq7D2YrxgFMf1ZwbJ6HP5ALbet7EoaL26NcwpJZSkYNmr-LB8jrIus9BElnWuLx4kZkYCTe5d02WO9yU1M4')`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#0df2eb] to-blue-500 shadow-[0_0_15px_#0df2eb]"
                style={{ width: `${energy}%` }}
              />
            </div>
            <p className="text-[11px] text-[#0df2eb] font-black tracking-[0.3em]">
              VERIFICATION ENERGY: {energy}%
            </p>
          </div>
        </div>
      </main>

      <footer className="h-8 flex items-center justify-end px-6 bg-black/50 border-t border-white/5 text-[9px] text-white/20 font-mono tracking-widest">
        VERSION 1.0.4 // TOWER_MISSION_01 // VARIANT_01 // SSOT_SEALED
      </footer>
    </div>
  );
};
