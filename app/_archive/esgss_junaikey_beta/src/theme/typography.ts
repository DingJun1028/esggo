import { TypographyVariantsOptions } from '@mui/material/styles';

export const typography: TypographyVariantsOptions = {
    fontFamily: [
        '"Noto Sans TC"',
        '"Inter"',
        '"Roboto"',
        '"Helvetica"',
        '"Arial"',
        'sans-serif',
    ].join(','),
    h1: {
        fontSize: '2rem', // 32px
        fontWeight: 700,
        '@media (min-width:600px)': {
            fontSize: '2.5rem', // 40px
        },
    },
    h2: {
        fontSize: '1.5rem', // 24px
        fontWeight: 600,
        '@media (min-width:600px)': {
            fontSize: '2rem', // 32px
        },
    },
    h3: {
        fontSize: '1.25rem', // 20px
        fontWeight: 600,
    },
    h4: {
        fontSize: '1.125rem', // 18px
        fontWeight: 600,
    },
    h5: {
        fontSize: '1rem', // 16px
        fontWeight: 600,
    },
    h6: {
        fontSize: '0.875rem', // 14px
        fontWeight: 600,
    },
    body1: {
        fontSize: '1rem', // 16px
    },
    body2: {
        fontSize: '0.875rem', // 14px
    },
    button: {
        textTransform: 'none', // No uppercase by default
        fontWeight: 500,
    },
};
