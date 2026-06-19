import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Shield,
  Activity,
  Cpu,
  Database,
  Lock,
  MessageSquare,
  Sparkles,
  Search,
  Settings,
  X,
  Plus,
  ArrowRight,
  Fingerprint,
  Layers,
  Globe,
  Star,
  Info,
  Compass,
  TrendingUp,
  Share2,
  Users,
} from 'lucide-react';
import { useOmniTwin } from '@/hooks/useOmniTwin';
import { ComponentCoreFactory, IComponentCore, createAlchemyForge, ResonanceResult } from '@/services/ceremony';
import '../../styles/liquid-glass.css';
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

/**
 * 🤖 Omni-Sprite Digital Twin (奧秘精靈 數位分身)
 * --------------------------------------------------
 * [設計] 極致奢華 Obsidian x Imperial Gold 視覺
 * [組件] 3D 全像投射中心、DNA 德行指標、全球共鳴矩陣
 * [價值] 善向永續：個人化 AI 的數位覺醒與主權管理
 */

interface KnowledgeNode {
  id: string;
  title: string;
  category: 'ESG' | 'MARKET' | 'LAW' | 'CORE';
  confidence: number;
}

const PARTICLE_COUNT = 20;
const PARTICLE_RANGE = 2000;
const PARTICLE_OFFSET = 1000;
const MIN_DURATION = 10;
const DURATION_RANGE = 10;
const SEED_MULTIPLIER = 13.37;

const OPACITY_LOW = 0.1;
const OPACITY_MED = 0.2;
const OPACITY_HIGH = 0.8;

const SCALE_BASE = 1;
const SCALE_AURA_PEAK = 1.2;
const SCALE_AVATAR_PEAK = 1.1;

const AURA_SCALE = [SCALE_BASE, SCALE_AURA_PEAK, SCALE_BASE];
const AURA_OPACITY = [OPACITY_LOW, OPACITY_MED, OPACITY_LOW];
const AURA_DURATION = 4;

const AVATAR_SCALE = [SCALE_BASE, SCALE_AVATAR_PEAK, SCALE_BASE];
const AVATAR_OPACITY = [OPACITY_MED, OPACITY_HIGH, OPACITY_MED];
const AVATAR_DURATION = 3;

const Y_OFFSET_PEAK = -10;
const FLOATING_Y = [0, Y_OFFSET_PEAK, 0];
const FLOATING_DURATION = 4;

const GLOW_PRIMARY = 'rgba(13, 242, 238, 0.4)';
const GLOW_SECONDARY = 'rgba(13, 242, 238, 0.1)';
const RADIUS_LARGE = 800;
const BLUR_LARGE = 80;
const AVATAR_SIZE = 64;
const SPARKLES_SIZE = 110;
const FINGERPRINT_SIZE = 16;
const ICON_SMALL = 14;
const BRAIN_SIZE = 120;
const PERCENT_FACTOR = 100;
const RADIUS_RING_SMALL = 500;
const RADIUS_RING_MED = 400;
const RADIUS_RING_TIGHT = 398;
const RADIUS_GLOW_MED = 600;

const SEED_1 = 1;
const SEED_2 = 2;
const SEED_3 = 3;
const SEED_4 = 4;
const SEED_5 = 5;
const SEED_6 = 6;
const SEED_7 = 7;

export const OmniDigitalTwin: React.FC = () => {
  const { agent, chatHistory, isThinking, sendMessage, metrics } = useOmniTwin();
  const [activeTab, setActiveTab] = useState<'interaction' | 'knowledge' | 'vitals'>('interaction');
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 5T Protocol Core Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/OmniDigitalTwin.tsx',
      '1.0.0',
      ['Omni-Sprite', 'DigitalSelf', '5T-Protocol']
    )
  );

  const [rsResult, setRsResult] = useState<ResonanceResult | null>(null);

  // Generate stable particles outside or with a seed to ensure purity
  const particles = useMemo(() => {
    return [...Array(PARTICLE_COUNT)].map((_, i) => {
      // Use a simple deterministic pseudo-random function based on index
      const seed = (i + 1) * SEED_MULTIPLIER;
      const pseudoRandom = (n: number) => Math.abs(Math.sin(seed * n));

      return {
        id: i,
        initialX: pseudoRandom(SEED_1) * PARTICLE_RANGE - PARTICLE_OFFSET,
        initialY: pseudoRandom(SEED_2) * PARTICLE_RANGE - PARTICLE_OFFSET,
        animateX: [
          pseudoRandom(SEED_3) * PARTICLE_RANGE - PARTICLE_OFFSET,
          pseudoRandom(SEED_4) * PARTICLE_RANGE - PARTICLE_OFFSET,
        ],
        animateY: [
          pseudoRandom(SEED_5) * PARTICLE_RANGE - PARTICLE_OFFSET,
          pseudoRandom(SEED_6) * PARTICLE_RANGE - PARTICLE_OFFSET,
        ],
        duration: pseudoRandom(SEED_7) * DURATION_RANGE + MIN_DURATION,
      };
    });
  }, []);

  useEffect(() => {
    const forge = createAlchemyForge();
    const result = forge.calculateResonance(
      { agentId: agent.id, metrics, coreUuid: core.uuid },
      'OmniDigitalTwin'
    );
    setRsResult(result);
  }, [agent.id, metrics, core.uuid]);

  const vitals = [
    {
      label: '知識資產 ASSETS',
      value: metrics.knowledgeAssets.toString(),
      trend: 'APPRECIATING',
      color: 'text-emerald-400',
      icon: Database,
    },
    {
      label: 'ESG 財富值 WEALTH',
      value: '1,420',
      trend: '+12.5%',
      color: 'text-primary',
      icon: TrendingUp,
    },
    {
      label: '學習進度 LEARNING',
      value: `${metrics.learningProgress}%`,
      trend: 'ACTIVE',
      color: 'text-sky-400',
      icon: Brain,
    },
    {
      label: '導師共鳴 MENTOR',
      value: rsResult ? `${rsResult.rs_score}%` : `${metrics.resonance.toFixed(0)}%`,
      trend: rsResult ? rsResult.tier : 'SYNCED',
      color: rsResult?.tier === 'Pulse' ? 'text-emerald-400' : 'text-purple-400',
      icon: Zap,
    },
  ];

  const learningGoal = {
    title: 'ESG 永續金融概論',
    progress: 65,
    remaining: '3 知識點',
  };

  const knowledgeNodes: KnowledgeNode[] = [
    { id: 'kn_1', title: 'ISO 14064-1 碳足跡標準', category: 'ESG', confidence: 0.98 },
    { id: 'kn_2', title: '歐盟 CBAM 最新關稅政策', category: 'LAW', confidence: 0.95 },
    { id: 'kn_3', title: '全球半導體 ESG 趨勢分析', category: 'MARKET', confidence: 0.92 },
    { id: 'kn_4', title: '善向核心 5T 驗證協議', category: 'CORE', confidence: 1.0 },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <TooltipProvider>
      <div
        className="liquid-glass-strong text-slate-200 min-h-screen p-8 font-sans selection:bg-cyan-500/30 overflow-hidden relative border-4 border-white/5 m-2 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        data-uuid={core.uuid}
        data-timestamp={core.timestamp}
        data-5t-protocol="active"
      >
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(13,242,238,0.08)_0%,transparent_70%)]" />
          <div className="absolute top-[-20%] left-[-10%] size-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] size-[500px] bg-sky-900/10 rounded-full blur-[100px]" />

          {/* Immersive Knowledge Flow Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{
                x: p.initialX,
                y: p.initialY,
                opacity: 0,
              }}
              animate={{
                x: p.animateX,
                y: p.animateY,
                opacity: [0, OPACITY_MED, 0],
                scale: [0, SCALE_BASE, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute size-1 bg-primary/40 rounded-full blur-[1px]"
            />
          ))}

          {/* Pulsing Resonance Aura */}
          <motion.div
            animate={{
              scale: AURA_SCALE,
              opacity: AURA_OPACITY,
            }}
            transition={{ duration: AURA_DURATION, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[${RADIUS_LARGE}px] bg-primary/5 rounded-full blur-[${BLUR_LARGE}px]`}
          />
        </div>

        <header className="flex justify-between items-center mb-10 relative z-10 px-4">
          <div className="flex items-center gap-6">
            <div
              className={`size-${FINGERPRINT_SIZE} rounded-3xl bg-gradient-to-br from-primary to-primary/40 p-[1px] shadow-[0_0_30px_rgba(13,242,238,0.3)]`}
            >
              <div className="size-full liquid-glass rounded-[inherit] flex items-center justify-center">
                <Fingerprint className="text-primary size-8" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white">
                {agent.name.split(' ')[0]}{' '}
                <span className="text-primary">{agent.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-[10px] text-[#9cbab7] font-mono tracking-[0.4em] uppercase mt-1">
                Omni-Sprite Digital Twin | Sentient V10.2 | UID: {agent.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {['智慧導引', '知識資產庫', '成長維度'].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(['interaction', 'knowledge', 'vitals'][i] as any)}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === ['interaction', 'knowledge', 'vitals'][i]
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-white'
                    }`}
                >
                  {tab}
                  {activeTab === ['interaction', 'knowledge', 'vitals'][i] && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4 liquid-glass border border-white/10 rounded-2xl px-6 py-3 shadow-xl">
              <Users className="text-primary size-4" />
              <span className="text-[10px] font-black tracking-widest text-primary">
                推薦加入 +14
              </span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-8 relative z-10 h-[calc(100vh-200px)]">
          {/* Left Column: DNA & Knowledge Nodes */}
          <div className="col-span-3 space-y-8 flex flex-col">
            {/* DNA Section */}
            <section className="bg-slate-950/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Compass size={40} className="text-primary" />
              </div>
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8 flex items-center gap-3">
                <TrendingUp size={14} className="text-primary" /> 當前學習路徑
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-primary/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-white">{learningGoal.title}</span>
                    <span className="text-[9px] font-mono text-primary">
                      {learningGoal.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${learningGoal.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500">剩餘：{learningGoal.remaining}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-600 tracking-widest uppercase mb-2">
                    導師建議 NEXT STEP
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-primary/30 cursor-pointer transition-all group">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Shield size={12} />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-white">
                      探索 CBAM 數據驗證邏輯
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Knowledge Assets */}
            <section className="bg-slate-950/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl flex-1 flex flex-col min-h-0">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Database size={14} className="text-primary" /> ESG 知識資產庫
                </span>
                <span className="text-primary/40">ASSETS: {metrics.knowledgeAssets}</span>
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {knowledgeNodes.map(node => (
                  <div
                    key={node.id}
                    className="p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-primary/40 transition-all group cursor-help"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold tracking-widest uppercase">
                        {node.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {(node.confidence * PERCENT_FACTOR).toFixed(0)}%
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-tight">
                      {node.title}
                    </h4>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Center Column: Avatar Visualizer */}
          <div className="col-span-6 relative flex flex-col items-center justify-center bg-slate-950/20 rounded-[4rem] border border-white/5 shadow-inner">
            {/* Visualizer Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className={`size-[${RADIUS_RING_SMALL}px] border border-primary/10 rounded-full border-dashed`}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className={`absolute size-[${RADIUS_RING_MED}px] border border-primary/5 rounded-full flex items-center justify-center`}
              >
                <div
                  className={`size-[${RADIUS_RING_TIGHT}px] border-t border-b border-primary/20 rounded-full`}
                />
              </motion.div>
              <div
                className={`absolute size-[${RADIUS_GLOW_MED}px] bg-[radial-gradient(circle_at_center,rgba(13,242,238,0.05)_0%,transparent_60%)]`}
              />
            </div>

            {/* Central Avatar Display */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative cursor-pointer group"
              >
                <div className="size-64 rounded-full bg-slate-900 border-4 border-primary/20 shadow-[0_0_80px_rgba(13,242,238,0.1)] flex items-center justify-center overflow-hidden">
                  {/* Premium AI Digital Twin Avatar Placeholder */}
                  <div className="size-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                    <div className="relative">
                      <Brain
                        size={BRAIN_SIZE}
                        className="text-primary/40 group-hover:text-primary/80 transition-colors duration-700"
                      />
                      {agent.isAwakened && (
                        <motion.div
                          animate={{ opacity: AVATAR_OPACITY, scale: AVATAR_SCALE }}
                          transition={{ duration: AVATAR_DURATION, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Sparkles size={SPARKLES_SIZE} className="text-primary/30 blur-[2px]" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
                <motion.div
                  animate={{ y: FLOATING_Y }}
                  transition={{ duration: FLOATING_DURATION, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 p-4 bg-slate-900/90 border border-primary/40 rounded-3xl shadow-2xl backdrop-blur-xl"
                >
                  <Star className="text-primary size-6 fill-primary/20" />
                </motion.div>
              </motion.div>

              <div className="mt-12 text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  智慧導師 <span className="text-primary">WISDOM MENTOR</span>
                </h2>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    <Share2 size={14} /> 分享這份洞察
                  </button>
                  <div className="px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    沉浸式導引中
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Ribbon */}
            <div className="absolute bottom-10 left-0 w-full px-12 grid grid-cols-4 gap-6">
              {vitals.map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-[2rem] flex flex-col items-center text-center backdrop-blur-xl group hover:border-[primary]/30 transition-all"
                >
                  <v.icon
                    size={16}
                    className={`${v.color} mb-3 opacity-60 group-hover:opacity-100 transition-opacity`}
                  />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    {v.label}
                  </span>
                  <span className={`text-xl font-black ${v.color}`}>{v.value}</span>
                  <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase tracking-tight">
                    {v.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Wisdom Nav / Hub */}
          <div className="col-span-3 bg-slate-950/50 border border-slate-800 rounded-[3rem] shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col relative">
            {/* Hub Header */}
            <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase flex items-center gap-3">
                <Compass size={14} className="text-primary" /> 智慧導引中心
              </h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-white transition-colors">
                  <Settings size={14} />
                </button>
                <button className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Users size={14} />
                </button>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6 font-mono">
              <AnimatePresence>
                {chatHistory.map((chat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${chat.role === 'user' ? 'text-sky-400' : 'text-primary'}`}
                      >
                        {chat.role === 'user' ? 'Seeker / 學習者' : 'Wisdom Mentor / 導師'}
                      </span>
                      <span className="text-[8px] text-slate-600 font-mono">{chat.timestamp}</span>
                    </div>
                    <div
                      className={`p-5 rounded-2xl max-w-full text-[13px] leading-relaxed shadow-lg ${chat.role === 'user'
                        ? 'bg-sky-500/10 text-sky-100 border border-sky-500/20'
                        : 'bg-primary/5 text-slate-300 border border-primary/10'
                        }`}
                    >
                      {chat.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[10px] text-primary/60 font-black uppercase tracking-widest pl-2"
                >
                  <Zap size={10} className="animate-pulse" /> 思維對齊中...
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Command Input Area */}
            <div className="p-8 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
              <form onSubmit={handleSend} className="relative">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={isThinking}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-12 py-5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 disabled:opacity-50"
                  placeholder={isThinking ? '等待數位分身回應...' : '輸入指令或查詢核心知識...'}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <ArrowRight size={18} />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary rounded-xl flex items-center justify-center text-slate-950 hover:bg-primary/80 transition-all active:scale-90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:bg-slate-800"
                >
                  <Plus size={20} />
                </button>
              </form>
              <div className="mt-6 flex justify-between items-center px-2">
                <div className="flex gap-4">
                  <Globe size={14} className="text-slate-700 hover:text-sky-400 cursor-pointer" />
                  <Shield
                    size={14}
                    className="text-slate-700 hover:text-emerald-400 cursor-pointer"
                  />
                </div>
                <span className="text-[9px] font-black text-slate-700 tracking-[0.3em] uppercase">
                  Secure Link Active
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-10 pt-6 border-t border-slate-800/50 flex justify-between items-center text-slate-600 relative z-10">
          <div className="flex gap-10 text-[9px] font-bold tracking-[0.2em] uppercase">
            <span>數據完整性: 100%</span>
            <span>網絡狀態: 零知識證明驗證 (ZKP)</span>
            <span>最近備份: 2分鐘前</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/40">
            © JUNAIKEY SOVEREIGN IDENTITY • TWIN CORE v10.2
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default OmniDigitalTwin;
