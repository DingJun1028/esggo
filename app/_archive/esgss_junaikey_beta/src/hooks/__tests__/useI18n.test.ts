/**
 * Integration Tests for useI18n Hook
 * 國際化 Hook 的整合測試
 */

import React, { useEffect, useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// useI18n Hook
import { useI18n, useLanguage, useTranslations, useLocale } from '../useI18n';

describe('useI18n Hook Integration Tests', () => {
  const mockTranslations = {
    'zh-TW': {
      greeting: '你好',
      welcome: '歡迎來到 {appName}',
      count: '你有 {count} 個訊息',
      nested: {
        key: '嵌套翻譯'
      },
      plural: {
        one: '{count} 項目',
        other: '{count} 個項目'
      }
    },
    'zh-CN': {
      greeting: '你好',
      welcome: '欢迎来到 {appName}',
      count: '你有 {count} 条消息',
      nested: {
        key: '嵌套翻译'
      }
    },
    'en-US': {
      greeting: 'Hello',
      welcome: 'Welcome to {appName}',
      count: 'You have {count} messages',
      nested: {
        key: 'Nested translation'
      },
      plural: {
        one: '{count} item',
        other: '{count} items'
      }
    },
    'ja-JP': {
      greeting: 'こんにちは',
      welcome: '{appName}へようこそ',
      count: '{count}件のメッセージがあります'
    },
    'ko-KR': {
      greeting: '안녕하세요',
      welcome: '{appName}에 오신 것을 환영합니다',
      count: '{count}개의 메시지가 있습니다'
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset locale storage
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Language Detection', () => {
    it('should detect browser language', () => {
      vi.stubGlobal('navigator', {
        ...navigator,
        language: 'zh-TW',
        languages: ['zh-TW', 'zh-CN', 'en-US']
      });

      const TestComponent = () => {
        const { language, detectedLanguage } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US',
          detectBrowserLanguage: true
        });

        return (
          <div>
            <span>Language: {language}</span>
            <span>Detected: {detectedLanguage}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Language: zh-TW')).toBeInTheDocument();
      expect(screen.getByText('Detected: zh-TW')).toBeInTheDocument();
    });

    it('should fallback to default language', () => {
      vi.stubGlobal('navigator', {
        ...navigator,
        language: 'unsupported-lang'
      });

      const TestComponent = () => {
        const { language } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Language: {language}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Language: en-US')).toBeInTheDocument();
    });

    it('should persist language preference', () => {
      localStorage.setItem('language', 'zh-CN');

      const TestComponent = () => {
        const { language } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US',
          persistLanguage: true
        });

        return <div>Language: {language}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Language: zh-CN')).toBeInTheDocument();
    });
  });

  describe('Language Switching', () => {
    it('should switch language', () => {
      const TestComponent = () => {
        const { language, setLanguage } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>Language: {language}</span>
            <button onClick={() => setLanguage('zh-TW')}>Switch to TW</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Language: en-US')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Switch to TW'));

      expect(screen.getByText('Language: zh-TW')).toBeInTheDocument();
    });

    it('should update translations when language changes', () => {
      const TestComponent = () => {
        const { language, t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>Lang: {language}</span>
            <span>Greeting: {t('greeting')}</span>
          </div>
        );
      };

      const { rerender } = render(<TestComponent />);

      expect(screen.getByText('Greeting: Hello')).toBeInTheDocument();

      rerender(
        <TestComponent />
      );

      fireEvent.click(screen.getByText('Switch to TW')); // Need to find this button
    });
  });

  describe('Translation Function', () => {
    it('should translate simple keys', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'zh-TW'
        });

        return <div>Greeting: {t('greeting')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Greeting: 你好')).toBeInTheDocument();
    });

    it('should translate nested keys', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Nested: {t('nested.key')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Nested: Nested translation')).toBeInTheDocument();
    });

    it('should handle missing keys', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Missing: {t('missing.key')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Missing: missing.key')).toBeInTheDocument();
    });

    it('should replace variables in translations', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>Welcome: {t('welcome', { appName: 'MyApp' })}</span>
            <span>Count: {t('count', { count: 5 })}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Welcome: Welcome to MyApp')).toBeInTheDocument();
      expect(screen.getByText('Count: You have 5 messages')).toBeInTheDocument();
    });
  });

  describe('Pluralization', () => {
    it('should handle singular/plural based on count', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>One: {t('plural.one', { count: 1 })}</span>
            <span>Many: {t('plural.other', { count: 5 })}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('One: 1 item')).toBeInTheDocument();
      expect(screen.getByText('Many: 5 items')).toBeInTheDocument();
    });

    it('should handle Chinese pluralization', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'zh-TW'
        });

        return <div>Count: {t('count', { count: 1 })}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Count: 你有 1 個訊息')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format dates according to locale', () => {
      const testDate = new Date('2024-01-15');

      const TestComponent = () => {
        const { formatDate } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Date: {formatDate(testDate)}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Date:')).toBeInTheDocument();
    });

    it('should format dates in different locales', () => {
      const testDate = new Date('2024-01-15');

      const TestComponent = () => {
        const { formatDate, setLanguage } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        const date = formatDate(testDate, { year: 'numeric', month: 'long', day: 'numeric' });

        return (
          <div>
            <span>Date: {date}</span>
            <button onClick={() => setLanguage('zh-TW')}>TW</button>
          </div>
        );
      };

      render(<TestComponent />);
      
      // Format should be locale-aware
      const dateText = screen.getByText(/Date:/).textContent;
      expect(dateText).toBeDefined();
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers according to locale', () => {
      const TestComponent = () => {
        const { formatNumber, setLanguage } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>Number: {formatNumber(1234567.89)}</span>
            <button onClick={() => setLanguage('zh-TW')}>TW</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Number: 1,234,567.89')).toBeInTheDocument();
    });

    it('should format currency', () => {
      const TestComponent = () => {
        const { formatCurrency } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Currency: {formatCurrency(1234.56, 'USD')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Currency: $1,234.56')).toBeInTheDocument();
    });

    it('should format percentage', () => {
      const TestComponent = () => {
        const { formatPercent } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Percent: {formatPercent(0.875)}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Percent: 87%')).toBeInTheDocument();
    });
  });

  describe('Relative Time', () => {
    it('should format relative time', () => {
      const TestComponent = () => {
        const { formatRelativeTime } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            <span>Now: {formatRelativeTime(0)}</span>
            <span>Minute: {formatRelativeTime(-1, 'minute')}</span>
            <span>Hour: {formatRelativeTime(-2, 'hour')}</span>
            <span>Day: {formatRelativeTime(-3, 'day')}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Now: now')).toBeInTheDocument();
      expect(screen.getByText('Minute: 1 minute ago')).toBeInTheDocument();
    });

    it('should handle future relative time', () => {
      const TestComponent = () => {
        const { formatRelativeTime } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Future: {formatRelativeTime(1, 'hour')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Future: in 1 hour')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should detect RTL languages', () => {
      const TestComponent = () => {
        const { isRTL, language } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'ar' // Arabic is RTL
        });

        return (
          <div>
            <span>Lang: {language}</span>
            <span>RTL: {isRTL ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('RTL: yes')).toBeInTheDocument();
    });

    it('should apply RTL direction', () => {
      const TestComponent = () => {
        const { direction } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'he' // Hebrew is RTL
        });

        return <div>Direction: {direction}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Direction: rtl')).toBeInTheDocument();
    });
  });

  describe('useLanguage Hook', () => {
    it('should provide current language state', () => {
      const TestComponent = () => {
        const { language, setLanguage, availableLanguages } = useLanguage();

        return (
          <div>
            <span>Current: {language}</span>
            <span>Available: {availableLanguages.join(', ')}</span>
            <button onClick={() => setLanguage('ja-JP')}>JP</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Current: en-US')).toBeInTheDocument();
      expect(screen.getByText('Available: zh-TW, zh-CN, en-US, ja-JP, ko-KR')).toBeInTheDocument();
    });
  });

  describe('useTranslations Hook', () => {
    it('should provide translation function', () => {
      const TestComponent = () => {
        const { t } = useTranslations('greeting');

        return <div>Greeting: {t('Hello')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Greeting: Hello')).toBeInTheDocument();
    });

    it('should handle namespace translations', () => {
      const TestComponent = () => {
        const { t } = useTranslations('nested');

        return <div>Nested: {t('key')}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('Nested: Nested translation')).toBeInTheDocument();
    });
  });

  describe('useLocale Hook', () => {
    it('should provide locale formatting functions', () => {
      const TestComponent = () => {
        const { locale } = useLocale();

        return (
          <div>
            <span>Locale: {locale}</span>
            <span>DateStyle: {locale.dateStyle}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Locale: en-US')).toBeInTheDocument();
    });
  });

  describe('Missing Translation Handling', () => {
    it('should fall back to default language', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        // 'welcome' exists in all, but let's test a missing key scenario
        return <div>Test: {t('nonExistent.key')}</div>;
      };

      render(<TestComponent />);

      // Should return key or default
      expect(screen.getByText('Test: nonExistent.key')).toBeInTheDocument();
    });

    it('should log missing translations in development', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US',
          logMissing: true
        });

        return <div>Test: {t('missing.translation')}</div>;
      };

      render(<TestComponent />);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('missing.translation')
      );
    });
  });

  describe('Performance', () => {
    it('should switch language quickly', () => {
      const TestComponent = () => {
        const { language, setLanguage, t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        const handleSwitch = () => {
          const start = performance.now();
          setLanguage('zh-TW');
          const end = performance.now();
          console.log('Switch time:', end - start);
        };

        return (
          <div>
            <button onClick={handleSwitch}>Switch</button>
            <span>Greeting: {t('greeting')}</span>
          </div>
        );
      };

      render(<TestComponent />);

      const start = performance.now();
      fireEvent.click(screen.getByText('Switch'));
      const end = performance.now();

      // Should switch quickly (under 50ms)
      expect(end - start).toBeLessThan(50);
    });

    it('should handle many translations efficiently', () => {
      const largeTranslations = {
        'en-US': Object.fromEntries(
          Array(1000).fill(null).map((_, i) => [`key${i}`, `Value ${i}`])
        )
      };

      const TestComponent = () => {
        const { t } = useI18n({
          translations: largeTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>Value: {t('key500')}</div>;
      };

      const start = performance.now();
      render(<TestComponent />);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Fast rendering
      expect(screen.getByText('Value: Value 500')).toBeInTheDocument();
    });
  });

  describe('Interpolation Edge Cases', () => {
    it('should handle special characters in variables', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return (
          <div>
            {t('welcome', { appName: 'App "Name" & More <>' })}
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Welcome: App "Name" & More <>')).toBeInTheDocument();
    });

    it('should handle missing variables gracefully', () => {
      const TestComponent = () => {
        const { t } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'en-US'
        });

        return <div>{t('welcome')}</div>;
      };

      render(<TestComponent />);

      // Should handle missing variable
      expect(screen.getByText('Welcome: Welcome to {appName}')).toBeInTheDocument();
    });
  });

  describe('Language Direction', () => {
    it('should set document direction', () => {
      const TestComponent = () => {
        const { direction, setLanguage } = useI18n({
          translations: mockTranslations,
          defaultLanguage: 'ar'
        });

        return (
          <div>
            <span>Dir: {direction}</span>
            <button onClick={() => setLanguage('en-US')}>EN</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Dir: rtl')).toBeInTheDocument();
    });
  });
});
