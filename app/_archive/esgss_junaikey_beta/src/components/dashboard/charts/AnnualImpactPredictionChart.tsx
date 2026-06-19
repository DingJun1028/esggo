import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface AnnualImpactPredictionChartProps {
  darkMode?: boolean;
}

const AnnualImpactPredictionChart: React.FC<AnnualImpactPredictionChartProps> = ({
  darkMode = true,
}) => {
  // Mock data representing 6 months of historical data and 6 months of prediction
  const data = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.map((month, index) => {
      const isPredicted = index >= 6;
      const historicalBase = 100 - index * 2; // Improving (decreasing) emission trend
      const predictionBase = 88 - (index - 6) * 3; // More aggressive reduction in future

      return {
        month,
        value: isPredicted
          ? predictionBase + (Math.random() * 2 - 1)
          : historicalBase + (Math.random() * 2 - 1),
        predicted: isPredicted,
        // Confidence interval for prediction
        high: isPredicted ? predictionBase + (index - 5) * 1.5 : undefined,
        low: isPredicted ? predictionBase - (index - 5) * 1.5 : undefined,
      };
    });
  }, []);

  const themeColors = {
    primary: '#00e5ff', // Transparent Cyan
    secondary: '#ff0080', // Vibrant pink for contrast
    grid: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    text: darkMode ? '#94a3b8' : '#64748b',
    background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl bg-slate-900/40 shadow-2xl overflow-hidden relative group"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-cyan-400 rounded-full" />
            年度影響力預測圖幅
            <span className="text-[10px] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              AI Prediction
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            基於奧秘晶元系統 (Omni-Crystal) 的碳中和路徑演化
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              當前趨勢
            </div>
            <div className="text-emerald-400 font-mono font-bold">-12.4%</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              預測信心
            </div>
            <div className="text-cyan-400 font-mono font-bold">94.2%</div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: themeColors.text, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: themeColors.text, fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                color: '#fff',
              }}
              itemStyle={{ color: '#00e5ff' }}
            />

            {/* Confidence Area */}
            <Area
              type="monotone"
              dataKey="high"
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0.1}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0}
              connectNulls
            />

            {/* Historical Area */}
            <Area
              type="monotone"
              dataKey="value"
              data={data.filter(d => !d.predicted)}
              stroke={themeColors.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 4, fill: themeColors.primary, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#fff', stroke: themeColors.primary, strokeWidth: 2 }}
            />

            {/* Prediction Area */}
            <Area
              type="monotone"
              dataKey="value"
              data={data.filter(d => d.predicted)}
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorPredict)"
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-6 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
            4+1 Protocol
          </span>
          <div className="flex gap-1.5">
            {['溯', '蹤', '透', '感', '信'].map((char, i) => (
              <div
                key={char}
                className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${
                  i === 4
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
            AI Insight
          </span>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            "偵測到供應鏈共鳴異常，已優化 Q4 減排路徑。Trustworthy Seal (T5) 已刻印。"
          </p>
        </div>
      </div>

      {/* Achievement Badges Mini */}
      <div className="absolute top-6 right-36 flex -space-x-2">
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-slate-900 shadow-lg flex items-center justify-center text-[10px]"
          title="Golden Achievement"
        >
          🏆
        </div>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-slate-900 shadow-lg flex items-center justify-center text-[10px]"
          title="Compliance Master"
        >
          🛡️
        </div>
      </div>
    </motion.div>
  );
};

export default AnnualImpactPredictionChart;
