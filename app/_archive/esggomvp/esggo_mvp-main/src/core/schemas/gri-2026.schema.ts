/**
 * GRI 2026 永續準則揭露 JSON Schema
 * mod-gov-gri-0001 | /omni/gri-mapper
 * GRI Standards 2021 (effective 2023) → GRI 2026 Update
 */

export const GRI_2026_SCHEMA = {
    id: 'rep-gri-001',
    version: '2.1.0',
    title: 'GRI 2026 永續準則揭露',
    title_en: 'GRI 2026 Standards Disclosure',
    standard: 'GRI Universal Standards 2021',
    sections: [
        {
            id: 'section-gri-2',
            title: 'GRI 2：組織通用揭露',
            title_en: 'GRI 2: General Disclosures',
            fields: [
                {
                    id: 'gri2_org_name',
                    label: '組織名稱 (GRI 2-1)',
                    label_en: 'Organizational Name (GRI 2-1)',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'gri2_reporting_period',
                    label: '報告期間 (GRI 2-3)',
                    label_en: 'Reporting Period (GRI 2-3)',
                    type: 'text',
                    required: true,
                    placeholder: '2025年1月1日 - 2025年12月31日',
                },
                {
                    id: 'gri2_employees_total',
                    label: '員工總數 (GRI 2-7)',
                    label_en: 'Total Employees (GRI 2-7)',
                    type: 'number',
                    required: true,
                    unit: '人',
                },
                {
                    id: 'gri2_supply_chain_desc',
                    label: '價值鏈描述 (GRI 2-6)',
                    label_en: 'Value Chain Description (GRI 2-6)',
                    type: 'textarea',
                    required: true,
                },
                {
                    id: 'gri2_stakeholder_engagement',
                    label: '利害關係人參與方法 (GRI 2-29)',
                    label_en: 'Stakeholder Engagement (GRI 2-29)',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
        {
            id: 'section-gri-3',
            title: 'GRI 3：重大主題',
            title_en: 'GRI 3: Material Topics',
            fields: [
                {
                    id: 'gri3_materiality_process',
                    label: '重大性決定過程 (GRI 3-1)',
                    label_en: 'Process for Determining Material Topics (GRI 3-1)',
                    type: 'textarea',
                    required: true,
                },
                {
                    id: 'gri3_material_topics',
                    label: '重大主題列表 (GRI 3-2)',
                    label_en: 'List of Material Topics (GRI 3-2)',
                    type: 'textarea',
                    required: true,
                    placeholder: '例如：碳排放管理、人才培育、資安治理',
                },
            ],
        },
        {
            id: 'section-gri-302',
            title: 'GRI 302：能源',
            title_en: 'GRI 302: Energy',
            fields: [
                {
                    id: 'gri302_energy_consumption',
                    label: '組織內部能源消耗 (GRI 302-1)',
                    label_en: 'Energy Consumption Within Organization (GRI 302-1)',
                    type: 'number',
                    required: true,
                    unit: 'GJ',
                },
                {
                    id: 'gri302_renewable_pct',
                    label: '再生能源使用比例 (%)',
                    label_en: 'Renewable Energy Percentage (%)',
                    type: 'number',
                    required: false,
                    unit: '%',
                },
                {
                    id: 'gri302_energy_intensity',
                    label: '能源密集度 (GRI 302-3)',
                    label_en: 'Energy Intensity (GRI 302-3)',
                    type: 'number',
                    required: false,
                    unit: 'GJ/百萬元',
                },
            ],
        },
        {
            id: 'section-gri-303',
            title: 'GRI 303：水與廢水',
            title_en: 'GRI 303: Water and Effluents',
            fields: [
                {
                    id: 'gri303_water_withdrawal',
                    label: '總取水量 (GRI 303-3)',
                    label_en: 'Total Water Withdrawal (GRI 303-3)',
                    type: 'number',
                    required: false,
                    unit: '百萬升 (ML)',
                },
                {
                    id: 'gri303_water_intensity',
                    label: '用水密集度',
                    label_en: 'Water Intensity',
                    type: 'number',
                    required: false,
                    unit: 'ML/百萬元',
                },
            ],
        },
        {
            id: 'section-gri-401',
            title: 'GRI 401：就業',
            title_en: 'GRI 401: Employment',
            fields: [
                {
                    id: 'gri401_new_hires',
                    label: '新進員工人數 (GRI 401-1)',
                    label_en: 'New Employee Hires (GRI 401-1)',
                    type: 'number',
                    required: false,
                    unit: '人',
                },
                {
                    id: 'gri401_turnover_rate',
                    label: '離職率 (%)',
                    label_en: 'Turnover Rate (%)',
                    type: 'number',
                    required: false,
                    unit: '%',
                },
            ],
        },
        {
            id: 'section-gri-405',
            title: 'GRI 405：多元化與平等機會',
            title_en: 'GRI 405: Diversity and Equal Opportunity',
            fields: [
                {
                    id: 'gri405_board_diversity',
                    label: '治理機構多元化 (GRI 405-1)',
                    label_en: 'Diversity of Governance Bodies (GRI 405-1)',
                    type: 'textarea',
                    required: false,
                    placeholder: '按性別、年齡層、職等分列董事會組成',
                },
                {
                    id: 'gri405_female_board_pct',
                    label: '女性董事佔比 (%)',
                    label_en: 'Female Board Percentage (%)',
                    type: 'number',
                    required: false,
                    unit: '%',
                },
            ],
        },
        {
            id: 'section-gri-appendix',
            title: '內容索引表 (GRI Content Index)',
            title_en: 'GRI Content Index',
            fields: [
                {
                    id: 'gri_content_index_file',
                    label: 'GRI 內容索引表上傳',
                    label_en: 'GRI Content Index Upload',
                    type: 'file',
                    required: false,
                    accept: '.pdf,.xlsx',
                },
                {
                    id: 'assurance_level',
                    label: '確信等級',
                    label_en: 'Assurance Level',
                    type: 'select',
                    options: ['無確信', '有限確信 (Limited Assurance)', '合理確信 (Reasonable Assurance)'],
                    required: false,
                },
            ],
        },
    ],
    framework_mapping: {
        gri: ['GRI 2-1 to 2-30', 'GRI 302', 'GRI 303', 'GRI 305', 'GRI 401', 'GRI 405'],
        tcfd: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'],
        sdg: ['SDG 5 性別平等', 'SDG 8 尊嚴就業', 'SDG 12 負責任消費與生產', 'SDG 13 氣候行動'],
        sasb: ['多產業通用指標'],
    },
} as const;

export type GRI2026Schema = typeof GRI_2026_SCHEMA;
