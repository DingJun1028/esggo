"use client";

import { Sparkles, HelpCircle, Target, Footprints } from "lucide-react";
import { motion } from "framer-motion";

interface WhyWhatHowProps {
    why: string;
    what: string;
    how: string;
    dataSources: string[];
}

export function WhyWhatHow({ why, what, how, dataSources }: WhyWhatHowProps) {
    return (
        <div className="space-y-4">
            <div className="p-5 rounded-lg bg-stitch-teal-start/5 border border-stitch-teal-start/10 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-stitch-teal-start" />
                    <h4 className="font-black text-stitch-text">?祈?? 蝡???</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">
                            <HelpCircle className="w-3 h-3" /> Why (?箔?暻潸?撖?
                        </div>
                        <p className="text-xs text-stitch-muted leading-relaxed">{why}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">
                            <Target className="w-3 h-3" /> What (閬神隞暻?
                        </div>
                        <p className="text-xs text-stitch-muted leading-relaxed">{what}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">
                            <Footprints className="w-3 h-3" /> How (?獐撖急???
                        </div>
                        <p className="text-xs text-stitch-muted leading-relaxed">{how}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-stitch-shallow-gray/50 border border-stitch-border">
                <h5 className="text-[10px] font-bold text-stitch-muted mb-2 uppercase tracking-widest">???豢??格? (Data Sources)</h5>
                <div className="flex flex-wrap gap-2">
                    {dataSources.map((source, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-white border border-stitch-border text-[10px] text-stitch-text font-medium">
                            {source}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

