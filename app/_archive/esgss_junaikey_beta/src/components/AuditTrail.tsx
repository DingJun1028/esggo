import React, { useState } from 'react';
import { Language } from '@/types';
import { Shield, AlertTriangle, Clock, FileText, User, Lock, Activity } from 'lucide-react';
import { ZKPAuditBadge } from './zkp/ZKPAuditBadge';
import { ZKPProof } from '@/omni/services/ZKPIntegrityService';

export const AuditTrail: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [filter, setFilter] = useState('all');

  const auditLogs = [
    {
      id: 1,
      timestamp: '2026-01-08 12:35:24',
      user: isZh ? '張管理員' : 'Admin Zhang',
      action: isZh ? '更新 ESG 數據' : 'Updated ESG data',
      category: 'data',
      module: 'ESG Dashboard',
      ip: '192.168.1.100',
      status: 'success',
      details: isZh ? '修改碳排放數據：280 tCO2e' : 'Modified carbon emissions: 280 tCO2e',
      zkpProof: {
        publicInput: '0x' + 'a'.repeat(62),
        proofData: 'b'.repeat(64),
        timestamp: Date.now(),
        privacyLevel: 'granular'
      } as ZKPProof
    },
    {
      id: 2,
      timestamp: '2026-01-08 11:20:15',
      user: isZh ? '李分析師' : 'Analyst Li',
      action: isZh ? '生成報告' : 'Generated report',
      category: 'report',
      module: 'Report Generator',
      ip: '192.168.1.105',
      status: 'success',
      details: isZh ? '生成「2025 Q4 ESG 報告」' : 'Generated "2025 Q4 ESG Report"',
    },
    {
      id: 3,
      timestamp: '2026-01-08 10:45:32',
      user: isZh ? '王經理' : 'Manager Wang',
      action: isZh ? '登入失敗' : 'Login failed',
      category: 'security',
      module: 'Authentication',
      ip: '203.145.78.92',
      status: 'failed',
      details: isZh ? '密碼錯誤 (嘗試 3/3)' : 'Wrong password (attempt 3/3)',
    },
    {
      id: 4,
      timestamp: '2026-01-08 09:15:08',
      user: isZh ? '陳用戶' : 'User Chen',
      action: isZh ? '購買碳權' : 'Purchased carbon credits',
      category: 'transaction',
      module: 'Carbon Asset',
      ip: '192.168.1.112',
      status: 'success',
      details: '100 tCO2e VER @ $12.5',
      zkpProof: {
        publicInput: '0x' + 'c'.repeat(62),
        proofData: 'd'.repeat(64),
        timestamp: Date.now(),
        privacyLevel: 'holistic'
      } as ZKPProof
    },
    {
      id: 5,
      timestamp: '2026-01-08 08:30:45',
      user: 'System',
      action: isZh ? '自動備份' : 'Auto backup',
      category: 'system',
      module: 'Database',
      ip: 'localhost',
      status: 'success',
      details: isZh ? '備份大小: 2.4 GB' : 'Backup size: 2.4 GB',
    },
    {
      id: 6,
      timestamp: '2026-01-07 23:55:12',
      user: isZh ? '林開發者' : 'Dev Lin',
      action: isZh ? '配置變更' : 'Configuration change',
      category: 'config',
      module: 'Settings',
      ip: '192.168.1.120',
      status: 'success',
      details: isZh ? '啟用雙因素驗證' : 'Enabled 2FA',
    },
  ];

  const categories = [
    { id: 'all', label: isZh ? '全部' : 'All', count: auditLogs.length },
    { id: 'security', label: isZh ? '安全' : 'Security', count: 1 },
    { id: 'data', label: isZh ? '數據' : 'Data', count: 1 },
    { id: 'transaction', label: isZh ? '交易' : 'Transaction', count: 1 },
    { id: 'report', label: isZh ? '報告' : 'Report', count: 1 },
    { id: 'system', label: isZh ? '系統' : 'System', count: 1 },
  ];

  const filteredLogs =
    filter === 'all' ? auditLogs : auditLogs.filter(log => log.category === filter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'data':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'transaction':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'report':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'config':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="text-aqua-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
            {isZh ? '審計追蹤' : 'Audit Trail'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh ? '追蹤所有系統活動與操作記錄' : 'Track all system activities and operations'}
          </p>
        </div>
        <button className="bg-aqua-500/10 hover:bg-aqua-500/20 border border-aqua-500/20 hover:border-aqua-500/40 text-aqua-400 hover:text-aqua-300 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(0,255,255,0.1)]">
          <FileText className="w-4 h-4" />
          {isZh ? '匯出日誌' : 'Export Logs'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aqua-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-aqua-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">2,847</div>
              <div className="text-xs text-slate-400">
                {isZh ? '今日活動' : "Today's Activities"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">48</div>
              <div className="text-xs text-slate-400">{isZh ? '活躍用戶' : 'Active Users'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">3</div>
              <div className="text-xs text-slate-400">{isZh ? '安全警告' : 'Security Alerts'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400">100%</div>
              <div className="text-xs text-slate-400">{isZh ? '合規率' : 'Compliance Rate'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${filter === cat.id
              ? 'bg-aqua-500/10 text-aqua-400 border border-aqua-500/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-aqua-500/20'
              }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900/50 border border-aqua-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-aqua-500/20">
              <tr>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {isZh ? '時間' : 'Timestamp'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  <User className="w-4 h-4 inline mr-2" />
                  {isZh ? '用戶' : 'User'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  {isZh ? '操作' : 'Action'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  {isZh ? '模組' : 'Module'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  {isZh ? '狀態' : 'Status'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  {isZh ? 'ZK 驗證' : 'ZK Verification'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-6">
                  {isZh ? '詳情' : 'Details'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr
                  key={log.id}
                  className="border-b border-aqua-500/10 hover:bg-aqua-500/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="text-white text-sm font-mono">{log.timestamp}</div>
                    <div className="text-xs text-slate-500">{log.ip}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white font-semibold">{log.user}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{log.action}</div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getCategoryColor(log.category)} mt-1`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{log.module}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                    >
                      {log.status === 'success'
                        ? isZh
                          ? '成功'
                          : 'Success'
                        : isZh
                          ? '失敗'
                          : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <ZKPAuditBadge proof={(log as any).zkpProof} />
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-gradient-to-r from-sky-900/20 to-transparent border-l-4 border-sky-500 p-6 rounded-r-3xl">
        <div className="text-sky-400 font-bold mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {isZh ? '安全建議' : 'Security Recommendation'}
        </div>
        <p className="text-slate-300 text-sm">
          {isZh
            ? '檢測到 3 次異常登入嘗試。建議啟用 IP 白名單並加強密碼政策。'
            : 'Detected 3 unusual login attempts. Recommend enabling IP whitelist and strengthening password policy.'}
        </p>
      </div>
    </div>
  );
};
