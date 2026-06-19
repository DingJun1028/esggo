/**
 * 🏢 Journey Flow: SME 老闆 (傳產中小企業老闆)
 * Sprint 1: 核心旅程定義
 * --------------------------------------------------
 * Persona: 45-60歲，傳統製造/貿易業，需要快速 ESG 合規
 */

import type { JourneyFlow } from '../../src/types/esg-go/journey-flows.types';

export const SMEJourneyFlow: JourneyFlow = {
    id: 'sme-boss-journey',
    personaName: '傳產中小企業老闆',
    personaTitle: '王老闆 (50歲, 製造業)',
    primaryPainPoint: '客戶要求 ESG 報告，但不知從何做起，時間少、要快、要便宜',

    successCriteria: [
        'L1 完成時間 < 20分鐘',
        '看懂缺失報告 (不需技術背景)',
        '願意諮詢升級方案',
    ],

    stages: [
        {
            stage: 'discovery',
            displayName: '發現階段',
            description: '透過 Google 搜尋或客戶推薦找到 ESG GO',
            duration: '5 分鐘',
            touchpoints: [
                {
                    id: 'sme-landing',
                    name: '訪問著陸頁',
                    type: 'landing',
                    description: '查看 ESG GO 主頁，理解平台價值主張',
                    userAction: {
                        type: 'click',
                        target: 'www.esggo.com',
                        expectedDuration: '2 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '清晰的價值主張：「15分鐘發現您的 ESG 缺失」',
                        successCriteria: '用戶點擊「立即快篩」按鈕',
                    },
                },
                {
                    id: 'sme-register',
                    name: '快速註冊',
                    type: 'form',
                    description: '使用 Email 或 Google 快速註冊',
                    userAction: {
                        type: 'fill',
                        target: '註冊表單',
                        expectedDuration: '3 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '自動登入並導向 L1 快篩頁面',
                        successCriteria: '用戶成功進入 L1 評估流程',
                    },
                },
            ],
            keyOutcome: '完成註冊，進入 L1 快篩',
        },

        {
            stage: 'onboarding',
            displayName: '入門階段 (L1 快篩)',
            description: '填寫最小資料集，獲得初步評估',
            duration: '15 分鐘',
            touchpoints: [
                {
                    id: 'sme-l1-intro',
                    name: 'L1 快篩說明',
                    type: 'assessment',
                    description: '查看快篩說明與預期結果',
                    userAction: {
                        type: 'review',
                        target: '快篩說明頁',
                        expectedDuration: '2 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '「只需填寫 20 個問題，立即獲得 ESG 合規分數」',
                        successCriteria: '用戶點擊「開始評估」',
                    },
                },
                {
                    id: 'sme-l1-fill',
                    name: '填寫 MVD',
                    type: 'form',
                    description: '填寫公司基本資料 + G/E/S 快速檢核',
                    userAction: {
                        type: 'fill',
                        target: 'L1 評估表單',
                        expectedDuration: '10 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '進度條即時更新，自動儲存',
                        successCriteria: '用戶完成所有必填項目',
                    },
                    fiveTValidation: {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true,
                    },
                },
                {
                    id: 'sme-l1-submit',
                    name: '提交評估',
                    type: 'assessment',
                    description: '提交並等待評分結果',
                    userAction: {
                        type: 'click',
                        target: '提交按鈕',
                        expectedDuration: '1 minute',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '即時計算評分 (< 3秒)',
                        successCriteria: '顯示評分結果頁',
                    },
                },
            ],
            keyOutcome: '完成 L1 快篩，獲得評分 (預期 40-60 分)',
        },

        {
            stage: 'engagement',
            displayName: '參與階段 (查看結果)',
            description: '查看評分、缺失清單、預估工時',
            duration: '10 分鐘',
            touchpoints: [
                {
                    id: 'sme-view-score',
                    name: '查看評分儀表板',
                    type: 'report',
                    description: '查看總分與 G/E/S 分項得分',
                    userAction: {
                        type: 'review',
                        target: '評分儀表板',
                        expectedDuration: '3 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '總分 45/100，G: 50, E: 40, S: 45',
                        successCriteria: '用戶理解評分含義',
                    },
                },
                {
                    id: 'sme-view-gaps',
                    name: '查看前 5 大缺失',
                    type: 'report',
                    description: '查看具體缺失項目與建議',
                    userAction: {
                        type: 'review',
                        target: '缺失清單',
                        expectedDuration: '5 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              1. 無碳排放盤查 (Critical, 需 40 小時)
              2. 無供應商管理制度 (High, 需 30 小時)
              3. 無員工滿意度調查 (High, 需 20 小時)
              4. 無董事會 ESG 議題討論 (Medium, 需 10 小時)
              5. 無環境政策文件 (Medium, 需 8 小時)
            `,
                        successCriteria: '用戶理解缺失嚴重性與改善方向',
                    },
                },
                {
                    id: 'sme-view-estimate',
                    name: '查看工時預估',
                    type: 'report',
                    description: '查看補齊缺失所需總工時',
                    userAction: {
                        type: 'review',
                        target: '工時預估器',
                        expectedDuration: '2 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '預估需 108 小時 (約 3 個月兼職)',
                        successCriteria: '用戶有心理預期',
                    },
                },
            ],
            keyOutcome: '理解現狀與改善所需資源',
        },

        {
            stage: 'value',
            displayName: '價值實現 (升級決策)',
            description: '決定是否升級 Pro 版本',
            duration: '1-7 天',
            touchpoints: [
                {
                    id: 'sme-cta-upgrade',
                    name: '查看升級選項',
                    type: 'upgrade',
                    description: '比較 Lite vs Pro 功能差異',
                    userAction: {
                        type: 'review',
                        target: '升級頁面',
                        expectedDuration: '5 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              Pro 版優勢：
              - 顧問模板市集 (快速補齊缺失)
              - Evidence Vault (跨部門協作)
              - Report QA Score (品質保證)
              - 月費 ¥9,800 vs 外部顧問 ¥50,000+
            `,
                        successCriteria: '用戶理解 ROI',
                    },
                },
                {
                    id: 'sme-consult',
                    name: '聯繫銷售諮詢',
                    type: 'collaboration',
                    description: '透過線上客服或預約電話諮詢',
                    userAction: {
                        type: 'click',
                        target: '聯繫銷售按鈕',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '銷售團隊 24 小時內回覆',
                        successCriteria: '用戶收到客製化報價',
                    },
                },
                {
                    id: 'sme-purchase',
                    name: '訂閱 Pro 版',
                    type: 'upgrade',
                    description: '完成付款並啟用 Pro 功能',
                    userAction: {
                        type: 'click',
                        target: '訂閱按鈕',
                        expectedDuration: '10 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '自動開通 Pro 權限，獲得歡迎郵件',
                        successCriteria: 'Pro 功能立即可用',
                    },
                },
            ],
            keyOutcome: '訂閱 Pro 版，開始使用進階功能',
        },

        {
            stage: 'advocacy',
            displayName: '倡導推薦',
            description: '成功改善後推薦給同業',
            duration: '3-6 個月後',
            touchpoints: [
                {
                    id: 'sme-success',
                    name: '完成缺失改善',
                    type: 'validation',
                    description: '使用 Pro 版 2-3 個月後完成主要缺失',
                    userAction: {
                        type: 'review',
                        target: '進度追蹤器',
                        expectedDuration: 'ongoing',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: 'L1 分數從 45 → 78',
                        successCriteria: '用戶感受到明顯進步',
                    },
                },
                {
                    id: 'sme-referral',
                    name: '推薦給同業',
                    type: 'collaboration',
                    description: '主動分享使用經驗',
                    userAction: {
                        type: 'click',
                        target: '推薦獎勵計畫',
                        expectedDuration: '5 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '推薦成功可獲 1 個月免費 Pro',
                        successCriteria: '帶來新用戶註冊',
                    },
                },
            ],
            keyOutcome: '成為平台倡導者，帶來口碑傳播',
        },
    ],

    conversionGoal: 'L1 免費用戶 → Pro 付費用戶 (目標轉換率 30%)',
};
