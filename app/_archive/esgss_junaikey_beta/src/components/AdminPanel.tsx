import React, { useState } from 'react';
import { Language } from '@/types';
import {
  Settings,
  Users,
  Database,
  Activity,
  AlertCircle,
  TrendingUp,
  Server,
  Lock,
} from 'lucide-react';

export const AdminPanel: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeTab, setActiveTab] = useState('overview');

  const systemStatus = [
    { service: 'Frontend Server', status: 'healthy', uptime: '99.98%', latency: '42ms' },
    { service: 'Backend API', status: 'warning', uptime: '98.50%', latency: '128ms' },
    { service: 'Database', status: 'healthy', uptime: '99.99%', latency: '15ms' },
    { service: 'Redis Cache', status: 'healthy', uptime: '100%', latency: '8ms' },
  ];

  const users = [
    {
      id: 1,
      name: isZh ? '張管理員' : 'Admin Zhang',
      email: 'zhang@esg.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '5 分鐘前',
    },
    {
      id: 2,
      name: isZh ? '李分析師' : 'Analyst Li',
      email: 'li@esg.com',
      role: 'Analyst',
      status: 'active',
      lastLogin: '1 小時前',
    },
    {
      id: 3,
      name: isZh ? '王經理' : 'Manager Wang',
      email: 'wang@esg.com',
      role: 'Manager',
      status: 'inactive',
      lastLogin: '2 天前',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="text-cyan-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            {isZh ? '系統管理面板' : 'Admin Panel'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh ? '系統監控與用戶管理中心' : 'System monitoring and user management center'}
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
            {isZh ? '系統運行中' : 'System Operational'}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">1,248</div>
              <div className="text-xs text-slate-400">{isZh ? '總用戶數' : 'Total Users'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-blue-400">342</div>
              <div className="text-xs text-slate-400">{isZh ? '在線用戶' : 'Online Users'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400">24.7 GB</div>
              <div className="text-xs text-slate-400">{isZh ? '數據庫大小' : 'Database Size'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">99.8%</div>
              <div className="text-xs text-slate-400">{isZh ? '系統正常運行時間' : 'Uptime'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-500/10">
        {[
          { id: 'overview', label: isZh ? '總覽' : 'Overview' },
          { id: 'users', label: isZh ? '用戶管理' : 'Users' },
          { id: 'system', label: isZh ? '系統狀態' : 'System' },
          { id: 'settings', label: isZh ? '配置' : 'Config' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_4px_10px_-4px_rgba(34,211,238,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              {isZh ? '系統健康狀態' : 'System Health'}
            </h3>
            <div className="space-y-3">
              {systemStatus.map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-lg hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === 'healthy'
                          ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                          : 'bg-amber-500'
                      } animate-pulse`}
                    />
                    <div>
                      <p className="text-white font-semibold">{service.service}</p>
                      <p className="text-xs text-slate-400">
                        {isZh ? '延遲' : 'Latency'}: {service.latency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold ${
                        service.status === 'healthy' ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {service.status === 'healthy'
                        ? isZh
                          ? '健康'
                          : 'Healthy'
                        : isZh
                          ? '警告'
                          : 'Warning'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isZh ? '正常運行' : 'Uptime'}: {service.uptime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-slate-800/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 text-left transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              </div>
              <h3 className="text-white font-bold mb-1">
                {isZh ? '備份數據庫' : 'Backup Database'}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh ? '建立系統數據備份' : 'Create system data backup'}
              </p>
            </button>

            <button className="bg-slate-800/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 text-left transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              </div>
              <h3 className="text-white font-bold mb-1">{isZh ? '管理用戶' : 'Manage Users'}</h3>
              <p className="text-xs text-slate-400">
                {isZh ? '添加、編輯或刪除用戶' : 'Add, edit or remove users'}
              </p>
            </button>

            <button className="bg-slate-800/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-6 text-left transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              </div>
              <h3 className="text-white font-bold mb-1">
                {isZh ? '安全設定' : 'Security Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh ? '配置安全策略' : 'Configure security policies'}
              </p>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80 border-b border-cyan-500/20">
                <tr>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '用戶' : 'User'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '郵箱' : 'Email'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '角色' : 'Role'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '狀態' : 'Status'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '最後登入' : 'Last Login'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                    {isZh ? '操作' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                  >
                    <td className="py-4 px-6 text-white font-semibold">{user.name}</td>
                    <td className="py-4 px-6 text-slate-300">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : user.role === 'Manager'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {user.status === 'active'
                          ? isZh
                            ? '活躍'
                            : 'Active'
                          : isZh
                            ? '非活躍'
                            : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-sm">{user.lastLogin}</td>
                    <td className="py-4 px-6">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold hover:underline">
                        {isZh ? '編輯' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-4">
          {[
            { metric: 'CPU 使用率', value: '45%', status: 'normal' },
            { metric: '記憶體使用', value: '62%', status: 'normal' },
            { metric: '磁碟空間', value: '78%', status: 'warning' },
            { metric: '網路流量', value: '127 MB/s', status: 'normal' },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">{metric.metric}</span>
                <span
                  className={`text-lg font-bold ${
                    metric.status === 'warning' ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {metric.value}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full ${
                    metric.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                  }`}
                  style={{
                    width:
                      typeof metric.value === 'string' && metric.value.includes('%')
                        ? metric.value
                        : '50%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System Alerts */}
      <div className="bg-gradient-to-r from-amber-900/20 to-transparent border-l-4 border-amber-500 p-6 rounded-r-3xl">
        <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {isZh ? '系統提醒' : 'System Alert'}
        </div>
        <p className="text-slate-300 text-sm">
          {isZh
            ? '檢測到磁碟空間使用率達 78%。建議進行清理或擴充儲存空間。'
            : 'Disk space usage reached 78%. Please clean up or expand storage space.'}
        </p>
      </div>
    </div>
  );
};
