/**
 * Settings Dashboard - 設置儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 用戶設置管理
 * - 系統配置
 * - 主題切換
 * - 語言設置
 * - 通知設置
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { antiGravityColors, antiGravitySpacing, antiGravityTypography } from '@/core';
import { tPages } from '@/i18n/translations-pages';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid, AntiGravityButton } from '@/components/layout/AntiGravityLayout';
import { useTwoWayBinding } from '@/components/data-binding/TwoWayBinding';

// 設置項目類型
interface SettingItem {
  id: string;
  category: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'slider';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

// 設置類型
interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-TW' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  display: {
    fontSize: number;
    density: 'comfortable' | 'compact' | 'spacious';
    animations: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
    tracking: boolean;
  };
}

// 默認設置
const defaultSettings: Settings = {
  theme: 'dark',
  language: 'zh-TW',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  display: {
    fontSize: 14,
    density: 'comfortable',
    animations: true,
  },
  privacy: {
    analytics: true,
    cookies: true,
    tracking: false,
  },
};

// 設置項目配置
const settingItems: SettingItem[] = [
  // 主題設置
  {
    id: 'theme',
    category: 'theme',
    label: '主題模式',
    description: '選擇您偏好的界面主題',
    type: 'select',
    value: 'dark',
    options: [
      { label: '淺色模式', value: 'light' },
      { label: '深色模式', value: 'dark' },
      { label: '自動', value: 'auto' },
    ],
  },
  // 語言設置
  {
    id: 'language',
    category: 'language',
    label: '語言',
    description: '選擇界面顯示語言',
    type: 'select',
    value: 'zh-TW',
    options: [
      { label: '繁體中文', value: 'zh-TW' },
      { label: 'English', value: 'en' },
    ],
  },
  // 字體大小
  {
    id: 'fontSize',
    category: 'display',
    label: '字體大小',
    description: '調整界面字體大小',
    type: 'slider',
    value: 14,
    min: 12,
    max: 20,
  },
  // 界面密度
  {
    id: 'density',
    category: 'display',
    label: '界面密度',
    description: '調整界面元素間距',
    type: 'select',
    value: 'comfortable',
    options: [
      { label: '舒適', value: 'comfortable' },
      { label: '緊湊', value: 'compact' },
      { label: '寬敞', value: 'spacious' },
    ],
  },
  // 動畫效果
  {
    id: 'animations',
    category: 'display',
    label: '動畫效果',
    description: '啟用或禁用界面動畫',
    type: 'toggle',
    value: true,
  },
  // 郵件通知
  {
    id: 'emailNotification',
    category: 'notifications',
    label: '郵件通知',
    description: '接收郵件通知',
    type: 'toggle',
    value: true,
  },
  // 推送通知
  {
    id: 'pushNotification',
    category: 'notifications',
    label: '推送通知',
    description: '接收推送通知',
    type: 'toggle',
    value: true,
  },
  // 短信通知
  {
    id: 'smsNotification',
    category: 'notifications',
    label: '短信通知',
    description: '接收短信通知',
    type: 'toggle',
    value: false,
  },
  // 分析數據
  {
    id: 'analytics',
    category: 'privacy',
    label: '分析數據',
    description: '允許收集使用數據以改進服務',
    type: 'toggle',
    value: true,
  },
  // Cookies
  {
    id: 'cookies',
    category: 'privacy',
    label: 'Cookies',
    description: '允許使用 Cookies',
    type: 'toggle',
    value: true,
  },
  // 追蹤
  {
    id: 'tracking',
    category: 'privacy',
    label: '追蹤',
    description: '允許行為追蹤',
    type: 'toggle',
    value: false,
  },
];

// 設置卡片組件
interface SettingCardProps {
  item: SettingItem;
  value: any;
  onChange: (value: any) => void;
  language: string;
}

const SettingCard: React.FC<SettingCardProps> = ({ item, value, onChange, language }) => {
  const renderControl = () => {
    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => onChange(!value)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              value ? 'bg-[#FF9800]' : 'bg-white/20'
            }`}
            style={{
              boxShadow: value ? '0 0 20px rgba(255, 152, 0, 0.4)' : 'none',
            }}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                value ? 'left-8' : 'left-1'
              }`}
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          </button>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#FF9800] transition-all"
          >
            {item.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900">
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#FF9800] transition-all"
          />
        );

      case 'slider':
        return (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-32 accent-[#FF9800]"
            />
            <span className="text-sm text-white/80 w-8">{value}</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#FF9800]/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
          <p className="text-sm text-white/60">{item.description}</p>
        </div>
        <div className="ml-4">{renderControl()}</div>
      </div>
    </div>
  );
};

// 主組件
const SettingsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  // 設置綁定
  const themeBinding = useTwoWayBinding({
    initialValue: settings.theme,
    required: true,
  });

  const languageBinding = useTwoWayBinding({
    initialValue: settings.language,
    required: true,
  });

  // 處理設置變更
  const handleSettingChange = (id: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      
      switch (id) {
        case 'theme':
          newSettings.theme = value;
          break;
        case 'language':
          newSettings.language = value;
          setLanguage(value);
          break;
        case 'fontSize':
          newSettings.display.fontSize = value;
          break;
        case 'density':
          newSettings.display.density = value;
          break;
        case 'animations':
          newSettings.display.animations = value;
          break;
        case 'emailNotification':
          newSettings.notifications.email = value;
          break;
        case 'pushNotification':
          newSettings.notifications.push = value;
          break;
        case 'smsNotification':
          newSettings.notifications.sms = value;
          break;
        case 'analytics':
          newSettings.privacy.analytics = value;
          break;
        case 'cookies':
          newSettings.privacy.cookies = value;
          break;
        case 'tracking':
          newSettings.privacy.tracking = value;
          break;
      }
      
      setHasChanges(true);
      return newSettings;
    });
  };

  // 保存設置
  const handleSave = () => {
    // 保存到 localStorage
    localStorage.setItem('settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // 顯示保存成功提示
    alert(language === 'zh-TW' ? '設置已保存！' : 'Settings saved!');
  };

  // 重置設置
  const handleReset = () => {
    if (confirm(language === 'zh-TW' ? '確定要重置所有設置嗎？' : 'Are you sure you want to reset all settings?')) {
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  // 獲取設置項目
  const getFilteredItems = () => {
    if (activeCategory === 'all') {
      return settingItems;
    }
    return settingItems.filter((item) => item.category === activeCategory);
  };

  // 獲取設置值
  const getSettingValue = (id: string) => {
    switch (id) {
      case 'theme':
        return settings.theme;
      case 'language':
        return settings.language;
      case 'fontSize':
        return settings.display.fontSize;
      case 'density':
        return settings.display.density;
      case 'animations':
        return settings.display.animations;
      case 'emailNotification':
        return settings.notifications.email;
      case 'pushNotification':
        return settings.notifications.push;
      case 'smsNotification':
        return settings.notifications.sms;
      case 'analytics':
        return settings.privacy.analytics;
      case 'cookies':
        return settings.privacy.cookies;
      case 'tracking':
        return settings.privacy.tracking;
      default:
        return null;
    }
  };

  // 類別選項
  const categories = [
    { id: 'all', label: language === 'zh-TW' ? '全部' : 'All' },
    { id: 'theme', label: language === 'zh-TW' ? '主題' : 'Theme' },
    { id: 'language', label: language === 'zh-TW' ? '語言' : 'Language' },
    { id: 'display', label: language === 'zh-TW' ? '顯示' : 'Display' },
    { id: 'notifications', label: language === 'zh-TW' ? '通知' : 'Notifications' },
    { id: 'privacy', label: language === 'zh-TW' ? '隱私' : 'Privacy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/start')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh-TW' ? '設置' : 'Settings'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '管理您的系統設置' : 'Manage your system settings'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#FF9800] hover:bg-[#FF9800]/80 text-white rounded-lg font-medium transition-all"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 152, 0, 0.3)',
                  }}
                >
                  {language === 'zh-TW' ? '保存更改' : 'Save Changes'}
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
              >
                {language === 'zh-TW' ? '重置' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* UUID Display */}
        <div className="mb-8">
          <UUIDDisplay
            uuid="550e8400-e29b-41d4-a716-446655440000"
            mode="full"
            showLabel={true}
            language={language}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-[#FF9800] text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              style={{
                boxShadow: activeCategory === category.id ? '0 0 20px rgba(255, 152, 0, 0.3)' : 'none',
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Settings Grid */}
        <AntiGravityGrid columns={1} gap={4}>
          {getFilteredItems().map((item) => (
            <SettingCard
              key={item.id}
              item={item}
              value={getSettingValue(item.id)}
              onChange={(value) => handleSettingChange(item.id, value)}
              language={language}
            />
          ))}
        </AntiGravityGrid>

        {/* Info Card */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#FF9800]/10 to-transparent border border-[#FF9800]/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FF9800]/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#FF9800]"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'zh-TW' ? '設置提示' : 'Settings Tips'}
              </h3>
              <p className="text-sm text-white/70">
                {language === 'zh-TW'
                  ? '更改設置後，請點擊「保存更改」按鈕以應用您的設置。某些設置可能需要重新加載頁面才能生效。'
                  : 'After changing settings, click the "Save Changes" button to apply your settings. Some settings may require a page reload to take effect.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsDashboard;
