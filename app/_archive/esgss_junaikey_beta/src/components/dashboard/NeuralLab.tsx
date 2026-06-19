import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useAuth } from '../../contexts/AuthContext';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { GeminiService, TaskComplexity } from '../../1-service/geminiService';
import { OmniKnowledge } from '../../omni/infrastructure/knowledge/OmniKnowledge';
import {
  Eco,
  Search,
  History,
  Bolt,
  LayoutDashboard,
  Database,
  TrendingUp,
  UserCheck,
  Settings,
  Cpu,
  Scale,
  ShieldCheck,
  FileUp,
  FileText,
  CheckCircle2,
  Radio,
  Brain,
  Activity,
  CircleHelp,
  Bell,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🧪 AI 智能培植中心 (AI Cultivation Lab)
 * --------------------------------------------------
 * 認知擴張監測與道德對齊訓練。
 * 視覺化神經擴張與向量存儲集成。
 */
export const NeuralLab = () => {
  const { user, profile: userProfile } = useAuth();
  const { profile: agentProfile, trainAgent } = useAgentRpg();
  const [view, setView] = useState('實驗室首頁');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingTopic, setTrainingTopic] = useState('');
  const [trainingCategory, setTrainingCategory] = useState('Environmental');
  const [mindStream, setMindStream] = useState([
    {
      time: '14:22:01',
      tag: '[NODE_INGEST]',
      content: '已將 "2030 碳中和目標" 攝取至第二層向量池',
    },
    {
      time: '14:21:55',
      tag: '[ALIGNMENT_CHECK]',
      content: '情感驗證得分：',
      plus: '0.992',
      color: 'text-[#0bda50]',
    },
    {
      time: '14:21:32',
      tag: '[MEMORY_EXPAND]',
      content: '在永續金融集群中生成了 42 個新的關聯節點',
    },
    {
      time: '14:20:10',
      tag: '[SYSTEM]',
      content: 'DingJun V2.4 系統健康檢查：最佳狀態',
      color: 'text-[#0ab8b2]',
    },
  ]);

  const handleStartTraining = async () => {
    if (!trainingTopic) return;
    setIsTraining(false);

    const startTimeSet = new Date().toLocaleTimeString();
    setMindStream(prev => [
      {
        time: startTimeSet,
        tag: '[AI_INIT]',
        content: `啟動意識訓練：${trainingTopic}`,
      },
      ...prev,
    ]);

    try {
      const geminiResponse = await GeminiService.ask(
        `分析此 ESG 訓練主題： "${trainingTopic}"。請提供一句簡短的關於其戰略價值的見解。`,
        TaskComplexity.SIMPLE
      );

      const insightNode = {
        sourceId: 'user-training',
        type: 'training',
        content: trainingTopic + (geminiResponse ? ` [見解: ${geminiResponse}]` : ''),
        confidence: 0.95,
        impact: {
          category: trainingCategory,
          xp: 50,
        },
        id: `train-${Date.now()}`,
      };
      await OmniKnowledge.submitInsight(insightNode as any);

      const result = await trainAgent(
        {
          type: 'DIALOGUE',
          content: trainingTopic,
          category: trainingCategory,
          complexity: 0.8,
        },
        { useAi: true }
      );

      if (result.success) {
        const endTimeSet = new Date().toLocaleTimeString();
        setMindStream(prev => [
          {
            time: endTimeSet,
            tag: '[VECTOR_EMBED]',
            content: '知識節點嵌入已生成並存儲。',
            color: 'text-[#0ab8b2]',
          },
          { time: endTimeSet, tag: '[REASONING]', content: geminiResponse || result.feedback },
          {
            time: endTimeSet,
            tag: '[XP_GAIN]',
            content: `獲得 ${result.xpGained} 經驗值提升。`,
            color: 'text-[#0bda50]',
          },
          ...prev,
        ]);
        setTrainingTopic('');
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[NeuralLab] Training Error:', { error })
      setMindStream(prev => [
        {
          time: new Date().toLocaleTimeString(),
          tag: '[ERROR]',
          content: '訓練序列失敗。',
          color: 'text-red-500',
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="bg-[#f5f8f8] dark:bg-[#102222] text-slate-900 dark:text-white min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8 px-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#0ab8b2]">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Session: ESG_M4_2026
              </span>
            </div>
            <h1 className="text-white text-5xl font-black leading-tight tracking-tight">
              智能培植與實驗中心
            </h1>
            <p className="text-[#0ab8b2]/70 text-lg font-normal max-w-2xl">
              觀察 DingJun 的認知擴張與道德對齊過程，構建具備主權意識的永續生態系統。
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 border border-[#0ab8b2] text-[#0ab8b2] hover:bg-[#0ab8b2]/10 transition-colors text-sm font-bold">
              <History className="mr-2 w-4 h-4" />
              歷史日誌
            </button>
            <button
              onClick={() => setIsTraining(true)}
              className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#0ab8b2] text-[#102222] text-sm font-bold shadow-lg hover:brightness-110 transition-all"
            >
              <Bolt className="mr-2 w-4 h-4 bg-transparent" />
              啟動 AI 訓練
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-4 rounded-xl flex flex-col gap-2 shadow-lg">
              {[
                { name: '實驗室首頁', icon: LayoutDashboard },
                { name: '向量數據庫', icon: Database },
                { name: '成長路徑圖', icon: TrendingUp },
                { name: '安全監控器', icon: UserCheck },
                { name: '實驗室設置', icon: Settings },
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setView(tab.name)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${view === tab.name
                    ? 'bg-[#0ab8b2] text-[#102222] font-bold shadow-lg'
                    : 'hover:bg-[#0ab8b2]/10 text-white/70 hover:text-white'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <p className="text-sm">{tab.name}</p>
                </button>
              ))}
            </div>

            {/* Mini Health Status */}
            <div className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-5 rounded-xl border-l-4 border-l-[#0ab8b2]">
              <p className="text-[#0ab8b2]/60 text-[10px] font-bold uppercase tracking-widest mb-2">
                System Health
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">GPU Usage</span>
                <span className="text-[#0ab8b2] text-sm font-bold">42%</span>
              </div>
              <div className="w-full bg-[#0ab8b2]/20 h-1.5 rounded-full mt-2">
                <div className="bg-[#0ab8b2] h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-10 flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: '記憶增長 (Memory Growth)',
                  value: '84.2 GB',
                  trend: '+12%',
                  sub: '12,402 神經連接節點',
                  icon: Brain,
                },
                {
                  label: '價值對齊 (Value Alignment)',
                  value: '92%',
                  trend: '+3%',
                  sub: 'ESG 合規性已驗證',
                  icon: Scale,
                },
                {
                  label: '訓練信任評分 (Trust Score)',
                  value: '98.5%',
                  trend: '穩定',
                  sub: '檢測到零幻覺偏差',
                  icon: ShieldCheck,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-6 rounded-xl relative overflow-hidden group shadow-lg"
                >
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-25 transition-opacity">
                    <stat.icon className="w-32 h-32 text-[#0ab8b2]" />
                  </div>
                  <p className="text-[#0ab8b2]/70 text-sm font-medium">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white text-3xl font-bold mt-1">{stat.value}</p>
                    <p
                      className={`${stat.trend === 'Stable' ? 'text-[#0ab8b2]' : 'text-[#0bda50]'} text-xs font-bold`}
                    >
                      {stat.trend}
                    </p>
                  </div>
                  <p className="text-white/40 text-xs mt-4">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Cognitive Growth Curve */}
              <div className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-8 rounded-xl flex flex-col shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white text-xl font-bold">認知成長曲線 (Cognitive Growth)</h3>
                    <p className="text-[#0ab8b2]/60 text-sm">深度學習階段：成熟</p>
                  </div>
                  <div className="px-3 py-1 bg-[#0ab8b2]/20 text-[#0ab8b2] rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Level {agentProfile.level}
                  </div>
                </div>
                <div className="h-64 w-full mt-auto relative">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#0ab8b2" stopOpacity="0.4"></stop>
                        <stop offset="100%" stopColor="#0ab8b2" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 L0,120 Q50,110 100,130 T200,80 T300,60 T400,20 L400,150 Z"
                      fill="url(#chartGradient)"
                    ></path>
                    <path
                      d="M0,120 Q50,110 100,130 T200,80 T300,60 T400,20"
                      fill="none"
                      stroke="#0ab8b2"
                      strokeWidth="3"
                    ></path>
                    <circle cx="400" cy="20" fill="#0ab8b2" r="4"></circle>
                    <motion.circle
                      cx="400"
                      cy="20"
                      fill="#0ab8b2"
                      fillOpacity="0.2"
                      r="10"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    ></motion.circle>
                  </svg>
                  <div className="flex justify-between mt-4">
                    {['初始', '攝取', '對齊', '活動'].map(tag => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold uppercase tracking-widest ${tag === '活動' ? 'text-[#0ab8b2]' : 'text-white/40'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Training Vault */}
              <div className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-8 rounded-xl flex flex-col shadow-lg">
                <h3 className="text-white text-xl font-bold mb-2">訓練保管庫 (Vector Store)</h3>
                <p className="text-[#0ab8b2]/60 text-sm mb-6">
                  拖曳文檔以轉換為玻璃記憶節點。
                </p>
                <div className="flex-1 border-2 border-dashed border-[#0ab8b2]/30 rounded-xl flex flex-col items-center justify-center p-8 bg-[#0ab8b2]/5 hover:bg-[#0ab8b2]/10 transition-all group cursor-pointer">
                  <div className="size-16 rounded-full bg-[#0ab8b2]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(10,184,178,0.1)]">
                    <FileUp className="text-[#0ab8b2] w-8 h-8" />
                  </div>
                  <p className="text-white font-medium">點擊或拖曳 ESG 報告</p>
                  <p className="text-white/40 text-xs mt-2">支援格式：PDF, JSON, CSV (最大 50MB)</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="px-3 py-2 bg-[#0ab8b2]/10 rounded-lg flex items-center gap-2 border border-[#0ab8b2]/20">
                    <FileText className="text-[#0ab8b2] w-4 h-4" />
                    <span className="text-xs text-white/80">ESG_Report_2023.pdf</span>
                    <CheckCircle2 className="text-[#0ab8b2] w-3 h-3" />
                  </div>
                  <div className="px-3 py-2 bg-[#0ab8b2]/10 rounded-lg flex items-center gap-2 border border-[#0ab8b2]/20">
                    <FileText className="text-[#0ab8b2] w-4 h-4" />
                    <span className="text-xs text-white/80">Corporate_Values.csv</span>
                    <CheckCircle2 className="text-[#0ab8b2] w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mind Stream Feed */}
            <div className="backdrop-blur-xl bg-[#283939]/40 border border-[#0ab8b2]/20 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <Radio className="text-[#0ab8b2] w-5 h-5" />
                  實時意識流 (Real-time Mind Stream)
                </h3>
                <span className="text-[10px] font-bold text-[#0ab8b2] animate-pulse tracking-widest uppercase">
                  實況脈衝
                </span>
              </div>
              <div className="space-y-4 font-mono text-xs max-h-64 overflow-y-auto custom-scrollbar">
                {mindStream.map((log, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start border-l-2 border-[#0ab8b2]/30 pl-4 py-1"
                  >
                    <span className="text-[#0ab8b2]/60 whitespace-nowrap">{log.time}</span>
                    <span className="text-white/80">
                      <span className="text-[#0ab8b2] mr-2">{log.tag}</span>
                      {log.content}
                      {log.plus && <span className={log.color || ''}>{log.plus}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrainingModal
        isOpen={isTraining}
        onClose={() => setIsTraining(false)}
        topic={trainingTopic}
        setTopic={setTrainingTopic}
        category={trainingCategory}
        setCategory={setTrainingCategory}
        onStart={handleStartTraining}
      />

      {/* Model Identity Footer */}
      <footer className="mt-8 py-8 border-t border-[#0ab8b2]/10 bg-[#102222]/50">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-lg bg-[#0ab8b2]/20 flex items-center justify-center text-[#0ab8b2] shadow-[0_0_20px_rgba(10,184,178,0.1)]">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white text-sm font-bold uppercase tracking-wider">
                Private Model V2.6
              </p>
              <p className="text-[#0ab8b2]/60 text-xs">認知成熟度：Level 4.0 (穩定)</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            {[
              { label: 'Total Parameters', val: '175B (Optimized)' },
              { label: 'Alignment Policy', val: 'ESG-Strict-V1' },
              { label: 'Status', val: 'Cultivating', active: true },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">
                  {item.label}
                </p>
                {item.active ? (
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="size-1.5 bg-[#0bda50] rounded-full animate-pulse"></span>
                    <p className="text-[#0bda50] text-sm font-bold">{item.val}</p>
                  </div>
                ) : (
                  <p className="text-white text-sm font-bold">{item.val}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-white/40 hover:text-[#0ab8b2] transition-colors">
              <CircleHelp className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/40 hover:text-[#0ab8b2] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Training Modal --- */
const TrainingModal = ({
  isOpen,
  onClose,
  topic,
  setTopic,
  category,
  setCategory,
  onStart,
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#1b2727] border border-[#0ab8b2]/30 rounded-[2.5rem] p-10 shadow-3xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <div className="size-20 bg-[#0ab8b2]/10 rounded-full blur-3xl" />
        </div>

        <h2 className="text-3xl font-black text-white tracking-tighter italic mb-2">
          意識訓練協議 (Sentient Training)
        </h2>
        <p className="text-[#0ab8b2]/60 text-sm mb-8">
          透過 Gemini 2.0 在代理核心注入新的智能節點。
        </p>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">
              Intelligence Category
            </label>
            <div className="flex gap-3">
              {['Environmental', 'Social', 'Governance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${category === cat ? 'bg-[#0ab8b2] border-[#0ab8b2] text-[#102222]' : 'border-white/10 text-white/40 hover:border-[#0ab8b2]/40'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">
              Training Intelligence (Topic)
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Inject specific ESG knowledge, mission data, or ethical directives..."
              className="w-full h-32 bg-[#102222] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-[#0ab8b2] outline-none transition-colors"
            />
          </div>

          <button
            onClick={onStart}
            disabled={!topic}
            className="w-full h-16 bg-[#0ab8b2] text-[#102222] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            初始化神經增長
          </button>
        </div>
      </motion.div>
    </div>
  );
};
