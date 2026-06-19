/**
 * Anti-gravity Design Demo Page
 * 反重力設計演示頁面
 * 
 * 功能：
 * - 展示所有 Anti-gravity 設計組件
 * - 響應式布局
 * - 雙語支持（繁體中文/英文）
 * - UUID 顯示
 * - 雙向數據綁定
 * - Start-End Matrix 數據結構
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Stack,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { useOmniTheme } from '@/omni/infrastructure/ui/OmniThemeProvider';
import { UUIDDisplay, UUIDCard, UUIDList } from '@/components/ui/UUIDDisplay/UUIDDisplay';
import {
  AntiGravityLayout,
  AntiGravityGrid,
  AntiGravityFlex,
  AntiGravityContainer,
  AntiGravitySection,
} from '@/components/layout/AntiGravityLayout/AntiGravityLayout';
import { TwoWayBinding, useTwoWayBinding, Form } from '@/components/data-binding/TwoWayBinding/TwoWayBinding';
import { UUIDUtil, StartEndMatrixBuilder, StartEndMatrixExecutor, type UUID } from '@/core/data-structures/StartEndMatrix';
import { tExtended } from '@/i18n/translations-extended';
import './AntiGravityDemoPage.css';

// ============================================================================
// 類型定義
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ============================================================================
// Tab Panel 組件
// ============================================================================

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`antigravity-tabpanel-${index}`}
      aria-labelledby={`antigravity-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ============================================================================
// Anti-gravity Demo Page 組件
// ============================================================================

export const AntiGravityDemoPage: React.FC = () => {
  const { theme } = useOmniTheme();
  const [tabValue, setTabValue] = useState(0);
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

  // 生成示例 UUID
  const exampleUUID = useMemo(() => UUIDUtil.generate(), []);
  const exampleUUIDs = useMemo(() => [
    { uuid: UUIDUtil.generate(), label: '用戶 ID', description: '唯一用戶標識符' },
    { uuid: UUIDUtil.generate(), label: '會話 ID', description: '當前會話標識符' },
    { uuid: UUIDUtil.generate(), label: '交易 ID', description: '交易記錄標識符' },
  ], []);

  // 雙向數據綁定示例
  const nameBinding = useTwoWayBinding({
    initialValue: '',
    required: true,
    validateOnChange: true,
    validator: (value) => {
      if (value.length < 2) {
        return language === 'zh-TW' ? '名稱至少需要 2 個字符' : 'Name must be at least 2 characters';
      }
      return null;
    },
  });

  const emailBinding = useTwoWayBinding({
    initialValue: '',
    required: true,
    validateOnChange: true,
    validator: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return language === 'zh-TW' ? '請輸入有效的電子郵件' : 'Please enter a valid email';
      }
      return null;
    },
  });

  const ageBinding = useTwoWayBinding({
    initialValue: 25,
    validator: (value) => {
      if (value < 0 || value > 120) {
        return language === 'zh-TW' ? '年齡必須在 0 到 120 之間' : 'Age must be between 0 and 120';
      }
      return null;
    },
  });

  const agreeBinding = useTwoWayBinding({
    initialValue: false,
    required: true,
  });

  // Start-End Matrix 示例
  const matrixExample = useMemo(() => {
    const builder = new StartEndMatrixBuilder<string, string>()
      .setName('用戶註冊流程')
      .setDescription('三元一體數據結構示例')
      .setLanguage(language)
      .withStart('用戶輸入數據')
      .withMatrixNode('logic', '驗證數據', [])
      .withMatrixNode('transform', '轉換數據格式', [])
      .withEnd('創建用戶帳戶', []);

    return builder.build();
  }, [language]);

  // 處理 Tab 變化
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  // 切換語言
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'zh-TW' ? 'en' : 'zh-TW');
  }, []);

  // 處理表單提交
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', {
      name: nameBinding.binding.value,
      email: emailBinding.binding.value,
      age: ageBinding.binding.value,
      agree: agreeBinding.binding.value,
    });
  }, [nameBinding, emailBinding, ageBinding, agreeBinding]);

  return (
    <Box className="anti-gravity-demo-page">
      {/* 頁面標題 */}
      <AntiGravitySection
        title={tExtended('antigravity.title', language)}
        description={tExtended('antigravity.subtitle', language)}
        padding={4}
        background="primary"
        floating={true}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={language === 'zh-TW' ? '繁體中文' : 'English'}
            onClick={toggleLanguage}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <Chip
            label={theme}
            sx={{
              opacity: 0.7,
            }}
          />
        </Stack>
      </AntiGravitySection>

      {/* Tab 導航 */}
      <AntiGravityContainer padding={2}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            marginBottom: 2,
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
            },
          }}
        >
          <Tab label={tExtended('uuid.title', language)} />
          <Tab label={tExtended('matrix.title', language)} />
          <Tab label={tExtended('form.submit', language)} />
          <Tab label={tExtended('layout.grid', language)} />
        </Tabs>
      </AntiGravityContainer>

      {/* Tab Panel 1: UUID Display */}
      <TabPanel value={tabValue} index={0}>
        <AntiGravityContainer padding={3}>
          <Typography variant="h5" gutterBottom>
            {tExtended('uuid.title', language)}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {tExtended('uuid.description', language)}
          </Typography>

          <AntiGravityGrid columns={1} responsiveColumns={{ md: 2, lg: 3 }} gap={3}>
            {/* UUID Display */}
            <Card className="floating-card">
              <CardHeader title="UUID Display" />
              <CardContent>
                <Stack spacing={2}>
                  <UUIDDisplay
                    uuid={exampleUUID}
                    mode="full"
                    language={language}
                  />
                  <UUIDDisplay
                    uuid={exampleUUID}
                    mode="short"
                    language={language}
                  />
                  <UUIDDisplay
                    uuid={exampleUUID}
                    mode="compact"
                    language={language}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* UUID Card */}
            <Card className="floating-card">
              <CardHeader title="UUID Card" />
              <CardContent>
                <UUIDCard
                  uuid={exampleUUID}
                  title="示例 UUID"
                  description="這是一個示例 UUID 卡片"
                  metadata={{
                    '創建時間': new Date().toLocaleString(),
                    '狀態': '有效',
                  }}
                  language={language}
                />
              </CardContent>
            </Card>

            {/* UUID List */}
            <Card className="floating-card">
              <CardHeader title="UUID List" />
              <CardContent>
                <UUIDList
                  uuids={exampleUUIDs}
                  language={language}
                />
              </CardContent>
            </Card>
          </AntiGravityGrid>
        </AntiGravityContainer>
      </TabPanel>

      {/* Tab Panel 2: Start-End Matrix */}
      <TabPanel value={tabValue} index={1}>
        <AntiGravityContainer padding={3}>
          <Typography variant="h5" gutterBottom>
            {tExtended('matrix.title', language)}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {tExtended('matrix.description', language)}
          </Typography>

          <AntiGravityGrid columns={1} responsiveColumns={{ md: 2 }} gap={3}>
            {/* Matrix Info */}
            <Card className="floating-card">
              <CardHeader title="矩陣信息" />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {tExtended('matrix.title', language)}
                    </Typography>
                    <Typography variant="body1">
                      {matrixExample.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      ID
                    </Typography>
                    <UUIDDisplay
                      uuid={matrixExample.id}
                      mode="short"
                      showLabel={false}
                      language={language}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {tExtended('matrix.description', language)}
                    </Typography>
                    <Typography variant="body2">
                      {matrixExample.description}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Matrix Nodes */}
            <Card className="floating-card">
              <CardHeader title="矩陣節點" />
              <CardContent>
                <Stack spacing={2}>
                  {/* Start Node */}
                  <Paper
                    sx={{
                      padding: 2,
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {tExtended('matrix.start', language)}
                    </Typography>
                    <Typography variant="body2">
                      {matrixExample.start.data}
                    </Typography>
                  </Paper>

                  {/* Matrix Nodes */}
                  {matrixExample.matrix.map((node, index) => (
                    <Paper
                      key={node.id}
                      sx={{
                        padding: 2,
                        background: 'rgba(33, 150, 243, 0.1)',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {tExtended('matrix.node', language)} {index + 1}
                      </Typography>
                      <Typography variant="body2">
                        {node.data}
                      </Typography>
                    </Paper>
                  ))}

                  {/* End Node */}
                  <Paper
                    sx={{
                      padding: 2,
                      background: 'rgba(156, 39, 176, 0.1)',
                      border: '1px solid rgba(156, 39, 176, 0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {tExtended('matrix.end', language)}
                    </Typography>
                    <Typography variant="body2">
                      {matrixExample.end.data}
                    </Typography>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          </AntiGravityGrid>
        </AntiGravityContainer>
      </TabPanel>

      {/* Tab Panel 3: Form */}
      <TabPanel value={tabValue} index={2}>
        <AntiGravityContainer padding={3}>
          <Typography variant="h5" gutterBottom>
            {tExtended('form.submit', language)}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            雙向數據綁定表單示例
          </Typography>

          <Card className="floating-card">
            <CardContent>
              <Form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Name Input */}
                  <Box>
                    <TwoWayBinding
                      type="text"
                      label="名稱"
                      placeholder="請輸入您的名稱"
                      binding={nameBinding}
                      language={language}
                    />
                  </Box>

                  {/* Email Input */}
                  <Box>
                    <TwoWayBinding
                      type="email"
                      label="電子郵件"
                      placeholder="請輸入您的電子郵件"
                      binding={emailBinding}
                      language={language}
                    />
                  </Box>

                  {/* Age Slider */}
                  <Box>
                    <TwoWayBinding
                      type="slider"
                      label="年齡"
                      min={0}
                      max={120}
                      step={1}
                      binding={ageBinding}
                      language={language}
                    />
                  </Box>

                  {/* Agree Checkbox */}
                  <Box>
                    <TwoWayBinding
                      type="checkbox"
                      label="我同意條款和條件"
                      binding={agreeBinding}
                      language={language}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!nameBinding.isValid || !emailBinding.isValid || !agreeBinding.binding.value}
                    sx={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,255,255, 0.4)',
                      },
                    }}
                  >
                    {tExtended('form.submit', language)}
                  </Button>
                </Stack>
              </Form>
            </CardContent>
          </Card>
        </AntiGravityContainer>
      </TabPanel>

      {/* Tab Panel 4: Layout */}
      <TabPanel value={tabValue} index={3}>
        <AntiGravityContainer padding={3}>
          <Typography variant="h5" gutterBottom>
            {tExtended('layout.grid', language)}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            響應式布局示例
          </Typography>

          <AntiGravityGrid columns={1} responsiveColumns={{ sm: 2, md: 3, lg: 4 }} gap={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card
                key={item}
                className="floating-card"
                sx={{
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" color="text.secondary">
                  {item}
                </Typography>
              </Card>
            ))}
          </AntiGravityGrid>
        </AntiGravityContainer>
      </TabPanel>
    </Box>
  );
};

export default AntiGravityDemoPage;
