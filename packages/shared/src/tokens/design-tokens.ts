export const DESIGN_TOKENS = {
  teal: '#009EB0',
  tealLight: '#00C2AB',
  gold: '#D4AF37',
  zkpBlue: '#3B82F6',
  quantumPurple: '#8B5CF6',
  lethal: '#FF4D6D',
  critical: '#FFB703',
  optimal: '#219EBC',
  neonGreen: '#22D3EE',
  sealGold: '#F59E0B',
  trustCyan: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
} as const;

export const FIVE_T_COLORS = {
  traceable:    { bg: '#EFF6FF', text: '#1E40AF', accent: '#3B82F6', label: '溯源' },
  transparent:  { bg: '#F0FDF4', text: '#166534', accent: '#22C55E', label: '透明' },
  tangible:     { bg: '#FEF3C7', text: '#92400E', accent: '#F59E0B', label: '可量化' },
  trustworthy:  { bg: '#EDE9FE', text: '#5B21B6', accent: '#8B5CF6', label: '信任' },
  trackable:    { bg: '#ECFEFF', text: '#155E75', accent: '#06B6D4', label: '可追蹤' },
} as const;

export type FiveTGate = keyof typeof FIVE_T_COLORS;
