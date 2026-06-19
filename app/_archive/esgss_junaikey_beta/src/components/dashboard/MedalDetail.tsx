import React from 'react';
import {
  ArrowLeft,
  Share2,
  Download,
  Link as LinkIcon,
  Diamond,
  Verified,
  Shield,
  Leaf,
  WorkspacePremium as Award,
  HistoryEdu,
  Notifications,
  AccountCircle,
} from '@mui/icons-material'; // Actually Lucide is my standard, but I will map these to Lucide icons.
import {
  ArrowLeft as ArrowLeftIcon,
  Share2 as ShareIcon,
  Download as DownloadIcon,
  Link2,
  Gem,
  ShieldCheck,
  Shield as ShieldIcon,
  Leaf as LeafIcon,
  Award as AwardIcon,
  BookOpen,
  Bell,
  UserCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 💎 Medal Detail (Legendary Achievement View)
 * --------------------------------------------------
 * Featuring "5T 真善現守護者" (Guardian of 5T Protocol).
 * High-end liquid glass and diamond refraction aesthetics.
 */
export const MedalDetail = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#102222]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[#0ab8b2]">
          <AwardIcon className="w-8 h-8" />
          <h2 className="text-white text-xl font-bold tracking-tight">ESGss JunAiKey</h2>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-9">
            <a
              className="text-white/80 hover:text-[#0ab8b2] transition-colors text-sm font-bold"
              href="#"
            >
              成就館
            </a>
            <a
              className="text-white/80 hover:text-[#0ab8b2] transition-colors text-sm font-bold"
              href="#"
            >
              個人檔案
            </a>
            <a
              className="text-white/80 hover:text-[#0ab8b2] transition-colors text-sm font-bold"
              href="#"
            >
              社群
            </a>
          </nav>
          <div className="flex gap-3">
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-[#0ab8b2]/20 transition-all border border-white/5">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-[#0ab8b2]/20 transition-all border border-white/5">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-10 px-8 max-w-[1400px] mx-auto w-full relative">
        {/* Breadcrumbs */}
        <div className="w-full max-w-[960px] flex items-center gap-3 mb-8 text-sm font-bold opacity-60">
          <button onClick={onBack} className="hover:text-[#0ab8b2] transition-colors">
            成就清單 Achievement List
          </button>
          <span>/</span>
          <span className="text-white opacity-100">5T 真善現守護者</span>
        </div>

        {/* Medal Hero Section */}
        <div className="w-full max-w-[960px] relative mb-16 flex flex-col items-center">
          <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(10, 184, 178, 0.2) 0%, rgba(16, 34, 34, 0) 70%) blur-3xl opacity-60 scale-150" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full aspect-square max-w-[500px] relative flex items-center justify-center p-12"
          >
            {/* Outer Glass Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border-[6px] border-[#0ab8b2]/20 backdrop-blur-sm"
            />
            {/* Diamond Facet Effect */}
            <motion.div
              animate={{ rotate: [22.5, 30, 22.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-12 bg-gradient-to-br from-[#0ab8b2] via-white to-[#0ab8b2] opacity-80 rounded-[2.5rem] shadow-[0_0_80px_rgba(10,184,178,0.5)] border border-white/20"
            />
            <div className="absolute inset-20 bg-[#102222]/60 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/10 group overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gem
                  className="text-[#0ab8b2] w-48 h-48 drop-shadow-[0_0_30px_rgba(10,184,178,0.6)]"
                  strokeWidth={1}
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 space-y-4"
          >
            <h1 className="text-white tracking-tighter text-5xl md:text-6xl font-black leading-tight font-display drop-shadow-2xl">
              5T 真善現守護者
            </h1>
            <div className="flex items-center justify-center gap-3 text-[#0ab8b2] font-black tracking-[0.3em] uppercase text-xs">
              <ShieldCheck className="w-4 h-4" />
              Legendary Achievement • Protocol 5T-Alpha
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: '稀有度 Rarity', value: '傳奇 (Legendary)', color: '#0ab8b2' },
            { label: '達成日期 Completion', value: '2023/10/24' },
            { label: '5T 協議合規性 Compliance', value: '100% Verified', color: '#0ab8b2' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-3xl p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-[#0ab8b2]/40 group"
            >
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <p
                className={`text-2xl font-black leading-tight tracking-tight ${stat.color ? 'text-[#0ab8b2]' : 'text-white'}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Service Impact Narrative */}
        <div className="w-full max-w-[960px] backdrop-blur-3xl bg-[#283939]/40 rounded-[2.5rem] p-10 border border-[#0ab8b2]/20 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <BookOpen className="text-[#0ab8b2] w-48 h-48" />
          </div>

          <div className="flex items-start gap-6 mb-8 relative z-10">
            <div className="bg-[#0ab8b2]/20 p-5 rounded-3xl text-[#0ab8b2] shadow-inner border border-[#0ab8b2]/20">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-white text-2xl font-black mb-1 tracking-tight">
                服務影響敘述 (Service Impact Narrative)
              </h3>
              <p className="text-[#0ab8b2] text-[10px] font-black uppercase tracking-widest bg-[#0ab8b2]/10 px-3 py-1 rounded-full inline-block">
                獲獎者：丁俊宏 (DingJun Hong)
              </p>
            </div>
          </div>

          <div className="space-y-6 text-white/70 leading-loose text-lg font-light relative z-10">
            <p>
              此勳章象徵著對 ESGss 5T
              協議的極致承諾。丁俊宏先生在「真、善、現」三大核心價值中展現了卓越的實踐能力。透過自動化合規監測與液態玻璃生態系統的透明化治理，其實踐行為已達成
              100% 的協議標準。
            </p>
            <p>
              在過去的評估週期中，丁先生成功優化了環境資源分配效率達
              42%，並在社群貢獻中展現了高度的透明性與責任感。此勳章不僅是榮譽，更是其在 JunAiKey
              生態中作為永續守護者的實體化身。
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 relative z-10">
            {[
              { label: '永續治理', icon: ShieldIcon },
              { label: '綠色足跡', icon: LeafIcon },
              { label: '5T Alpha 認證', icon: AwardIcon },
            ].map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full text-xs font-black text-[#0ab8b2] border border-[#0ab8b2]/20 uppercase tracking-widest shadow-sm"
              >
                <tag.icon className="w-3.5 h-3.5" />
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-[960px] flex flex-col items-center gap-8 relative z-10">
          <button className="w-full md:w-auto min-w-[320px] flex items-center justify-center gap-4 bg-[#0ab8b2] hover:brightness-110 text-[#102222] font-black text-xl py-5 px-12 rounded-2xl transition-all shadow-[0_0_30px_rgba(10,184,178,0.4)] hover:shadow-[0_0_50px_rgba(10,184,178,0.6)] active:scale-95 group">
            <ShareIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>分享至社群 Share Award</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-12 text-white/40 text-sm font-bold uppercase tracking-widest">
            <button className="flex items-center gap-3 hover:text-white transition-colors">
              <Link2 className="w-5 h-5" />
              <span>複製數位憑證連結 Copy Link</span>
            </button>
            <button className="flex items-center gap-3 hover:text-white transition-colors">
              <DownloadIcon className="w-5 h-5" />
              <span>下載高清證書 Download HQ</span>
            </button>
          </div>
        </div>

        {/* Footer Metadata */}
        <footer className="w-full max-w-[960px] mt-24 pb-12 border-t border-white/5 pt-10 text-center opacity-40">
          <p className="text-[#0ab8b2] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Blockchain Verified • Hash: 0x8a2f44c688887b1e...f9e2
          </p>
          <p className="text-white text-[10px] font-medium tracking-widest">
            © 2024 ESGss JunAiKey Ecosystem for DingJun Hong. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};
