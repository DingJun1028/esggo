"use client";

import React from "react";
import { motion } from "framer-motion";
import { OMNI_SERVICES, ESGDimension, ServiceStatus } from "@/config/omni-services";
import {
    CheckCircle2,
    Zap,
    Construction,
    Clock,
    ExternalLink
} from "lucide-react";

const GET_STATUS_ICON = (status: ServiceStatus) => {
    switch (status) {
        case 'ACTIVE': return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
        case 'BETA': return <Zap className="w-3 h-3 text-amber-500 animate-pulse" />;
        case 'DEVELOPMENT': return <Construction className="w-3 h-3 text-blue-500" />;
        case 'PLANNED': return <Clock className="w-3 h-3 text-slate-300" />;
    }
};

const GET_DIMENSION_COLOR = (dim: ESGDimension) => {
    switch (dim) {
        case 'E': return "bg-emerald-500";
        case 'S': return "bg-indigo-500";
        case 'G': return "bg-slate-500";
    }
};

const GET_DIMENSION_TEXT = (dim: ESGDimension) => {
    switch (dim) {
        case 'E': return "Environment";
        case 'S': return "Social";
        case 'G': return "Governance";
    }
};

export const OmniServicePath: React.FC = () => {
    const categories: ESGDimension[] = ['E', 'S', 'G'];

    return (
        <div className="space-y-8">
            {categories.map((dim) => (
                <div key={dim} className="space-y-4">
                    <div className="flex justify-between items-center pr-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${GET_DIMENSION_COLOR(dim)}`} />
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {GET_DIMENSION_TEXT(dim)} Path
                            </h5>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300">
                            {OMNI_SERVICES.filter(s => s.dimension === dim && s.status === 'ACTIVE').length} / 8 Active
                        </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {OMNI_SERVICES.filter(s => s.dimension === dim).map((service, idx) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.1, zIndex: 20 }}
                                className="relative group"
                            >
                                <div className={`aspect-square rounded-xl border ${service.status === 'ACTIVE' ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'} flex items-center justify-center transition-all cursor-pointer hover:shadow-lg hover:shadow-[#63a6b0]/10`}>
                                    <div className={`w-2 h-2 rounded-full ${service.status === 'ACTIVE' ? GET_DIMENSION_COLOR(dim) : 'bg-slate-200'} transition-transform group-hover:scale-125`} />

                                    {/* Status Badge */}
                                    <div className="absolute -top-1 -right-1">
                                        {GET_STATUS_ICON(service.status)}
                                    </div>
                                </div>

                                {/* Tooltip / Popover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 transform scale-95 group-hover:scale-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[8px] font-black text-[#63a6b0] uppercase tracking-tighter">
                                            {service.id} · {service.status}
                                        </span>
                                        <ExternalLink size={10} className="text-white/20" />
                                    </div>
                                    <h6 className="text-xs font-black mb-1">{service.nameZh}</h6>
                                    <p className="text-[9px] text-slate-400 leading-tight">
                                        {service.description}
                                    </p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>實作完成率: 100%</span>
                <span className="text-[#63a6b0]">Status: All Systems Operational</span>
            </div>
        </div>
    );
};
