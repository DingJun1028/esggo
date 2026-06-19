import React, { useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
    AlertCircle, CheckCircle2, FileSpreadsheet, Activity, PieChart as PieIcon, 
    BarChart3, Info, Star, ShieldCheck, ArrowRight, Zap, AlertTriangle,
    MousePointer2, Globe, Target, Layers, FileText
} from 'lucide-react';
import { marked } from 'marked';

interface UIBlock {
  type: 'chart' | 'table' | 'status' | 'matrix' | 'report_summary' | 'talent_matrix' | 'advisory_card';
  chartType?: 'area' | 'bar' | 'pie' | 'radar';
  title?: string;
  description?: string;
  data: any;
  config?: any;
}

interface GenerativeUIRendererProps {
    content: string;
    onSelectResult?: (result: any) => void;
}

const COLORS = ['#10b981', '#fbbf24', '#8b5cf6', '#3b82f6', '#f43f5e'];

const AdvisoryCardRenderer: React.FC<{ data: any }> = ({ data }) => (
    <div className="w-full my-6 glass-panel p-6 rounded-[2rem] border border-celestial-gold/30 bg-celestial-gold/[0.03] animate-fade-in group">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-celestial-gold/20 rounded-2xl text-celestial-gold"><Target className="w-6 h-6" /></div>
                <div>
                    <h4 className="zh-main text-lg text-white">{data.tool_name}</h4>
                    <span className="en-sub">ADVISORY_OUTPUT_v15</span>
                </div>
            </div>
            <div className="uni-mini bg-black/40 text-celestial-gold border-celestial-gold/20">CONFIDENCE: {data.confidence}%</div>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed mb-6 italic">"{data.executive_summary}"</p>
        <div className="grid grid-cols-2 gap-4">
            {data.recommendations.map((rec: string, i: number) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-gray-400">{rec}</span>
                </div>
            ))}
        </div>
    </div>
);

const TalentMatrixRenderer: React.FC<{ data: any, onSelect?: (res: any) => void }> = ({ data, onSelect }) => {
    const matrix = data?.Talent_Sustainability_Matrix || data;
    if (!matrix) return null;

    const radarData = Object.entries(matrix.Global_Average_Alignment || {}).map(([key, value]) => ({
        subject: key,
        A: typeof value === 'string' ? parseInt(value.replace('%', '')) : value,
        fullMark: 100,
    }));

    return (
        <div className="w-full my-8 space-y-6 animate-fade-in relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/50">
                    <h4 className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.2em] mb-4">Global Alignment Radar</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Radar name="Average" dataKey="A" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.5} />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/50 flex flex-col justify-center">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">Alignment Summary</h4>
                    <div className="space-y-4">
                        {Object.entries(matrix.Global_Average_Alignment || {}).map(([key, val]: [string, any]) => (
                            <div key={key}>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-gray-400">{key}</span>
                                    <span className="text-white font-mono">{val}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: val }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = React.memo(({ content, onSelectResult }) => {
    const renderedParts = useMemo(() => {
        const suggestionsRegex = /<suggestions>[\s\S]*?<\/suggestions>/g;
        const strippedContent = content.replace(suggestionsRegex, '');
        
        const jsonBlockRegex = /```json_ui\n([\s\S]*?)\n```/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = jsonBlockRegex.exec(strippedContent)) !== null) {
            if (match.index > lastIndex) {
                const textSegment = strippedContent.substring(lastIndex, match.index);
                if (textSegment.trim()) {
                    parts.push(
                        <div 
                            key={`text-${lastIndex}`} 
                            className="markdown-body prose prose-invert prose-sm max-w-none mb-6" 
                            dangerouslySetInnerHTML={{ __html: marked.parse(textSegment) as string }} 
                        />
                    );
                }
            }
            try {
                const uiData = JSON.parse(match[1]);
                if (uiData?.type === 'advisory_card') {
                    parts.push(<AdvisoryCardRenderer key={`advisory-${match.index}`} data={uiData} />);
                } else if (uiData?.type === 'talent_matrix') {
                    parts.push(<TalentMatrixRenderer key={`talent-${match.index}`} data={uiData} />);
                }
            } catch (e) { console.error("UI Parsing Error", e); }
            lastIndex = jsonBlockRegex.lastIndex;
        }

        if (lastIndex < strippedContent.length) {
            const remaining = strippedContent.substring(lastIndex);
            if (remaining.trim()) {
                parts.push(
                    <div 
                        key="text-end" 
                        className="markdown-body prose prose-invert prose-sm max-w-none mt-4" 
                        dangerouslySetInnerHTML={{ __html: marked.parse(remaining) as string }} 
                    />
                );
            }
        }
        return parts;
    }, [content]);

    return <div className="w-full space-y-4">{renderedParts}</div>;
});

export default GenerativeUIRenderer;