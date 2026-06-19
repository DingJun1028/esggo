import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Database,
  Zap,
  Search,
  Layers,
  Cpu,
  Globe,
  Server,
  Activity,
  Link,
  Eye,
  Brain,
  Code,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Language } from '../../types';
import { UniversalAgentContext } from '../../contexts/UniversalAgentContext';

interface ContextNode {
  id: string;
  type: 'data' | 'concept' | 'agent' | 'protocol';
  label: string;
  position: { x: number; y: number };
  connections: string[];
  metadata: {
    size: number;
    confidence: number;
    lastUpdated: number;
    source: string;
  };
}

interface ContextLayer {
  id: string;
  name: string;
  depth: number;
  nodes: ContextNode[];
  connections: Array<{ from: string; to: string; strength: number }>;
}

interface McpProtocolCore {
  version: string;
  activeConnections: number;
  totalMessages: number;
  avgLatency: number;
  errorRate: number;
  supportedTools: string[];
}

interface IndexShard {
  id: string;
  name: string;
  type: 'semantic' | 'temporal' | 'relational' | 'spatial';
  size: number;
  lastSync: number;
  status: 'active' | 'syncing' | 'error';
}

const ContextVisualization: React.FC<{
  layers: ContextLayer[];
  selectedLayer: string | null;
  onLayerSelect: (layerId: string) => void;
}> = ({ layers, selectedLayer, onLayerSelect }) => {
  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 h-96 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400 font-bold">Context Network</span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              selectedLayer === layer.id
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {selectedLayer === layer.id ? (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-white font-medium">{layer.name}</span>
                <span className="text-xs text-gray-400">Depth: {layer.depth}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-400">{layer.nodes.length} nodes</span>
              </div>
            </div>

            <AnimatePresence>
              {selectedLayer === layer.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {layer.nodes.slice(0, 5).map((node) => (
                    <div key={node.id} className="flex items-center gap-2 pl-6">
                      <div className={`w-2 h-2 rounded-full ${
                        node.type === 'data' ? 'bg-blue-400' :
                        node.type === 'concept' ? 'bg-purple-400' :
                        node.type === 'agent' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      <span className="text-sm text-gray-300">{node.label}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {node.metadata.confidence}%
                      </span>
                    </div>
                  ))}
                  {layer.nodes.length > 5 && (
                    <div className="pl-6 text-xs text-gray-500">
                      ... and {layer.nodes.length - 5} more nodes
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const McpProtocolDashboard: React.FC<{
  protocol: McpProtocolCore;
  language: Language;
}> = ({ protocol, language }) => {
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400 font-bold">
          {language === 'zh-TW' ? 'MCP 協議核心' : 'MCP Protocol Core'}
        </span>
        <span className="text-xs text-gray-400 ml-auto">v{protocol.version}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {language === 'zh-TW' ? '活躍連接' : 'Active Connections'}
            </span>
            <span className="text-sm font-bold text-green-400">
              {protocol.activeConnections}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {language === 'zh-TW' ? '總消息數' : 'Total Messages'}
            </span>
            <span className="text-sm font-bold text-blue-400">
              {protocol.totalMessages.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {language === 'zh-TW' ? '平均延遲' : 'Avg Latency'}
            </span>
            <span className={`text-sm font-bold ${getStatusColor(protocol.avgLatency, { good: 50, warning: 100 })}`}>
              {protocol.avgLatency}ms
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {language === 'zh-TW' ? '錯誤率' : 'Error Rate'}
            </span>
            <span className={`text-sm font-bold ${getStatusColor(protocol.errorRate * 100, { good: 1, warning: 5 })}`}>
              {(protocol.errorRate * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-300 mb-2">
          {language === 'zh-TW' ? '支援工具' : 'Supported Tools'}
        </div>
        <div className="flex flex-wrap gap-1">
          {protocol.supportedTools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const IndexShardManager: React.FC<{
  shards: IndexShard[];
  language: Language;
}> = ({ shards, language }) => {
  const getShardStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'syncing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getShardTypeIcon = (type: string) => {
    switch (type) {
      case 'semantic': return <Brain className="w-4 h-4" />;
      case 'temporal': return <Activity className="w-4 h-4" />;
      case 'relational': return <Link className="w-4 h-4" />;
      case 'spatial': return <Globe className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400 font-bold">
          {language === 'zh-TW' ? '分層索引碎片' : 'Hierarchical Index Shards'}
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {shards.length} {language === 'zh-TW' ? '碎片' : 'shards'}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className="flex items-center justify-between p-2 rounded border border-gray-600 hover:border-gray-500 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              {getShardTypeIcon(shard.type)}
              <div>
                <div className="text-sm text-white font-medium">{shard.name}</div>
                <div className="text-xs text-gray-400 capitalize">{shard.type}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {(shard.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(shard.lastSync).toLocaleTimeString()}
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${getShardStatusColor(shard.status).replace('text-', 'bg-')}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const OmniContextEngine: React.FC<{ language: Language }> = ({ language }) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>('surface');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);

  const [contextLayers] = useState<ContextLayer[]>([
    {
      id: 'surface',
      name: language === 'zh-TW' ? '表面層' : 'Surface Layer',
      depth: 1,
      nodes: [
        { id: 'n1', type: 'data', label: 'ESG Metrics', position: { x: 100, y: 100 }, connections: ['n2'], metadata: { size: 1024, confidence: 95, lastUpdated: Date.now(), source: 'live' } },
        { id: 'n2', type: 'concept', label: 'Sustainability', position: { x: 200, y: 150 }, connections: ['n3'], metadata: { size: 512, confidence: 88, lastUpdated: Date.now(), source: 'ai' } },
        { id: 'n3', type: 'agent', label: 'Analysis Bot', position: { x: 300, y: 200 }, connections: [], metadata: { size: 256, confidence: 92, lastUpdated: Date.now(), source: 'system' } }
      ],
      connections: [
        { from: 'n1', to: 'n2', strength: 0.8 },
        { from: 'n2', to: 'n3', strength: 0.6 }
      ]
    },
    {
      id: 'intermediate',
      name: language === 'zh-TW' ? '中間層' : 'Intermediate Layer',
      depth: 2,
      nodes: [
        { id: 'n4', type: 'protocol', label: 'MCP Protocol', position: { x: 150, y: 120 }, connections: ['n5'], metadata: { size: 2048, confidence: 98, lastUpdated: Date.now(), source: 'system' } },
        { id: 'n5', type: 'data', label: 'Blockchain Data', position: { x: 250, y: 180 }, connections: [], metadata: { size: 4096, confidence: 85, lastUpdated: Date.now(), source: 'blockchain' } }
      ],
      connections: [
        { from: 'n4', to: 'n5', strength: 0.9 }
      ]
    },
    {
      id: 'deep',
      name: language === 'zh-TW' ? '深層' : 'Deep Layer',
      depth: 3,
      nodes: [
        { id: 'n6', type: 'concept', label: 'Universal Intelligence', position: { x: 200, y: 160 }, connections: ['n7'], metadata: { size: 8192, confidence: 76, lastUpdated: Date.now(), source: 'ai' } },
        { id: 'n7', type: 'agent', label: 'Evolution Engine', position: { x: 350, y: 220 }, connections: [], metadata: { size: 16384, confidence: 82, lastUpdated: Date.now(), source: 'system' } }
      ],
      connections: [
        { from: 'n6', to: 'n7', strength: 0.7 }
      ]
    }
  ]);

  const [protocolCore] = useState<McpProtocolCore>({
    version: '2.0.1',
    activeConnections: 24,
    totalMessages: 15420,
    avgLatency: 45,
    errorRate: 0.0032,
    supportedTools: ['data-analysis', 'semantic-search', 'context-synthesis', 'pattern-recognition', 'prediction-model']
  });

  const [indexShards] = useState<IndexShard[]>([
    { id: 'shard-1', name: 'Semantic Index', type: 'semantic', size: 52428800, lastSync: Date.now() - 300000, status: 'active' },
    { id: 'shard-2', name: 'Temporal Index', type: 'temporal', size: 31457280, lastSync: Date.now() - 600000, status: 'active' },
    { id: 'shard-3', name: 'Relational Index', type: 'relational', size: 67108864, lastSync: Date.now() - 120000, status: 'syncing' },
    { id: 'shard-4', name: 'Spatial Index', type: 'spatial', size: 20971520, lastSync: Date.now() - 1800000, status: 'error' }
  ]);

  const handleIndexing = async () => {
    setIsIndexing(true);
    // Simulate indexing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsIndexing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {language === 'zh-TW' ? '全向脈絡引擎' : 'OMNI-CONTEXT ENGINE'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {language === 'zh-TW'
              ? 'MCP 協議內核與分層索引系統的完美融合'
              : 'Perfect fusion of MCP protocol core and hierarchical indexing system'
            }
          </p>
        </motion.div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={language === 'zh-TW' ? '搜尋脈絡節點...' : 'Search context nodes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <motion.button
            onClick={handleIndexing}
            disabled={isIndexing}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isIndexing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
            whileHover={!isIndexing ? { scale: 1.05 } : {}}
            whileTap={!isIndexing ? { scale: 0.95 } : {}}
          >
            {isIndexing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {language === 'zh-TW' ? '重新索引' : 'Re-index'}
          </motion.button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Context Visualization */}
          <ContextVisualization
            layers={contextLayers}
            selectedLayer={selectedLayer}
            onLayerSelect={setSelectedLayer}
          />

          {/* MCP Protocol Dashboard */}
          <McpProtocolDashboard protocol={protocolCore} language={language} />
        </div>

        {/* Index Shard Manager */}
        <IndexShardManager shards={indexShards} language={language} />

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <motion.div
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '資料整合' : 'DATA INTEGRATION'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '統一多源資料管道'
                : 'Unified multi-source data pipelines'
              }
            </p>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '配置管道' : 'CONFIGURE'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '語意搜尋' : 'SEMANTIC SEARCH'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '智慧語意理解與檢索'
                : 'Intelligent semantic understanding and retrieval'
              }
            </p>
            <motion.button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '啟動搜尋' : 'SEARCH'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Network className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '網路優化' : 'NETWORK OPTIMIZATION'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '動態脈絡網路優化'
                : 'Dynamic context network optimization'
              }
            </p>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '優化網路' : 'OPTIMIZE'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '協議配置' : 'PROTOCOL CONFIG'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? 'MCP 協議參數調優'
                : 'MCP protocol parameter tuning'
              }
            </p>
            <motion.button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '配置協議' : 'CONFIGURE'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OmniContextEngine;