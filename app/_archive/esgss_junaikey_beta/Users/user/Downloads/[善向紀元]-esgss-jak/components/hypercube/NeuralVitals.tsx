
import React from 'react';
import {
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { Activity } from 'lucide-react';

interface NeuralVitalsProps {
    radarData: any[];
}

export const NeuralVitals: React.FC<NeuralVitalsProps> = React.memo(({ radarData }) => {
    return (
        <div className="flex-1 glass-bento p-5 bg-slate-950 border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden">
            <h4 className="zh-main text-[9px] text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10"><Activity className="w-3 h-3" /> Neural_Vitals_Heat</h4>
            <div className="flex-1 min-h-0 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.03)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 7, fontWeight: 900 }} />
                        <Radar name="Vitals" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});
