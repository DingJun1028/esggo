import React from 'react';
import { Language } from '@/types';
import { BarChart3, LineChart, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';
import { OmniEsgCell } from '@/omni/interaction/visuals/OmniEsgCell';
import { Activity, DollarSign, Zap, Database } from './icons';

export const AnalyticsDashboard: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';

  const chartData = {
    emissions: [
      { month: isZh ? '1月' : 'Jan', value: 450 },
      { month: isZh ? '2月' : 'Feb', value: 420 },
      { month: isZh ? '3月' : 'Mar', value: 380 },
      { month: isZh ? '4月' : 'Apr', value: 350 },
      { month: isZh ? '5月' : 'May', value: 320 },
      { month: isZh ? '6月' : 'Jun', value: 280 },
    ],
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-aqua-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
            {isZh ? 'ESG 分析儀表板' : 'ESG Analytics Dashboard'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh
              ? '深入了解您的 ESG 表現與趨勢'
              : 'Deep insights into your ESG performance and trends'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800/50 hover:bg-aqua-500/10 border border-aqua-500/20 hover:border-aqua-500/40 text-slate-200 hover:text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all">
            <Calendar className="w-4 h-4" />
            {isZh ? '最近 30 天' : 'Last 30 Days'}
          </button>
          <button className="bg-gradient-to-r from-aqua-500/20 to-sky-500/20 hover:from-aqua-500/30 hover:to-sky-500/30 border border-aqua-500/30 text-aqua-400 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)]">
            <Download className="w-4 h-4" />
            {isZh ? '匯出報告' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OmniEsgCell
          key="carbon"
          id="carbon-intensity"
          label={isZh ? '碳排放強度' : 'Carbon Intensity'}
          value={3.2}
          unit="tCO2e/M$"
          color="aqua"
          icon={Activity}
          trend={{ value: 18, direction: 'down' }}
          confidence="high"
        />
        <OmniEsgCell
          key="energy"
          id="energy-efficiency"
          label={isZh ? '能源使用效率' : 'Energy Efficiency'}
          value={87}
          unit="%"
          color="blue"
          icon={Zap}
          // Generic fix for all trend objects in this file
          trend={{ value: 5, direction: 'up' }}
        />
        <OmniEsgCell
          key="compliance"
          id="compliance-status"
          label={isZh ? '合規狀態' : 'ESG Score'}
          value={94}
          unit="/100"
          color="purple"
          icon={Database}
          trend={{ value: 3, direction: 'up' }}
          verified={true}
        />
        <OmniEsgCell
          key="social"
          id="social-impact"
          label={isZh ? '社會影響力' : 'Cost Savings'}
          value={2.4}
          unit="M"
          color="gold"
          icon={DollarSign}
          trend={{ value: 22, direction: 'up' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions Trend Chart */}
        <div className="bg-slate-900/50 border border-aqua-500/20 rounded-3xl p-6 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-aqua-400" />
              {isZh ? '碳排放趨勢' : 'Emissions Trend'}
            </h3>
            <div className="flex items-center gap-2 text-aqua-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />
              -18%
            </div>
          </div>

          <div className="space-y-2">
            {chartData.emissions.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-8">{item.month}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-6 relative overflow-hidden border border-white/5">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-aqua-600 to-sky-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    style={{ width: `${(item.value / 450) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-bold text-white">
                    {item.value} tCO2e
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG Breakdown */}
        <div className="bg-slate-900/50 border border-aqua-500/20 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-sky-400" />
              {isZh ? 'ESG 得分分佈' : 'ESG Score Breakdown'}
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                category: 'E - Environmental',
                score: 92,
                color: 'aqua',
                description: isZh ? '環境保護' : 'Environmental',
              },
              {
                category: 'S - Social',
                score: 95,
                color: 'blue',
                description: isZh ? '社會責任' : 'Social',
              },
              {
                category: 'G - Governance',
                score: 96,
                color: 'purple',
                description: isZh ? '公司治理' : 'Governance',
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold text-sm">{item.category}</span>
                  <span className={`text-${item.color}-400 font-bold`}>{item.score}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 rounded-full transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-slate-900/50 border border-aqua-500/20 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">
          {isZh ? '詳細指標' : 'Detailed Metrics'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                  {isZh ? '指標' : 'Metric'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                  {isZh ? '目前值' : 'Current'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                  {isZh ? '目標' : 'Target'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                  {isZh ? '變化' : 'Change'}
                </th>
                <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                  {isZh ? '狀態' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  metric: isZh ? '碳排放總量' : 'Total GHG Emissions',
                  current: '280 tCO2e',
                  target: '250 tCO2e',
                  change: '-18%',
                  status: 'on-track',
                },
                {
                  metric: isZh ? '再生能源使用率' : 'Renewable Energy Use',
                  current: '45%',
                  target: '50%',
                  change: '+12%',
                  status: 'on-track',
                },
                {
                  metric: isZh ? '水資源效率' : 'Water Efficiency',
                  current: '92%',
                  target: '90%',
                  change: '+8%',
                  status: 'achieved',
                },
                {
                  metric: isZh ? '廢棄物回收率' : 'Waste Recycling Rate',
                  current: '78%',
                  target: '85%',
                  change: '+3%',
                  status: 'needs-attention',
                },
                {
                  metric: isZh ? '員工滿意度' : 'Employee Satisfaction',
                  current: '88%',
                  target: '85%',
                  change: '+5%',
                  status: 'achieved',
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white font-semibold">{row.metric}</td>
                  <td className="py-4 text-slate-300">{row.current}</td>
                  <td className="py-4 text-slate-400">{row.target}</td>
                  <td
                    className={`py-4 font-bold ${row.change.startsWith('+') ? 'text-emerald-400' : 'text-blue-400'}`}
                  >
                    {row.change}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.status === 'achieved'
                          ? 'bg-aqua-500/10 text-aqua-400 border border-aqua-500/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                          : row.status === 'on-track'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {row.status === 'achieved'
                        ? isZh
                          ? '已達成'
                          : 'Achieved'
                        : row.status === 'on-track'
                          ? isZh
                            ? '正常'
                            : 'On Track'
                          : isZh
                            ? '需關注'
                            : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
