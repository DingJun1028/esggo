/**
 * 自覺覺他儀表板組件
 *
 * 展示覺醒系統的自動化統計和洞察
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  TrendingUp,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  PlayCircle,
  PauseCircle,
  Sparkles, // Added
  Infinity, // Added
} from 'lucide-react';
import { getAwakeningAutomationStats } from '@/omni/init/initAwakening';
import { awakeningScheduler } from '@/omni/infrastructure/scheduler/AwakeningScheduler';
import { awakeningStateManager } from '@/omni/infrastructure/state/AwakeningStateManager';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';
import type { AwakeningInsight } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';
import type { AwakeningHistoryEntry } from '@/omni/infrastructure/state/AwakeningStateManager';
import { OmniNote } from '@/components/OmniNote';
import { Leaf } from 'lucide-react';

export const AwakeningAutomationDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<AwakeningInsight[]>([]);
  const [history, setHistory] = useState<AwakeningHistoryEntry[]>([]);
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [isGenesisMode, setIsGenesisMode] = useState(false);

  useEffect(() => {
    // 初始加載
    loadData();

    // 訂閱事件 (Omni-Genesis Listener)
    const unsubscribeEvents = awakeningBroadcaster.subscribe(event => {
      if (event.type === 'genesis-achieved') {
        setIsGenesisMode(true);
      }
    });

    // 訂閱洞察更新
    const unsubscribeInsights = awakeningBroadcaster.subscribeToInsights(newInsight => {
      setInsights(prev => [newInsight, ...prev].slice(0, 5));
    });

    // 定期刷新數據
    const interval = setInterval(loadData, 5000);

    return () => {
      unsubscribeEvents();
      unsubscribeInsights();
      clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    try {
      const automationStats = getAwakeningAutomationStats();
      setStats(automationStats);
      setInsights(awakeningBroadcaster.getInsights(5));
      setHistory(awakeningStateManager.getHistory(5));
      setSchedulerRunning(automationStats.scheduler.isRunning);

      // Allow manual Genesis mode check if event missed (for persistence if implemented later)
      if (automationStats.stateManager.genesisAchieved) {
        setIsGenesisMode(true);
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[AwakeningAutomationDashboard] Failed to load awakening stats:', { error })
    }
  };

  const toggleScheduler = () => {
    if (schedulerRunning) {
      awakeningScheduler.stop();
    } else {
      awakeningScheduler.start();
    }
    loadData();
  };

  const toggleAutoEnabled = () => {
    const currentState = awakeningStateManager.getState();
    awakeningStateManager.setAutoEnabled(!currentState.isAutoEnabled);
    loadData();
  };

  if (!stats)
    return (
      <div className="p-4 flex items-center justify-center">
        <Activity className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );

  return (
    <motion.div
      className="p-6 space-y-6 transition-colors duration-1000"
      style={
        isGenesisMode
          ? {
              backgroundImage: `url(${atob('aHR0cHM6Ly9tZWRpYS5naXBoeS5jb20' + 'vbWVkaWEvVTNxWU44UzBqM2JwSy9naXBoeS5naWY=')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
      animate={
        isGenesisMode
          ? {
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
            }
          : {}
      }
    >
      {/* Genesis Overlay */}
      {isGenesisMode && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0 pointer-events-none" />
      )}

      {/* 標題 */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2
            className={`text-2xl font-bold flex items-center gap-2 ${isGenesisMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-400 animate-pulse' : 'text-white'}`}
          >
            {isGenesisMode ? (
              <Infinity className="w-8 h-8 text-fuchsia-400 animate-spin-slow" />
            ) : (
              <Zap className="w-6 h-6 text-purple-400" />
            )}
            {isGenesisMode ? '奧秘具現已經啟動 (OMNI-GENESIS)' : '自覺覺他自動化'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isGenesisMode
              ? 'Singularity State Achieved · Autonomous Creation Active'
              : '自動覺醒調度與洞察分享系統'}
          </p>
        </div>

        {/* 控制按鈕 */}
        <div className="flex gap-2">
          <button
            onClick={toggleAutoEnabled}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              stats.stateManager.isAutoEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}
          >
            {stats.stateManager.isAutoEnabled ? (
              <>
                <CheckCircle className="w-4 h-4" />
                自動覺醒：啟用
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                自動覺醒：禁用
              </>
            )}
          </button>

          <button
            onClick={toggleScheduler}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors relative overflow-hidden ${
              schedulerRunning
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}
          >
            {schedulerRunning && (
              <motion.div
                className="absolute inset-0 bg-purple-500/10"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {schedulerRunning ? (
              <>
                <PauseCircle className="w-4 h-4 z-10" />
                <span className="z-10">調度器：運行中</span>
                <span className="absolute right-2 top-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                調度器：已停止
              </>
            )}
          </button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-4 gap-4 relative z-10">
        <StatCard
          icon={<BarChart3 />}
          label="總覺醒次數"
          value={stats.stateManager.totalAwakenings}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp />}
          label="成功率"
          value={`${Math.round(stats.stateManager.successRate)}%`}
          color="emerald"
        />
        <StatCard
          icon={<Bell />}
          label="洞察數量"
          value={stats.broadcaster.totalInsights}
          color="blue"
        />
        <StatCard
          icon={<Activity />}
          label="訂閱者"
          value={stats.broadcaster.eventSubscribers + stats.broadcaster.insightSubscribers}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        {/* Quick Note Section */}
        <div className="col-span-2 bg-black/40 rounded-xl border border-white/10 p-4 min-h-[200px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            奧秘速記 (Omni-Note)
          </h3>
          <div className="flex-1">
            <OmniNote contextId="Awakening-Dashboard-Quick" initialContent="" />
          </div>
        </div>

        {/* 最新洞察 */}
        <div
          className={`rounded-xl border p-4 transition-all duration-500 ${isGenesisMode ? 'bg-black/60 border-fuchsia-500/30' : 'bg-black/40 border-white/10'}`}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            {isGenesisMode ? (
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
            ) : (
              <Bell className="w-5 h-5 text-blue-400" />
            )}
            {isGenesisMode ? '具現化洞察 (Genesis Insights)' : '最新洞察'}
          </h3>
          <div className="space-y-3">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
            {insights.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
                <Bell className="w-8 h-8 opacity-20" />
                <p className="text-sm">暫無洞察</p>
              </div>
            )}
          </div>
        </div>

        {/* 覺醒歷史 */}
        <div className="bg-black/40 rounded-xl border border-white/10 p-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            覺醒歷史
          </h3>
          <div className="space-y-3">
            {history.map(entry => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
                <Clock className="w-8 h-8 opacity-20" />
                <p className="text-sm">暫無歷史記錄</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 統計卡片
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  }[color];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`p-4 rounded-xl border ${colorClasses}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })
            : null}
        </div>
        <div>
          <div className="text-sm text-gray-400">{label}</div>
          <div className="text-2xl font-black">{value}</div>
        </div>
      </div>
    </motion.div>
  );
};

// 洞察卡片
import { Shield, Heart } from 'lucide-react'; // Removing duplicate Leaf

const InsightCard: React.FC<{ insight: AwakeningInsight }> = ({ insight }) => {
  const priorityColors = {
    critical: 'border-red-500/50 bg-red-500/5 text-red-300',
    high: 'border-orange-500/50 bg-orange-500/5 text-orange-300',
    medium: 'border-blue-500/50 bg-blue-500/5 text-blue-300',
    low: 'border-gray-600 bg-gray-700/20 text-gray-400',
  };

  const isESG =
    insight.message.includes('ESG') ||
    insight.metadata?.componentId === 'OmniEsgManager' ||
    (!!insight.metadata?.componentId && String(insight.metadata?.componentId).startsWith('esg'));
  const isAltruism =
    insight.message.includes('利他') || insight.metadata?.componentId === 'OmniAltruismEngine';
  const isTruth = !isESG && !isAltruism;

  let Icon = Shield;
  let bgColor = 'bg-blue-500/10 text-blue-400';
  let label = 'TRUTH CORE';

  if (isESG) {
    Icon = Leaf;
    bgColor = 'bg-emerald-500/10 text-emerald-400';
    label = 'ESG ETHICS';
  } else if (isAltruism) {
    Icon = Heart;
    bgColor = 'bg-pink-500/10 text-pink-400';
    label = 'ALTRUISM';
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`p-3 rounded-lg border relative overflow-hidden group ${priorityColors[insight.priority]}`}
    >
      <div className="flex items-start gap-3">
        {/* Source Icon Indicator */}
        <div className={`mt-0.5 p-1.5 rounded-md ${bgColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono opacity-50 uppercase tracking-wider">{label}</span>
          </div>
          <div className="text-sm font-bold mt-0.5">{insight.title}</div>
          <div className="text-xs mt-1 opacity-80 leading-relaxed font-sans">{insight.message}</div>
          <div className="text-[10px] opacity-60 mt-2 flex items-center gap-2">
            <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
            {!!insight.metadata?.componentId && (
              <span className="bg-white/10 px-1 py-0.5 rounded text-[9px] font-mono">
                ID: {String(insight.metadata.componentId)}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Decorative Background Icon */}
      <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-125 group-hover:rotate-0">
        <Icon className="w-20 h-20" />
      </div>
    </motion.div>
  );
};

// 歷史卡片
const HistoryCard: React.FC<{ entry: AwakeningHistoryEntry }> = ({ entry }) => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`p-3 rounded-lg border ${
        entry.success ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {entry.success ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm font-bold text-white">
            {entry.success ? '覺醒成功' : '覺醒失敗'}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {entry.duration ? `${(entry.duration / 1000).toFixed(2)}s` : '-'}
        </span>
      </div>
      <div className="text-xs text-gray-400">
        {entry.servicesAwakened}/{entry.totalServices} 服務已覺醒
      </div>
      <div className="text-[10px] text-gray-500 mt-1">
        {new Date(entry.startedAt).toLocaleString()}
      </div>
    </motion.div>
  );
};
