import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  Users,
  Factory,
  Globe,
  Shield,
  Activity,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

// 模擬數據
const generateMockData = () => ({
  carbon: {
    totalEmission: 12540.5,
    targetEmission: 10000,
    unit: 'kg CO2e',
    trend: -12.5,
    scope1: 3240.2,
    scope2: 6890.3,
    scope3: 2410.0,
  },
  targets: [
    { id: 1, name: '2030 減碳 30%', current: 68, deadline: '2030-12-31', status: 'on_track' },
    { id: 2, name: '2025 範疇二減 15%', current: 82, deadline: '2025-12-31', status: 'at_risk' },
    { id: 3, name: '2026 RE100 承諾', current: 45, deadline: '2026-12-31', status: 'behind' },
  ],
  alerts: [
    { id: 1, type: 'warning', message: '本月用電量超出預算 12%', time: '2小時前', category: 'energy' },
    { id: 2, type: 'info', message: '新減碳技術報告已發布', time: '5小時前', category: 'policy' },
    { id: 3, type: 'success', message: 'Q3 碳排放目標達成', time: '1天前', category: 'achievement' },
  ],
  departments: [
    { name: '製造部', emission: 5230, change: -8.5, rank: 1 },
    { name: '辦公室', emission: 1890, change: -15.2, rank: 2 },
    { name: '物流部', emission: 3420, change: +2.1, rank: 3 },
    { name: '研發部', emission: 1200, change: -22.0, rank: 4 },
  ],
});

interface WarRoomDashboardProps {
  organizationId?: string;
}

export const WarRoomDashboard: React.FC<WarRoomDashboardProps> = ({
  organizationId = 'demo-org',
}) => {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">War Room 指揮中心</h2>
            <p className="text-sm text-slate-400">
              即時監控永續指標與減碳目標進度
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>更新於 {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Carbon Emission Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  碳排放總量
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-white">
                    {data.carbon.totalEmission.toLocaleString()}
                  </span>
                  <span className="text-slate-400">{data.carbon.unit}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                data.carbon.trend < 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                {data.carbon.trend < 0 ? (
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-bold ${data.carbon.trend < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {Math.abs(data.carbon.trend)}%
                </span>
              </div>
            </div>

            {/* Scope Breakdown */}
            <div className="space-y-3">
              {[
                { label: '範疇一', value: data.carbon.scope1, color: 'bg-red-500' },
                { label: '範疇二', value: data.carbon.scope2, color: 'bg-yellow-500' },
                { label: '範疇三', value: data.carbon.scope3, color: 'bg-blue-500' },
              ].map((scope) => (
                <div key={scope.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{scope.label}</span>
                    <span className="text-white font-medium">{scope.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(scope.value / data.carbon.totalEmission) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${scope.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Target Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 bg-gradient-to-br from-purple-900 to-slate-800 rounded-3xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              目標進度
            </h3>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          
          <div className="space-y-4">
            {data.targets.map((target) => (
              <div key={target.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">{target.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    target.status === 'on_track' ? 'bg-emerald-500/20 text-emerald-400' :
                    target.status === 'at_risk' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {target.status === 'on_track' ? '按計劃' :
                     target.status === 'at_risk' ? '有風險' : '落後'}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${target.current}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      target.status === 'on_track' ? 'bg-emerald-500' :
                      target.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{target.current}% 完成</span>
                  <span>期限: {target.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 bg-gradient-to-br from-amber-900/30 to-slate-800 rounded-3xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              預警系統
            </h3>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          
          <div className="space-y-3">
            {data.alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-xl border ${
                  alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                  alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                  ) : alert.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-white">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Department Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              部門排行榜
            </h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {data.departments
              .sort((a, b) => a.rank - b.rank)
              .map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 rounded-2xl border ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-500/30' :
                    'bg-slate-800/50 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className={`flex items-center gap-1 text-xs ${
                      dept.change < 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {dept.change < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      {Math.abs(dept.change)}%
                    </div>
                  </div>
                  <div className="font-bold text-white">{dept.name}</div>
                  <div className="text-lg font-black text-white mt-1">
                    {dept.emission.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">kg CO2e</div>
                  
                  {index === 0 && (
                    <div className="flex items-center gap-1 mt-2 text-yellow-400 text-xs">
                      <Award className="w-3 h-3" />
                      <span>本月最佳</span>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-4 grid grid-cols-4 gap-4"
        >
          {[
            { icon: Factory, label: '新增排放數據', color: 'blue' },
            { icon: Globe, label: '查看報告書', color: 'purple' },
            { icon: Shield, label: '合規檢查', color: 'emerald' },
            { icon: Target, label: '設定目標', color: 'amber' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
            >
              <div className={`w-10 h-10 bg-${action.color}-500/20 rounded-xl flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 text-${action.color}-400`} />
              </div>
              <span className="text-sm font-bold text-white">{action.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WarRoomDashboard;
