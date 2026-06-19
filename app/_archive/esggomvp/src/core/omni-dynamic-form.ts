/**
 * 📝 Dynamic Form Engine
 * 動態表單生成引擎 (Schema-Driven)
 * 
 * 職責：
 * - 根據 JSON Schema 動態生成表單
 * - 支援複雜驗證規則
 * - 與 Jules Validator 深度整合
 * - 支持 5T 數據追蹤
 */

import { z } from 'zod';
import { JulesValidator } from './jules-validator';
import { v4 as uuidv4 } from 'uuid';

export type FieldType = 
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multiselect'
    | 'date'
    | 'datetime'
    | 'file'
    | 'checkbox'
    | 'radio'
    | 'range'
    | 'currency'
    | 'percentage';

export interface IFieldOption {
    label: string;
    value: string | number;
}

export interface IFieldValidation {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: string; // 自定義驗證函數名
}

export interface IFormField {
    id: string;
    name: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    description?: string;
    options?: IFieldOption[];
    validation?: IFieldValidation;
    defaultValue?: any;
    dependsOn?: {
        field: string;
        value: any;
    };
    t5Tracking?: boolean; // 是否啟用 5T 追蹤
    metadata?: Record<string, any>;
}

export interface IFormSection {
    id: string;
    title: string;
    description?: string;
    fields: IFormField[];
    collapsible?: boolean;
    order?: number;
}

export interface IFormSchema {
    id: string;
    name: string;
    version: string;
    description?: string;
    sections: IFormSection[];
    submitLabel?: string;
    cancelLabel?: string;
    validationSchema?: string; // Zod schema 名稱
    onSubmit?: string; // 提交處理函數名
    domain?: string; // ESG 領域
}

export interface IFormSubmission {
    id: string;
    formId: string;
    data: Record<string, any>;
    submittedAt: number;
    submittedBy?: string;
    t5Trace?: {
        uuid: string;
        hash: string;
    };
}

/**
 * Dynamic Form Engine 主類別
 */
export class DynamicFormEngine {
    private static instance: DynamicFormEngine;
    private schemas: Map<string, IFormSchema> = new Map();
    private submissions: Map<string, IFormSubmission[]> = new Map();
    private validator: JulesValidator;

    private constructor() {
        this.validator = JulesValidator.getInstance();
    }

    static getInstance(): DynamicFormEngine {
        if (!DynamicFormEngine.instance) {
            DynamicFormEngine.instance = new DynamicFormEngine();
        }
        return DynamicFormEngine.instance;
    }

    /**
     * 註冊表單 Schema
     */
    registerSchema(schema: IFormSchema): void {
        this.schemas.set(schema.id, schema);
    }

    /**
     * 獲取表單 Schema
     */
    getSchema(id: string): IFormSchema | undefined {
        return this.schemas.get(id);
    }

    /**
     * 獲取所有 Schema
     */
    getAllSchemas(): IFormSchema[] {
        return Array.from(this.schemas.values());
    }

    /**
     * 根據領域獲取 Schema
     */
    getSchemasByDomain(domain: string): IFormSchema[] {
        return Array.from(this.schemas.values()).filter(s => s.domain === domain);
    }

    /**
     * 驗證表單數據
     */
    validateForm(schemaId: string, data: Record<string, any>): {
        valid: boolean;
        errors: Array<{ field: string; message: string }>;
    } {
        const schema = this.schemas.get(schemaId);
        if (!schema) {
            return { valid: false, errors: [{ field: '', message: 'Schema not found' }] };
        }

        const errors: Array<{ field: string; message: string }> = [];

        // 驗證每個區段中的每個欄位
        schema.sections.forEach(section => {
            section.fields.forEach(field => {
                // 檢查依賴欄位
                if (field.dependsOn) {
                    const depValue = data[field.dependsOn.field];
                    if (depValue !== field.dependsOn.value) {
                        return; // 跳過非活躍欄位
                    }
                }

                const value = data[field.name];

                // 必填驗證
                if (field.validation?.required && (value === undefined || value === null || value === '')) {
                    errors.push({ field: field.name, message: `${field.label} 是必填項目` });
                    return;
                }

                if (value === undefined || value === null || value === '') {
                    return; // 跳過可選欄位的其他驗證
                }

                // 類型驗證
                switch (field.type) {
                    case 'number':
                    case 'currency':
                    case 'percentage':
                    case 'range':
                        if (typeof value !== 'number') {
                            errors.push({ field: field.name, message: `${field.label} 必須是數字` });
                            return;
                        }
                        if (field.validation.min !== undefined && value < field.validation.min) {
                            errors.push({ field: field.name, message: `${field.label} 最小值為 ${field.validation.min}` });
                        }
                        if (field.validation.max !== undefined && value > field.validation.max) {
                            errors.push({ field: field.name, message: `${field.label} 最大值為 ${field.validation.max}` });
                        }
                        break;

                    case 'text':
                    case 'textarea':
                        if (typeof value !== 'string') {
                            errors.push({ field: field.name, message: `${field.label} 必須是文字` });
                            return;
                        }
                        if (field.validation.minLength !== undefined && value.length < field.validation.minLength) {
                            errors.push({ field: field.name, message: `${field.label} 至少需要 ${field.validation.minLength} 個字元` });
                        }
                        if (field.validation.maxLength !== undefined && value.length > field.validation.maxLength) {
                            errors.push({ field: field.name, message: `${field.label} 最多 ${field.validation.maxLength} 個字元` });
                        }
                        if (field.validation.pattern) {
                            const regex = new RegExp(field.validation.pattern);
                            if (!regex.test(value)) {
                                errors.push({ field: field.name, message: `${field.label} 格式不正確` });
                            }
                        }
                        break;

                    case 'select':
                        if (field.options && !field.options.some(o => o.value === value)) {
                            errors.push({ field: field.name, message: `請選擇有效的${field.label}` });
                        }
                        break;
                }
            });
        });

        return { valid: errors.length === 0, errors };
    }

    /**
     * 提交表單
     */
    submitForm(schemaId: string, data: Record<string, any>, submittedBy?: string): IFormSubmission {
        const submission: IFormSubmission = {
            id: uuidv4(),
            formId: schemaId,
            data,
            submittedAt: Date.now(),
            submittedBy
        };

        // 如果啟用 5T 追蹤，生成 UUID 和 hash
        const schema = this.schemas.get(schemaId);
        if (schema) {
            const hasT5Tracking = schema.sections.some(s => 
                s.fields.some(f => f.t5Tracking)
            );
            if (hasT5Tracking) {
                submission.t5Trace = {
                    uuid: `atom-${schemaId}-${Date.now()}`,
                    hash: this.generateHash(data)
                };
            }
        }

        const formSubmissions = this.submissions.get(schemaId) || [];
        formSubmissions.push(submission);
        this.submissions.set(schemaId, formSubmissions);

        return submission;
    }

    /**
     * 生成簡單 hash
     */
    private generateHash(data: Record<string, any>): string {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * 獲取表單提交記錄
     */
    getSubmissions(schemaId: string): IFormSubmission[] {
        return this.submissions.get(schemaId) || [];
    }

    /**
     * 創建碳排放錶單 Schema
     */
    createCarbonEmissionForm(): IFormSchema {
        return {
            id: 'carbon-emission-form-v1',
            name: '碳排放報告表單',
            version: '1.0.0',
            description: '收集範疇一、二、三碳排放數據',
            domain: 'carbon',
            sections: [
                {
                    id: 'section-basic',
                    title: '基本資訊',
                    fields: [
                        {
                            id: 'org-name',
                            name: 'organizationName',
                            type: 'text',
                            label: '組織名稱',
                            validation: { required: true, minLength: 2, maxLength: 100 },
                            t5Tracking: true
                        },
                        {
                            id: 'reporting-year',
                            name: 'reportingYear',
                            type: 'select',
                            label: '報告年度',
                            options: [
                                { label: '2024', value: 2024 },
                                { label: '2023', value: 2023 },
                                { label: '2022', value: 2022 }
                            ],
                            validation: { required: true },
                            t5Tracking: true
                        }
                    ]
                },
                {
                    id: 'section-scope1',
                    title: '範疇一：直接排放',
                    description: '來自組織擁有或控制的排放源',
                    fields: [
                        {
                            id: 'scope1-stationary',
                            name: 'scope1.stationary',
                            type: 'number',
                            label: '固定燃燒排放 (tCO2e)',
                            description: '鍋爐、熔爐等固定設備',
                            validation: { required: true, min: 0 },
                            t5Tracking: true
                        },
                        {
                            id: 'scope1-mobile',
                            name: 'scope1.mobile',
                            type: 'number',
                            label: '移動燃燒排放 (tCO2e)',
                            description: '公司車輛等移動源',
                            validation: { required: true, min: 0 },
                            t5Tracking: true
                        },
                        {
                            id: 'scope1-fugitive',
                            name: 'scope1.fugitive',
                            type: 'number',
                            label: '逸散排放 (tCO2e)',
                            description: '冷媒、潤滑劑等逸散',
                            validation: { min: 0 },
                            t5Tracking: true
                        }
                    ]
                },
                {
                    id: 'section-scope2',
                    title: '範疇二：間接排放',
                    description: '來自外購電力、熱力或蒸汽',
                    fields: [
                        {
                            id: 'scope2-location',
                            name: 'scope2.location',
                            type: 'number',
                            label: '地點基準 (tCO2e)',
                            validation: { required: true, min: 0 },
                            t5Tracking: true
                        },
                        {
                            id: 'scope2-market',
                            name: 'scope2.market',
                            type: 'number',
                            label: '市場基準 (tCO2e)',
                            validation: { min: 0 },
                            t5Tracking: true
                        }
                    ]
                }
            ],
            submitLabel: '提交報告'
        };
    }

    /**
     * 創建 GRI 報告錶單 Schema
     */
    static createGRIReportForm(): IFormSchema {
        return {
            id: 'gri-report-form-v1',
            name: 'GRI 報告表單',
            version: '1.0.0',
            description: '依據 GRI 標準編寫永續報告',
            domain: 'governance',
            sections: [
                {
                    id: 'section-disclosure',
                    title: 'GRI 披露項目',
                    fields: [
                        {
                            id: 'gri-standard',
                            name: 'griStandard',
                            type: 'select',
                            label: 'GRI 標準',
                            options: [
                                { label: 'GRI 201 經濟績效', value: 'GRI 201' },
                                { label: 'GRI 205 反腐敗', value: 'GRI 205' },
                                { label: 'GRI 302 能源', value: 'GRI 302' },
                                { label: 'GRI 305 排放', value: 'GRI 305' },
                                { label: 'GRI 401 僱傭', value: 'GRI 401' },
                                { label: 'GRI 405 多元與平等', value: 'GRI 405' }
                            ],
                            validation: { required: true },
                            t5Tracking: true
                        },
                        {
                            id: 'disclosure-number',
                            name: 'disclosureNumber',
                            type: 'text',
                            label: '披露編號',
                            placeholder: '例如: 201-1',
                            validation: { required: true, pattern: '^[0-9]{3}-[0-9]$' },
                            t5Tracking: true
                        },
                        {
                            id: 'disclosure-value',
                            name: 'disclosureValue',
                            type: 'textarea',
                            label: '披露內容',
                            validation: { required: true, minLength: 50 },
                            t5Tracking: true
                        }
                    ]
                }
            ],
            submitLabel: '提交 GRI 報告'
        };
    }
}

export default DynamicFormEngine;
