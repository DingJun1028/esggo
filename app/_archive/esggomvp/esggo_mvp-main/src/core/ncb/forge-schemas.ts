import { FormSchema } from "@/components/omni/report-forge/DynamicFormEngine";

/**
 * 🛠️ Forge Module Schemas
 * 包含所有支援的永續數據模組定義。
 */

export const FORGE_SCHEMAS: Record<string, FormSchema> = {
    carbon: {
        fields: [
            { id: 'reporterName', label: '申報人姓名', type: 'text', required: true, placeholder: '請輸入姓名...' },
            {
                id: 'facilityType', label: '設施類型', type: 'select', required: true, options: [
                    { label: '辦公大樓', value: 'office' },
                    { label: '工廠生產線', value: 'factory' },
                    { label: '倉儲中心', value: 'warehouse' }
                ]
            },
            { id: 'emissionValue', label: '預估碳排放量 (tCO2e)', type: 'number', required: true },
            { id: 'recordDate', label: '數據基準日', type: 'date', required: true },
            { id: 'methodology', label: '計算方法學描述', type: 'textarea', placeholder: '請描述計算邏輯與依據...' }
        ]
    },
    energy: {
        fields: [
            {
                id: 'energyType', label: '能源類型', type: 'select', required: true, options: [
                    { label: '台電市電', value: 'grid' },
                    { label: '太陽能自發自用', value: 'solar' },
                    { label: '風能', value: 'wind' }
                ]
            },
            { id: 'consumption', label: '消耗量 (kWh)', type: 'number', required: true },
            { id: 'billingPeriod', label: '帳單週期', type: 'text', placeholder: '例如: 2024-Q1' },
            { id: 'proof', label: '證照/帳單編號', type: 'text', required: true }
        ]
    },
    supply: {
        fields: [
            { id: 'supplierName', label: '供應商名稱', type: 'text', required: true },
            {
                id: 'tier', label: '供應層級', type: 'select', options: [
                    { label: 'Tier 1', value: '1' },
                    { label: 'Tier 2', value: '2' },
                    { label: 'Tier 3+', value: '3' }
                ]
            },
            { id: 'complianceScore', label: '合規評分 (0-100)', type: 'number' },
            { id: 'auditDate', label: '最後稽核日期', type: 'date' }
        ]
    }
};
