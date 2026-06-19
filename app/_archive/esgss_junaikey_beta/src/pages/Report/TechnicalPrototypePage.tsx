import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Upload,
  Sparkles,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';

// 引入組件
import { CarbonInventoryForm } from '../../components/Report/CarbonInventoryForm';
import { ExcelUploader } from '../../components/Report/ExcelUploader';
import { WarRoomDashboard } from '../../components/Report/WarRoomDashboard';

// 模擬數據
const mockVerificationBadge = {
  level: 'Gold',
  score: 92.5,
  color: '#FFD700',
  icon: '🏆',
};

const mockAISuggestions = [
  {
    category: 'reduction',
    priority: 'high',
    title: '優化用電效率',
    description: '範疇二電力排放佔比過高，建議優先改善用電效率',
    estimatedImpact: '預估可減少 10-15% 總排放量',
  },
  {
    category: 'compliance',
    priority: 'medium',
    title: 'GRI 305-1 指標補充',
    description: '直接排放數據缺少部分燃料類型，請補充天然氣盤查資料',
    estimatedImpact: '提升合規度至 98%',
  },
  {
    category: 'cost',
    priority: 'low',
    title: '碳權交易評估',
    description: '評估購買碳權抵換的可行性與成本效益',
    estimatedImpact: '預估可降低碳成本 5-10%',
  },
];

type TabType = 'overview' | 'carbon' | 'excel' | 'report' | 'warroom';

export const TechnicalPrototypePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showForm, setShowForm] = useState(false);
  const [showExcel, setShowExcel] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [isCalculating, setIsCalculating] = useState(false);

  // 模擬計算
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setVerificationStatus('verified');
    }, 2000);
  };

  // 渲染標籤頁內容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'carbon':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">碳盤查計算引擎</h3>
              <p className="text-sm text-slate-400">
                整合 Gemini AI 進行精準碳排放計算，支援範疇一、二、三全面盤查
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '範疇一', value: '3,240', unit: 'kg CO2e', color: 'red' },
                { label: '範疇二', value: '6,890', unit: 'kg CO2e', color: 'yellow' },
                { label: '範疇三', value: '2,410', unit: 'kg CO2e', color: 'blue' },
              ].map((scope) => (
                <div
                  key={scope.label}
                  className={`bg-slate-900/50 rounded-xl p-6 border border-${scope.color}-500/20`}
                >
                  <div className="text-sm text-slate-400 mb-2">{scope.label}</div>
                  <div className="text-3xl font-black text-white">
                    {scope.value}
                  </div>
                  <div className="text-sm text-slate-500">{scope.unit}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              開啟碳盤查表單
            </button>
          </motion.div>
        );

      case 'excel':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">批次資料處理</h3>
              <p className="text-sm text-slate-400">
                支援 Excel/CSV 批次匯入，自動解析並驗證數據格式
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: '簡易版碳盤查', rows: 30, icon: '📊' },
                { name: '標準版碳盤查', rows: 80, icon: '📈' },
                { name: '專業版 ESG', rows: 150, icon: '🎯' },
              ].map((template) => (
                <div
                  key={template.name}
                  className="bg-slate-900/50 rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="text-3xl mb-3">{template.icon}</div>
                  <div className="font-bold text-white">{template.name}</div>
                  <div className="text-sm text-slate-500">{template.rows} 欄位</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowExcel(true)}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              上傳 Excel 檔案
            </button>
          </motion.div>
        );

      case 'report':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-amber-900/50 to-purple-900/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">報告書生成系統</h3>
              <p className="text-sm text-slate-400">
                支援 GRI、TCFD、SASB 等多種國際標準模板
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { name: 'GRI 永續報告書', type: 'gri', color: 'emerald' },
                { name: 'TCFD 氣候揭露', type: 'tcfd', color: 'amber' },
                { name: 'SASB 產業標準', type: 'sasb', color: 'purple' },
                { name: '碳盤查報告書', type: 'carbon', color: 'blue' },
              ].map((report) => (
                <motion.button
                  key={report.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 bg-gradient-to-br from-${report.color}-900/30 to-${report.color}-900/10 rounded-xl border border-${report.color}-500/20 hover:border-${report.color}-500/40 transition-all text-left`}
                >
                  <div className="font-bold text-white mb-2">{report.name}</div>
                  <div className="text-xs text-slate-400">符合國際標準</div>
                </motion.button>
              ))}
            </div>

            {/* AI 建議 */}
            <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-white">AI 智能建議</h4>
              </div>
              <div className="space-y-3">
                {mockAISuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/50 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{suggestion.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {suggestion.priority === 'high' ? '高優先' : suggestion.priority === 'medium' ? '中優先' : '低優先'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{suggestion.description}</p>
                    <p className="text-xs text-emerald-400 mt-2">💡 {suggestion.estimatedImpact}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  AI 分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成報告書
                </>
              )}
            </button>

            {/* 驗證狀態 */}
            {verificationStatus !== 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${
                  verificationStatus === 'verified'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {verificationStatus === 'verified' ? (
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-red-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white">4T 驗證通過</span>
                      <span className="text-sm text-slate-400">92.5 分</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl">🏆</span>
                      <span className="text-amber-400 font-bold">Gold 等級</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 'warroom':
        return <WarRoomDashboard />;

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 總覽統計 */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '碳排量', value: '12,540', unit: 'kg CO2e', trend: '-12.5%', icon: Activity },
                { label: '報告書', value: '18', unit: '份', trend: '+3', icon: FileText },
                { label: '合規度', value: '98.5', unit: '%', trend: '+2.1%', icon: Shield },
                { label: '減排量', value: '1,250', unit: '噸', trend: '-8.2%', icon: TrendingUp },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <stat.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{stat.value}</span>
                    <span className="text-sm text-slate-500">{stat.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 功能入口 */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: '碳盤查', description: 'AI 驅動碳排放計算', icon: '🌍', tab: 'carbon' },
                { title: '批次上傳', description: 'Excel/CSV 快速匯入', icon: '📊', tab: 'excel' },
                { title: '報告書生成', description: 'GRI/TCFD/SASB 模板', icon: '📋', tab: 'report' },
              ].map((feature, index) => (
                <motion.button
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => setActiveTab(feature.tab as TabType)}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <div className="font-bold text-white mb-1">{feature.title}</div>
                  <div className="text-sm text-slate-400">{feature.description}</div>
                  <div className="flex items-center gap-1 mt-4 text-xs text-emerald-400">
                    <span>了解更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* AI 洞察 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI 永續洞察</h3>
                  <p className="text-sm text-slate-400">基於 Gemini 的智能分析</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">減碳目標進度</p>
                    <p className="text-xs text-slate-400">2030 減碳 30% 目標已完成 68%，按計劃進行中</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">排放趨勢分析</p>
                    <p className="text-xs text-slate-400">本月碳排放較上月減少 5.2%，主要來自用電效率提升</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            永續報告書研製中心 - 技術驗證原型
          </h1>
          <p className="text-slate-400">
            AI 驅動的永續報告書解決方案 | 支援 GRI/TCFD/SASB 標準
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400">系統正常運行</span>
          </div>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: '總覽', icon: Activity },
          { id: 'carbon', label: '碳盤查', icon: Activity },
          { id: 'excel', label: '批次上傳', icon: Upload },
          { id: 'report', label: '報告書生成', icon: FileText },
          { id: 'warroom', label: 'War Room', icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <CarbonInventoryForm
            onSubmit={(data) => {
              console.log('碳盤查數據:', data);
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        )}

        {showExcel && (
          <ExcelUploader
            onParse={(data) => {
              console.log('解析數據:', data);
              setShowExcel(false);
            }}
            onClose={() => setShowExcel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalPrototypePage;
