
import React from 'react';
import { marked } from 'marked';
import { Loader2, Sparkles, Atom, Terminal, Download, Gauge, Activity, Settings } from 'lucide-react';

interface ManifestationWallProps {
    isProcessing: boolean;
    resultText: string | null;
}

export const ManifestationWall: React.FC<ManifestationWallProps> = React.memo(({ isProcessing, resultText }) => {
    return (
        <div className="flex-1 glass-bento bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />
            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0 z-10">
                 <div className="flex items-center gap-3">
                     <Terminal className="w-4 h-4 text-gray-700" />
                     <span className="zh-main text-xs text-white uppercase tracking-widest">Manifestation_Wall</span>
                 </div>
                 <div className="uni-mini !bg-black/60 !text-celestial-gold border-celestial-gold/30 px-3 !text-[7px]">OMNI_L16.1</div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col relative">
                {isProcessing ? (
                    <div className="h-full flex flex-col items-center justify-center gap-6 animate-fade-in relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-celestial-gold animate-spin shadow-2xl" />
                            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-celestial-gold animate-ai-pulse" />
                        </div>
                        <p className="zh-main text-white text-lg tracking-tighter animate-pulse uppercase">Resonating_Dimensions...</p>
                    </div>
                ) : resultText ? (
                    <div className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] animate-fade-in relative shadow-2xl min-h-full">
                        <div className="markdown-body prose prose-invert prose-sm text-gray-300 leading-relaxed font-light">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(resultText) as string }} />
                        </div>
                        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                            <span className="text-[7px] font-mono text-gray-700 tracking-widest">0x8B32F02...</span>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white"><Download className="w-3 h-3"/></button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale text-center select-none">
                        <Atom className="w-32 h-32 text-gray-700 animate-spin-slow mb-6" />
                        <h4 className="zh-main text-4xl text-white uppercase tracking-[0.4em] mb-2">Aeterna_Waiting</h4>
                        <p className="text-gray-600 text-sm font-light italic">"Initiate protocol to manifest truth."</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between shrink-0 relative z-10 px-8">
                 <div className="flex gap-8">
                     <div className="flex flex-col">
                         <span className="text-[7px] font-black text-gray-700 uppercase mb-0.5">Efficiency</span>
                         <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs"><Gauge className="w-2.5 h-2.5"/> 99.4%</div>
                     </div>
                     <div className="flex flex-col">
                         <span className="text-[7px] font-black text-gray-700 uppercase mb-0.5">Latency</span>
                         <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-xs"><Activity className="w-2.5 h-2.5"/> 12ms</div>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="p-2 bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all"><Settings className="w-3.5 h-3.5"/></button>
                 </div>
            </div>
        </div>
    );
});
