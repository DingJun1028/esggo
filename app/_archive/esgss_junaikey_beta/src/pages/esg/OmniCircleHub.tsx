import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Bot,
    TrendingUp,
    HeartPulse,
    Zap,
    Recycle,
    Droplets,
    Leaf,
    BrainCircuit,
    Newspaper,
    Globe,
    Scale,
    ShieldCheck,
    Lock,
    AlertTriangle,
    FileCheck,
    Users,
    Truck,
    HeartHandshake,
    FileText,
    BarChart,
    Award,
} from 'lucide-react';

// Aqua & Gold Theme Colors
const THEME = {
    aqua: '#63a6b0',
    gold: '#ffd700',
    void: '#0f172a',
    text: '#e2e8f0'
};

const MODULES = [
    {
        id: 'ai-strategy',
        name: 'AI Strategy',
        icon: BrainCircuit,
        path: '/services/cognitive/ai-strategy',
        desc: '策略中樞 (Strategy Forge)',
        color: '#8b5cf6'
    },
    {
        id: 'daily-briefing',
        name: 'Daily Brief',
        icon: Newspaper,
        path: '/services/cognitive/daily-briefing',
        desc: '每日簡報 (Global Pulse)',
        color: '#f59e0b'
    },
    {
        id: 'ai-assistant',
        name: 'Dr. Thoth',
        icon: Bot,
        path: '/services/cognitive/ai-assistant',
        desc: '智能助手 (Omni-Mind)',
        color: '#10b981'
    },
    {
        id: 'trend-prediction',
        name: 'Trend Engine',
        icon: TrendingUp,
        path: '/services/cognitive/trend-prediction',
        desc: '趨勢預測 (Precognition)',
        color: '#63a6b0'
    },
    {
        id: 'impact-nexus',
        name: 'Dashboard',
        icon: Globe,
        path: '/dashboard',
        desc: '全域總覽 (Nexus Prime)',
        color: '#3b82f6'
    },
    // Excellence Phase (Completed)
    {
        id: 'health-check',
        name: 'Health Check',
        icon: HeartPulse,
        path: '/services/excellence/health-check',
        desc: '企業健檢 (Vital Signs)',
        color: '#ef4444'
    },
    {
        id: 'carbon-account',
        name: 'Carbon',
        icon: Leaf,
        path: '/services/excellence/carbon-accounting',
        desc: '碳帳本 (Carbon Ledger)',
        color: '#64748b'
    },
    {
        id: 'energy-mgmt',
        name: 'Energy',
        icon: Zap,
        path: '/esg/energy',
        desc: '能源管理 (Energy Hub)',
        color: '#eab308'
    },
    {
        id: 'water-res',
        name: 'Water',
        icon: Droplets,
        path: '/services/excellence/water',
        desc: '水資源 (Aqua Core)',
        color: '#3b82f6'
    },
    {
        id: 'waste-mgmt',
        name: 'Waste',
        icon: Recycle,
        path: '/esg/waste',
        desc: '循環經濟 (Circular Econ)',
        color: '#22c55e'
    },
    // Governance Phase (New)
    {
        id: 'gov-structure',
        name: 'Structure',
        icon: Scale,
        path: '/esg/governance/structure',
        desc: '治理架構 (Gov Core)',
        color: '#8b5cf6'
    },
    {
        id: 'compliance',
        name: 'Compliance',
        icon: ShieldCheck,
        path: '/esg/governance/compliance',
        desc: '合規守衛 (Guardian)',
        color: '#0ea5e9'
    },
    {
        id: 'controls',
        name: 'Controls',
        icon: FileCheck,
        path: '/esg/governance/internal-controls',
        desc: '內控稽核 (Audit Trail)',
        color: '#f97316' // Orange
    },
    {
        id: 'risk-mgmt',
        name: 'Risk',
        icon: AlertTriangle,
        path: '/esg/governance/risk',
        desc: '風險管理 (Risk Radar)',
        color: '#ef4444' // Red
    },
    {
        id: 'infosec',
        name: 'InfoSec',
        icon: Lock,
        path: '/esg/governance/infosec',
        desc: '資訊安全 (Cyber Shield)',
        color: '#6366f1' // Indigo
    },
    // Stakeholder Services (Phase 23.4)
    {
        id: 'employee-relations',
        name: 'Employee',
        icon: Users,
        path: '/services/stakeholder/employee',
        desc: '員工關係 (Workforce)',
        color: '#63a6b0'
    },
    {
        id: 'customer-engagement',
        name: 'Customer',
        icon: Users,
        path: '/services/stakeholder/customer',
        desc: '客戶互動 (Engagement)',
        color: '#ffd700'
    },
    {
        id: 'supply-chain',
        name: 'Supply Chain',
        icon: Truck,
        path: '/services/stakeholder/supply-chain',
        desc: '供應鏈 (Value Chain)',
        color: '#10b981'
    },
    {
        id: 'community-impact',
        name: 'Community',
        icon: HeartHandshake,
        path: '/services/stakeholder/community',
        desc: '社區影響 (Impact)',
        color: '#f43f5e'
    },
    {
        id: 'investor-relations',
        name: 'Investor',
        icon: TrendingUp,
        path: '/services/stakeholder/investor',
        desc: '投資者關係 (Finance)',
        color: '#8b5cf6'
    },
    // Social & Advancement (Phase 17)
    {
        id: 'social-nexus',
        name: 'Social Hub',
        icon: Users,
        path: '/social',
        desc: '社交樞紐 (Social Nexus)',
        color: '#ffd700'
    }
];

const OmniCircleHub: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredModule, setHoveredModule] = useState<string | null>(null);

    // Animation Variants
    const ORBITAL_VARIANTS: any = {
        animate: {
            rotate: 360,
            transition: {
                duration: 120,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <div className="relative w-full h-screen bg-[#0f172a] text-slate-200 overflow-hidden flex items-center justify-center">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#63a6b0]/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ffd700]/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Central Dao Circle */}
            <div className="relative w-[800px] h-[800px] flex items-center justify-center">

                {/* Orbital Rings */}
                <motion.div
                    variants={ORBITAL_VARIANTS}
                    animate="animate"
                    className="absolute inset-0 border border-slate-800/50 rounded-full border-dashed"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-20 border border-slate-700/30 rounded-full border-dotted"
                />

                {/* Center Core: Omni Logo / Concept */}
                <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full bg-slate-900/80 backdrop-blur-xl border border-[#63a6b0]/50 flex items-center justify-center shadow-[0_0_50px_rgba(99,166,176,0.2)]">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-[#63a6b0] tracking-wider mb-1">OMNI</h1>
                            <div className="h-[1px] w-12 bg-[#ffd700] mx-auto mb-1" />
                            <span className="text-xs text-slate-400 uppercase tracking-[0.2em]">Circle</span>
                        </div>
                    </div>
                </div>

                {/* Modules (Planets) */}
                {MODULES.map((mod, index) => {
                    // Position calculations for a circle
                    const angle = (index / MODULES.length) * 360; // Spread evenly
                    const radius = 350; // Distance from center
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                        <motion.div
                            key={mod.id}
                            className="absolute"
                            style={{ x, y }}
                            whileHover={{ scale: 1.2, zIndex: 50 }}
                            onHoverStart={() => setHoveredModule(mod.id)}
                            onHoverEnd={() => setHoveredModule(null)}
                        >
                            <button
                                onClick={() => navigate(mod.path)}
                                className="relative group flex flex-col items-center justify-center"
                            >
                                <div
                                    className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:border-[#ffd700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                    style={{ borderColor: hoveredModule === mod.id ? mod.color : undefined }}
                                >
                                    <mod.icon
                                        size={24}
                                        color={hoveredModule === mod.id ? mod.color : '#94a3b8'}
                                        className="transition-colors duration-300"
                                    />
                                </div>

                                <div className={`absolute top-16 w-32 text-center transition-all duration-300 ${hoveredModule === mod.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                    <div className="text-sm font-bold text-slate-200">{mod.name}</div>
                                    <div className="text-[10px] text-slate-500">{mod.desc}</div>
                                </div>
                            </button>
                        </motion.div>
                    );
                })}

            </div>

            {/* Footer Status */}
            <div className="absolute bottom-8 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-mono">
                    System Verified • 5T Protocol Active
                </div>
            </div>
        </div>
    );
};

export default OmniCircleHub;
