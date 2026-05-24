'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrandCard, BrandCardHeader, BrandBadge } from '../brand';
import { Activity, BarChart2 } from 'lucide-react';
import { listScrapedArticles } from '@dataconnect/generated';
import { dataConnect } from '@/lib/firebase';
import { format, subDays, parseISO, isSameDay } from 'date-fns';

export default function DataVisualizer() {
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const [highRisk, setHighRisk] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!dataConnect) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await listScrapedArticles(dataConnect);
        const articles = response.data.scrapedArticles;
        
        setTotalArticles(articles.length);
        setHighRisk(articles.filter((a: any) => a.impactLevel === 'high').length);

        // Process Distribution
        const categoryCounts: Record<string, number> = {};
        articles.forEach((a: any) => {
          const cat = a.category || '其它';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const colors = ['#003262', '#FDB515', '#3b7ea1', '#22c55e', '#64748b'];
        const distData = Object.entries(categoryCounts).map(([name, value], i) => ({
          name,
          value,
          color: colors[i % colors.length]
        }));
        setDistributionData(distData.length ? distData : [{ name: '無資料', value: 1, color: '#e2e8f0' }]);

        // Process Trend Data (last 7 days)
        const today = new Date();
        const dates = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
        
        const trend = dates.map(date => {
          const matching = articles.filter((a: any) => {
            if (!a.publishedAt) return false;
            try {
              return isSameDay(parseISO(a.publishedAt), date);
            } catch {
              return false;
            }
          });
          return {
            date: format(date, 'MM/dd'),
            articles: matching.length,
            alerts: matching.filter((a: any) => a.impactLevel === 'high').length
          };
        });
        
        setTrendData(trend);
      } catch (e: any) {
        console.error("Failed to load articles", e);
        setError(e.message || "未能載入資料。請檢查資料庫連線或網路狀態。");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Distribution Chart */}
      <BrandCard className="h-[400px] flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <BrandCardHeader title="情報來源分佈" subtitle="Intelligence Distribution by Category" />
          <BarChart2 className="text-[#003262]/20" size={24} />
        </div>
        <div className="flex-1 min-h-0 w-full relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 font-medium">Loading data...</div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-red-500 font-bold mb-1">圖表載入失敗</span>
              <span className="text-xs text-slate-500">{error}</span>
            </div>
          ) : totalArticles === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-slate-600 font-bold mb-1">目前無資料</span>
              <span className="text-xs text-slate-400">請執行 Omni-Scraper 獲取最新情報</span>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label for Pie Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-black text-[#003262]">{distributionData.length > 0 && distributionData[0].name !== '無資料' ? '100%' : '0%'}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">涵蓋率</span>
              </div>
            </>
          )}
        </div>
      </BrandCard>

      {/* Trend Chart */}
      <BrandCard className="h-[400px] flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <BrandCardHeader title="自動採集趨勢" subtitle="Omni-Scraper Daily Activity" />
          <BrandBadge variant="gold" size="xs">Live</BrandBadge>
        </div>
        <div className="flex-1 min-h-0 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 font-medium">Loading data...</div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-red-500 font-bold mb-1">圖表載入失敗</span>
              <span className="text-xs text-slate-500">{error}</span>
            </div>
          ) : totalArticles === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-slate-600 font-bold mb-1">目前無趨勢資料</span>
              <span className="text-xs text-slate-400">請執行 Omni-Scraper 獲取最新情報</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003262" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#003262" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '20px' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="articles" 
                  name="採集情報數" 
                  stroke="#003262" 
                  strokeWidth={3}
                  fill="url(#colorArticles)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="alerts" 
                  name="風險預警數" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorAlerts)" 
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </BrandCard>

      {/* KPI Summary */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '採集總數', value: totalArticles.toString(), trend: 'Live', color: 'text-[#003262]' },
          { label: '高衝擊風險', value: highRisk.toString(), trend: 'Live', color: 'text-red-500' },
          { label: '涵蓋標準來源', value: '18', trend: '0%', color: 'text-[#FDB515]' },
          { label: 'Omni 成功率', value: '99.8%', trend: '+0.2%', color: 'text-emerald-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-black ${kpi.color} leading-none`}>{kpi.value}</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
