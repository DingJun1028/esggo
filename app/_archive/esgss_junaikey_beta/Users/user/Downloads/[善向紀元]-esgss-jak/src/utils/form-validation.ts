// ESG儀表板表單驗證服務
import { SecurityUtils, ESGSecurityValidator } from './security';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  sanitize?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface FormField {
  name: string;
  value: any;
  rules: ValidationRule;
}

export class FormValidator {
  private static readonly DEFAULT_MESSAGES = {
    'zh-TW': {
      required: '此欄位為必填',
      minLength: '長度至少需要{0}個字符',
      maxLength: '長度不能超過{0}個字符',
      pattern: '格式不符合要求',
      email: '請輸入有效的電子郵件地址',
      password: '密碼必須包含大寫字母、小寫字母和數字',
      phone: '請輸入有效的手機號碼',
      url: '請輸入有效的網址',
      xss: '輸入內容包含不安全的字符'
    },
    'en': {
      required: 'This field is required',
      minLength: 'Must be at least {0} characters long',
      maxLength: 'Must not exceed {0} characters',
      pattern: 'Format does not match requirements',
      email: 'Please enter a valid email address',
      password: 'Password must contain uppercase, lowercase, and numbers',
      phone: 'Please enter a valid phone number',
      url: 'Please enter a valid URL',
      xss: 'Input contains unsafe characters'
    }
  };

  static validateField(field: FormField, language: 'zh-TW' | 'en' = 'zh-TW'): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = field.value;

    // XSS清理
    if (field.rules.sanitize && typeof field.value === 'string') {
      sanitizedValue = SecurityUtils.sanitizeHtml(field.value);
      if (sanitizedValue !== field.value) {
        errors.push(this.getMessage('xss', language));
      }
    }

    // 必填驗證
    if (field.rules.required && (!sanitizedValue || sanitizedValue.toString().trim() === '')) {
      errors.push(this.getMessage('required', language));
    }

    // 如果是必填且為空，跳過其他驗證
    if (field.rules.required && (!sanitizedValue || sanitizedValue.toString().trim() === '')) {
      return { isValid: false, errors, sanitizedValue };
    }

    // 長度驗證
    if (field.rules.minLength && sanitizedValue && sanitizedValue.toString().length < field.rules.minLength) {
      errors.push(this.getMessage('minLength', language, [field.rules.minLength.toString()]));
    }

    if (field.rules.maxLength && sanitizedValue && sanitizedValue.toString().length > field.rules.maxLength) {
      errors.push(this.getMessage('maxLength', language, [field.rules.maxLength.toString()]));
    }

    // 模式驗證
    if (field.rules.pattern && sanitizedValue && !field.rules.pattern.test(sanitizedValue.toString())) {
      errors.push(this.getMessage('pattern', language));
    }

    // 自訂驗證
    if (field.rules.custom && sanitizedValue) {
      const customError = field.rules.custom(sanitizedValue);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  static validateForm(fields: FormField[], language: 'zh-TW' | 'en' = 'zh-TW'): {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  } {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let isFormValid = true;

    fields.forEach(field => {
      const result = this.validateField(field, language);
      if (!result.isValid) {
        errors[field.name] = result.errors;
        isFormValid = false;
      }
      sanitizedData[field.name] = result.sanitizedValue;
    });

    return {
      isValid: isFormValid,
      errors,
      sanitizedData
    };
  }

  // 預定義驗證規則
  static readonly RULES = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      sanitize: true
    } as ValidationRule,

    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      sanitize: false
    } as ValidationRule,

    phone: {
      required: true,
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      sanitize: true
    } as ValidationRule,

    url: {
      required: true,
      pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      sanitize: true
    } as ValidationRule,

    requiredText: {
      required: true,
      minLength: 1,
      maxLength: 1000,
      sanitize: true
    } as ValidationRule,

    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      sanitize: true
    } as ValidationRule,

    company: {
      required: false,
      minLength: 2,
      maxLength: 100,
      sanitize: true
    } as ValidationRule
  };

  // 即時驗證hook
  static useFieldValidation(fieldName: string, rules: ValidationRule, language: 'zh-TW' | 'en' = 'zh-TW') {
    return (value: any): ValidationResult => {
      return this.validateField({
        name: fieldName,
        value,
        rules
      }, language);
    };
  }

  // ESG特定驗證
  static validateESGData(data: Record<string, any>, language: 'zh-TW' | 'en' = 'zh-TW'): ValidationResult {
    const errors: string[] = [];

    // 檢查敏感ESG數據
    if (data.financial_data && !SecurityUtils.validateInputLength(data.financial_data, 0, 10000)) {
      errors.push(language === 'zh-TW' ? '財務數據過長' : 'Financial data too long');
    }

    if (data.carbon_emission_factors) {
      // 驗證碳排放因子格式
      const factors = Array.isArray(data.carbon_emission_factors) ? data.carbon_emission_factors : [data.carbon_emission_factors];
      factors.forEach((factor: any, index: number) => {
        if (typeof factor !== 'number' || factor < 0) {
          errors.push(language === 'zh-TW' ? `碳排放因子${index + 1}必須是正數` : `Carbon emission factor ${index + 1} must be a positive number`);
        }
      });
    }

    // 使用現有的ESG安全驗證器
    const securityValidation = ESGSecurityValidator.validateESGData(data);
    if (!securityValidation.isValid) {
      errors.push(...securityValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: data
    };
  }

  private static getMessage(key: keyof typeof FormValidator.DEFAULT_MESSAGES.zh, language: 'zh-TW' | 'en', params: string[] = []): string {
    let message = this.DEFAULT_MESSAGES[language][key] || key;

    // 替換參數佔位符
    params.forEach((param, index) => {
      message = message.replace(`{${index}}`, param);
    });

    return message;
  }
}

// React Hook for 表單驗證
export const useFormValidation = (language: 'zh-TW' | 'en' = 'zh-TW') => {
  const validateField = (field: FormField) => {
    return FormValidator.validateField(field, language);
  };

  const validateForm = (fields: FormField[]) => {
    return FormValidator.validateForm(fields, language);
  };

  const validateESGData = (data: Record<string, any>) => {
    return FormValidator.validateESGData(data, language);
  };

  return {
    validateField,
    validateForm,
    validateESGData,
    RULES: FormValidator.RULES
  };
};