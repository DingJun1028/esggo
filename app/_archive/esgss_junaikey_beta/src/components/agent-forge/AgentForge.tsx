import React, { useState } from 'react';
import {
  Plus,
  Brain,
  Zap,
  Shield,
  Users,
  Sparkles,
  MoreVertical,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CreateAgentModal } from './CreateAgentModal';

interface CustomAgent {
  name: string;
  role: 'E' | 'S' | 'G';
  description: string;
}

export const AgentForge: React.FC = () => {
  const { style } = useTheme();
  // 強制使用高級玻璃質感，如果 style 是 glass，否則使用基礎玻璃
  const panelBaseClass =
    'relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Forging Ritual State
  const [isForging, setIsForging] = useState(false);
  const [forgeLogs, setForgeLogs] = useState<string[]>([]);
  const [pendingAgent, setPendingAgent] = useState<CustomAgent | null>(null);

  // Placeholder data for custom agents
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>([
    {
      name: 'EcoGuardian Alpha',
      role: 'E',
      description: '專注於分析製造工廠的環境數據與碳排放監控。',
    },
    {
      name: 'Social Pulse',
      role: 'S',
      description: '監控社交媒體動態，尋找社區參與機會與品牌聲譽風險。',
    },
    {
      name: 'Governance Sentinel',
      role: 'G',
      description: '每週執行內部治理協議合規性檢查與風險評估。',
    },
  ]);

  const runForgingRitual = (agent: CustomAgent) => {
    setIsModalOpen(false);
    setIsForging(true);
    setPendingAgent(agent);
    setForgeLogs([]);

    const steps = [
      `Initializing neural core for [${agent.name}]...`,
      `Allocating quantum memory blocks... [OK]`,
      `Synthesizing persona matrix (Role: ${agent.role})...`,
      `Injecting ESG compliance protocols...`,
      `Verifying 4T security handshake...`,
      `Establishing uplink to Omni-Network...`,
      `>> AGENT ONLINE <<`,
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsForging(false);
          setCustomAgents(prev => [...prev, agent]);
          setPendingAgent(null);
        }, 800);
        return;
      }
      const nextLog = steps[stepIndex] || '';
      setForgeLogs(prev => [...prev, nextLog]);
      stepIndex++;
    }, 800); // 0.8s per step
  };

  const handleCreateAgent = (agent: CustomAgent) => {
    runForgingRitual(agent);
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'E':
        return {
          icon: <Zap className="w-5 h-5" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          gradient: 'from-emerald-500/20 to-teal-500/20',
          shadow: 'shadow-emerald-500/10',
          label: 'Environmental',
        };
      case 'S':
        return {
          icon: <Users className="w-5 h-5" />,
          color: 'text-pink-400',
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          gradient: 'from-pink-500/20 to-rose-500/20',
          shadow: 'shadow-pink-500/10',
          label: 'Social',
        };
      case 'G':
        return {
          icon: <Shield className="w-5 h-5" />,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          gradient: 'from-blue-500/20 to-indigo-500/20',
          shadow: 'shadow-blue-500/10',
          label: 'Governance',
        };
      default:
        return {
          icon: <Brain className="w-5 h-5" />,
          color: 'text-slate-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          gradient: 'from-slate-500/20 to-gray-500/20',
          shadow: 'shadow-slate-500/10',
          label: 'General',
        };
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative overflow-x-hidden">
      {/* 裝飾性背景光斑 */}
      <div className="fixed top-20 left-20 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000 pointer-events-none" />

      {/* Forging Overlay */}
      {isForging && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center font-mono p-8">
          <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-lg p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-emerald-500 tracking-wider">
                AGENT_FORGE_V9.0.exe
              </span>
            </div>
            <div className="space-y-2 h-64 overflow-y-auto custom-scrollbar">
              {forgeLogs.map((log, i) => (
                <div key={i} className="text-sm md:text-base">
                  <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-emerald-400">{log}</span>
                </div>
              ))}
              <div className="animate-pulse text-emerald-500 font-bold">_</div>
            </div>
          </div>
          <p className="mt-6 text-slate-400 text-sm animate-pulse tracking-[0.2em]">
            FORGING NEURAL PATHWAYS...
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                智慧體鍛造廠
              </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl">
              設計、訓練並部署您專屬的 ESG 數位員工。賦予它們獨特的角色與權限。
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">鍛造新智慧體</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customAgents.map((agent, index) => {
            const config = getRoleConfig(agent.role);
            return (
              <div
                key={index}
                className={`group glass-panel-premium ${config.shadow} flex flex-col justify-between h-full`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 卡片頂部漸變邊框指示器 */}
                <div className={`gradient-border-top ${config.gradient} group-hover:opacity-100`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`icon-box ${config.bg} ${config.border}`}>
                      <div className={`${config.color}`}>{config.icon}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge-glass ${config.color} ${config.bg} ${config.border}`}>
                        {config.label}
                      </span>
                      <button className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {agent.name}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{agent.description}</p>
                </div>

                <div className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
                  <button className="action-btn-glass hover:bg-blue-500/10 hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                    <Edit3 className="w-4 h-4" />
                    <span>編輯</span>
                  </button>
                  <button className="action-btn-glass hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                    <span>刪除</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* New Agent Placeholder Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 min-h-[280px]"
          >
            <div className="p-4 rounded-full bg-slate-800 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 mb-4">
              <Plus className="w-8 h-8 text-slate-600 group-hover:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-500 group-hover:text-blue-400 transition-colors">
              創建新角色
            </h3>
            <p className="text-sm text-slate-600 group-hover:text-blue-500/70 mt-2 text-center max-w-[200px]">
              點擊此處開始設計新的 ESG 智能代理
            </p>
          </button>
        </div>

        {isModalOpen && (
          <CreateAgentModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateAgent} />
        )}
      </div>
    </div>
  );
};
