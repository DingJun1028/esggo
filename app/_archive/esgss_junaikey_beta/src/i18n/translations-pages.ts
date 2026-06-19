/**
 * Pages Translations - 頁面翻譯
 * Landing Page 和 Start Page 的翻譯
 * 
 * 支援語言：
 * - zh-TW: 繁體中文 (預設)
 * - en: English
 */

// 翻譯資源類型
interface I18nResources {
    [lang: string]: {
        [key: string]: string;
    };
}

// 頁面翻譯資源
export const translationsPages: I18nResources = {
    // 繁體中文 (預設)
    'zh-TW': {
        // Landing Page
        'landing.title': '反重力設計系統',
        'landing.subtitle': '輕量化、浮動美學、現代 UI/UX 最佳實踐',
        'landing.cta': '開始使用',
        'landing.features.title': '核心特性',
        'landing.features.description': '探索我們的設計系統提供的強大功能',
        'landing.features.design.title': '優美設計',
        'landing.features.design.description': '遵循 Anti-gravity 設計原則，創建輕盈、流暢的用戶界面',
        'landing.features.performance.title': '高性能',
        'landing.features.performance.description': '優化的組件和響應式布局，確保流暢的用戶體驗',
        'landing.features.security.title': '安全可靠',
        'landing.features.security.description': '嚴格的類型安全和驗證，保護您的數據安全',

        // Start Page
        'start.header.title': '儀表板導覽',
        'start.header.subtitle': '選擇您要訪問的儀表板',
        'start.header.back': '返回首頁',
        'start.welcome.title': '歡迎來到儀表板導覽',
        'start.welcome.subtitle': '選擇一個儀表板開始您的旅程',
        'start.dashboards.title': '可用儀表板',
        'start.dashboards.description': '點擊卡片進入相應的儀表板',
        'start.dashboards.enter': '進入',
        'start.dashboards.junaikey.title': 'JunAiKey 儀表板',
        'start.dashboards.junaikey.description': '管理您的 JunAiKey 設置和數據',
        'start.dashboards.northstar.title': 'North Star 儀表板',
        'start.dashboards.northstar.description': '追蹤您的目標和關鍵指標',
        'start.dashboards.omni.title': 'Omni 儀表板',
        'start.dashboards.omni.description': '全方位的數據分析和可視化',
        'start.dashboards.esg.title': 'ESG 儀表板',
        'start.dashboards.esg.description': '環境、社會和治理報告',
        'start.dashboards.settings.title': '設置儀表板',
        'start.dashboards.settings.description': '配置系統設置和偏好',
        'start.dashboards.security.title': '安全儀表板',
        'start.dashboards.security.description': '監控和管理系統安全',
    },

    // English
    'en': {
        // Landing Page
        'landing.title': 'Anti-gravity Design System',
        'landing.subtitle': 'Lightweight, Floating Aesthetics, Modern UI/UX Best Practices',
        'landing.cta': 'Get Started',
        'landing.features.title': 'Core Features',
        'landing.features.description': 'Explore the powerful features of our design system',
        'landing.features.design.title': 'Beautiful Design',
        'landing.features.design.description': 'Follow Anti-gravity design principles to create lightweight, fluid user interfaces',
        'landing.features.performance.title': 'High Performance',
        'landing.features.performance.description': 'Optimized components and responsive layouts ensure smooth user experience',
        'landing.features.security.title': 'Secure & Reliable',
        'landing.features.security.description': 'Strict type safety and validation to protect your data',

        // Start Page
        'start.header.title': 'Dashboard Navigation',
        'start.header.subtitle': 'Select the dashboard you want to access',
        'start.header.back': 'Back to Home',
        'start.welcome.title': 'Welcome to Dashboard Navigation',
        'start.welcome.subtitle': 'Choose a dashboard to start your journey',
        'start.dashboards.title': 'Available Dashboards',
        'start.dashboards.description': 'Click on a card to access the corresponding dashboard',
        'start.dashboards.enter': 'Enter',
        'start.dashboards.junaikey.title': 'JunAiKey Dashboard',
        'start.dashboards.junaikey.description': 'Manage your JunAiKey settings and data',
        'start.dashboards.northstar.title': 'North Star Dashboard',
        'start.dashboards.northstar.description': 'Track your goals and key metrics',
        'start.dashboards.omni.title': 'Omni Dashboard',
        'start.dashboards.omni.description': 'Comprehensive data analysis and visualization',
        'start.dashboards.esg.title': 'ESG Dashboard',
        'start.dashboards.esg.description': 'Environmental, Social, and Governance reports',
        'start.dashboards.settings.title': 'Settings Dashboard',
        'start.dashboards.settings.description': 'Configure system settings and preferences',
        'start.dashboards.security.title': 'Security Dashboard',
        'start.dashboards.security.description': 'Monitor and manage system security',
    },
};

// 翻譯獲取函數（頁面版）
export function tPages(key: string, lang: string = 'zh-TW'): string {
    const langData = translationsPages[lang] || translationsPages['zh-TW'] || {};
    const value = langData[key];

    // 如果找不到，回傳翻譯鍵值
    return value || key;
}

// 匯出
export default translationsPages;
