/**
 * 🏛️ Master Sovereign Sustainability Schema
 * The ultimate aggregation schema for the 2026 Sovereign Report.
 * Covers all 24 MECE service high-level indicators.
 */

export const MASTER_SOVEREIGN_SCHEMA = {
    id: 'rep-master-2026',
    version: '1.0.1',
    title: '2026 萬能永續主權大師報告',
    title_en: '2026 Sovereign Sustainability Master Report',
    standard: 'GRI, TCFD, SASB, 5T Protocol',
    sections: [
        {
            id: 'sec-master-env',
            title: '🌿 環境永續核心 (Environmental Core)',
            title_en: 'Environmental Core',
            fields: [
                { id: 'env_ghg_total', label: '溫室氣體總排放量 (Scope 1+2)', label_en: 'Total GHG Emissions', type: 'number', required: true, unit: 'tCO2e' },
                { id: 'env_renewable_pct', label: '再生能源使用比例', label_en: 'Renewable Energy %', type: 'number', required: true, unit: '%' },
                { id: 'env_water_circular', label: '水資源回用率', label_en: 'Water Circularity', type: 'number', required: false, unit: '%' },
            ]
        },
        {
            id: 'sec-master-soc',
            title: '👥 社會責任核心 (Social Core)',
            title_en: 'Social Core',
            fields: [
                { id: 'soc_employee_engagement', label: '員工敬業度分數', label_en: 'Employee Engagement Score', type: 'number', required: true, unit: '/100' },
                { id: 'soc_safety_incidents', label: '工安事故件數', label_en: 'Safety Incidents', type: 'number', required: true, unit: '件' },
                { id: 'soc_dei_index', label: 'DEI 多元包容指數', label_en: 'DEI Index', type: 'number', required: false, unit: '/100' },
            ]
        },
        {
            id: 'sec-master-gov',
            title: '🏛️ 公司治理核心 (Governance Core)',
            title_en: 'Governance Core',
            fields: [
                { id: 'gov_board_independence', label: '董事會獨立性比例', label_en: 'Board Independence %', type: 'number', required: true, unit: '%' },
                { id: 'gov_ethics_training', label: '道德培訓達成率', label_en: 'Ethics Training Completion', type: 'number', required: true, unit: '%' },
                { id: 'gov_tax_transparency', label: '稅務透明度評等', label_en: 'Tax Transparency Rating', type: 'string', required: false },
            ]
        },
        {
            id: 'sec-master-5t',
            title: '💎 5T 協議驗證 (5T Protocol)',
            title_en: '5T Protocol Verification',
            fields: [
                { id: '5t_integrity_score', label: '數據誠信積分', label_en: 'Integrity Score', type: 'number', required: true, unit: '/1000' },
                { id: '5t_hash_lock', label: '最終雜湊鎖碼', label_en: 'Final Hash Lock', type: 'text', required: true },
            ]
        }
    ],
    framework_mapping: {
        gri: ['General Disclosure', '302', '305', '401'],
        tcfd: ['Metrics and Targets'],
        sdg: ['SDG 7', 'SDG 8', 'SDG 13'],
        sasb: ['Industry Metrics'],
    },
} as const;

export type MasterSovereignSchema = typeof MASTER_SOVEREIGN_SCHEMA;
