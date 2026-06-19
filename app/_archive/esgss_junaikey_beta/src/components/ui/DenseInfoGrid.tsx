import React from 'react';
import { Box, Typography, Grid, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

export interface DenseInfoItemProps {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
    color?: 'E' | 'S' | 'G' | 'Neutral' | 'Primary';
    tooltip?: string;
}

export interface DenseInfoGridProps {
    items: DenseInfoItemProps[];
    columns?: number; // Approximate columns for responsive grid
    gap?: number;
}

const InfoCell = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.light,
    },
}));

const TrendIcon = ({ trend }: { trend?: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <ArrowUpward fontSize="small" color="success" sx={{ fontSize: 14 }} />;
    if (trend === 'down') return <ArrowDownward fontSize="small" color="error" sx={{ fontSize: 14 }} />;
    if (trend === 'stable') return <Remove fontSize="small" color="disabled" sx={{ fontSize: 14 }} />;
    return null;
};

const getStatusColor = (color: string) => {
    switch (color) {
        case 'E': return '#4CAF50';
        case 'S': return '#2196F3';
        case 'G': return '#9C27B0';
        case 'Neutral': return '#78909C';
        case 'Primary': return 'primary.main';
        default: return 'text.primary';
    }
};

export const DenseInfoGrid: React.FC<DenseInfoGridProps> = ({ items, columns = 4, gap = 1 }) => {
    return (
        <Grid container spacing={gap}>
            {items.map((item, index) => (
                <Grid item xs={6} sm={4} md={12 / columns} key={index}>
                    <Tooltip title={item.tooltip || ''} arrow disableHoverListener={!item.tooltip}>
                        <InfoCell>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {item.label}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{ color: getStatusColor(item.color || 'Neutral') }}
                                >
                                    {item.value}
                                </Typography>
                                <TrendIcon trend={item.trend} />
                            </Box>
                        </InfoCell>
                    </Tooltip>
                </Grid>
            ))}
        </Grid>
    );
};
