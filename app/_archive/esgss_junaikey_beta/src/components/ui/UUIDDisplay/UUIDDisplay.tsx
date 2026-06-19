/**
 * UUID Display Component
 * UUID 顯示組件
 * 
 * 功能：
 * - 顯示 UUID（完整或簡短格式）
 * - 支持複製到剪貼板
 * - 支持雙語（繁體中文/英文）
 * - Anti-gravity 設計風格
 * - 響應式布局
 * - 無障礙支持
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { UUIDUtil, type UUID } from '@/core/data-structures/StartEndMatrix';
import { t } from '@/i18n/translations';
import './UUIDDisplay.css';

// ============================================================================
// 類型定義
// ============================================================================

export interface UUIDDisplayProps {
  /** UUID 值 */
  uuid: UUID;
  /** 顯示模式 */
  mode?: 'full' | 'short' | 'compact';
  /** 是否大寫 */
  uppercase?: boolean;
  /** 是否顯示標籤 */
  showLabel?: boolean;
  /** 自定義標籤 */
  label?: string;
  /** 是否可複製 */
  copyable?: boolean;
  /** 是否顯示圖示 */
  showIcon?: boolean;
  /** 自定義樣式類 */
  className?: string;
  /** 語言 */
  language?: 'zh-TW' | 'en';
  /** 複製成功回調 */
  onCopy?: (uuid: UUID) => void;
}

// ============================================================================
// UUID Display 組件
// ============================================================================

export const UUIDDisplay: React.FC<UUIDDisplayProps> = ({
  uuid,
  mode = 'full',
  uppercase = false,
  showLabel = true,
  label,
  copyable = true,
  showIcon = true,
  className = '',
  language = 'zh-TW',
  onCopy,
}) => {
  // 狀態
  const [copied, setCopied] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // 格式化 UUID
  const formattedUUID = useMemo(() => {
    return UUIDUtil.format(uuid, {
      short: mode === 'short' || mode === 'compact',
      uppercase,
    });
  }, [uuid, mode, uppercase]);

  // 複製 UUID
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setShowSnackbar(true);
      onCopy?.(uuid);

      // 2秒後重置複製狀態
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy UUID:', error);
    }
  }, [uuid, onCopy]);

  // 關閉 Snackbar
  const handleCloseSnackbar = useCallback(() => {
    setShowSnackbar(false);
  }, []);

  // 獲取標籤文本
  const labelText = useMemo(() => {
    if (label) return label;
    return language === 'zh-TW' ? 'UUID' : 'UUID';
  }, [label, language]);

  // 獲取複製提示文本
  const copyTooltipText = useMemo(() => {
    if (copied) {
      return language === 'zh-TW' ? '已複製！' : 'Copied!';
    }
    return language === 'zh-TW' ? '複製 UUID' : 'Copy UUID';
  }, [copied, language]);

  // 獲取成功提示文本
  const successMessage = useMemo(() => {
    return language === 'zh-TW' ? 'UUID 已複製到剪貼板' : 'UUID copied to clipboard';
  }, [language]);

  return (
    <>
      <Box
        className={`uuid-display uuid-display--${mode} ${className}`}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          padding: mode === 'compact' ? '4px 8px' : '8px 12px',
          borderRadius: '8px',
          background: 'rgba(0,255,255, 0.08)',
          border: '1px solid rgba(0,255,255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(0,255,255, 0.12)',
            borderColor: 'rgba(0,255,255, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,255,255, 0.2)',
          },
        }}
      >
        {/* 標籤 */}
        {showLabel && mode !== 'compact' && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {labelText}:
          </Typography>
        )}

        {/* UUID 值 */}
        <Typography
          variant={mode === 'compact' ? 'caption' : 'body2'}
          sx={{
            fontFamily: 'monospace',
            color: 'text.primary',
            fontWeight: 500,
            fontSize: mode === 'compact' ? '11px' : '13px',
            letterSpacing: '0.3px',
            wordBreak: 'break-all',
          }}
        >
          {formattedUUID}
        </Typography>

        {/* 複製按鈕 */}
        {copyable && showIcon && (
          <Tooltip title={copyTooltipText} arrow>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                padding: '4px',
                color: copied ? 'success.main' : 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  background: 'rgba(0,255,255, 0.1)',
                },
              }}
              aria-label={copyTooltipText}
            >
              {copied ? (
                <CheckIcon sx={{ fontSize: 16 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 成功提示 */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// ============================================================================
// UUID Card 組件 - 卡片式 UUID 顯示
// ============================================================================

export interface UUIDCardProps {
  /** UUID 值 */
  uuid: UUID;
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 額外信息 */
  metadata?: Record<string, string>;
  /** 語言 */
  language?: 'zh-TW' | 'en';
  /** 自定義樣式類 */
  className?: string;
}

export const UUIDCard: React.FC<UUIDCardProps> = ({
  uuid,
  title,
  description,
  metadata = {},
  language = 'zh-TW',
  className = '',
}) => {
  return (
    <Box
      className={`uuid-card ${className}`}
      sx={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* 標題 */}
      {title && (
        <Typography
          variant="h6"
          sx={{
            marginBottom: '8px',
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      )}

      {/* 描述 */}
      {description && (
        <Typography
          variant="body2"
          sx={{
            marginBottom: '16px',
            color: 'text.secondary',
          }}
        >
          {description}
        </Typography>
      )}

      {/* UUID 顯示 */}
      <UUIDDisplay
        uuid={uuid}
        mode="full"
        showLabel={true}
        copyable={true}
        showIcon={true}
        language={language}
      />

      {/* 元數據 */}
      {Object.keys(metadata).length > 0 && (
        <Box
          sx={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          {Object.entries(metadata).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {key}:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.primary',
                  fontFamily: 'monospace',
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ============================================================================
// UUID List 組件 - 列表式 UUID 顯示
// ============================================================================

export interface UUIDListProps {
  /** UUID 列表 */
  uuids: Array<{
    uuid: UUID;
    label?: string;
    description?: string;
  }>;
  /** 語言 */
  language?: 'zh-TW' | 'en';
  /** 自定義樣式類 */
  className?: string;
}

export const UUIDList: React.FC<UUIDListProps> = ({
  uuids,
  language = 'zh-TW',
  className = '',
}) => {
  return (
    <Box className={`uuid-list ${className}`}>
      {uuids.map((item, index) => (
        <Box
          key={item.uuid}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: index < uuids.length - 1 ? '8px' : 0,
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.8)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            {item.label && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 500,
                  marginBottom: '4px',
                }}
              >
                {item.label}
              </Typography>
            )}
            {item.description && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.tertiary',
                  marginBottom: '4px',
                }}
              >
                {item.description}
              </Typography>
            )}
          </Box>
          <UUIDDisplay
            uuid={item.uuid}
            mode="short"
            showLabel={false}
            copyable={true}
            showIcon={true}
            language={language}
          />
        </Box>
      ))}
    </Box>
  );
};

// ============================================================================
// 導出
// ============================================================================

export default UUIDDisplay;
