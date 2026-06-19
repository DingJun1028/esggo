import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Shield, Database, BarChart3, Globe, AlertTriangle } from 'lucide-react';
import { stressTestService, IStressMetrics } from '../../services/StressTestService';

const OmniStressUI: React.FC = () => {
    const [metrics, setMetrics] = useState<IStressMetrics>(stressTestService.getMetrics());
    const [isRunning, setIsRunning] = useState(stressTestService.getStatus());
    const [isMeshSim, setIsMeshSim] = useState(false);
    const [batchSize, setBatchSize] = useState(10);
    const [interval, setIntervalVal] = useState(1000);

    useEffect(() => {
        const unsubscribe = stressTestService.subscribe((update) => {
            setMetrics(update);
            setIsRunning(stressTestService.getStatus());
        });
        return unsubscribe;
    }, []);

    const toggleFoundry = () => {
        if (isRunning) {
            stressTestService.coolDown();
        } else {
            stressTestService.igniteFoundry(batchSize, interval);
        }
    };

    const toggleMeshSim = () => {
        const newState = !isMeshSim;
        setIsMeshSim(newState);
        stressTestService.simulateMeshCongestion(newState, 0.5);
    };

    return (
        <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700 text-white min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-cyan-400" />
                        Omni-Stress Command Center
                    </h2>
                    <p className="text-slate-400 text-sm">Planetary Mesh Performance Analysis</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={toggleMeshSim}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isMeshSim
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                    >
                        <Globe size={18} />
                        Mesh Simulation: {isMeshSim ? 'ON' : 'OFF'}
                    </button>
                    <button
                        onClick={toggleFoundry}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${isRunning
                                ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20'
                                : 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20'
                            }`}
                    >
                        {isRunning ? <Zap className="animate-pulse" /> : <Zap />}
                        {isRunning ? 'COOLDOWN' : 'IGNITE FOUNDRY'}
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    label="Throughput"
                    value={`${metrics.artifactsPerSecond.toFixed(1)}/s`}
                    icon={<Zap size={20} className="text-yellow-400" />}
                    trend="+5%"
                />
                <MetricCard
                    label="Avg Forge Time"
                    value={`${metrics.averageForgeTimeMs.toFixed(2)}ms`}
                    icon={<BarChart3 size={20} className="text-cyan-400" />}
                />
                <MetricCard
                    label="Compliance (5T)"
                    value={`${((metrics.validArtifacts / (metrics.artifactsGenerated || 1)) * 100).toFixed(1)}%`}
                    icon={<Shield size={20} className="text-emerald-400" />}
                />
                <MetricCard
                    label="Mesh Latency"
                    value={`${metrics.networkLatencyMs.toFixed(0)}ms`}
                    icon={<Globe size={20} className="text-indigo-400" />}
                    subValue={isMeshSim ? "Planetary Grid" : "Local Engine"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Batch Size</label>
                            <input
                                type="range" min="1" max="50" value={batchSize}
                                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs mt-1">
                                <span>1</span>
                                <span className="text-cyan-400 font-bold">{batchSize}</span>
                                <span>50</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Interval (ms)</label>
                            <input
                                type="range" min="100" max="5000" value={interval}
                                onChange={(e) => setIntervalVal(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs mt-1">
                                <span>100</span>
                                <span className="text-cyan-400 font-bold">{interval}</span>
                                <span>5000</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Visualizer */}
                <div className="lg:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Planetary Mesh Load</h3>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{metrics.artifactsGenerated} forged</span>
                        </div>
                    </div>
                    <div className="h-40 flex items-end gap-1 px-2 pb-2 overflow-hidden border-b border-slate-700">
                        {/* Simple animated bar chart visualizer */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{
                                    height: isRunning ? Math.random() * 80 + 20 + '%' : '10%',
                                    backgroundColor: metrics.congestionLevel > 0.6 ? '#f43f5e' : '#22d3ee'
                                }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="flex-1 rounded-t-sm"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                        <span>t-30s</span>
                        <span>t-15s</span>
                        <span>Now</span>
                    </div>
                </div>
            </div>

            {metrics.congestionLevel > 0.8 && (
                <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-sm">
                    <AlertTriangle size={18} />
                    <span>Critical Congestion Detected: Planetary mesh consensus delay exceeding 400ms.</span>
                </div>
            )}
        </div>
    );
};

const MetricCard: React.FC<{ label: string, value: string, icon: React.ReactNode, subValue?: string, trend?: string }> = ({ label, value, icon, subValue, trend }) => (
    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all">
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-medium">{label}</span>
            {icon}
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && <span className="text-emerald-400 text-[10px]">{trend}</span>}
        </div>
        {subValue && <div className="text-[10px] text-slate-500 mt-1">{subValue}</div>}
    </div>
);

export default OmniStressUI;
