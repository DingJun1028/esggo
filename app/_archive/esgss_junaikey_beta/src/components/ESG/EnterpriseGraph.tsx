/**
 * 🔗 企業連結圖譜組件
 * --------------------------------------------------
 * [功能] 視覺化供應鏈上下游關係與 ESG 風險傳導
 * [整合] 互動式節點圖、風險評估、路徑分析
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Building2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RefreshCw,
  Info,
  ChevronRight,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface EnterpriseNode {
  id: string;
  name: string;
  type: 'self' | 'supplier' | 'customer' | 'peer';
  tier: number; // 1 = direct, 2 = indirect, etc.
  industry: string;
  country: string;
  esgScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  connections: string[];
  revenue?: number;
  employees?: number;
}

export interface EnterpriseLink {
  source: string;
  target: string;
  type: 'supply' | 'customer' | 'partnership' | 'investment';
  strength: number; // 0-1
  riskTransmission: number; // 0-1
}

export interface RiskPath {
  nodes: string[];
  totalRisk: number;
  description: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_NODES: EnterpriseNode[] = [
  {
    id: 'self',
    name: '綠能科技 (本公司)',
    type: 'self',
    tier: 0,
    industry: '電子製造',
    country: '台灣',
    esgScore: 85,
    riskLevel: 'low',
    riskFactors: [],
    connections: ['sup-1', 'sup-2', 'sup-3', 'cust-1', 'cust-2'],
  },
  {
    id: 'sup-1',
    name: '台積電',
    type: 'supplier',
    tier: 1,
    industry: '半導體',
    country: '台灣',
    esgScore: 92,
    riskLevel: 'low',
    riskFactors: [],
    connections: ['self', 'sup-4'],
  },
  {
    id: 'sup-2',
    name: '鴻海精密',
    type: 'supplier',
    tier: 1,
    industry: '電子代工',
    country: '台灣',
    esgScore: 78,
    riskLevel: 'medium',
    riskFactors: ['勞工權益爭議', '能源管理'],
    connections: ['self', 'sup-5'],
  },
  {
    id: 'sup-3',
    name: '亞洲鋼鐵',
    type: 'supplier',
    tier: 1,
    industry: '鋼鐵',
    country: '中國',
    esgScore: 58,
    riskLevel: 'high',
    riskFactors: ['碳排放超標', 'CBAM 風險', '環境違規'],
    connections: ['self'],
  },
  {
    id: 'sup-4',
    name: '東京電子',
    type: 'supplier',
    tier: 2,
    industry: '設備',
    country: '日本',
    esgScore: 88,
    riskLevel: 'low',
    riskFactors: [],
    connections: ['sup-1'],
  },
  {
    id: 'sup-5',
    name: '深圳零組件',
    type: 'supplier',
    tier: 2,
    industry: '零組件',
    country: '中國',
    esgScore: 52,
    riskLevel: 'critical',
    riskFactors: ['強迫勞動疑慮', '無 ESG 報告', '供應鏈不透明'],
    connections: ['sup-2'],
  },
  {
    id: 'cust-1',
    name: 'Apple Inc.',
    type: 'customer',
    tier: 1,
    industry: '消費電子',
    country: '美國',
    esgScore: 82,
    riskLevel: 'low',
    riskFactors: [],
    connections: ['self'],
  },
  {
    id: 'cust-2',
    name: 'Dell Technologies',
    type: 'customer',
    tier: 1,
    industry: '電腦硬體',
    country: '美國',
    esgScore: 79,
    riskLevel: 'low',
    riskFactors: [],
    connections: ['self'],
  },
];

// ============================================================================
// Main Component
// ============================================================================

interface EnterpriseGraphProps {
  companyId?: string;
  onNodeClick?: (node: EnterpriseNode) => void;
}

export const EnterpriseGraph: React.FC<EnterpriseGraphProps> = ({
  companyId = 'self',
  onNodeClick,
}) => {
  const [nodes] = useState<EnterpriseNode[]>(MOCK_NODES);
  const [selectedNode, setSelectedNode] = useState<EnterpriseNode | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'supplier' | 'customer'>('all');
  const [showRisksOnly, setShowRisksOnly] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    omniLogger.info(LogCategory.GROWTH, '企業連結圖譜啟動', {
      companyId,
      source_origin: 'EnterpriseGraph.mount',
    });
  }, [companyId]);

  // Filter nodes
  const displayedNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesType =
        filterType === 'all' ||
        (filterType === 'supplier' && (n.type === 'supplier' || n.type === 'self')) ||
        (filterType === 'customer' && (n.type === 'customer' || n.type === 'self'));
      const matchesRisk = !showRisksOnly || n.riskLevel === 'high' || n.riskLevel === 'critical';
      return matchesType && matchesRisk;
    });
  }, [nodes, filterType, showRisksOnly]);

  // Stats
  const stats = useMemo(() => {
    const suppliers = nodes.filter(n => n.type === 'supplier');
    const customers = nodes.filter(n => n.type === 'customer');
    const highRisk = nodes.filter(n => n.riskLevel === 'high' || n.riskLevel === 'critical');
    const avgScore = nodes.reduce((sum, n) => sum + n.esgScore, 0) / nodes.length;
    return {
      suppliers: suppliers.length,
      customers: customers.length,
      highRisk: highRisk.length,
      avgScore,
    };
  }, [nodes]);

  // Get position for node visualization
  const getNodePosition = (node: EnterpriseNode, index: number, total: number) => {
    if (node.type === 'self') return { x: 50, y: 50 };

    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = node.tier === 1 ? 30 : 45;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 border-red-400';
      case 'high':
        return 'bg-orange-500 border-orange-400';
      case 'medium':
        return 'bg-yellow-500 border-yellow-400';
      default:
        return 'bg-green-500 border-green-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'self':
        return 'from-cyan-500 to-blue-500';
      case 'supplier':
        return 'from-purple-500 to-pink-500';
      case 'customer':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-cyan-500/20 neon-border-cyan animate-in relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Network size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">企業連結圖譜</h2>
            <p className="text-sm text-slate-400">供應鏈 ESG 風險視覺化數據矩陣</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.5))}
            className="p-2.5 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-700 transition-all hover:text-white"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))}
            className="p-2.5 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-700 transition-all hover:text-white"
          >
            <ZoomOut size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.suppliers}</p>
          <p className="text-xs text-slate-500">供應商</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.customers}</p>
          <p className="text-xs text-slate-500">客戶</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-red-400">{stats.highRisk}</p>
          <p className="text-xs text-slate-500">高風險</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-cyan-400">{stats.avgScore.toFixed(0)}</p>
          <p className="text-xs text-slate-500">平均 ESG</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
          {['all', 'supplier', 'customer'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as typeof filterType)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'all' ? '全部' : type === 'supplier' ? '供應商' : '客戶'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowRisksOnly(!showRisksOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            showRisksOnly
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <AlertTriangle size={12} />
          僅顯示風險
        </button>
      </div>

      {/* Graph Visualization */}
      <div
        className="relative bg-slate-800/30 rounded-xl overflow-hidden"
        style={{ height: '350px', transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
      >
        {/* Connections (SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {displayedNodes.map(node =>
            node.connections
              .filter(connId => displayedNodes.some(n => n.id === connId))
              .map(connId => {
                const targetNode = displayedNodes.find(n => n.id === connId);
                if (!targetNode) return null;
                const sourcePos = getNodePosition(
                  node,
                  displayedNodes.indexOf(node),
                  displayedNodes.length
                );
                const targetPos = getNodePosition(
                  targetNode,
                  displayedNodes.indexOf(targetNode),
                  displayedNodes.length
                );
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={`${sourcePos.x}%`}
                    y1={`${sourcePos.y}%`}
                    x2={`${targetPos.x}%`}
                    y2={`${targetPos.y}%`}
                    stroke={
                      targetNode.riskLevel === 'high' || targetNode.riskLevel === 'critical'
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(100, 116, 139, 0.2)'
                    }
                    strokeWidth="2"
                  />
                );
              })
          )}
        </svg>

        {/* Nodes */}
        {displayedNodes.map((node, index) => {
          const pos = getNodePosition(node, index, displayedNodes.length);
          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => {
                const trace_id = uuidv4();
                omniLogger.info(LogCategory.GROWTH, `用戶查看企業節點: ${node.name}`, {
                  trace_id,
                  node_id: node.id,
                  type: node.type,
                  riskLevel: node.riskLevel,
                  source_origin: 'EnterpriseGraph.onNodeClick',
                });
                setSelectedNode(node);
                onNodeClick?.(node);
              }}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div
                className={`relative p-3 rounded-xl bg-gradient-to-r ${getTypeColor(node.type)} shadow-lg hover:scale-110 transition-transform`}
              >
                <Building2 size={node.type === 'self' ? 24 : 18} className="text-white" />
                {/* Risk indicator */}
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getRiskColor(node.riskLevel)} border-2 border-slate-900`}
                />
              </div>
              <p className="text-xs text-center text-slate-400 mt-1 max-w-[80px] truncate">
                {node.name.split(' ')[0]}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedNode.name}</h3>
              <p className="text-sm text-slate-400">
                {selectedNode.industry} • {selectedNode.country}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedNode.riskLevel === 'critical'
                  ? 'bg-red-500/20 text-red-400'
                  : selectedNode.riskLevel === 'high'
                    ? 'bg-orange-500/20 text-orange-400'
                    : selectedNode.riskLevel === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
              }`}
            >
              ESG: {selectedNode.esgScore}
            </div>
          </div>

          {selectedNode.riskFactors.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">風險因素</p>
              <div className="flex flex-wrap gap-2">
                {selectedNode.riskFactors.map((factor, idx) => (
                  <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                    ⚠️ {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          本公司
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          供應商
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          客戶
        </span>
      </div>
    </div>
  );
};

export default EnterpriseGraph;
