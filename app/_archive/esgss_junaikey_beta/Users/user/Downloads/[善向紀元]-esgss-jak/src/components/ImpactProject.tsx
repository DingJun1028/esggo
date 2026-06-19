import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Globe, Award, Plus, CheckCircle, Clock, AlertTriangle } from './icons';

interface ImpactMetric {
  label: string;
  current: number;
  target: number;
  unit: string;
  proxy_value: number;
}

interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  xpReward: number;
  description: string;
}

interface SDGTarget {
  id: number;
  name: string;
  color: string;
}

interface ImpactProjectData {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  impactXP: number;
  sdgs: number[];
  sroi: number;
  milestones: ProjectMilestone[];
  impactMetrics: ImpactMetric[];
  financials: {
    budget: number;
    spent: number;
    revenue_projected: number;
    roi_projected: number;
  };
}

const SDG_TARGETS: SDGTarget[] = [
  { id: 1, name: '消除貧窮', color: 'bg-red-500' },
  { id: 2, name: '消除飢餓', color: 'bg-yellow-500' },
  { id: 3, name: '健康與福祉', color: 'bg-green-500' },
  { id: 7, name: '可負擔能源', color: 'bg-yellow-400' },
  { id: 12, name: '負責任消費', color: 'bg-orange-500' },
  { id: 13, name: '氣候行動', color: 'bg-red-600' },
  { id: 17, name: '夥伴關係', color: 'bg-pink-500' },
];

interface ImpactProjectProps {
  project?: ImpactProjectData;
  compact?: boolean;
}

export const ImpactProject: React.FC<ImpactProjectProps> = ({ project, compact = false }) => {
  const [selectedProject, setSelectedProject] = useState<ImpactProjectData | null>(project || null);

  // 示例項目數據
  const sampleProject: ImpactProjectData = {
    id: 'esg-impact-001',
    title: '2026 ESG 供應鏈轉型計畫',
    description: '協助供應鏈夥伴實現碳中和目標，提升整體供應鏈永續表現',
    status: 'active',
    progress: 75,
    impactXP: 2500,
    sdgs: [7, 12, 13, 17],
    sroi: 3.2,
    milestones: [
      {
        id: 'm1',
        title: '供應鏈碳盤查完成',
        status: 'completed',
        xpReward: 500,
        description: '完成 50 家主要供應商的碳足跡盤查'
      },
      {
        id: 'm2',
        title: '節能技術導入',
        status: 'in_progress',
        xpReward: 800,
        description: '導入 AI 優化能源管理系統'
      },
      {
        id: 'm3',
        title: '供應商認證計劃',
        status: 'pending',
        xpReward: 1200,
        description: '建立供應商永續認證制度'
      }
    ],
    impactMetrics: [
      {
        label: '減碳量',
        current: 12500,
        target: 20000,
        unit: '噸 CO₂e',
        proxy_value: 62.5
      },
      {
        label: '供應商覆蓋率',
        current: 45,
        target: 80,
        unit: '%',
        proxy_value: 56.25
      },
      {
        label: 'SROI 倍數',
        current: 3.2,
        target: 4.0,
        unit: '倍',
        proxy_value: 80
      }
    ],
    financials: {
      budget: 5000000,
      spent: 3200000,
      revenue_projected: 12000000,
      roi_projected: 2.4
    }
  };

  const currentProject = selectedProject || sampleProject;

  if (compact) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-white font-bold text-sm">{currentProject.title}</h4>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            currentProject.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
            currentProject.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {currentProject.status === 'active' ? '進行中' :
             currentProject.status === 'completed' ? '已完成' : '已暫停'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>進度</span>
            <span>{currentProject.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${currentProject.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">SROI: {currentProject.sroi}x</span>
            <span className="text-slate-400">XP: {currentProject.impactXP}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <Target className="text-emerald-400" />
            {currentProject.title}
          </h3>
          <p className="text-slate-400 text-sm">{currentProject.description}</p>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
          currentProject.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
          currentProject.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {currentProject.status === 'active' ? '進行中' :
           currentProject.status === 'completed' ? '已完成' : '已暫停'}
        </div>
      </div>

      {/* SDG 對齊 */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          SDG 目標對齊
        </h4>
        <div className="flex flex-wrap gap-2">
          {currentProject.sdgs.map(sdgId => {
            const sdg = SDG_TARGETS.find(s => s.id === sdgId);
            return sdg ? (
              <div key={sdgId} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white ${sdg.color}`}>
                <span className="font-mono">{sdgId}</span>
                <span>{sdg.name}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* 進度與 SROI */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">專案進度</span>
            <span className="text-white font-bold">{currentProject.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${currentProject.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">社會投資報酬率</span>
            <span className="text-emerald-400 font-bold text-lg">{currentProject.sroi}x</span>
          </div>
          <div className="text-xs text-slate-500">每投入 1 元創造 {currentProject.sroi} 元社會價值</div>
        </div>
      </div>

      {/* 影響力指標 */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          影響力指標追蹤
        </h4>
        <div className="space-y-3">
          {currentProject.impactMetrics.map((metric, index) => (
            <div key={index} className="bg-slate-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm">{metric.label}</span>
                <span className="text-white font-bold">
                  {metric.current} / {metric.target} {metric.unit}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.proxy_value >= 80 ? 'bg-emerald-500' :
                    metric.proxy_value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.proxy_value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 里程碑 */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          專案里程碑
        </h4>
        <div className="space-y-3">
          {currentProject.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="mt-0.5">
                {milestone.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : milestone.status === 'in_progress' ? (
                  <Clock className="w-5 h-5 text-blue-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="text-white font-medium text-sm">{milestone.title}</h5>
                  <span className="text-xs text-slate-400">XP: {milestone.xpReward}</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 財務摘要 */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          財務影響
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-400">預算 / 已支出</div>
            <div className="text-white font-bold">
              ${(currentProject.financials.budget / 1000000).toFixed(1)}M / ${(currentProject.financials.spent / 1000000).toFixed(1)}M
            </div>
          </div>
          <div>
            <div className="text-slate-400">預計收益 / ROI</div>
            <div className="text-emerald-400 font-bold">
              ${(currentProject.financials.revenue_projected / 1000000).toFixed(1)}M / {currentProject.financials.roi_projected}x
            </div>
          </div>
        </div>
      </div>

      {/* 漣漪效應動畫 - 當進度達標時觸發 */}
      {currentProject.progress >= 80 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-400/30 rounded-full animate-ping animation-delay-300" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-300/40 rounded-full animate-ping animation-delay-600" />
          </div>
        </div>
      )}
    </div>
  );
};