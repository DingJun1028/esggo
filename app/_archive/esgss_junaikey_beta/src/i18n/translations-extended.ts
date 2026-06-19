/**
 * ESGss JunAiKey Beta - 擴展多語系翻譯檔案
 * Extended Internationalization (i18n) Translations
 * 
 * 支援語言：
 * - zh-TW: 繁體中文 (預設)
 * - en: English
 */

// 翻譯鍵值類型
export type TranslationKey = string;

// 翻譯資源類型
interface I18nResources {
    [lang: string]: {
        [key: string]: string | { [subKey: string]: string };
    };
}

// 擴展翻譯資源
export const translationsExtended: I18nResources = {
    // 繁體中文 (預設)
    'zh-TW': {
        // Anti-gravity Design
        'antigravity.title': '反重力設計',
        'antigravity.subtitle': '輕量化、浮動美學、流動性',
        'antigravity.floating': '浮動效果',
        'antigravity.glassmorphism': '玻璃態效果',
        'antigravity.animation': '動畫效果',
        'antigravity.lightweight': '輕量化',
        'antigravity.fluidity': '流動性',
        'antigravity.breathingSpace': '呼吸空間',

        // UUID Display
        'uuid.label': 'UUID',
        'uuid.copy': '複製 UUID',
        'uuid.copied': '已複製！',
        'uuid.copySuccess': 'UUID 已複製到剪貼板',
        'uuid.full': '完整',
        'uuid.short': '簡短',
        'uuid.compact': '緊湊',
        'uuid.title': 'UUID 顯示',
        'uuid.description': '顯示並複製 UUID',

        // Start-End Matrix
        'matrix.title': '開始-結束矩陣',
        'matrix.start': '起始點',
        'matrix.end': '終點',
        'matrix.process': '處理過程',
        'matrix.node': '節點',
        'matrix.transform': '轉換',
        'matrix.validate': '驗證',
        'matrix.completed': '已完成',
        'matrix.error': '錯誤',
        'matrix.skipped': '已跳過',
        'matrix.active': '進行中',
        'matrix.idle': '待處理',
        'matrix.description': '三元一體數據結構',

        // Two-Way Binding
        'binding.required': '此欄位為必填',
        'binding.invalid': '無效的輸入',
        'binding.email': '請輸入有效的電子郵件',
        'binding.number': '請輸入有效的數字',
        'binding.minLength': '至少需要 {min} 個字符',
        'binding.maxLength': '最多 {max} 個字符',
        'binding.minValue': '最小值為 {min}',
        'binding.maxValue': '最大值為 {max}',
        'binding.touched': '已觸摸',
        'binding.dirty': '已修改',
        'binding.validating': '驗證中...',

        // Layout
        'layout.fluid': '流動',
        'layout.contained': '包含',
        'layout.centered': '居中',
        'layout.fullWidth': '全寬',
        'layout.grid': '網格',
        'layout.flex': '彈性',
        'layout.section': '區塊',

        // Form
        'form.submit': '提交',
        'form.reset': '重置',
        'form.cancel': '取消',
        'form.saving': '儲存中...',
        'form.saved': '已儲存',
        'form.error': '發生錯誤',
        'form.success': '操作成功',
        'form.loading': '載入中...',

        // Validation
        'validation.required': '此欄位為必填',
        'validation.email': '請輸入有效的電子郵件地址',
        'validation.url': '請輸入有效的網址',
        'validation.phone': '請輸入有效的電話號碼',
        'validation.date': '請輸入有效的日期',
        'validation.time': '請輸入有效的時間',
        'validation.datetime': '請輸入有效的日期時間',
        'validation.min': '值不能小於 {min}',
        'validation.max': '值不能大於 {max}',
        'validation.pattern': '格式不正確',
    },

    // English
    'en': {
        // Anti-gravity Design
        'antigravity.title': 'Anti-gravity Design',
        'antigravity.subtitle': 'Lightweight, Floating Aesthetics, Fluidity',
        'antigravity.floating': 'Floating Effect',
        'antigravity.glassmorphism': 'Glassmorphism Effect',
        'antigravity.animation': 'Animation Effect',
        'antigravity.lightweight': 'Lightweight',
        'antigravity.fluidity': 'Fluidity',
        'antigravity.breathingSpace': 'Breathing Space',

        // UUID Display
        'uuid.label': 'UUID',
        'uuid.copy': 'Copy UUID',
        'uuid.copied': 'Copied!',
        'uuid.copySuccess': 'UUID copied to clipboard',
        'uuid.full': 'Full',
        'uuid.short': 'Short',
        'uuid.compact': 'Compact',
        'uuid.title': 'UUID Display',
        'uuid.description': 'Display and copy UUID',

        // Start-End Matrix
        'matrix.title': 'Start-End Matrix',
        'matrix.start': 'Start Point',
        'matrix.end': 'End Point',
        'matrix.process': 'Process',
        'matrix.node': 'Node',
        'matrix.transform': 'Transform',
        'matrix.validate': 'Validate',
        'matrix.completed': 'Completed',
        'matrix.error': 'Error',
        'matrix.skipped': 'Skipped',
        'matrix.active': 'Active',
        'matrix.idle': 'Idle',
        'matrix.description': 'Trinity Data Structure',

        // Two-Way Binding
        'binding.required': 'This field is required',
        'binding.invalid': 'Invalid input',
        'binding.email': 'Please enter a valid email',
        'binding.number': 'Please enter a valid number',
        'binding.minLength': 'Minimum {min} characters required',
        'binding.maxLength': 'Maximum {max} characters allowed',
        'binding.minValue': 'Minimum value is {min}',
        'binding.maxValue': 'Maximum value is {max}',
        'binding.touched': 'Touched',
        'binding.dirty': 'Modified',
        'binding.validating': 'Validating...',

        // Layout
        'layout.fluid': 'Fluid',
        'layout.contained': 'Contained',
        'layout.centered': 'Centered',
        'layout.fullWidth': 'Full Width',
        'layout.grid': 'Grid',
        'layout.flex': 'Flex',
        'layout.section': 'Section',

        // Form
        'form.submit': 'Submit',
        'form.reset': 'Reset',
        'form.cancel': 'Cancel',
        'form.saving': 'Saving...',
        'form.saved': 'Saved',
        'form.error': 'An error occurred',
        'form.success': 'Operation successful',
        'form.loading': 'Loading...',

        // Validation
        'validation.required': 'This field is required',
        'validation.email': 'Please enter a valid email address',
        'validation.url': 'Please enter a valid URL',
        'validation.phone': 'Please enter a valid phone number',
        'validation.date': 'Please enter a valid date',
        'validation.time': 'Please enter a valid time',
        'validation.datetime': 'Please enter a valid date and time',
        'validation.min': 'Value cannot be less than {min}',
        'validation.max': 'Value cannot be greater than {max}',
        'validation.pattern': 'Invalid format',
    },
};

// 翻譯獲取函數（擴展版）
export function tExtended(key: string, lang: string = 'zh-TW', params?: Record<string, string | number>): string {
    const langData = translationsExtended[lang] || translationsExtended['zh-TW'] || {};
    let value = langData[key];

    if (typeof value === 'string') {
        // 替換參數
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                value = value.replace(`{${paramKey}}`, String(paramValue));
            });
        }
        return value;
    }

    // 如果是物件，回傳第一個值
    if (typeof value === 'object' && value !== null) {
        return Object.values(value)[0] as string || key;
    }

    // 如果找不到，回傳翻譯鍵值
    return key;
}

// 匯出
export default translationsExtended;
