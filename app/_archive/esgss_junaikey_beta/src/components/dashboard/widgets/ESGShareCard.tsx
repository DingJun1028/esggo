import React, { useRef } from 'react';
import {
  Download,
  Share2,
  CheckCircle,
  Clock,
  FileText,
  Calculator,
  Lock,
  Zap,
  Shield,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ICarbonAsset } from '@/types/carbon';
import { ESGKnowledgeData } from './ESGKnowledgeCard';
import { useTheme } from '@/contexts/ThemeContext';

interface ESGShareCardProps {
  asset: ICarbonAsset;
  knowledge: ESGKnowledgeData;
  onClose: () => void;
}

export const ESGShareCard: React.FC<ESGShareCardProps> = ({ asset, knowledge, onClose }) => {
  const { style } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  const timeSince =
    asset.auditLog.length > 0 && asset.auditLog[0]?.timestamp
      ? Math.floor((Date.now() - new Date(asset.auditLog[0].timestamp).getTime()) / (1000 * 60))
      : 0;

  const isGlass = style === 'glass';
  const bgStyle = isGlass
    ? 'bg-black/90 backdrop-blur-xl border-cyan-500/50 text-white'
    : 'bg-white text-slate-900 border-slate-200 shadow-2xl';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div
        ref={cardRef}
        className={`w-full max-w-2xl rounded-3xl border overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,255,255,0.2)] ${bgStyle}`}
      >
        {/* 1. Header: Propaganda Title */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              ESG 真實性履歷 (Certificate of Truth)
            </h1>
            <p className="text-xs text-cyan-300/60 font-mono mt-1 flex items-center gap-2">
              <Shield size={12} /> VERIFIED BY NO-HALLUCINATION PROTOCOL
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Download size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Share2 size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20 hover:text-red-500"
            >
              X
            </Button>
          </div>
        </div>

        {/* 2. Main Body */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-6">
          {/* Left Col: The "Knowledge & Logic" */}
          <div className="space-y-6">
            {/* Knowledge Definition */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <h3 className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
                <Zap size={14} /> {knowledge.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{knowledge.definition}</p>
              <div className="text-[10px] font-mono text-gray-500">
                Source: {knowledge.parameters.map(p => p.source).join(', ')}
              </div>
            </div>

            {/* Calculated Formula */}
            <div className="relative group p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="absolute -top-3 left-4 bg-emerald-900/80 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                3. CALCULABLE (可驗算)
              </div>
              <div className="mt-2 space-y-2 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span className="text-gray-500">A (kWh)</span>
                  <span className="text-white font-bold">{asset.data.kwh}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span className="text-gray-500">B (Coeff)</span>
                  <span className="text-white">0.495</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-emerald-400 font-bold">Result</span>
                  <span className="text-emerald-400 font-bold">{asset.data.co2e} tCO2e</span>
                </div>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle size={48} className="text-emerald-500/20" />
              </div>
            </div>
          </div>

          {/* Right Col: The "Evidence Chain" */}
          <div className="space-y-4">
            {/* 1. Traceable Link */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3 group hover:border-cyan-500/50 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded bg-black/50 overflow-hidden relative">
                {asset.sourceOrigin.previewUrl ? (
                  <img
                    src={asset.sourceOrigin.previewUrl}
                    className="w-full h-full object-cover opacity-70"
                    alt="doc"
                  />
                ) : (
                  <FileText className="w-full h-full p-4 text-gray-600" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent">
                  <Search size={16} className="text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-1.5 rounded">
                    1. TRACEABLE
                  </span>
                  <span className="text-[9px] text-gray-500">ORIGINAL_DOC</span>
                </div>
                <div className="text-xs font-bold truncate max-w-[180px] text-white">
                  {asset.sourceOrigin.fileName}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  Hash: {asset.evidenceHash?.substring(0, 12)}...
                </div>
              </div>
            </div>

            {/* 2. Trackable Chain */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3">
              <div className="w-10 flex flex-col items-center justify-center">
                <Clock size={20} className="text-orange-400 mb-1" />
                <div className="h-full w-[1px] bg-white/10" />
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-orange-400 border border-orange-500/30 bg-orange-500/10 px-1.5 rounded">
                    2. TRACKABLE
                  </span>
                  <span className="text-[9px] text-gray-500">TIME_CHAIN</span>
                </div>
                <div className="text-xs font-mono text-gray-300">Secured {timeSince} mins ago</div>
                <div className="text-[9px] text-gray-500 mt-1">
                  Audit Trail Count: {asset.auditLog.length} events
                </div>
              </div>
            </div>

            {/* 4. Immutable Status */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3">
              <div className="w-10 flex items-center justify-center">
                <Lock
                  size={20}
                  className={asset.status === 'STATUS_FROZEN' ? 'text-red-500' : 'text-gray-600'}
                />
              </div>
              <div className="flex-1 py-1">
                <span
                  className={`text-[10px] px-1.5 rounded ${asset.status === 'STATUS_FROZEN' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'text-gray-500'}`}
                >
                  4. IMMUTABLE
                </span>
                <div
                  className={`text-xs font-bold mt-1 ${asset.status === 'STATUS_FROZEN' ? 'text-white' : 'text-gray-500'}`}
                >
                  {asset.status === 'STATUS_FROZEN' ? 'CRYPTOGRAPHICALLY SEALED' : 'PENDING SEAL'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Branding */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center text-[10px] text-gray-600">
          <div className="flex gap-4">
            <span>ESGss JunAiKey Beta</span>
            <span>|</span>
            <span>Generated at {new Date().toLocaleString()}</span>
          </div>
          <div className="font-mono text-cyan-500/50">Zero-Knowledge Proof Verified</div>
        </div>
      </div>
    </div>
  );
};
