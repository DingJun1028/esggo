/**
 * 🎯 i18n 使用範例組件
 * i18n Usage Example Component
 * --------------------------------------------------
 * [目的] 展示如何正確使用新的類型安全 i18n 系統
 * [特性] 自動補全、類型檢查、雙語切換
 */

import React from 'react';
import { useI18n } from '@/utils/i18n';
import type { Language } from '@/types/i18n.types';

/**
 * 語言切換器組件
 * Language Switcher Component
 */
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('zh-TW')}
        className={`px-4 py-2 rounded ${
          language === 'zh-TW' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        繁體中文
      </button>
      <button
        onClick={() => setLanguage('en-US')}
        className={`px-4 py-2 rounded ${
          language === 'en-US' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        English
      </button>
    </div>
  );
};

/**
 * 系統資訊卡片
 * System Info Card
 */
export const SystemInfoCard: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* 使用類型安全的翻譯鍵值 Using type-safe translation keys */}
      <h1 className="text-2xl font-bold">{t('system.title')}</h1>
      <p className="text-gray-600">{t('system.subtitle')}</p>
      <p className="text-sm text-gray-500">{t('system.version')}</p>
    </div>
  );
};

/**
 * 儀表板導航
 * Dashboard Navigation
 */
export const DashboardNav: React.FC = () => {
  const { t } = useI18n();

  const navItems = [
    { key: 'dashboard.overview', icon: '📊' },
    { key: 'dashboard.emissions', icon: '🌱' },
    { key: 'dashboard.mentorship', icon: '👥' },
    { key: 'dashboard.analytics', icon: '📈' },
    { key: 'dashboard.reports', icon: '📄' },
  ] as const;

  return (
    <nav className="flex gap-4">
      {navItems.map(({ key, icon }) => (
        <button key={key} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition">
          <span className="mr-2">{icon}</span>
          {/* TypeScript 會檢查 key 是否為有效的翻譯鍵值 */}
          {t(key)}
        </button>
      ))}
    </nav>
  );
};

/**
 * 錯誤訊息顯示
 * Error Message Display
 */
interface ErrorDisplayProps {
  errorType: 'network' | 'unauthorized' | 'notFound' | 'serverError' | 'validation' | 'timeout';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorType }) => {
  const { t } = useI18n();

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="text-red-800">
        {/* 動態組合翻譯鍵值 Dynamically compose translation key */}
        {t(`errors.${errorType}` as any)}
      </p>
    </div>
  );
};

/**
 * 完整範例：協作平台卡片
 * Complete Example: Collaboration Platform Card
 */
export const CollaborationCard: React.FC = () => {
  const { t, language } = useI18n();

  return (
    <div className="max-w-md p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      {/* 標題區 Header section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('collaboration.supplyChain')}</h2>
        <p className="text-sm text-gray-600">
          {language === 'zh-TW'
            ? '整合供應鏈夥伴，實現透明協作'
            : 'Integrate supply chain partners for transparent collaboration'}
        </p>
      </div>

      {/* 功能列表 Feature list */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">🔐</span>
          <span>{t('collaboration.sovereignty')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">📁</span>
          <span>{t('collaboration.dataRoom')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-600">📋</span>
          <span>{t('collaboration.disclosure')}</span>
        </div>
      </div>

      {/* 操作按鈕 Action buttons */}
      <div className="mt-6 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {t('ui.confirm')}
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
          {t('ui.cancel')}
        </button>
      </div>
    </div>
  );
};

/**
 * 主範例組件（整合所有範例）
 * Main Example Component (integrates all examples)
 */
export const I18nExampleShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 語言切換器 Language switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* 系統資訊 System info */}
        <SystemInfoCard />

        {/* 導航 Navigation */}
        <DashboardNav />

        {/* 協作卡片 Collaboration card */}
        <CollaborationCard />

        {/* 錯誤範例 Error examples */}
        <div className="space-y-2">
          <ErrorDisplay errorType="network" />
          <ErrorDisplay errorType="unauthorized" />
        </div>
      </div>
    </div>
  );
};

export default I18nExampleShowcase;
