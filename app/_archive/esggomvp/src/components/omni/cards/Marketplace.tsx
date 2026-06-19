'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Database, Gem, Sparkles, TrendingUp, Search, Filter } from 'lucide-react';

const MARKET_ITEMS = [
    { id: '1', name: '淨零碳排 2030 (SSR)', type: 'Environmental', price: 5000, currency: 'KP', trend: '+15%' },
    { id: '2', name: '供應鏈永續宣告 (SR)', type: 'Social', price: 1200, currency: 'KP', trend: '+5%' },
    { id: '3', name: '董事會多元化承諾 (R)', type: 'Governance', price: 800, currency: 'KP', trend: '-2%' },
    { id: '4', name: 'ISO 14064 驗證水晶 (UR)', type: 'Artifact', price: 15000, currency: 'Gems', trend: '+42%' },
    { id: '5', name: '綠色債券發行 (SSR)', type: 'Governance', price: 6000, currency: 'KP', trend: '+10%' },
    { id: '6', name: '弱勢培力天賦卡 (SR)', type: 'Social', price: 1500, currency: 'KP', trend: '+8%' },
];

export function Marketplace() {
    const [search, setSearch] = useState('');

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
                        <ArrowLeftRight className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-widest text-white">ORBITAL EXCHANGE</h2>
                        <div className="flex items-center gap-4 text-[10px] text-fuchsia-400/80 tracking-widest uppercase font-mono mt-1">
                            <span>跨界卡牌與知識交易所</span>
                            <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-3 h-3" /> VOL: HI</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                        />
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                        <Filter className="w-4 h-4 text-white/70" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Your KP Balance', value: '1,250', icon: Sparkles, color: 'text-amber-400' },
                    { label: 'Your Impact Gems', value: '42', icon: Gem, color: 'text-emerald-400' },
                    { label: 'Market Cap', value: '1.24B KP', icon: Database, color: 'text-fuchsia-400' },
                    { label: '24h Volume', value: '8.4M KP', icon: TrendingUp, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-white/40 font-mono uppercase">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wider">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Trading Board */}
            <div className="bg-black/40 border border-fuchsia-500/20 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-fuchsia-500/10 to-transparent blur-[80px] pointer-events-none" />

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[10px] text-white/40 tracking-widest uppercase font-mono bg-white/5">
                                <th className="p-4 font-normal">Asset Name</th>
                                <th className="p-4 font-normal">Type</th>
                                <th className="p-4 font-normal text-right">Price</th>
                                <th className="p-4 font-normal text-right">24h Trend</th>
                                <th className="p-4 font-normal text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MARKET_ITEMS.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-10 rounded bg-gradient-to-br ${item.type === 'Environmental' ? 'from-emerald-500/30 to-emerald-900/30 border-emerald-500/50' :
                                                    item.type === 'Social' ? 'from-blue-500/30 to-blue-900/30 border-blue-500/50' :
                                                        item.type === 'Governance' ? 'from-amber-500/30 to-amber-900/30 border-amber-500/50' :
                                                            'from-purple-500/30 to-purple-900/30 border-purple-500/50'
                                                } border flex items-center justify-center shrink-0`}>
                                                <Layers className={`w-4 h-4 ${item.type === 'Environmental' ? 'text-emerald-400' :
                                                        item.type === 'Social' ? 'text-blue-400' :
                                                            item.type === 'Governance' ? 'text-amber-400' :
                                                                'text-purple-400'
                                                    }`} />
                                            </div>
                                            <span className="font-bold text-white group-hover:text-fuchsia-300 transition-colors uppercase tracking-wider text-sm">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full bg-white/5 border ${item.type === 'Environmental' ? 'text-emerald-400 border-emerald-500/20' :
                                                item.type === 'Social' ? 'text-blue-400 border-blue-500/20' :
                                                    item.type === 'Governance' ? 'text-amber-400 border-amber-500/20' :
                                                        'text-purple-400 border-purple-500/20'
                                            } font-mono uppercase tracking-widest`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1 font-mono">
                                            <span className="text-white font-bold">{item.price.toLocaleString()}</span>
                                            <span className="text-white/40 text-xs">{item.currency}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`text-xs font-mono font-bold ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {item.trend}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50 text-xs font-bold uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all">
                                            Trade
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Ensure Layers acts as a fallback icon
import { Layers } from 'lucide-react';
