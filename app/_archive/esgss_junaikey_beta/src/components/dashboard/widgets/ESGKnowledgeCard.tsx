import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  FileText,
  Search,
  Lightbulb,
  ArrowRight,
  Activity, // [FIX] Added Activity
  Shield,
  Monitor,
  Check, // [NEW] Added for 4T
} from 'lucide-react';
import { ScrollArea, Badge, Card } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../../styles/liquid-glass.css';

export interface ESGKnowledgeData {
  title: string;
  definition: string;
  formula: {
    expression: string;
    explanation: string;
  };
  relatedUUID?: string; // [Awakening] Link to SSOT
  learningPath?: string; // [Awakening] Next step for the user
  parameters: Array<{
    name: string;
    source: string;
  }>;
  realCase: {
    scenario: string;
    result: string;
  };
  requirements: {
    inputs: string[];
    documents: string[];
  };
}

interface ESGKnowledgeCardProps {
  data: ESGKnowledgeData;
  onClose?: () => void;
}

export const ESGKnowledgeCard: React.FC<ESGKnowledgeCardProps> = ({ data, onClose }) => {
  const { style } = useTheme();

  // IComponentCore Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/widgets/ESGKnowledgeCard.tsx',
      '1.0.0',
      ['ESG', 'Knowledge', '5T-Protocol']
    )
  );

  // Style logic matching Liquid Glass / Optics
  const cardStyle =
    style === 'glass'
      ? 'liquid-glass-strong border-cyan-500/30 text-white'
      : 'bg-white text-slate-900 border-slate-200 shadow-xl';

  const highlightColor = style === 'glass' ? 'text-cyan-400' : 'text-blue-600';
  const dividerColor = style === 'glass' ? 'border-white/10' : 'border-slate-200';

  return (
    <div
      className={`h - full w - full rounded - 2xl border ${cardStyle} overflow - hidden flex flex - col relative animate -in slide -in -from - right - 10 duration - 500`}
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      {/* Header */}
      <div
        className={`p - 5 border - b ${dividerColor} flex justify - between items - center bg - gradient - to - r from - transparent via - cyan - 500 / 5 to - transparent`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <BookOpen className={`w - 5 h - 5 ${highlightColor} `} />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none">ESG 善向堂</h2>
            <span className={`text - xs opacity - 60 font - mono mt - 1 block`}>{data.title}</span>
          </div>
        </div>
        {/* 4T Compliance Badges */}
        <div className="flex gap-1 items-center">
          {data.relatedUUID && (
            <Badge
              variant="outline"
              className="text-[8px] h-5 border-amber-500/30 text-amber-400 bg-amber-500/5 gap-1 animate-pulse"
            >
              <Activity size={8} /> LIVE TRUTH
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-[8px] h-5 border-blue-500/30 text-blue-400 bg-blue-500/5 gap-1"
          >
            <Monitor size={8} /> TRANSPARENCY
          </Badge>
          <Badge
            variant="outline"
            className="text-[8px] h-5 border-purple-500/30 text-purple-400 bg-purple-500/5 gap-1"
          >
            <Shield size={8} /> TRUST
          </Badge>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors ml-2"
          >
            <ArrowRight className="w-4 h-4 opacity-50" />
          </button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* 1. Definition */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
              <Lightbulb size={12} /> 定義 (Definition)
            </h3>
            <p className="text-sm leading-relaxed opacity-90 p-3 rounded-lg bg-white/5 border border-white/5">
              {data.definition}
            </p>
          </section>

          {/* 2. Formula & Explanation */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
              <Calculator size={12} /> 重點公式 & 解釋
            </h3>
            <div
              className={`p - 4 rounded - xl border ${style === 'glass' ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-slate-50 border-slate-200'} `}
            >
              <code
                className={`block text - center font - mono text - sm font - bold mb - 3 ${highlightColor} `}
              >
                {data.formula.expression}
              </code>
              <p className="text-xs opacity-70 border-t border-dashed border-white/10 pt-3">
                <span className="font-bold">解釋：</span> {data.formula.explanation}
              </p>
            </div>
          </section>

          {/* 3. Parameters & Sources (The "Where to find") */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
              <Search size={12} /> 主要數據參數 & 來源
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {data.parameters.map((param, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 rounded border border-white/5 hover:bg-white/5 transition-colors"
                >
                  <span className="font-mono text-xs font-bold">{param.name}</span>
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    👉 <span className="underline decoration-dashed">{param.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Real Case */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
              <Activity size={12} /> 真實案例 (Real Case)
            </h3>
            <div className="relative p-4 rounded-lg overflow-hidden group">
              <div
                className={`absolute inset - 0 opacity - 10 ${style === 'glass' ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-slate-200'} `}
              />
              <p className="relative text-sm font-medium z-10 mb-2">"{data.realCase.scenario}"</p>
              <div className="relative flex items-center gap-2 z-10">
                <ArrowRight size={12} className="text-green-500" />
                <span className="text-xs font-mono text-green-400 font-bold">
                  {data.realCase.result}
                </span>
              </div>
            </div>
          </section>

          {/* 5. Requirements (Inputs/Docs) */}
          <section className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <h4 className="text-[10px] uppercase font-bold opacity-50 mb-2">輸入欄位</h4>
              <div className="flex flex-wrap gap-1">
                {data.requirements.inputs.map(input => (
                  <Badge key={input} variant="outline" className="text-[9px] h-5">
                    {input}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <h4 className="text-[10px] uppercase font-bold opacity-50 mb-2">可上傳單據</h4>
              <div className="flex flex-wrap gap-1">
                {data.requirements.documents.map(doc => (
                  <Badge
                    key={doc}
                    variant="secondary"
                    className="text-[9px] h-5 flex items-center gap-1"
                  >
                    <FileText size={8} /> {doc}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};
