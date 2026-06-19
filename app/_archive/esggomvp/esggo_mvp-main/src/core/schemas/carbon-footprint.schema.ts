/**
 * ISO-14064 碳足跡盤查 JSON Schema
 * mod-env-carbon-0001 | /omni/carbon-inventory
 * 依據「英碼繁博」準則 + 5T Protocol
 */

export const CARBON_FOOTPRINT_SCHEMA = {
    id: 'rep-carbon-001',
    version: '1.2.0',
    title: 'ISO-14064 碳足跡盤查報告',
    title_en: 'ISO-14064 Carbon Footprint Inventory',
    standard: 'ISO 14064-1:2018',
    sections: [
        {
            id: 'section-boundary',
            title: '組織邊界設定',
            title_en: 'Organizational Boundary',
            fields: [
                {
                    id: 'boundary_approach',
                    label: '邊界方法',
                    label_en: 'Boundary Approach',
                    type: 'select',
                    options: ['股權比例法', '財務控制法', '營運控制法'],
                    required: true,
                },
                {
                    id: 'reporting_period_start',
                    label: '盤查起始日',
                    label_en: 'Reporting Period Start',
                    type: 'date',
                    required: true,
                },
                {
                    id: 'reporting_period_end',
                    label: '盤查結束日',
                    label_en: 'Reporting Period End',
                    type: 'date',
                    required: true,
                },
                {
                    id: 'base_year',
                    label: '基準年',
                    label_en: 'Base Year',
                    type: 'number',
                    required: true,
                    placeholder: '2019',
                },
            ],
        },
        {
            id: 'section-scope1',
            title: '範疇一：直接排放',
            title_en: 'Scope 1: Direct Emissions',
            fields: [
                {
                    id: 'scope1_stationary',
                    label: '固定燃燒排放 (tCO₂e)',
                    label_en: 'Stationary Combustion (tCO₂e)',
                    type: 'number',
                    required: true,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope1_mobile',
                    label: '移動燃燒排放 (tCO₂e)',
                    label_en: 'Mobile Combustion (tCO₂e)',
                    type: 'number',
                    required: true,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope1_fugitive',
                    label: '逸散性排放 (tCO₂e)',
                    label_en: 'Fugitive Emissions (tCO₂e)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope1_process',
                    label: '製程排放 (tCO₂e)',
                    label_en: 'Process Emissions (tCO₂e)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e',
                },
            ],
        },
        {
            id: 'section-scope2',
            title: '範疇二：外購能源間接排放',
            title_en: 'Scope 2: Indirect Energy Emissions',
            fields: [
                {
                    id: 'scope2_electricity',
                    label: '外購電力排放 (tCO₂e)',
                    label_en: 'Purchased Electricity (tCO₂e)',
                    type: 'number',
                    required: true,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope2_electricity_kwh',
                    label: '外購電力總量 (kWh)',
                    label_en: 'Purchased Electricity (kWh)',
                    type: 'number',
                    required: true,
                    unit: 'kWh',
                },
                {
                    id: 'scope2_method',
                    label: '計算方法',
                    label_en: 'Calculation Method',
                    type: 'select',
                    options: ['以地點為基礎法 (Location-based)', '以市場為基礎法 (Market-based)'],
                    required: true,
                },
            ],
        },
        {
            id: 'section-scope3',
            title: '範疇三：其他間接排放',
            title_en: 'Scope 3: Other Indirect Emissions',
            fields: [
                {
                    id: 'scope3_upstream_transport',
                    label: '上游運輸與配送 (tCO₂e)',
                    label_en: 'Upstream Transportation (tCO₂e)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope3_business_travel',
                    label: '員工差旅 (tCO₂e)',
                    label_en: 'Business Travel (tCO₂e)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e',
                },
                {
                    id: 'scope3_total',
                    label: '範疇三合計 (tCO₂e)',
                    label_en: 'Scope 3 Total (tCO₂e)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e',
                },
            ],
        },
        {
            id: 'section-summary',
            title: '總排放量彙整',
            title_en: 'Emissions Summary',
            fields: [
                {
                    id: 'total_ghg_emissions',
                    label: '溫室氣體總排放量 (tCO₂e)',
                    label_en: 'Total GHG Emissions (tCO₂e)',
                    type: 'number',
                    required: true,
                    unit: 'tCO₂e',
                    computed: true,
                },
                {
                    id: 'carbon_intensity_revenue',
                    label: '碳排放強度 (tCO₂e/百萬元)',
                    label_en: 'Carbon Intensity (tCO₂e/M NTD)',
                    type: 'number',
                    required: false,
                    unit: 'tCO₂e/M NTD',
                },
                {
                    id: 'verification_body',
                    label: '第三方查證機構',
                    label_en: 'Verification Body',
                    type: 'text',
                    required: false,
                    placeholder: 'e.g., Bureau Veritas, SGS',
                },
                {
                    id: 'verification_statement',
                    label: '查證聲明書上傳',
                    label_en: 'Verification Statement Upload',
                    type: 'file',
                    required: false,
                    accept: '.pdf',
                },
            ],
        },
    ],
    // GRI/TCFD/SDG 對應
    framework_mapping: {
        gri: ['GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4'],
        tcfd: ['Metrics & Targets', 'Risk Management'],
        sdg: ['SDG 13 氣候行動', 'SDG 7 可負擔的潔淨能源'],
        sasb: ['IF-PP-110a.1'],
    },
} as const;

export type CarbonFootprintSchema = typeof CARBON_FOOTPRINT_SCHEMA;
