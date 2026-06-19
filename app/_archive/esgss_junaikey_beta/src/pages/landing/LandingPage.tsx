/**
 * Landing Page - ?�口?�面
 * Anti-gravity Design System
 * 
 * ?�循 Anti-gravity 設�??��??�入????? */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Fade,
  Slide,
} from '@mui/material';
import {
  KeyboardArrowRight,
  RocketLaunch,
  AutoAwesome,
  Speed,
  Security,
  Language,
} from '@mui/icons-material';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravitySection, AntiGravityGrid, AntiGravityFlex } from '@/components/layout/AntiGravityLayout';
import { tExtended } from '@/i18n/translations-extended';
import './LandingPage.css';

// ============================================================================
// 類�?定義
// ============================================================================

interface LandingPageProps {
  language?: 'zh-TW' | 'en';
}

// ============================================================================
// Landing Page 組件
// ============================================================================

export const LandingPage: React.FC<LandingPageProps> = ({ language: initialLanguage = 'zh-TW' }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    navigate('/start');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW');
  };

  const features = [
    {
      icon: <AutoAwesome />,
      title: tExtended('landing.features.design.title', language),
      description: tExtended('landing.features.design.description', language),
    },
    {
      icon: <Speed />,
      title: tExtended('landing.features.performance.title', language),
      description: tExtended('landing.features.performance.description', language),
    },
    {
      icon: <Security />,
      title: tExtended('landing.features.security.title', language),
      description: tExtended('landing.features.security.description', language),
    },
  ];

  return (
    <Box className="landing-page">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Fade in={mounted} timeout={1000}>
            <Box className="hero-content">
              <Stack spacing={4} alignItems="center" textAlign="center">
                {/* Logo */}
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                    boxShadow: '0 8px 32px rgba(0,255,255, 0.3)',
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 40 }} />
                </Avatar>

                {/* Title */}
                <Typography
                  variant="h1"
                  className="hero-title"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {tExtended('landing.title', language)}
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h5"
                  className="hero-subtitle"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    color: 'text.secondary',
                    maxWidth: 800,
                  }}
                >
                  {tExtended('landing.subtitle', language)}
                </Typography>

                {/* Language Toggle */}
                <Chip
                  label={language === 'zh-TW' ? '繁�?中�?' : 'English'}
                  onClick={handleLanguageToggle}
                  sx={{ cursor: 'pointer' }}
                  icon={<Language />}
                />

                {/* CTA Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStart}
                  endIcon={<KeyboardArrowRight />}
                  className="cta-button"
                  sx={{
                    padding: '16px 48px',
                    fontSize: '1.2rem',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                    boxShadow: '0 8px 32px rgba(0,255,255, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,255,255, 0.5)',
                    },
                  }}
                >
                  {tExtended('landing.cta', language)}
                </Button>

                {/* UUID Display */}
                <Box className="uuid-display">
                  <UUIDDisplay
                    uuid="550e8400-e29b-41d4-a716-446655440000"
                    mode="short"
                    showLabel={true}
                    language={language}
                  />
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <AntiGravitySection
            title={tExtended('landing.features.title', language)}
            description={tExtended('landing.features.description', language)}
            padding={4}
          >
            <AntiGravityGrid
              columns={1}
              responsiveColumns={{ sm: 1, md: 3 }}
              gap={4}
            >
              {features.map((feature, index) => (
                <Slide
                  key={index}
                  in={mounted}
                  direction="up"
                  timeout={1000 + index * 200}
                >
                  <Card className="feature-card">
                    <CardContent>
                      <Stack spacing={3} alignItems="center" textAlign="center">
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Slide>
              ))}
            </AntiGravityGrid>
          </AntiGravitySection>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="footer">
        <Container maxWidth="lg">
          <AntiGravityFlex justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              © 2024 Anti-gravity Design System
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip label="v1.0.0" size="small" />
              <Chip label="MIT License" size="small" />
            </Stack>
          </AntiGravityFlex>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

