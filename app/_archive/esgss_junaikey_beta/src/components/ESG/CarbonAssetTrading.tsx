/**
 * 🌱 碳資產與碳交易系統
 * --------------------------------------------------
 * [功能] 碳資產管理、碳交易市場、碳足跡追蹤
 * [語言] 全繁體中文
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, ArrowUpDown, DollarSign, BarChart3 } from 'lucide-react';

export interface CarbonAsset {
  id: string;
  type: 'CarbonCredit' | 'CarbonCredit' | 'VCS' | 'GS'; // Using generic English terms where applicable or keeping logic
  quantity: number;
  unit: 'tCO2e';
  price: number;
  totalValue: number;
  expiryDate: Date;
  certificationStandard: string;
}

export interface CarbonTransactionRecord {
  id: string;
  type: 'Buy' | 'Sell';
  assetType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  transactionTime: number;
  counterparty: string;
}

export interface CarbonFootprintData {
  period: string;
  scope1: number;
  scope2: number;
  scope3: number;
  totalEmissions: number;
  reductionTarget: number;
  achievementRate: number;
}

export const CarbonAssetTrading: React.FC = () => {
  const [carbonAssets, setCarbonAssets] = useState<CarbonAsset[]>([]);
  const [transactionRecords, setTransactionRecords] = useState<CarbonTransactionRecord[]>([]);
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprintData | null>(null);
  const [currentTab, setCurrentTab] = useState<'Assets' | 'Transactions' | 'Footprint'>('Assets');

  useEffect(() => {
    // 模擬載入數據
    setCarbonAssets([
      {
        id: 'CA-001',
        type: 'CarbonCredit', // 碳權
        quantity: 1000,
        unit: 'tCO2e',
        price: 25,
        totalValue: 25000,
        expiryDate: new Date('2025-12-31'),
        certificationStandard: 'ISO 14064',
      },
      {
        id: 'CA-002',
        type: 'VCS',
        quantity: 500,
        unit: 'tCO2e',
        price: 30,
        totalValue: 15000,
        expiryDate: new Date('2026-06-30'),
        certificationStandard: 'Verified Carbon Standard',
      },
    ]);

    setTransactionRecords([
      {
        id: 'TX-001',
        type: 'Buy',
        assetType: 'CarbonCredit',
        quantity: 500,
        unitPrice: 25,
        totalAmount: 12500,
        transactionTime: Date.now() - 86400000,
        counterparty: '綠能科技股份有限公司',
      },
      {
        id: 'TX-002',
        type: 'Sell',
        assetType: 'VCS',
        quantity: 200,
        unitPrice: 30,
        totalAmount: 6000,
        transactionTime: Date.now() - 172800000,
        counterparty: '永續製造有限公司',
      },
    ]);

    setCarbonFootprint({
      period: '2024 Q4',
      scope1: 1200,
      scope2: 800,
      scope3: 2000,
      totalEmissions: 4000,
      reductionTarget: 5000,
      achievementRate: 80,
    });
  }, []);

  const totalAssetValue = carbonAssets.reduce((sum, asset) => sum + asset.totalValue, 0);

  return (
    <div className="CarbonAssetTradingContainer p-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* 標題 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Leaf className="text-green-600" size={36} />
          碳資產與碳交易系統
        </h1>
        <p className="text-slate-600">管理碳資產、追蹤碳足跡、參與碳交易市場</p>
      </motion.div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <OverviewCard
          title="總資產價值"
          value={`$${totalAssetValue.toLocaleString()}`}
          icon={<DollarSign />}
          color="green"
        />
        <OverviewCard
          title="碳資產總量"
          value={`${carbonAssets.reduce((sum, a) => sum + a.quantity, 0)} tCO2e`}
          icon={<Leaf />}
          color="emerald"
        />
        <OverviewCard
          title="本月交易"
          value={`${transactionRecords.length} 筆`}
          icon={<ArrowUpDown />}
          color="blue"
        />
        <OverviewCard
          title="減量達成率"
          value={`${carbonFootprint?.achievementRate}%`}
          icon={<TrendingUp />}
          color="purple"
        />
      </div>

      {/* 頁籤 */}
      <div className="flex gap-2 mb-6">
        {(['Assets', 'Transactions', 'Footprint'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentTab === tab
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab === 'Assets' ? '資產' : tab === 'Transactions' ? '交易' : '足跡'}管理
          </button>
        ))}
      </div>

      {/* 內容區 */}
      {currentTab === 'Assets' && <CarbonAssetList assets={carbonAssets} />}
      {currentTab === 'Transactions' && <TransactionRecordList records={transactionRecords} />}
      {currentTab === 'Footprint' && carbonFootprint && (
        <CarbonFootprintDashboard data={carbonFootprint} />
      )}
    </div>
  );
};

const OverviewCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'from-green-400 to-green-600',
    emerald: 'from-emerald-400 to-emerald-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-600">{title}</span>
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </motion.div>
  );
};

const CarbonAssetList: React.FC<{ assets: CarbonAsset[] }> = ({ assets }) => (
  <div className="space-y-4">
    {assets.map(asset => (
      <motion.div
        key={asset.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-1">{asset.type}</h3>
            <p className="text-sm text-slate-500">{asset.id}</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            {asset.certificationStandard}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-slate-600 mb-1">數量</div>
            <div className="text-lg font-bold text-slate-800">
              {asset.quantity} {asset.unit}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">單價</div>
            <div className="text-lg font-bold text-slate-800">${asset.price}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">總值</div>
            <div className="text-lg font-bold text-green-600">
              ${asset.totalValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">到期日</div>
            <div className="text-lg font-bold text-slate-800">
              {asset.expiryDate.toLocaleDateString('zh-TW')}
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const TransactionRecordList: React.FC<{ records: CarbonTransactionRecord[] }> = ({ records }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <table className="w-full">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">交易類型</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">碳資產</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">數量</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">單價</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">總金額</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">交易對象</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  record.type === 'Buy'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {record.type === 'Buy' ? '買入' : '賣出'}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-800">{record.assetType}</td>
            <td className="px-6 py-4 text-slate-800">{record.quantity} tCO2e</td>
            <td className="px-6 py-4 text-slate-800">${record.unitPrice}</td>
            <td className="px-6 py-4 font-semibold text-slate-800">
              ${record.totalAmount.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-slate-600">{record.counterparty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CarbonFootprintDashboard: React.FC<{ data: CarbonFootprintData }> = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart3 className="text-green-600" />
        碳排放總覽 - {data.period}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EmissionCard title="範疇一" value={data.scope1} color="red" />
        <EmissionCard title="範疇二" value={data.scope2} color="orange" />
        <EmissionCard title="範疇三" value={data.scope3} color="yellow" />
        <EmissionCard title="總排放" value={data.totalEmissions} color="slate" />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-1">減量目標達成率</h4>
            <p className="text-sm text-slate-600">目標: {data.reductionTarget} tCO2e</p>
          </div>
          <div className="text-4xl font-bold text-green-600">{data.achievementRate}%</div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
            style={{ width: `${data.achievementRate}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

const EmissionCard: React.FC<{ title: string; value: number; color: string }> = ({
  title,
  value,
  color,
}) => {
  const colorClasses = {
    red: 'from-red-400 to-red-600',
    orange: 'from-orange-400 to-orange-600',
    yellow: 'from-yellow-400 to-yellow-600',
    slate: 'from-slate-400 to-slate-600',
  };

  return (
    <div className="text-center">
      <div className="text-sm text-slate-600 mb-2">{title}</div>
      <div
        className={`text-3xl font-bold bg-gradient-to-r ${
          colorClasses[color as keyof typeof colorClasses]
        } bg-clip-text text-transparent mb-1`}
      >
        {value}
      </div>
      <div className="text-xs text-slate-500">tCO2e</div>
    </div>
  );
};
