/**
 * ReportTutorialService.ts
 * -------------------------
 * 永續報告書撰寫中心 - 服務引導教學模組
 * 
 * 核心理念：服務即教學，知識即資產
 * 設計哲學：上善若水，如水般清澈、流動、和諧
 */

import { Request, Response } from 'express';

// ============================================
// 教學步驟定義
// ============================================

export interface TutorialStep {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    duration: number; // 預估分鐘數
    type: 'intro' | 'practice' | 'quiz' | 'milestone';
    content: TutorialContent;
    prerequisites: string[];
    completionCriteria: string[];
    reward: {
        points: number;
        badge?: string;
        title?: string;
    };
}

export interface TutorialContent {
    sections: ContentSection[];
    examples: ContentExample[];
    tips: string[];
    commonMistakes: string[];
}

export interface ContentSection {
    id: string;
    title: string;
    content: string;
    visual?: string;
    interactiveElement?: string;
}

export interface ContentExample {
    title: string;
    description: string;
    code?: string;
    image?: string;
}

export interface TutorialProgress {
    userId: string;
    stepId: string;
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    startedAt?: string;
    completedAt?: string;
    score?: number;
    attempts: number;
    notes: string[];
}

export interface UserTutorialState {
    userId: string;
    currentLevel: number;
    completedSteps: string[];
    availableSteps: string[];
    totalPoints: number;
    badges: string[];
    titles: string[];
    lastActivity: string;
}

// ============================================
// 教學課程定義 (ESG-03 永續報告書產生器)
// ============================================

export const TUTORIAL_CURRICULUM: TutorialStep[] = [
    // Level 1: 基礎入門
    {
        id: 'tutorial-01-01',
        title: '認識永續報告書',
        titleEn: 'Introduction to Sustainability Report',
        description: '了解永續報告書的目的、架構與國際標準框架',
        duration: 15,
        type: 'intro',
        content: {
            sections: [
                {
                    id: 'sec-1',
                    title: '什麼是永續報告書？',
                    content: `永續報告書（Sustainability Report）是企業向利害關係人揭露其在環境、社會與治理（ESG）面向的績效與作為的正式文件。

【核心目的】
• 透明化：讓利害關係人了解企業的永續發展策略與績效
• 問責性：建立企業對其永續承諾的問責機制
• 溝通橋樑：促進與投資人、顧客、員工、社區等利害關係人的溝通

【報告書的演進】
1. 早期：企業社會責任（CSR）報告，著重慈善與公益活動
2. 中期：ESG 報告，整合環境、社會、治理三大面向
3. 現在：永續發展報告，連結聯合國永續發展目標（SDGs）與氣候行動`,
                    visual: 'flowchart-definition',
                },
                {
                    id: 'sec-2',
                    title: '國際報告框架',
                    content: `【主要國際框架】

1. GRI Standards（全球永續報告準則）
   - 最廣泛使用的永續報告框架
   - 涵蓋經濟、環境、社會三大類別
   - 適用於所有產業與規模的組織

2. SASB 標準（永續發展會計準則委員會）
   - 聚焦於 77 個產業特定的財務重大性議題
   - 適合投資人導向的揭露需求
   - 2021 年起與 IIRC 合併為 IFRS Foundation

3. TCFD（氣候相關財務揭露）
   - 聚焦氣候變遷的財務風險與機會
   - 四大核心要素：治理、策略、風險管理、指標與目標
   - 許多國家已強制要求揭露`,
                    visual: 'framework-comparison',
                },
                {
                    id: 'sec-3',
                    title: '報告書撰寫流程',
                    content: `【六步驟撰寫流程】

Step 1: 重大性分析
   → 識別對企業與利害關係人最重要的 ESG 議題

Step 2: 資料收集
   → 彙整各部門的環境、社會、治理相關數據

Step 3: 框架對齊
   → 將議題對應至 GRI/SASB/TCFD 指標

Step 4: 內容撰寫
   → 依據框架要求撰寫管理方針與績效數據

Step 5: 第三方驗證
   → 邀請外部稽核機構進行確信

Step 6: 發行與溝通
   → 發布報告書並與利害關係人溝通`,
                    visual: 'workflow-diagram',
                },
            ],
            examples: [
                {
                    title: '重大性分析範例',
                    description: '透過矩陣圖識別高影響力與高利害關係程度的議題',
                    code: `議題範例：
• 碳排放管理 → 高影響力、高利害關係
• 員工福利 → 中影響力、高利害關係
• 供應商管理 → 高影響力、中利害關係`,
                },
                {
                    title: 'GRI 指標對應範例',
                    description: '將企業行為對應至 GRI  Standards 指標',
                    code: `碳排放（GRI 305）
• 305-1: 範疇一直接排放
• 305-2: 範疇二能源間接排放
• 305-3: 其他間接排放（範疇三）`,
                },
            ],
            tips: [
                '建議每年固定時間進行重大性分析，確保議題涵蓋性',
                '善用問卷與訪談了解利害關係人的關注焦點',
                '保持一致的揭露範圍與方法論，方便年度比較',
            ],
            commonMistakes: [
                '只報喜不報憂，缺乏誠信',
                '資料來源不完整或計算方法不一致',
                '未與利害關係人互動，錯失重要觀點',
            ],
        },
        prerequisites: [],
        completionCriteria: ['閱讀完所有章節', '完成章節測驗（正確率 70%）'],
        reward: { points: 100, badge: '新手永續人', title: '永續報告書見習生' },
    },
    {
        id: 'tutorial-01-02',
        title: 'GRI Standards 基礎',
        titleEn: 'GRI Standards Fundamentals',
        description: '學習 GRI 通用準則與主題標準的基礎知識',
        duration: 20,
        type: 'practice',
        content: {
            sections: [
                {
                    id: 'sec-gri-1',
                    title: 'GRI 架構總覽',
                    content: `【GRI Standards 架構】

┌─────────────────────────────────────────┐
│           GRI 通用準則                   │
│  GRI 1: 基礎 2021                       │
│  GRI 2: 一般揭露 2021                   │
│  GRI 3: 重大性主題 2021                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         GRI 主題標準（選擇性）            │
│  • GRI 301: 物料                         │
│  • GRI 302: 能源                         │
│  • GRI 303: 水與污水                     │
│  • GRI 304: 生物多樣性                   │
│  • GRI 305: 排放                          │
│  • GRI 306: 廢棄物                       │
│  • GRI 308: 供應商環境評估               │
│  ...                                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           GRI 社會準則                   │
│  GRI 401: 僱傫                          │
│  GRI 403: 職業安全                       │
│  GRI 404: 訓練與教育                     │
│  GRI 405: 多元化與平等                   │
│  ...                                     │
└─────────────────────────────────────────┘`,
                    visual: 'gri-structure',
                },
                {
                    id: 'sec-gri-2',
                    title: '通用準則核心內容',
                    content: `【GRI 1: 基礎 2021】
• 依循報告原則（準確性、平衡性、清晰性、可比較性、可靠性、時效性）
• 揭露報告資訊
• 編製報告聲明

【GRI 2: 一般揭露 2021】
• 組織概況（名稱、地點、營運規模）
• 治理結構與組成
• 策略、目標與指標
• 道德與誠信
• 利害關係人參與

【GRI 3: 重大性主題 2021】
• 重大性主題的決定流程
• 重大性主題列表
• 各重大性主題的管理方針`,
                },
            ],
            examples: [
                {
                    title: '一般揭露範例 - 組織概況',
                    description: 'GRI 2-1 組織名稱揭露',
                    code: `組織名稱：○○股份有限公司
報告期間：2024 年 1 月 1 日至 12 月 31 日
報告頻率：年度報告
揭露等級：依循 GRI  Standards`,
                },
            ],
            tips: [
                '首次報告建議從通用準則開始，建立基礎揭露能力',
                '善用 GRI 提供的指標索引表（Content Index）',
                '確保揭露範圍的一致性，避免年年變動',
            ],
            commonMistakes: [
                '未完整揭露所有 GRI 2 一般揭露項目',
                '計算邊界（Boundary）定義不清',
                '忽略「重大性」的動態檢視',
            ],
        },
        prerequisites: ['tutorial-01-01'],
        completionCriteria: ['完成 GRI 指標對照練習', '測驗正確率 80%'],
        reward: { points: 150, badge: 'GRI 基礎學徒' },
    },
    {
        id: 'tutorial-01-03',
        title: '環境永續章節撰寫',
        titleEn: 'Environmental Section Writing',
        description: '學習撰寫環境永續相關章節（碳排放、能源、水資源）',
        duration: 25,
        type: 'practice',
        content: {
            sections: [
                {
                    id: 'sec-env-1',
                    title: '碳排放揭露（GRI 305）',
                    content: `【碳排放揭露要點】

範疇一（直接排放）：
• 來自於公司擁有或控制的排放源
• 例：鍋爐燃燒、車隊燃油、工廠製程排放

範疇二（能源間接排放）：
• 來自於外購電力、熱力或蒸汽

範疇三（其他間接排放）：
• 價值鏈中的其他間接排放
• 例：員工通勤、商務差旅、產品使用階段

【揭露要求】
• 說明計算方法與邊界
• 提供絕對排放量與排放強度
• 揭露減量目標與行動`,
                    visual: 'scope-1-2-3',
                },
                {
                    id: 'sec-env-2',
                    title: '能源管理（GRI 302）',
                    content: `【能源揭露要點】

組織內部能源消耗
• 電力消費量（kWh）
• 燃料消費量（公升或單位）
• 外購蒸汽/熱力/冷卻

能源效率改善
• 單位產出能源消耗趨勢
• 節能措施說明
• 再生能源使用比例

【再生能源憑證（RECs）】
• 購買再生能源憑證的數量
• 自建太陽能或風力發電設施
• 電力來源的能源組合`,
                },
                {
                    id: 'sec-env-3',
                    title: '水資源管理（GRI 303）',
                    content: `【水資源揭露要點】

取水量
• 各來源取水量（地表水、地下水、海水、自來水）

排水量
• 排放至環境的水量
• 污水處理方式

消耗量
• 製程消耗、蒸發損失

水風險管理
• 營運所在地的水壓力區域
• 節水措施與成效
• 水回收再利用比例`,
                },
            ],
            examples: [
                {
                    title: '碳排放計算範例',
                    description: '範疇一排放計算',
                    code: `範疇一排放 = Σ(燃料消耗量 × 排放係數)

天然氣：排放量 = 10,000 m³ × 2.0 kg CO₂e/m³
             = 20,000 kg CO₂e

柴油：排放量 = 50,000 L × 2.68 kg CO₂e/L
       = 134,000 kg CO₂e

範疇一總排放 = 154,000 kg CO₂e`,
                },
            ],
            tips: [
                '優先取得國家公告的排放係數，或使用國際標準值',
                '建立完整的燃料/電力使用記錄，提高計算準確性',
                '定期檢視範疇三排放的顯著性，擴大揭露範圍',
            ],
            commonMistakes: [
                '計算邊界與財務報表邊界不一致',
                '忽略範疇三排放的顯著性評估',
                '排放係數未更新或來源不明',
            ],
        },
        prerequisites: ['tutorial-01-02'],
        completionCriteria: ['完成碳排放計算練習', '撰寫環境章節草稿'],
        reward: { points: 200, badge: '環境守護者' },
    },
    // Level 2: 進階應用
    {
        id: 'tutorial-02-01',
        title: '社會責任章節撰寫',
        titleEn: 'Social Responsibility Writing',
        description: '學習撰寫社會責任相關章節（員工、供應鏈、社區）',
        duration: 25,
        type: 'practice',
        content: {
            sections: [
                {
                    id: 'sec-social-1',
                    title: '員工相關揭露',
                    content: `【GRI 401 僱傫】
• 新進與離職員工數據
• 員工流動率與原因分析
• 育嬰假相關統計

【GRI 403 職業安全】
• 職業傷害類型與件數
• 職業病發生率
• 職業安全培訓時數

【GRI 404 訓練與教育】
• 每人平均訓練時數
• 技能提升計畫
• 職涯發展評估

【GRI 405 多元化與平等】
• 員工多元化統計（性別、年齡、國籍）
• 基本薪資與薪酬比率
• 治理機構多元化`,
                },
                {
                    id: 'sec-social-2',
                    title: '供應商社會評估',
                    content: `【GRI 308 供應商環境評估】
• 環境篩選的供應商數量與比例
• 環境標準稽核發現與改善

【GRI 414 供應商社會評估】
• 社會篩選的供應商數量與比例
• 供應商人權評估發現
• 勞動實踐稽核結果

【供應商管理重點】
• 建立供應商行為準則
• 進行供應商風險評估
• 輔導改善落後供應商`,
                },
            ],
            examples: [
                {
                    title: '員工多元化統計範例',
                    description: 'GRI 405-1 揭露',
                    code: `性別分布：
• 女性員工占比：42%
• 女性管理職占比：35%
• 女性董事占比：30%

年齡分布：
• 30 歲以下：25%
• 30-50 歲：58%
• 50 歲以上：17%`,
                },
            ],
            tips: [
                '員工數據建議按性別、年齡、地區分類揭露',
                '職業安全統計使用百萬工時意外率（TRIR）便於比較',
                '供應商評估結果可作為風險管理依據',
            ],
            commonMistakes: [
                '忽略非正式員工（如派遣工）的統計',
                '培訓時數計算方式不一致',
                '供應商評估範圍過於狹隘',
            ],
        },
        prerequisites: ['tutorial-01-03'],
        completionCriteria: ['完成員工統計計算練習', '撰寫社會章節草稿'],
        reward: { points: 200, badge: '社會關懷者' },
    },
    {
        id: 'tutorial-02-02',
        title: '公司治理章節撰寫',
        titleEn: 'Governance Section Writing',
        description: '學習撰寫公司治理相關章節',
        duration: 20,
        type: 'practice',
        content: {
            sections: [
                {
                    id: 'sec-gov-1',
                    title: '治理架構揭露',
                    content: `【GRI 2-9 治理架構】
• 治理結構與各委員會職責
• 最高治理機構的組成與多元性
• 董事選任與任期安排
• 利益衝突管理機制

【GRI 2-10 提名與遴選】
• 最高治理機構成員的提名標準
• 遴選與任命流程
• 多元性政策的執行

【GRI 2-12 最高治理機構的角色】
• 監督 ESG 策略的制定
• 監督管理階層的績效
• 重大議題的最終決定權`,
                },
                {
                    id: 'sec-gov-2',
                    title: '風險管理與合規',
                    content: `【GRI 2-13 永續責任的委派】
• 永續發展相關職責的委派方式
• 定期向最高治理機構報告的機制

【GRI 2-16 重大關切事項】
• 重大關切事項的通報機制
• 最高治理機構如何處理關切事項

【貪腐與賄賂】
• 風險評估方法與結果
• 反貪腐政策與訓練
• 已確認的貪腐事件與處理`,
                },
            ],
            examples: [
                {
                    title: '治理委員會職責範例',
                    description: '永續發展委員會職責',
                    code: `永續發展委員會職責：
• 審核永續發展政策與目標
• 監督 ESG 績效與進展
• 核准永續報告書內容
• 審閱重大 ESG 風險與機會`,
                },
            ],
            tips: [
                '明確劃分各委員會的 ESG 相關職責',
                '建立利害關係人溝通管道與頻率',
                '說明氣候風險在整體風險管理中的定位',
            ],
            commonMistakes: [
                '治理揭露流於形式，缺乏實質監督說明',
                '未說明 ESG 績效與薪酬的連結',
                '忽略貪腐風險的評估與管理',
            ],
        },
        prerequisites: ['tutorial-01-03'],
        completionCriteria: ['完成治理架構圖繪製', '撰寫治理章節草稿'],
        reward: { points: 200, badge: '治理專家' },
    },
    {
        id: 'tutorial-02-03',
        title: 'TCFD 氣候相關揭露',
        titleEn: 'TCFD Climate Disclosure',
        description: '學習 TCFD 四核心要素的揭露要求',
        duration: 30,
        type: 'milestone',
        content: {
            sections: [
                {
                    id: 'sec-tcfd-1',
                    title: 'TCFD 四大核心要素',
                    content: `【治理（Governance）】
• 氣候相關風險的治理流程
• 最高治理機構與管理階層的角色
• 氣候相關議題如何納入薪酬考量

【策略（Strategy）】
• 短中長期氣候風險與機會識別
• 氣候情境分析（1.5°C、2°C）
• 氣候策略的韌性與調整

【風險管理（Risk Management）】
• 氣候風險識別與評估流程
• 氣候風險管理方法
• 氣候風險整合至企業風險管理

【指標與目標（Metrics & Targets）】
• 氣候相關指標（範疇一、二、三排放）
• 目標設定與績效追蹤
• 減碳路徑說明`,
                    visual: 'tcfd-four-pillars',
                },
                {
                    id: 'sec-tcfd-2',
                    title: '氣候情境分析',
                    content: `【情境分析步驟】

1. 選擇情境
   • 1.5°C 情境（積極減排）
   • 2°C 情境（過渡情境）
   • 4°C 情境（高排放情境）

2. 分析影響
   • 物理風險：極端天氣、海平面上升
   • 轉型風險：碳價上漲、技術變革、政策變化

3. 策略調整
   • 辨識脆弱點
   • 規劃調適措施
   • 評估財務衝擊`,
                },
            ],
            examples: [
                {
                    title: 'TCFD 策略揭露範例',
                    description: '氣候機會識別',
                    code: `氣候相關機會：
• 低碳產品需求成長 → 研發節能產品
• 再生能源成本下降 → 投資自建再生能源
• 綠色金融支持 → 發行綠色債券`,
                },
            ],
            tips: [
                '情境分析品質比複雜度更重要',
                '優先揭露最重大的氣候風險與機會',
                '說明如何將 TCFD 整合至現有報告流程',
            ],
            commonMistakes: [
                '只做情境分析但未說明策略影響',
                '忽略氣候機會的揭露',
                '未量化氣候風險的財務影響',
            ],
        },
        prerequisites: ['tutorial-02-01', 'tutorial-02-02'],
        completionCriteria: ['完成 TCFD 自評', '情境分析練習', '繳交完整報告書'],
        reward: { points: 300, badge: '氣候揭露專家', title: '永續報告書撰寫師' },
    },
];

// ============================================
// 服務類別
// ============================================

export class ReportTutorialService {
    private static instance: ReportTutorialService;

    static getInstance(): ReportTutorialService {
        if (!ReportTutorialService.instance) {
            ReportTutorialService.instance = new ReportTutorialService();
        }
        return ReportTutorialService.instance;
    }

    // ========================================
    // 教學流程 API
    // ========================================

    /**
     * 獲取用戶的教學狀態
     */
    async getUserTutorialState(userId: string): Promise<UserTutorialState> {
        // 模擬數據 - 實際應從數據庫讀取
        const mockState: UserTutorialState = {
            userId,
            currentLevel: 1,
            completedSteps: [],
            availableSteps: ['tutorial-01-01'],
            totalPoints: 0,
            badges: [],
            titles: [],
            lastActivity: new Date().toISOString(),
        };

        return mockState;
    }

    /**
     * 獲取特定教學步驟內容
     */
    getTutorialStep(stepId: string): TutorialStep | null {
        return TUTORIAL_CURRICULUM.find((step) => step.id === stepId) || null;
    }

    /**
     * 獲取所有可用教學步驟
     */
    getAllTutorialSteps(): TutorialStep[] {
        return TUTORIAL_CURRICULUM;
    }

    /**
     * 獲取特定等級的教學步驟
     */
    getStepsByLevel(level: number): TutorialStep[] {
        return TUTORIAL_CURRICULUM.filter(
            (step) => step.id.startsWith(`tutorial-0${level}`)
        );
    }

    /**
     * 開始教學步驟
     */
    async startTutorialStep(
        userId: string,
        stepId: string
    ): Promise<TutorialProgress> {
        const progress: TutorialProgress = {
            userId,
            stepId,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            attempts: 0,
            notes: [],
        };

        return progress;
    }

    /**
     * 完成教學步驟
     */
    async completeTutorialStep(
        userId: string,
        stepId: string,
        score: number
    ): Promise<UserTutorialState> {
        const step = this.getTutorialStep(stepId);
        if (!step) {
            throw new Error('Step not found');
        }

        // 更新用戶狀態
        const newState: UserTutorialState = {
            userId,
            currentLevel: this.calculateNewLevel(stepId),
            completedSteps: [stepId],
            availableSteps: this.calculateNextSteps(stepId),
            totalPoints: step.reward.points,
            badges: [step.reward.badge || ''].filter(Boolean),
            titles: step.reward.title ? [step.reward.title] : [],
            lastActivity: new Date().toISOString(),
        };

        return newState;
    }

    /**
     * 計算新等級
     */
    private calculateNewLevel(stepId: string): number {
        const levelMatch = stepId.match(/tutorial-0(\d)/);
        return levelMatch ? parseInt(levelMatch[1], 10) : 1;
    }

    /**
     * 計算下一步可用步驟
     */
    private calculateNextSteps(completedStepId: string): string[] {
        const currentStep = this.getTutorialStep(completedStepId);
        if (!currentStep) return [];

        // 找到下一個未完成的步驟
        const nextSteps: string[] = [];
        let foundCurrent = false;

        for (const step of TUTORIAL_CURRICULUM) {
            if (foundCurrent && !step.prerequisites.length) {
                nextSteps.push(step.id);
                break;
            }
            if (step.id === completedStepId) {
                foundCurrent = true;
            }
        }

        return nextSteps.length > 0 ? nextSteps : ['tutorial-01-01'];
    }

    /**
     * 驗證完成條件
     */
    validateCompletion(
        stepId: string,
        criteria: Record<string, any>
    ): { valid: boolean; missingCriteria: string[] } {
        const step = this.getTutorialStep(stepId);
        if (!step) {
            return { valid: false, missingCriteria: ['Step not found'] };
        }

        const missing: string[] = [];

        // 檢查每個完成條件
        for (const criterion of step.completionCriteria) {
            if (!this.checkCriterion(criterion, criteria)) {
                missing.push(criterion);
            }
        }

        return {
            valid: missing.length === 0,
            missingCriteria: missing,
        };
    }

    /**
     * 檢查單一條件
     */
    private checkCriterion(
        criterion: string,
        criteria: Record<string, any>
    ): boolean {
        if (criterion.includes('正確率')) {
            const requiredRate = parseInt(criterion.match(/\d+/)?.[0] || '70', 10);
            return (criteria.score || 0) >= requiredRate;
        }
        if (criterion.includes('章節')) {
            return criteria.completedSections?.includes(criterion) || false;
        }
        if (criterion.includes('練習')) {
            return criteria.practiceCompleted || false;
        }
        return criteria[criterion] === true;
    }

    /**
     * 生成報告書教學摘要
     */
    generateTutorialSummary(state: UserTutorialState): {
        level: number;
        totalSteps: number;
        completedSteps: number;
        progressPercentage: number;
        nextMilestone: string;
        currentBadge: string;
    } {
        const totalSteps = TUTORIAL_CURRICULUM.length;
        const completedSteps = state.completedSteps.length;

        // 找到下一個里程碑
        const nextMilestone = TUTORIAL_CURRICULUM.find(
            (step) =>
                step.type === 'milestone' && !state.completedSteps.includes(step.id)
        )?.title || '完成所有教學';

        // 當前最高badge
        const currentBadge =
            state.badges[state.badges.length - 1] || '尚未獲得徽章';

        return {
            level: state.currentLevel,
            totalSteps,
            completedSteps,
            progressPercentage: Math.round((completedSteps / totalSteps) * 100),
            nextMilestone,
            currentBadge,
        };
    }
}

// 導出單例
export const reportTutorialService = ReportTutorialService.getInstance();
