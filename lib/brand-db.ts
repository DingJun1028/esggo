import { getSupabaseClient } from './supabase';

export interface BrandComponent {
  id?: string;
  company_id?: string;
  name: string;
  category: string;
  variant?: string;
  props?: Record<string, any>;
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
  metadata?: Record<string, any>;
  created_at?: string;
}

// ── Components ──────────────────────────────────────────────

export async function getBrandComponents(
  category?: string,
  search?: string
): Promise<BrandComponent[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return getLocalComponents();

  try {
    let query = supabase
      .from('brand_components')
      .select('*')
      .eq('company_id', 'default')
      .order('category')
      .order('name');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch {
    return getLocalComponents();
  }
}

export async function upsertBrandComponent(
  component: BrandComponent
): Promise<BrandComponent | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const hashInput = `${component.name}-${component.category}-${Date.now()}`;
  const hash_lock = btoa(hashInput).slice(0, 32);

  try {
    const { data, error } = await supabase
      .from('brand_components')
      .upsert(
        {
          ...component,
          company_id: 'default',
          hash_lock,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'company_id,name,category' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function toggleFavoriteComponent(
  id: string,
  isFavorite: boolean
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('brand_components')
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteBrandComponent(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('brand_components')
      .delete()
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ── Tokens ──────────────────────────────────────────────────

export async function getBrandTokens(category?: string): Promise<BrandToken[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('brand_tokens')
      .select('*')
      .eq('company_id', 'default')
      .order('category')
      .order('token_key');

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function upsertBrandToken(token: BrandToken): Promise<BrandToken | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('brand_tokens')
      .upsert(
        { ...token, company_id: 'default', updated_at: new Date().toISOString() },
        { onConflict: 'company_id,token_key' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

// ── Usage Logs ───────────────────────────────────────────────

export async function logComponentUsage(log: ComponentUsageLog): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from('component_usage_logs').insert({
      ...log,
      company_id: 'default',
    });
  } catch {
    // silent
  }
}

// ── Stats ────────────────────────────────────────────────────

export async function getBrandStats() {
  const supabase = getSupabaseClient();
  if (!supabase) return { total: 25, atomic: 14, molecular: 7, organism: 4, favorites: 0, tokens: 12 };

  try {
    const [{ count: total }, { data: cats }, { count: favorites }, { count: tokens }] =
      await Promise.all([
        supabase.from('brand_components').select('*', { count: 'exact', head: true }).eq('company_id', 'default'),
        supabase.from('brand_components').select('category').eq('company_id', 'default'),
        supabase.from('brand_components').select('*', { count: 'exact', head: true }).eq('company_id', 'default').eq('is_favorite', true),
        supabase.from('brand_tokens').select('*', { count: 'exact', head: true }).eq('company_id', 'default'),
      ]);

    const catCounts = (cats || []).reduce((acc: any, r: any) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});

    return {
      total: total || 0,
      atomic: catCounts.atomic || 0,
      molecular: catCounts.molecular || 0,
      organism: catCounts.organism || 0,
      favorites: favorites || 0,
      tokens: tokens || 0,
    };
  } catch {
    return { total: 25, atomic: 14, molecular: 7, organism: 4, favorites: 0, tokens: 12 };
  }
}

// ── Local fallback ───────────────────────────────────────────

function getLocalComponents(): BrandComponent[] {
  return [
    { name: 'BrandBadge', category: 'atomic', variant: 'default', description: '狀態標籤元件，支援 9 種變體 × 3 種尺寸', tags: ['badge', 'status'], version: '9.0.0' },
    { name: 'BrandButton', category: 'atomic', variant: 'primary', description: '按鈕元件，6 種變體 × 4 種尺寸', tags: ['button', 'action'], version: '9.0.0' },
    { name: 'BrandCard', category: 'molecular', variant: 'default', description: '可組合卡片元件', tags: ['card', 'container'], version: '9.0.0' },
    { name: 'BrandInput', category: 'atomic', variant: 'text', description: '統一表單控件', tags: ['form', 'input'], version: '9.0.0' },
    { name: 'BrandModal', category: 'molecular', variant: 'default', description: '無障礙彈窗系統', tags: ['modal', 'dialog'], version: '9.0.0' },
    { name: 'BrandTable', category: 'organism', variant: 'striped', description: '通用型別安全資料表', tags: ['table', 'data'], version: '9.0.0' },
    { name: 'BrandTabs', category: 'molecular', variant: 'line', description: '頁籤元件', tags: ['tabs', 'navigation'], version: '9.0.0' },
    { name: 'BrandProgress', category: 'atomic', variant: 'blue', description: '多色進度條', tags: ['progress', 'metric'], version: '9.0.0' },
    { name: 'BrandKpiCard', category: 'organism', variant: 'default', description: 'KPI 指標卡', tags: ['kpi', 'dashboard'], version: '9.0.0' },
    { name: 'BrandPageHeader', category: 'organism', variant: 'default', description: '頁面標題欄', tags: ['header', 'page'], version: '9.0.0' },
    { name: 'BrandT5Strip', category: 'atomic', variant: 'full', description: '5T 誠信協議條帶', tags: ['5t', 'protocol'], version: '9.0.0' },
    { name: 'BrandStatusDot', category: 'atomic', variant: 'active', description: '狀態圓點指示器', tags: ['status', 'dot'], version: '9.0.0' },
    { name: 'BrandAlert', category: 'molecular', variant: 'info', description: '提示框元件', tags: ['alert', 'feedback'], version: '9.0.0' },
    { name: 'BrandSkeleton', category: 'atomic', variant: 'default', description: '骨架屏載入元件', tags: ['skeleton', 'loading'], version: '9.0.0' },
    { name: 'BrandEmptyState', category: 'molecular', variant: 'default', description: '空狀態提示元件', tags: ['empty', 'placeholder'], version: '9.0.0' },
    { name: 'BrandAvatar', category: 'atomic', variant: 'default', description: '頭像元件', tags: ['avatar', 'user'], version: '9.0.0' },
    { name: 'BrandTooltip', category: 'atomic', variant: 'top', description: '工具提示', tags: ['tooltip', 'hint'], version: '9.0.0' },
    { name: 'BrandSearchBar', category: 'atomic', variant: 'default', description: '搜尋欄位', tags: ['search', 'filter'], version: '9.0.0' },
    { name: 'BrandFilterChip', category: 'molecular', variant: 'default', description: '篩選膠囊', tags: ['filter', 'chip'], version: '9.0.0' },
    { name: 'BrandTimeline', category: 'organism', variant: 'default', description: '事件時間軸', tags: ['timeline', 'history'], version: '9.0.0' },
    { name: 'BrandStepWizard', category: 'organism', variant: 'horizontal', description: '步驟精靈', tags: ['step', 'wizard'], version: '9.0.0' },
    { name: 'BrandChartCard', category: 'organism', variant: 'default', description: '圖表容器卡', tags: ['chart', 'visualization'], version: '9.0.0' },
    { name: 'BrandDataCard', category: 'molecular', variant: 'default', description: '數據卡', tags: ['data', 'metric'], version: '9.0.0' },
    { name: 'BrandGRITag', category: 'atomic', variant: 'default', description: 'GRI 指標代碼標籤', tags: ['gri', 'standard'], version: '9.0.0' },
    { name: 'BrandScoreRing', category: 'atomic', variant: 'default', description: 'SVG 分數環', tags: ['score', 'ring'], version: '9.0.0' },
  ];
}