import React, { useEffect, useState, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Share2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Info,
  Database,
  Cpu,
  Search,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
} from 'lucide-react';
import { OmniKnowledge } from '../../omni/infrastructure/knowledge/OmniKnowledge';
import { useOmniMemory } from '../../omni/infrastructure/memory/OmniMemory';
import { KnowledgeNode, KnowledgeGraph } from '../../types/knowledge';
import { OllamaService } from '../../services/OllamaService';

interface GraphNode extends KnowledgeNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const KnowledgeGraphViewer: React.FC = () => {
  const { palace } = useOmniMemory();
  const conceptWeights = palace.theVault.conceptWeights;

  const [graphData, setGraphData] = useState<KnowledgeGraph>({ nodes: new Map(), edges: [] });
  const [renderNodes, setRenderNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<KnowledgeNode & { similarity: number }>>(
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const weightsRef = useRef(palace.theVault.conceptWeights);

  // Sync ref with state for animation loop
  useEffect(() => {
    weightsRef.current = palace.theVault.conceptWeights;
  }, [palace.theVault.conceptWeights]);

  const animationRef = useRef<number | undefined>(undefined);

  // Initial Load
  useEffect(() => {
    refreshGraph();
    return () => {
      if (typeof animationRef.current === 'number') {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const refreshGraph = () => {
    const rawGraph = OmniKnowledge.getKnowledgeGraph();
    setGraphData(rawGraph);

    // Convert Map to Array and initialize physics positions
    const nodes: GraphNode[] = Array.from(rawGraph.nodes.values()).map(node => ({
      ...node,
      x: Math.random() * 800, // Canvas width
      y: Math.random() * 600, // Canvas height
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    setRenderNodes(nodes);
    startSimulation();
  };

  const startSimulation = () => {
    if (typeof animationRef.current === 'number') {
      cancelAnimationFrame(animationRef.current);
    }

    const tick = () => {
      setRenderNodes(prevNodes => {
        return prevNodes.map(node => {
          // Dynamic physics based on weight
          const weight = weightsRef.current[node.label] || 0;
          const mass = 1 + weight * 0.5; // Heavier nodes move slower? Or just have more momentum?
          // Let's say heavy nodes resist velocity change (inertia) but we are just doing position updates here.
          // If we want "heavier move slower", we can dampen velocity.

          let { x, y, vx, vy } = node;

          // Apply some "breath" or random fluctuation to make it look alive
          // const breath = Math.sin(Date.now() / 1000) * (weight * 0.1);

          x += vx / mass; // Heavier nodes move effectively slower for same momentum
          y += vy / mass;

          if (x < 0 || x > 800) vx *= -1;
          if (y < 0 || y > 600) vy *= -1;

          // Dampening
          // vx *= 0.99;
          // vy *= 0.99;

          return { ...node, x, y, vx, vy };
        });
      });
      animationRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await OmniKnowledge.semanticSearchNodes(searchQuery, 5);
      setSearchResults(results);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[KnowledgeGraphViewer] Semantic search failed:', { error })
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 h-[700px]">
      {/* Graph Visualization Area */}
      <div className="lg:col-span-3 bg-black/80 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Network className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Omni-Mind Network</h3>
              <p className="text-xs text-cyan-500/70 font-mono">Neural Knowledge Topology</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 hover:bg-white/10 rounded-lg text-cyan-400"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 self-center font-mono">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 hover:bg-white/10 rounded-lg text-cyan-400"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={refreshGraph}
              className="p-2 hover:bg-white/10 rounded-lg text-cyan-400"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 語義搜索框 */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSemanticSearch()}
              placeholder="語義搜索知識節點（使用 Ollama）..."
              className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          </div>
          <button
            onClick={handleSemanticSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            {isSearching ? '搜索中...' : '搜索'}
          </button>
        </div>

        {/* 搜索結果 */}
        {searchResults.length > 0 && (
          <div className="mb-4 p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg max-h-32 overflow-y-auto">
            <div className="text-xs text-purple-300 mb-2">
              找到 {searchResults.length} 個相似節點：
            </div>
            {searchResults.map((result, idx) => (
              <div key={idx} className="text-xs text-gray-300 mb-1 flex items-center gap-2">
                <span className="text-purple-400">{(result.similarity * 100).toFixed(0)}%</span>
                <span>{result.label}</span>
              </div>
            ))}
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/5 relative overflow-hidden cursor-crosshair"
        >
          {/* Render Nodes */}
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            {renderNodes.map(node => {
              // Dynamic weighting
              const weight = conceptWeights[node.label] || 0;
              const baseSize = 3; // w-3 is 0.75rem ~ 12px, let's say radius 6? Tailwind w-3 is 12px.
              // We'll use style width/height for dynamic size
              const size = 12 + weight * 5;
              const isSelected = selectedNode?.id === node.id;

              return (
                <motion.div
                  key={node.id}
                  layoutId={node.id}
                  className={`absolute rounded-full cursor-pointer transition-all duration-300
                                    ${
                                      isSelected
                                        ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10'
                                        : node.type === 'entity'
                                          ? 'bg-purple-500'
                                          : 'bg-blue-500'
                                    }
                                `}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: node.confidence,
                    boxShadow:
                      weight > 0
                        ? `0 0 ${15 + weight * 20}px ${node.type === 'entity' ? 'rgba(168,85,247,0.8)' : 'rgba(34,211,238,0.8)'}`
                        : undefined,
                    transition:
                      'width 0.5s ease-out, height 0.5s ease-out, box-shadow 0.5s ease-out',
                  }}
                  onClick={() => handleNodeClick(node)}
                  whileHover={{ scale: 1.2 }}
                />
              );
            })}
          </div>

          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="lg:col-span-1 bg-gray-900/50 border border-white/10 rounded-2xl p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-gray-400 border-b border-white/10 pb-4">
          <Database className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Node Inspector</span>
        </div>

        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key="node-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <div className="text-[10px] text-cyan-500 font-mono mb-1">{selectedNode.id}</div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedNode.label}</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    selectedNode.type === 'entity'
                      ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                      : 'border-blue-500 text-blue-400 bg-blue-500/10'
                  } uppercase font-bold`}
                >
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Confidence Score
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${selectedNode.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-cyan-400">
                      {(selectedNode.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.sources.map(src => (
                      <span
                        key={src}
                        className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-300"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">Raw Properties</h4>
                  <pre className="text-[10px] text-gray-500 font-mono bg-black/40 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedNode.properties, null, 2)}
                  </pre>
                </div>

                {/* 5T Logic Gate Inspector */}
                {selectedNode.core && (
                  <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/30">
                    <div className="text-xs text-cyan-400 mb-2 flex items-center gap-1 font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> 5T Logic Gate Status
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Trustworthy</span>
                        <span className="text-cyan-300 flex items-center gap-1">
                          {selectedNode.core.status === 'Trustworthy' ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Unlock className="w-3 h-3" />
                          )}
                          {selectedNode.core.status}
                        </span>
                      </div>
                      {selectedNode.core.evidence?.logicGate && (
                        <div className="grid grid-cols-1 gap-1 mt-2 pl-2 border-l border-cyan-500/20">
                          {Object.entries(selectedNode.core.evidence.logicGate).map(([k, v]) => (
                            <div key={k} className="flex flex-col">
                              <span className="text-[10px] text-gray-500 uppercase">{k}</span>
                              <span className="text-[10px] text-cyan-200 font-mono truncate">
                                {String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 opacity-50">
              <Share2 className="w-12 h-12 stroke-[1]" />
              <p className="text-sm text-center">
                Select a node from the neural network to analyze its semantic properties.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
