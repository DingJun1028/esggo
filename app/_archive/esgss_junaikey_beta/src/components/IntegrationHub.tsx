import React, { useState } from 'react';
import { Language } from '@/types';
import { Plug, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export const IntegrationHub: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';

  const integrations = [
    {
      id: 'boost-space',
      name: 'Boost.space',
      description: isZh ? '企業級自動化整合平台' : 'Enterprise automation platform',
      status: 'connected',
      lastSync: '2 分鐘前',
      logo: '🚀',
      color: 'emerald',
    },
    {
      id: 'make',
      name: 'Make.com',
      description: isZh ? '視覺化工作流程自動化' : 'Visual workflow automation',
      status: 'connected',
      lastSync: '15 分鐘前',
      logo: '⚡',
      color: 'blue',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: isZh ? '連接數千個應用程式' : 'Connect thousands of apps',
      status: 'available',
      lastSync: '-',
      logo: '⚙️',
      color: 'amber',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: isZh ? '即時數據同步到試算表' : 'Real-time data sync to spreadsheets',
      status: 'connected',
      lastSync: '1 小時前',
      logo: '📊',
      color: 'green',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: isZh ? '團隊協作與通知' : 'Team collaboration and notifications',
      status: 'available',
      lastSync: '-',
      logo: '💬',
      color: 'purple',
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: isZh ? 'CRM 數據整合' : 'CRM data integration',
      status: 'error',
      lastSync: '連線失敗',
      logo: '☁️',
      color: 'rose',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold">{isZh ? '已連接' : 'Connected'}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-bold">{isZh ? '錯誤' : 'Error'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-slate-400 bg-slate-500/10 border border-slate-500/20 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">{isZh ? '可用' : 'Available'}</span>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Plug className="text-blue-400 w-6 h-6" />
            {isZh ? '整合中樞' : 'Integration Hub'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh
              ? '連接外部服務，自動化您的 ESG 工作流程'
              : 'Connect external services to automate your ESG workflows'}
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-bold">
            {integrations.filter(i => i.status === 'connected').length} / {integrations.length}{' '}
            {isZh ? '已啟用' : 'Active'}
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">
            {isZh ? '總同步次數' : 'Total Syncs'}
          </div>
          <div className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
            12,847
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">
            {isZh ? '本月數據傳輸' : 'Data This Month'}
          </div>
          <div className="text-2xl font-black text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
            4.2 GB
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">
            {isZh ? '自動化工作流' : 'Automations'}
          </div>
          <div className="text-2xl font-black text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
            18
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">
            {isZh ? '成功率' : 'Success Rate'}
          </div>
          <div className="text-2xl font-black text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
            98.7%
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400/50 transition-all group hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {integration.logo}
                </div>
                <div>
                  <h3 className="text-white font-bold">{integration.name}</h3>
                  <p className="text-xs text-slate-400">{integration.description}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              {getStatusBadge(integration.status)}
              <span className="text-xs text-slate-500">
                {isZh ? '最後同步:' : 'Last sync:'} {integration.lastSync}
              </span>
            </div>

            <div className="flex gap-2">
              {integration.status === 'connected' ? (
                <>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
                    {isZh ? '設定' : 'Configure'}
                  </button>
                  <button className="flex-1 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 rounded-lg py-2 text-sm font-semibold transition-colors">
                    {isZh ? '中斷連接' : 'Disconnect'}
                  </button>
                </>
              ) : integration.status === 'error' ? (
                <button className="w-full bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 rounded-lg py-2 text-sm font-semibold transition-colors">
                  {isZh ? '重試連接' : 'Retry Connection'}
                </button>
              ) : (
                <button className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-lg py-2 text-sm font-semibold transition-colors">
                  {isZh ? '立即連接' : 'Connect Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-white mb-4">
          {isZh ? '最近活動' : 'Recent Activity'}
        </h2>
        <div className="space-y-3">
          {[
            {
              service: 'Boost.space',
              action: isZh ? '數據同步完成' : 'Data sync completed',
              time: '2 分鐘前',
              status: 'success',
            },
            {
              service: 'Make.com',
              action: isZh ? '自動化工作流程執行' : 'Automation workflow executed',
              time: '15 分鐘前',
              status: 'success',
            },
            {
              service: 'Salesforce',
              action: isZh ? '連線失敗' : 'Connection failed',
              time: '1 小時前',
              status: 'error',
            },
            {
              service: 'Google Sheets',
              action: isZh ? 'ESG 報告已更新' : 'ESG report updated',
              time: '1 小時前',
              status: 'success',
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                />
                <div>
                  <p className="text-white text-sm font-semibold">{activity.service}</p>
                  <p className="text-xs text-slate-400">{activity.action}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
