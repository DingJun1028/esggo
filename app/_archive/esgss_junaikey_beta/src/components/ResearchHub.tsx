import React from 'react';
import { Microscope, Beaker, Zap, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface ResearchProject {
  id: string;
  title: string;
  category: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'critical';
  researchers: number;
  budget: string;
  deadline: string;
}

export const ResearchHub: React.FC = () => {
  const projects: ResearchProject[] = [
    {
      id: 'r-001',
      title: '新世代固態電池技術研發',
      category: '能源存儲',
      progress: 75,
      status: 'active',
      researchers: 12,
      budget: '$2.5M',
      deadline: '2026 Q3',
    },
    {
      id: 'r-002',
      title: 'AI 驅動碳捕捉效率優化',
      category: '碳技術',
      progress: 42,
      status: 'active',
      researchers: 8,
      budget: '$1.8M',
      deadline: '2026 Q4',
    },
    {
      id: 'r-003',
      title: '供應鏈範疇三排放模型',
      category: '數據分析',
      progress: 90,
      status: 'completed',
      researchers: 5,
      budget: '$0.5M',
      deadline: '2026 Q1',
    },
    {
      id: 'r-004',
      title: '生物可降解包材測試',
      category: '材料科學',
      progress: 15,
      status: 'critical',
      researchers: 6,
      budget: '$1.2M',
      deadline: '2027 Q1',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'paused':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'critical':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '進行中';
      case 'paused':
        return '暫停';
      case 'completed':
        return '已完成';
      case 'critical':
        return '嚴重延遲';
      default:
        return '未知';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            Research Hub
          </h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">
            研發與創新中心 • {projects.length} 個活躍專案
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-2xl">
          <Beaker className="w-4 h-4" />
          啟動新研究
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-cyan-500/20 p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
          <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-xs text-slate-400 uppercase">總專案數</div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/20 p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">96%</div>
            <div className="text-xs text-slate-400 uppercase">研發成功率</div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/20 p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
          <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-slate-400 uppercase">已發表論文</div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">2.5y</div>
            <div className="text-xs text-slate-400 uppercase">平均週期</div>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-500/40 transition-all group backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                  <Beaker className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{project.title}</h3>
                  <div className="text-sm text-slate-400">
                    {project.category} • ID: {project.id}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-md text-xs font-bold border ${getStatusColor(project.status)}`}
              >
                {getStatusLabel(project.status)}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">研發進度 (Progress)</span>
                <span className="text-white font-mono">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm pt-4 border-t border-cyan-500/10">
              <div>
                <div className="text-slate-500 mb-1">研究人員</div>
                <div className="text-white font-mono flex items-center gap-1">
                  {project.researchers} <span className="text-xs text-slate-600">人</span>
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">預算</div>
                <div className="text-white font-mono">{project.budget}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 期限
                </div>
                <div
                  className={`font-mono ${project.status === 'critical' ? 'text-rose-400' : 'text-white'}`}
                >
                  {project.deadline}
                </div>
              </div>
            </div>

            {project.status === 'critical' && (
              <div className="mt-4 p-3 bg-rose-900/20 border border-rose-500/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                <span className="text-sm text-rose-200">
                  警告：關鍵實驗材料短缺，預計延遲 3 週。
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
