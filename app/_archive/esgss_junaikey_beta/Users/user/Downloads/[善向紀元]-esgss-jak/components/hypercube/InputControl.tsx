
import React from 'react';
import { Loader2, Zap, Flame, BrainCircuit } from 'lucide-react';
import { LabAction, LabState } from '../../hooks/useHypercubeLab';
import { universalIntelligence } from '../../services/evolutionEngine';

interface InputControlProps {
    prompt: string;
    activeTool: LabState['activeTool'];
    isProcessing: boolean;
    vitals: LabState['vitals'];
    handleExecute: () => void;
    dispatch: React.Dispatch<LabAction>;
}

export const InputControl: React.FC<InputControlProps> = React.memo(({
    prompt,
    activeTool,
    isProcessing,
    vitals,
    handleExecute,
    dispatch
}) => {
    return (
        <div className="flex-1 glass-bento p-6 bg-slate-900/40 border-white/5 rounded-[2.2rem] shadow-2xl flex flex-col gap-4 min-h-0">
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-celestial-gold" /> Shard_Intent</label>
                 <textarea 
                    value={prompt} 
                    onChange={e => dispatch({ type: 'SET_PROMPT', payload: e.target.value })} 
                    className="w-full flex-1 bg-black/60 border border-white/10 rounded-2xl p-4 text-[11px] text-white focus:border-celestial-gold outline-none resize-none shadow-inner leading-relaxed" 
                    placeholder="描述顯化意圖..." 
                />
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all shrink-0">
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Manifest_Type</span>
                 <select 
                    value={activeTool} 
                    onChange={e => dispatch({ type: 'SET_ACTIVE_TOOL', payload: e.target.value as 'image' | 'video' | 'intel' })} 
                    className="bg-transparent text-[9px] text-white font-bold outline-none cursor-pointer"
                >
                    <option value="intel">AI_Analysis</option>
                    <option value="image">Forge_Image</option>
                 </select>
            </div>
            <button 
                onClick={handleExecute} 
                disabled={isProcessing || !prompt.trim()} 
                className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest shadow-xl hover:bg-celestial-gold active:scale-95 disabled:opacity-30 shrink-0"
            >
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Zap className="w-3.5 h-3.5"/>} EXECUTE_PROTOCOL
            </button>
            <button 
                onClick={() => universalIntelligence.triggerEvolution()} 
                disabled={vitals?.isEvolving} 
                className="w-full py-3 bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest shadow-xl hover:bg-emerald-400 active:scale-95 disabled:opacity-30 shrink-0"
            >
                <Flame className="w-3 h-3"/> HYPERCUBE_EVO_START
            </button>
        </div>
    );
});
