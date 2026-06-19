/**
 * 💡 PageContextMap: 系統頁面上下文映射
 * 定義每個頁面的 5T 協議焦點與 Dr. Thoth 的引導智慧。
 */

export interface IPageContext {
    name: string;
    focus5T: string[];
    wisdom: string;
}

export const PAGE_CONTEXT_MAP: Record<string, IPageContext> = {
    '/': {
        name: 'Omni Dashboard (奧秘儀表板)',
        focus5T: ['Tangible', 'Traceable'],
        wisdom: '這是您的 ESG 旅程起點。所有數據在此匯流，成為可感知的影響力。'
    },
    '/esg/carbon-accounting': {
        name: 'Carbon Accounting (碳盤存管理)',
        focus5T: ['Transparent', 'Traceable'],
        wisdom: '精確是誠信的基石。在此頁面，我們專注於計算的透明度與排放源的溯源。'
    },
    '/esg/sustainability-report': {
        name: 'Sustainability Reporting (永續報告中心)',
        focus5T: ['Transparent', 'Trustworthy'],
        wisdom: '報告不僅是數據的堆砌，更是價值的敘事。確保每一項指標都不可篡改。'
    },
    '/esg/impact-village': {
        name: 'Impact Nexus Village (善向村)',
        focus5T: ['Tangible', 'Trackable'],
        wisdom: '行動在此結晶。觀察您的決策如何實時影響生態系統的流動。'
    },
    '/academy': {
        name: 'Goodward Academy (善向學院)',
        focus5T: ['Trackable'],
        wisdom: '知識即資產。您的學習路徑已被記錄，每一點進步都是永恆的修煉。'
    },
    '/personal-hub': {
        name: 'Personal Digital Avatar (個人數位分身)',
        focus5T: ['Trustworthy', 'Tangible'],
        wisdom: '這是您的數位主體性。在這裡，您定義自己在善向紀元中的本質屬性。'
    }
};

/**
 * 根據路徑獲取上下文
 */
export const getPageContext = (path: string): IPageContext => {
    // 優先匹配完全一致的路徑
    if (PAGE_CONTEXT_MAP[path]) return PAGE_CONTEXT_MAP[path];

    // 模糊匹配 (例如處理動態路由)
    const matchedPath = Object.keys(PAGE_CONTEXT_MAP).find(p => path.startsWith(p) && p !== '/');
    const context = matchedPath ? PAGE_CONTEXT_MAP[matchedPath] : undefined;

    return context ?? {
        name: 'Omni Portal',
        focus5T: ['Tangible'],
        wisdom: '系統正在觀察您的當前路徑。Dr. Thoth 隨時提供 5T 協議指引。'
    };
};
