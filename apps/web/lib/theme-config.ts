export type ThemeId = 'minimal-blue' | 'dark-navy' | 'water-zen' | 'berkeley';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameEn: string;
  description: string;
  emoji: string;
  vars: Record<string, string>;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'minimal-blue',
    name: '極簡白藍',
    nameEn: 'Minimal White-Blue',
    description: '白底藍字，極致簡約，專業清晰',
    emoji: '⬜',
    vars: {
      '--bg-primary': '#f8fafc',
      '--bg-card': '#ffffff',
      '--bg-hover': '#f1f5f9',
      '--bg-active': '#e8f0fe',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--border-color': '#e2e8f0',
      '--border-strong': '#cbd5e1',
      '--accent-primary': '#003262',
      '--accent-secondary': '#1d4ed8',
      '--accent-gold': '#FDB515',
      '--accent-green': '#16a34a',
      '--accent-red': '#dc2626',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
      '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)',
      '--shadow-lg': '0 8px 24px rgba(0,0,0,0.10)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-text': '#475569',
      '--sidebar-active-bg': '#eff6ff',
      '--sidebar-active-text': '#003262',
      '--sidebar-active-border': '#003262',
      '--sidebar-group-text': '#94a3b8',
      '--sidebar-hover-bg': '#f8fafc',
      '--btn-primary-bg': '#003262',
      '--btn-primary-text': '#ffffff',
      '--btn-secondary-bg': '#f1f5f9',
      '--btn-secondary-text': '#475569',
      '--input-bg': '#ffffff',
      '--input-border': '#e2e8f0',
      '--input-focus': '#003262',
      '--badge-blue-bg': '#eff6ff',
      '--badge-blue-text': '#1d4ed8',
      '--badge-green-bg': '#f0fdf4',
      '--badge-green-text': '#16a34a',
      '--badge-gold-bg': '#fffbeb',
      '--badge-gold-text': '#d97706',
      '--badge-red-bg': '#fef2f2',
      '--badge-red-text': '#dc2626',
      '--table-header-bg': '#f8fafc',
      '--table-row-hover': '#f8fafc',
    },
  },
  {
    id: 'dark-navy',
    name: '深海暗黑',
    nameEn: 'Dark Navy',
    description: '深藍底色，金色點綴，沉穩專業',
    emoji: '🌊',
    vars: {
      '--bg-primary': '#0a0f1e',
      '--bg-card': '#111827',
      '--bg-hover': '#1f2937',
      '--bg-active': '#1e3a5f',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#475569',
      '--border-color': '#1f2937',
      '--border-strong': '#374151',
      '--accent-primary': '#FDB515',
      '--accent-secondary': '#3b82f6',
      '--accent-gold': '#FDB515',
      '--accent-green': '#22c55e',
      '--accent-red': '#ef4444',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3)',
      '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)',
      '--shadow-lg': '0 8px 24px rgba(0,0,0,0.5)',
      '--sidebar-bg': '#0d1426',
      '--sidebar-text': '#94a3b8',
      '--sidebar-active-bg': '#1e3a5f',
      '--sidebar-active-text': '#FDB515',
      '--sidebar-active-border': '#FDB515',
      '--sidebar-group-text': '#475569',
      '--sidebar-hover-bg': '#1f2937',
      '--btn-primary-bg': '#FDB515',
      '--btn-primary-text': '#0a0f1e',
      '--btn-secondary-bg': '#1f2937',
      '--btn-secondary-text': '#94a3b8',
      '--input-bg': '#111827',
      '--input-border': '#374151',
      '--input-focus': '#FDB515',
      '--badge-blue-bg': '#1e3a5f',
      '--badge-blue-text': '#60a5fa',
      '--badge-green-bg': '#052e16',
      '--badge-green-text': '#4ade80',
      '--badge-gold-bg': '#3d2a00',
      '--badge-gold-text': '#FDB515',
      '--badge-red-bg': '#3d0000',
      '--badge-red-text': '#f87171',
      '--table-header-bg': '#0d1426',
      '--table-row-hover': '#1f2937',
    },
  },
  {
    id: 'water-zen',
    name: '上善若水',
    nameEn: 'Water Zen',
    description: '水墨淡雅，青翠禪意，東方美學',
    emoji: '💧',
    vars: {
      '--bg-primary': '#f0f7f4',
      '--bg-card': '#ffffff',
      '--bg-hover': '#e6f2ed',
      '--bg-active': '#d1e9df',
      '--text-primary': '#1a3d2e',
      '--text-secondary': '#3d6b54',
      '--text-muted': '#7aab8f',
      '--border-color': '#cce4d8',
      '--border-strong': '#a3ccb8',
      '--accent-primary': '#1a6b45',
      '--accent-secondary': '#2d9e6b',
      '--accent-gold': '#b5860d',
      '--accent-green': '#1a6b45',
      '--accent-red': '#c0392b',
      '--shadow-sm': '0 1px 2px rgba(26,107,69,0.06)',
      '--shadow-md': '0 4px 12px rgba(26,107,69,0.10)',
      '--shadow-lg': '0 8px 24px rgba(26,107,69,0.14)',
      '--sidebar-bg': '#e8f5ee',
      '--sidebar-text': '#3d6b54',
      '--sidebar-active-bg': '#c8e6d4',
      '--sidebar-active-text': '#1a6b45',
      '--sidebar-active-border': '#1a6b45',
      '--sidebar-group-text': '#7aab8f',
      '--sidebar-hover-bg': '#ddf0e6',
      '--btn-primary-bg': '#1a6b45',
      '--btn-primary-text': '#ffffff',
      '--btn-secondary-bg': '#e6f2ed',
      '--btn-secondary-text': '#3d6b54',
      '--input-bg': '#ffffff',
      '--input-border': '#cce4d8',
      '--input-focus': '#1a6b45',
      '--badge-blue-bg': '#e0f2e9',
      '--badge-blue-text': '#1a6b45',
      '--badge-green-bg': '#d1fae5',
      '--badge-green-text': '#065f46',
      '--badge-gold-bg': '#fef9e7',
      '--badge-gold-text': '#b5860d',
      '--badge-red-bg': '#fde8e8',
      '--badge-red-text': '#c0392b',
      '--table-header-bg': '#f0f7f4',
      '--table-row-hover': '#e6f2ed',
    },
  },
  {
    id: 'berkeley',
    name: '柏克萊學院',
    nameEn: 'Berkeley Academy',
    description: '深藍金黃，學術典範，莊重威望',
    emoji: '🎓',
    vars: {
      '--bg-primary': '#f4f6fb',
      '--bg-card': '#ffffff',
      '--bg-hover': '#eef1f8',
      '--bg-active': '#dce4f5',
      '--text-primary': '#1a1f36',
      '--text-secondary': '#4a5568',
      '--text-muted': '#9baab8',
      '--border-color': '#dde3ef',
      '--border-strong': '#c4cedf',
      '--accent-primary': '#003262',
      '--accent-secondary': '#0055a2',
      '--accent-gold': '#FDB515',
      '--accent-green': '#16a34a',
      '--accent-red': '#dc2626',
      '--shadow-sm': '0 1px 3px rgba(0,50,98,0.08)',
      '--shadow-md': '0 4px 12px rgba(0,50,98,0.12)',
      '--shadow-lg': '0 8px 24px rgba(0,50,98,0.16)',
      '--sidebar-bg': '#003262',
      '--sidebar-text': '#a8bdd4',
      '--sidebar-active-bg': 'rgba(253,181,21,0.15)',
      '--sidebar-active-text': '#FDB515',
      '--sidebar-active-border': '#FDB515',
      '--sidebar-group-text': '#5a7a9a',
      '--sidebar-hover-bg': 'rgba(255,255,255,0.06)',
      '--btn-primary-bg': '#003262',
      '--btn-primary-text': '#ffffff',
      '--btn-secondary-bg': '#eef1f8',
      '--btn-secondary-text': '#4a5568',
      '--input-bg': '#ffffff',
      '--input-border': '#dde3ef',
      '--input-focus': '#003262',
      '--badge-blue-bg': '#dce4f5',
      '--badge-blue-text': '#003262',
      '--badge-green-bg': '#f0fdf4',
      '--badge-green-text': '#16a34a',
      '--badge-gold-bg': '#fffbeb',
      '--badge-gold-text': '#d97706',
      '--badge-red-bg': '#fef2f2',
      '--badge-red-text': '#dc2626',
      '--table-header-bg': '#f4f6fb',
      '--table-row-hover': '#f4f6fb',
    },
  },
];

export function applyTheme(themeId: ThemeId) {
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('esg-theme', themeId);
  }
}

export function getSavedTheme(): ThemeId {
  if (typeof window === 'undefined') return 'minimal-blue';
  return (localStorage.getItem('esg-theme') as ThemeId) || 'minimal-blue';
}

export function getFavoriteThemes(): ThemeId[] {
  if (typeof window === 'undefined') return ['minimal-blue'];
  const saved = localStorage.getItem('esg-favorite-themes');
  return saved ? JSON.parse(saved) : ['minimal-blue'];
}

export function saveFavoriteTheme(themeId: ThemeId) {
  const favs = getFavoriteThemes();
  if (!favs.includes(themeId)) {
    const updated = [...favs, themeId];
    localStorage.setItem('esg-favorite-themes', JSON.stringify(updated));
  }
}

export function removeFavoriteTheme(themeId: ThemeId) {
  const favs = getFavoriteThemes().filter(id => id !== themeId);
  localStorage.setItem('esg-favorite-themes', JSON.stringify(favs));
}