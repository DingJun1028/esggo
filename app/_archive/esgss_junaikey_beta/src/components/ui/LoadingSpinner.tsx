import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingSpinner - 液態玻璃效果載入組件
 * 
 * 客戶旅程體驗：
 * - 即時反饋載入狀態
 * - 優雅的液態玻璃動畫
 * - 漸進式載入指示
 */
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning';
    showProgress?: boolean;
    progress?: number;
    message?: string;
    journeyId?: string;
    onComplete?: () => void;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = '',
    variant = 'primary',
    showProgress = false,
    progress = 0,
    message,
    journeyId,
    onComplete
}) => {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 48,
    };

    const variantColors = {
        default: 'text-slate-400',
        primary: 'text-[#00FFFF]',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
    };

    const variantGradients = {
        default: 'from-slate-400/20 to-slate-500/20',
        primary: 'from-[#00FFFF]/20 to-[#00FFFF]/20',
        success: 'from-emerald-400/20 to-green-500/20',
        warning: 'from-amber-400/20 to-orange-500/20',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            {/* 液態玻璃載入動畫 */}
            <div className="relative">
                {/* 背景光暈 */}
                <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${variantGradients[variant]} blur-xl`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 主載入圖標 */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Loader2
                        className={`relative z-10 ${variantColors[variant]}`}
                        size={sizeMap[size]}
                    />
                </motion.div>

                {/* 外圈裝飾 */}
                <motion.svg
                    className={`absolute inset-0 w-full h-full -rotate-90 ${variantColors[variant]}`}
                    viewBox="0 0 100 100"
                >
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="283"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: [283, 0, 283] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ opacity: 0.3 }}
                    />
                </motion.svg>
            </div>

            {/* 進度條 */}
            {showProgress && (
                <div className="w-full max-w-[200px]">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{message || 'Processing...'}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${variantGradients[variant]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* 旅程 ID 追蹤 */}
            {journeyId && (
                <div className="text-[10px] text-slate-500 font-mono">
                    Journey: {journeyId}
                </div>
            )}
        </div>
    );
};

/**
 * 載入狀態組件 - 完整的客戶旅程體驗
 */
interface LoadingStateProps {
    isLoading: boolean;
    error?: string | null;
    onRetry?: () => void;
    children: React.ReactNode;
    journeyName: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    isLoading,
    error,
    onRetry,
    children,
    journeyName
}) => {
    const [journeyStep, setJourneyStep] = useState(0);
    const journeySteps = [
        { id: 1, name: 'Initializing', message: 'Preparing environment...' },
        { id: 2, name: 'Connecting', message: 'Establishing secure connection...' },
        { id: 3, name: 'Processing', message: 'Processing your request...' },
        { id: 4, name: 'Finalizing', message: 'Finalizing results...' },
    ];

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setJourneyStep(prev => (prev < journeySteps.length ? prev + 1 : prev));
            }, 800);
            return () => clearInterval(interval);
        } else {
            setJourneyStep(0);
            return undefined;
        }
    }, [isLoading]);

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[200px] bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl p-8"
                >
                    <LoadingSpinner
                        variant="primary"
                        size="lg"
                        showProgress
                        progress={Math.min((journeyStep / journeySteps.length) * 100, 100)}
                        message={journeySteps[journeyStep - 1]?.message || 'Preparing...'}
                        journeyId={`${journeyName}-${Date.now().toString(36)}`}
                    />

                    {/* 旅程步驟指示器 */}
                    <div className="flex gap-2 mt-6">
                        {journeySteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className={`w-2 h-2 rounded-full ${index < journeyStep ? 'bg-[#00FFFF]' : 'bg-slate-700'
                                    }`}
                                initial={false}
                                animate={{
                                    scale: index === journeyStep - 1 ? [1, 1.3, 1] : 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: index === journeyStep - 1 ? Infinity : 0,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center min-h-[200px] bg-red-500/10 rounded-3xl border border-red-500/30 p-8"
                >
                    <AlertCircle className="text-red-400 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-white mb-2">Journey Interrupted</h3>
                    <p className="text-sm text-slate-400 mb-4">{error}</p>
                    {onRetry && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRetry}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            Retry Journey
                        </motion.button>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * 成功完成組件
 */
interface JourneyCompleteProps {
    journeyName: string;
    onContinue?: () => void;
}

export const JourneyComplete: React.FC<JourneyCompleteProps> = ({
    journeyName,
    onContinue
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[200px] bg-emerald-500/10 rounded-3xl border border-emerald-500/30 p-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <CheckCircle2 className="text-emerald-400 mb-4" size={48} />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">{journeyName} Complete</h3>
            <p className="text-sm text-slate-400 mb-4">Your journey has been successfully completed.</p>
            {onContinue && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                >
                    Continue
                </motion.button>
            )}
        </motion.div>
    );
};
