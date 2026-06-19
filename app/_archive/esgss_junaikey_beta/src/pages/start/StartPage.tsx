/**
 * Start Page - 開始頁面
 * Anti-gravity Design System
 * 
 * 遵循 Anti-gravity 設計原則的開始頁面
 * 提供導航到 10 個主要儀表板的功能
 */

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
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  Settings,
  Storage,
  Security,
  Language,
  ArrowForward,
  Home,
  Apps,
  Assessment,
  People,
  Extension,
  Monitor,
} from '@mui/icons-material';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravitySection, AntiGravityGrid, AntiGravityFlex } from '@/components/layout/AntiGravityLayout';
import { tExtended } from '@/i18n/translations-extended';
import './StartPage.css';

// ============================================================================
// 類型定義
// ============================================================================

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface StartPageProps {
  language?: 'zh-TW' | 'en';
}

// ============================================================================
// Start Page 組件
// ============================================================================

export const StartPage: React.FC<StartPageProps> = ({ language: initialLanguage = 'zh-TW' }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW');
  };

  const handleNavigateToDashboard = (path: string) => {
    navigate(path);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const dashboards: DashboardItem[] = [
    {
      id: 'junaikey',
      title: language === 'zh-TW' ? 'JunAiKey 儀表板' : 'JunAiKey Dashboard',
      description: language === 'zh-TW' ? '管理您的 JunAiKey 設置和數據' : 'Manage your JunAiKey settings and data',
      icon: <Dashboard />,
      path: '/dashboard/junaikey',
      color: '#00FFFF',
    },
    {
      id: 'northstar',
      title: language === 'zh-TW' ? 'North Star 儀表板' : 'North Star Dashboard',
      description: language === 'zh-TW' ? '追蹤您的目標和關鍵指標' : 'Track your goals and key metrics',
      icon: <Analytics />,
      path: '/dashboard/northstar',
      color: '#7B68EE',
    },
    {
      id: 'omni',
      title: language === 'zh-TW' ? 'Omni 儀表板' : 'Omni Dashboard',
      description: language === 'zh-TW' ? '全方位的數據分析和可視化' : 'Comprehensive data analysis and visualization',
      icon: <Apps />,
      path: '/dashboard/omni',
      color: '#FF6B9D',
    },
    {
      id: 'esg',
      title: language === 'zh-TW' ? 'ESG 儀表板' : 'ESG Dashboard',
      description: language === 'zh-TW' ? '環境、社會和治理報告' : 'Environmental, Social, and Governance reports',
      icon: <Storage />,
      path: '/dashboard/esg',
      color: '#4CAF50',
    },
    {
      id: 'settings',
      title: language === 'zh-TW' ? '設置儀表板' : 'Settings Dashboard',
      description: language === 'zh-TW' ? '配置系統設置和偏好' : 'Configure system settings and preferences',
      icon: <Settings />,
      path: '/dashboard/settings',
      color: '#FF9800',
    },
    {
      id: 'security',
      title: language === 'zh-TW' ? '安全儀表板' : 'Security Dashboard',
      description: language === 'zh-TW' ? '監控和管理系統安全' : 'Monitor and manage system security',
      icon: <Security />,
      path: '/dashboard/security',
      color: '#F44336',
    },
    {
      id: 'reports',
      title: language === 'zh-TW' ? '報告儀表板' : 'Reports Dashboard',
      description: language === 'zh-TW' ? '查看和分析各類報告' : 'View and analyze various reports',
      icon: <Assessment />,
      path: '/dashboard/reports',
      color: '#9C27B0',
    },
    {
      id: 'users',
      title: language === 'zh-TW' ? '用戶儀表板' : 'Users Dashboard',
      description: language === 'zh-TW' ? '管理用戶和權限' : 'Manage users and permissions',
      icon: <People />,
      path: '/dashboard/users',
      color: '#00BCD4',
    },
    {
      id: 'integrations',
      title: language === 'zh-TW' ? '集成儀表板' : 'Integrations Dashboard',
      description: language === 'zh-TW' ? '管理第三方服務集成' : 'Manage third-party service integrations',
      icon: <Extension />,
      path: '/dashboard/integrations',
      color: '#FF5722',
    },
    {
      id: 'monitoring',
      title: language === 'zh-TW' ? '監控儀表板' : 'Monitoring Dashboard',
      description: language === 'zh-TW' ? '實時監控系統性能和狀態' : 'Real-time system performance and status monitoring',
      icon: <Monitor />,
      path: '/dashboard/monitoring',
      color: '#607D8B',
    },
  ];

  return (
    <Box className="start-page">
      {/* Header */}
      <Box className="start-header">
        <Container maxWidth="lg">
          <Fade in={mounted} timeout={800}>
            <Box className="header-content">
              <AntiGravityFlex justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                    }}
                  >
                    <Dashboard />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {language === 'zh-TW' ? '儀表板導覽' : 'Dashboard Navigation'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'zh-TW' ? '選擇您要訪問的儀表板' : 'Select the dashboard you want to access'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={handleBackToHome}
                    className="back-button"
                  >
                    {language === 'zh-TW' ? '返回首頁' : 'Back to Home'}
                  </Button>
                  <Chip
                    label={language === 'zh-TW' ? '繁體中文' : 'English'}
                    onClick={handleLanguageToggle}
                    sx={{ cursor: 'pointer' }}
                    icon={<Language />}
                  />
                </Stack>
              </AntiGravityFlex>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box className="start-content">
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Fade in={mounted} timeout={1000}>
            <Box className="welcome-section">
              <Stack spacing={3} textAlign="center">
                <Typography
                  variant="h3"
                  className="welcome-title"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00FFFF 0%, #7B68EE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {language === 'zh-TW' ? '歡迎來到儀表板導覽' : 'Welcome to Dashboard Navigation'}
                </Typography>
                <Typography
                  variant="h6"
                  className="welcome-subtitle"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    color: 'text.secondary',
                    maxWidth: 800,
                    margin: '0 auto',
                  }}
                >
                  {language === 'zh-TW' ? '選擇一個儀表板開始您的旅程' : 'Choose a dashboard to start your journey'}
                </Typography>
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

          <Divider sx={{ my: 4 }} />

          {/* Dashboard Grid */}
          <AntiGravitySection
            title={language === 'zh-TW' ? '可用儀表板' : 'Available Dashboards'}
            description={language === 'zh-TW' ? '點擊卡片進入相應的儀表板' : 'Click on a card to access the corresponding dashboard'}
            padding={4}
          >
            <AntiGravityGrid
              columns={1}
              responsiveColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
              gap={4}
            >
              {dashboards.map((dashboard, index) => (
                <Slide
                  key={dashboard.id}
                  in={mounted}
                  direction="up"
                  timeout={1000 + index * 100}
                >
                  <Card
                    className="dashboard-card"
                    onClick={() => handleNavigateToDashboard(dashboard.path)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={3}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            background: `linear-gradient(135deg, ${dashboard.color} 0%, ${dashboard.color}99 100%)`,
                          }}
                        >
                          {dashboard.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {dashboard.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dashboard.description}
                          </Typography>
                        </Box>
                        <Button
                          variant="text"
                          endIcon={<ArrowForward />}
                          sx={{
                            alignSelf: 'flex-start',
                            color: dashboard.color,
                            '&:hover': {
                              background: `${dashboard.color}15`,
                            },
                          }}
                        >
                          {language === 'zh-TW' ? '進入' : 'Enter'}
                        </Button>
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
      <Box className="start-footer">
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

export default StartPage;
