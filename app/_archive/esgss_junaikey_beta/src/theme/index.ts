import { createTheme, Theme } from '@mui/material/styles';
import { aquaFlowPalette, sunlightPalette, midnightPalette } from './palette';
import { typography } from './typography';

// Define the available theme keys
export type ThemeMode = 'aquaFlow' | 'sunlight' | 'midnight' | 'custom';

// Helper to create the theme based on the mode
export const createESGTheme = (mode: ThemeMode): Theme => {
    let palette = aquaFlowPalette;

    switch (mode) {
        case 'sunlight':
            palette = sunlightPalette;
            break;
        case 'midnight':
            palette = midnightPalette;
            break;
        case 'aquaFlow':
        default:
            palette = aquaFlowPalette;
            break;
    }

    return createTheme({
        palette,
        typography,
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.06), 0px 1px 10px 0px rgba(0,0,0,0.04)', // Elevation 2-like
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                    },
                },
            },
        },
    });
};
