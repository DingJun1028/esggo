import React, { useState, useEffect } from 'react';
import { ESGReportContent } from '@/core/dtos/report-schema.dto';
import { Sparkles, ArrowRight, Save, Check, Circle, Zap, History, FileEdit, Send } from 'lucide-react';
import { OneClickDraftModal } from './OneClickDraftModal';
import { useToast } from '@/components/omni/liquid-glass/ToastProvider';

interface Props {
    content: ESGReportContent;
    activeSection: keyof ESGReportContent;
    onUpdate: (section: keyof ESGReportContent, data: { content: string; completed: boolean }) => void;
    onNext: () => void;
}

const EXAMPLES: Record<keyof ESGReportContent, { preview: string; fullContent: string }> = {
    introduction: {
        preview: "本公司成立於 1990 年，致力於引領永續創新。在過去一年中，我們穩健擴展核心業務，同時將 ESG 理念融入企業文化與營運策略中...",
        fullContent: "本公司成立於 1990 年，致力於引領永續創新。在過去一年中，我們穩健擴展核心業務，同時將 ESG 理念融入企業文化與營運策略中。我們深信，企業的成功不應僅建立在短期的財務回報上，更必須建立在對社會、環境及所有利害關係人的長遠承諾上。因此，我們制定了一系列永續發展目標，並將之整合至日常營運的每一個環節中，以期達到商業成長與社會責任的平衡發展。"
    },
    governance: {
        preview: "本公司設有永續發展委員會，由獨立董事擔任召集人。透過定期審查氣候風險與機會，我們確保企業治理架構符合國際標準...",
        fullContent: "本公司設有永續發展委員會，由獨立董事擔任召集人。透過定期審查氣候風險與機會，我們確保企業治理架構符合國際標準。委員會每季度召開一次會議，負責監督本公司永續策略的執行進度，並將重大永續議題呈報董事會。我們也建立了完善的內部控制與稽核機制，確保營運活動符合相關法規要求，並重視商業道德、反貪腐及公平競爭，以建立一個透明、負責且值得信賴的企業治理體系。"
    },
    environmental: {
        preview: "在 2025 年的碳盤查中，我們的 Scope 1 排放量下降了 15%。此外，我們導入了能源管理系統及水資源回收技術...",
        fullContent: "在 2025 年的碳盤查中，我們的 Scope 1 排放量下降了 15%。此外，我們導入了能源管理系統及水資源回收技術，以降低生產過程中的資源消耗。我們承諾持續推動溫室氣體減量計畫，目標是在 2040 年達到淨零排放。針對廢棄物管理，我們遵循「減量、再利用、回收」的原則，致力於提升資源循環利用率，減少對掩埋及焚化的依賴，為保護地球生態環境貢獻一份心力。"
    },
    social: {
        preview: "我們提供員工多元包容的工作環境，並推動社區關懷計畫。今年員工滿意度調查分數達 85/100，無重大工安事故發生...",
        fullContent: "我們提供員工多元包容的工作環境，並推動社區關懷計畫。今年員工滿意度調查分數達 85/100，無重大工安事故發生。我們重視員工的身心健康與職涯發展，提供完善的教育訓練計畫與具競爭力的薪資福利。在社會參與方面，我們與當地社區建立長期合作夥伴關係，透過企業志工活動、教育贊助及弱勢關懷計畫，回饋社會，期望創造更和諧、共榮的社會環境。"
    },
    appendix: {
        preview: "本報告涵蓋期間為 2025/01/01 至 2025/12/31，依照 GRI 準則編製。各項數據皆已經過第三方外部確信（Limited Assurance）...",
        fullContent: "本報告涵蓋期間為 2025/01/01 至 2025/12/31，依照 GRI 準則編製。各項數據皆已經過第三方外部確信（Limited Assurance），以確保資訊的準確性與可靠性。報告中揭露的各項永續績效指標，旨在透明並全面地呈現我們在環境、社會及治理方面的努力與成果。未來，我們將持續優化資料蒐集與管理機制，並定期與利害關係人進行溝通，以期更有效率地推動我們永續發展的進程。"
    },
};

interface SectionStrategy {
    topCompanies: { name: string; feature: string }[];
    scope: string[];
    strategy: string;
    expectedOutcome: string;
}

const STRATEGIES: Record<keyof ESGReportContent, SectionStrategy> = {
    introduction: {
        topCompanies: [
            { name: "台積電 (TSMC)", feature: "以「誠信正直」為首，將ESG融入高階營運方針，高度強調整合性。" },
            { name: "台達電 (Delta)", feature: "強烈連結企業使命「環保 節能 愛地球」，願景明確具感染力。" },
            { name: "玉山金控 (E.SUN)", feature: "以金融業視角強調「氣候變遷與生物多樣性」雙軸轉型。" }
        ],
        scope: ["企業願景與永續承諾", "核心業務與ESG之連結", "年度關鍵永續亮點摘要"],
        strategy: "前言應具備高度的『定調』作用。不需過多繁瑣數據，而是以董事長/CEO的高度，展現企業將永續視為核心競爭力的決心，並預告整份報告的重點結構。",
        expectedOutcome: "一段宏觀、具備領導者高度的宣言，讓讀者第一時間感受到企業的永續決心與未來的戰略方向。"
    },
    governance: {
        topCompanies: [
            { name: "聯發科 (MediaTek)", feature: "建立完善的智財權保護機制與全球營運合規制度。" },
            { name: "日月光 (ASE)", feature: "將氣候變遷風險納入高階薪酬連結，強調治理與績效掛鉤。" },
            { name: "富邦金控 (Fubon)", feature: "永續委員會直隸董事會，落實「資訊安全」與「永續金融」。" }
        ],
        scope: ["董事會結構與多樣性", "永續發展委員會運作", "風險管理與資訊安全", "商業道德與反貪腐"],
        strategy: "治理章節需展現企業的『防護力與執行力』。將ESG風險視為營運風險的一部分，明確描述監督機制與具體的風險管控流程。",
        expectedOutcome: "讓投資人與評級機構看見企業擁有穩健的治理架構，能有效抵禦外部衝擊並落實高標準合規。"
    },
    environmental: {
        topCompanies: [
            { name: "蘋果 (Apple)", feature: "產品生命週期碳足跡透明化，宣示2030年產品全淨零碳排。" },
            { name: "台達電 (Delta)", feature: "內部碳定價(ICP)與RE100高度執行力，從營運端大幅減碳。" },
            { name: "台積電 (TSMC)", feature: "創新的綠色製程與水資源管理，打造業界最高標準循環經濟。" }
        ],
        scope: ["溫室氣體盤查 (Scope 1-3)", "能源與水資源管理", "廢棄物管理與循環經濟", "氣候變遷因應 (TCFD)"],
        strategy: "環境面是最需要『數據化與科學基礎』的章節。運用具體的減量目標(如SBTi)，並展示如何透過技術創新或製程改善來降低環境衝擊。",
        expectedOutcome: "一份具備國際標準對齊度、有明確減量路徑且數據翔實的環境足跡清單。"
    },
    social: {
        topCompanies: [
            { name: "微軟 (Microsoft)", feature: "大幅投入數位包容與無障礙科技，強調科技賦能社會。" },
            { name: "中華電信 (CHT)", feature: "深入偏鄉建設縮短數位落差，並具備極高的員工福利與留任率。" },
            { name: "友達光電 (AUO)", feature: "建構完善的安全健康職場，推動多元共融(DEI)文化。" }
        ],
        scope: ["人才吸引與留任", "多元、平等與共融 (DEI)", "職業安全衛生", "社區參與與社會影響力", "供應商社會責任"],
        strategy: "社會面是展現企業『溫度與影響力』的關鍵。強調企業不僅照顧員工福祉，更能帶動供應鏈與社會共同成長，創造正向外溢效應。",
        expectedOutcome: "展現企業作為良好企業公民的形象，能吸引頂尖人才並獲得社會的廣泛支持。"
    },
    appendix: {
        topCompanies: [
            { name: "國泰金控 (Cathay)", feature: "業界領先的全面確信，涵蓋SASB, GRI, TCFD多重框架對照表。" },
            { name: "沃旭能源 (Ørsted)", feature: "極度透明的方法學揭露，並以第三方最高等級確信背書。" },
            { name: "台泥 (TCC)", feature: "將複雜的水泥業數據轉化為易讀且具備公信力的附錄指標。" }
        ],
        scope: ["GRI/SASB 內容索引", "數據計算方法學", "第三方確信聲明", "5T 驗算與不可篡改證明"],
        strategy: "附錄是整本報告的『防彈衣』。必須提供完整的資料來源、計算公式與第三方驗證憑證，以抵禦漂綠(Greenwashing)的質疑。",
        expectedOutcome: "一份經得起最嚴苛檢驗的數據清單，為整份報告提供堅實的信任基礎。"
    }
};

const SECTION_NAMES: Record<keyof ESGReportContent, string> = {
    introduction: "報告前言與公司概況",
    governance: "永續治理",
    environmental: "環境足跡",
    social: "社會共融與關懷",
    appendix: "附錄與 5T 驗算證明",
};

export function ReportGuidanceAgent({ content, activeSection, onUpdate, onNext }: Props) {
    const data = content[activeSection];
    const [text, setText] = useState(data.content || '');
    const [viewMode, setViewMode] = useState<'strategy' | 'draft' | 'assessment'>('strategy');
    const [showOneClick, setShowOneClick] = useState(false);
    const toast = useToast();

    // Synchronize text when active section or external content changes
    useEffect(() => {
        setText(content[activeSection].content || '');
        setViewMode('strategy'); // Reset to strategy view on section change
    }, [activeSection, content]);

    const handleSave = (completed: boolean) => {
        onUpdate(activeSection, { content: text, completed });
    };

    return (
        <div className="flex flex-col h-full bg-[#0B0D17] border border-white/10 rounded-[2rem] overflow-hidden text-white shadow-2xl">
            {/* Header */}
            <div className="p-6 bg-aqua/10 border-b border-aqua/20 flex items-center gap-4">
                <div className="p-2.5 bg-aqua text-black rounded-xl">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="font-black text-xl text-aqua">JunAiKey 永續精靈</h3>
                    <p className="text-[10px] text-white/50 tracking-[0.2em] font-mono uppercase">Active Guidance Mode</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-black/50 border-b border-white/5">
                <button
                    onClick={() => setViewMode('strategy')}
                    className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${viewMode === 'strategy' ? 'text-aqua border-b-2 border-aqua bg-aqua/5' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    1. 策略
                </button>
                <button
                    onClick={() => setViewMode('draft')}
                    className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${viewMode === 'draft' ? 'text-white border-b-2 border-white bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    2. 撰寫與圖表
                </button>
                <button
                    onClick={() => setViewMode('assessment')}
                    className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${viewMode === 'assessment' ? 'text-[#ffd700] border-b-2 border-[#ffd700] bg-[#ffd700]/5' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    3. 記憶診斷 & OmniTodo
                </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {viewMode === 'strategy' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center shrink-0 mt-1">
                                <Sparkles size={16} className="text-black" />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed rounded-tl-none font-serif">
                                <p className="mb-4">您好！在我們開始撰寫<strong>「{SECTION_NAMES[activeSection]}」</strong>之前，讓我們先來看看國際永續標竿企業是如何準備這個章節的，這能幫助我們定調寫作策略。</p>

                                {/* Top Companies Table */}
                                <div className="mb-5 border border-white/10 rounded-xl overflow-hidden bg-black/40">
                                    <div className="bg-white/5 px-4 py-2 text-[10px] font-black tracking-widest uppercase text-aqua border-b border-white/10">永續年鑑 (S&P Global) 標竿典範</div>
                                    <div className="divide-y divide-white/5 text-xs">
                                        {STRATEGIES[activeSection].topCompanies.map((company, i) => (
                                            <div key={i} className="p-3 grid grid-cols-[110px_1fr] gap-3">
                                                <div className="font-bold text-white/80">{company.name}</div>
                                                <div className="text-white/60">{company.feature}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Expected Scope */}
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] mb-2 border-b border-[#ffd700]/20 pb-1">推薦涵蓋範圍 (Scope)</h4>
                                        <ul className="list-disc list-inside text-xs text-white/70 space-y-1">
                                            {STRATEGIES[activeSection].scope.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>

                                    {/* Writing Strategy */}
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2 border-b border-emerald-400/20 pb-1">寫作策略 (Strategy)</h4>
                                        <p className="text-xs text-white/70">{STRATEGIES[activeSection].strategy}</p>
                                    </div>

                                    {/* Expected Outcome */}
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2 border-b border-blue-400/20 pb-1">預期呈現效果 (Outcome)</h4>
                                        <p className="text-xs text-white/70 italic">{STRATEGIES[activeSection].expectedOutcome}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowOneClick(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-aqua/20 to-blue-500/20 text-aqua border border-aqua/30 rounded-xl text-xs font-black hover:scale-105 transition-all uppercase tracking-widest shadow-lg shadow-aqua/10"
                            >
                                <Zap size={14} className="text-aqua animate-pulse" /> 永續底稿。一鍵完成
                            </button>
                            <button
                                onClick={() => setViewMode('draft')}
                                className="flex items-center gap-2 px-6 py-2 bg-aqua/10 text-aqua border border-aqua/30 rounded-xl text-xs font-bold hover:bg-aqua/20 transition-colors uppercase tracking-widest"
                            >
                                前往撰寫草稿 <ArrowRight size={14} />
                            </button>
                        </div>

                        <OneClickDraftModal
                            isOpen={showOneClick}
                            onClose={() => setShowOneClick(false)}
                            onComplete={(draftContent) => {
                                Object.keys(draftContent).forEach((section) => {
                                    onUpdate(section as keyof ESGReportContent, { content: draftContent[section], completed: true });
                                });
                                toast.success("永續底稿已自動套用", "已成功將 5T 驗證底稿同步至所有章節");
                                setShowOneClick(false);
                            }}
                        />
                    </div>
                )}

                {viewMode === 'draft' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                                <Sparkles size={16} className="text-black" />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed rounded-tl-none font-serif">
                                <p className="mb-3">現在我們進入了<strong>「{SECTION_NAMES[activeSection]}」</strong>的草稿階段。</p>
                                <p className="text-white/70">基於剛才設定的策略，您可以將下方的「數據圖表」拖曳進文字框中，它將會在左側畫布自動生成真實圖表：</p>

                                {/* Draggable Charts Tray */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <div
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', '\n\n[[CHART:CARBON_HEATMAP]]\n\n')}
                                        className="cursor-move bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold hover:bg-emerald-500/30 transition-colors"
                                    >
                                        ≡ 拖曳：溫室氣體熱力圖 (Scope 1-3)
                                    </div>
                                    <div
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', '\n\n[[CHART:GOVERNANCE_RADAR]]\n\n')}
                                        className="cursor-move bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold hover:bg-blue-500/30 transition-colors"
                                    >
                                        ≡ 拖曳：永續治理雷達圖
                                    </div>
                                    <div
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', '\n\n[[CHART:SOCIAL_DIVERSITY]]\n\n')}
                                        className="cursor-move bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold hover:bg-purple-500/30 transition-colors"
                                    >
                                        ≡ 拖曳：多元共融 (DEI) 圓餅圖
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold tracking-widest uppercase text-white/40">您的內容草稿</label>
                                <button
                                    onClick={() => {
                                        const fullContent = EXAMPLES[activeSection].fullContent;
                                        setText(fullContent);
                                        onUpdate(activeSection, { content: fullContent, completed: false });
                                    }}
                                    className="text-[10px] text-aqua hover:text-white transition-colors uppercase tracking-widest bg-aqua/10 px-3 py-1 rounded-full border border-aqua/20"
                                >
                                    套用範本
                                </button>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    // Instant update to preview
                                    onUpdate(activeSection, { content: e.target.value, completed: false });
                                }}
                                placeholder="請在此輸入內容，或把上方的圖表區塊拖曳到這裡..."
                                className="w-full h-64 bg-black border border-white/10 rounded-2xl p-5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-aqua font-serif leading-relaxed text-white/90"
                            />
                        </div>
                    </div>
                )}

                {viewMode === 'assessment' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Assessment / Memory */}
                        <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-2xl p-5 font-serif">
                            <h4 className="flex items-center gap-2 text-[#ffd700] font-bold mb-3 tracking-widest">
                                <Sparkles size={16} /> 整體報告記憶診斷 (AI Memory)
                            </h4>
                            <p className="text-sm text-white/80 leading-relaxed mb-4">
                                我已讀取您目前所有的報告章節。基於前後文一致性，為您進行智能診斷：
                            </p>
                            <ul className="space-y-2 text-xs text-white/70">
                                {content.introduction.content.includes("淨零") || content.introduction.content.includes("碳") || content.introduction.content.includes("能源") ? (
                                    <li className="flex gap-2 items-start"><Check size={14} className="text-emerald-400 mt-0.5" /> <span>前言承諾聯動：前言提及了低碳/淨零願景，建議在「環境足跡」中嵌入對應的具體目標數據以相互呼應。</span></li>
                                ) : (
                                    <li className="flex gap-2 items-start"><Circle size={14} className="text-gray-500 mt-0.5" /> <span>前言建議：若是科技製造業，建議在前言就先揭露對於碳排願景的總體規劃。</span></li>
                                )}
                                {content.governance.completed ? (
                                    <li className="flex gap-2 items-start"><Check size={14} className="text-emerald-400 mt-0.5" /> <span>治理結構已鎖定：已完成治理章節，為附錄的 5T TCFD 連結奠定良好基礎。</span></li>
                                ) : (
                                    <li className="flex gap-2 items-start"><Circle size={14} className="text-red-400 mt-0.5" /> <span>合規性警告：治理章節尚未完成，這是投資機構最首要評測的指標之一。</span></li>
                                )}
                                {content.environmental.completed && content.social.completed ? (
                                    <li className="flex gap-2 items-start"><Check size={14} className="text-emerald-400 mt-0.5" /> <span>環境與社會表現完整：足跡與績效皆已完備，符合國際雙重重大性 (Double Materiality) 揭露原則。</span></li>
                                ) : (
                                    <li className="flex gap-2 items-start"><Circle size={14} className="text-gray-500 mt-0.5" /> <span>待補齊雙重重大性揭露：部分 ES 指標尚處於草稿階段，請接續完成。</span></li>
                                )}
                            </ul>
                        </div>

                        {/* OmniTodo */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 font-serif">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4 tracking-widest text-sm uppercase">
                                永續報告 OmniTodo 聯動區
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { step: '步驟 1：議和與重大性分析', desc: '確認報告範圍與利害關係人期待', done: true },
                                    { step: '步驟 2：跨域規劃與數據蒐集', desc: '整合各部門數據資源', done: true },
                                    { step: '步驟 3：草稿編撰與敘事', desc: '當前階段：逐章完成內容', done: Object.values(content).every(s => s.completed) },
                                    { step: '步驟 4：內部查核與外部確信', desc: '零幻覺驗算與第三方審查', done: false },
                                    { step: '步驟 5：溝通發布與後續行動', desc: '內外部發布與影響力追蹤', done: false }
                                ].map((item, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${item.done ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${item.done ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-white/30 text-transparent'}`}>
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${item.done ? 'text-emerald-400 opacity-70' : 'text-white/90'}`}>
                                                {item.step}
                                            </span>
                                            <span className={`text-[10px] ${item.done ? 'text-emerald-400/50' : 'text-white/50'}`}>
                                                {item.desc}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleSave(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                    <Save size={14} /> 儲存草稿
                </button>
                <button
                    onClick={() => {
                        handleSave(true);
                        onNext();
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-aqua text-black text-xs font-black uppercase tracking-widest hover:bg-aqua/90 transition-all shadow-[0_0_15px_rgba(99,166,176,0.3)]"
                >
                    <Check size={14} /> 完成並下一步 <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
