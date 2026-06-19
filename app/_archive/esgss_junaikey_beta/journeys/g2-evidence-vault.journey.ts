/**
 * 🏛️ 證據保險庫 - 完整客戶旅程定義  
 * Evidence Vault - Complete Customer Journey
 * 
 * 服務代號：G2
 * 服務類別：公司治理
 * 核心價值：建立不可篡改的證據鏈，確保 ESG 數據的可信度與可驗證性
 */

import { CustomerJourney } from '../types/customer-journey';

export const EvidenceVaultJourney: CustomerJourney = {
    serviceId: 'evidence-vault',
    serviceName: '證據保險庫',
    serviceNameEn: 'Evidence Vault',
    category: 'governance',

    learningObjectives: [
        '理解區塊鏈不可篡改的技術原理',
        '掌握證據分類與標籤管理方法',
        '學習數位簽章與時間戳記驗證',
        '建立完整的證據鏈管理流程'
    ],

    knowledgeAssets: [
        {
            id: 'evidence-guardian-badge',
            name: '證據守護者徽章',
            type: 'badge'
        },
        {
            id: 'immutable-evidence-chain',
            name: '不可篡改證據鏈',
            type: 'evidence'
        },
        {
            id: 'vault-master-certificate',
            name: '保險庫管理師認證',
            type: 'certificate'
        }
    ],

    stages: [
        // 階段 1：發現
        {
            id: 'vault-discovery',
            name: 'discovery',
            displayName: '認識保險庫',
            description: '用戶了解證據保險庫的技術架構與安全性',
            estimatedDuration: '5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/evidence-vault',
                    action: '瀏覽證據保險庫介紹',
                    expectedResponse: '展示區塊鏈技術、Hash Lock、時間戳記',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '理解 SHA-256 加密與區塊鏈防篡改原理'
                },
                {
                    type: 'ui',
                    path: '/services/evidence-vault#security-demo',
                    action: '觀看安全性驗證 Demo',
                    expectedResponse: '互動式展示如何驗證證據真偽',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: false  // Demo 非真實
                    }
                }
            ],

            expectedOutcome: '用戶信任保險庫的安全性與專業度',
            fiveTValidation: {
                tangible: true,
                traceable: false,
                trackable: false,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['區塊鏈基礎知識', 'Hash Lock 原理']
        },

        // 階段 2：引導
        {
            id: 'vault-onboarding',
            name: 'onboarding',
            displayName: '首次上傳',
            description: '用戶上傳第一份證據並完成鎖定',
            estimatedDuration: '15 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/evidence-vault/upload',
                    action: '選擇檔案並填寫metadata',
                    expectedResponse: '引導填寫標題、類別、標籤、機密等級',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: true,
                        transparent: true,
                        trustworthy: false
                    }
                },
                {
                    type: 'api',
                    path: 'POST /api/evidence',
                    action: '上傳證據檔案',
                    expectedResponse: '返回證據 UUID 與初步 Hash',
                    fiveTCompliance: {
                        tangible: false,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: false  // 尚未最終鎖定
                    }
                },
                {
                    type: 'api',
                    path: 'POST /api/evidence/:uuid/lock',
                    action: '執行 Hash Lock',
                    expectedResponse: '返回不可篡改的 SHA-256 Hash',
                    fiveTCompliance: {
                        tangible: false,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true  // 已完成鎖定
                    },
                    learningOutcome: '理解證據鎖定後即永久不可篡改'
                },
                {
                    type: 'notification',
                    path: 'email',
                    action: '接收證據確認信',
                    expectedResponse: 'Email 包含證據連結與驗證指南',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: false,
                        transparent: true,
                        trustworthy: true
                    }
                }
            ],

            expectedOutcome: '成功上傳並鎖定第一份證據',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['證據上傳流程', 'Metadata 標準化']
        },

        // 階段 3：參與
        {
            id: 'vault-engagement',
            name: 'engagement',
            displayName: '管理證據庫',
            description: '用戶建立系統化的證據管理流程',
            estimatedDuration: '20 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/evidence-vault/mine',
                    action: '瀏覽個人證據清單',
                    expectedResponse: '顯示所有證據的分類、狀態、有效期',
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
                    path: '/services/evidence-vault/search',
                    action: '使用進階搜尋',
                    expectedResponse: '支援全文檢索、標籤篩選、時間範圍',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '掌握高效的證據檢索技巧'
                },
                {
                    type: 'ui',
                    path: '/services/evidence-vault/:uuid/chain',
                    action: '查看證據鏈歷史',
                    expectedResponse: '顯示完整的版本歷史與審計軌跡',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '理解證據鏈的追溯機制'
                }
            ],

            expectedOutcome: '建立完整的證據管理體系',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['證據分類法', '審計軌跡解讀']
        },

        // 階段 4：價值實現
        {
            id: 'vault-value-realization',
            name: 'value-realization',
            displayName: '證據驗證',
            description: '用戶對外展示並驗證證據真實性',
            estimatedDuration: '10 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/evidence/:uuid',
                    action: '生成公開驗證頁面',
                    expectedResponse: '任何人可驗證證據的 Hash 與時間戳記',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    },
                    learningOutcome: '理解去中心化驗證的價值'
                },
                {
                    type: 'ui',
                    path: '/services/evidence-vault/qr-code',
                    action: '生成驗證 QR Code',
                    expectedResponse: '可嵌入報告或簡報的 QR Code',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    }
                },
                {
                    type: 'api',
                    path: 'GET /api/evidence/:uuid/certificate',
                    action: '下載驗證證書',
                    expectedResponse: 'PDF 證書包含完整驗證資訊',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true
                    }
                }
            ],

            expectedOutcome: '獲得可對外展示的驗證證據',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            },
            knowledgeAssets: ['驗證證書', 'QR Code 驗證指南']
        },

        // 階段 5：倡導
        {
            id: 'vault-advocacy',
            name: 'advocacy',
            displayName: '信任倡導',
            description: '用戶成為數位信任的倡導者',
            estimatedDuration: '5 分鐘',

            touchpoints: [
                {
                    type: 'ui',
                    path: '/services/evidence-vault/share',
                    action: '分享驗證成果',
                    expectedResponse: '生成專業的分享素材',
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
                    path: '/community/trust-network',
                    action: '加入信任網絡',
                    expectedResponse: '與其他證據守護者交流',
                    fiveTCompliance: {
                        tangible: true,
                        traceable: false,
                        trackable: false,
                        transparent: true,
                        trustworthy: false
                    }
                }
            ],

            expectedOutcome: '成為證據守護者社群成員',
            fiveTValidation: {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            }
        }
    ],

    totalDuration: '55 分鐘',

    successCriteria: [
        {
            id: 'sc-1',
            description: '成功上傳並鎖定至少 1 份證據',
            validationMethod: 'automated',
            expected: 'evidence.status === "locked" && evidence.hash.length === 64'
        },
        {
            id: 'sc-2',
            description: '證據可通過公開頁面驗證',
            validationMethod: 'automated',
            expected: 'public_verification.result === "verified"'
        },
        {
            id: 'sc-3',
            description: '獲得證據守護者徽章',
            validationMethod: 'automated',
            expected: 'badges.includes("evidence-guardian")'
        }
    ]
};
