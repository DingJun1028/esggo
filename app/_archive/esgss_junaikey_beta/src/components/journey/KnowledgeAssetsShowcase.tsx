/**
 * 🏆 知識資產展示牆
 * Knowledge Assets Showcase
 * 
 * 展示用戶在旅程中獲得的徽章、證書、報告等知識資產
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    FileText,
    Shield,
    Trophy,
    Star,
    Download,
    Share2,
    ExternalLink
} from 'lucide-react';

interface KnowledgeAsset {
    id: string;
    name: string;
    type: 'badge' | 'certificate' | 'report' | 'evidence';
    earnedAt: string;
    serviceId: string;
    serviceName: string;
    description?: string;
    downloadUrl?: string;
    shareUrl?: string;
    metadata?: Record<string, any>;
}

interface KnowledgeAssetsShowcaseProps {
    assets: KnowledgeAsset[];
    layout?: 'grid' | 'list';
    onDownload?: (assetId: string) => void;
    onShare?: (assetId: string) => void;
    onView?: (assetId: string) => void;
}

const assetTypeConfig = {
    badge: {
        icon: Award,
        color: 'from-[#0df2df] to-cyan-500',
        bgColor: 'from-[#0df2df]/10 to-cyan-500/10',
        borderColor: 'border-[#0df2df]/30'
    },
    certificate: {
        icon: Shield,
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-500/10 to-pink-500/10',
        borderColor: 'border-purple-500/30'
    },
    report: {
        icon: FileText,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'from-emerald-500/10 to-teal-500/10',
        borderColor: 'border-emerald-500/30'
    },
    evidence: {
        icon: Trophy,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'from-amber-500/10 to-orange-500/10',
        borderColor: 'border-amber-500/30'
    }
};

export const KnowledgeAssetsShowcase: React.FC<KnowledgeAssetsShowcaseProps> = ({
    assets,
    layout = 'grid',
    onDownload,
    onShare,
    onView
}) => {
    const totalAssets = assets.length;
    const assetsByType = assets.reduce((acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* 頁首統計 */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">知識資產庫</h3>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Star className="text-[#0df2df]" size={20} />
                        <span className="text-white font-semibold">{totalAssets}</span>
                        <span className="text-slate-400 text-sm">總計資產</span>
                    </div>
                    {Object.entries(assetsByType).map(([type, count]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${assetTypeConfig[type as keyof typeof assetTypeConfig].color}`} />
                            <span className="text-slate-300 text-sm">{count} {
                                type === 'badge' ? '徽章' :
                                    type === 'certificate' ? '證書' :
                                        type === 'report' ? '報告' : '證據'
                            }</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 資產展示 */}
            {assets.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy className="text-slate-700 mx-auto mb-4" size={48} />
                    <p className="text-slate-400">尚未獲得任何知識資產</p>
                    <p className="text-slate-500 text-sm mt-2">
                        完成服務旅程即可獲得專屬徽章與證書
                    </p>
                </div>
            ) : (
                <div className={`
          ${layout === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'flex flex-col gap-4'
                    }
        `}>
                    {assets.map((asset, index) => {
                        const config = assetTypeConfig[asset.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className={`
                  relative group
                  bg-gradient-to-br ${config.bgColor}
                  border ${config.borderColor}
                  rounded-2xl p-6 cursor-pointer
                  transition-all duration-300
                `}
                                onClick={() => onView?.(asset.id)}
                            >
                                {/* 發光背景 */}
                                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${config.color}
                  opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300
                `} />

                                {/* 內容 */}
                                <div className="relative z-10">
                                    {/* 圖示與類型 */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`
                      w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color}
                      flex items-center justify-center
                      shadow-lg
                    `}>
                                            <Icon className="text-white" size={32} />
                                        </div>

                                        <div className="flex gap-2">
                                            {asset.downloadUrl && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDownload?.(asset.id);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50
                                   flex items-center justify-center transition-colors"
                                                >
                                                    <Download className="text-slate-400 hover:text-white" size={16} />
                                                </motion.button>
                                            )}
                                            {asset.shareUrl && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onShare?.(asset.id);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50
                                   flex items-center justify-center transition-colors"
                                                >
                                                    <Share2 className="text-slate-400 hover:text-white" size={16} />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {/* 資產名稱 */}
                                    <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">
                                        {asset.name}
                                    </h4>

                                    {/* 服務來源 */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${config.color}`} />
                                        <span className="text-slate-400 text-sm">
                                            {asset.serviceName}
                                        </span>
                                    </div>

                                    {/* 描述 */}
                                    {asset.description && (
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            {asset.description}
                                        </p>
                                    )}

                                    {/* 獲得時間 */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">
                                            {new Date(asset.earnedAt).toLocaleDateString('zh-TW')}
                                        </span>
                                        <div className="flex items-center gap-1 text-[#0df2df] group-hover:translate-x-1 transition-transform">
                                            <span>查看詳情</span>
                                            <ExternalLink size={12} />
                                        </div>
                                    </div>
                                </div>

                                {/* 閃光效果 */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden pointer-events-none"
                                    initial={false}
                                    whileHover={{
                                        background: [
                                            'linear-gradient(90deg, transparent 0%, transparent 100%)',
                                            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                            'linear-gradient(90deg, transparent 0%, transparent 100%)'
                                        ]
                                    }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
