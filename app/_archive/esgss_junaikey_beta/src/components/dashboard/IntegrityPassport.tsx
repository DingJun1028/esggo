import React, { useEffect } from 'react';
import {
  Diamond,
  Verified,
  VerifiedUser,
  Hub,
  TrendingUp,
  Psychology,
  WbSunny,
  SelfImprovement,
  VolunteerActivism,
  AutoFixHigh,
  EditNote,
  FilterDrama,
  AcUnit,
  Fingerprint,
  Token,
  Security,
  Shield,
  Lock,
  Share,
} from '@mui/icons-material';
import {
  Diamond as DiamondIcon,
  ShieldCheck,
  Fingerprint as FingerprintIcon,
  Zap,
  ArrowUpRight,
  Brain,
  Sun,
  Activity,
  Heart,
  Sparkles,
  FileEdit,
  CloudRain,
  Snowflake,
  QrCode,
  ShieldAlert,
  Link,
  Info,
  Bot,
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useIntegrityPassport } from '@/store/useIntegrityPassport';
import { useOmniAvatar } from '@/store/useOmniAvatar';
import { useMissionStore } from '@/store/useMissionStore';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

/**
 * 💎 Integrity Passport (Service 3.3)
 * --------------------------------------------------
 * "Personal ESG Digital Identity" with Crystallization Engine.
 * Features: Trust Score Radial, Four Pillars, Workflow, Blockchain Verification.
 */
const RANK_EMOJI: Record<string, string> = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: '👑',
};

export const IntegrityPassport = () => {
  const navigate = useNavigate();
  const { score, rank, pillars, sealedCrystals, isLoading, isSealing, fetchPassport, sealEvidence } = useIntegrityPassport();
  const { primaryAvatar } = useOmniAvatar();
  const { activeMissions, completeMission } = useMissionStore();

  // Hydrate passport from backend API on mount
  useEffect(() => {
    fetchPassport('current-user');
  }, [fetchPassport]);

  const firstMission = Array.from(activeMissions.values()).find(m => m.missionId.startsWith('first-quest'));

  const handleCrystallizeEvidence = async () => {
    // Mock flow: In real UI, user selects from Evidence Vault
    // For Phase 114 Demo, we simulate picking a "Governance Report" evidence
    const mockEvidenceId = 'evidence-123';
    await sealEvidence('current-user', mockEvidenceId);

    if (firstMission) {
      completeMission(firstMission.missionId);
    }
  };
  return (
    <div className="bg-[#0a1414] text-white min-h-screen font-display selection:bg-[#0df2eb]/20 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 size-[800px] bg-[#0df2eb]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 size-[500px] bg-[#0df2eb]/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-3xl bg-[#0a1414]/80 border-b border-[#0df2eb]/20">
        <div className="flex items-center gap-4 text-[#0df2eb]">
          <div className="size-10 flex items-center justify-center bg-[#0df2eb]/10 rounded-2xl border border-[#0df2eb]/20 shadow-lg cursor-pointer hover:bg-[#0df2eb]/20" onClick={() => navigate('/')}>
            <ArrowBack className="text-xl" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-black tracking-tight leading-none uppercase">
              誠信護照
            </h2>
            <span className="text-[9px] text-[#0df2eb] uppercase tracking-[0.3em] font-black mt-1">
              JUNAIKEY 生態系統
            </span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <nav className="hidden md:flex items-center gap-10">
            {['身份儀表板', '結晶演化', '鏈上資產', '安全中心'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${i === 0 ? 'text-[#0df2eb] border-b-2 border-[#0df2eb] pb-1' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
          <button className="bg-[#0df2eb] hover:bg-[#0df2eb]/80 text-[#102222] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(13,242,235,0.3)] transition-all active:scale-95">
            導出誠信護照
          </button>
          <div className="size-11 rounded-full border-2 border-[#0df2eb]/40 p-0.5 overflow-hidden ring-4 ring-[#0df2eb]/5">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-10 py-16 flex flex-col gap-12">
        {/* Page Heading Section */}
        <div className="flex flex-wrap justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0df2eb]/10 border border-[#0df2eb]/20">
              <span className="size-2 rounded-full bg-[#0df2eb] animate-pulse shadow-[0_0_10px_#0df2eb]" />
              <span className="text-[10px] font-black tracking-[0.3em] text-[#0df2eb] uppercase">
                個人 ESG 數位身份
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white">個人 ESG 數位身份</h1>
            <p className="text-[#0df2eb]/60 text-2xl font-light italic leading-relaxed tracking-tight">
              高端 Tiffany Blue 液態玻璃生態系統 —{' '}
              <span className="text-white font-medium not-italic">鼎鈞系列</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-end gap-2"
          >
            <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-4 rounded-[2rem] flex items-center gap-6 shadow-2xl relative group">
              <Hub className="text-[#0df2eb] size-8 animate-pulse drop-shadow-[0_0_10px_#0df2eb]" />
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none">
                  區塊鏈狀態
                </span>
                <span className="text-xs font-black text-white uppercase tracking-tight leading-none">
                  區塊鏈即時驗證中 安全鎖定
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Trust Score & Crystals */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Trust Score Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-[#0df2eb]/30 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group"
            >
              {/* Radial Score Gauge */}
              <div className="relative size-60 flex items-center justify-center shrink-0">
                <svg className="size-full transform -rotate-90">
                  <circle
                    className="text-white/5"
                    cx="120"
                    cy="120"
                    fill="transparent"
                    r="105"
                    stroke="currentColor"
                    strokeWidth="10"
                  ></circle>
                  <motion.circle
                    initial={{ strokeDashoffset: 660 }}
                    animate={{ strokeDashoffset: 660 - (660 * score / 1000) }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="text-[#0df2eb] drop-shadow-[0_0_20px_#0df2eb]"
                    cx="120"
                    cy="120"
                    fill="transparent"
                    r="105"
                    stroke="currentColor"
                    strokeDasharray="660"
                    strokeLinecap="round"
                    strokeWidth="15"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                    信任評分
                  </span>
                  <span className="text-white text-7xl font-black tracking-tighter leading-none">
                    {score}
                  </span>
                  <div className="flex items-center gap-2 text-[#0df2eb] text-sm font-black mt-2">
                    <TrendingUp fontSize="small" /> +12%
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-black text-white tracking-tighter italic">
                  誠信等級：<span className="text-[#0df2eb] not-italic">{RANK_EMOJI[rank] || ''} {rank}</span>
                </h3>
                <p className="text-white/50 text-xl font-light leading-relaxed tracking-tight italic">
                  您的數位身份目前處於{' '}
                  <span className="text-white font-medium not-italic">高純度結晶狀態</span>
                  。基於近期在「利他」維度的積極參與，您的信任評分已進入全球前 2% 的領先梯隊。
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="bg-[#0df2eb]/10 border border-[#0df2eb]/30 rounded-[1.5rem] px-8 py-4 flex flex-col shadow-inner">
                    <span className="text-[9px] text-[#0df2eb] uppercase font-black tracking-widest mb-1">
                      身份階級
                    </span>
                    <span className="text-white text-lg font-black tracking-tighter">
                      {rank}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 flex flex-col shadow-inner">
                    <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">
                      最後更新
                    </span>
                    <span className="text-white text-lg font-black tracking-tighter">
                      2 分鐘前
                    </span>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 size-48 bg-[#0df2eb]/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Four Pillars Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black tracking-tighter text-white italic px-4">
                5T 誠信支柱系統{' '}
                <span className="text-[#0df2eb]/30 not-italic font-black text-xs uppercase tracking-widest ml-4">
                  5T Protocol Pillars
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: '可感知', en: 'Tangible', val: pillars.tangible, icon: Sparkles, color: '#0df2eb' },
                  { label: '可溯源', en: 'Traceable', val: pillars.traceable, icon: Link, color: '#facc15' },
                  {
                    label: '可追蹤',
                    en: 'Trackable',
                    val: pillars.trackable,
                    icon: Activity,
                    color: '#0df2eb',
                  },
                  {
                    label: '可驗算',
                    en: 'Transparent',
                    val: pillars.transparent,
                    icon: QrCode,
                    color: '#a855f7',
                  },
                  {
                    label: '不可篡改',
                    en: 'Trustworthy',
                    val: pillars.trustworthy,
                    icon: ShieldCheck,
                    color: '#fb7185',
                  },
                ].map((pillar, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 group cursor-pointer hover:border-[#0df2eb]/50 transition-all shadow-xl"
                  >
                    <div className="relative size-20 flex items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-20 transition-all group-hover:opacity-40"
                        style={{ backgroundColor: pillar.color }}
                      />
                      <pillar.icon
                        className="text-3xl z-10 group-hover:scale-110 transition-transform"
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-white font-black text-base tracking-tight">
                        {pillar.label}
                      </h4>
                      <p className="text-[#0df2eb] text-[10px] font-black uppercase tracking-widest">
                        結晶度: {pillar.val}%
                      </p>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pillar.val}%` }}
                        transition={{ duration: 1.5, delay: 1 + i * 0.1 }}
                        className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: pillar.color, color: pillar.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Crystallization Workflow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-3xl bg-white/[0.02] border border-[#0df2eb]/20 rounded-[3rem] p-12 flex flex-col gap-10 shadow-2xl relative overflow-hidden"
            >
              <h2 className="text-2xl font-black text-white flex items-center gap-4 tracking-tighter italic">
                <AutoFixHigh className="text-[#0df2eb] size-7" />
                結化工作流{' '}
                <span className="text-[#0df2eb]/30 not-italic font-black text-xs uppercase tracking-widest ml-4">
                  Evolution Workflow
                </span>
              </h2>
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 px-8 py-8 isolate">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0df2eb]/20 to-transparent -z-10 hidden md:block" />
                {[
                  { label: '行動錄入', en: 'Activity Input', icon: EditNote },
                  { label: '數據煉化', en: 'Refining', icon: FilterDrama },
                  { label: '資產結晶', en: 'Crystallization', icon: AcUnit, active: true },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-6 relative group">
                    <div
                      onClick={i === 2 ? handleCrystallizeEvidence : undefined}
                      className={`size-20 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-2xl cursor-pointer ${step.active ? 'bg-[#0df2eb] border-[#0df2eb] text-[#102222] scale-110 shadow-[0_0_30px_rgba(13,242,235,0.4)]' : 'bg-[#0a1414] border-[#0df2eb]/40 text-[#0df2eb] group-hover:border-[#0df2eb] group-hover:bg-[#0df2eb]/10'}`}
                    >
                      <step.icon fontSize="large" />
                      {i === 2 && firstMission && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                          任務
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <h5
                        className={`font-black text-base tracking-tight ${step.active ? 'text-[#0df2eb]' : 'text-white'}`}
                      >
                        {step.label}
                      </h5>
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                        {step.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-[11px] font-black tracking-[0.2em] uppercase text-center border-t border-white/5 pt-8 italic leading-relaxed">
                您的每日行為將通過 <span className="text-[#0df2eb]">JunAiKey 液態玻璃演算法</span>{' '}
                轉化為永久性的鏈上誠信標記。
              </p>
            </motion.div>
          </div>

          {/* Right Column: Verification & Profile */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Blockchain Verification Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#0df2eb]/20 to-transparent p-0.5 rounded-[3rem] shadow-2xl"
            >
              <div className="bg-[#0a1414]/90 backdrop-blur-3xl rounded-[3rem] p-10 flex flex-col items-center gap-10">
                <div className="flex justify-between w-full items-center">
                  <span className="text-[10px] font-black text-[#0df2eb] tracking-[0.3em] uppercase">
                    身份驗證
                  </span>
                  <span className="size-2 rounded-full bg-[#0df2eb] animate-pulse shadow-[0_0_10px_#0df2eb]" />
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(13,242,235,0.1)] relative group">
                  {/* QR Placeholder */}
                  <div className="size-48 bg-[#102222] rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <QrCode className="text-white/20 size-32" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0df2eb]/20 to-transparent" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-dashed border-[#0df2eb]/30 rounded-[3rem] animate-spin-slow pointer-events-none" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-white text-xl font-black tracking-tight">
                    區塊鏈數位存證 已啟動
                  </p>
                  <p className="text-[#0df2eb]/50 text-xs font-mono tracking-tighter">
                    HASH: 0x71C8F...4a92bc8E
                  </p>
                </div>
                <button className="w-full h-16 rounded-2xl border border-[#0df2eb]/40 text-[#0df2eb] text-[10px] font-black uppercase tracking-widest hover:bg-[#0df2eb]/10 transition-all active:scale-95 shadow-xl bg-[#0df2eb]/5">
                  重新掃描驗證
                </button>
              </div>
            </motion.div>

            {/* Identity Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 flex flex-col gap-10 shadow-2xl"
            >
              <h3 className="text-xl font-black text-white tracking-tighter italic">
                身份概覽{' '}
                <span className="text-white/20 not-italic font-black text-[10px] uppercase tracking-widest ml-4">
                  Identity Summary
                </span>
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Serial ID', val: 'JAK-8829-DJH', icon: Fingerprint },
                  { label: 'Soul-bound Token', val: '已綁定 (Active)', icon: Token, active: true },
                  { label: 'Security Level', val: 'Level 4 Premium', icon: VerifiedUser },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 group hover:border-[#0df2eb]/30 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <item.icon className="text-[#0df2eb] size-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">
                        {item.label === 'Serial ID' ? '序號' : item.label === 'Soul-bound Token' ? '靈魂綁定代幣' : '安全等級'}
                      </span>
                    </div>
                    <span
                      className={`text-[13px] font-black tracking-tight ${item.active ? 'text-[#0df2eb]' : 'text-white'}`}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <p className="text-[9px] text-white/30 font-black uppercase tracking-tighter leading-relaxed">
                  誠信護照 - 由 JUNAIKEY 生態系統提供技術支持 <br />
                  專為高淨值 ESG 貢獻者保留
                </p>
                <div className="flex gap-4">
                  {[Shield, Lock, Share].map((Icon, i) => (
                    <button
                      key={i}
                      className="size-12 rounded-xl bg-[#0df2eb]/10 border border-[#0df2eb]/20 flex items-center justify-center text-[#0df2eb] hover:bg-[#0df2eb]/20 transition-all active:scale-95"
                    >
                      <Icon fontSize="small" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Crystal Seal Timeline (Phase 8) */}
        {sealedCrystals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-3xl bg-white/[0.03] border border-[#0df2eb]/20 rounded-[3rem] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-white tracking-tighter italic flex items-center gap-4 mb-8">
              <DiamondIcon className="text-[#0df2eb] size-6" />
              結晶封印時間軸{' '}
              <span className="text-[#0df2eb]/30 not-italic font-black text-xs uppercase tracking-widest ml-4">
                Crystal Seal Timeline
              </span>
              <span className="ml-auto text-sm text-[#0df2eb]/60 not-italic">
                {sealedCrystals.length} 枚已封印
              </span>
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {sealedCrystals.map((seal, i) => (
                <div
                  key={seal.sealId}
                  className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#0df2eb]/30 transition-all group"
                >
                  <div className="size-10 rounded-xl bg-[#0df2eb]/10 border border-[#0df2eb]/20 flex items-center justify-center text-[#0df2eb] shrink-0">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-bold tracking-tight truncate">
                        Crystal #{seal.crystalUuid.slice(0, 8)}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#0df2eb]/10 text-[#0df2eb] font-black uppercase tracking-wider">
                        {seal.domain}
                      </span>
                      {seal.verified && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-wider">
                          ✓ Verified
                        </span>
                      )}
                      {seal.signatures && seal.signatures.length > 1 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-black uppercase tracking-wider">
                          {seal.signatures.length}-Sig
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-white/30 text-[10px] font-mono truncate">
                        Hash: {seal.crystalHash.slice(0, 16)}...
                      </p>
                      {seal.impactMetric && seal.impactMetric !== 'N/A' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#facc15]/10 text-[#facc15] font-black uppercase tracking-wider">
                          {seal.impactMetric}
                        </span>
                      )}
                    </div>
                    {/* Multi-Agent Verification Chain */}
                    {seal.verifiers && seal.verifiers.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0df2eb]/5 border border-[#0df2eb]/10">
                          <Bot className="size-3 text-[#0df2eb]" />
                          <span className="text-[8px] font-black text-[#0df2eb] tracking-wider uppercase">Executor</span>
                        </div>
                        <span className="text-white/20 text-[10px]">→</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/5 border border-purple-500/10">
                          <Eye className="size-3 text-purple-400" />
                          <span className="text-[8px] font-black text-purple-400 tracking-wider uppercase">Verifier</span>
                        </div>
                        <span className="text-white/20 text-[10px]">→</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                          <ShieldCheck className="size-3 text-emerald-400" />
                          <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase">Sealed</span>
                        </div>
                        <span className="text-white/10 text-[8px] font-mono ml-1">
                          [{seal.verifiers.map(v => v.slice(0, 6)).join(', ')}]
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-white/20 text-[10px] font-mono shrink-0">
                    {new Date(seal.sealedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {[
            {
              label: '累計誠信貢獻值 Total Points',
              val: '42,800',
              unit: 'P-ESG',
              color: '#0df2eb',
            },
            { label: '節省碳足跡 (CO2) Carbon Cut', val: '1.24', unit: 'Tonnes', color: '#fbbf24' },
            {
              label: '社會影響力指數 Social Index',
              val: '94th',
              unit: 'Percentile',
              color: '#f472b6',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col gap-4 group hover:border-white/20 transition-all shadow-xl"
            >
              <span className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-white tracking-tighter leading-none">
                  {stat.val}
                </span>
                <span
                  className="text-[11px] font-black uppercase tracking-widest leading-none"
                  style={{ color: stat.color }}
                >
                  {stat.unit}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
