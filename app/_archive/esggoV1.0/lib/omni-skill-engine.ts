/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  OmniSkill Engine v1.0 — 萬能技能樹系統                      ║
 * ║  從萬能之心 (OmniHeart) 升起，自動習得各角色專屬技能族譜     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Skill Taxonomy (技能分類法):
 *  - Combo      (連續技) — Sequential chains that flow from one to next
 *  - Combination(組合技) — Two skills synergize for amplified effect
 *  - Ultimate   (奧義)   — Highest-tier ability, unique per role
 *  - Special    (絕招)   — Signature powerful move, signature style
 *  - Passive    (被動天賦) — Always-on, quietly empowers everything
 *
 * 萬能永憶分配系統 (OmniMemory Allocation):
 *  Skills are "allocated" from OmniHeart's memory pool and logged
 *  as ancestral records (元祖記載) — fully traceable & auditable.
 */

import { IOmniHeart, logAuditAction, AuditLogItem } from "@/lib/omni-heart";

// ─────────────────────────────────────────────
// Skill Type Taxonomy
// ─────────────────────────────────────────────

export type SkillType = "combo" | "combination" | "ultimate" | "special" | "passive";

export type OmniRole =
    | "ReportScribe"      // 報告聖典撰寫者
    | "DataAlchemist"     // 數據鍊金術士
    | "ComplianceOracle"  // 合規神諭
    | "StrategyMaestro"   // 戰略大師
    | "AuditSentinel";    // 稽核守衛

// ─────────────────────────────────────────────
// Base Skill Interface
// ─────────────────────────────────────────────

export interface OmniSkill {
    readonly id: string;
    readonly name: string;          // Chinese name: "連鎖生態分析術"
    readonly nameEn?: string;
    readonly type: SkillType;
    readonly role: OmniRole;
    readonly tier: 1 | 2 | 3;      // 1=Basic, 2=Advanced, 3=Master
    readonly description: string;
    readonly trigger: string;       // When does this activate?
    readonly effect: string;        // Concrete mechanical effect
    readonly cooldown?: number;     // ms between uses (for runtime throttling)
    readonly comboNextIds?: string[]; // IDs of skills that can chain after this
    readonly requires?: string[];   // IDs of prerequisite skills
    readonly griAnchor?: string[];  // GRI standards this skill empowers
    readonly memoryWeight: number;  // Cost in OmniMemory pool (1-10)
}

// A Combination Skill (組合技) references two parent skills
export interface OmniComboSkill extends OmniSkill {
    readonly type: "combination";
    readonly parentSkillIds: [string, string]; // Exactly two skills combine
    readonly synergyMultiplier: number;        // e.g., 2.5 = 250% effectiveness
}

// ─────────────────────────────────────────────
// Skill Tree — per Role
// ─────────────────────────────────────────────

export interface OmniSkillTree {
    readonly role: OmniRole;
    readonly roleTitle: string;     // "報告聖典撰寫者"
    readonly roleMotto: string;     // Inspirational motto
    readonly passives: OmniSkill[]; // Always-on: shape everything
    readonly combos: OmniSkill[];   // Sequential chains
    readonly combinations: OmniComboSkill[]; // Synergies
    readonly special: OmniSkill;    // 絕招 — signature move
    readonly ultimate: OmniSkill;   // 奧義 — highest tier
}

// ─────────────────────────────────────────────
// Memory Log Entry (元祖記載)
// ─────────────────────────────────────────────

export interface SkillMemoryLog {
    readonly id: string;
    readonly timestamp: string;
    readonly role: OmniRole;
    readonly skillId: string;
    readonly skillName: string;
    readonly skillType: SkillType;
    readonly heartHash: string;     // OmniHeart hash (Current Hash)
    readonly parentHash?: string;   // Traceability: parent hash in the chain
    readonly integrityHash?: string; // Verifiable integrity proof
    readonly context: string;       // What triggered this skill
    readonly outcome?: string;      // Result of skill activation
    readonly memoryCost: number;
}

// ─────────────────────────────────────────────
// 萬能永憶分配系統 — OmniMemory Pool
// ─────────────────────────────────────────────

export interface OmniMemoryPool {
    totalCapacity: number;             // Total memory units available (Expandable)
    allocatedMemory: number;           // Currently used
    experience: number;                // Current experience points
    level: number;                     // Memory Pool level
    skillLogs: SkillMemoryLog[];       // 元祖記載 — ancestral log
    unlockedSkillIds: Set<string>;     // Skills auto-learned by the role
}

// ─────────────────────────────────────────────
// SKILL TREES DEFINITIONS
// ─────────────────────────────────────────────

export const OMNI_SKILL_TREES: Record<OmniRole, OmniSkillTree> = {

    // ═══════════════════════════════════════════
    // 1. ReportScribe — 報告聖典撰寫者
    // ═══════════════════════════════════════════
    ReportScribe: {
        role: "ReportScribe",
        roleTitle: "報告聖典撰寫者",
        roleMotto: "以文字鑄造信任，以章節傳遞承諾",
        passives: [
            {
                id: "rs-p1",
                name: "文氣感知術",
                nameEn: "Narrative Sense",
                type: "passive",
                role: "ReportScribe",
                tier: 1,
                description: "被動感知所有章節的語氣一致性，自動提示風格偏差",
                trigger: "章節內容變動時，自動觸發",
                effect: "全域語氣追蹤：首頁一致性分數 +15%；偵測並標記被動語氣句",
                griAnchor: ["GRI 2-22"],
                memoryWeight: 1,
            },
            {
                id: "rs-p2",
                name: "GRI 標準意識",
                nameEn: "GRI Standard Awareness",
                type: "passive",
                role: "ReportScribe",
                tier: 1,
                description: "自動將所有撰寫內容對標至最相關的 GRI 準則",
                trigger: "儲存章節草稿時，自動觸發",
                effect: "每段落附加 GRI 標籤建議；未對標段落自動標示橙色警示",
                griAnchor: ["GRI 3-3"],
                memoryWeight: 2,
            },
        ],
        combos: [
            {
                id: "rs-c1",
                name: "三刀流撰述術",
                nameEn: "Triple-Blade Narration",
                type: "combo",
                role: "ReportScribe",
                tier: 2,
                description: "連續執行：Why→What→How 三段式敘述框架，一氣呵成",
                trigger: "使用者開啟章節撰寫模式",
                effect: "自動生成三段架構草稿；提示缺失的數據錨點；完成後觸發自動存證",
                comboNextIds: ["rs-c2"],
                griAnchor: ["GRI 3-3", "GRI 2-22"],
                memoryWeight: 4,
            },
            {
                id: "rs-c2",
                name: "數據血肉注入",
                nameEn: "Data Embodiment",
                type: "combo",
                role: "ReportScribe",
                tier: 2,
                description: "在三刀流完成後，自動從數據庫抽取相關指標數值嵌入草稿",
                trigger: "rs-c1 完成後自動觸發",
                effect: "數值自動填入空白指標槽；信心指數低於 70% 的數值以紅色標記",
                requires: ["rs-c1"],
                memoryWeight: 3,
            },
        ],
        combinations: [
            {
                id: "rs-combo1",
                name: "聖典封印術",
                nameEn: "Scripture Seal Technique",
                type: "combination",
                role: "ReportScribe",
                tier: 3,
                description: "文氣感知術 × 數據血肉注入 的終極組合：語義完美校驗後立即 ZKP 封印",
                trigger: "rs-p1 + rs-c2 同頁面均為 ACTIVE 時，解鎖",
                effect: "語義一致性分數提升 40%；自動生成 ZKP 封印摘要；章節狀態升格為 SACRED",
                parentSkillIds: ["rs-p1", "rs-c2"],
                synergyMultiplier: 2.5,
                griAnchor: ["GRI 2-22", "GRI 3-3"],
                memoryWeight: 7,
            },
        ],
        special: {
            id: "rs-s1",
            name: "千字不落·疾書絕技",
            nameEn: "Thousand-Word Maelstrom",
            type: "special",
            role: "ReportScribe",
            tier: 3,
            description: "絕招：啟動 AI 多節點平行撰寫，同時處理 3 個章節草稿",
            trigger: "使用者點擊「一鍵生成全章節」",
            effect: "3 個章節同時進入 AI 撰寫模式；各章節字數達標後自動儲存；顯示實時進度條",
            cooldown: 300000, // 5 min
            memoryWeight: 8,
        },
        ultimate: {
            id: "rs-u1",
            name: "永憶聖典降臨·奧義",
            nameEn: "Eternal Scripture Descent · Ultimate",
            type: "ultimate",
            role: "ReportScribe",
            tier: 3,
            description: "奧義：將整本報告書的所有章節進行最終語義一致性審查，並生成完整的報告摘要、GRI 索引和可信度聲明",
            trigger: "所有章節均達成 DRAFTED 狀態後解鎖",
            effect: "全書語義審查 (AI 3-Chain)；自動生成執行摘要、GRI 索引、第三方確信自評表；輸出標準 PDF 結構",
            requires: ["rs-p1", "rs-p2", "rs-c1", "rs-c2", "rs-combo1"],
            griAnchor: ["GRI 3-1", "GRI 3-2", "GRI 3-3", "GRI 2-22"],
            memoryWeight: 10,
        },
    },

    // ═══════════════════════════════════════════
    // 2. DataAlchemist — 數據鍊金術士
    // ═══════════════════════════════════════════
    DataAlchemist: {
        role: "DataAlchemist",
        roleTitle: "數據鍊金術士",
        roleMotto: "以原子之力，鍛造黃金數據",
        passives: [
            {
                id: "da-p1",
                name: "數據感知場",
                nameEn: "Data Sense Field",
                type: "passive",
                role: "DataAlchemist",
                tier: 1,
                description: "自動偵測所有輸入數值的單位一致性和量級合理性",
                trigger: "任何指標欄位輸入時自動觸發",
                effect: "單位不符自動警示；異常數值（±3σ）標記紅旗",
                memoryWeight: 2,
            },
            {
                id: "da-p2",
                name: "指標血脈追蹤",
                nameEn: "Indicator Lineage Tracking",
                type: "passive",
                role: "DataAlchemist",
                tier: 2,
                description: "追蹤每個數據點的來源、版本歷史和關聯指標",
                trigger: "指標被引用或修改時觸發",
                effect: "完整資料血統樹；版本 diff 顯示；影響分析 (哪些章節引用了此數據)",
                griAnchor: ["GRI 2-5"],
                memoryWeight: 2,
            },
        ],
        combos: [
            {
                id: "da-c1",
                name: "範疇三原子裂解術",
                nameEn: "Scope 3 Atomic Fission",
                type: "combo",
                role: "DataAlchemist",
                tier: 2,
                description: "連鎖拆解 Scope 3 供應鏈排放：原料→製造→運輸→使用→廢棄 五段計算",
                trigger: "使用者填入 Scope 3 指標時觸發",
                effect: "自動拆分 15 個 Scope 3 類別；按優先順序排列；提供同業平均對比",
                comboNextIds: ["da-c2"],
                griAnchor: ["GRI 305-3"],
                memoryWeight: 5,
            },
            {
                id: "da-c2",
                name: "碳強度自動換算陣",
                nameEn: "Carbon Intensity Auto-Matrix",
                type: "combo",
                role: "DataAlchemist",
                tier: 2,
                description: "在 Scope 3 完成後，自動換算碳強度並對標 SBTi 目標進度",
                trigger: "da-c1 完成後觸發",
                effect: "計算 tCO₂e/百萬收入；顯示距 SBTi 目標的差距百分比；圖表可視化",
                requires: ["da-c1"],
                griAnchor: ["GRI 305-4"],
                memoryWeight: 3,
            },
        ],
        combinations: [
            {
                id: "da-combo1",
                name: "黃金數據聖骸·組合術",
                nameEn: "Golden Data Relic Fusion",
                type: "combination",
                role: "DataAlchemist",
                tier: 3,
                description: "數據感知場 × 指標血脈追蹤：完美數據溯源鏈，達成 5T 最高認證",
                trigger: "da-p1 + da-p2 均為 ACTIVE，且有數據被引用時",
                effect: "自動生成「數據可信度報告」；5T 協議完整認證；溯源鏈視覺圖",
                parentSkillIds: ["da-p1", "da-p2"],
                synergyMultiplier: 3.0,
                griAnchor: ["GRI 2-5"],
                memoryWeight: 8,
            },
        ],
        special: {
            id: "da-s1",
            name: "鍊金大轉化·絕招",
            nameEn: "Grand Transmutation",
            type: "special",
            role: "DataAlchemist",
            tier: 3,
            description: "絕招：將上傳的任意 Excel/PDF 一鍵解構為標準化 ESG 原子指標資料",
            trigger: "使用者上傳非結構化數據檔案",
            effect: "OCR 萃取 + AI 映射 + 自動填入指標庫；準確率 > 85% 時自動確認",
            cooldown: 120000,
            memoryWeight: 9,
        },
        ultimate: {
            id: "da-u1",
            name: "萬象資料大崩解·奧義",
            nameEn: "Universal Data Dissolution · Ultimate",
            type: "ultimate",
            role: "DataAlchemist",
            tier: 3,
            description: "奧義：全公司數據體系一次性盤點——從所有輸入數據生成完整的 E/S/G/D 指標全圖譜，附帶缺口分析和填補方案",
            trigger: "指標庫填寫比例 > 60% 後解鎖",
            effect: "生成「數據完整性全景圖」；識別所有空缺指標；AI 建議數據獲取方案；輸出指標看板",
            requires: ["da-p1", "da-p2", "da-c1", "da-combo1"],
            griAnchor: ["GRI 305-1", "GRI 305-2", "GRI 305-3", "GRI 302-1", "GRI 303-3"],
            memoryWeight: 10,
        },
    },

    // ═══════════════════════════════════════════
    // 3. ComplianceOracle — 合規神諭
    // ═══════════════════════════════════════════
    ComplianceOracle: {
        role: "ComplianceOracle",
        roleTitle: "合規神諭",
        roleMotto: "法令即道，合規即道之行",
        passives: [
            {
                id: "co-p1",
                name: "法令意識之眼",
                nameEn: "Regulatory Awareness Eye",
                type: "passive",
                role: "ComplianceOracle",
                tier: 1,
                description: "時刻監測報告內容是否觸碰最新金管會、TWSE 或 GRI 標準要求",
                trigger: "報告任何內容更新時",
                effect: "即時法令對照；不達標章節標示黃色；重大缺漏標示紅色",
                griAnchor: ["GRI 3-1"],
                memoryWeight: 3,
            },
            {
                id: "co-p2",
                name: "MECE 完整性守護",
                nameEn: "MECE Completeness Guardian",
                type: "passive",
                role: "ComplianceOracle",
                tier: 2,
                description: "確保每個議題的揭露做到 MECE（相互獨立、完全窮盡）",
                trigger: "新增或修改重大議題時",
                effect: "重疊議題警示；遺漏類別提示；MECE 矩陣視覺化分數",
                memoryWeight: 2,
            },
        ],
        combos: [
            {
                id: "co-c1",
                name: "GRI 映射鎖鏈術",
                nameEn: "GRI Mapping Chain",
                type: "combo",
                role: "ComplianceOracle",
                tier: 2,
                description: "按順序執行：重大議題→GRI 對標→揭露完整度→缺口評估",
                trigger: "使用者啟動「合規檢查」",
                effect: "每個重大議題自動配對最相關的 GRI 準則；計算對標完整率；輸出缺口清單",
                comboNextIds: ["co-c2"],
                griAnchor: ["GRI 3-1", "GRI 3-2"],
                memoryWeight: 5,
            },
            {
                id: "co-c2",
                name: "第三方確信預備術",
                nameEn: "Third-Party Assurance Prep",
                type: "combo",
                role: "ComplianceOracle",
                tier: 2,
                description: "GRI 映射完成後，自動生成「查核準備清單」供第三方稽核機構使用",
                trigger: "co-c1 完成後觸發",
                effect: "輸出 AA1000 格式稽核準備文件；列出所需佐證資料；預計查核時間估算",
                requires: ["co-c1"],
                memoryWeight: 4,
            },
        ],
        combinations: [
            {
                id: "co-combo1",
                name: "神諭封印·組合術",
                nameEn: "Oracle Seal Fusion",
                type: "combination",
                role: "ComplianceOracle",
                tier: 3,
                description: "法令意識之眼 × MECE 完整性守護：完美的合規護盾",
                trigger: "co-p1 偵測到問題 + co-p2 啟動修正",
                effect: "自動修正合規問題；MECE 分數提升至 >= 95%；生成合規認證標章",
                parentSkillIds: ["co-p1", "co-p2"],
                synergyMultiplier: 2.8,
                memoryWeight: 7,
            },
        ],
        special: {
            id: "co-s1",
            name: "萬法歸宗·GRI 索引絕招",
            nameEn: "All Laws Return to Origin",
            type: "special",
            role: "ComplianceOracle",
            tier: 3,
            description: "絕招：一鍵生成完整的 GRI 對照索引表（含 SASB、TCFD 交叉對照）",
            trigger: "使用者請求生成索引表",
            effect: "完整 GRI Universal Standards 對照；SASB 補充；TCFD 四支柱交叉；PDF 附錄格式輸出",
            cooldown: 60000,
            memoryWeight: 7,
        },
        ultimate: {
            id: "co-u1",
            name: "天地合規·萬令歸一奧義",
            nameEn: "Heaven and Earth Compliance · Ultimate",
            type: "ultimate",
            role: "ComplianceOracle",
            tier: 3,
            description: "奧義：完整的「超合規報告書認證掃描」——從 GRI、SASB、TCFD、ISSB、TWSE、SDGs 六個框架同時審查並交叉確信",
            trigger: "報告完整度 >= 80% 且所有章節有草稿",
            effect: "六框架同步對標；交叉驗證矛盾項；生成「超合規認證書」；自動 ZKP 封印報告版本",
            requires: ["co-p1", "co-p2", "co-c1", "co-c2", "co-combo1", "co-s1"],
            griAnchor: ["GRI 3-1", "GRI 3-2", "GRI 3-3"],
            memoryWeight: 10,
        },
    },

    // ═══════════════════════════════════════════
    // 4. StrategyMaestro — 戰略大師
    // ═══════════════════════════════════════════
    StrategyMaestro: {
        role: "StrategyMaestro",
        roleTitle: "戰略大師",
        roleMotto: "棋局未動，勝算已定",
        passives: [
            {
                id: "sm-p1",
                name: "趨勢感知羅盤",
                nameEn: "Trend Sensing Compass",
                type: "passive",
                role: "StrategyMaestro",
                tier: 1,
                description: "持續監測全球 ESG 趨勢，自動推送與公司重大議題相關的市場動態",
                trigger: "每次開啟戰情主控台",
                effect: "每日 ESG 趨勢簡報；同業動態追蹤；監管新規警示",
                memoryWeight: 2,
            },
            {
                id: "sm-p2",
                name: "標竿對標天眼",
                nameEn: "Benchmark Celestial Eye",
                type: "passive",
                role: "StrategyMaestro",
                tier: 2,
                description: "自動對比公司 ESG 表現與同業標竿",
                trigger: "任何 KPI 更新時",
                effect: "同業排名即時更新；差距分析自動生成；超越標竿時顯示慶祝動效",
                memoryWeight: 3,
            },
        ],
        combos: [
            {
                id: "sm-c1",
                name: "氣候情境三連擊",
                nameEn: "Climate Scenario Triple Strike",
                type: "combo",
                role: "StrategyMaestro",
                tier: 2,
                description: "連續分析 1.5°C / 2°C / 4°C 三種氣候情境對企業的財務衝擊",
                trigger: "使用者啟動 TCFD 分析",
                effect: "三情境財務影響矩陣；實體風險 + 轉型風險分類；商機分析；報告可見文段自動生成",
                comboNextIds: ["sm-c2"],
                griAnchor: ["GRI 201-2"],
                memoryWeight: 6,
            },
            {
                id: "sm-c2",
                name: "戰略路徑圖生成術",
                nameEn: "Roadmap Generation Technique",
                type: "combo",
                role: "StrategyMaestro",
                tier: 3,
                description: "情境分析後，自動生成 2025-2050 永續戰略路徑圖",
                trigger: "sm-c1 完成後觸發",
                effect: "時間軸路徑圖視覺化；每期關鍵里程碑；所需資本支出估算",
                requires: ["sm-c1"],
                memoryWeight: 5,
            },
        ],
        combinations: [
            {
                id: "sm-combo1",
                name: "天地戰略大棋局·組合術",
                nameEn: "Grand Strategy Fusion",
                type: "combination",
                role: "StrategyMaestro",
                tier: 3,
                description: "趨勢感知羅盤 × 標竿對標天眼：超前部署，洞悉先機",
                trigger: "sm-p1 + sm-p2 均 ACTIVE，且有標竿數據",
                effect: "預測同業未來 3 年動向；生成「超前佈局建議書」；標竿差距縮短計畫",
                parentSkillIds: ["sm-p1", "sm-p2"],
                synergyMultiplier: 3.2,
                memoryWeight: 8,
            },
        ],
        special: {
            id: "sm-s1",
            name: "戰情室·萬策並發絕招",
            nameEn: "War Room All-Strategy Burst",
            type: "special",
            role: "StrategyMaestro",
            tier: 3,
            description: "絕招：在戰情主控台同時展開 E/S/G/D 四維度戰略分析並生成整合性策略建議",
            trigger: "使用者開啟「戰略分析模式」",
            effect: "四維度同步分析；交叉影響矩陣；優先行動清單；董事會報告摘要草稿",
            cooldown: 180000,
            memoryWeight: 9,
        },
        ultimate: {
            id: "sm-u1",
            name: "永續帝國·萬策歸一奧義",
            nameEn: "Sustainable Empire · Ultimate",
            type: "ultimate",
            role: "StrategyMaestro",
            tier: 3,
            description: "奧義：生成完整的「10 年永續帝國藍圖」——從當前狀態到 2034 年，每年關鍵目標、戰略行動、KPI 里程碑和財務預測的完整路徑",
            trigger: "完成 TCFD 分析且有標竿對照數據",
            effect: "10 年路徑圖；年度 KPI 目標設定；財務影響模型；向董事會的提案文件",
            requires: ["sm-p1", "sm-p2", "sm-c1", "sm-c2", "sm-combo1"],
            memoryWeight: 10,
        },
    },

    // ═══════════════════════════════════════════
    // 5. AuditSentinel — 稽核守衛
    // ═══════════════════════════════════════════
    AuditSentinel: {
        role: "AuditSentinel",
        roleTitle: "稽核守衛",
        roleMotto: "沒有存證，一切皆為謊言",
        passives: [
            {
                id: "as-p1",
                name: "ZKP 常態感知",
                nameEn: "ZKP Ambient Sensing",
                type: "passive",
                role: "AuditSentinel",
                tier: 1,
                description: "持續監測所有文件的 ZKP 驗證狀態，一旦發現未封印文件即時警示",
                trigger: "任意時刻，持續運行",
                effect: "未封印文件計數徽章；自動推送封印建議；Hash 鏈完整性 24h 驗算",
                memoryWeight: 2,
            },
            {
                id: "as-p2",
                name: "5T 協議守門人",
                nameEn: "5T Protocol Gatekeeper",
                type: "passive",
                role: "AuditSentinel",
                tier: 2,
                description: "確保所有數據聲明均通過 5T 五個維度的驗證（可溯源、可透明、可感知、不可篡改、可追蹤）",
                trigger: "任何數據被引用入報告時",
                effect: "5T 評分自動生成 (0-100)；低於 60 分的數據標示紅旗；強制要求佐證上傳",
                memoryWeight: 3,
            },
        ],
        combos: [
            {
                id: "as-c1",
                name: "證據鏈鍛造術",
                nameEn: "Evidence Chain Forging",
                type: "combo",
                role: "AuditSentinel",
                tier: 2,
                description: "連鎖建立從原始憑證→數據輸入→報告引用的完整證據鏈",
                trigger: "使用者上傳任何憑證文件時",
                effect: "自動建立證據→指標→章節的三層連結；Hash 封印每個連結；可視化證據樹",
                comboNextIds: ["as-c2"],
                griAnchor: ["GRI 2-5"],
                memoryWeight: 5,
            },
            {
                id: "as-c2",
                name: "稽核軌跡封印術",
                nameEn: "Audit Trail Sealing",
                type: "combo",
                role: "AuditSentinel",
                tier: 2,
                description: "證據鏈建立後，自動生成不可篡改的稽核軌跡並封存至 Audit Vault",
                trigger: "as-c1 完成後觸發",
                effect: "完整操作日誌封存；時間戳記鏈式連結；第三方可驗證格式輸出",
                requires: ["as-c1"],
                memoryWeight: 4,
            },
        ],
        combinations: [
            {
                id: "as-combo1",
                name: "不滅封印·組合術",
                nameEn: "Indestructible Seal Fusion",
                type: "combination",
                role: "AuditSentinel",
                tier: 3,
                description: "ZKP 常態感知 × 5T 協議守門人：雙重守護，鑄造絕對可信度",
                trigger: "as-p1 + as-p2 均監測到同一文件時",
                effect: "雙重 ZKP + 5T 認證；Trust Score 自動提升至 99.9%；頒發「黃金存證徽章」",
                parentSkillIds: ["as-p1", "as-p2"],
                synergyMultiplier: 3.5,
                memoryWeight: 9,
            },
        ],
        special: {
            id: "as-s1",
            name: "全域稽核風暴·絕招",
            nameEn: "Global Audit Storm",
            type: "special",
            role: "AuditSentinel",
            tier: 3,
            description: "絕招：對整份報告進行全面稽核掃描，找出所有未封印、低信度、缺佐證的問題點",
            trigger: "使用者啟動「報告全域稽核」",
            effect: "識別所有問題：數量、位置、嚴重程度；按優先順序排列修正清單；一鍵修正建議",
            cooldown: 60000,
            memoryWeight: 8,
        },
        ultimate: {
            id: "as-u1",
            name: "永恆稽核聖殿·奧義",
            nameEn: "Eternal Audit Sanctum · Ultimate",
            type: "ultimate",
            role: "AuditSentinel",
            tier: 3,
            description: "奧義：將整份報告書的所有數據、文件、稽核軌跡進行最終封印——生成「永恆不可篡改的報告書 NFT 摘要」，可供任何第三方在任何時間驗證",
            trigger: "全域稽核通過（問題數 = 0）後解鎖",
            effect: "最終 Hash 封印；ZKP 完整性證明生成；可分享的驗證 QR 碼；Audit Vault 永久存檔",
            requires: ["as-p1", "as-p2", "as-c1", "as-c2", "as-combo1", "as-s1"],
            griAnchor: ["GRI 2-5"],
            memoryWeight: 10,
        },
    },
};

// ─────────────────────────────────────────────
// 萬能永憶分配系統 — OmniMemory Engine
// ─────────────────────────────────────────────

const TOTAL_MEMORY_CAPACITY = 100; // Per session

export function createMemoryPool(): OmniMemoryPool {
    return {
        totalCapacity: TOTAL_MEMORY_CAPACITY,
        allocatedMemory: 0,
        experience: 0,
        level: 1,
        skillLogs: [],
        unlockedSkillIds: new Set<string>(),
    };
}

/**
 * gainExperience: Awards XP and handles level ups.
 * Each 100 XP grants 1 Level and +20 Memory Capacity.
 */
export function gainExperience(pool: OmniMemoryPool, xp: number, context: string = "System Award"): OmniMemoryPool {
    const nextPool = { ...pool };
    nextPool.experience += xp;

    const previousLevel = pool.level;
    // Calculate new level (1 level per 100 xp)
    const newLevel = Math.floor(nextPool.experience / 100) + 1;

    if (newLevel > previousLevel) {
        const levelUps = newLevel - previousLevel;
        nextPool.level = newLevel;
        // Each level grants 20 Base Memory Capacity
        nextPool.totalCapacity += (20 * levelUps);
    }

    return nextPool;
}

/**
 * Auto-learn a skill from OmniHeart
 * 從萬能之心自動習得技能
 */
export function learnSkill(
    pool: OmniMemoryPool,
    skill: OmniSkill,
    heart: IOmniHeart,
    context: string = "Manual"
): { success: boolean; log: SkillMemoryLog | null; reason?: string; newHeart?: IOmniHeart } {
    if (pool.unlockedSkillIds.has(skill.id)) {
        return { success: false, log: null, reason: "技能已解鎖", newHeart: heart };
    }

    // Check memory capacity
    if (pool.allocatedMemory + skill.memoryWeight > pool.totalCapacity) {
        return { success: false, log: null, reason: "永憶不足 (Insufficient OmniMemory)", newHeart: heart };
    }

    // Check prerequisites
    if (skill.requires) {
        const missingReqs = skill.requires.filter((id) => !pool.unlockedSkillIds.has(id));
        if (missingReqs.length > 0) {
            return { success: false, log: null, reason: `前置技能未習得: ${missingReqs.join(", ")}`, newHeart: heart };
        }
    }

    // Allocate memory and log
    pool.allocatedMemory += skill.memoryWeight;
    pool.unlockedSkillIds.add(skill.id);

    // Forge ancestral record
    const { newHeart, logEntry } = logAuditAction(heart, `SKILL_LEARN:${skill.id}:${skill.name}`, "OmniSystem");

    const log: SkillMemoryLog = {
        id: `skill-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: logEntry.timestamp,
        role: skill.role,
        skillId: skill.id,
        skillName: skill.name,
        skillType: skill.type,
        heartHash: newHeart.A_Tagging.hash_lock,
        parentHash: logEntry.parentHash,
        integrityHash: logEntry.hash,
        context,
        memoryCost: skill.memoryWeight,
    };

    (pool.skillLogs as SkillMemoryLog[]).push(log);

    return { success: true, log, newHeart };
}

/**
 * Auto-learn all passive skills for a role on session start
 * 角色登場，自動習得所有被動天賦
 */
export function autoLearnPassives(
    pool: OmniMemoryPool,
    role: OmniRole,
    heart: IOmniHeart
): { logs: SkillMemoryLog[]; finalHeart: IOmniHeart } {
    const tree = OMNI_SKILL_TREES[role];
    const logs: SkillMemoryLog[] = [];
    let currentHeart = heart;

    for (const passive of tree.passives) {
        const result = learnSkill(pool, passive, currentHeart, `Auto-learn: ${role} session start`);
        if (result.log) logs.push(result.log);
        if (result.newHeart) currentHeart = result.newHeart;
    }

    return { logs, finalHeart: currentHeart };
}

/**
 * Get all currently learnable skills for a role given current pool state
 */
export function getLearnableSkills(pool: OmniMemoryPool, role: OmniRole): OmniSkill[] {
    const tree = OMNI_SKILL_TREES[role];
    const allSkills: OmniSkill[] = [
        ...tree.passives,
        ...tree.combos,
        ...tree.combinations,
        tree.special,
        tree.ultimate,
    ];

    return allSkills.filter((skill) => {
        if (pool.unlockedSkillIds.has(skill.id)) return false; // Already learned
        if (skill.requires?.some((id) => !pool.unlockedSkillIds.has(id))) return false; // Prereq missing
        if (pool.allocatedMemory + skill.memoryWeight > pool.totalCapacity) return false; // No memory
        return true;
    });
}

/**
 * Get skill by ID across all trees
 */
export function getSkillById(id: string): OmniSkill | undefined {
    for (const tree of Object.values(OMNI_SKILL_TREES)) {
        const all: OmniSkill[] = [
            ...tree.passives,
            ...tree.combos,
            ...tree.combinations,
            tree.special,
            tree.ultimate,
        ];
        const found = all.find((s) => s.id === id);
        if (found) return found;
    }
    return undefined;
}

/**
 * Activate a skill (with OmniHeart audit log)
 * 奧義技能啟動 + 元祖記載
 */
export function activateSkill(
    pool: OmniMemoryPool,
    skillId: string,
    heart: IOmniHeart,
    context: string,
    actor: string = "OmniSystem"
): { success: boolean; log?: SkillMemoryLog; newHeart?: IOmniHeart } {
    if (!pool.unlockedSkillIds.has(skillId)) {
        return { success: false };
    }

    const skill = getSkillById(skillId);
    if (!skill) return { success: false };

    // Forge immutable audit record via OmniHeart
    const { newHeart, logEntry } = logAuditAction(heart, `SKILL_ACTIVATION:${skillId}:${skill.name}`, actor);

    const log: SkillMemoryLog = {
        id: `act-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: logEntry.timestamp,
        role: skill.role,
        skillId: skill.id,
        skillName: skill.name,
        skillType: skill.type,
        heartHash: newHeart.A_Tagging.hash_lock,
        parentHash: logEntry.parentHash,
        integrityHash: logEntry.hash,
        context,
        memoryCost: 0, // Activation doesn't cost additional memory
    };

    (pool.skillLogs as SkillMemoryLog[]).push(log);

    return { success: true, log, newHeart };
}
