import React, { useState } from 'react';
import { Language } from '@/types';
import { Leaf, TrendingDown, DollarSign, Award, Plus, ArrowUpDown, FileText } from 'lucide-react';
import { OmniEsgCell } from '@/omni/interaction/visuals/OmniEsgCell';
import { Activity } from './icons';

export const CarbonAsset: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeTab, setActiveTab] = useState('portfolio');

  const carbonAssets = [
    {
      id: 1,
      type: 'VER',
      amount: 500,
      price: 12.5,
      project: isZh ? '風力發電 - 台灣' : 'Wind Power - Taiwan',
      status: 'verified',
    },
    {
      id: 2,
      type: 'GS',
      amount: 300,
      price: 15.0,
      project: isZh ? '太陽能農場 - 越南' : 'Solar Farm - Vietnam',
      status: 'verified',
    },
    {
      id: 3,
      type: 'VCS',
      amount: 450,
      price: 10.8,
      project: isZh ? '森林保育 - 印尼' : 'Forest Conservation - Indonesia',
      status: 'pending',
    },
    {
      id: 4,
      type: 'CAR',
      amount: 200,
      price: 18.0,
      project: isZh ? '甲烷捕集 - 美國' : 'Methane Capture - USA',
      status: 'verified',
    },
  ];

  const transactions = [
    {
      date: '2026-01-05',
      type: 'buy',
      amount: 100,
      price: 12.5,
      total: 1250,
      project: isZh ? '風力發電' : 'Wind Power',
    },
    {
      date: '2026-01-03',
      type: 'sell',
      amount: -50,
      price: 14.0,
      total: -700,
      project: isZh ? '太陽能' : 'Solar',
    },
    {
      date: '2025-12-28',
      type: 'retire',
      amount: -30,
      price: 0,
      total: 0,
      project: isZh ? '森林保育' : 'Forest',
    },
  ];

  const totalValue = carbonAssets.reduce((sum, asset) => sum + asset.amount * asset.price, 0);
  const totalCredits = carbonAssets.reduce((sum, asset) => sum + asset.amount, 0);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Leaf className="text-cyan-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            {isZh ? '碳資產管理' : 'Carbon Asset Management'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh ? '管理您的碳權資產組合' : 'Manage your carbon credit portfolio'}
          </p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg">
          <Plus className="w-4 h-4" />
          {isZh ? '購買碳權' : 'Buy Credits'}
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OmniEsgCell
          id="total-credits"
          label={isZh ? '持有碳權' : 'Total Credits'}
          value={totalCredits}
          unit="tCO2e"
          color="cyan"
          icon={Activity}
        />
        <OmniEsgCell
          id="portfolio-value"
          label={isZh ? '投資組合價值' : 'Portfolio Value'}
          value={totalValue / 1000}
          unit="K"
          color="gold"
          icon={DollarSign}
          trend={{ value: 2.5, direction: 'up' }}
        />
        <OmniEsgCell
          id="avg-cost"
          label={isZh ? '平均成本' : 'Avg Cost'}
          value={totalValue / totalCredits}
          unit="$/tCO2e"
          color="blue"
        />
        <OmniEsgCell
          id="retired-credits"
          label={isZh ? '已註銷' : 'Retired'}
          value={230}
          unit="tCO2e"
          color="purple"
          icon={Award}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-500/10">
        {[
          { id: 'portfolio', label: isZh ? '資產組合' : 'Portfolio' },
          { id: 'market', label: isZh ? '市場行情' : 'Market' },
          { id: 'transactions', label: isZh ? '交易記錄' : 'Transactions' },
          { id: 'retire', label: isZh ? '註銷紀錄' : 'Retirement' },
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
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          {carbonAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all glass-panel"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{asset.project}</h3>
                    <p className="text-xs text-slate-400">{asset.type} Standard</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    asset.status === 'verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {asset.status === 'verified'
                    ? isZh
                      ? '已驗證'
                      : 'Verified'
                    : isZh
                      ? '處理中'
                      : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">{isZh ? '持有數量' : 'Quantity'}</p>
                  <p className="text-white font-bold">{asset.amount} tCO2e</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">{isZh ? '平均價格' : 'Avg Price'}</p>
                  <p className="text-white font-bold">${asset.price}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">{isZh ? '市值' : 'Market Value'}</p>
                  <p className="text-emerald-400 font-bold">
                    ${(asset.amount * asset.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                    {isZh ? '交易' : 'Trade'}
                  </button>
                  <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                    {isZh ? '註銷' : 'Retire'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'market' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-blue-400" />
              {isZh ? '市場價格' : 'Market Prices'}
            </h3>
            <div className="space-y-3">
              {[
                { standard: 'VER', price: 12.5, change: +5.2 },
                { standard: 'Gold Standard', price: 15.0, change: +3.8 },
                { standard: 'VCS', price: 10.8, change: -1.2 },
                { standard: 'CAR', price: 18.0, change: +7.5 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white font-semibold">{item.standard}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">${item.price}</span>
                    <span
                      className={`text-sm font-bold ${item.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      {item.change > 0 ? '+' : ''}
                      {item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              {isZh ? '淨減排量' : 'Net Emissions Reduction'}
            </h3>
            <div className="text-center py-8">
              <div className="text-5xl font-black text-emerald-400 mb-2">-1,450</div>
              <div className="text-slate-400 mb-6">tCO2e {isZh ? '本年度' : 'This Year'}</div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: '72%' }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isZh ? '目標達成度: 72%' : 'Goal Achievement: 72%'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {isZh ? '交易歷史' : 'Transaction History'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '日期' : 'Date'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '類型' : 'Type'}
                  </th>
                  <th className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '專案' : 'Project'}
                  </th>
                  <th className="text-right text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '數量' : 'Amount'}
                  </th>
                  <th className="text-right text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '價格' : 'Price'}
                  </th>
                  <th className="text-right text-slate-400 text-xs font-bold uppercase tracking-wider py-3">
                    {isZh ? '總額' : 'Total'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 text-slate-300">{tx.date}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          tx.type === 'buy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.type === 'sell'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-purple-500/10 text-purple-400'
                        }`}
                      >
                        {tx.type === 'buy'
                          ? isZh
                            ? '購買'
                            : 'Buy'
                          : tx.type === 'sell'
                            ? isZh
                              ? '出售'
                              : 'Sell'
                            : isZh
                              ? '註銷'
                              : 'Retire'}
                      </span>
                    </td>
                    <td className="py-4 text-white">{tx.project}</td>
                    <td className="py-4 text-right font-bold text-white">{tx.amount} tCO2e</td>
                    <td className="py-4 text-right text-slate-300">${tx.price}</td>
                    <td
                      className={`py-4 text-right font-bold ${tx.total >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      ${Math.abs(tx.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
