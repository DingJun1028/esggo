/**
 * Matrix Data Store - 萬能元件終極矩陣資料層
 * 5T 協議：Tangible, Traceable, Trackable, Transparent, Trustworthy
 */

import { supabase } from '@/lib/db/supabase';

export interface MatrixComponent {
  id: string;
  name: string;
  category: 'Perception' | 'Command' | 'Omniscience' | 'Global' | 'Hologram' | 'Atoms';
  route: string;
  registered: boolean;
  fiveT: {
    traceable: boolean;
    transparent: boolean;
    tangible: boolean;
    trustworthy: boolean;
    trackable: boolean;
  };
  deliverables: string[];
  businessLogic: string;
  uiux: string;
  customerJourney: string;
  painPointsSolved: string;
  lastUpdated: string;
}

/**
 * 獲取矩陣元件列表
 */
export const getMatrixComponents = async (): Promise<MatrixComponent[]> => {
  try {
    const { data, error } = await supabase
      .from('omni_matrix_components')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch {
    return [
      {
        id: 'ui-001',
        name: 'OmniBaseCard',
        category: 'Perception',
        route: '/design-library',
        registered: true,
        fiveT: {
          traceable: true,
          transparent: false,
          tangible: true,
          trustworthy: false,
          trackable: false,
        },
        deliverables: ['components/ui/omni/OmniBaseCard.tsx'],
        businessLogic: 'Liquid glass base container',
        uiux: 'Glassmorphism, rounded corners',
        customerJourney: 'Core UI building block',
        painPointsSolved: 'Hard edges in traditional cards',
        lastUpdated: '2026-06-14',
      },
      {
        id: 'ui-002',
        name: 'OmniTable',
        category: 'Perception',
        route: '/admin/omni-table',
        registered: true,
        fiveT: {
          traceable: true,
          transparent: true,
          tangible: true,
          trustworthy: false,
          trackable: false,
        },
        deliverables: ['components/ui/omni/OmniTable.tsx'],
        businessLogic: 'Data grid with sorting and filtering',
        uiux: 'Striped rows, glass header',
        customerJourney: 'Data management & audit',
        painPointsSolved: 'Data overload and misalignment',
        lastUpdated: '2026-06-14',
      },
    ];
  }
};

/**
 * 獲取單一元件詳情
 */
export const getMatrixComponentById = async (id: string): Promise<MatrixComponent | null> => {
  try {
    const { data, error } = await supabase
      .from('omni_matrix_components')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

/**
 * 建立矩陣元件記錄
 */
export const createMatrixComponent = async (component: MatrixComponent): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('omni_matrix_components')
      .insert(component)
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

/**
 * 更新矩陣元件
 */
export const updateMatrixComponent = async (
  id: string,
  updates: Partial<MatrixComponent>
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('omni_matrix_components').update(updates).eq('id', id);

    return !error;
  } catch {
    return false;
  }
};

/**
 * 獲取矩陣路由對應表
 */
export const getRouteMatrixMap = async (): Promise<Record<string, MatrixComponent>> => {
  const components = await getMatrixComponents();
  return components.reduce((acc, comp) => {
    acc[comp.route] = comp;
    return acc;
  }, {} as Record<string, MatrixComponent>);
};

/**
 * 矩陣路由列表 (55 個核心路由)
 */
export const MATRIX_ROUTES = [
  '/',
  '/login',
  '/gri',
  '/materiality',
  '/carbon-heatmap',
  '/cbam-calculator',
  '/supply-chain',
  '/digital-twin',
  '/compliance-check',
  '/audit-verify',
  '/advisory',
  '/agents',
  '/think-tank',
  '/sustain-write',
  '/document-checklist',
  '/dashboard/report-builder',
  '/dashboard/metrics/environmental',
  '/dashboard/metrics/social',
  '/dashboard/metrics/governance',
  '/dashboard/matrix',
  '/audit-log',
  '/data-sources',
  '/api-setup',
  '/profile',
  '/tasks',
  '/stakeholders',
  '/academy',
  '/reading-room',
  '/reading-room/comparative-lab',
  '/integrity',
  '/health-check',
  '/system-status',
  '/super-admin',
  '/admin/omni-table',
  '/design-library',
  '/omnispace/sanctuary',
  '/omni-factory',
  '/ai-platform',
  '/terminal',
  '/editor',
  '/publish',
  '/publish/print',
  '/proof-center',
  '/roadmap',
  '/system-test',
  '/soul',
  '/social',
  '/intelligence',
  '/finance',
  '/governance',
  '/environmental',
  '/advisors',
  '/templates',
  '/vault',
  '/esggo-omnipencil',
  '/oauth/consent',
];

/**
 * 驗證路由是否存在對應矩陣元件
 */
export const validateRouteInMatrix = async (route: string): Promise<boolean> => {
  const matrix = await getRouteMatrixMap();
  return route in matrix || MATRIX_ROUTES.includes(route);
};
