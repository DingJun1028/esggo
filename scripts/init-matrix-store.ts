/**
 * Matrix Store Initialization Script
 * Populates omni_matrix_components table with all 55 routes
 */

import { supabase } from '@/lib/db/supabase';
import { MATRIX_ROUTES, MatrixComponent } from '@/lib/omni-core/matrix-store';

const MATRIX_COMPONENTS: MatrixComponent[] = [
  {
    id: 'page-001',
    name: 'DashboardShell',
    category: 'Perception',
    route: '/',
    registered: true,
    fiveT: {
      traceable: true,
      transparent: true,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: ['app/page.tsx'],
    businessLogic: 'KPI dashboard with real-time metrics',
    uiux: 'Liquid glass cards, charts, quick access',
    customerJourney: 'System overview and navigation',
    painPointsSolved: 'Unified dashboard with actionable insights',
    lastUpdated: '2026-06-14',
  },
  {
    id: 'ui-001',
    name: 'AuthGate',
    category: 'Perception',
    route: '/login',
    registered: true,
    fiveT: {
      traceable: true,
      transparent: false,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: ['app/login/page.tsx'],
    businessLogic: 'OAuth, SSO, MFA authentication',
    uiux: 'Secure vault animation, multiple auth methods',
    customerJourney: 'User login and access control',
    painPointsSolved: 'Single sign-on with fallback auth methods',
    lastUpdated: '2026-06-14',
  },
  {
    id: 'esg-001',
    name: 'MaterialityMatrix',
    category: 'Hologram',
    route: '/materiality',
    registered: true,
    fiveT: {
      traceable: true,
      transparent: true,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: ['app/materiality/page.tsx'],
    businessLogic: 'GRI materiality assessment algorithm',
    uiux: '2D scatter plot with draggable weights',
    customerJourney: 'ESG strategy planning',
    painPointsSolved: 'Quantified materiality with visual analysis',
    lastUpdated: '2026-06-14',
  },
  {
    id: 'viz-001',
    name: 'CarbonHeatmap',
    category: 'Hologram',
    route: '/carbon-heatmap',
    registered: true,
    fiveT: {
      traceable: true,
      transparent: true,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: ['app/carbon-heatmap/page.tsx'],
    businessLogic: 'Geo-spatial carbon emission visualization',
    uiux: 'WebGL heatmap with zoom and filter',
    customerJourney: 'Carbon footprint monitoring',
    painPointsSolved: 'Pattern recognition in emission data',
    lastUpdated: '2026-06-14',
  },
  {
    id: 'calc-001',
    name: 'CbamCalculator',
    category: 'Hologram',
    route: '/cbam-calculator',
    registered: true,
    fiveT: {
      traceable: true,
      transparent: true,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: ['app/cbam-calculator/page.tsx'],
    businessLogic: 'CBAM carbon calculation formula',
    uiux: 'Real-time sliders, PDF export',
    customerJourney: 'Carbon border tax calculation',
    painPointsSolved: 'Complex CBAM calculations made simple',
    lastUpdated: '2026-06-14',
  },
  // ... 其餘 51 個元件持續新增中
].concat(
  MATRIX_ROUTES.slice(2).map((route, idx) => ({
    id: `route-${idx + 3}`,
    name: route.split('/').pop()?.replace(/-/g, ' ') || `Page ${idx + 3}`,
    category: 'Atoms' as const,
    route,
    registered: true,
    fiveT: {
      traceable: true,
      transparent: true,
      tangible: true,
      trustworthy: true,
      trackable: true,
    },
    deliverables: [`app${route}/page.tsx`],
    businessLogic: `Page route: ${route}`,
    uiux: 'Standard liquid glass layout',
    customerJourney: 'Feature access',
    painPointsSolved: 'Seamless navigation',
    lastUpdated: '2026-06-14',
  }))
);

export async function initializeMatrixStore() {
  const { error } = await supabase.from('omni_matrix_components').upsert(MATRIX_COMPONENTS);
  if (error) throw error;
  return MATRIX_COMPONENTS.length;
}
