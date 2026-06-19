/**
 * Two-Way Data Binding Component
 * 雙向數據綁定組件
 * 
 * 功能：
 * - 嚴格的雙向數據綁定
 * - 類型安全
 * - 響應式更新
 * - 驗證支持
 * - Anti-gravity 設計風格
 * - 雙語支持（繁體中文/英文）
 */

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Switch, Slider, Typography, FormHelperText } from '@mui/material';
import { antiGravitySpacing, antiGravityAnimations } from '@/core/design-tokens/AntiGravityTokens';
import './TwoWayBinding.css';

// ============================================================================
// 類型定義
// ============================================================================

export type BindingType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'switch' | 'slider' | 'textarea';

export interface BindingValue<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface BindingValidator<T = any> {
  (value: T): string | null | Promise<string | null>;
}

export interface BindingOptions<T = any> {
  /** 初始值 */
  initialValue: T;
  /** 驗證器 */
  validator?: BindingValidator<T>;
  /** 是否必填 */
  required?: boolean;
  /** 是否即時驗證 */
  validateOnChange?: boolean;
  /** 變化回調 */
  onChange?: (value: T, previousValue: T) => void;
  /** 錯誤回調 */
  onError?: (error: string | null) => void;
}

export interface TwoWayBindingProps<T = any> {
  /** 綁定類型 */
  type: BindingType;
  /** 標籤 */
  label?: string;
  /** 幫助文本 */
  helperText?: string;
  /** 佔位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只讀 */
  readOnly?: boolean;
  /** 自定義樣式類 */
  className?: string;
  /** 語言 */
  language?: 'zh-TW' | 'en';
  /** 選項（用於 select） */
  options?: Array<{ value: T; label: string }>;
  /** 最小值（用於 number/slider） */
  min?: number;
  /** 最大值（用於 number/slider） */
  max?: number;
  /** 步長（用於 slider） */
  step?: number;
  /** 行數（用於 textarea） */
  rows?: number;
}

// ============================================================================
// Two-Way Binding Hook
// ============================================================================

export function useTwoWayBinding<T = any>(options: BindingOptions<T>) {
  const {
    initialValue,
    validator,
    required = false,
    validateOnChange = false,
    onChange,
    onError,
  } = options;

  const [binding, setBinding] = useState<BindingValue<T>>({
    value: initialValue,
    touched: false,
    dirty: false,
  });

  const [isValidating, setIsValidating] = useState(false);
  const previousValueRef = useRef(initialValue);

  // 驗證函數
  const validate = useCallback(async (value: T): Promise<string | null> => {
    // 檢查必填
    if (required && (value === null || value === undefined || value === '')) {
      return language === 'zh-TW' ? '此欄位為必填' : 'This field is required';
    }

    // 執行自定義驗證
    if (validator) {
      return await validator(value);
    }

    return null;
  }, [required, validator]);

  // 更新值
  const setValue = useCallback(async (newValue: T) => {
    const previousValue = previousValueRef.current;
    previousValueRef.current = newValue;

    setBinding(prev => ({
      ...prev,
      value: newValue,
      dirty: prev.value !== newValue,
    }));

    // 變化回調
    onChange?.(newValue, previousValue);

    // 即時驗證
    if (validateOnChange) {
      setIsValidating(true);
      const error = await validate(newValue);
      setBinding(prev => ({ ...prev, error }));
      onError?.(error);
      setIsValidating(false);
    }
  }, [validateOnChange, validate, onChange, onError]);

  // 觸摸
  const setTouched = useCallback(async () => {
    setBinding(prev => ({ ...prev, touched: true }));

    // 觸摸時驗證
    setIsValidating(true);
    const error = await validate(binding.value);
    setBinding(prev => ({ ...prev, error }));
    onError?.(error);
    setIsValidating(false);
  }, [binding.value, validate, onError]);

  // 重置
  const reset = useCallback(() => {
    setBinding({
      value: initialValue,
      touched: false,
      dirty: false,
    });
    previousValueRef.current = initialValue;
  }, [initialValue]);

  // 手動驗證
  const manualValidate = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    const error = await validate(binding.value);
    setBinding(prev => ({ ...prev, error, touched: true }));
    onError?.(error);
    setIsValidating(false);
    return error === null;
  }, [binding.value, validate, onError]);

  return {
    binding,
    setValue,
    setTouched,
    reset,
    validate: manualValidate,
    isValidating,
    isValid: !binding.error,
  };
}

// ============================================================================
// Two-Way Binding 組件
// ============================================================================

export const TwoWayBinding = <T extends any>({
  type,
  label,
  helperText,
  placeholder,
  disabled = false,
  readOnly = false,
  className = '',
  language = 'zh-TW',
  options = [],
  min,
  max,
  step = 1,
  rows = 4,
  ...bindingProps
}: TwoWayBindingProps<T> & { binding: ReturnType<typeof useTwoWayBinding> }) => {
  const { binding, setValue, setTouched } = bindingProps.binding;

  // 處理變化
  const handleChange = useCallback((event: React.ChangeEvent<any>) => {
    let newValue: any;

    switch (type) {
      case 'number':
        newValue = event.target.value === '' ? '' : Number(event.target.value);
        break;
      case 'checkbox':
        newValue = event.target.checked;
        break;
      case 'slider':
        newValue = Number(event.target.value);
        break;
      default:
        newValue = event.target.value;
    }

    setValue(newValue);
  }, [type, setValue]);

  // 處理模糊
  const handleBlur = useCallback(() => {
    setTouched();
  }, [setTouched]);

  // 渲染輸入組件
  const renderInput = () => {
    const commonProps = {
      disabled,
      error: !!binding.error,
      helperText: binding.error || helperText,
      onBlur: handleBlur,
      className: `two-way-binding two-way-binding--${type} ${className}`,
    };

    switch (type) {
      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={label}
            placeholder={placeholder}
            value={binding.value}
            onChange={handleChange}
            multiline
            rows={rows}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: `all ${antiGravityAnimations.duration.normal} ${antiGravityAnimations.easing.easeOut}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,255,255, 0.2)',
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,255,255, 0.3)',
                },
              },
            }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth {...commonProps}>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
              label={label}
              value={binding.value}
              onChange={handleChange}
              disabled={disabled}
              sx={{
                transition: `all ${antiGravityAnimations.duration.normal} ${antiGravityAnimations.easing.easeOut}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={binding.value}
                onChange={handleChange}
                disabled={disabled}
                sx={{
                  transition: `all ${antiGravityAnimations.duration.fast} ${antiGravityAnimations.easing.easeOut}`,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            }
            label={label}
          />
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={binding.value}
                onChange={handleChange}
                disabled={disabled}
                sx={{
                  transition: `all ${antiGravityAnimations.duration.fast} ${antiGravityAnimations.easing.easeOut}`,
                }}
              />
            }
            label={label}
          />
        );

      case 'slider':
        return (
          <Box sx={{ width: '100%', padding: antiGravitySpacing[2] }}>
            {label && (
              <Typography gutterBottom>
                {label}: {binding.value}
              </Typography>
            )}
            <Slider
              value={binding.value}
              onChange={handleChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              sx={{
                transition: `all ${antiGravityAnimations.duration.normal} ${antiGravityAnimations.easing.easeOut}`,
              }}
            />
            {helperText && (
              <FormHelperText>{helperText}</FormHelperText>
            )}
          </Box>
        );

      default:
        return (
          <TextField
            {...commonProps}
            label={label}
            placeholder={placeholder}
            type={type}
            value={binding.value}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: `all ${antiGravityAnimations.duration.normal} ${antiGravityAnimations.easing.easeOut}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,255,255, 0.2)',
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,255,255, 0.3)',
                },
              },
            }}
          />
        );
    }
  };

  return <Box>{renderInput()}</Box>;
};

// ============================================================================
// Form 組件 - 表單容器
// ============================================================================

export interface FormProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 提交回調 */
  onSubmit?: (event: React.FormEvent) => void | Promise<void>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定義樣式類 */
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  disabled = false,
  className = '',
}) => {
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit?.(event);
  }, [onSubmit]);

  return (
    <form
      className={`two-way-binding-form ${className}`}
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: antiGravitySpacing[3],
      }}
    >
      {children}
    </form>
  );
};

// ============================================================================
// 導出
// ============================================================================

export default {
  TwoWayBinding,
  useTwoWayBinding,
  Form,
};
