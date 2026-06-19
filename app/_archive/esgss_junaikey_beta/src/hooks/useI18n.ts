/**
 * 🌍 I18n Hook - 國際化支援
 * 支援多語言、切換、日期數字格式化
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Globe, ChevronDown, Check } from 'lucide-react';

// ==================== 類型定義 ====================

export type Locale = 'zh-TW' | 'zh-CN' | 'en-US' | 'en-GB' | 'ja-JP' | 'ko-KR';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

export interface TranslationValue {
  key: string;
  value: string;
}

export interface I18nState {
  locale: Locale;
  fallbackLocale: Locale;
  translations: Record<Locale, Record<string, string>>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLocale: (locale: Locale) => void;
  setFallbackLocale: (locale: Locale) => void;
  addTranslations: (locale: Locale, translations: Record<string, string>) => void;
  loadTranslations: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ==================== Locale 配置 ====================

export const LOCALES: Record<Locale, LocaleConfig> = {
  'zh-TW': {
    code: 'zh-TW',
    name: '繁體中文',
    nativeName: '繁體中文',
    dir: 'ltr',
    dateFormat: 'yyyy年MM月dd日',
    timeFormat: 'HH:mm:ss',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  'zh-CN': {
    code: 'zh-CN',
    name: '簡體中文',
    nativeName: '簡體中文',
    dir: 'ltr',
    dateFormat: 'yyyy年MM月dd日',
    timeFormat: 'HH:mm:ss',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US)',
    dir: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'h:mm:ss a',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK)',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  'ja-JP': {
    code: 'ja-JP',
    name: '日本語',
    nativeName: '日本語',
    dir: 'ltr',
    dateFormat: 'yyyy年MM月dd日',
    timeFormat: 'HH:mm:ss',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  'ko-KR': {
    code: 'ko-KR',
    name: '한국어',
    nativeName: '한국어',
    dir: 'ltr',
    dateFormat: 'yyyy년 MM월 dd일',
    timeFormat: 'HH:mm:ss',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
};

// ==================== 預設翻譯 ====================

const DEFAULT_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    // Common
    'common.loading': '載入中...',
    'common.save': '儲存',
    'common.cancel': '取消',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.add': '新增',
    'common.search': '搜尋',
    'common.filter': '篩選',
    'common.submit': '提交',
    'common.reset': '重設',
    'common.confirm': '確認',
    'common.close': '關閉',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.complete': '完成',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.warning': '警告',
    'common.info': '資訊',
    'common.yes': '是',
    'common.no': '否',
    'common.none': '無',
    'common.all': '全部',
    'common.select': '選擇',
    'common.selected': '已選擇',
    'common.required': '必填',
    'common.optional': '選填',
    'common.total': '總計',
    'common.average': '平均',
    'common.percent': '百分比',
    'common.count': '數量',

    // Navigation
    'nav.home': '首頁',
    'nav.dashboard': '儀表板',
    'nav.settings': '設定',
    'nav.profile': '個人資料',
    'nav.logout': '登出',

    // Actions
    'action.retry': '重試',
    'action.skip': '跳過',
    'action.done': '完成',
    'action.undo': '復原',
    'action.redo': '重做',
    'action.copy': '複製',
    'action.paste': '貼上',
    'action.download': '下載',
    'action.upload': '上傳',
    'action.share': '分享',

    // Messages
    'msg.noData': '暫無資料',
    'msg.noResults': '無搜尋結果',
    'msg.saved': '已儲存',
    'msg.deleted': '已刪除',
    'msg.updated': '已更新',
    'msg.somethingWrong': '發生錯誤',
    'msg.networkError': '網路連線失敗',
    'msg.sessionExpired': '工作階段已過期',

    // Time
    'time.justNow': '剛剛',
    'time.minutesAgo': '{{count}} 分鐘前',
    'time.hoursAgo': '{{count}} 小時前',
    'time.daysAgo': '{{count}} 天前',
    'time.weeksAgo': '{{count}} 週前',
    'time.monthsAgo': '{{count}} 個月前',
    'time.yearsAgo': '{{count}} 年前',
  },
  'zh-CN': {
    'common.loading': '加载中...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '新增',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.submit': '提交',
    'common.reset': '重置',
    'common.confirm': '确认',
    'common.close': '关闭',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.complete': '完成',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.warning': '警告',
    'common.info': '資訊',
    'common.yes': '是',
    'common.no': '否',
    'common.none': '無',
    'common.all': '全部',
    'common.select': '選擇',
    'common.selected': '已選擇',
    'common.required': '必填',
    'common.optional': '選填',
    'common.total': '總計',
    'common.average': '平均',
    'common.percent': '百分比',
    'common.count': '數量',
    'nav.home': '首頁',
    'nav.dashboard': '儀表板',
    'nav.settings': '設定',
    'nav.profile': '個人資料',
    'nav.logout': '登出',
    'action.retry': '重試',
    'action.skip': '跳過',
    'action.done': '完成',
    'action.undo': '復原',
    'action.redo': '重做',
    'action.copy': '複製',
    'action.paste': '貼上',
    'action.download': '下載',
    'action.upload': '上傳',
    'action.share': '分享',
    'msg.noData': '暫無資料',
    'msg.noResults': '無搜尋結果',
    'msg.saved': '已儲存',
    'msg.deleted': '已刪除',
    'msg.updated': '已更新',
    'msg.somethingWrong': '發生錯誤',
    'msg.networkError': '網路連線失敗',
    'msg.sessionExpired': '工作階段已過期',
    'time.justNow': '剛剛',
    'time.minutesAgo': '{{count}} 分鐘前',
    'time.hoursAgo': '{{count}} 小時前',
    'time.daysAgo': '{{count}} 天前',
    'time.weeksAgo': '{{count}} 週前',
    'time.monthsAgo': '{{count}} 個月前',
    'time.yearsAgo': '{{count}} 年前',
  },
  'en-US': {
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.complete': 'Complete',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.none': 'None',
    'common.all': 'All',
    'common.select': 'Select',
    'common.selected': 'Selected',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.total': 'Total',
    'common.average': 'Average',
    'common.percent': 'Percent',
    'common.count': 'Count',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'action.retry': 'Retry',
    'action.skip': 'Skip',
    'action.done': 'Done',
    'action.undo': 'Undo',
    'action.redo': 'Redo',
    'action.copy': 'Copy',
    'action.paste': 'Paste',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.share': 'Share',
    'msg.noData': 'No data available',
    'msg.noResults': 'No results found',
    'msg.saved': 'Saved successfully',
    'msg.deleted': 'Deleted successfully',
    'msg.updated': 'Updated successfully',
    'msg.somethingWrong': 'Something went wrong',
    'msg.networkError': 'Network connection failed',
    'msg.sessionExpired': 'Session has expired',
    'time.justNow': 'Just now',
    'time.minutesAgo': '{{count}} minutes ago',
    'time.hoursAgo': '{{count}} hours ago',
    'time.daysAgo': '{{count}} days ago',
    'time.weeksAgo': '{{count}} weeks ago',
    'time.monthsAgo': '{{count}} months ago',
    'time.yearsAgo': '{{count}} years ago',
  },
  'en-GB': {
    // Similar to en-US with UK spelling
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.complete': 'Complete',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.none': 'None',
    'common.all': 'All',
    'common.select': 'Select',
    'common.selected': 'Selected',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.total': 'Total',
    'common.average': 'Average',
    'common.percent': 'Percent',
    'common.count': 'Count',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'action.retry': 'Retry',
    'action.skip': 'Skip',
    'action.done': 'Done',
    'action.undo': 'Undo',
    'action.redo': 'Redo',
    'action.copy': 'Copy',
    'action.paste': 'Paste',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.share': 'Share',
    'msg.noData': 'No data available',
    'msg.noResults': 'No results found',
    'msg.saved': 'Saved successfully',
    'msg.deleted': 'Deleted successfully',
    'msg.updated': 'Updated successfully',
    'msg.somethingWrong': 'Something went wrong',
    'msg.networkError': 'Network connection failed',
    'msg.sessionExpired': 'Session has expired',
    'time.justNow': 'Just now',
    'time.minutesAgo': '{{count}} minutes ago',
    'time.hoursAgo': '{{count}} hours ago',
    'time.daysAgo': '{{count}} days ago',
    'time.weeksAgo': '{{count}} weeks ago',
    'time.monthsAgo': '{{count}} months ago',
    'time.yearsAgo': '{{count}} years ago',
  },
  'ja-JP': {
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.add': '追加',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.submit': '送信',
    'common.reset': 'リセット',
    'common.confirm': '確認',
    'common.close': '閉じる',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.previous': '前へ',
    'common.complete': '完了',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.warning': '警告',
    'common.info': '情報',
    'common.yes': 'はい',
    'common.no': 'いいえ',
    'common.none': 'なし',
    'common.all': 'すべて',
    'common.select': '選択',
    'common.selected': '選択済み',
    'common.required': '必須',
    'common.optional': '任意',
    'common.total': '合計',
    'common.average': '平均',
    'common.percent': 'パーセント',
    'common.count': '数',
    'nav.home': 'ホーム',
    'nav.dashboard': 'ダッシュボード',
    'nav.settings': '設定',
    'nav.profile': 'プロフィール',
    'nav.logout': 'ログアウト',
    'action.retry': '再試行',
    'action.skip': 'スキップ',
    'action.done': '完了',
    'action.undo': '元に戻す',
    'action.redo': 'やり直す',
    'action.copy': 'コピー',
    'action.paste': '貼り付け',
    'action.download': 'ダウンロード',
    'action.upload': 'アップロード',
    'action.share': '共有',
    'msg.noData': 'データがありません',
    'msg.noResults': '検索結果が見つかりません',
    'msg.saved': '保存しました',
    'msg.deleted': '削除しました',
    'msg.updated': '更新しました',
    'msg.somethingWrong': 'エラーが発生しました',
    'msg.networkError': 'ネットワーク接続に失敗しました',
    'msg.sessionExpired': 'セッションが期限切れです',
    'time.justNow': '今',
    'time.minutesAgo': '{{count}}分前',
    'time.hoursAgo': '{{count}}時間前',
    'time.daysAgo': '{{count}}日前',
    'time.weeksAgo': '{{count}}週間前',
    'time.monthsAgo': '{{count}}ヶ月前',
    'time.yearsAgo': '{{count}}年前',
  },
  'ko-KR': {
    'common.loading': '로딩 중...',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.add': '추가',
    'common.search': '검색',
    'common.filter': '필터',
    'common.submit': '제출',
    'common.reset': '초기화',
    'common.confirm': '확인',
    'common.close': '닫기',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.previous': '이전',
    'common.complete': '완료',
    'common.error': '오류',
    'common.success': '성공',
    'common.warning': '경고',
    'common.info': '정보',
    'common.yes': '예',
    'common.no': '아니오',
    'common.none': '없음',
    'common.all': '전체',
    'common.select': '선택',
    'common.selected': '선택됨',
    'common.required': '필수',
    'common.optional': '선택',
    'common.total': '합계',
    'common.average': '평균',
    'common.percent': '백분율',
    'common.count': '수',
    'nav.home': '홈',
    'nav.dashboard': '대시보드',
    'nav.settings': '설정',
    'nav.profile': '프로필',
    'nav.logout': '로그아웃',
    'action.retry': '재시도',
    'action.skip': '건너뛰기',
    'action.done': '완료',
    'action.undo': '실행취소',
    'action.redo': '다시실행',
    'action.copy': '복사',
    'action.paste': '붙여넣기',
    'action.download': '다운로드',
    'action.upload': '업로드',
    'action.share': '공유',
    'msg.noData': '데이터가 없습니다',
    'msg.noResults': '검색 결과가 없습니다',
    'msg.saved': '저장되었습니다',
    'msg.deleted': '삭제되었습니다',
    'msg.updated': '업데이트되었습니다',
    'msg.somethingWrong': '오류가 발생했습니다',
    'msg.networkError': '네트워크 연결에 실패했습니다',
    'msg.sessionExpired': '세션이 만료되었습니다',
    'time.justNow': '방금',
    'time.minutesAgo': '{{count}}분 전',
    'time.hoursAgo': '{{count}}시간 전',
    'time.daysAgo': '{{count}}일 전',
    'time.weeksAgo': '{{count}}주 전',
    'time.monthsAgo': '{{count}}개월 전',
    'time.yearsAgo': '{{count}}년 전',
  },
};

// ==================== Zustand Store ====================

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'zh-TW',
      fallbackLocale: 'en-US',
      translations: DEFAULT_TRANSLATIONS,
      isLoading: false,
      error: null,

      setLocale: locale => {
        set({ locale });
        document.documentElement.lang = locale;
        document.documentElement.dir = LOCALES[locale]?.dir || 'ltr';
      },

      setFallbackLocale: locale => {
        set({ fallbackLocale: locale });
      },

      addTranslations: (locale, translations) => {
        set(state => ({
          translations: {
            ...state.translations,
            [locale]: {
              ...(state.translations[locale] || {}),
              ...translations,
            },
          },
        }));
      },

      loadTranslations: async locale => {
        set({ isLoading: true, error: null });

        try {
          // 模擬從伺服器載入翻譯
          // 實際實現中，這裡應該從 API 或靜態檔案載入
          await new Promise(resolve => setTimeout(resolve, 100));

          // 如果有額外的翻譯檔案，在這裡載入
          // const response = await fetch(`/locales/${locale}.json`);
          // const translations = await response.json();

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load translations',
          });
        }
      },

      t: (key, params) => {
        const { locale, fallbackLocale, translations } = get();

        // 嘗試取得翻譯
        let translation = translations[locale]?.[key];

        // 如果沒有，使用 fallback
        if (!translation) {
          translation = translations[fallbackLocale]?.[key];
        }

        // 如果都沒有，返回原始 key
        if (!translation) {
          return key;
        }

        // 替換參數
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
          });
        }

        return translation;
      },
    }),
    {
      name: 'i18n-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ locale: state.locale }),
    }
  )
);

// ==================== I18n Hook ====================

export function useI18n() {
  const {
    locale,
    fallbackLocale,
    isLoading,
    error,
    setLocale,
    setFallbackLocale,
    addTranslations,
    loadTranslations,
    t,
  } = useI18nStore();

  const config = LOCALES[locale];

  // 初始化 document 屬性
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = config?.dir || 'ltr';
  }, [locale, config]);

  // 格式化數字
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, {
        ...config?.numberFormat,
        ...options,
      }).format(value);
    },
    [locale, config]
  );

  // 格式化貨幣
  const formatCurrency = useCallback(
    (value: number, currency: string = 'TWD') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value);
    },
    [locale]
  );

  // 格式化百分比
  const formatPercent = useCallback(
    (value: number, decimals: number = 0) => {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 100);
    },
    [locale]
  );

  // 格式化日期
  const formatDate = useCallback(
    (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const date = new Date(value);
      return new Intl.DateTimeFormat(locale, {
        ...options,
        year: options?.year || 'numeric',
        month: options?.month || 'long',
        day: options?.day || 'numeric',
      }).format(date);
    },
    [locale]
  );

  // 格式化時間
  const formatTime = useCallback(
    (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const date = new Date(value);
      return new Intl.DateTimeFormat(locale, {
        ...options,
        hour: options?.hour || '2-digit',
        minute: options?.minute || '2-digit',
        second: options?.second || undefined,
      }).format(date);
    },
    [locale]
  );

  // 格式化相對時間
  const formatRelativeTime = useCallback(
    (value: Date | string | number) => {
      const date = new Date(value);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffSecs < 60) return t('time.justNow');
      if (diffMins < 60) return t('time.minutesAgo', { count: diffMins });
      if (diffHours < 24) return t('time.hoursAgo', { count: diffHours });
      if (diffDays < 7) return t('time.daysAgo', { count: diffDays });
      if (diffWeeks < 4) return t('time.weeksAgo', { count: diffWeeks });
      if (diffMonths < 12) return t('time.monthsAgo', { count: diffMonths });
      return t('time.yearsAgo', { count: diffYears });
    },
    [locale, t]
  );

  // 格式化日期時間
  const formatDateTime = useCallback(
    (value: Date | string | number) => {
      return `${formatDate(value)} ${formatTime(value)}`;
    },
    [formatDate, formatTime]
  );

  // 格式化日期區間
  const formatDateRange = useCallback(
    (start: Date | string | number, end: Date | string | number) => {
      return `${formatDate(start)} - ${formatDate(end)}`;
    },
    [formatDate]
  );

  return {
    locale,
    fallbackLocale,
    config,
    isLoading,
    error,
    locales: Object.values(LOCALES),
    setLocale,
    setFallbackLocale,
    addTranslations,
    loadTranslations,
    t,
    formatNumber,
    formatCurrency,
    formatPercent,
    formatDate,
    formatTime,
    formatDateTime,
    formatDateRange,
    formatRelativeTime,
  };
}

export default useI18n;
