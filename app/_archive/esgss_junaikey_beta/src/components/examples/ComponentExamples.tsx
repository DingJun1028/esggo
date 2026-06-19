/**
 * Anti-gravity Design System - Component Examples
 * 反重力設計系統 - 組件使用示例
 * 
 * 展示如何組合使用所有 Anti-gravity 設計組件
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  UUIDDisplay,
  UUIDCard,
  UUIDList,
} from '@/components/ui/UUIDDisplay/UUIDDisplay';
import {
  AntiGravityLayout,
  AntiGravityGrid,
  AntiGravityFlex,
  AntiGravityContainer,
  AntiGravitySection,
} from '@/components/layout/AntiGravityLayout/AntiGravityLayout';
import {
  TwoWayBinding,
  useTwoWayBinding,
  Form,
} from '@/components/data-binding/TwoWayBinding/TwoWayBinding';
import { UUIDUtil, StartEndMatrixBuilder, StartEndMatrixExecutor } from '@/core';
import { tExtended } from '@/i18n/translations-extended';
import './ComponentExamples.css';

// ============================================================================
// 示例 1：用戶資料卡片
// ============================================================================

export const UserProfileCardExample: React.FC = () => {
  const userId = UUIDUtil.generate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

  return (
    <Card className="floating-card">
      <CardHeader
        avatar={<Avatar>U</Avatar>}
        title="用戶資料"
        subheader="個人信息展示"
      />
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              用戶 ID
            </Typography>
            <UUIDDisplay
              uuid={userId}
              mode="short"
              showLabel={false}
              language={language}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              會話 ID
            </Typography>
            <UUIDDisplay
              uuid={UUIDUtil.generate()}
              mode="short"
              showLabel={false}
              language={language}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={language === 'zh-TW' ? '繁體中文' : 'English'}
              onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
              sx={{ cursor: 'pointer' }}
            />
            <Chip label="已驗證" color="success" />
            <Chip label="活躍" color="primary" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 示例 2：產品列表
// ============================================================================

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export const ProductListExample: React.FC = () => {
  const products: Product[] = [
    {
      id: UUIDUtil.generate(),
      name: '產品 A',
      description: '高品質產品 A',
      price: 100,
      category: '電子',
    },
    {
      id: UUIDUtil.generate(),
      name: '產品 B',
      description: '高品質產品 B',
      price: 200,
      category: '家居',
    },
    {
      id: UUIDUtil.generate(),
      name: '產品 C',
      description: '高品質產品 C',
      price: 300,
      category: '服飾',
    },
  ];

  return (
    <AntiGravitySection
      title="產品列表"
      description="展示所有可用產品"
      padding={3}
    >
      <AntiGravityGrid
        columns={1}
        responsiveColumns={{ sm: 2, md: 3, lg: 4 }}
        gap={3}
      >
        {products.map((product) => (
          <Card key={product.id} className="floating-card">
            <CardHeader
              title={product.name}
              subheader={`$${product.price}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {product.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label={product.category} size="small" />
                <UUIDDisplay
                  uuid={product.id}
                  mode="compact"
                  showLabel={false}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </AntiGravityGrid>
    </AntiGravitySection>
  );
};

// ============================================================================
// 示例 3：註冊表單
// ============================================================================

export const RegistrationFormExample: React.FC = () => {
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

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

  const passwordBinding = useTwoWayBinding({
    initialValue: '',
    required: true,
    validateOnChange: true,
    validator: (value) => {
      if (value.length < 8) {
        return language === 'zh-TW' ? '密碼至少需要 8 個字符' : 'Password must be at least 8 characters';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('表單提交:', {
      name: nameBinding.binding.value,
      email: emailBinding.binding.value,
      age: ageBinding.binding.value,
      agree: agreeBinding.binding.value,
    });
  };

  return (
    <Card className="floating-card">
      <CardHeader
        title={language === 'zh-TW' ? '註冊表單' : 'Registration Form'}
        subheader={language === 'zh-TW' ? '創建新帳戶' : 'Create new account'}
        action={
          <Chip
            label={language === 'zh-TW' ? '繁體中文' : 'English'}
            onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
            sx={{ cursor: 'pointer' }}
          />
        }
      />
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TwoWayBinding
              type="text"
              label={language === 'zh-TW' ? '名稱' : 'Name'}
              placeholder={language === 'zh-TW' ? '請輸入您的名稱' : 'Enter your name'}
              binding={nameBinding}
              language={language}
            />
            <TwoWayBinding
              type="email"
              label={language === 'zh-TW' ? '電子郵件' : 'Email'}
              placeholder={language === 'zh-TW' ? '請輸入您的電子郵件' : 'Enter your email'}
              binding={emailBinding}
              language={language}
            />
            <TwoWayBinding
              type="password"
              label={language === 'zh-TW' ? '密碼' : 'Password'}
              placeholder={language === 'zh-TW' ? '請輸入您的密碼' : 'Enter your password'}
              binding={passwordBinding}
              language={language}
            />
            <TwoWayBinding
              type="slider"
              label={language === 'zh-TW' ? '年齡' : 'Age'}
              min={0}
              max={120}
              step={1}
              binding={ageBinding}
              language={language}
            />
            <TwoWayBinding
              type="checkbox"
              label={language === 'zh-TW' ? '我同意條款和條件' : 'I agree to the terms and conditions'}
              binding={agreeBinding}
              language={language}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!nameBinding.isValid || !emailBinding.isValid || !passwordBinding.isValid || !agreeBinding.binding.value}
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
              {language === 'zh-TW' ? '註冊' : 'Register'}
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 示例 4：數據處理流程
// ============================================================================

export const DataProcessingFlowExample: React.FC = () => {
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  const processFlow = async () => {
    setStatus('processing');

    try {
      // 創建矩陣
      const matrix = new StartEndMatrixBuilder<string, string>()
        .setName('數據處理流程')
        .setDescription('三元一體數據結構示例')
        .setLanguage(language)
        .withStart('用戶輸入數據')
        .withMatrixNode('validate', '驗證數據', [])
        .withMatrixNode('transform', '轉換數據格式', [])
        .withMatrixNode('enrich', '豐富數據', [])
        .withEnd('輸出結果', [])
        .build();

      // 模擬處理
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('completed');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader
        title={language === 'zh-TW' ? '數據處理流程' : 'Data Processing Flow'}
        subheader={language === 'zh-TW' ? '三元一體數據結構' : 'Trinity Data Structure'}
        action={
          <Chip
            label={language === 'zh-TW' ? '繁體中文' : 'English'}
            onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
            sx={{ cursor: 'pointer' }}
          />
        }
      />
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {language === 'zh-TW' ? '狀態' : 'Status'}
            </Typography>
            <Chip
              label={
                status === 'idle' ? (language === 'zh-TW' ? '待處理' : 'Idle') :
                status === 'processing' ? (language === 'zh-TW' ? '處理中' : 'Processing') :
                status === 'completed' ? (language === 'zh-TW' ? '已完成' : 'Completed') :
                (language === 'zh-TW' ? '錯誤' : 'Error')
              }
              color={
                status === 'idle' ? 'default' :
                status === 'processing' ? 'info' :
                status === 'completed' ? 'success' :
                'error'
              }
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {language === 'zh-TW' ? '流程節點' : 'Flow Nodes'}
            </Typography>
            <Stack spacing={1}>
              <Paper
                sx={{
                  padding: 2,
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {language === 'zh-TW' ? '起始點' : 'Start'}
                </Typography>
                <Typography variant="body2">
                  {language === 'zh-TW' ? '用戶輸入數據' : 'User Input Data'}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  padding: 2,
                  background: 'rgba(33, 150, 243, 0.1)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {language === 'zh-TW' ? '處理過程' : 'Process'}
                </Typography>
                <Typography variant="body2">
                  {language === 'zh-TW' ? '驗證 → 轉換 → 豐富' : 'Validate → Transform → Enrich'}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  padding: 2,
                  background: 'rgba(156, 39, 176, 0.1)',
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {language === 'zh-TW' ? '終點' : 'End'}
                </Typography>
                <Typography variant="body2">
                  {language === 'zh-TW' ? '輸出結果' : 'Output Result'}
                </Typography>
              </Paper>
            </Stack>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={processFlow}
            disabled={status === 'processing'}
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
            {status === 'processing' ? (language === 'zh-TW' ? '處理中...' : 'Processing...') :
             language === 'zh-TW' ? '開始處理' : 'Start Processing'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 示例 5：完整頁面
// ============================================================================

export const CompletePageExample: React.FC = () => {
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

  return (
    <Box className="complete-page-example">
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
            onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip label="v1.0.0" />
        </Stack>
      </AntiGravitySection>

      {/* 內容區域 */}
      <AntiGravityContainer padding={3}>
        <AntiGravityGrid
          columns={1}
          responsiveColumns={{ md: 2, lg: 3 }}
          gap={3}
        >
          <UserProfileCardExample />
          <RegistrationFormExample />
          <DataProcessingFlowExample />
        </AntiGravityGrid>
      </AntiGravityContainer>

      {/* 產品列表 */}
      <ProductListExample />
    </Box>
  );
};

// ============================================================================
// 導出
// ============================================================================

export default {
  UserProfileCardExample,
  ProductListExample,
  RegistrationFormExample,
  DataProcessingFlowExample,
  CompletePageExample,
};
