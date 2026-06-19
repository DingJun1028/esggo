/**
 * 📊 Journey Flow: ESG 專員 (上市櫃公司永續發展專員)
 * Sprint 1: 核心旅程定義
 * --------------------------------------------------
 * Persona: 28-40歲，負責 ESG 報告編制，需跨部門協作工具
 */

import type { JourneyFlow } from '../../src/types/esg-go/journey-flows.types';

export const ESGOfficerJourneyFlow: JourneyFlow = {
    id: 'esg-officer-journey',
    personaName: 'ESG 專員',
    personaTitle: '林專員 (32歲, 上市櫃公司永續部)',
    primaryPainPoint: '跨部門要資料困難、資料品質參差不齊、報告編制時間壓力大',

    successCriteria: [
        'Evidence Vault 簡化跨部門協作',
        'Report QA Score 提供明確改進方向',
        '最終通過第三方確信',
    ],

    stages: [
        {
            stage: 'discovery',
            displayName: '發現階段',
            description: '接到老闆指示：3個月內完成 GRI 報告',
            duration: '1 天',
            touchpoints: [
                {
                    id: 'officer-task-assignment',
                    name: '任務指派',
                    type: 'landing',
                    description: '老闆要求完成 GRI 標準報告',
                    userAction: {
                        type: 'review',
                        target: '內部任務單',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '研究 ESG 報告編制工具',
                        successCriteria: '找到 ESG GO 平台',
                    },
                },
                {
                    id: 'officer-demo-request',
                    name: '預約 Demo',
                    type: 'form',
                    description: '填寫企業資訊預約產品演示',
                    userAction: {
                        type: 'fill',
                        target: 'Demo 預約表單',
                        expectedDuration: '10 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '銷售團隊安排 1 小時線上 Demo',
                        successCriteria: '完成 Demo，決定試用',
                    },
                },
            ],
            keyOutcome: '註冊企業帳號，啟動 Pro 試用',
        },

        {
            stage: 'onboarding',
            displayName: '入門階段 (L2 深診)',
            description: '執行完整 ESG 健康檢查',
            duration: '1 週',
            touchpoints: [
                {
                    id: 'officer-l2-start',
                    name: '啟動 L2 深度診斷',
                    type: 'assessment',
                    description: '選擇 GRI 框架，開始 97 指標檢查',
                    userAction: {
                        type: 'click',
                        target: 'L2 深診按鈕',
                        expectedDuration: '5 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '系統生成 97 指標清單',
                        successCriteria: '進入逐項填寫介面',
                    },
                },
                {
                    id: 'officer-l2-fill',
                    name: '填寫初步資料',
                    type: 'form',
                    description: '填寫已知的公司基本資料',
                    userAction: {
                        type: 'fill',
                        target: 'L2 評估表單',
                        expectedDuration: '2 hours',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '自動儲存，顯示完成度 35%',
                        successCriteria: '識別缺失項目',
                    },
                },
                {
                    id: 'officer-l2-result',
                    name: '查看初步結果',
                    type: 'report',
                    description: '查看缺失指標清單',
                    userAction: {
                        type: 'review',
                        target: 'L2 初步報告',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '97 指標中缺 42 個，需跨部門收集',
                        successCriteria: '制定資料收集計畫',
                    },
                },
            ],
            keyOutcome: '明確需要收集的 42 項指標資料',
        },

        {
            stage: 'engagement',
            displayName: '參與階段 (Evidence Vault 協作)',
            description: '使用 Evidence Vault 向各部門收資料',
            duration: '6 週',
            touchpoints: [
                {
                    id: 'officer-vault-setup',
                    name: '設定 Evidence Vault',
                    type: 'collaboration',
                    description: '為 42 項缺失指標建立收集任務',
                    userAction: {
                        type: 'click',
                        target: 'Evidence Vault 管理介面',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '生成 42 個上傳任務，可分配給各部門',
                        successCriteria: '任務清單建立完成',
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
                    id: 'officer-assign-tasks',
                    name: '分配收集任務',
                    type: 'collaboration',
                    description: '透過 Email 邀請各部門上傳資料',
                    userAction: {
                        type: 'click',
                        target: '批量邀請按鈕',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '各部門收到專屬上傳鏈接',
                        successCriteria: '部門開始上傳資料',
                    },
                },
                {
                    id: 'officer-track-progress',
                    name: '追蹤收集進度',
                    type: 'collaboration',
                    description: '即時查看各部門上傳狀態',
                    userAction: {
                        type: 'review',
                        target: '進度儀表板',
                        expectedDuration: 'daily, 5 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '財務部 100%, 人資 80%, 採購 50%',
                        successCriteria: '主動追蹤落後部門',
                    },
                },
                {
                    id: 'officer-validate-data',
                    name: '驗證資料品質',
                    type: 'validation',
                    description: '檢查上傳資料的完整性與準確性',
                    userAction: {
                        type: 'review',
                        target: 'Evidence 審核介面',
                        expectedDuration: '2 hours',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '3 筆資料缺來源標註，退回修正',
                        successCriteria: '所有資料通過 5T 驗證',
                    },
                },
            ],
            keyOutcome: '成功收集 42 項指標資料，5T 驗證通過',
        },

        {
            stage: 'value',
            displayName: '價值實現 (報告生成與優化)',
            description: '使用模板生成報告並透過 QA Score 優化',
            duration: '4 週',
            touchpoints: [
                {
                    id: 'officer-template-select',
                    name: '選擇報告模板',
                    type: 'form',
                    description: '使用「GRI 標準報告模板」',
                    userAction: {
                        type: 'click',
                        target: '模板市集',
                        expectedDuration: '15 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '自動載入已收集資料',
                        successCriteria: '報告初稿生成',
                    },
                },
                {
                    id: 'officer-qa-scan',
                    name: '執行 QA Score 掃描',
                    type: 'assessment',
                    description: '檢查報告品質',
                    userAction: {
                        type: 'click',
                        target: 'QA Score 按鈕',
                        expectedDuration: '5 minutes',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: '初步得分 52/100，顯示缺失清單',
                        successCriteria: '理解需改進項目',
                    },
                },
                {
                    id: 'officer-iterate',
                    name: '迭代優化報告',
                    type: 'form',
                    description: '根據 QA 建議補充資料與說明',
                    userAction: {
                        type: 'fill',
                        target: '報告編輯器',
                        expectedDuration: '2 weeks',
                    },
                    expectedResponse: {
                        type: 'instant',
                        content: 'QA Score 從 52 → 68 → 78 → 85',
                        successCriteria: 'QA Score ≥ 80',
                    },
                },
                {
                    id: 'officer-certification',
                    name: '申請第三方確信',
                    type: 'validation',
                    description: '使用平台對接 BSI/SGS 等確信機構',
                    userAction: {
                        type: 'click',
                        target: '確信對接服務',
                        expectedDuration: '1 hour',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: 'BSI 收到報告並安排審查',
                        successCriteria: '進入確信審查流程',
                    },
                },
            ],
            keyOutcome: 'QA Score 達 85，取得第三方確信報告',
        },

        {
            stage: 'advocacy',
            displayName: '倡導推薦',
            description: '成功後推薦平台給同業或供應商',
            duration: '6 個月後',
            touchpoints: [
                {
                    id: 'officer-case-study',
                    name: '參與成功案例撰寫',
                    type: 'collaboration',
                    description: '平台邀請撰寫使用心得',
                    userAction: {
                        type: 'fill',
                        target: '案例訪談表單',
                        expectedDuration: '2 hours',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '案例發布於平台官網',
                        successCriteria: '提升個人專業形象',
                    },
                },
                {
                    id: 'officer-recommend',
                    name: '推薦給供應商',
                    type: 'collaboration',
                    description: '邀請供應商使用平台進行 ESG 對接',
                    userAction: {
                        type: 'click',
                        target: '供應鏈溯源網邀請',
                        expectedDuration: '30 minutes',
                    },
                    expectedResponse: {
                        type: 'email',
                        content: '供應商收到免費使用邀請',
                        successCriteria: '建立供應鏈 ESG 協作',
                    },
                },
            ],
            keyOutcome: '成為平台 Power User，擴展至供應鏈管理',
        },
    ],

    conversionGoal: 'Pro 試用 → 年度訂閱 (目標轉換率 65%)',
};
