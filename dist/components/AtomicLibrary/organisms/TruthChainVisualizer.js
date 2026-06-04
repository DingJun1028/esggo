"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruthChainVisualizer = TruthChainVisualizer;
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const getNodeIcon = (type) => {
    switch (type) {
        case 'EVIDENCE': return <lucide_react_1.FileText className="w-5 h-5"/>;
        case 'POLICY': return <lucide_react_1.ShieldCheck className="w-5 h-5"/>;
        case 'MEMORY': return <lucide_react_1.Database className="w-5 h-5"/>;
        case 'STAKEHOLDER_EXPECTATION': return <lucide_react_1.Users className="w-5 h-5"/>;
        case 'SIMULATION': return <lucide_react_1.Cpu className="w-5 h-5"/>;
        default: return <lucide_react_1.FileText className="w-5 h-5"/>;
    }
};
const getNodeColor = (type) => {
    switch (type) {
        case 'EVIDENCE': return 'border-cyan-400/50 text-cyan-300 bg-cyan-900/20';
        case 'POLICY': return 'border-emerald-400/50 text-emerald-300 bg-emerald-900/20';
        case 'MEMORY': return 'border-purple-400/50 text-purple-300 bg-purple-900/20';
        case 'STAKEHOLDER_EXPECTATION': return 'border-amber-400/50 text-amber-300 bg-amber-900/20';
        case 'SIMULATION': return 'border-blue-400/50 text-blue-300 bg-blue-900/20';
        default: return 'border-gray-400/50 text-gray-300 bg-gray-900/20';
    }
};
function TruthChainVisualizer({ graph, className = '' }) {
    if (!graph || graph.nodes.length === 0) {
        return (<div className={`p-8 flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md ${className}`}>
        <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">No Truth Chain Data Available</p>
      </div>);
    }
    // Find evidence node as root
    const evidenceNode = graph.nodes.find(n => n.type === 'EVIDENCE');
    const otherNodes = graph.nodes.filter(n => n.type !== 'EVIDENCE');
    return (<div className={`relative p-6 md:p-10 rounded-2xl border border-white/10 bg-[#020617]/80 backdrop-blur-xl overflow-hidden ${className}`}>
      {/* Background Glows (Layer 0) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"/>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
            <lucide_react_1.Lock className="w-5 h-5 text-cyan-400"/>
            TRUTH CHAIN / 真理鏈條
          </h3>
          <div className="flex gap-2">
             <span className="px-2 py-1 rounded-md text-xs font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
               HASH_LOCK_ACTIVE
             </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-8">
          {/* Central Evidence Node */}
          {evidenceNode && (<framer_motion_1.motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-20">
              <div className={`flex flex-col items-center p-6 rounded-xl border-2 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] backdrop-blur-md min-w-[280px] ${getNodeColor(evidenceNode.type)}`}>
                <div className="p-3 bg-cyan-500/20 rounded-full mb-4">
                  {getNodeIcon(evidenceNode.type)}
                </div>
                <h4 className="font-bold text-lg mb-1">{evidenceNode.label}</h4>
                <p className="text-xs font-mono text-cyan-200/70 mb-3">ID: {evidenceNode.id.substring(0, 8)}...</p>
                
                {evidenceNode.hash_lock && (<div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-md border border-cyan-500/30 w-full justify-center">
                    <lucide_react_1.Lock className="w-3 h-3 text-cyan-400"/>
                    <span className="text-xs font-mono text-cyan-400 truncate max-w-[150px]">
                      {evidenceNode.hash_lock}
                    </span>
                  </div>)}
              </div>
            </framer_motion_1.motion.div>)}

          {/* Connectors and Surrounding Nodes */}
          {otherNodes.length > 0 && (<div className="flex flex-col gap-6 relative z-10 w-full md:w-auto">
               {/* Link Lines (Simulated in Flex for simplicity, in a real complex graph D3/ReactFlow would be used) */}
               <div className="hidden md:block absolute left-[-48px] top-1/2 -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"/>
               
               {otherNodes.map((node, idx) => {
                const edge = graph.edges.find(e => e.target === node.id || e.source === node.id);
                return (<framer_motion_1.motion.div key={node.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * (idx + 1) }} className="relative flex items-center gap-4">
                     {/* Connector line for mobile */}
                     <div className="md:hidden absolute top-[-24px] left-1/2 w-0.5 h-6 bg-gradient-to-b from-cyan-500/50 to-transparent"/>
                     
                     <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-800 z-10">
                       <lucide_react_1.Link className="w-3 h-3 text-slate-500"/>
                     </div>
                     
                     <div className={`flex flex-col p-4 rounded-lg border backdrop-blur-sm min-w-[240px] flex-1 ${getNodeColor(node.type)}`}>
                       <div className="flex items-center gap-3 mb-2">
                         {getNodeIcon(node.type)}
                         <span className="text-xs font-semibold tracking-wider opacity-80">{node.type}</span>
                       </div>
                       <h4 className="font-medium text-sm text-white">{node.label}</h4>
                       
                       {edge && (<div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                           <span className="text-[10px] font-mono opacity-60 uppercase">{edge.label}</span>
                           <span className="text-[10px] font-mono text-emerald-400">{(edge.strength * 100).toFixed(0)}% Match</span>
                         </div>)}
                     </div>
                   </framer_motion_1.motion.div>);
            })}
             </div>)}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=TruthChainVisualizer.js.map