/**
 * 💼 Journey Flow: CFO (財務主管)
 * Sprint 1: 核心旅程定義
 * --------------------------------------------------
 * Persona: 40-55歲，關注 ROI、預算、風險量化
 */

import type { JourneyFlow } from '../../src/types/esg-go/journey-flows.types';

export const CFOJourneyFlow: JourneyFlow = {
    id: 'cfo-journey',
    personaName: 'CFO / 財務主管',
    personaTitle: '陳財務長 (48歲, 上市公司)',
    primaryPainPoint: 'ESG 投資 ROI 不明、預算效益難量化、董事會需要風險財務化報告',

    successCriteria: [
        'ROI 儀表板清晰呈現',
        'Board Copilot 減少簡報準備時間 80%',
        '工時追蹤功能滿足預算管控需求',
    ],

    stages: [
        {
            stage: 'discovery',
            displayName: '發現階段',
            description: '董事會要求提供 ESG 風險與財務影響報告',
            duration: '1 週',
            touchpoints: [
                {
                    id: 'cfo-board-request',
                    name: '董事會要求',
                    type: 'landing',
                    description: '董事會決議：下季度提供 ESG 風險財務化報告',
                    userAction: {
                        type: 'review',
                        target: '董事會會議紀錄',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '委託 ESG 專員研究解決方案',
                        successCriteria: 'ESG 專員推薦 ESG GO 平台',
                    },
                },
                {
                    id: 'cfo-review-proposal',
                    name: '審查提案',
                    type: 'form',
                    description: '審查 ESG 專員提出的平台採購提案',
                    userAction: {
                        type: 'review',
                        target: '採購提案文件',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              方案比較：
              - 傳統顧問: ¥500,000 + 未知工時
              - ESG GO Pro: ¥117,600/年 + 工時透明追蹤
              - 節省: 76%
            `,
                        successCriteria: '要求安排高階 Demo',
                    },
                },
            ],
            keyOutcome: '批准試用 ESG GO Pro',
        },

        {
            stage: 'onboarding',
            displayName: '入門階段 (L2 健檢 + 預算規劃)',
            description: '委託 ESG 專員執行 L2 深診，審查預算需求',
            duration: '2 週',
            touchpoints: [
                {
                    id: 'cfo-l2-commission',
                    name: '委託 L2 深診',
                    type: 'assessment',
                    description: '指示 ESG 專員執行完整健檢',
                    userAction: {
                        type: 'click',
                        target: 'L2 深診授權',
                        expectedDuration: '10 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: 'L2 深診啟動，預計 72 小時交付',
                        successCriteria: 'ESG 專員開始執行',
                    },
                },
                {
                    id: 'cfo-l2-review',
                    name: '審查 L2 結果',
                    type: 'report',
                    description: '查看健檢報告與預算需求',
                    userAction: {
                        type: 'review',
                        target: 'L2 完整報告',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              健檢結果：
              - 總分: 58/100
              - 缺失項目: 42 個
              - 預估工時: 800 小時
              - 建議預算: ¥2,000,000 (含顧問) vs ¥300,000 (ESG GO Pro)
            `,
                        successCriteria: '理解投資規模與 ROI',
                    },
                },
                {
                    id: 'cfo-budget-approval',
                    name: '預算批准',
                    type: 'form',
                    description: '批准 ESG GO Pro 年度訂閱預算',
                    userAction: {
                        type: 'approve',
                        target: '預算申請單',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '預算核准，ESG 專員可正式啟用',
                        successCriteria: 'Pro 帳戶升級完成',
                    },
                },
            ],
            keyOutcome: '批准年度預算 ¥300K，啟動 ESG 改善專案',
        },

        {
            stage: 'engagement',
            displayName: '參與階段 (工時追蹤 + ROI 監控)',
            description: '透過儀表板監控專案進度與投資效益',
            duration: '3-6 個月',
            touchpoints: [
                {
                    id: 'cfo-dashboard-setup',
                    name: '設定 CFO 儀表板',
                    type: 'collaboration',
                    description: '客製化 CFO 專屬追蹤儀表板',
                    userAction: {
                        type: 'click',
                        target: 'CFO Dashboard 設定',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              儀表板包含：
              - 工時累計 vs 預算工時
              - 成本節省追蹤
              - 合規達成率
              - 風險降低指標
            `,
                        successCriteria: '儀表板每週自動更新',
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
                    id: 'cfo-monthly-review',
                    name: '月度 ROI 審查',
                    type: 'report',
                    description: '每月查看投資效益報告',
                    userAction: {
                        type: 'review',
                        target: 'ROI 月報',
                        expectedDuration: '30 minutes/month',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: `
              Month 3 成果：
              - 工時節省: 120 小時 (vs 預算 267)
              - 成本節省: ¥600,000 (vs 外部顧問)
              - 合規達成: 65% (42 缺失已補 27 項)
            `,
                        successCriteria: '確認專案按計劃推進',
                    },
                },
                {
                    id: 'cfo-risk-quantification',
                    name: '風險財務化報告',
                    type: 'report',
                    description: '查看 ESG 風險的財務影響量化',
                    userAction: {
                        type: 'review',
                        target: '風險財務化報告',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              風險量化結果：
              - 高碳排風險: 未來 3 年潛在碳稅成本 ¥15M
              - 供應鏈風險: 供應商 ESG 不合規可能導致訂單流失 ¥8M
              - 聲譽風險: 未揭露 ESG 可能影響股價 5-10%
              
              改善後降低：
              - 碳稅風險降低 40% (¥6M)
              - 供應鏈風險降低 60% (¥4.8M)
            `,
                        successCriteria: '董事會接受風險量化模型',
                    },
                },
            ],
            keyOutcome: '建立 ESG 投資效益追蹤機制',
        },

        {
            stage: 'value',
            displayName: '價值實現 (Board Copilot + 董事會簡報)',
            description: '使用 Board Copilot 準備董事會 ESG 報告',
            duration: '1 個月',
            touchpoints: [
                {
                    id: 'cfo-copilot-activate',
                    name: '啟用 Board Copilot',
                    type: 'collaboration',
                    description: '升級至 Scale 方案啟用董事會功能',
                    userAction: {
                        type: 'click',
                        target: 'Board Copilot 模組',
                        expectedDuration: '15 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: 'Board Copilot 立即可用',
                        successCriteria: '可開始準備董事會材料',
                    },
                },
                {
                    id: 'cfo-board-prep',
                    name: '生成董事會簡報包',
                    type: 'report',
                    description: '使用 AI 自動生成 L3 董事會簡報',
                    userAction: {
                        type: 'click',
                        target: 'L3 董事會包生成',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              生成內容：
              - Executive Summary (1頁)
              - 風險熱力圖
              - 財務影響預測
              - 同業對標 (vs 5 家競爭對手)
              - Q&A 預演包 (20 個可能提問)
            `,
                        successCriteria: '簡報包符合董事會標準',
                    },
                },
                {
                    id: 'cfo-qa-rehearsal',
                    name: 'Q&A 預演',
                    type: 'collaboration',
                    description: '使用 Board Copilot 模擬董事提問',
                    userAction: {
                        type: 'review',
                        target: 'Q&A 預演清單',
                        expectedDuration: '2 hours',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              預期提問與建議回答：
              Q1: "為何選擇這個平台而非傳統顧問？"
              A1: "成本效益 76% 優勢，且全程可追蹤..."
              
              Q2: "ROI 如何證明？"
              A2: "已節省 400 工時，成本節省 ¥1.5M..."
              
              Q3: "風險降低可量化嗎？"
              A3: "碳稅風險降低 ¥6M, 供應鏈風險..."
            `,
                        successCriteria: '準備充分，信心滿滿',
                    },
                },
                {
                    id: 'cfo-board-presentation',
                    name: '董事會簡報',
                    type: 'validation',
                    description: '向董事會報告 ESG 投資成果',
                    userAction: {
                        type: 'review',
                        target: '董事會會議',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '董事會一致通過，批准持續投資',
                        successCriteria: '獲得董事會認可與額外預算',
                    },
                },
            ],
            keyOutcome: '董事會批准 ESG 策略，追加預算支持',
        },

        {
            stage: 'advocacy',
            displayName: '倡導推薦',
            description: '成為平台企業級客戶代言人',
            duration: '1 年後',
            touchpoints: [
                {
                    id: 'cfo-success-metrics',
                    name: '年度成果彙總',
                    type: 'report',
                    description: '查看全年 ESG 投資回報',
                    userAction: {
                        type: 'review',
                        target: '年度 ROI 報告',
                        expectedDuration: '2 hours',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: `
              年度成果：
              - 總投資: ¥300,000
              - 工時節省: 800 小時 (價值 ¥1,600,000)
              - 成本避免: ¥10,800,000 (風險降低)
              - 總 ROI: 3600%
              - 合規達成: 95%
            `,
                        successCriteria: '證明 ESG 數位化價值',
                    },
                },
                {
                    id: 'cfo-case-study',
                    name: '參與財務長圓桌論壇',
                    type: 'collaboration',
                    description: '受邀分享 ESG 財務管理經驗',
                    userAction: {
                        type: 'click',
                        target: '論壇邀請',
                        expectedDuration: '4 hours',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '論壇簡報發布，提升公司品牌',
                        successCriteria: '建立產業影響力',
                    },
                },
                {
                    id: 'cfo-enterprise-upgrade',
                    name: '升級 Enterprise 方案',
                    type: 'upgrade',
                    description: '擴展至集團其他子公司',
                    userAction: {
                        type: 'click',
                        target: 'Enterprise 升級',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '集團授權啟動，涵蓋 5 家子公司',
                        successCriteria: '集團級 ESG 數位化轉型',
                    },
                },
            ],
            keyOutcome: '成為平台旗艦客戶，帶動集團數位轉型',
        },
    ],

    conversionGoal: 'Pro 單一訂閱 → Enterprise 集團授權 (目標 LTV ¥1,500,000)',
};
