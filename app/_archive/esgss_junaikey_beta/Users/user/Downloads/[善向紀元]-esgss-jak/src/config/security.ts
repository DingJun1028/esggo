// ESG儀表板安全配置
export const securityConfig = {
    // 速率限制配置
    rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15分鐘
        maxRequests: 100, // 每個IP最多100個請求
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
    },

    // CORS配置
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://esg-dashboard.com', 'https://app.esg-dashboard.com']
            : ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400, // 24小時
    },

    // Helmet安全標頭配置
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
                connectSrc: ["'self'", 'https://api.openai.com', 'https://*.firebaseio.com'],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    },

    // JWT配置
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expiresIn: '24h',
        refreshTokenExpiresIn: '7d',
    },

    // 密碼策略
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90天
    },

    // 檔案上傳配置
    fileUpload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/csv', 'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.csv', '.xls', '.xlsx'],
    },

    // API安全配置
    apiSecurity: {
        requestTimeout: 30000, // 30秒
        maxBodySize: '10mb',
        trustProxy: true,
        disablePoweredBy: true,
    },

    // 日誌配置
    logging: {
        enableSecurityLogs: true,
        logFailedAttempts: true,
        logSuspiciousActivity: true,
        retentionDays: 90,
    },

    // 敏感數據配置
    sensitiveData: {
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-prod',
        maskPatterns: [
            /password/i,
            /secret/i,
            /token/i,
            /key/i,
            /ssn/i,
            /social.?security/i,
        ],
    },

    // ESG特定安全配置
    esgSecurity: {
        // 敏感ESG數據欄位
        sensitiveFields: [
            'financial_data',
            'personnel_info',
            'supply_chain_details',
            'carbon_emission_factors',
            'trade_secrets'
        ],

        // 報告存取權限
        reportPermissions: {
            public: ['summary', 'highlights'],
            authenticated: ['detailed', 'comparative'],
            admin: ['raw_data', 'internal_analysis'],
        },

        // 數據保留政策
        dataRetention: {
            userData: 7 * 365 * 24 * 60 * 60 * 1000, // 7年
            auditLogs: 7 * 365 * 24 * 60 * 60 * 1000, // 7年
            tempFiles: 30 * 24 * 60 * 60 * 1000, // 30天
        },

        // 合規檢查
        complianceChecks: {
            enableGDPRCompliance: true,
            enableSOXCompliance: true,
            enableDataEncryption: true,
            enableAccessLogging: true,
        },
    },
};

// 環境檢查函數
export function validateEnvironmentSecurity(): { isSecure: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let isSecure = true;

    // 檢查是否在生產環境使用默認密鑰
    if (process.env.NODE_ENV === 'production') {
        if (securityConfig.jwt.secret === 'fallback-secret-change-in-production') {
            warnings.push('使用默認JWT密鑰，這是不安全的');
            isSecure = false;
        }

        if (securityConfig.sensitiveData.encryptionKey === 'default-encryption-key-change-in-prod') {
            warnings.push('使用默認加密密鑰，這是不安全的');
            isSecure = false;
        }

        // 檢查HTTPS
        if (!window.location.protocol.startsWith('https')) {
            warnings.push('生產環境應使用HTTPS');
            isSecure = false;
        }
    }

    // 檢查必要的環境變數
    const requiredEnvVars = ['JWT_SECRET', 'ENCRYPTION_KEY'];
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            warnings.push(`缺少必要的環境變數: ${envVar}`);
            isSecure = false;
        }
    });

    return { isSecure, warnings };
}

// 動態安全配置加載器
export function loadSecurityConfig(): typeof securityConfig {
    // 在生產環境，從安全來源加載配置
    if (process.env.NODE_ENV === 'production') {
        // 這裡可以從安全的配置服務加載
        console.log('加載生產環境安全配置');
    }

    return securityConfig;
}

// 安全事件記錄器
export class SecurityLogger {
    static logSecurityEvent(event: {
        type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'suspicious_activity' | 'data_access';
        userId?: string;
        ip?: string;
        userAgent?: string;
        details?: any;
        severity: 'low' | 'medium' | 'high' | 'critical';
    }): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...event,
            environment: process.env.NODE_ENV,
        };

        // 在生產環境，這裡會發送到安全日誌服務
        console.log('[SECURITY]', JSON.stringify(logEntry, null, 2));

        // 如果是高嚴重性事件，觸發警報
        if (event.severity === 'high' || event.severity === 'critical') {
            this.triggerSecurityAlert(logEntry);
        }
    }

    static triggerSecurityAlert(event: any): void {
        // 在生產環境，這裡會觸發安全警報
        console.error('[SECURITY ALERT]', event);

        // 可以集成到監控服務如DataDog, New Relic等
        // 發送郵件通知安全團隊等
    }
}