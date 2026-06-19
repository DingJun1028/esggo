'use client';

import React, { useState, useMemo } from 'react';
import { DynamicFormEngine } from '@/components/omni/report-forge/DynamicFormEngine';
import { useReportLifecycle } from '@/core/hooks/useReportLifecycle';
import { saveReport } from '@/core/ncb/report-actions';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import PageHeader from '@/components/PageHeader';
import { Shield, Activity, HardDrive, Search, Lock, Database, Layers, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FORGE_SCHEMAS } from '@/core/ncb/forge-schemas';
import { OmniEsgCell } from '@/components/omni/cards/OmniEsgCell';
import { SkeletonNavigator } from '@/components/omni/reporting/SkeletonNavigator';

type ForgeStep = 'SELECTION' | 'INPUT' | 'AUDIT' | 'SEAL';

const modules = [
    { id: 'carbon', title: '碳足跡感測器', sub: 'Scope 1 直接排放', icon: <Database /> },
    { id: 'energy', title: '能源採購台帳', sub: 'Scope 2 能源間接', icon: <Layers /> },
    { id: 'supply', title: '供應鏈雷達', sub: 'Scope 3 價值鏈', icon: <Activity /> },
];

export default function DataForgeEditPage() {
    const router = useRouter();
    const [step, setStep] = useState<ForgeStep>('SELECTION');
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [finalAsset, setFinalAsset] = useState<any>(null);

    const { createNewAtom, executeWithLog, isProcessing } = useReportLifecycle('Data Forge');

    const currentSchema = useMemo(() => {
        return selectedModule ? FORGE_SCHEMAS[selectedModule] : null;
    }, [selectedModule]);

    const calculate5TMetrics = () => {
        const hasMethodology = (formData.methodology?.length || 0) > 20;
        const hasValue = !!(formData.emissionValue || formData.consumption);
        const hasSelection = !!selectedModule;

        return [
            { id: 'tangible', label: 'Tangible', icon: <Activity size={14} />, desc: '數據具象化程度', value: hasValue ? 95 : 30 },
            { id: 'traceable', label: 'Traceable', icon: <Search size={14} />, desc: '來源溯源完整度', value: hasMethodology ? 85 : 40 },
            { id: 'trackable', label: 'Trackable', icon: <Activity size={14} />, desc: '生命週期追蹤中', value: step === 'SELECTION' ? 10 : 60 },
            { id: 'transparent', label: 'Transparent', icon: <HardDrive size={14} />, desc: '算法驗算透明度', value: hasSelection ? 90 : 50 },
            { id: 'trustworthy', label: 'Trustworthy', icon: <Lock size={14} />, desc: '最終封印準備度', value: step === 'SEAL' ? 100 : 20 },
        ];
    };

    const handleModuleSelect = (moduleId: string) => {
        setSelectedModule(moduleId);
        setStep('INPUT');
    };

    const handleFormSubmit = async (values: any) => {
        setFormData(values);
        setStep('AUDIT');

        // Allow some time for visual "Refining" animation
        setTimeout(async () => {
            const newAtom = createNewAtom(`${selectedModule?.toUpperCase()} 數據煉製`, values.methodology || values.proof || 'ESG 數據自動封存');
            const fullData = { ...newAtom, data: values };

            await executeWithLog(async () => {
                const result = await saveReport(fullData as any);
                if (result.success) {
                    setFinalAsset(fullData);
                    setStep('SEAL');
                }
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-omni-surface p-4 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <PageHeader
                    title={step === 'SEAL' ? '資產顯化完成' : '資料煉製精靈 (Forge Wizard)'}
                    subtitle={
                        step === 'SELECTION' ? '第一步：選擇您要煉製的永續數據類型。' :
                            step === 'INPUT' ? '第二步：輸入原始行為數據。填寫過程即是學習。' :
                                step === 'AUDIT' ? '第三步：AI 正在進行 5T 協議合規性提純...' :
                                    '第四步：永續資產已成功封存。'
                    }
                    category="WIZARD 0 → 1"
                />

                {/* Progress Indicator */}
                <div className="flex justify-between max-w-2xl mx-auto mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-omni-surface-2 -translate-y-1/2" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-omni-primary -translate-y-1/2 transition-all duration-700"
                        style={{ width: step === 'SELECTION' ? '0%' : step === 'INPUT' ? '33%' : step === 'AUDIT' ? '66%' : '100%' }}
                    />
                    {['選', '練', '驗', '封'].map((s, i) => {
                        const active = (i === 0 && step === 'SELECTION') || (i === 1 && step === 'INPUT') || (i === 2 && step === 'AUDIT') || (i === 3 && step === 'SEAL');
                        const passed = (i === 0 && step !== 'SELECTION') || (i === 1 && ['AUDIT', 'SEAL'].includes(step)) || (i === 2 && step === 'SEAL');
                        return (
                            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2",
                                    active ? "bg-omni-primary border-omni-primary text-white scale-110 shadow-lg shadow-omni-primary/30" :
                                        passed ? "bg-omni-surface border-omni-primary text-omni-primary" : "bg-omni-surface border-omni-glass-border text-omni-text-muted"
                                )}>
                                    {passed ? <CheckCircle size={16} /> : i + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 'SELECTION' && (
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                >
                                    {modules.map((m, idx) => (
                                        <OmniEsgCell
                                            key={m.id}
                                            id={m.id}
                                            mode="card"
                                            label={m.title}
                                            value="CHOOSE"
                                            subValue={m.sub}
                                            category={idx === 0 ? 'environmental' : idx === 1 ? 'social' : 'governance'}
                                            onClick={() => handleModuleSelect(m.id)}
                                            sentientState={{ entropy: 0.1, harmony: 0.9, resonance: 80, phase: 'FORGE' }}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {step === 'INPUT' && currentSchema && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <LiquidGlassContainer className="p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-black text-omni-text-main flex items-center gap-2">
                                                <Activity size={20} className="text-omni-primary" />
                                                資料提純中：{selectedModule?.toUpperCase()}
                                            </h3>
                                            <button
                                                onClick={() => setStep('SELECTION')}
                                                className="text-xs font-bold text-omni-text-muted hover:text-omni-primary transition-colors"
                                            >
                                                ← 取消並重新選擇
                                            </button>
                                        </div>
                                        <DynamicFormEngine
                                            schema={currentSchema}
                                            onSubmit={handleFormSubmit}
                                            onChange={(data) => setFormData(data)}
                                            isLoading={isProcessing}
                                            onSaveDraft={() => alert('🔒 草稿已在「永憶主體」中安全鎖定。')}
                                        />
                                    </LiquidGlassContainer>
                                </motion.div>
                            )}

                            {step === 'AUDIT' && (
                                <motion.div
                                    key="audit"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center p-20 text-center space-y-8"
                                >
                                    <div className="relative size-32">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border-4 border-dashed border-omni-primary rounded-full"
                                        />
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-4 border-4 border-dashed border-omni-accent rounded-full opacity-50"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-omni-primary">
                                            <Zap size={40} className="animate-bounce" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-omni-text-main">5T 協議智慧驗算中...</h3>
                                        <p className="text-omni-text-sub mt-2">正在為您的數據原子貼上溯源標籤 (SHA-256 Lock)</p>
                                    </div>
                                    <div className="w-full max-w-sm h-1 bg-omni-surface-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2 }}
                                            className="h-full bg-omni-primary"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 'SEAL' && finalAsset && (
                                <motion.div
                                    key="seal"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    <LiquidGlassContainer className="p-12 text-center border-2 border-emerald-500/30">
                                        <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-3xl font-black text-omni-text-main">煉製成功：永續資產已誕生</h3>
                                        <p className="text-omni-text-sub mt-4 max-w-md mx-auto">
                                            您的數據已成功轉換為具備 5T 協議法律效力的知識資產，並已同步至 **OmniNexus** 分散式帳本。
                                        </p>

                                        <div className="mt-10 p-6 bg-omni-surface-2 rounded-2xl border border-omni-glass-border font-mono text-left space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-omni-text-muted">ASSET_UUID:</span>
                                                <span className="text-omni-primary font-bold">{finalAsset.uuid}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-omni-text-muted">DOMAIN_REF:</span>
                                                <span className="text-omni-text-main font-bold">{finalAsset.domain}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-omni-text-muted">5T_RESONANCE:</span>
                                                <span className="text-omni-accent font-bold">ALPHA-99</span>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex gap-4 justify-center">
                                            <button
                                                onClick={() => router.push('/omni/reports/data-forge')}
                                                className="px-8 py-3 bg-omni-primary text-white rounded-xl font-black hover:scale-105 transition-all"
                                            >
                                                回儀表板查看
                                            </button>
                                            <button
                                                onClick={() => setStep('SELECTION')}
                                                className="px-8 py-3 border border-omni-glass-border text-omni-text-main rounded-xl font-black hover:bg-omni-surface-2 transition-all"
                                            >
                                                再煉製一筆
                                            </button>
                                        </div>
                                    </LiquidGlassContainer>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sensor Panel */}
                    <div className="space-y-6">
                        <SkeletonNavigator
                            activeSection={selectedModule === 'carbon' ? 'II. Environmental Impact & Carbon (51-200pp)' : undefined}
                        />

                        <LiquidGlassContainer className="p-6">
                            <h3 className="text-sm font-black text-omni-text-main uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Shield size={16} className="text-omni-primary" />
                                5T 實時共鳴感測
                            </h3>

                            <div className="space-y-6">
                                {calculate5TMetrics().map((sensor) => (
                                    <div key={sensor.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="flex items-center gap-1.5 text-omni-text-main">
                                                <span className="text-omni-primary">{sensor.icon}</span>
                                                {sensor.label}
                                            </span>
                                            <span className="font-mono text-omni-primary">{sensor.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-omni-surface-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sensor.value}%` }}
                                                transition={{ type: "spring", stiffness: 100 }}
                                                className={cn(
                                                    "h-full bg-gradient-to-r",
                                                    sensor.value > 80 ? "from-emerald-400 to-omni-primary" : "from-omni-primary to-omni-accent"
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </LiquidGlassContainer>

                        <LiquidGlassContainer className="p-6 bg-omni-accent/5 border-omni-accent/20">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="size-8 bg-omni-accent rounded-lg flex items-center justify-center text-white font-black text-xs">協</div>
                                <h3 className="text-xs font-black text-omni-accent uppercase tracking-widest">阿丹代理執行緒</h3>
                            </div>
                            <p className="text-[11px] text-omni-text-main leading-relaxed">
                                {step === 'SELECTION' ? '請先選擇一個數據源。不同的數據源將決定我們採用的計算方法學 (Methodology)。' :
                                    step === 'INPUT' ? '數據正在流入。我正在同步比對 5T 合規性，請確保「方法學」描述足夠詳實。' :
                                        step === 'AUDIT' ? '封印程序已開啟。正在生成資產唯一 Hash 指紋。' :
                                            '資產已顯化。如果您需要進行「一鍵發布」，請前往發布廣場。'}
                            </p>
                        </LiquidGlassContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
