/**
 * 🎯 G1: Board Copilot Customer Journey
 * 董事會副駕駛 - 客戶旅程定義
 * 
 * Target: Board members, C-level executives, corporate secretaries
 * Duration: 60-90 minutes
 * Philosophy: 服務即教學，知識即資產
 */

import type { CustomerJourney } from '../src/types/customer-journey';

export const BoardCopilotJourney: CustomerJourney = {
    serviceId: 'board-copilot',
    serviceName: '董事會副駕駛',
    serviceNameEn: 'Board Copilot',
    category: 'governance',

    /**
     * 學習目標 (Learning Objectives)
     * 遵循「服務即教學」原則，每個階段都有明確的知識增長目標
     */
    learningObjectives: [
        '理解現代企業治理的核心原則與最佳實踐',
        '掌握董事會會議的結構化管理方法',
        '學習運用 AI 輔助決策與風險識別',
        '建立完整的治理成熟度評估框架',
        '培養數據驅動的治理思維模式'
    ],

    /**
     * 知識資產 (Knowledge Assets)
     * 「知識即資產」- 用戶在旅程中累積的可證明成就
     */
    knowledgeAssets: [
        { type: 'badge', name: 'Governance Awareness', displayName: '治理意識覺醒', stage: 'discovery' },
        { type: 'certificate', name: 'Board Setup Complete', displayName: '董事會架構建置完成', stage: 'onboarding' },
        { type: 'report', name: 'First Meeting Success', displayName: '首次會議成功報告', stage: 'engagement' },
        { type: 'certificate', name: 'Governance Maturity Level 3', displayName: '治理成熟度三級認證', stage: 'value-realization' },
        { type: 'badge', name: 'Governance Champion', displayName: '治理冠軍徽章', stage: 'advocacy' },
        { type: 'evidence', name: 'Locked Meeting Minutes', displayName: '不可篡改會議紀錄', stage: 'value-realization' }
    ],

    totalDuration: '60-90 minutes',

    /**
     * 旅程階段 (Journey Stages)
     * 5 個標準階段：Discovery → Onboarding → Engagement → Value Realization → Advocacy
     */
    stages: [
        // ==================== 階段 1: Discovery (發現) ====================
        {
            id: 'discovery',
            name: 'discovery',
            displayName: '發現',
            description: '董事會成員或企業秘書探索 Board Copilot 的價值主張與功能特色',

            touchpoints: [
                {
                    id: 'landing-page',
                    type: 'ui',
                    path: '/services/board-copilot',
                    action: '瀏覽 Board Copilot 服務介紹頁面',
                    expectedResponse: '展示治理案例研究、客戶見證、定價方案',

                    // 5T 協議合規檢查
                    fiveTCompliance: {
                        tangible: true,      // ✅ 具體案例展示
                        traceable: false,    // ❌ 尚未產生用戶數據
                        trackable: false,    // ❌ 尚未開始追蹤
                        transparent: true,   // ✅ 公開定價與功能清單
                        trustworthy: true    // ✅ 官方認證標章
                    },

                    learningOutcome: '理解 Board Copilot 如何提升董事會效能與合規性'
                },
                {
                    id: 'governance-quiz',
                    type: 'ui',
                    path: '/services/board-copilot/quiz',
                    action: '完成「治理成熟度自我評估」測驗（10 題）',
                    expectedResponse: '即時顯示治理成熟度分數（0-100）與改善建議',

                    fiveTCompliance: {
                        tangible: true,      // ✅ 視覺化評分結果
                        traceable: true,     // ✅ 記錄答題來源
                        trackable: true,     // ✅ 追蹤評估歷程
                        transparent: true,   // ✅ 公開評分邏輯
                        trustworthy: false   // ❌ 尚未鎖定數據
                    },

                    learningOutcome: '自我診斷組織治理現狀與潛在風險點'
                }
            ],

            expectedOutcome: '用戶理解服務價值並決定啟動董事會數位化轉型',

            // 整體階段 5T 驗證
            fiveTValidation: [
                { criterion: 'tangible', status: true, evidence: '案例研究展示與評分視覺化' },
                { criterion: 'traceable', status: true, evidence: '測驗答案來源記錄' },
                { criterion: 'trackable', status: true, evidence: '評估進度追蹤' },
                { criterion: 'transparent', status: true, evidence: '定價與評分邏輯公開' },
                { criterion: 'trustworthy', status: false, evidence: '尚未進入數據鎖定階段' }
            ]
        },

        // ==================== 階段 2: Onboarding (引導) ====================
        {
            id: 'onboarding',
            name: 'onboarding',
            displayName: '引導',
            description: '建立董事會架構、新增成員、配置委員會與治理政策',

            touchpoints: [
                {
                    id: 'board-setup-wizard',
                    type: 'ui',
                    path: '/board-copilot/setup',
                    action: '使用設定精靈建立董事會架構',
                    expectedResponse: '引導式流程：新增董事會成員（≥3人）、設定委員會（審計/薪酬/提名）、上傳公司章程',

                    fiveTCompliance: {
                        tangible: true,      // ✅ 視覺化組織架構圖
                        traceable: true,     // ✅ 每位成員資料有來源標記
                        trackable: true,     // ✅ 設定進度追蹤
                        transparent: true,   // ✅ 架構設計邏輯透明
                        trustworthy: false   // ❌ 尚未最終確認鎖定
                    },

                    learningOutcome: '掌握結構化的董事會架構設計方法'
                },
                {
                    id: 'governance-framework',
                    type: 'ui',
                    path: '/board-copilot/framework',
                    action: '選擇治理框架（GRI/SASB/TCFD）',
                    expectedResponse: '系統推薦適合的框架並自動配置合規檢查清單',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 框架選擇確認後鎖定
                    },

                    learningOutcome: '理解不同治理框架的適用情境與要求'
                },
                {
                    id: 'setup-completion',
                    type: 'api',
                    path: '/api/board-copilot/setup/complete',
                    action: 'POST 提交董事會設定並確認',
                    expectedResponse: '返回董事會 UUID 與設定摘要，頒發「Board Setup Complete」證書',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 數據永久鎖定
                    },

                    learningOutcome: '完成董事會數位化基礎建設'
                }
            ],

            expectedOutcome: '董事會架構完整建立，準備進入實際運作階段',

            fiveTValidation: [
                { criterion: 'tangible', status: true, evidence: '架構圖與成員列表視覺化' },
                { criterion: 'traceable', status: true, evidence: '所有成員與政策皆有來源記錄' },
                { criterion: 'trackable', status: true, evidence: '設定流程每步皆可追蹤' },
                { criterion: 'transparent', status: true, evidence: '框架選擇邏輯公開透明' },
                { criterion: 'trustworthy', status: true, evidence: '設定完成後 SHA-256 鎖定' }
            ]
        },

        // ==================== 階段 3: Engagement (參與) ====================
        {
            id: 'engagement',
            name: 'engagement',
            displayName: '參與',
            description: '使用 AI 輔助功能進行首次會議籌備與執行',

            touchpoints: [
                {
                    id: 'ai-agenda-generation',
                    type: 'ui',
                    path: '/board-copilot/meeting/new',
                    action: '使用 AI 生成會議議程',
                    expectedResponse: 'AI 根據治理框架、產業趨勢、監管要求自動建議議程項目（≥5項）',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,     // ✅ AI 建議來源可追溯
                        trackable: true,
                        transparent: true,   // ✅ AI 推薦邏輯透明
                        trustworthy: false
                    },

                    learningOutcome: '學習 AI 驅動的會議議程規劃方法'
                },
                {
                    id: 'compliance-check',
                    type: 'api',
                    path: '/api/board-copilot/compliance/check',
                    action: 'POST 執行自動化合規檢查',
                    expectedResponse: '返回合規報告：法規符合度、缺失項目、改善建議',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 合規報告鎖定
                    },

                    learningOutcome: '掌握動態合規監控機制'
                },
                {
                    id: 'meeting-execution',
                    type: 'ui',
                    path: '/board-copilot/meeting/:meetingId/live',
                    action: '進行會議並即時記錄決議',
                    expectedResponse: 'AI 自動建議決議用語、追蹤待辦事項、記錄投票結果',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 會議紀錄不可篡改
                    },

                    learningOutcome: '實踐數位化會議管理與決策記錄'
                },
                {
                    id: 'meeting-minutes-lock',
                    type: 'evidence',
                    path: '/board-copilot/evidence/meeting-minutes',
                    action: '會議紀錄 Hash Lock 鎖定',
                    expectedResponse: 'SHA-256 雜湊值、區塊鏈時間戳、公開驗證 URL',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 完全不可篡改
                    },

                    learningOutcome: '理解區塊鏈在治理透明度的應用'
                }
            ],

            expectedOutcome: '成功完成首次 AI 輔助董事會會議，會議紀錄已鎖定',

            fiveTValidation: [
                { criterion: 'tangible', status: true, evidence: 'AI 議程與合規報告視覺化' },
                { criterion: 'traceable', status: true, evidence: '每項決議皆可追溯提案來源' },
                { criterion: 'trackable', status: true, evidence: '會議流程完整追蹤' },
                { criterion: 'transparent', status: true, evidence: 'AI 建議邏輯與投票結果公開' },
                { criterion: 'trustworthy', status: true, evidence: '會議紀錄 SHA-256 鎖定並上鏈' }
            ]
        },

        // ==================== 階段 4: Value Realization (價值實現) ====================
        {
            id: 'value-realization',
            name: 'value-realization',
            displayName: '價值實現',
            description: '生成治理成熟度評分卡並獲得認證',

            touchpoints: [
                {
                    id: 'risk-dashboard',
                    type: 'ui',
                    path: '/board-copilot/risk-intelligence',
                    action: '查看風險預警儀表板',
                    expectedResponse: '即時顯示治理風險熱力圖、監管變更通知、同業對標',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },

                    learningOutcome: '建立前瞻性風險管理思維'
                },
                {
                    id: 'governance-scorecard',
                    type: 'api',
                    path: '/api/board-copilot/scorecard/generate',
                    action: 'POST 生成治理成熟度評分卡',
                    expectedResponse: '返回綜合評分（0-100）、各維度細分、改善路徑圖',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,   // ✅ 評分公式公開
                        trustworthy: true    // ✅ 評分結果鎖定
                    },

                    learningOutcome: '量化組織治理成熟度並制定改善計畫'
                },
                {
                    id: 'certification',
                    type: 'evidence',
                    path: '/board-copilot/certification',
                    action: '獲得「Governance Maturity Level 3」認證',
                    expectedResponse: '頒發數位證書（PDF + 區塊鏈證明）',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },

                    learningOutcome: '取得可驗證的治理能力證明'
                }
            ],

            expectedOutcome: '獲得治理成熟度認證，組織治理能力獲得外部背書',

            fiveTValidation: [
                { criterion: 'tangible', status: true, evidence: '風險儀表板與評分卡視覺化' },
                { criterion: 'traceable', status: true, evidence: '評分數據來源完整記錄' },
                { criterion: 'trackable', status: true, evidence: '改善進程可持續追蹤' },
                { criterion: 'transparent', status: true, evidence: '評分公式與權重公開' },
                { criterion: 'trustworthy', status: true, evidence: '證書與評分卡區塊鏈鎖定' }
            ]
        },

        // ==================== 階段 5: Advocacy (倡導) ====================
        {
            id: 'advocacy',
            name: 'advocacy',
            displayName: '倡導',
            description: '分享治理成果並邀請同業參與',

            touchpoints: [
                {
                    id: 'public-scorecard',
                    type: 'ui',
                    path: '/board-copilot/share/scorecard',
                    action: '公開分享治理評分卡（選擇性）',
                    expectedResponse: '生成公開驗證頁面與 QR Code',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },

                    learningOutcome: '實踐治理透明度的社會價值'
                },
                {
                    id: 'peer-benchmark',
                    type: 'ui',
                    path: '/board-copilot/benchmark',
                    action: '邀請同業董事會進行對標',
                    expectedResponse: '發送邀請連結，建立治理能力比較群組',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },

                    learningOutcome: '成為治理最佳實踐的推動者'
                },
                {
                    id: 'governance-champion-badge',
                    type: 'evidence',
                    path: '/board-copilot/badge/champion',
                    action: '解鎖「Governance Champion」徽章',
                    expectedResponse: '頒發公開可驗證徽章（NFT 格式）',

                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },

                    learningOutcome: '建立個人治理專業品牌'
                }
            ],

            expectedOutcome: '成為治理思想領袖，推動產業治理水平提升',

            fiveTValidation: [
                { criterion: 'tangible', status: true, evidence: '公開驗證頁面與 QR Code' },
                { criterion: 'traceable', status: true, evidence: '分享行為完整記錄' },
                { criterion: 'trackable', status: true, evidence: '影響力擴散可追蹤' },
                { criterion: 'transparent', status: true, evidence: '公開評分卡完全透明' },
                { criterion: 'trustworthy', status: true, evidence: 'NFT 徽章區塊鏈驗證' }
            ]
        }
    ],

    /**
     * 成功標準 (Success Criteria)
     * 定義完成整個旅程的驗收條件
     */
    successCriteria: [
        {
            category: 'completion',
            criterion: '董事會架構建置',
            target: '新增至少 3 位董事會成員',
            measurement: 'board.members.length >= 3'
        },
        {
            category: 'engagement',
            criterion: '會議執行',
            target: '完成首次 AI 輔助會議並鎖定紀錄',
            measurement: 'meeting.status === "completed" && meeting.hashLock !== null'
        },
        {
            category: 'value',
            criterion: '治理成熟度',
            target: '獲得治理成熟度評分 ≥ 70/100',
            measurement: 'governanceScore >= 70'
        },
        {
            category: 'compliance',
            criterion: '5T 協議',
            target: '所有階段 5T 驗證通過',
            measurement: 'allStages.every(stage => stage.fiveTValidation.every(v => v.status))'
        },
        {
            category: 'advocacy',
            criterion: '知識分享',
            target: '公開分享治理評分卡（選擇性）',
            measurement: 'scorecard.isPublic === true (optional)'
        }
    ],

    /**
     * 預期成果 (Expected Outcomes)
     * 完成旅程後用戶應獲得的具體成果
     */
    expectedOutcomes: [
        '建立完整的董事會數位化治理系統',
        '掌握 AI 輔助決策與風險管理技能',
        '獲得可驗證的治理成熟度認證',
        '累積不可篡改的會議紀錄證據庫',
        '成為組織內部治理轉型的推動者'
    ]
};
