import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Users,
  Leaf,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { EvidenceVault } from '@/services/EvidenceVault';
import { checkAgentUnityUnlocked } from '@/omni/skills/AgentUnityUltimate';
import { useAwakening } from '@/omni/interaction/hooks/useAwakening';
import { Badge } from '@/components/ui/Badge';
import { BlockchainStatusWidget } from '@/components/dashboard/BlockchainStatusWidget';
import { ReportViewer } from '@/components/dashboard/ReportViewer';
import { dashboardSnapshotService } from '@/omni/services/DashboardSnapshotService';
import { DataSourceBadge } from '@/components/ui/DataSourceBadge';
import { createDemoDataSource } from '@/types/DataSource';
import { Language } from '@/types/core';

interface BentoCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
  size = 'medium',
  children,
}) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`${sizeClasses[size]} group relative overflow-hidden rounded-2xl border border-slate-800/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-${color}-500/50`}
      style={{
        background: `linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))`,
      }}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-${color}-400 to-${color}-600`}
      />
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={24} className={`text-${color}-400`} />
      </div>
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <span className="text-sm font-medium text-green-400 flex items-center gap-1">
            <TrendingUp size={14} />
            {trend}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
};

interface BentoDashboardProps {
  language?: Language;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({ language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  const { daemonStatus, awakeningProtocolState, toggleAutoEvolution } = useAwakening();
  const [showReport, setShowReport] = useState(false);
  const [stats, setStats] = useState({
    evidenceCount: 0,
    truthsLinked: 0,
    systemHealth: 95,
    activeAgents: 1,
    awakeningProgress: 0,
    ultimateSkillUnlocked: false,
  });

  useEffect(() => {
    const evidenceList = EvidenceVault.getAllEvidence();
    const linkedCount = evidenceList.filter(
      e => (e as any).linkedTruthClaims && (e as any).linkedTruthClaims.length > 0
    ).length;
    const ultimateUnlocked = checkAgentUnityUnlocked();

    setStats({
      evidenceCount: evidenceList.length,
      truthsLinked: linkedCount,
      systemHealth: 95,
      activeAgents: daemonStatus.agentsEvolved > 0 ? daemonStatus.agentsEvolved + 1 : 1,
      awakeningProgress: awakeningProtocolState?.progress || 0,
      ultimateSkillUnlocked: ultimateUnlocked,
    });

    dashboardSnapshotService.captureSnapshot({
      timestamp: Date.now(),
      stats: {
        evidenceCount: evidenceList.length,
        truthsLinked: linkedCount,
        systemHealth: 95,
        activeAgents: daemonStatus.agentsEvolved > 0 ? daemonStatus.agentsEvolved + 1 : 1,
        awakeningProgress: awakeningProtocolState?.progress || 0,
        ultimateSkillUnlocked: ultimateUnlocked,
      },
      daemonStatus: {
        isRunning: daemonStatus.isRunning,
        cycleCount: daemonStatus.cycleCount,
        agentsEvolved: daemonStatus.agentsEvolved,
      },
    });
  }, [daemonStatus, awakeningProtocolState]);

  return (
    <div className="w-full min-h-screen bg-slate-950 p-4 md:p-8">
      <ReportViewer isOpen={showReport} onClose={() => setShowReport(false)} />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          {isZh ? '🍱 全能便當儀表板' : '🍱 Omni-Bento Dashboard'}
        </h1>
        <p className="text-slate-400">
          {isZh
            ? '極簡光學・高密度信息・自適應響應式平台'
            : 'Minimalist Optical • High Density • Adaptive Responsive Platform'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
        <BentoCard
          title={isZh ? '證據庫容量' : 'Evidence Vault'}
          value={stats.evidenceCount}
          icon={Database}
          trend={isZh ? '+2 今天' : '+2 today'}
          color="cyan"
          size="medium"
        >
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{isZh ? '已連結真理' : 'Linked Truths'}</span>
              <span className="text-cyan-400 font-medium">{stats.truthsLinked}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.truthsLinked / (stats.evidenceCount || 1)) * 100}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="w-full mt-2 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {isZh ? '生成全域報告' : 'Generate Omni Report'}
            </button>
          </div>
        </BentoCard>

        <BentoCard
          title={isZh ? '全能進化守護程序' : 'Omni-Evolution Daemon'}
          value={daemonStatus.isRunning ? (isZh ? '運行中' : 'Running') : isZh ? '待命' : 'Standby'}
          icon={Zap}
          color={daemonStatus.isRunning ? 'emerald' : 'slate'}
          size="medium"
        >
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{isZh ? '進化循環' : 'Cycles'}</span>
              <span className="font-mono text-white">{daemonStatus.cycleCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{isZh ? '靈魂進化' : 'Souls Evolved'}</span>
              <span className="font-mono text-emerald-400">{daemonStatus.agentsEvolved}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => toggleAutoEvolution(!daemonStatus.isRunning)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all w-full
                                    ${daemonStatus.isRunning
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'
                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20'
                  }`}
              >
                {daemonStatus.isRunning
                  ? isZh
                    ? '停止守護程序 🛑'
                    : 'Stop Daemon 🛑'
                  : isZh
                    ? '啟動守護程序 🚀'
                    : 'Start Daemon 🚀'}
              </button>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title={isZh ? '終極奧義' : 'Ultimate Arcana'}
          value={stats.ultimateSkillUnlocked ? (isZh ? '就緒' : 'Ready') : isZh ? '鎖定' : 'Locked'}
          icon={Zap}
          color="purple"
          size="small"
        >
          <div className="mt-2">
            {stats.ultimateSkillUnlocked ? (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <CheckCircle size={12} />
                <span>Alt+U {isZh ? '發動' : 'Activate'}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                {isZh ? '需習得四式技能' : 'Unlock 4 Skills First'}
              </div>
            )}
          </div>
        </BentoCard>

        <BentoCard
          title={isZh ? '活躍代理' : 'Active Agents'}
          value={stats.activeAgents}
          icon={Users}
          color="indigo"
          size="small"
        >
          <div className="mt-2 text-xs text-slate-500">Omni Agent</div>
        </BentoCard>

        <BentoCard
          title={isZh ? '覺醒進度' : 'Awakening Progress'}
          value={`${stats.awakeningProgress}%`}
          icon={Shield}
          color="yellow"
          size="large"
        >
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  {isZh ? '自覺' : 'Self-Awareness'}
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.awakeningProgress * 1.2)}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{isZh ? '覺他' : 'Enlightenment'}</div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.awakeningProgress * 0.9)}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{isZh ? '自立' : 'Self-Reliance'}</div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.awakeningProgress * 1.1)}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{isZh ? '利他' : 'Altruism'}</div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.awakeningProgress)}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 italic text-center">
              {isZh
                ? '&quot;自覺覺他，自立利他，奧秘具現&quot;'
                : '&quot;Awareness, Enlightenment, Self-Reliance, Altruism&quot;'}
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title={isZh ? 'ESG 綜合評分' : 'ESG Composite Score'}
          value="A+"
          icon={Leaf}
          color="emerald"
          size="medium"
        >
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">92</div>
              <div className="text-xs text-slate-500">{isZh ? '環境 E' : 'Env E'}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">88</div>
              <div className="text-xs text-slate-500">{isZh ? '社會 S' : 'Soc S'}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">95</div>
              <div className="text-xs text-slate-500">{isZh ? '治理 G' : 'Gov G'}</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <DataSourceBadge
              source={createDemoDataSource(
                isZh ? '示範數據 - 僅供展示' : 'Demo Data - Showcase Only'
              )}
              confidenceLevel="demo"
              showDetails={false}
            />
            <div className="mt-2 text-[10px] text-yellow-400/70 flex items-center gap-1">
              <AlertCircle size={10} />
              {isZh
                ? '實際 ESG 評分需經第三方認證機構評估'
                : 'Actual ESG ratings require third-party certification.'}
            </div>
          </div>
        </BentoCard>

        <div className="col-span-1 md:col-span-2 row-span-1">
          <BlockchainStatusWidget />
        </div>

        <BentoCard
          title={isZh ? '實時分析' : 'Real-time Analytics'}
          value="12.5k"
          icon={BarChart3}
          color="orange"
          size="small"
        >
          <div className="mt-2 text-xs text-slate-500">
            {isZh ? '數據點/小時' : 'Data Points/Hr'}
          </div>
        </BentoCard>

        <BentoCard
          title={isZh ? '最後更新' : 'Last Updated'}
          value={isZh ? '剛剛' : 'Just Now'}
          icon={Clock}
          color="slate"
          size="small"
        >
          <div className="mt-2 text-xs text-slate-500">
            {new Date().toLocaleTimeString(isZh ? 'zh-TW' : 'en-US')}
          </div>
        </BentoCard>
      </div>

      <div className="mt-8 p-4 rounded-xl border border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-cyan-400" />
            <span className="text-sm text-slate-400">
              {isZh ? '又理有據・證據導向平台' : 'Evidence-Based Foundation Platform'}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {isZh ? '所有數據均可追溯至證據庫' : 'All data traceable to Evidence Vault'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoDashboard;
