/**
 * Global Configuration Constants
 * 前後端共享的配置參數
 */
export const CONFIG = {
    VERSION: '8.1.0',
    API_ENDPOINT: '/api/trpc',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_MIME_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'text/plain',
        'text/markdown'
    ],
    T5_NETWORK: 'OmniChain-Mainnet',
    INTEGRITY_CHECK_INTERVAL: 1000 * 60 * 60 * 24, // 24 hours
    DEFAULT_PAGE_SIZE: 20,
};
export const UI_CONFIG = {
    ANIMATION_DURATION: 0.3,
    GLASS_BACKDROP_BLUR: '12px',
    CORE_CYAN: '#06b6d4',
    BERKELEY_BLUE: '#003262',
};
//# sourceMappingURL=config.js.map