import React, { Suspense } from 'react';
import { GlobeViz } from './GlobeViz';
import { Loader2, Globe, Activity, Server, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const PlanetaryMeshView: React.FC = () => {
    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
            {/* 3D Globe Layer */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center text-cyan-400">
                        <Loader2 className="animate-spin mr-2" /> Initializing Planetary Mesh...
                    </div>
                }>
                    <GlobeViz />
                </Suspense>
            </div>

            {/* HUD Overlay - Top Left */}
            <div className="absolute top-6 left-6 z-10">
                <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-6 rounded-xl shadow-2xl max-w-sm">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                        <Globe className="text-cyan-400" />
                        Planetary Mesh
                    </h1>
                    <p className="text-slate-400 text-sm mb-4">
                        Real-time visualization of the Global ESG Node Network.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                <Server size={16} />
                                <span className="text-xs font-mono uppercase">Active Nodes</span>
                            </div>
                            <div className="text-2xl font-bold text-white">1,024</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 text-amber-400 mb-1">
                                <Zap size={16} />
                                <span className="text-xs font-mono uppercase">Throughput</span>
                            </div>
                            <div className="text-2xl font-bold text-white">45 TB/s</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HUD Overlay - Bottom Right (System Status) */}
            <div className="absolute bottom-6 right-6 z-10">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 p-4 w-64">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">System Health</span>
                        <Activity size={16} className="text-emerald-400" />
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>Stabilized</span>
                        <span>98%</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};
