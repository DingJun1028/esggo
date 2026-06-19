/**
 * 🧮 碳足跡計算器 - 完整客戶旅程定義
 * Carbon Calculator - Complete Customer Journey
 * 
 * 服務代號：E2
 * 服務類別：環境永續
 * 核心價值：精準量化個人與組織的碳排放，提供科學依據的減碳方案
 */

import { CustomerJourney } from '../types/customer-journey';

export const CarbonCalculatorJourney: CustomerJourney = {
    serviceId: 'carbon-calculator',
    serviceName: '碳足跡計算器',
    serviceNameEn: 'Carbon Calculator',
    category: 'environmental',

    learningObjectives: [
        '理解碳排放的主要來源類別',
        '掌握不同活動類型的排放係數',
        '學習國際碳盤查標準（GHG Protocol）',
        '建立科學化的減碳目標設定方法'
    ],

    knowledgeAssets: [
        {
            id: 'carbon-calculator-badge',
            name: '碳計算專家徽章',
            type: 'badge'
        },
        {
            id: 'emission-breakdown-report',
            name: '碳排放結構分析報告',
            type: 'report'
        },
        {
            id: 'reduction-roadmap',
            name: '減碳路徑圖',
            type: 'certificate'
        }
    ],

    stages: [
        // 階段 1：發現
        {
            id: 'carbon-calc-discovery',
            name: 'discovery',
            displayName: '了解碳計算',
            description: '用戶探索碳足跡計算工具的功能與應用場景',
            estimatedDuration: '5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/carbon-calculator',
                    action: '瀏覽碳計算器介紹頁面',
                    expectedResponse: '展示計算器功能、支援的活動類型、計算標準',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '了解碳排放計算的國際標準與方法學'
                },
                {
                    type: 'ui',
                    path: '/services/carbon-calculator#emission-factors',
                    action: '查看排放係數資料庫',
                    expectedResponse: '顯示各類活動的排放係數與資料來源',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,  // 係數來源可追溯
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '認識不同國家與產業的排放係數差異'
                }
            ],

            expectedOutcome: '用戶理解碳計算器的專業性與可靠度',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: false,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['碳排放基礎概念', 'GHG Protocol 標準']
        },

        // 階段 2：引導
        {
            id: 'carbon-calc-onboarding',
            name: 'onboarding',
            displayName: '開始計算',
            description: '用戶選擇活動類型並輸入數據進行首次計算',
            estimatedDuration: '10 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/new',
                    action: '選擇活動類型（交通、能源、廢棄物等）',
                    expectedResponse: '顯示該類型的數據輸入表單',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: true,
                        transparent: true,
                        trustworthy: false
                    }
                },
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/new#input-data',
                    action: '輸入活動數據（距離、用量、頻率）',
                    expectedResponse: '即時顯示預估碳排放量',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: false
                    },
                    learningOutcome: '理解活動強度與碳排放的線性關係'
                },
                {
                    type: 'api',
                    path: 'POST /api/carbon-calculations',
                    action: '提交計算請求',
                    expectedResponse: '返回計算結果與詳細排放拆解',
                    fiveTCompliance: {
                        tangible: false,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    }
                }
            ],

            expectedOutcome: '成功完成首次碳排放計算',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['排放係數應用方法', '數據收集最佳實踐']
        },

        // 階段 3：參與
        {
            id: 'carbon-calc-engagement',
            name: 'engagement',
            displayName: '深度分析',
            description: '用戶查看詳細排放結構，比較不同情境',
            estimatedDuration: '15 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/results/:id',
                    action: '查看排放結構圖',
                    expectedResponse: '顯示 Scope 1/2/3 分類與佔比',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '理解 GHG Protocol 的 Scope 分類法'
                },
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/results/:id#comparison',
                    action: '比較多個計算情境',
                    expectedResponse: '並排顯示不同方案的碳排放差異',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '學習如何評估減碳方案的效益'
                }
            ],

            expectedOutcome: '用戶深入理解自身碳排放結構',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['Scope 1/2/3 分類知識', '情境分析方法']
        },

        // 階段 4：價值實現
        {
            id: 'carbon-calc-value-realization',
            name: 'value-realization',
            displayName: '獲得成果',
            description: '用戶下載報告、設定減碳目標、取得認證',
            estimatedDuration: '10 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/results/:id/download',
                    action: '下載 ISO 14064 格式報告',
                    expectedResponse: 'PDF 符合國際標準格式',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    }
                },
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/reduction-plan',
                    action: '設定 SBTi 減碳目標',
                    expectedResponse: '生成符合科學基礎的減碳路徑',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '掌握1.5°C 情境下的減碳目標設定'
                }
            ],

            expectedOutcome: '獲得專業碳盤查報告與減碳路徑圖',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['碳計算專家徽章', 'ISO 14064 報告', 'SBTi 目標']
        },

        // 階段 5：倡導
        {
            id: 'carbon-calc-advocacy',
            name: 'advocacy',
            displayName: '分享推廣',
            description: '用戶展示成果，參與碳中和社群',
            estimatedDuration: '5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/carbon-calculator/share',
                    action: '分享減碳承諾卡',
                    expectedResponse: '生成社群媒體圖卡',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    }
                }
            ],

            expectedOutcome: '成為碳中和倡導者',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            }
        }
    ],

    totalDuration: '45 分鐘',

    successCriteria: [
        {
            id: 'sc-1',
            description: '成功完成至少 3 種活動類型的碳排放計算',
            validationMethod: 'automated',
            expected: 'calculations.count >= 3'
        },
        {
            id: 'sc-2',
            description: '報告符合 ISO 14064 標準格式',
            validationMethod: 'automated',
            expected: 'report.standard === "ISO_14064"'
        },
        {
            id: 'sc-3',
            description: '設定的減碳目標符合 SBTi 科學基礎',
            validationMethod: 'automated',
            expected: 'target.validated_by === "SBTi"'
        }
    ]
};
