import React from 'react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Box, ToggleButton, ToggleButtonGroup, Select, MenuItem, Typography, Paper } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

export const ThemeSettingsPanel: React.FC = () => {
    const { mode, setMode } = useStitchTheme();
    const { language, setLanguage, t } = useLanguage();

    const handleModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newMode: 'light' | 'dark' | 'system' | null,
    ) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 4,
                display: 'inline-flex',
                gap: 3,
                alignItems: 'center',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            }}
        >
            {/* Mode Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {t('ui.mode.label')}
                </Typography>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    aria-label="theme mode"
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: '8px',
                            border: 'none',
                            mx: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0,255,255, 0.2)',
                                color: '#00FFFF',
                            },
                        },
                    }}
                >
                    <ToggleButton value="light" aria-label="light mode" title={t('ui.mode.day')}>
                        <WbSunnyIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="system" aria-label="system mode" title={t('ui.mode.system')}>
                        <SettingsBrightnessIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="dark" aria-label="dark mode" title={t('ui.mode.night')}>
                        <DarkModeIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box sx={{ width: 1, height: 24, bgcolor: 'divider' }} />

            {/* Language Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {t('ui.language')}
                </Typography>
                <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    size="small"
                    variant="standard"
                    disableUnderline
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'text.primary',
                        '& .MuiSelect-select': {
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        },
                    }}
                >
                    <MenuItem value="zh-TW">繁體中文</MenuItem>
                    <MenuItem value="en-US">English</MenuItem>
                    <MenuItem value="ko-KR">한국어</MenuItem>
                </Select>
            </Box>
        </Paper>
    );
};
