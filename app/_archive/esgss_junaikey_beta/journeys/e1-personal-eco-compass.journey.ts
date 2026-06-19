/**
 * 🌿 個人生態羅盤 - 完整客戶旅程定義
 * Personal Eco Compass - Complete Customer Journey
 * 
 * 服務代號：E1
 * 服務類別：環境永續
 * 核心價值：幫助個人與組織量化其環境影響力，建立永續意識
 */

import { CustomerJourney, JourneyStage, Touchpoint } from '../types/customer-journey';

/**
 * 完整旅程定義
 */
export const PersonalEcoCompassJourney: CustomerJourney = {
    serviceId: 'personal-eco-compass',
    serviceName: '個人生態羅盤',
    serviceNameEn: 'Personal Eco Compass',
    category: 'environmental',

    // ===== 學習目標（服務即教學） =====
    learningObjectives: [
        '理解個人碳足跡的組成要素',
        '掌握環境影響力的量化方法',
        '學習永續生活方式的具體實踐',
        '建立持續改善的追蹤機制'
    ],

    // ===== 可獲得的知識資產 =====
    knowledgeAssets: [
        {
            id: 'eco-compass-certificate',
            name: '生態羅盤認證徽章',
            type: 'certificate'
        },
        {
            id: 'carbon-footprint-report',
            name: '個人碳足跡報告',
            type: 'report'
        },
        {
            id: 'impact-evidence',
            name: '環境影響力證據',
            type: 'evidence'
        }
    ],

    // ===== 旅程階段 =====
    stages: [
        // ===== 階段 1：發現 (Discovery) =====
        {
            id: 'eco-compass-discovery',
            name: 'discovery',
            displayName: '發現服務',
            description: '用戶首次接觸個人生態羅盤服務，了解功能與價值主張',
            estimatedDuration: '3-5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass',
                    action: '瀏覽服務介紹頁面',
                    expectedResponse: '展示服務特色、成功案例、定價方案',
                    fiveTCompliance: {
                        tangible: true,      // ✅ 視覺化案例展示
                        traceable: false,    // ❌ 尚未產生個人數據
                        trackable: false,    // ❌ 尚未開始追蹤
                        transparent: true,   // ✅ 公開計算方法與定價
                        trustworthy: true    // ✅ 顯示官方認證標章
                    },
                    learningOutcome: '了解碳足跡的基本概念與計算方法'
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass#demo',
                    action: '觀看互動式 Demo',
                    expectedResponse: '模擬計算流程，展示報告範例',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: false   // Demo 數據非真實
                    },
                    learningOutcome: '理解評估流程與預期成果'
                }
            ],

            expectedOutcome: '用戶理解服務價值，決定開始使用',
            fiveTValidation: {
                tangible: true,
                traceable: false,
                trackable: false,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['碳足跡基礎知識']
        },

        // ===== 階段 2：引導 (Onboarding) =====
        {
            id: 'eco-compass-onboarding',
            name: 'onboarding',
            displayName: '開始評估',
            description: '用戶創建首次生態評估，輸入基本資料',
            estimatedDuration: '10-15 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/new',
                    action: '點擊「開始評估」按鈕',
                    expectedResponse: '進入評估表單頁面',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: true,     // ✅ 開始記錄用戶行為
                        transparent: true,
                        trustworthy: false
                    }
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/new#step-1',
                    action: '填寫基本資料（組織名稱、產業類別、員工數）',
                    expectedResponse: '表單驗證，顯示引導提示',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,     // ✅ 數據來源：用戶輸入
                        trackable: true,
                        transparent: true,
                        trustworthy: false
                    },
                    learningOutcome: '了解哪些因素影響碳排放'
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/new#step-2',
                    action: '填寫能源使用數據（電力、燃料）',
                    expectedResponse: '即時顯示預估碳排放量',
                    fiveTCompliance: {
                        tangible: true,      // ✅ 即時反饋視覺化
                        traceable: true,
                        trackable: true,
                        transparent: true,   // ✅ 顯示計算公式
                        trustworthy: false
                    },
                    learningOutcome: '學習能源使用與碳排放的關係'
                },
                {
                    type: 'api',
                    path: 'POST /api/eco-assessments',
                    action: '提交評估數據',
                    expectedResponse: '返回評估 ID 與初步結果',
                    fiveTCompliance: {
                        tangible: false,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ API 返回 Hash Lock
                    }
                }
            ],

            expectedOutcome: '成功創建首次評估，獲得評估 ID',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['能源使用數據收集方法', '碳排放計算公式']
        },

        // ===== 階段 3：參與 (Engagement) =====
        {
            id: 'eco-compass-engagement',
            name: 'engagement',
            displayName: '深度分析',
            description: '用戶查看詳細報告，探索改善建議',
            estimatedDuration: '15-20 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/reports/:id',
                    action: '查看完整評估報告',
                    expectedResponse: '展示碳足跡分析圖表、影響力評分',
                    fiveTCompliance: {
                        tangible: true,      // ✅ 豐富的視覺化圖表
                        traceable: true,
                        trackable: true,
                        transparent: true,   // ✅ 每個數據點可點擊查看來源
                        trustworthy: true
                    },
                    learningOutcome: '理解碳足跡的構成與熱點分析'
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/reports/:id#recommendations',
                    action: '瀏覽個人化改善建議',
                    expectedResponse: '顯示 5-10 項可執行的減碳方案',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '學習具體的減碳策略與預期效益'
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/reports/:id#benchmark',
                    action: '對比產業基準',
                    expectedResponse: '顯示同產業平均值與領先企業數據',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,     // ✅ 基準數據來自公開數據庫
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '了解自身在產業中的相對位置'
                }
            ],

            expectedOutcome: '用戶深入理解自身環境影響力，建立改善意識',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['產業碳排放基準知識', '減碳策略資料庫']
        },

        // ===== 階段 4：價值實現 (Value Realization) =====
        {
            id: 'eco-compass-value-realization',
            name: 'value-realization',
            displayName: '獲得成果',
            description: '用戶下載報告、取得認證、建立追蹤計畫',
            estimatedDuration: '5-10 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/reports/:id/download',
                    action: '下載 PDF 完整報告',
                    expectedResponse: '生成帶浮水印的專業報告',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ PDF 嵌入驗證 QR Code
                    },
                    learningOutcome: '獲得可對外展示的正式文件'
                },
                {
                    type: 'api',
                    path: 'POST /api/evidence/create',
                    action: '生成不可篡改的證據',
                    expectedResponse: '返回證據 UUID 與區塊鏈 Hash',
                    fiveTCompliance: {
                        tangible: false,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ SHA-256 Hash Lock
                    }
                },
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/action-plan',
                    action: '創建減碳行動計畫',
                    expectedResponse: '設定目標、選擇行動項目、設定追蹤頻率',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '掌握目標設定與持續改善方法'
                },
                {
                    type: 'notification',
                    path: 'email',
                    action: '接收認證徽章',
                    expectedResponse: 'Email 包含數位徽章與分享連結',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    }
                }
            ],

            expectedOutcome: '用戶獲得具體成果：報告、證據、徽章、行動計畫',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: [
                '生態羅盤認證徽章',
                '碳足跡專業報告',
                '區塊鏈不可篡改證據'
            ]
        },

        // ===== 階段 5：倡導 (Advocacy) =====
        {
            id: 'eco-compass-advocacy',
            name: 'advocacy',
            displayName: '分享推薦',
            description: '用戶分享成果、推薦他人、參與社群',
            estimatedDuration: '3-5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/personal-eco-compass/share',
                    action: '分享成果到社群媒體',
                    expectedResponse: '生成帶 OG 圖片的分享連結',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,     // ✅ 追蹤分享次數
                        transparent: true,
                        trustworthy: true
                    }
                },
                {
                    type: 'ui',
                    path: '/evidence/:uuid',
                    action: '公開證據頁面供他人驗證',
                    expectedResponse: '任何人可驗證證據真實性',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true    // ✅ 完整 5T 合規
                    },
                    learningOutcome: '理解去中心化驗證的價值'
                },
                {
                    type: 'ui',
                    path: '/community/eco-warriors',
                    action: '加入生態戰士社群',
                    expectedResponse: '顯示排行榜、分享經驗',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: false
                    }
                }
            ],

            expectedOutcome: '用戶成為品牌倡導者，推薦他人使用',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['生態戰士徽章', '社群影響力分數']
        }
    ],

    // ===== 總體指標 =====
    totalDuration: '36-55 分鐘',

    // ===== 驗收標準 =====
    successCriteria: [
        {
            id: 'sc-1',
            description: '用戶成功創建評估並獲得 ID',
            validationMethod: 'automated',
            expected: 'Assessment ID 符合格式 eco-YYYYMMDD-XXXXXXXX',
            actualQuery: 'SELECT id FROM eco_assessments WHERE user_id = ?'
        },
        {
            id: 'sc-2',
            description: '報告包含完整的 5T 驗證資訊',
            validationMethod: 'automated',
            expected: '所有數據點都有 source_origin、timestamp、formula、hash',
            actualQuery: 'CHECK evidence.5t_compliance = true'
        },
        {
            id: 'sc-3',
            description: '用戶成功下載 PDF 報告',
            validationMethod: 'automated',
            expected: 'PDF 檔案包含 QR Code 與驗證連結'
        },
        {
            id: 'sc-4',
            description: '證據已鎖定且不可篡改',
            validationMethod: 'automated',
            expected: 'SHA-256 Hash 驗證通過',
            actualQuery: 'VERIFY evidence.hash = SHA256(evidence.data)'
        },
        {
            id: 'sc-5',
            description: '用戶獲得認證徽章',
            validationMethod: 'automated',
            expected: '用戶知識資產中包含「生態羅盤認證」',
            actualQuery: 'SELECT * FROM user_badges WHERE badge_id = "eco-compass-certified"'
        }
    ]
};
