export interface BrandComponent {
    id?: string;
    company_id?: string;
    name: string;
    category: string;
    variant?: string;
    props?: Record<string, unknown>;
    description?: string;
    usage_example?: string;
    tags?: string[];
    is_favorite?: boolean;
    version?: string;
    hash_lock?: string;
    created_at?: string;
    updated_at?: string;
}
export interface BrandToken {
    id?: string;
    company_id?: string;
    token_key: string;
    token_value: string;
    category: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
export interface ComponentUsageLog {
    id?: string;
    component_id?: string;
    company_id?: string;
    page_path?: string;
    action?: string;
    metadata?: Record<string, unknown>;
    created_at?: string;
}
export declare function getBrandComponents(category?: string, search?: string): Promise<BrandComponent[]>;
export declare function upsertBrandComponent(component: BrandComponent): Promise<BrandComponent | null>;
export declare function toggleFavoriteComponent(id: string, isFavorite: boolean): Promise<boolean>;
export declare function deleteBrandComponent(id: string): Promise<boolean>;
export declare function getBrandTokens(category?: string): Promise<BrandToken[]>;
export declare function upsertBrandToken(token: BrandToken): Promise<BrandToken | null>;
export declare function logComponentUsage(log: ComponentUsageLog): Promise<void>;
export declare function getBrandStats(): Promise<{
    total: number;
    atomic: number;
    molecular: number;
    organism: number;
    favorites: number;
    tokens: number;
}>;
//# sourceMappingURL=brand-db.d.ts.map