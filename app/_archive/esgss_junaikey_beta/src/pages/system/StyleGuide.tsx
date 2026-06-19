import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { BentoCard } from '@/components/ui/BentoCard';
import { DenseInfoGrid } from '@/components/ui/DenseInfoGrid';
import { useOmniTheme } from '@/omni/infrastructure/ui/OmniThemeProvider';
import { WaterDrop, LightMode, DarkMode, Dashboard, Forest, People, Gavel } from '@mui/icons-material';

const StyleGuidePage: React.FC = () => {
    const { theme, setTheme } = useOmniTheme();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h1">ESG UI Style Guide</Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant={theme === 'aquaFlow' ? 'contained' : 'outlined'}
                        onClick={() => setTheme('aquaFlow')}
                        startIcon={<WaterDrop />}
                        color="primary"
                    >
                        Aqua Flow (Default)
                    </Button>
                    <Button
                        variant={theme === 'sunlight' ? 'contained' : 'outlined'}
                        onClick={() => setTheme('sunlight')}
                        startIcon={<LightMode />}
                        color="warning"
                    >
                        Sunlight
                    </Button>
                    <Button
                        variant={theme === 'midnight' ? 'contained' : 'outlined'}
                        onClick={() => setTheme('midnight')}
                        startIcon={<DarkMode />}
                        color="secondary"
                    >
                        Midnight
                    </Button>
                </Box>
            </Box>

            <Typography variant="h2" gutterBottom>
                Bento Grid Layout
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 6 }}>
                {/* Row 1 */}
                <BentoCard title="Daily Tasks" subtitle="Your priority actions" icon={<Dashboard />} gridSpan={1} status="active">
                    <Typography variant="body2">
                        • Review ESG Report Draft<br />
                        • Approve Carbon Data<br />
                        • Weekly Team Sync
                    </Typography>
                </BentoCard>

                <BentoCard title="Learning Progress" subtitle="Current Phase" icon={<Forest />} gridSpan={1} status="neutral">
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="h4" color="primary">75%</Typography>
                    </Box>
                </BentoCard>

                <BentoCard title="Knowledge Sanctuary" subtitle="Latest Insights" icon={<Gavel />} gridSpan={2} status="active">
                    <Typography variant="body2" color="text.secondary" paragraph>
                        The latest regulations on carbon taxation have been released. Check out the summary...
                    </Typography>
                    <Button variant="text" size="small">Read More</Button>
                </BentoCard>

                {/* Row 2 */}
                <BentoCard title="ESG Performance Metrics" subtitle="Real-time Data" icon={<People />} gridSpan={3} expandable>
                    <DenseInfoGrid
                        items={[
                            { label: 'Carbon Footprint', value: '1,234 t', trend: 'down', color: 'E' },
                            { label: 'Employee Satisfaction', value: '4.2/5', trend: 'up', color: 'S' },
                            { label: 'Board Diversity', value: '40%', trend: 'stable', color: 'G' },
                            { label: 'Community Hours', value: '500 h', trend: 'up', color: 'S' },
                        ]}
                    />
                </BentoCard>

                <BentoCard title="Quick Actions" gridSpan={1}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Button variant="outlined" fullWidth>Generate Report</Button>
                        <Button variant="outlined" fullWidth>Add Data</Button>
                    </Box>
                </BentoCard>
            </Box>

            <Typography variant="h2" gutterBottom>
                Typography
            </Typography>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h1" gutterBottom>H1 Heading (32px/40px)</Typography>
                <Typography variant="h2" gutterBottom>H2 Heading (24px/32px)</Typography>
                <Typography variant="h3" gutterBottom>H3 Heading (20px)</Typography>
                <Typography variant="body1" paragraph>
                    Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
                <Typography variant="body2">
                    Body 2: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
            </Paper>
        </Container>
    );
};

export default StyleGuidePage;
