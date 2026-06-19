/**
 * 🗺️ 客戶旅程進度追蹤器
 * Customer Journey Progress Tracker
 * 
 * 視覺化展示用戶在服務旅程中的當前位置與完成進度
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
    Compass,
    Rocket,
    Target,
    Award,
    Share2,
    CheckCircle2,
    Circle
} from 'lucide-react';

interface JourneyStage {
    id: string;
    name: 'discovery' | 'onboarding' | 'engagement' | 'value-realization' | 'advocacy';
    displayName: string;
    icon: React.ReactNode;
    status: 'completed' | 'in-progress' | 'locked';
    progress: number; // 0-100
}

interface JourneyProgressTrackerProps {
    serviceId: string;
    serviceName: string;
    currentStage: string;
    stages: JourneyStage[];
    onStageClick?: (stageId: string) => void;
}

const stageIcons = {
    discovery: Compass,
    onboarding: Rocket,
    engagement: Target,
    'value-realization': Award,
    advocacy: Share2
};

const stageColors = {
    discovery: 'from-blue-500 to-cyan-500',
    onboarding: 'from-purple-500 to-pink-500',
    engagement: 'from-emerald-500 to-teal-500',
    'value-realization': 'from-amber-500 to-orange-500',
    advocacy: 'from-rose-500 to-red-500'
};

export const JourneyProgressTracker: React.FC<JourneyProgressTrackerProps> = ({
    serviceId,
    serviceName,
    currentStage,
    stages,
    onStageClick
}) => {
    const currentStageIndex = stages.findIndex(s => s.id === currentStage);
    const overallProgress = Math.round(
        (stages.reduce((acc, stage) => acc + stage.progress, 0) / stages.length)
    );

    return (
        <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* 頁首 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {serviceName} - 學習旅程
                    </h3>
                    <p className="text-slate-400 text-sm">
                        服務即教學，知識即資產 | 當前進度：{overallProgress}%
                    </p>
                </div>

                {/* 整體進度環 */}
                <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(148, 163, 184, 0.2)"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                            animate={{
                                strokeDashoffset: 2 * Math.PI * 45 * (1 - overallProgress / 100)
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0df2df" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{overallProgress}%</span>
                    </div>
                </div>
            </div>

            {/* 階段時間軸 */}
            <div className="relative">
                {/* 連接線 */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-slate-800 rounded-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#0df2df] to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                {/* 階段節點 */}
                <div className="relative flex justify-between">
                    {stages.map((stage, index) => {
                        const Icon = stageIcons[stage.name];
                        const isCompleted = stage.status === 'completed';
                        const isInProgress = stage.status === 'in-progress';
                        const isLocked = stage.status === 'locked';
                        const isCurrent = stage.id === currentStage;

                        return (
                            <motion.div
                                key={stage.id}
                                className="flex flex-col items-center cursor-pointer group"
                                onClick={() => !isLocked && onStageClick?.(stage.id)}
                                whileHover={!isLocked ? { scale: 1.05 } : {}}
                                whileTap={!isLocked ? { scale: 0.95 } : {}}
                            >
                                {/* 階段圖示 */}
                                <div className="relative mb-4">
                                    <motion.div
                                        className={`
                      relative z-10 w-16 h-16 rounded-full 
                      flex items-center justify-center
                      ${isCompleted ? 'bg-gradient-to-br from-[#0df2df] to-cyan-500' : ''}
                      ${isInProgress ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
                      ${isLocked ? 'bg-slate-800' : ''}
                      border-4 ${isCurrent ? 'border-white' : 'border-slate-900'}
                      transition-all duration-300
                    `}
                                        animate={isInProgress ? {
                                            boxShadow: [
                                                '0 0 20px rgba(13, 242, 223, 0.5)',
                                                '0 0 40px rgba(13, 242, 223, 0.8)',
                                                '0 0 20px rgba(13, 242, 223, 0.5)',
                                            ]
                                        } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="text-white" size={32} />
                                        ) : isLocked ? (
                                            <Circle className="text-slate-600" size={32} />
                                        ) : (
                                            <Icon className={`${isInProgress ? 'text-white' : 'text-slate-400'}`} size={32} />
                                        )}
                                    </motion.div>

                                    {/* 發光效果 */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-[#0df2df]/30 blur-xl"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.5, 0.8, 0.5]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </div>

                                {/* 階段名稱 */}
                                <div className="text-center">
                                    <p className={`
                    text-sm font-semibold mb-1
                    ${isCompleted || isInProgress ? 'text-white' : 'text-slate-500'}
                  `}>
                                        {stage.displayName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {stage.progress}% 完成
                                    </p>
                                </div>

                                {/* 進度條 */}
                                {!isLocked && (
                                    <div className="mt-2 w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${stageColors[stage.name]}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stage.progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 當前階段提示 */}
            {currentStageIndex >= 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-gradient-to-r from-[#0df2df]/10 to-cyan-500/10 
                     rounded-2xl border border-[#0df2df]/30"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#0df2df] animate-pulse" />
                        <p className="text-sm text-slate-300">
                            當前階段：<span className="text-white font-semibold">
                                {stages[currentStageIndex]?.displayName}
                            </span>
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
