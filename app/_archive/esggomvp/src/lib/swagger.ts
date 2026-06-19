import swaggerJSDoc from 'swagger-jsdoc';

/**
 * 📚 Swagger/OpenAPI 文件配置
 * 版本: v8.2.5 · 遵循 5T 協議
 */
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ESG GO API — OmniNexus Gateway',
            version: '8.2.5',
            description: `
## 上善若水 · 道法自然

ESG GO 平台 API 文件。所有端點皆符合 **5T 協議**：
- 🟢 **Traceable** (可溯源) — 每個請求包含 \`uuid\` 與 \`source_origin\`
- 🟢 **Trackable** (可追蹤) — 生命週期 Hook 完整記錄
- 🟢 **Transparent** (可驗算) — 公開算法公式
- 🟢 **Tangible** (可感知) — 具象化影響力指標
- 🔴 **Trustworthy** (不可篡改) — SHA-256 Hash Lock 封印

**服務即教學，知識即資產。**
            `,
            contact: {
                name: 'ESG GO 技術團隊',
                email: 'dev@esggo.local',
            },
            license: {
                name: '永續知識授權 (Sustainable Knowledge License)',
                url: 'https://esgss.io/license',
            },
        },
        servers: [
            { url: '/api', description: 'Production OmniNexus Gateway' },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'ESG GO Session Token (better-auth)',
                },
            },
            schemas: {
                FiveTPayload: {
                    type: 'object',
                    description: '5T 協議標準資料結構',
                    properties: {
                        uuid: { type: 'string', format: 'uuid', description: '[可溯源] 唯一識別碼' },
                        timestamp: { type: 'number', description: '[可追蹤] Unix 毫秒戳' },
                        source_origin: { type: 'string', description: '[可溯源] 資料來源識別' },
                        hash_lock: { type: 'string', description: '[不可篡改] SHA-256 封印' },
                        status: { type: 'string', enum: ['Trustworthy', 'draft', 'published'] },
                    },
                },
                NexusResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object' },
                        error: { type: 'string' },
                        metadata: {
                            type: 'object',
                            properties: {
                                timestamp: { type: 'number' },
                                trustScore: { type: 'number', minimum: 0, maximum: 100 },
                                uuid: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        security: [{ BearerAuth: [] }],
        tags: [
            { name: 'Nexus', description: 'OmniNexus 核心代理端點' },
            { name: 'RAG', description: '5T-Compliant RAG 知識檢索' },
            { name: 'Reports', description: '報告鍛造與管理' },
            { name: 'Auth', description: '認證與授權' },
            { name: 'Carbon', description: '碳排放管理 (Scope 1-3)' },
        ],
    },
    apis: [
        './src/app/api/**/*.ts',
        './src/app/api/**/*.tsx',
    ],
};

export const swaggerSpec = swaggerJSDoc(options);
