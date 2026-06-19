import { PaletteOptions } from '@mui/material/styles';

// ESG Status Colors
export const esgColors = {
    E: '#4CAF50', // Environmental
    S: '#2196F3', // Social
    G: '#9C27B0', // Governance
    Neutral: '#78909C',
};

// 5T Protocol Colors
export const protocolColors = {
    Traceable: '#00BCD4',
    Trackable: '#3F51B5',
    Transparent: '#8BC34A',
    Trustworthy: '#FFC107',
    Tangible: '#FF5722',
};

// Aqua Flow (Default)
export const aquaFlowPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#00FFFF',
        dark: '#4A8291',
        light: '#8FC4D1',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#26A69A',
        dark: '#00897B',
    },
    warning: {
        main: '#FFA726',
    },
    background: {
        default: '#F4F9FA', // Very light aqua tint
        paper: '#FFFFFF',
    },
};

// Sunlight (Light)
export const sunlightPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#FFB74D',
        dark: '#F57C00',
        light: '#FFE0B2',
    },
    secondary: {
        main: '#7CB342',
    },
    warning: {
        main: '#FF7043',
    },
    background: {
        default: '#FFF8E1', // Very light orange/yellow tint
        paper: '#FFFFFF',
    },
};

// Midnight (Dark)
export const midnightPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#3949AB',
        dark: '#283593',
        light: '#5C6BC0',
    },
    secondary: {
        main: '#26A69A',
    },
    warning: {
        main: '#FF7043',
    },
    background: {
        default: '#121212',
        paper: '#1E1E1E',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
    },
};
