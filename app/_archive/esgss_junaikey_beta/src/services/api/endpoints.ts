// API Endpoints Constants
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },

  // ESG endpoints
  ESG: {
    METRICS: '/esg/metrics',
    CALCULATE: '/esg/calculate',
    REPORTS: '/esg/reports',
    REPORT_BY_ID: (id: string) => `/esg/reports/${id}`,
  },

  // AI endpoints
  AI: {
    CHAT: '/ai/chat',
    ANALYZE: '/ai/analyze',
    INSIGHTS: '/ai/insights',
    RECOMMENDATIONS: '/ai/recommendations',
  },

  // Learning endpoints
  LEARNING: {
    PATHS: '/learning/paths',
    PROGRESS: '/learning/progress',
    RECOMMENDATIONS: '/learning/recommendations',
  },

  // Analytics endpoints
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    TRENDS: '/analytics/trends',
    REPORTS: '/analytics/reports',
  },

  // Monitoring endpoints
  MONITORING: {
    HEALTH: '/monitoring/health',
    STATUS: '/monitoring/status',
    METRICS: '/monitoring/metrics',
  },

  // Projects (if implemented)
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
} as const;

export default API_ENDPOINTS;
