import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Zap,
    ShieldCheck,
    GraduationCap,
    Trophy,
    MousePointer2,
    ArrowRight,
    Sparkles,
    FileText,
    Activity,
    Database,
    Boxes,
    Compass,
    Badge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceOnboardingOverlay from '../components/common/ServiceOnboardingOverlay';

const ServiceGuideCenter: React.FC = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const guides = [
        {
            id: 'wizard',
            name: '一鍵生成中心',
            en: 'Report Wizard',
            desc: '將零散數據鍊金為專業 ESG 報告。符合 GRI/SASB 標準，支援 AI 自動增修。',
            icon: <Zap className="w-8 h-8" />,
            color: '#63a6b0',
            route: '/one-click-report',
            steps: [
                { title: '數據匯入 Data Entry', description: '批次上傳能源、水資源與社會指標數據。', icon: <Boxes /> },
                { title: 'AI 內容填充 AI Writing', description: 'Omni-Sprite 會根據行業背景自動生成專業敘事。', icon: <Sparkles /> },
                { title: '框架對齊 Alignment', description: '自動對應 GRI 揭露指標與 TCFD 四大支柱。', icon: <FileText /> },
                { title: '一鍵產出 Export', description: '匯出高品質 PDF 與互動式網站版報告。', icon: <Zap /> }
            ]
        },
        {
            id: 'strategy',
            name: 'ESG 策略中心',
            en: 'Strategy Hub',
            desc: '數據視覺化與 AI 影響力建模。識別潛在氣候風險，優化企業永續路徑。',
            icon: <Compass className="w-8 h-8" />,
            color: '#0df2df',
            route: '/strategy-hub',
            steps: [
                { title: '健康檢查 Health Check', description: '執行全維度 ESG 評測，獲取即時評分。', icon: <Activity /> },
                { title: '多維分析 Radar Chart', description: '判讀五角雷達圖，識別管理短板與卓越領域。', icon: <Boxes /> },
                { title: 'AI 戰略建議 Insights', description: '根據數據分析結果，獲取主動式治理與投資建議。', icon: <Activity /> },
                { title: '未來預測 Modeling', description: '模擬不同減碳情境下的財務與環境影響。', icon: <Compass /> }
            ]
        },
        {
            id: 'vault',
            name: '證據保存庫',
            en: 'Evidence Vault',
            desc: '5T 協議的核心：確保數據可溯源、可驗算、不可篡改。每個憑證都是您的知識資產。',
            icon: <ShieldCheck className="w-8 h-8" />,
            color: '#ffd700',
            route: '/quantum-vault',
            steps: [
                { title: '憑證上傳 Vouching', description: '上傳發票、單據或感測器原始日誌。', icon: <FileText /> },
                { title: 'SHA-256 鎖定 Hashing', description: '自動生成文件雜湊值，確保數據歷史誠信。', icon: <Database /> },
                { title: '5T 標註 Labeling', description: '明確標記 Traceable 與 Trustworthy 狀態。', icon: <ShieldCheck /> },
                { title: '資產化 Crystallize', description: '將驗證後的數據轉化為區塊鏈可信資產。', icon: <Boxes /> }
            ]
        },
        {
            id: 'academy',
            name: '善向學院',
            en: 'Sensei Academy',
            desc: 'ESG 系統化學習路徑。從基礎理論到 24 項 MECE 服務的實作教學。',
            icon: <GraduationCap className="w-8 h-8" />,
            color: '#63a6b0',
            route: '/report-tutorial',
            steps: [
                { title: '角色選擇 Learning Persona', description: '定義您的學習角色：從學徒到主權導師。', icon: <GraduationCap /> },
                { title: '課程導覽 Curriculum', description: '探索 24 項 ESG 核心服務的教學課程。', icon: <BookOpen /> },
                { title: '實作演練 Lab', description: '在沙盒環境中練習數據填報與報告編製。', icon: <Boxes /> },
                { title: '授勳認證 Certification', description: '通過考核後獲取專業徽章與能力聲明。', icon: <Badge /> }
            ]
        },
        {
            id: 'hall',
            name: '晉級殿堂',
            en: 'Advancement Hall',
            desc: '平台成長體系的展示場。追蹤您的 XP、等級與已解鎖的 5T 數位卡牌。',
            icon: <Trophy className="w-8 h-8" />,
            color: '#ffd700',
            route: '/advancement-hall',
            steps: [
                { title: '經驗累積 Progression', description: '所有操作皆可轉化為 XP 與學習等級提升。', icon: <Activity /> },
                { title: '徽章牆 Badge Wall', description: '展示您在環境、社會與治理領域的卓越成就。', icon: <Trophy /> },
                { title: '數位卡牌 Assets', description: '查看您擁有的「知識卡牌」，每張卡牌背後都有真實數據。', icon: <Boxes /> },
                { title: '影響力排名 Leaderboard', description: '與全球領先的永續實踐者交流並競爭。', icon: <Trophy /> }
            ]
        }
    ];

    const currentGuide = guides.find(g => g.id === selectedService);

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 pt-24 font-sans relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#63a6b0]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-[#ffd700]/3 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[#63a6b0] w-fit mb-6"
                    >
                        <BookOpen className="w-3 h-3" />
                        服務即教學：平台導引中心
                    </motion.div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 leading-tight">
                        核心功能 <br />
                        <span className="text-[#63a6b0]">流程導覽中心</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-2xl font-light italic">
                        歡迎來到 InfoOne 服務導讀。在這裡，您可以探索平台五大核心功能的操作流程，
                        理解數據如何流轉，並學習如何將 ESG 目標轉化為具體的數位資產。
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guides.map((guide, idx) => (
                        <motion.div
                            key={guide.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedService(guide.id)}
                            className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 cursor-pointer group hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/30 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -top-10 size-40 bg-white/5 rounded-full blur-3xl group-hover:bg-[#63a6b0]/10 transition-colors" />

                            <div
                                className="size-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl transition-all group-hover:scale-110"
                                style={{ backgroundColor: `${guide.color}20`, color: guide.color, border: `1px solid ${guide.color}40` }}
                            >
                                {guide.icon}
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{guide.en}</p>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-[#63a6b0] transition-colors">{guide.name}</h3>
                                <p className="text-sm text-white/40 leading-relaxed font-light italic">{guide.desc}</p>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#63a6b0] opacity-0 group-hover:opacity-100 transition-all">
                                進入教學 Entry Guide <ArrowRight className="w-3 h-3" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Teaching Overlay */}
            {currentGuide && (
                <ServiceOnboardingOverlay
                    isOpen={!!selectedService}
                    onComplete={() => {
                        const route = currentGuide.route;
                        setSelectedService(null);
                        // Optional: Navigate to the service after guide
                        // navigate(route);
                    }}
                    serviceName={currentGuide.name}
                    serviceDesc={currentGuide.desc}
                    steps={currentGuide.steps}
                />
            )}
        </div>
    );
};

export default ServiceGuideCenter;
