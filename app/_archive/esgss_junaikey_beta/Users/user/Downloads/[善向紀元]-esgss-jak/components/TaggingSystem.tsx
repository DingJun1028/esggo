import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, TrendingUp, Database, Brain, Shield, Activity, Users, Target, Zap } from 'lucide-react';

// 標籤系統的核心類型定義
interface TagItem {
  id: string;
  name: string;
  weight: number;
  category: string;
  usageCount: number;
  lastUsed: string;
  confidence: number;
  metadata: {
    created: string;
    updated: string;
    creator: string;
    source: 'ai' | 'human' | 'system';
  };
}

interface DataItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
  tags: TagItem[];
  metadata: {
    created: string;
    updated: string;
    source: string;
  };
}

interface TagEvent {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'MERGE';
  dataId: string;
  tagId: string;
  timestamp: string;
  userId: string;
  details: any;
}

// 系統狀態介面
interface SystemStats {
  totalTags: number;
  activeConnections: number;
  accuracy: number;
  avgLatency: number;
  processedEvents: number;
}

const TaggingSystem: React.FC = () => {
  // 系統狀態
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalTags: 15847,
    activeConnections: 342,
    accuracy: 94.7,
    avgLatency: 127,
    processedEvents: 1247
  });

  // 標籤數據
  const [tags, setTags] = useState<TagItem[]>([
    {
      id: 'tag-001',
      name: 'ESG永續',
      weight: 95,
      category: '環境',
      usageCount: 1247,
      lastUsed: new Date().toISOString(),
      confidence: 98.5,
      metadata: {
        created: '2024-01-01T00:00:00Z',
        updated: new Date().toISOString(),
        creator: 'system',
        source: 'ai'
      }
    },
    {
      id: 'tag-002',
      name: 'AI智能',
      weight: 87,
      category: '科技',
      usageCount: 892,
      lastUsed: new Date().toISOString(),
      confidence: 96.2,
      metadata: {
        created: '2024-01-02T00:00:00Z',
        updated: new Date().toISOString(),
        creator: 'human',
        source: 'human'
      }
    }
  ]);

  // 數據項目
  const [dataItems, setDataItems] = useState<DataItem[]>([
    {
      id: 'data-001',
      content: 'ESG永續投資策略分析報告',
      type: 'text',
      tags: [],
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        source: 'upload'
      }
    }
  ]);

  // 事件流
  const [events, setEvents] = useState<TagEvent[]>([
    {
      id: 'event-001',
      type: 'CREATE',
      dataId: 'data-001',
      tagId: 'tag-001',
      timestamp: new Date().toISOString(),
      userId: 'system',
      details: { confidence: 98.5 }
    }
  ]);

  // 當前視圖
  const [currentView, setCurrentView] = useState<'overview' | 'tracking' | 'lineage' | 'engine' | 'governance'>('overview');

  // 模擬實時數據更新
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        processedEvents: prev.processedEvents + Math.floor(Math.random() * 10),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 5) - 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 模組渲染
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-80">總標籤數量</h3>
            <p className="text-3xl font-bold">{systemStats.totalTags.toLocaleString()}</p>
          </div>
          <Tag className="h-8 w-8 opacity-80" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-80">活躍連接</h3>
            <p className="text-3xl font-bold">{systemStats.activeConnections}</p>
          </div>
          <Activity className="h-8 w-8 opacity-80" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-80">準確率</h3>
            <p className="text-3xl font-bold">{systemStats.accuracy}%</p>
          </div>
          <Target className="h-8 w-8 opacity-80" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-80">平均延遲</h3>
            <p className="text-3xl font-bold">{systemStats.avgLatency}ms</p>
          </div>
          <Zap className="h-8 w-8 opacity-80" />
        </div>
      </motion.div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
          實時事件追蹤
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                event.type === 'CREATE' ? 'border-green-500 bg-green-50' :
                event.type === 'UPDATE' ? 'border-blue-500 bg-blue-50' :
                event.type === 'DELETE' ? 'border-red-500 bg-red-50' :
                'border-purple-500 bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{event.type}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {event.userId}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                數據 ID: {event.dataId} | 標籤 ID: {event.tagId}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLineage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Database className="h-6 w-6 mr-2 text-green-500" />
          標籤血緣分析
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">數據 → 標籤 追蹤</h4>
            {dataItems.slice(0, 3).map(item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg mb-3 hover:shadow-md transition-shadow"
              >
                <p className="font-medium">{item.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag.name} ({tag.confidence.toFixed(1)}%)
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-3">標籤 → 數據 追蹤</h4>
            {tags.slice(0, 3).map(tag => (
              <motion.div
                key={tag.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg mb-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-sm text-gray-500">
                    使用 {tag.usageCount} 次
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${tag.weight}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngine = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-500" />
          AI智能引擎
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="font-semibold mb-2">Straico AI</h4>
            <p className="text-sm text-gray-600">多模態內容分析</p>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
              </div>
              <span className="ml-2 text-xs">85%</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="font-semibold mb-2">OpenAI GPT-4</h4>
            <p className="text-sm text-gray-600">自然語言處理</p>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-5/6"></div>
              </div>
              <span className="ml-2 text-xs">92%</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="font-semibold mb-2">知識圖譜</h4>
            <p className="text-sm text-gray-600">語義關聯分析</p>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="ml-2 text-xs">78%</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-red-500" />
          治理與合規機制
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">權限管理</h4>
            <div className="space-y-2">
              {['管理員', '編輯者', '查看者'].map(role => (
                <div key={role} className="flex items-center justify-between p-3 border rounded">
                  <span>{role}</span>
                  <span className="text-sm text-gray-500">
                    {role === '管理員' ? '完全控制' :
                     role === '編輯者' ? '編輯標籤' : '唯讀權限'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">質量監控</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>準確率</span>
                <span className="font-semibold text-green-600">94.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>重複率</span>
                <span className="font-semibold text-yellow-600">2.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>用戶滿意度</span>
                <span className="font-semibold text-blue-600">4.8/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 標題區域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏷️ 永久即時智能雙向自動追蹤生成式標籤機制
          </h1>
          <p className="text-lg text-gray-600">
            善向永續 • 萬能元鑰 • AI驅動的智慧標籤生態系統
          </p>
        </motion.div>

        {/* 導航標籤 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: '系統總覽', icon: Activity },
            { id: 'tracking', label: '即時追蹤', icon: TrendingUp },
            { id: 'lineage', label: '標籤血緣', icon: Database },
            { id: 'engine', label: '智能引擎', icon: Brain },
            { id: 'governance', label: '治理機制', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView(id as any)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                currentView === id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* 內容區域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'overview' && renderOverview()}
            {currentView === 'tracking' && renderTracking()}
            {currentView === 'lineage' && renderLineage()}
            {currentView === 'engine' && renderEngine()}
            {currentView === 'governance' && renderGovernance()}
          </motion.div>
        </AnimatePresence>

        {/* 啟動按鈕 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🚀 啟動萬能標籤系統
          </motion.button>
          <p className="text-sm text-gray-500 mt-2">
            解鎖ESG永續事業的智慧標籤新紀元
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TaggingSystem;