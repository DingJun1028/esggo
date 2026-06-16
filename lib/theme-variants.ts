export type ThemeVariant = 'green' | 'blue' | 'earth' | 'sunset' | 'neutral';

export interface ThemeConfig {
  name: string;
  variant: ThemeVariant;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  typography: {
    heading: string;
    body: string;
  };
}

export const THEME_VARIANTS: Record<ThemeVariant, ThemeConfig> = {
  green: {
    name: 'ESGGO 善向永續 V1.4 - 綠色永續',
    variant: 'green',
    colors: {
      primary: 'hsl(16, 100%, 44.9%)',
      secondary: 'hsl(145, 40%, 85%)',
      accent: 'hsl(160, 30%, 50%)',
      background: 'hsl(145, 50%, 95%)',
      surface: 'hsl(0, 0%, 100%)',
      text: 'hsl(16, 20%, 20%)',
      border: 'hsl(145, 30%, 85%)',
    },
    typography: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
    },
  },
  blue: {
    name: 'ESGGO 善向永續 V1.4 - 海藍版',
    variant: 'blue',
    colors: {
      primary: 'hsl(210, 100%, 40%)',
      secondary: 'hsl(200, 50%, 85%)',
      accent: 'hsl(195, 50%, 50%)',
      background: 'hsl(210, 30%, 95%)',
      surface: 'hsl(0, 0%, 100%)',
      text: 'hsl(210, 20%, 20%)',
      border: 'hsl(210, 30%, 85%)',
    },
    typography: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
    },
  },
  earth: {
    name: 'ESGGO 善向永續 V1.4 - 泥土版',
    variant: 'earth',
    colors: {
      primary: 'hsl(25, 70%, 45%)',
      secondary: 'hsl(30, 60%, 85%)',
      accent: 'hsl(40, 80%, 55%)',
      background: 'hsl(30, 70%, 95%)',
      surface: 'hsl(0, 0%, 100%)',
      text: 'hsl(25, 30%, 25%)',
      border: 'hsl(30, 50%, 85%)',
    },
    typography: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
    },
  },
  sunset: {
    name: 'ESGGO 善向永續 V1.4 - 日落版',
    variant: 'sunset',
    colors: {
      primary: 'hsl(20, 80%, 50%)',
      secondary: 'hsl(35, 80%, 85%)',
      accent: 'hsl(15, 70%, 55%)',
      background: 'hsl(35, 90%, 95%)',
      surface: 'hsl(0, 0%, 100%)',
      text: 'hsl(20, 30%, 25%)',
      border: 'hsl(35, 70%, 85%)',
    },
    typography: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
    },
  },
  neutral: {
    name: 'ESGGO 善向永續 V1.4 - 中性版',
    variant: 'neutral',
    colors: {
      primary: 'hsl(16, 60%, 50%)',
      secondary: 'hsl(210, 20%, 80%)',
      accent: 'hsl(16, 80%, 60%)',
      background: 'hsl(0, 0%, 95%)',
      surface: 'hsl(0, 0%, 100%)',
      text: 'hsl(0, 10%, 20%)',
      border: 'hsl(210, 20%, 85%)',
    },
    typography: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
    },
  },
};

export function getThemeConfig(variant: ThemeVariant = 'green') {
  return THEME_VARIANTS[variant];
}