'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Calendar, ClipboardCheck, Star,
  ArrowRight, ExternalLink, ChevronDown, ChevronRight,
  Award, Clock, Target, BookOpen, MessageSquare, FileText,
  Globe, CheckCircle, Zap, Sparkles, Network
} from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '../../components/brand';
import { cn } from '../../lib/utils';

const TABS = [
  { id: 'about', label: '關於競賽' },
  { id: 'timeline', label: '競賽時程' },
  { id: 'challenge', label: '企業出題' },
  { id: 'register', label: '報名須知' },
  { id: 'scoring', label: '評分標準' },
  { id: 'prizes', label: '獎項及義務' },
  { id: 'shortlist', label: '通過名單' },
  { id: 'review', label: '歷屆回顧' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: '聯繫我們' },
];

const COMPANIES = [
  { name: '大同智能', nameEn: 'Tatung Intelligence' },
  { name: '元太科技', nameEn: 'E Ink' },
  { name: '友達光電', nameEn: 'AUO' },
  { name: '日月光', nameEn: 'ASE' },
  { name: '台水公司', nameEn: 'Taiwan Water Corp.' },
  { name: '台電公司綜研所', nameEn: 'TPRI' },
  { name: '宇沛永續(AET)', nameEn: 'AET' },
  { name: '和碩', nameEn: 'Pegatron' },
  { name: '奇美食品', nameEn: 'Chimei Foods' },
  { name: '岱德橡膠', nameEn: 'Daide Rubber' },
  { name: '東豐纖維', nameEn: 'Tong Fong Textile' },
  { name: '太古可口可樂', nameEn: 'Swire Coca-Cola' },
  { name: '凌羣電腦', nameEn: 'Lingzen Computer' },
  { name: '華碩電腦', nameEn: 'ASUS' },
  { name: 'NVIDIA', nameEn: 'NVIDIA' },
  { name: '新北捷運公司', nameEn: 'NT Metro' },
  { name: '群光電子', nameEn: 'Chicony Power' },
  { name: '聯發科技X矽品精密', nameEn: 'MediaTek X SPIL' },
  { name: '聯新國際醫院', nameEn: 'Landseed Hospital' },
];

const TIMELINE = [
  { phase: '企業出題與報名', date: '2026/04 – 2026/06', icon: FileText, color: 'bg-blue-500' },
  { phase: '初賽提案繳交', date: '2026/07', icon: ClipboardCheck, color: 'bg-emerald-500' },
  { phase: '入圍公告', date: '2026/08', icon: Star, color: 'bg-amber-500' },
  { phase: '決賽與Demo Day', date: '2026/09', icon: Trophy, color: 'bg-purple-500' },
  { phase: '成果發表與商轉', date: '2026/10', icon: Target, color: 'bg-rose-500' },
];

export default function GreenTechCompetition() {
  const [activeTab, setActiveTab] = useState('about');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40">
      {/* ─── Top Navigation ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-black text-sm text-emerald-900 tracking-tight hidden sm:block">
                {lang === 'zh' ? '綠色科技競賽' : 'Green Tech Challenge'}
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all',
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-emerald-700/70 hover:text-emerald-900 hover:bg-emerald-50'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex bg-white rounded-lg border border-emerald-100 p-0.5">
                <button
                  onClick={() => setLang('zh')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-black transition-all',
                    lang === 'zh' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-600 hover:text-emerald-800'
                  )}
                >
                  ZH
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-black transition-all',
                    lang === 'en' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-600 hover:text-emerald-800'
                  )}
                >
                  EN
                </button>
              </div>
              <BrandButton variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-8 px-4">
                {lang === 'zh' ? '報名' : 'Register'}
              </BrandButton>
              <BrandButton variant="ghost" size="sm" className="rounded-xl h-8 px-3 text-emerald-600">
                <ExternalLink size={14} />
              </BrandButton>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-1 pb-3 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all shrink-0',
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-emerald-700/70 hover:text-emerald-900 bg-emerald-50/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* ─── Hero Section ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-8 sm:p-12 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest">
                  {lang === 'zh' ? 'Green Tech · AI Transformation' : 'Green Tech · AI Transformation'}
                </div>
                <BrandBadge variant="outline" size="sm" className="border-white/30 text-white/80 text-[9px]">
                  {lang === 'zh' ? '2026' : '2026 Edition'}
                </BrandBadge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                {lang === 'zh' ? '綠色科技組\n企業出題' : 'Green Tech\nEnterprise Challenge'}
              </h1>
              <p className="text-emerald-50/80 text-lg font-medium leading-relaxed max-w-xl">
                {lang === 'zh'
                  ? '匯聚 19 家標竿企業真實永續命題，以 AI 與數據科技驅動供應鏈綠色轉型。'
                  : '19 leading enterprises present real sustainability challenges, driving green transformation through AI and data technology.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <BrandButton variant="primary" size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl h-14 px-10 font-black shadow-xl">
                  {lang === 'zh' ? '立即報名' : 'Register Now'} <ArrowRight size={18} className="ml-2" />
                </BrandButton>
                <BrandButton variant="ghost" size="lg" className="border border-white/30 text-white hover:bg-white/10 rounded-2xl h-14 px-8">
                  <BookOpen size={18} className="mr-2" /> {lang === 'zh' ? '競賽簡章' : 'Guidelines'}
                </BrandButton>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <div className="flex -space-x-3">
                {['T', 'G', 'C'].map((letter, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-black text-xl">
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Stats Row ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: lang === 'zh' ? '參賽企業' : 'Enterprises', value: '19', icon: Users, color: 'from-emerald-500 to-teal-500' },
            { label: lang === 'zh' ? '永續命題' : 'Challenges', value: '24+', icon: Target, color: 'from-blue-500 to-cyan-500' },
            { label: lang === 'zh' ? '獎金池' : 'Prize Pool', value: 'NT$500K+', icon: Award, color: 'from-amber-500 to-orange-500' },
            { label: lang === 'zh' ? '參與人數' : 'Participants', value: '300+', icon: Users, color: 'from-purple-500 to-pink-500' },
          ].map((stat) => (
            <BrandCard key={stat.label} className="p-6 bg-white/70 backdrop-blur-sm border-emerald-100/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', stat.color)}>
                  <stat.icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-900">{stat.value}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </BrandCard>
          ))}
        </motion.div>

        {/* ─── Participating Companies ────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-emerald-900">
                {lang === 'zh' ? '參賽企業' : 'Participating Enterprises'}
              </h2>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                {lang === 'zh' ? '綠色科技組企業出題' : 'Green Tech Challenge Partners'}
              </p>
            </div>
            <BrandBadge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
              <Network size={12} className="mr-1" /> 19 {lang === 'zh' ? '家企業' : 'Enterprises'}
            </BrandBadge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COMPANIES.map((company, i) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-5 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-black text-emerald-600">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800 leading-tight">{company.name}</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{company.nameEn}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Timeline ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-black text-emerald-900 mb-6">
            {lang === 'zh' ? '競賽時程' : 'Timeline'}
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-300 to-teal-200 hidden sm:block" />
            <div className="space-y-4">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-start gap-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md transition-all"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                    item.color
                  )}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800">{item.phase}</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">{item.date}</p>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── About Section ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <BrandCard className="p-8 bg-white/70 backdrop-blur-sm border-emerald-100/50">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                  <Target size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-emerald-900">
                  {lang === 'zh' ? '競賽宗旨' : 'Mission'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === 'zh'
                    ? '綠色科技組旨在匯聚企業真實永續轉型需求，透過 AI、大數據與區塊鏈等技術，推動供應鏈 ESG 數據治理、遠距查證與自動化稽核之創新解決方案。'
                    : 'The Green Tech Challenge brings together real enterprise sustainability needs, leveraging AI, big data, and blockchain to drive innovation in supply chain ESG data governance, remote verification, and automated auditing.'}
                </p>
              </div>
            </BrandCard>

            <BrandCard className="p-8 bg-white/70 backdrop-blur-sm border-emerald-100/50">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                  <Star size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-emerald-900">
                  {lang === 'zh' ? '預期成果' : 'Expected Outcomes'}
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {[
                    lang === 'zh' ? '建立供應商永續數據自動化蒐集與查證機制' : 'Automated supplier sustainability data collection and verification',
                    lang === 'zh' ? '導入 OCR + AI 模型進行文件智慧審核' : 'OCR + AI intelligent document audit',
                    lang === 'zh' ? '風險分級機制與人工抽樣複核流程' : 'Risk-based sampling and manual review workflow',
                    lang === 'zh' ? '第三方遠距稽核與即時憑證封印' : 'Third-party remote audit with real-time certification sealing',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BrandCard>
          </div>
        </motion.section>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-10 sm:p-14 text-white text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <Sparkles size={40} className="mx-auto text-emerald-200" />
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              {lang === 'zh' ? '準備好加入綠色轉型了嗎？' : 'Ready to Join the Green Transformation?'}
            </h2>
            <p className="text-emerald-100/80 text-lg max-w-lg mx-auto">
              {lang === 'zh'
                ? '立即報名，與 19 家標竿企業共同探索 AI 驅動的永續解方。'
                : 'Register now and explore AI-driven sustainability solutions with 19 leading enterprises.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <BrandButton variant="primary" size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl h-14 px-10 font-black shadow-xl">
                {lang === 'zh' ? '立即報名' : 'Register Now'} <ArrowRight size={18} className="ml-2" />
              </BrandButton>
              <BrandButton variant="ghost" size="lg" className="border border-white/30 text-white hover:bg-white/10 rounded-2xl h-14 px-8">
                <MessageSquare size={18} className="mr-2" /> {lang === 'zh' ? '聯繫我們' : 'Contact Us'}
              </BrandButton>
            </div>
          </div>
        </motion.section>

        {/* ─── Footer ────────────────────────────────────────── */}
        <footer className="pt-8 pb-12 border-t border-emerald-100/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>&copy; 2026 {lang === 'zh' ? '綠色科技競賽' : 'Green Tech Challenge'}. {lang === 'zh' ? '主辦單位保留所有權利。' : 'All rights reserved.'}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">{lang === 'zh' ? '隱私權政策' : 'Privacy'}</a>
              <a href="#" className="hover:text-slate-600 transition-colors">{lang === 'zh' ? '服務條款' : 'Terms'}</a>
              <a href="#" className="hover:text-slate-600 transition-colors">{lang === 'zh' ? '常見問題' : 'FAQ'}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
