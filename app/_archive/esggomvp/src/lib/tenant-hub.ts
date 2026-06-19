/**
 * 🌌 萬能租戶心核 (Tenant Hub)
 * 實現「無礙普惠」：確保數據在多租戶環境下安全隔離且無礙流轉。
 */

export interface ITenantConfig {
    id: string;
    name: string;
    branding?: {
        primaryColor: string;
        logoUrl?: string;
    };
    awakened: boolean;
}

export const getTenantIdFromEmail = (email: string): string => {
    // 預設邏輯：從 Email 域名提取租戶 ID，實現自動化租戶歸類
    const domain = email.split('@')[1];
    if (!domain) return 'default_void';
    return domain.replace(/\./g, '_').toLowerCase();
};

export const injectTenantScope = (data: any, tenantId: string) => {
    return {
        ...data,
        tenant_id: tenantId,
        impact_resonance: true // 標記為具備衝擊共鳴的租戶數據
    };
};
