
import React from 'react';
import { Activity } from 'lucide-react';

interface Core {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
}

interface CoreOrchestrationProps {
    cores: Core[];
    synergyChain: string[];
    updateSynergyChain: (coreId: string) => void;
}

export const CoreOrchestration: React.FC<CoreOrchestrationProps> = React.memo(({ cores, synergyChain, updateSynergyChain }) => {
    return (
        <div className="h-[200px] glass-bento p-5 bg-slate-900/60 border-white/10 rounded-3xl flex flex-col shadow-xl shrink-0">
            <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4 flex justify-between">CORE_ORCHESTRATION <Activity className="w-3 h-3 text-emerald-500"/></h4>
            <div className="grid grid-cols-2 gap-2 flex-1 items-center">
                {cores.map(core => (
                    <button 
                        key={core.id} 
                        onClick={() => updateSynergyChain(core.id)}
                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${synergyChain.includes(core.id) ? 'bg-white/10 border-white/30 scale-[1.03] shadow-lg' : 'bg-black/20 border-white/5 opacity-30 grayscale'}`}
                    >
                        <core.icon className={`w-4 h-4 ${core.color}`} />
                        <span className="text-[7px] font-black text-gray-500 uppercase">{core.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});
