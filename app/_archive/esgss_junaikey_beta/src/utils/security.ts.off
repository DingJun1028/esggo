// ESG儀表板安全工具
export class SecurityUtils {
    // XSS防護 - 清理HTML輸入
    static sanitizeHtml(input: string): string {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = input;
        return tempDiv.innerHTML;
    }

    // SQL注入防護 - 基本檢查（前端防護，後端仍需處理）
    static sanitizeSqlInput(input: string): string {
        // 移除危險的SQL關鍵字
        const dangerousPatterns = [
            /(\b(union|select|insert|delete|update|drop|create|alter)\b)/gi,
            /(-{2}|\/\*|\*\/)/g,  // 註釋符號
            /('|(\\x27)|(\\x2D))/g  // 引號和破折號
        ];

        let sanitized = input;
        dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        return sanitized.trim();
    }

    // 輸入驗證 - Email格式
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    // 輸入驗證 - 電話號碼
    static validatePhone(phone: string): boolean {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // 輸入驗證 - 用戶名稱
    static validateUsername(username: string): boolean {
        // 允許字母、數字、底線，長度3-30
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    }

    // 輸入驗證 - 密碼強度
    static validatePasswordStrength(password: string): {
        isValid: boolean;
        score: number;
        feedback: string[];
    } {
        const feedback: string[] = [];
        let score = 0;

        if (password.length < 8) {
            feedback.push('密碼長度至少8個字符');
        } else {
            score += 1;
        }

        if (!/[a-z]/.test(password)) {
            feedback.push('至少包含一個小寫字母');
        } else {
            score += 1;
        }

        if (!/[A-Z]/.test(password)) {
            feedback.push('至少包含一個大寫字母');
        } else {
            score += 1;
        }

        if (!/\d/.test(password)) {
            feedback.push('至少包含一個數字');
        } else {
            score += 1;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            feedback.push('至少包含一個特殊字符');
        } else {
            score += 1;
        }

        return {
            isValid: score >= 4 && password.length >= 8,
            score,
            feedback
        };
    }

    // 檔案上傳驗證
    static validateFileUpload(file: File, allowedTypes: string[], maxSize: number = 10 * 1024 * 1024): {
        isValid: boolean;
        error?: string;
    } {
        // 檢查檔案類型
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: `不支援的檔案類型。允許的類型：${allowedTypes.join(', ')}`
            };
        }

        // 檢查檔案大小
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `檔案過大。最大允許大小：${Math.round(maxSize / 1024 / 1024)}MB`
            };
        }

        // 檢查檔案名稱安全性
        const fileName = file.name;
        if (/[<>:"\/\\|?*\x00-\x1f]/.test(fileName)) {
            return {
                isValid: false,
                error: '檔案名稱包含不安全的字符'
            };
        }

        return { isValid: true };
    }

    // 防止暴力破解 - 速率限制
    static createRateLimiter(windowMs: number = 15 * 60 * 1000, max: number = 100) {
        const requests = new Map<string, { count: number; resetTime: number }>();

        return (identifier: string): boolean => {
            const now = Date.now();
            const record = requests.get(identifier);

            if (!record || now > record.resetTime) {
                requests.set(identifier, {
                    count: 1,
                    resetTime: now + windowMs
                });
                return true;
            }

            if (record.count >= max) {
                return false; // 超過限制
            }

            record.count++;
            return true;
        };
    }

    // CSRF保護 - 生成token
    static generateCSRFToken(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 內容安全策略檢查
    static validateCSPHeaders(headers: Record<string, string>): boolean {
        const requiredHeaders = [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
            'Referrer-Policy'
        ];

        return requiredHeaders.every(header =>
            headers[header] && headers[header].trim() !== ''
        );
    }

    // 敏感資料遮罩
    static maskSensitiveData(data: string, visibleChars: number = 4): string {
        if (data.length <= visibleChars) return data;

        const visible = data.slice(-visibleChars);
        const masked = '*'.repeat(data.length - visibleChars);

        return masked + visible;
    }

    // 加密儲存（簡單實現，真實環境應使用更強的加密）
    static async encryptData(data: string, key: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            derivedKey,
            dataBuffer
        );

        // 合併salt、iv和加密數據
        const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        result.set(salt, 0);
        result.set(iv, salt.length);
        result.set(new Uint8Array(encrypted), salt.length + iv.length);

        return btoa(String.fromCharCode(...result));
    }

    // 解密資料
    static async decryptData(encryptedData: string, key: string): Promise<string> {
        try {
            const encrypted = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

            const salt = encrypted.slice(0, 16);
            const iv = encrypted.slice(16, 28);
            const data = encrypted.slice(28);

            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(key),
                'PBKDF2',
                false,
                ['deriveKey']
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                derivedKey,
                data
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            throw new Error('解密失敗：資料可能已損壞或密鑰錯誤');
        }
    }

    // 安全隨機字串生成
    static generateSecureToken(length: number = 32): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 輸入長度驗證
    static validateInputLength(input: string, minLength: number = 1, maxLength: number = 1000): boolean {
        const length = input.trim().length;
        return length >= minLength && length <= maxLength;
    }

    // URL驗證
    static validateUrl(url: string): boolean {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    // 防止目錄遍歷攻擊
    static sanitizeFilePath(path: string): string {
        // 移除危險的路徑符號
        return path.replace(/(\.\.[\/\\])|([\/\\]\.\.)|(\.\.$)/g, '');
    }
}

// ESG特定安全檢查
export class ESGSecurityValidator {
    // 驗證ESG數據輸入
    static validateESGData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // 碳排放數據驗證
        if (data.carbonEmission !== undefined) {
            if (typeof data.carbonEmission !== 'number' || data.carbonEmission < 0) {
                errors.push('碳排放數據必須是正數');
            }
            if (data.carbonEmission > 1000000) { // 合理上限檢查
                errors.push('碳排放數據過大，可能有誤');
            }
        }

        // 百分比數據驗證
        ['renewableEnergyRatio', 'diversityIndex', 'complianceRate'].forEach(field => {
            if (data[field] !== undefined) {
                if (typeof data[field] !== 'number' || data[field] < 0 || data[field] > 100) {
                    errors.push(`${field}必須是0-100之間的百分比`);
                }
            }
        });

        // 日期驗證
        if (data.reportDate) {
            const date = new Date(data.reportDate);
            if (isNaN(date.getTime())) {
                errors.push('報告日期格式無效');
            }
            // 不允許未來日期
            if (date > new Date()) {
                errors.push('報告日期不能是未來日期');
            }
        }

        // 公司名稱驗證
        if (data.companyName) {
            if (!SecurityUtils.validateInputLength(data.companyName, 2, 100)) {
                errors.push('公司名稱長度必須在2-100字符之間');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // 驗證ESG報告權限
    static validateESGReportAccess(userRole: string, reportType: string, companyId: string): boolean {
        const rolePermissions: Record<string, string[]> = {
            'admin': ['*'],
            'sustainability_manager': ['carbon', 'social', 'governance', 'integrated'],
            'auditor': ['carbon', 'compliance'],
            'investor': ['public_reports', 'integrated'],
            'supplier': ['supplier_reports']
        };

        const userPermissions = rolePermissions[userRole] || [];

        if (userPermissions.includes('*')) return true;

        return userPermissions.includes(reportType);
    }

    // 敏感ESG數據加密
    static encryptSensitiveESGData(data: any): any {
        const encryptedData = { ...data };

        // 加密敏感欄位
        const sensitiveFields = ['financialData', 'personnelInfo', 'tradeSecrets'];

        sensitiveFields.forEach(field => {
            if (encryptedData[field]) {
                // 在實際實現中，這裡會使用真正的加密
                encryptedData[field] = `[ENCRYPTED]${btoa(JSON.stringify(encryptedData[field]))}`;
            }
        });

        return encryptedData;
    }

    // 驗證ESG API請求
    static validateESGApiRequest(request: any): { isValid: boolean; error?: string } {
        // 檢查必要的認證標頭
        if (!request.headers?.authorization) {
            return { isValid: false, error: '缺少認證標頭' };
        }

        // 檢查請求大小限制
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (request.body && JSON.stringify(request.body).length > maxSize) {
            return { isValid: false, error: '請求數據過大' };
        }

        // 檢查ESG數據格式
        if (request.body?.esgData) {
            const validation = this.validateESGData(request.body.esgData);
            if (!validation.isValid) {
                return { isValid: false, error: validation.errors.join(', ') };
            }
        }

        return { isValid: true };
    }
}