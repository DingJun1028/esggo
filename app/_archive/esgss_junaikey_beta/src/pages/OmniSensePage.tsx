import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Sensors } from '@mui/icons-material';

const OmniSensePage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Sensors sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    OmniSense Perception Center
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" paragraph>
                    AI Voice, Vision & Sentient Perception Engine
                </Typography>
                <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 2, width: '100%', maxWidth: 600 }}>
                    <Typography variant="h6" gutterBottom>
                        System Status
                    </Typography>
                    <Typography variant="body2" color="success.main">
                        ● Voice Recognition: Active
                    </Typography>
                    <Typography variant="body2" color="success.main">
                        ● Computer Vision: Active
                    </Typography>
                    <Typography variant="body2" color="info.main">
                        ● Sentient Analysis: Standby
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default OmniSensePage;
