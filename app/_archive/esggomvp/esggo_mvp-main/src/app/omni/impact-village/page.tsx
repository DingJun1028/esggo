'use client';

import React from 'react';
import {
  Users,
  Heart,
  Share2,
  QrCode,
  Coins,
  TrendingUp,
  ArrowRight,
  Gem,
  Info,
  History,
  Link as LinkIcon,
  Activity
} from "lucide-react";
import { OmniVillageService, IOmniAffiliate } from "@/core/omni-village-service";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { OMNI_MODULES } from "@/config/omni-modules";
import { SustainabilityGem } from "@/components/omni/visuals/SustainabilityGem";
import { motion, AnimatePresence } from "framer-motion";
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";

const VILLAGE_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/village-panel-1.png',
        title: '社群連結',
        description: '數位分身齊聚一堂，開啟跨界共鳴與情感連結。',
        pill: 'CONNECT'
    },
    {
        id: 2,
        src: '/assets/manga/village-panel-2.png',
        title: '知識共享',
        description: '在村莊圖書館中交換永續智慧，實踐服務即教學。',
        pill: 'LEARN'
    },
    {
        id: 3,
        src: '/assets/manga/village-panel-3.png',
        title: '協力專案',
        description: '攜手建構永續基礎設施，讓影響力在村莊中擴散。',
        pill: 'COLLAB'
    },
    {
        id: 4,
        src: '/assets/manga/village-panel-4.png',
        title: '共榮願景',
        description: '萬物共生，村莊繁榮，實現永續發展的「圓滿」果實。',
        pill: 'PROSPER'
    }
];

export default function ImpactVillagePage() {
  const moduleInfo = OMNI_MODULES.IMPACT_VILLAGE;
  const [affiliate, setAffiliate] = React.useState<IOmniAffiliate | null>(null);
  const [partnerships, setPartnerships] = React.useState<any[]>([]);

  // API Data States
  const [sroiData, setSroiData] = React.useState<any>(null);
  const [supplyData, setSupplyData] = React.useState<any>(null);

  React.useEffect(() => {
    OmniVillageService.getAffiliateProfile('user-current').then(setAffiliate);
    OmniVillageService.getPartnershipContent().then(setPartnerships);

    // Fetch SROI Data
    fetch('/api/village/sroi').then(res => res.json()).then(data => {
      if (data.success) setSroiData(data.data);
    });

    // Fetch Supply Chain Data
    fetch('/api/village/supply').then(res => res.json()).then(data => {
      if (data.success) setSupplyData(data.data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400 w-fit">
            <Users size={10} />
            {moduleInfo.domain} Comm · {moduleInfo.uuid}
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic text-omni-text-main uppercase">
            Impact <span className="text-emerald-400">Village</span> Community
          </h1>
          <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit']">
            {moduleInfo.description} — 供應鏈與社區影響力互動聚落，讓永續價值在生態系中「通、圓、滿」。
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <OmniMangaTutorial 
            title="Impact Village：同振共榮網" 
            subtitle="The Ecosystem of Shared Value" 
            panels={VILLAGE_MANGA_PANELS} 
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LiquidGlassContainer glowColor="emerald" intensity="low" className="p-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-omni-text-muted tracking-wider uppercase">SROI Return</span>
          <span className="text-3xl font-black text-white">{sroiData?.aggregate?.averageRatio || 0}x</span>
          <span className="text-xs text-emerald-400 font-bold">+12% vs LY</span>
        </LiquidGlassContainer>
        <LiquidGlassContainer glowColor="aqua" intensity="low" className="p-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-omni-text-muted tracking-wider uppercase">Active Suppliers</span>
          <span className="text-3xl font-black text-white">{supplyData?.stats?.totalSuppliers || 0}</span>
          <span className="text-xs text-aqua-400 font-bold">100% Audited</span>
        </LiquidGlassContainer>
        <LiquidGlassContainer glowColor="amber" intensity="low" className="p-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-omni-text-muted tracking-wider uppercase">Total Social Value</span>
          <span className="text-3xl font-black text-white">${(sroiData?.aggregate?.totalSocialValue / 1000000 || 0).toFixed(1)}M</span>
          <span className="text-xs text-amber-400 font-bold">Generated 2025</span>
        </LiquidGlassContainer>
        <LiquidGlassContainer glowColor="rose" intensity="low" className="p-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-omni-text-muted tracking-wider uppercase">High Risk Nodes</span>
          <span className="text-3xl font-black text-white">{supplyData?.stats?.highRiskCount || 0}</span>
          <span className="text-xs text-rose-400 font-bold">Requires Attention</span>
        </LiquidGlassContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Supply Chain Table */}
        {supplyData?.suppliers && (
          <OmniTable
            title="Green Supply Chain Nodes"
            subtitle="環境永續與社會責任合作節點"
            columns={[
              { key: 'name', header: '供應商' },
              { key: 'category', header: '領域' },
              {
                key: 'esgRating', header: '評級', render: (val: any) => (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${val === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                    val === 'B' ? 'bg-aqua-500/20 text-aqua-400' :
                      val === 'C' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>{val}</span>
                )
              }
            ]}
            data={supplyData.suppliers}
          />
        )}

        {/* SROI Table */}
        {sroiData?.metrics && (
          <OmniTable
            title="SROI Impact Returns"
            subtitle="社會投資報酬綠色追蹤矩陣"
            columns={[
              { key: 'project', header: '專案名稱' },
              {
                key: 'ratio', header: 'SROI 倍數', render: (val: any) => (
                  <span className="font-bold text-emerald-400 text-sm">{val}x</span>
                )
              },
              {
                key: 'status', header: '狀態', render: (val: any) => (
                  <span className="text-xs text-omni-text-main/70 uppercase font-bold tracking-wider">{val}</span>
                )
              }
            ]}
            data={sroiData.metrics}
          />
        )}
      </div>

      {/* Affiliate & Rewards Section (雙資產儀表板) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Card */}
        <LiquidGlassContainer glowColor="emerald">
          <div className="flex flex-col gap-6 h-full p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tight flex items-center gap-2">
                <QrCode size={18} className="text-emerald-400" /> 聯盟代理推薦
              </h3>
              <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black font-['Outfit'] text-emerald-400 uppercase tracking-widest">
                {affiliate?.partnershipLevel} Partner
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
              <motion.div
                animate={{ y: [0, 160, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 top-0 h-[2px] bg-emerald-500/30 blur-sm z-20"
              />
              <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={affiliate?.qrCodeUrl}
                alt="Referral QR"
                className="w-40 h-40 rounded-xl border-4 border-white/10 relative z-10 p-2 bg-white"
              />
              <div className="flex flex-col items-center gap-1 z-10 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 mt-[-20px]">
                <span className="text-[10px] font-mono text-omni-text-muted uppercase tracking-widest">專屬推薦碼</span>
                <span className="text-xl font-black text-white tracking-widest">{affiliate?.referralCode}</span>
              </div>
            </div>

            <button className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm font-black text-emerald-300 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Share2 size={16} /> 複製推薦連結
            </button>
          </div>
        </LiquidGlassContainer>

        {/* Wealth/Coin & Gem Metrics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 善向幣 (SXC) */}
            <LiquidGlassContainer glowColor="amber">
              <div className="flex flex-col gap-4 p-6 h-full border-b border-white/10">
                <div className="flex items-center gap-2 text-amber-400 pb-4 border-b border-white/10">
                  <Coins size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">善向幣結餘 (SXC)</h3>
                </div>
                <div className="flex items-end gap-3 px-2 pt-4">
                  <span className="text-6xl font-black text-white tracking-tighter leading-none font-['Outfit']">
                    {affiliate?.totalShanXiangCoins.toLocaleString() || '1,250'}
                  </span>
                  <span className="text-amber-400/60 font-mono text-xs mb-1 font-bold tracking-widest uppercase">Credits</span>
                </div>
                <div className="mt-auto p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-omni-text-muted font-bold uppercase tracking-widest">累計推薦人數</span>
                    <span className="text-lg font-black text-white leading-none">{affiliate?.referredUsersCount || '5'} <span className="text-[9px] text-omni-text-muted uppercase">Users</span></span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>
            </LiquidGlassContainer>

            {/* 永續寶石 (Gems) */}
            <LiquidGlassContainer glowColor="rose">
              <div className="flex flex-col gap-4 relative overflow-hidden group h-full p-6">
                <div className="flex items-center gap-2 text-rose-400 relative z-20 pb-4 border-b border-white/10">
                  <Gem size={20} className="animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">永續寶石 (Gems)</h3>
                </div>

                <div className="flex items-center gap-6 px-2 relative z-20 pt-4">
                  <SustainabilityGem size={80} color="rose" className="shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                        {affiliate?.totalSustainabilityGems || '3'}
                      </span>
                      <span className="text-rose-400 font-bold text-xs mb-2 tracking-widest uppercase font-['Outfit']">Gems</span>
                    </div>
                    <span className="text-[10px] text-rose-300/60 font-black uppercase tracking-widest">Rare Assets</span>
                  </div>
                </div>

                <div className="mt-auto p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between relative z-20">
                  <p className="text-[9px] text-rose-300 font-bold leading-tight flex items-center gap-2">
                    <Info size={12} /> 解鎖深度 BI 分析報告專用
                  </p>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 group-hover:bg-rose-500/20 transition-all cursor-pointer">
                    <History size={16} className="text-rose-400" />
                  </div>
                </div>
              </div>
            </LiquidGlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}