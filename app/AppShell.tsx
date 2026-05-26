'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, ChevronLeft, LayoutDashboard, FileText, Fingerprint, 
  HeartPulse, MessageSquare, BarChart3, Leaf, Users, ShieldCheck, 
  Hexagon, ListChecks, Lock, ClipboardList, Map, BookOpen, 
  Library, Wallet, Link2, Handshake, CheckCircle2, GraduationCap, 
  Globe, CheckSquare, Building2, Cable, Radio, Bot, Shield,
  Search, Command, X, ArrowUpRight, Settings2, Layout, Zap, Sparkles, Trophy, Brain, Layers, Rocket, Grid3X3, Activity
} from 'lucide-react';
import OmniAgentFloatingAgent from '../components/brand/OmniAgentFloatingAgent';
import WorkspacePanel from '../components/brand/WorkspacePanel';
import ComposerFooter from '../components/brand/ComposerFooter';
import OmniAgentControlCenter from '../components/brand/OmniAgentControlCenter';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useOmniResonance } from '../src/client/hooks/useOmniResonance';

const navGroups = [
  {
    label: 'CORE',
    items: [
      { href: '/', label: '控制台', sub: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { href: '/editor', label: '永續撰寫', sub: 'SustainWrite', icon: <FileText size={18} /> },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: <Fingerprint size={18} /> },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: <HeartPulse size={18} /> },
      { href: '/advisory', label: '專家諮詢', sub: 'Advisory', icon: <MessageSquare size={18} /> },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence', icon: <BarChart3 size={18} /> },
      { href: '/data-sources', label: '數據中樞', sub: 'Data Hub', icon: <Cable size={18} /> },
    ],
  },
  {
    label: 'OMNIAGENT oX',
    items: [
      { href: '/walkthrough', label: '新手教學', sub: 'Onboarding', icon: <Rocket size={18} /> },
      { href: '/omniagent-orchestrator', label: '調度中心', sub: 'Orchestrator', icon: <Bot size={18} /> },
      { href: '/omniagent-alchemy', label: '煉金術', sub: 'Alchemy Scan', icon: <Sparkles size={18} /> },
      { href: '/best-practice', label: '最佳實踐', sub: 'Best Practice', icon: <Trophy size={18} /> },
      { href: '/strategy-lab', label: '策略實驗室', sub: 'Strategy Lab', icon: <Brain size={18} /> },
      { href: '/omniagent-architecture', label: '架構治理', sub: 'Living Arch', icon: <Layers size={18} /> },
      { href: '/terminal', label: '終端系統', sub: 'Agent OS', icon: <Command size={18} /> },
    ],
  },
  {
    label: 'E-S-G 模組',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: <Leaf size={18} /> },
      { href: '/social', label: '社會影響', sub: 'Social', icon: <Users size={18} /> },
      { href: '/governance', label: '公司治理', sub: 'Governance', icon: <ShieldCheck size={18} /> },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { href: '/matrix', label: '終始矩陣', sub: 'E2E Matrix', icon: <Grid3X3 size={18} /> },
      { href: '/materiality', label: '重大性矩陣', sub: 'Materiality', icon: <Hexagon size={18} /> },
      { href: '/audit-log', label: '審計日誌', sub: 'Audit Log', icon: <ListChecks size={18} /> },
      { href: '/vault', label: '證據金庫', sub: 'Evidence Vault', icon: <Lock size={18} /> },
      { href: '/document-checklist', label: '文件清單', sub: 'Doc Checklist', icon: <ClipboardList size={18} /> },
      { href: '/auditor', label: '審計助手', sub: 'Auditor', icon: <Shield size={18} /> },
    ],
  },
];

function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setResults(navGroups.flatMap(g => g.items).slice(0, 6));
      return;
    }
    const filtered = navGroups.flatMap(g => g.items).filter(item => 
      item.label.includes(query) || item.sub.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-start justify-center pt-[15vh] px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search size={20} className="text-slate-400" />
          <input className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-berkeley-blue placeholder:text-slate-300" placeholder="搜尋功能或指令..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          <div className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">ESC</div>
        </div>
        <div className="p-4 max-h-[50vh] overflow-y-auto no-scrollbar">
          {results.map((item, i) => (
            <button key={i} onClick={() => { router.push(item.href); onClose(); }} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-berkeley-blue hover:text-white transition-all group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-california-gold">{item.icon}</div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-tight">{item.label}</p>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{item.sub}</p>
              </div>
              <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { rs, status: rsStatus } = useOmniResonance();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsControlCenterOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans selection:bg-berkeley-blue/10">
      {/* Sidebar Navigation */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-full bg-white/40 backdrop-blur-2xl border-r border-slate-200/50 flex flex-col relative z-50 overflow-hidden shadow-sm"
      >
        <div className="p-8 border-b border-slate-100/50">
           <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-berkeley-blue flex items-center justify-center text-california-gold shadow-lg group-hover:scale-105 transition-transform duration-500">
                 <Fingerprint size={28} />
              </div>
              <div className="overflow-hidden">
                 <h2 className="text-xl font-black text-berkeley-blue tracking-tighter uppercase whitespace-nowrap">ESG GO | oX</h2>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5">OmniCore Genesis</p>
              </div>
           </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-10 no-scrollbar">
           {navGroups.map((group, i) => (
             <div key={i} className="space-y-3">
                <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{group.label}</p>
                <div className="space-y-1">
                   {group.items.map((item, j) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link 
                          key={j} 
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[13px] font-black transition-all duration-300 group",
                            isActive 
                              ? "bg-berkeley-blue text-white shadow-lg scale-[1.02]" 
                              : "text-slate-500 hover:text-berkeley-blue hover:bg-white/60"
                          )}
                        >
                           <span className={cn("transition-colors", isActive ? "text-california-gold" : "group-hover:text-berkeley-blue")}>
                              {item.icon}
                           </span>
                           <span className="flex-1">{item.label}</span>
                           <span className={cn("text-[9px] font-bold opacity-0 group-hover:opacity-40 uppercase transition-opacity", isActive && "opacity-20")}>{item.sub}</span>
                        </Link>
                      );
                   })}
                </div>
             </div>
           ))}
        </nav>

        {/* Global Resonance Status Bar */}
        <div className="p-6 border-t border-slate-100/50 space-y-6 bg-slate-50/30">
           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resonance Index</span>
                 <span className="text-[11px] font-black font-mono text-berkeley-blue">Rs {(rs * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                   animate={{ width: `${rs * 100}%` }} 
                   className={cn("h-full transition-colors duration-1000", rs >= 0.9 ? 'bg-verified' : 'bg-california-gold')} 
                 />
              </div>
              <p className="text-[9px] text-center font-black text-slate-400 uppercase tracking-[0.2em]">{rsStatus}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsControlCenterOpen(true)}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 hover:border-berkeley-blue hover:text-berkeley-blue transition-all shadow-sm uppercase tracking-widest"
              >
                 <Settings2 size={12} /> KERNEL
              </button>
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 hover:border-berkeley-blue hover:text-berkeley-blue transition-all shadow-sm uppercase tracking-widest"
              >
                 <Command size={12} /> OS_CMD
              </button>
           </div>
        </div>
      </motion.aside>

      {/* Main Framework Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-berkeley-blue transition-all"
              >
                 {isSidebarOpen ? <ChevronLeft size={20} /> : <Layout size={20} />}
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-verified animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">OmniSync: Operational</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                 <Activity size={14} className="text-berkeley-blue" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ren/Du Balancer: <span className="text-berkeley-blue uppercase">Balanced</span></span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                 <Users size={20} className="text-slate-400" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar relative p-8 lg:p-12">
           <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="max-w-[1600px] mx-auto"
              >
                 {children}
              </motion.div>
           </AnimatePresence>
        </main>
        
        {/* Universal Components */}
        <OmniAgentFloatingAgent />
        <OmniAgentControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      </div>
    </div>
  );
}
