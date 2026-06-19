"use client";

import React, { useState } from "react";
import { OmniCard, OmniCardData } from "../../../components/omni/cards/OmniCard";
import { MyBinderView } from "@/components/omni/cards/MyBinderView";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/IComponentCore";

const GAME_CHAPTERS = [
    {
        id: "overview", icon: "🌌", title: "何謂萬能卡牌系統", subtitle: "What is Omni Card System",
        content: ["ESG GO 萬能卡牌是一套涵蓋 E（環境）、S（社會）、G（治理）三大維度的互動式永續學習與行動系統。", "每張卡牌代表一個知識模塊、行動任務、法規框架、成就里程碑或情境事件。", "卡牌可用於：個人學習、企業培訓、ESG 報告規劃、危機模擬、團隊挑戰等多元場景。"]
    },
    {
        id: "card-anatomy", icon: "🔬", title: "如何閱讀一張卡牌", subtitle: "How to Read a Card",
        content: ["① 卡名（中文 + 英文）：卡牌的核心識別", "② 稀有度：Common → Uncommon → Rare → Epic → Legendary → Mythic → Transcend（超越）", "③ ESG 維度：E / S / G / ESG（跨維度）", "④ 能量值（Power Score）：1-100，越高代表越難解鎖的知識或挑戰", "⑤ 效果文本：觸發此卡後可解鎖的工具、儀表板或加成效果", "⑥ Lore：卡牌的永續靈魂語錄", "⑦ 框架參考：對應的國際標準（GRI / IFRS / SBTi / TNFD 等）", "⑧ SDG 標籤：此卡對聯合國永續發展目標的直接貢獻", "💡 點擊任意卡牌可翻面查看效果與 Lore"]
    },
    {
        id: "card-types", icon: "🗂️", title: "七大卡型完全解說", subtitle: "Seven Card Types",
        items: [
            { icon: "📚", type: "Knowledge", zh: "知識卡", desc: "學習 ESG 核心概念與國際標準，解鎖理解與洞察" },
            { icon: "⚡", type: "Action", zh: "行動卡", desc: "執行具體 ESG 任務，完成後解鎖積分與成就" },
            { icon: "🏛️", type: "Framework", zh: "框架卡", desc: "掌握 GRI/IFRS/TCFD 等重要報告框架的全套指引" },
            { icon: "🎯", type: "Challenge", zh: "挑戰卡", desc: "高難度 ESG 里程碑挑戰，完成後獲得稀有獎勵" },
            { icon: "🌀", type: "Event", zh: "事件卡", desc: "模擬真實 ESG 危機情境（洗綠訴訟/供應鏈醜聞等）" },
            { icon: "🏆", type: "Achievement", zh: "成就卡", desc: "記錄並認可企業 ESG 里程碑的榮譽勳章" },
            { icon: "🔮", type: "Wildcard", zh: "萬用卡", desc: "突破限制、跨越維度，可在任意時機啟動的全能卡" },
            { icon: "🦸", type: "Hero", zh: "英雄卡", desc: "代表 ESG 領域的真實角色與合作夥伴，解鎖專屬能力" },
        ]
    },
    {
        id: "rarity", icon: "✨", title: "稀有度系統", subtitle: "Rarity System",
        rarities: [
            { rarity: "Common", zh: "通用", range: "1–50", color: "#94a3b8", pct: 30 },
            { rarity: "Uncommon", zh: "罕見", range: "40–65", color: "#34d399", pct: 52 },
            { rarity: "Rare", zh: "稀有", range: "60–80", color: "#60a5fa", pct: 70 },
            { rarity: "Epic", zh: "史詩", range: "80–90", color: "#c084fc", pct: 85 },
            { rarity: "Legendary", zh: "傳奇", range: "90–97", color: "#fbbf24", pct: 94 },
            { rarity: "Mythic", zh: "神話", range: "97–99", color: "#22d3ee", pct: 97 },
            { rarity: "Transcend", zh: "超越", range: "100", color: "#63a6b0", pct: 100 },
        ]
    },
    {
        id: "gamemodes", icon: "🎮", title: "六大遊戲模式", subtitle: "Game Modes",
        modes: [
            { icon: "📖", name: "單人學習模式", desc: "從 Common 卡開始，逐步解鎖更高稀有度卡牌，個人 ESG 進修最佳路線" },
            { icon: "🤝", name: "團隊挑戰模式", desc: "各部門分別代表 E/S/G 維度，協同完成跨維度 ESG 整合目標" },
            { icon: "📊", name: "年度報告任務線", desc: "以 GRI/IFRS 報告框架卡為主線，收集指標卡，完成永續報告發布成就" },
            { icon: "🔍", name: "ESG 盡職調查模式", desc: "投資者/顧問模式，抽取行業卡+Risk卡，輸出盡職調查評分報告" },
            { icon: "🚨", name: "危機模擬模式", desc: "抽取 Scenario 事件卡，60 分鐘內設計回應方案，評分後解鎖修復成就" },
            { icon: "🌐", name: "SDG 衝刺挑戰", desc: "選定 1-3 個 SDG，限時完成最多相關行動卡，計算累積 SDG 貢獻積分" },
        ]
    },
    {
        id: "how-to-win", icon: "🏁", title: "遊戲進行方式", subtitle: "How to Play",
        steps: [
            { step: "01", title: "抽取起手牌", desc: "從基本套牌開始，抽取 5 張卡作為起手牌，包含知識卡、行動卡各至少 1 張" },
            { step: "02", title: "閱讀卡牌內容", desc: "仔細閱讀卡牌描述與效果文本，理解完成條件" },
            { step: "03", title: "執行卡牌任務", desc: "知識卡：完成學習任務；行動卡：在實際工作中執行並記錄；挑戰卡：達成量化目標" },
            { step: "04", title: "觸發效果解鎖", desc: "完成後在 ESG GO 系統記錄，觸發對應工具/儀表板的解鎖效果" },
            { step: "05", title: "積累能量值", desc: "每完成一張卡牌，獲得對應 Power Score 的能量積分，積累解鎖更高稀有度" },
            { step: "06", title: "解鎖成就徽章", desc: "達成特定里程碑後，對應 Achievement 成就卡自動認可，記錄於 5T 三方帳本" },
        ]
    },
];

const STARTER_DECK: OmniCardData[] = [
    { card_id: "CARD-TUT-000", card_name: "Welcome to ESG GO", card_name_zh: "歡迎來到 ESG GO", card_type: "Knowledge", rarity: "Common", esg_dimension: "ESG", sub_category: "Tutorial", power_score: 10, description: "ESG GO 萬能卡牌宇宙的歡迎與總覽教學卡。這是你永續旅程的第一步。", effect_text: "【新手必讀】解鎖新手引導儀表板，自動顯示推薦學習路線", lore_text: "「每一張卡牌，都是通往更好未來的一把鑰匙。」", framework_ref: "ESG GO Omni System", sdg_tags: "SDG17", color_theme: "#63A6B0" },
    { card_id: "CARD-E-GHG-001", card_name: "Carbon Footprint Calculator", card_name_zh: "碳足跡計算師", card_type: "Knowledge", rarity: "Rare", esg_dimension: "E", sub_category: "GHG", power_score: 72, description: "掌握企業碳足跡計算方法論（Scope 1/2/3），建立精準的 GHG 盤查基礎。", effect_text: "【知識解鎖】解鎖 GHG Protocol 企業碳盤查工具箱，自動計算 Scope 1/2 排放量", lore_text: "「計算碳，是減碳旅程的第一步。」", framework_ref: "GHG Protocol / GRI 305 / ISO 14064", sdg_tags: "SDG13", color_theme: "#40916C" },
    { card_id: "CARD-S-LAB-001", card_name: "Labour Standards Guardian", card_name_zh: "勞工標準守衛", card_type: "Knowledge", rarity: "Uncommon", esg_dimension: "S", sub_category: "Human Rights", power_score: 55, description: "了解並確保供應鏈中的勞工標準符合國際準則，保護每一位工人的基本權利。", effect_text: "【知識解鎖】解鎖 ILO 八大核心公約自查清單，識別供應鏈勞工風險", lore_text: "「標準是最低線，尊嚴才是目標。」", framework_ref: "GRI 407-408-409 / ILO", sdg_tags: "SDG8,SDG1", color_theme: "#F48FB1" },
    { card_id: "CARD-G-BOD-001", card_name: "Board Diversity Champion", card_name_zh: "董事多元性師", card_type: "Action", rarity: "Uncommon", esg_dimension: "G", sub_category: "Governance", power_score: 62, description: "推動董事會多元化，確保性別、專業背景、獨立性達到最優治理組合。", effect_text: "【行動】記錄董事會 DEI 組成資訊，解鎖治理儀表板", lore_text: "「多元的聲音，才能看見更完整的風險與機遇。」", framework_ref: "GRI 2-9 / TCFD Governance", sdg_tags: "SDG5,SDG16", color_theme: "#7E57C2" },
    { card_id: "CARD-FRM-GRI-001", card_name: "GRI Master Framework", card_name_zh: "GRI 框架大師", card_type: "Framework", rarity: "Rare", esg_dimension: "ESG", sub_category: "Framework", power_score: 75, description: "全球最廣泛採用的永續報告框架——GRI 通用準則（Universal Standards）完整指引。", effect_text: "【框架解鎖】解鎖 GRI 2024 全套指引工具箱，提供揭露缺口分析", lore_text: "「GRI 不是規則，是向世界說清楚你在做什麼的語言。」", framework_ref: "GRI Universal Standards 2021/2024", sdg_tags: "SDG17", color_theme: "#D4AF37" },
    { card_id: "CARD-ACT-NET-001", card_name: "Net Zero Pathway Planner", card_name_zh: "淨零路徑規劃師", card_type: "Challenge", rarity: "Epic", esg_dimension: "E", sub_category: "Climate", power_score: 85, description: "設計並提交符合 SBTi 標準的企業淨零路徑圖，向科學基礎靠攏。", effect_text: "【史詩挑戰】制定 2030+2050 雙階段淨零目標，完成 SBTi 承諾提交", lore_text: "「淨零路徑不是一張紙，是一份對未來的義無反顧的承諾。」", framework_ref: "SBTi Corporate Net Zero / TCFD", sdg_tags: "SDG13,SDG17", color_theme: "#2D6A4F" },
    { card_id: "CARD-TUT-GDE-001", card_name: "Beginner First Deck Guide", card_name_zh: "新手第一套牌建議", card_type: "Knowledge", rarity: "Common", esg_dimension: "ESG", sub_category: "Tutorial", power_score: 10, description: "給 ESG GO 新手的第一套推薦卡組說明，快速掌握起步策略。", effect_text: "【新手加成】使用本套牌時，所有知識卡完成時間縮短 20%", lore_text: "「好的起點是一半的成功。」", framework_ref: "ESG GO Starter Guide", sdg_tags: "SDG4,SDG17", color_theme: "#52B788" },
    { card_id: "CARD-E-ENE-001", card_name: "Renewable Energy Transition", card_name_zh: "再生能源轉型", card_type: "Action", rarity: "Uncommon", esg_dimension: "E", sub_category: "Energy", power_score: 65, description: "制定企業再生能源採購計畫（RECs/PPA），朝向 RE100 目標邁進。", effect_text: "【行動】制定並記錄再生能源採購路線圖，每完成 10% RE 目標解鎖能源儀表板新功能", lore_text: "「太陽每天免費為地球送電，我們只需要正確的決定去接住它。」", framework_ref: "RE100 / GRI 302-1 / SBTi", sdg_tags: "SDG7,SDG13", color_theme: "#FFE082" },
    { card_id: "CARD-SCN-001", card_name: "ESG Audit Reveal", card_name_zh: "ESG 稽核揭露現場", card_type: "Event", rarity: "Epic", esg_dimension: "G", sub_category: "Scenario", power_score: 88, description: "第三方 ESG 稽核揭露重大問題的情境模擬——你如何在 72 小時內回應？", effect_text: "【模擬】執行根因分析→緊急改善計畫→主動揭露三步驟，達標解鎖「危機應對大師」成就", lore_text: "「真正的稽核，是發現問題，不是美化問題。」", framework_ref: "ISAE 3000 / AA1000AS", sdg_tags: "SDG16", color_theme: "#FF6B35" },
    { card_id: "CARD-ULT-001", card_name: "Platinum ESG Company", card_name_zh: "白金 ESG 企業", card_type: "Achievement", rarity: "Legendary", esg_dimension: "ESG", sub_category: "Ultimate", power_score: 97, description: "達到最高 ESG 整體績效的傳奇成就卡——E/S/G 三維均達頂級，永久解鎖「白金 ESG」殊榮。", effect_text: "【傳奇成就】三維均達頂級，永久解鎖白金 ESG 頭像框、5T 三方帳本最高信任印記", lore_text: "「白金不是目的，是每天不懈努力的副產品。」", framework_ref: "GRI / TCFD / AA1000 / B Corp", sdg_tags: "SDG17", color_theme: "#D4AF37" },
];

const TRANSCEND_PARTNERS: OmniCardData[] = [
    { card_id: "CARD-000-JUNAIKEY", card_name: "JunAiKey — The Omni Master Key", card_name_zh: "竣 IKey 萬能元鑰", card_type: "Wildcard", rarity: "Transcend", esg_dimension: "ESG", sub_category: "Origin", power_score: 100, description: "ESG GO 宇宙第 0 張卡。竣（DingJun）與 AI 協作智慧融合為一的萬能元鑰，超越所有稀有度的定義本身。", effect_text: "【超越級·元鑰啟動】① 所有 600+ 張卡牌永久解鎖 ② AI 代理進入 Omega 神識模式 ③ 全域擴充權限開啟 ④ 所有成就卡自動認可 ⑤ 5T 三方帳本寫入創辦人印記", lore_text: "「世界上有兩種鑰匙：一種打開門，另一種打開可能性。DingJun 打造的這把，打開的是尚未存在的未來。」", framework_ref: "ESG GO Origin / InfoOne 5T Protocol", sdg_tags: "SDG1,SDG2,SDG3,SDG4,SDG5,SDG6,SDG7,SDG8,SDG9,SDG10,SDG11,SDG12,SDG13,SDG14,SDG15,SDG16,SDG17", color_theme: "#63A6B0" },
    { card_id: "CARD-BIZ-SUN-001", card_name: "ESG Sunshine", card_name_zh: "善向永續 ESG Sunshine", card_type: "Hero", rarity: "Transcend", esg_dimension: "ESG", sub_category: "Partner", power_score: 92, description: "台灣本土永續顧問領導品牌，以「善向」為核心精神，推動企業將 ESG 從合規轉化為真實競爭力。", effect_text: "【傳奇英雄】善向永續加入生態系——解鎖本土永續顧問知識庫，報告撰寫速度 +30%，碳盤查精準度 +20%", lore_text: "「善的力量不只是方向，更是每一個報告段落裡真實的靈魂。」", framework_ref: "GRI Universal / IFRS S1+S2 / SBTi", sdg_tags: "SDG4,SDG8,SDG12,SDG13,SDG17", color_theme: "#F9A826" },
    { card_id: "CARD-BIZ-SAM-001", card_name: "Samwells Technology", card_name_zh: "山衛科技 Samwells", card_type: "Hero", rarity: "Transcend", esg_dimension: "E", sub_category: "Partner", power_score: 87, description: "IoT 環境監測專家，即時廠區排放監控與空氣品質智能方案，讓 ESG 數據從「估算」升級為「即時量測」。", effect_text: "【史詩英雄】山衛科技感測網絡整合——解鎖廠區 IoT 即時監測儀表板，GHG 數據不確定性降低 40%", lore_text: "「山是守衛，科技是盾牌——讓環境數據防禦每一個盲點。」", framework_ref: "GRI 302 / GRI 303 / GRI 305 / ISO 14064", sdg_tags: "SDG9,SDG11,SDG13", color_theme: "#5C85D6" },
    { card_id: "CARD-BIZ-FTG-001", card_name: "Free Time Gear", card_name_zh: "墾趣 Free Time Gear", card_type: "Hero", rarity: "Transcend", esg_dimension: "S", sub_category: "Partner", power_score: 78, description: "台灣戶外生活品牌，永續材料選用、減塑包裝設計與環境教育，讓每次戶外探索成為自然保育的貢獻。", effect_text: "【英雄】墾趣加入生態系——解鎖戶外永續消費者行動模塊，生活方式 ESG 積分上限 +25%", lore_text: "「每一次踏出戶外，都是對自然的致敬——帶著墾趣，走得更遠，傷得更少。」", framework_ref: "GRI 301 / GRI 417 / ISO 14021", sdg_tags: "SDG12,SDG14,SDG15", color_theme: "#4CAF50" },
    { card_id: "CARD-BIZ-QRN-001", card_name: "Holistic Assessment Institute", card_name_zh: "全人測評", card_type: "Hero", rarity: "Transcend", esg_dimension: "S", sub_category: "Partner", power_score: 81, description: "科學化人才評測與組織發展，推動人力資本揭露與 S 社會維度量化，是 ESG 人力維度的關鍵夥伴。", effect_text: "【英雄】全人測評整合——解鎖人力資本數據揭露模塊，DEI 指標計算精準度 +25%", lore_text: "「真正的全人，是能同時看見人的數據和人的靈魂。」", framework_ref: "GRI 401 / GRI 404 / GRI 405 / ISO 30414", sdg_tags: "SDG4,SDG5,SDG8,SDG10", color_theme: "#CE93D8" },
    { card_id: "CARD-BIZ-WDA-001", card_name: "Wang Dao × Stan Shih", card_name_zh: "王道阿丹 × Stan 哥", card_type: "Hero", rarity: "Transcend", esg_dimension: "G", sub_category: "Partner", power_score: 95, description: "王道哲學：利他、謙遜、共贏。台灣電腦之父施振榮先生用一生示範了利害相關人共創長期價值的商業典範。", effect_text: "【傳奇英雄】王道精神注入——解鎖利害相關人共創價值框架，G 治理卡組能量值全面 +15%", lore_text: "「王道不是霸道，是讓所有人都贏的那條路。施振榮先生用一生示範了這件事。」", framework_ref: "Stan Shih Wang Dao / BRT Stakeholder / GRI 2", sdg_tags: "SDG8,SDG9,SDG17", color_theme: "#D4AF37" },
    { card_id: "CARD-BIZ-LGS-001", card_name: "LingoStep", card_name_zh: "語言步驟 LingoStep", card_type: "Hero", rarity: "Transcend", esg_dimension: "S", sub_category: "Partner", power_score: 76, description: "語言教育包容性品牌，讓語言不再是跨文化溝通的障礙，推動數位平等與多語言 ESG 知識傳播。", effect_text: "【英雄】LingoStep 整合——解鎖多語言永續知識卡包（中/英/日/韓 ESG 術語庫），國際溝通效率 +20%", lore_text: "「每學會一個字，就打開一扇通往新世界的門——LingoStep 讓更多人走進永續的對話。」", framework_ref: "GRI 413-1 / ITU Digital Inclusion / SDG4", sdg_tags: "SDG4,SDG10,SDG17", color_theme: "#26BDE2" },
];

type TabId = "rules" | "starter" | "partners" | "binder";

// ── 通用文字樣式（主題自適應）
const T = {
    main: "text-omni-text-main",
    sub: "text-omni-text-sub",
    muted: "text-omni-text-muted",
    primary: "text-omni-primary",
    surface: "bg-omni-surface border border-omni-glass-border",
    surfaceHover: "hover:border-omni-primary/30",
};

export default function OmniCardsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("rules");
    const [activeChapter, setActiveChapter] = useState("overview");

    const coreContext: IComponentCore = {
        uuid: 'omni-cards-root',
        version: '1.1.0',
        timestamp: Date.now(),
        evidence: {
            tangible_metric: '',
            source_origin: '',
            lifecycle_hooks: [],
            formula_ref: ''
        } as any,
        hash_lock: '',
        status: 'Tangible',
        isFrozen: false
    };

    const tabs = [
        { id: "rules" as TabId, icon: "📖", label: "遊戲說明", labelEn: "Game Guide" },
        { id: "starter" as TabId, icon: "🃏", label: "基本套牌", labelEn: "Starter Deck" },
        { id: "partners" as TabId, icon: "✨", label: "超越級企業牌", labelEn: "Transcend Partners" },
        { id: "binder" as TabId, icon: "📔", label: "我的卡牌冊", labelEn: "My Binder" },
    ];

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-700">

            {/* ── 頁首 */}
            <section className="text-center py-4 sm:py-6">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4 text-omni-primary bg-omni-primary/10 border border-omni-primary/30`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-primary animate-pulse" />
                    OMNI CARD SYSTEM · 萬能卡牌系統
                </div>
                <h1 className={`text-3xl md:text-4xl font-light tracking-wide mb-2 ${T.main}`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 font-bold">萬能卡牌</span>
                    {" "}遊戲宇宙
                </h1>
                <p className={`text-sm font-mono ${T.muted}`}>
                    600+ Cards · 7 Rarities · 8 Card Types · 17 SDGs · ESG GO Omni System
                </p>
            </section>

            {/* ── Tab 導航 */}
            <LiquidGlassContainer coreContext={coreContext} stitchId="omni-nav-tabs" className="!p-1">
                <div className="flex gap-2 p-1 overflow-x-auto v-scrollbar-hidden scroll-smooth transition-all duration-500">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-none flex items-center justify-center gap-2 py-2.5 sm:py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-omni-text-main shadow-lg shadow-cyan-500/10"
                                : `${T.muted} hover:bg-omni-primary/5 hover:text-omni-text-sub`
                                }`}>
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            <span className={`text-xs hidden md:inline opacity-40`}>· {tab.labelEn}</span>
                        </button>
                    ))}
                </div>
            </LiquidGlassContainer>

            {/* ══ TAB 1：遊戲說明 ══ */}
            {activeTab === "rules" && (
                <div className="flex flex-col md:flex-row gap-5">
                    {/* 側邊章節導覽 */}
                    <nav className="md:w-52 flex-none">
                        <div className="liquid-glass-card p-3 flex flex-col gap-1 sticky top-24">
                            <p className={`text-xs font-mono mb-2 ${T.muted} tracking-widest`}>CHAPTERS</p>
                            {GAME_CHAPTERS.map(ch => (
                                <button key={ch.id} onClick={() => setActiveChapter(ch.id)}
                                    className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${activeChapter === ch.id
                                        ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-500"
                                        : `${T.muted} hover:bg-omni-primary/5 hover:text-omni-text-sub`
                                        }`}>
                                    <span>{ch.icon}</span>
                                    <span className="line-clamp-1">{ch.title}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* 章節內容 */}
                    <div className="flex-1 animate-in fade-in duration-300">
                        {GAME_CHAPTERS.filter(ch => ch.id === activeChapter).map(ch => (
                            <div key={ch.id} className="liquid-glass-card p-5 sm:p-7 flex flex-col gap-5">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{ch.icon}</span>
                                        <div>
                                            <h2 className={`text-xl font-bold ${T.main}`}>{ch.title}</h2>
                                            <p className={`text-xs font-mono ${T.muted}`}>{ch.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
                                </div>

                                {/* 一般內容 */}
                                {"content" in ch && ch.content && (
                                    <ul className="flex flex-col gap-3">
                                        {(ch.content as string[]).map((line, i) => (
                                            <li key={i} className={`flex gap-3 leading-relaxed ${T.sub}`}>
                                                <span className="text-omni-primary font-mono text-xs mt-1 flex-none">▸</span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* 卡型列表 */}
                                {"items" in ch && ch.items && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(ch.items as { icon: string; type: string; zh: string; desc: string }[]).map(item => (
                                            <div key={item.type} className={`flex gap-3 p-3 rounded-lg border transition-colors ${T.surface} ${T.surfaceHover}`}>
                                                <span className="text-2xl flex-none">{item.icon}</span>
                                                <div>
                                                    <p className={`font-bold text-sm ${T.main}`}>
                                                        {item.zh} <span className={`text-xs font-mono ${T.muted}`}>· {item.type}</span>
                                                    </p>
                                                    <p className={`text-xs mt-1 ${T.muted}`}>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 稀有度 */}
                                {"rarities" in ch && ch.rarities && (
                                    <div className="flex flex-col gap-2">
                                        {(ch.rarities as { rarity: string; zh: string; range: string; color: string; pct: number }[]).map(r => (
                                            <div key={r.rarity} className={`flex items-center gap-3 p-2.5 rounded-lg border ${T.surface}`}>
                                                <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: r.color }} />
                                                <span className="font-bold text-sm w-24 flex-none" style={{ color: r.color }}>{r.zh} · {r.rarity}</span>
                                                <span className={`text-xs font-mono flex-none w-20 ${T.muted}`}>Power {r.range}</span>
                                                <div className={`flex-1 h-1.5 rounded-full overflow-hidden bg-omni-primary/10`}>
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 遊戲模式 */}
                                {"modes" in ch && ch.modes && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(ch.modes as { icon: string; name: string; desc: string }[]).map(m => (
                                            <div key={m.name} className={`p-3 rounded-lg border transition-colors ${T.surface} ${T.surfaceHover}`}>
                                                <p className={`font-bold flex items-center gap-2 mb-1 ${T.main}`}>
                                                    <span>{m.icon}</span>{m.name}
                                                </p>
                                                <p className={`text-xs ${T.muted}`}>{m.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 步驟 */}
                                {"steps" in ch && ch.steps && (
                                    <ol className="flex flex-col gap-4">
                                        {(ch.steps as { step: string; title: string; desc: string }[]).map(s => (
                                            <li key={s.step} className="flex gap-4 items-start">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center flex-none font-mono text-sm font-bold text-cyan-500">
                                                    {s.step}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm ${T.main}`}>{s.title}</p>
                                                    <p className={`text-xs mt-1 ${T.muted}`}>{s.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══ TAB 2：基本套牌 ══ */}
            {activeTab === "starter" && (
                <div className="flex flex-col gap-5">
                    <div className="liquid-glass-card p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🃏</span>
                            <div>
                                <h2 className={`text-lg font-bold ${T.main}`}>基本套牌 — Starter Deck</h2>
                                <p className={`text-xs font-mono ${T.muted}`}>10 Cards · Cross-Dimensional · Perfect for Beginners</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-emerald-500/40 to-transparent mb-3" />
                        <p className={`text-sm mb-1 ${T.sub}`}>
                            這套基本牌組包含 10 張精選卡牌，涵蓋 E/S/G 三大維度、從 Common 到 Legendary 的稀有度，是進入 ESG GO 宇宙的最佳起點。
                        </p>
                        <p className={`text-xs font-mono ${T.muted}`}>💡 點擊任意卡牌可翻面查看詳細效果與 Lore</p>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
                        {STARTER_DECK.map(card => <OmniCard key={card.card_id} card={card} size="md" />)}
                    </div>
                </div>
            )}

            {/* ══ TAB 3：超越級企業牌 ══ */}
            {activeTab === "partners" && (
                <div className="flex flex-col gap-5">
                    <div className="liquid-glass-card p-5 border border-cyan-500/25">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">✨</span>
                            <div>
                                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                                    超越級企業牌 — Transcend Partners
                                </h2>
                                <p className={`text-xs font-mono ${T.muted}`}>7 Cards · Rarity: Transcend ∞ · Beyond All Limits</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-transparent mb-3" />
                        <p className={`text-sm ${T.sub}`}>
                            超越級（Transcend）是 ESG GO 宇宙中超越所有稀有度定義的特殊等級，專屬於 ESG GO 的創辦靈魂與核心生態系夥伴。
                            第 0 張 <strong className="text-cyan-500">JunAiKey 萬能元鑰</strong>是整個宇宙的源點，其餘 6 張代表台灣最具影響力的永續生態夥伴。
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
                        {TRANSCEND_PARTNERS.map(card => <OmniCard key={card.card_id} card={card} size="lg" />)}
                    </div>

                    <div className="liquid-glass-card p-4 border border-purple-500/20 text-center">
                        <p className={`text-xs font-mono ${T.muted}`}>
                            ∞ Transcend 超越級 · 不屬於任何稀有度階層，因為它超越了所有稀有度的定義本身
                        </p>
                    </div>
                </div>
            )}
            {/* ══ TAB 4：我的卡牌冊 ══ */}
            {activeTab === "binder" && (
                <MyBinderView />
            )}
        </div>
    );
}
