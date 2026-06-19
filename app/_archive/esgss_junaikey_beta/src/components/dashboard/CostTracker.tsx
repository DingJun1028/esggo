import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Activity, Database } from 'lucide-react';

/**
 * API 使用記錄
 */
interface APIUsage {
  service: 'gemini' | 'snyk' | 'ollama';
  endpoint: string;
  timestamp: number;
  tokens?: number; // Gemini tokens
  cost?: number; // 估算成本
}

/**
 * API 成本追蹤儀表板
 * 追蹤 Gemini、Snyk、Ollama 的使用量和成本
 */
export const CostTracker: React.FC = () => {
  const [usage, setUsage] = useState<APIUsage[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('month');

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = () => {
    const saved = localStorage.getItem('api_usage');
    if (saved) {
      const data: APIUsage[] = JSON.parse(saved);
      setUsage(data);
    }
  };

  /**
   * 計算成本
   */
  const calculateCost = (service: string, tokens?: number): number => {
    if (service === 'gemini' && tokens) {
      // Gemini 2.0 Flash 免費，Pro 按使用計費
      // 假設 30% 使用 Pro 模型
      const proTokens = tokens * 0.3;
      return (proTokens / 1000) * 0.00125; // 每 1K tokens $0.00125
    }
    if (service === 'snyk') {
      // Free tier: 200 tests/月
      return 0;
    }
    // Ollama 完全免費
    return 0;
  };

  /**
   * 篩選時間範圍
   */
  const getFilteredUsage = (): APIUsage[] => {
    const now = Date.now();
    let cutoff = now;

    switch (timeRange) {
      case 'day':
        cutoff = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }

    return usage.filter(u => u.timestamp >= cutoff);
  };

  const filteredUsage = getFilteredUsage();

  // 統計
  const geminiTokens = filteredUsage
    .filter(u => u.service === 'gemini')
    .reduce((sum, u) => sum + (u.tokens || 0), 0);

  const snykCalls = filteredUsage.filter(u => u.service === 'snyk').length;

  const ollamaCalls = filteredUsage.filter(u => u.service === 'ollama').length;

  const totalCost = filteredUsage.reduce(
    (sum, u) => sum + (u.cost || calculateCost(u.service, u.tokens)),
    0
  );

  // 簡易趨勢數據（最近 7 天）
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const dayStart = Date.now() - (6 - i) * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayUsage = usage.filter(u => u.timestamp >= dayStart && u.timestamp < dayEnd);
    return dayUsage.length;
  });

  const maxCalls = Math.max(...trendData, 1);

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-200">API 成本追蹤</h2>
            <p className="text-sm text-gray-400">
              本{timeRange === 'day' ? '日' : timeRange === 'week' ? '週' : '月'}使用統計
            </p>
          </div>
        </div>

        {/* 時間範圍選擇 */}
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === 'day' ? '今日' : range === 'week' ? '本週' : '本月'}
            </button>
          ))}
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <div className="text-sm text-purple-300">Gemini Tokens</div>
          </div>
          <div className="text-3xl font-bold text-purple-400">{geminiTokens.toLocaleString()}</div>
          <div className="text-xs text-purple-300 mt-1">
            ~${((geminiTokens / 1000) * 0.00125 * 0.3).toFixed(4)}
          </div>
        </div>

        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-blue-400" />
            <div className="text-sm text-blue-300">Snyk 調用</div>
          </div>
          <div className="text-3xl font-bold text-blue-400">{snykCalls}</div>
          <div className="text-xs text-blue-300 mt-1">Free (200/月)</div>
        </div>

        <div className="p-4 bg-cyan-900/20 border border-cyan-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div className="text-sm text-cyan-300">Ollama 調用</div>
          </div>
          <div className="text-3xl font-bold text-cyan-400">{ollamaCalls}</div>
          <div className="text-xs text-cyan-300 mt-1">本地免費</div>
        </div>

        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div className="text-sm text-green-300">總成本</div>
          </div>
          <div className="text-3xl font-bold text-green-400">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-green-300 mt-1">USD</div>
        </div>
      </div>

      {/* 使用趨勢 */}
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-gray-200">最近 7 天調用趨勢</h3>
        </div>

        <div className="h-40 flex items-end gap-2">
          {trendData.map((count, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300"
                style={{
                  height: `${(count / maxCalls) * 100}%`,
                  minHeight: count > 0 ? '4px' : '0',
                }}
                title={`${count} calls`}
              />
              <div className="text-xs text-gray-500 mt-2">
                {index === 6 ? '今天' : `${6 - index}天前`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 成本說明 */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 成本說明</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>
            • Gemini 2.0 Flash：<span className="text-green-400">免費</span>（每分鐘 15 次請求）
          </p>
          <p>
            • Gemini 1.5 Pro：<span className="text-yellow-400">$0.00125 / 1K tokens</span>
            （僅在啟用時）
          </p>
          <p>
            • Snyk Free Plan：<span className="text-green-400">每月 200 次測試</span>
          </p>
          <p>
            • Ollama：<span className="text-green-400">完全免費</span>（本地運行）
          </p>
          <p className="text-gray-500 mt-2">* 成本為估算值，實際費用以服務商帳單為準</p>
        </div>
      </div>
    </div>
  );
};
