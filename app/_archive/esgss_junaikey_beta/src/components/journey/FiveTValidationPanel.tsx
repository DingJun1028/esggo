/**
 * 🛡️ 5T 協議驗證面板
 * 5T Protocol Validation Panel
 * 
 * 即時顯示當前接觸點的 5T 合規狀態
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Link,
    Route,
    Calculator,
    Lock,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';

interface FiveTStatus {
    tangible: boolean;
    traceable: boolean;
    trackable: boolean;
    transparent: boolean;
    trustworthy: boolean;
}

interface FiveTValidationPanelProps {
    status: FiveTStatus;
    isValidating?: boolean;
    showDetails?: boolean;
    onValidate?: () => void;
}

const fiveTDefinitions = {
    tangible: {
        icon: Eye,
        name: 'Tangible',
        displayName: '可感知',
        description: '具體可視化的影響力指標',
        color: 'from-blue-500 to-cyan-500'
    },
    traceable: {
        icon: Link,
        name: 'Traceable',
        displayName: '可溯源',
        description: '數據來源清晰可追溯',
        color: 'from-emerald-500 to-teal-500'
    },
    trackable: {
        icon: Route,
        name: 'Trackable',
        displayName: '可追蹤',
        description: '完整的生命週期記錄',
        color: 'from-purple-500 to-pink-500'
    },
    transparent: {
        icon: Calculator,
        displayName: '可驗算',
        name: 'Transparent',
        description: '計算公式公開透明',
        color: 'from-amber-500 to-orange-500'
    },
    trustworthy: {
        icon: Lock,
        name: 'Trustworthy',
        displayName: '不可篡改',
        description: 'Hash Lock 永久鎖定',
        color: 'from-rose-500 to-red-500'
    }
};

export const FiveTValidationPanel: React.FC<FiveTValidationPanelProps> = ({
    status,
    isValidating = false,
    showDetails = true,
    onValidate
}) => {
    const validatedCount = Object.values(status).filter(Boolean).length;
    const totalCount = Object.keys(status).length;
    const complianceRate = Math.round((validatedCount / totalCount) * 100);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6">
            {/* 頁首 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">5T 協議驗證</h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                        {validatedCount}/{totalCount} <span className="hidden sm:inline">項已驗證 </span>({complianceRate}%)
                    </p>
                </div>

                {/* 全局驗證按鈕 */}
                {onValidate && (
                    <motion.button
                        onClick={onValidate}
                        disabled={isValidating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-[#0df2df] to-cyan-500 
                       text-slate-900 rounded-xl font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
                    >
                        {isValidating ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                驗證中...
                            </>
                        ) : (
                            '立即驗證'
                        )}
                    </motion.button>
                )}
            </div>

            {/* 整體進度條 */}
            <div className="mb-6">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#0df2df] to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${complianceRate}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* 5T 指標列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {(Object.keys(status) as Array<keyof FiveTStatus>).map((key, index) => {
                    const definition = fiveTDefinitions[key];
                    const Icon = definition.icon;
                    const isValidated = status[key];

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                relative p-4 rounded-2xl border
                ${isValidated
                                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
                                    : 'bg-slate-800/50 border-slate-700/50'
                                }
                transition-all duration-300
                group cursor-pointer hover:scale-[1.02]
              `}
                        >
                            <div className="flex items-center gap-4">
                                {/* 圖示 */}
                                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isValidated
                                        ? `bg-gradient-to-br ${definition.color}`
                                        : 'bg-slate-700'
                                    }
                `}>
                                    <Icon className="text-white" size={24} />
                                </div>

                                {/* 內容 */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`font-semibold ${isValidated ? 'text-white' : 'text-slate-400'}`}>
                                            {definition.displayName}
                                        </h4>
                                        <span className="text-xs text-slate-500 font-mono">
                                            {definition.name}
                                        </span>
                                    </div>

                                    {showDetails && (
                                        <p className="text-xs text-slate-400">
                                            {definition.description}
                                        </p>
                                    )}
                                </div>

                                {/* 狀態圖示 */}
                                <AnimatePresence mode="wait">
                                    {isValidating ? (
                                        <motion.div
                                            key="validating"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <Loader2 className="text-[#0df2df] animate-spin" size={24} />
                                        </motion.div>
                                    ) : isValidated ? (
                                        <motion.div
                                            key="validated"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <CheckCircle2 className="text-emerald-400" size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="pending"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <XCircle className="text-slate-600" size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Hover 發光效果 */}
                            {isValidated && (
                                <motion.div
                                    className={`
                    absolute inset-0 rounded-2xl bg-gradient-to-r ${definition.color}
                    opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300
                  `}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* 驗證徽章 */}
            {complianceRate === 100 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-gradient-to-r from-[#0df2df]/20 to-cyan-500/20 
                     rounded-2xl border border-[#0df2df]/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0df2df] to-cyan-500 
                            flex items-center justify-center">
                            <CheckCircle2 className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-white font-semibold">完全合規！</p>
                            <p className="text-xs text-slate-400">
                                此接觸點已通過所有 5T 協議驗證
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
