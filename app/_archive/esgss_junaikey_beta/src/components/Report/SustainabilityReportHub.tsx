import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Upload,
  Settings,
  Sparkles,
  Shield,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Target,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Globe,
  Activity,
} from 'lucide-react';

// 引入子組件
import { CarbonInventoryForm } from './CarbonInventoryForm';
import { ExcelUploader } from './ExcelUploader';
import { WarRoomDashboard } from './WarRoomDashboard';

// 模擬數據
const mockReportStats = {
  totalReports: 24,
  completedReports: 18,
  pendingReports: 6,
  verifiedReports: 15,
  totalCarbonReduction: 1250.5,
  complianceRate: 98.5,
};

const recentReports = [
  { id: 1, title: '2024 Q3 碳排放報告', status: 'completed', date: '2024-10-15', verified: true },
  { id: 2, title: '2024 ESG 年度報告', status: 'in_progress', date: '2024-10-20', verified: false },
  { id: 3, title: '2024 Q2 能源使用報告', status: 'pending', date: '2024-10-25', verified: false },
];

const reportTypes = [
  {
    id: 'carbon',
    name: '碳盤查報告',
    description: '範疇一、二、三溫室氣體排放全面盤查',
    icon: '🌍',
    color: 'emerald',
  },
  {
    id: 'esg',
    name: 'ESG 永續報告書',
    description: '環境、社會、治理三大面向綜合報告',
    icon: '📊',
    color: 'blue',
  },
  {
    id: 'gri',
    name: 'GRI 標準報告',
    description: '符合全球報告倡議組織標準',
    icon: '📋',
    color: 'purple',
  },
  {
    id: 'tcfd',
    name: 'TCFD 氣候相關財務揭露',
    description: '氣候風險與機會財務揭露',
    icon: '🌡️',
    color: 'amber',
  },
];

type ViewMode = 'hub' | 'carbon-form' | 'excel-upload' | 'war-room';

export const SustainabilityReportHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  // 處理新報告創建
  const handleCreateReport = (type: string) => {
    setSelectedReportType(type);
    if (type === 'carbon') {
      setViewMode('carbon-form');
    } else {
      // 其他類型可以後續擴展
      setShowNewReportModal(false);
    }
    setShowNewReportModal(false);
  };

  // 渲染主界面
  const renderHubView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-3xl p-8 border border-white/10"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              永續報告書研製中心
            </h1>
            <p className="text-slate-400 max-w-2xl">
              AI 驅動的永續報告書解決方案，協助企業輕鬆達成碳盤查、ESG 揭露、
              GRI/TCFD 合規目標。
            </p>
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setShowNewReportModal(true)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                建立報告書
              </button>
              <button
                onClick={() => setViewMode('war-room')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                War Room 指揮中心
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: '已完成報告',
            value: mockReportStats.completedReports,
            total: mockReportStats.totalReports,
            icon: FileText,
            color: 'emerald',
          },
          {
            label: '碳排量減少',
            value: mockReportStats.totalCarbonReduction,
            unit: '噸 CO2e',
            icon: TrendingUp,
            color: 'blue',
          },
          {
            label: '合規達成率',
            value: mockReportStats.complianceRate,
            unit: '%',
            icon: Shield,
            color: 'purple',
          },
          {
            label: '已驗證報告',
            value: mockReportStats.verifiedReports,
            icon: CheckCircle,
            color: 'amber',
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold text-${stat.color}-400 uppercase tracking-wider`}>
                {stat.label}
              </span>
              <stat.icon className={`w-5 h-5 text-${stat.color}-400/50`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              {stat.unit && (
                <span className="text-sm text-slate-500">{stat.unit}</span>
              )}
            </div>
            {stat.total && (
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className={`h-full bg-${stat.color}-500 rounded-full`}
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {reportTypes.map((type, index) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCreateReport(type.id)}
            className={`p-6 bg-gradient-to-br from-${type.color}-900/30 to-${type.color}-900/10 rounded-2xl border border-${type.color}-500/20 hover:border-${type.color}-500/40 transition-all text-left`}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <div className="font-bold text-white mb-1">{type.name}</div>
            <div className="text-xs text-slate-400">{type.description}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 rounded-3xl border border-white/5 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">最近報告書</h2>
          <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  report.status === 'completed' ? 'bg-emerald-500/20' :
                  report.status === 'in_progress' ? 'bg-blue-500/20' :
                  'bg-slate-700'
                }`}>
                  {report.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : report.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{report.title}</div>
                  <div className="text-xs text-slate-500">{report.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.verified && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    <Shield className="w-3 h-3" />
                    已驗證
                  </span>
                )}
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-3xl border border-purple-500/20 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">AI 洞察摘要</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                📊 範疇二用電排放較上季減少 8.5%，建議優化空調系統可進一步降低 5%
              </p>
              <p className="text-sm text-slate-300">
                ⚠️ GRI 305-1 指標資料完整度僅 72%，請補充直接排放源的盤查數據
              </p>
              <p className="text-sm text-slate-300">
                ✅ TCFD 氣候風險評估報告已完成，符合最新監管要求
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-medium rounded-xl transition-all">
            查看詳情
          </button>
        </div>
      </motion.div>
    </div>
  );

  // 渲染碳盤查表單
  const renderCarbonForm = () => (
    <div>
      <button
        onClick={() => setViewMode('hub')}
        className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        返回總覽
      </button>
      <CarbonInventoryForm
        onSubmit={(data) => {
          console.log('碳盤查數據:', data);
          setViewMode('hub');
        }}
        onClose={() => setViewMode('hub')}
      />
    </div>
  );

  // 渲染 War Room
  const renderWarRoom = () => (
    <div>
      <button
        onClick={() => setViewMode('hub')}
        className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        返回總覽
      </button>
      <WarRoomDashboard />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <AnimatePresence mode="wait">
        {viewMode === 'hub' && renderHubView()}
        {viewMode === 'carbon-form' && renderCarbonForm()}
        {viewMode === 'excel-upload' && (
          <ExcelUploader
            onParse={(data) => {
              console.log('解析數據:', data);
              setViewMode('hub');
            }}
            onClose={() => setViewMode('hub')}
          />
        )}
        {viewMode === 'war-room' && renderWarRoom()}
      </AnimatePresence>

      {/* New Report Modal */}
      <AnimatePresence>
        {showNewReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-3xl border border-white/10 max-w-2xl w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">建立新報告書</h2>
                <button
                  onClick={() => setShowNewReportModal(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {reportTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCreateReport(type.id)}
                    className={`p-6 bg-gradient-to-br from-${type.color}-900/30 to-${type.color}-900/10 rounded-2xl border border-${type.color}-500/20 hover:border-${type.color}-500/40 transition-all text-left`}
                  >
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <div className="font-bold text-white mb-1">{type.name}</div>
                    <div className="text-xs text-slate-400">{type.description}</div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-400">
                  💡 提示：選擇報告書類型後，系統將根據您的數據自動生成符合標準的報告書草稿。
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SustainabilityReportHub;
