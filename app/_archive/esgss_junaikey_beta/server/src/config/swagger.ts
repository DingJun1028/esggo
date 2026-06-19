/**
 * swagger.ts
 * OpenAPI 3.0 配置 - ESGss JunAiKey API 文檔
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ESGss JunAiKey API',
            version: '8.2.5',
            description: `
### 🏛️ InfoOne 永續知識服務平台 API

**核心理念**: 服務即教學，知識即資產

#### 5T 協議 (5T Protocol)
- **Tangible** 🟢 可感知
- **Traceable** 🟢 可溯源
- **Trackable** 🟢 可追蹤
- **Transparent** 🟢 可驗算
- **Trustworthy** 🔴 不可篡改

#### 主要模組
- 🎮 **Game System**: 善向紀元卡牌對戰
- 📊 **ESG Intelligence**: 永續情報分析
- 🔐 **Auth**: 認證與授權
- 📈 **Analytics**: 數據分析
      `,
            contact: {
                name: 'ESGss Development Team',
                email: 'dev@esgss.example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development Server',
            },
            {
                url: 'https://api.esgss.com',
                description: 'Production Server',
            },
        ],
        tags: [
            { name: 'Health', description: '系統健康檢查端點' },
            { name: 'Auth', description: '認證與授權' },
            { name: 'ESG', description: 'ESG 永續情報' },
            { name: 'Game', description: '善向紀元遊戲系統' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: '使用 JWT Token 進行認證',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'ESG-API-301' },
                                message: { type: 'string', example: 'Bad request' },
                                messageTC: { type: 'string', example: '請求格式錯誤' },
                            },
                        },
                    },
                },
                HealthStatus: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'ok' },
                        uptime: { type: 'number', example: 3600 },
                    },
                },
                ReadinessStatus: {
                    type: 'object',
                    properties: {
                        ready: { type: 'boolean', example: true },
                        checks: {
                            type: 'object',
                            properties: {
                                database: { type: 'object' },
                                redis: { type: 'object' },
                            },
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/api/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
