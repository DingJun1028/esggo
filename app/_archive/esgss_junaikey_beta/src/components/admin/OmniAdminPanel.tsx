import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  Users,
  FileText,
  Terminal,
  Activity,
  RefreshCw,
  Trash2,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  omniAdminService,
  SystemStatus,
  GlobalConfig,
  EntityStats,
} from '../../services/omniAdminService';

const TEXT = {
  TITLE: { zh: 'OmniAdminPanel (GOD MODE)', en: 'OmniAdminPanel (GOD MODE)' },
  TABS: {
    GENERAL: { zh: '系統總覽', en: 'General' },
    CONFIG: { zh: '全域設定', en: 'Configuration' },
    DATA: { zh: '數據管理', en: 'Data Management' },
    CONSOLE: { zh: '系統終端', en: 'Console' },
  },
  ACTIONS: {
    SYNC: { zh: '強制同步', en: 'Force Sync' },
    CLEAR_CACHE: { zh: '清除快取', en: 'Clear Cache' },
    EXECUTE: { zh: '執行', en: 'Execute' },
  },
  STATUS: {
    HEALTH: { zh: '系統健康度', en: 'System Health' },
    UPTIME: { zh: '運行時間', en: 'Uptime' },
    USERS: { zh: '活躍用戶', en: 'Active Users' },
    MEMORY: { zh: '記憶體使用', en: 'Memory Usage' },
  },
};

export const OmniAdminPanel = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  const [activeTab, setActiveTab] = useState<'general' | 'config' | 'data' | 'console'>('general');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [entityStats, setEntityStats] = useState<EntityStats | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setSystemStatus(omniAdminService.getSystemStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setSystemStatus(omniAdminService.getSystemStatus());
    setConfig(omniAdminService.getGlobalConfig());
    setEntityStats(omniAdminService.getEntityStats());
  };

  const handleForceSync = async () => {
    setIsLoading(true);
    const result = await omniAdminService.forceSyncData();
    setCommandOutput(prev => [...prev, `[SYNC] ${result.message}`]);
    setIsLoading(false);
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    const result = await omniAdminService.clearCache();
    setCommandOutput(prev => [...prev, `[CACHE] Cleared ${result.clearedMB}MB`]);
    setIsLoading(false);
  };

  const handleExecuteCommand = async () => {
    if (!commandInput.trim()) return;
    setCommandOutput(prev => [...prev, `$ ${commandInput}`]);
    const result = await omniAdminService.executeCommand(commandInput);
    setCommandOutput(prev => [...prev, result.output]);
    setCommandInput('');
  };

  const handleConfigUpdate = (key: keyof GlobalConfig, value: any) => {
    const updated = omniAdminService.updateGlobalConfig({ [key]: value });
    setConfig(updated);
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20">
      {/* Warning Header */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <Shield className="text-red-400" size={24} />
        <div>
          <h2 className="text-2xl font-black text-white tracking-wider">
            {isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}
          </h2>
          <p className="text-xs text-red-300">
            {isZh
              ? '⚠️ 管理員專用 - 所有操作將直接影響系統'
              : '⚠️ Admin Only - All actions affect the system directly'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        {(['general', 'config', 'data', 'console'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === tab
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {isZh
              ? TEXT.TABS[tab.toUpperCase() as keyof typeof TEXT.TABS].zh
              : TEXT.TABS[tab.toUpperCase() as keyof typeof TEXT.TABS].en}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'general' && systemStatus && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Activity />}
              label={isZh ? TEXT.STATUS.HEALTH.zh : TEXT.STATUS.HEALTH.en}
              value={systemStatus.health.toUpperCase()}
              color="emerald"
            />
            <StatCard
              icon={<Users />}
              label={isZh ? TEXT.STATUS.USERS.zh : TEXT.STATUS.USERS.en}
              value={systemStatus.activeUsers.toString()}
              color="cyan"
            />
            <StatCard
              icon={<Database />}
              label={isZh ? TEXT.STATUS.MEMORY.zh : TEXT.STATUS.MEMORY.en}
              value={`${systemStatus.memoryUsage.toFixed(1)}%`}
              color="purple"
            />
            <StatCard
              icon={<FileText />}
              label="Cache Size"
              value={`${systemStatus.cacheSize}MB`}
              color="orange"
            />

            {/* Quick Actions */}
            <div className="col-span-2 flex gap-3 mt-4">
              <button
                onClick={handleForceSync}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                {isZh ? TEXT.ACTIONS.SYNC.zh : TEXT.ACTIONS.SYNC.en}
              </button>
              <button
                onClick={handleClearCache}
                disabled={isLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                {isZh ? TEXT.ACTIONS.CLEAR_CACHE.zh : TEXT.ACTIONS.CLEAR_CACHE.en}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'config' && config && (
          <div className="space-y-4">
            <ConfigToggle
              label={isZh ? '維護模式' : 'Maintenance Mode'}
              value={config.maintenanceMode}
              onChange={(v: boolean) => handleConfigUpdate('maintenanceMode', v)}
            />
            <ConfigToggle
              label={isZh ? '除錯模式' : 'Debug Mode'}
              value={config.debugMode}
              onChange={(v: boolean) => handleConfigUpdate('debugMode', v)}
            />
            <ConfigInput
              label={isZh ? '最大並發用戶' : 'Max Concurrent Users'}
              value={config.maxConcurrentUsers}
              onChange={(v: string) => handleConfigUpdate('maxConcurrentUsers', parseInt(v))}
            />
            <ConfigInput
              label={isZh ? '數據保留天數' : 'Data Retention Days'}
              value={config.dataRetentionDays}
              onChange={(v: string) => handleConfigUpdate('dataRetentionDays', parseInt(v))}
            />
          </div>
        )}

        {activeTab === 'data' && entityStats && (
          <div className="grid grid-cols-2 gap-4">
            <EntityCard label={isZh ? '專案' : 'Projects'} count={entityStats.projects} />
            <EntityCard label={isZh ? '代理人' : 'Agents'} count={entityStats.agents} />
            <EntityCard label={isZh ? '報告' : 'Reports'} count={entityStats.reports} />
            <EntityCard label={isZh ? '用戶' : 'Users'} count={entityStats.users} />
          </div>
        )}

        {activeTab === 'console' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-sm overflow-auto mb-4">
              {commandOutput.map((line, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {line}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecuteCommand()}
                placeholder="$ Enter command..."
                className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleExecuteCommand}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold"
              >
                {isZh ? TEXT.ACTIONS.EXECUTE.zh : TEXT.ACTIONS.EXECUTE.en}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`bg-${color}-900/20 border border-${color}-500/30 rounded-xl p-4`}>
    <div className={`flex items-center gap-2 text-${color}-400 mb-2`}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

const ConfigToggle = ({ label, value, onChange }: any) => (
  <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
    <span className="text-white font-bold">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-600'}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

const ConfigInput = ({ label, value, onChange }: any) => (
  <div className="bg-white/5 p-4 rounded-lg">
    <label className="text-white font-bold block mb-2">{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
    />
  </div>
);

const EntityCard = ({ label, count }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
    <div className="text-slate-400 text-sm mb-1">{label}</div>
    <div className="text-3xl font-black text-white">{count}</div>
  </div>
);
