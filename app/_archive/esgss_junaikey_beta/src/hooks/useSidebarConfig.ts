import { useState, useCallback } from 'react';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

interface SidebarConfig {
  itemOrder: string[];
  hiddenItems: string[];
  customIcons?: Record<string, string>;
  customLabels?: Record<string, string>;
}

const CONFIG_STORAGE_KEY = 'sidebar_configuration';

const defaultConfig: SidebarConfig = {
  itemOrder: [],
  hiddenItems: [],
  customIcons: {},
  customLabels: {},
};

/**
 * 側邊欄配置 Hook
 * 允許用戶自定義側邊欄項目順序、可見性等
 */
export function useSidebarConfig() {
  const [config, setConfigState] = useState<SidebarConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultConfig;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useSidebarConfig] Failed to load sidebar config:', { error })
      return defaultConfig;
    }
  });

  // 保存配置
  const saveConfig = useCallback((newConfig: SidebarConfig) => {
    setConfigState(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useSidebarConfig] Failed to save sidebar config:', { error })
    }
  }, []);

  // 重新排序項目
  const reorderItems = useCallback(
    (newOrder: string[]) => {
      saveConfig({ ...config, itemOrder: newOrder });
    },
    [config, saveConfig]
  );

  // 隱藏/顯示項目
  const toggleItemVisibility = useCallback(
    (itemId: string) => {
      const isHidden = config.hiddenItems.includes(itemId);
      const newHiddenItems = isHidden
        ? config.hiddenItems.filter(id => id !== itemId)
        : [...config.hiddenItems, itemId];

      saveConfig({ ...config, hiddenItems: newHiddenItems });
    },
    [config, saveConfig]
  );

  // 設置自定義標籤
  const setCustomLabel = useCallback(
    (itemId: string, label: string) => {
      saveConfig({
        ...config,
        customLabels: { ...config.customLabels, [itemId]: label },
      });
    },
    [config, saveConfig]
  );

  // 重置配置
  const resetConfig = useCallback(() => {
    saveConfig(defaultConfig);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }, [saveConfig]);

  // 導出配置
  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  // 導入配置
  const importConfig = useCallback(
    (configJson: string) => {
      try {
        const imported = JSON.parse(configJson);
        saveConfig(imported);
        return true;
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[useSidebarConfig] Failed to import config:', { error })
        return false;
      }
    },
    [saveConfig]
  );

  return {
    config,
    reorderItems,
    toggleItemVisibility,
    setCustomLabel,
    resetConfig,
    exportConfig,
    importConfig,
  };
}
