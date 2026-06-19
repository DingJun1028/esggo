/**
 * ESGss JunAiKey Beta - 多語系翻譯檔案
 * Internationalization (i18n) Translations
 * 
 * 支援語言：
 * - zh-TW: 繁體中文 (預設)
 * - en: English
 * - ja: 日本語 (待補齊)
 * - ko: 한국어 (待補齊)
 */

// 翻譯鍵值類型
export type TranslationKey = string;

// 翻譯資源類型
interface I18nResources {
    [lang: string]: {
        [key: string]: string | { [subKey: string]: string };
    };
}

// 翻譯資源
export const translations: I18nResources = {
    // 繁體中文 (預設)
    'zh-TW': {
        // 系統與品牌
        'system.name': '奧秘優化',
        'system.motto': '深貫廣通',

        // 導航
        'nav.dashboard': '儀表板',
        'nav.knowledge': '知識聖殿',
        'nav.report': '報告書',
        'nav.learning': '學習',
        'nav.settings': '設定',
        'nav.back': '返回',
        'nav.exit': '退出',

        // 頁面標題
        'page.quantumVault': '量子寶庫',
        'page.liquidNetwork': '液態網路',
        'page.sentientSymphony': '感知交響',
        'page.aiCultivationLab': 'AI 培育實驗室',
        'page.virtueHabit': '品德習慣',
        'page.omniMind': '奧秘心智',
        'page.learningAlchemy': '學習煉金',
        'page.debateArena': '辯論競技場',

        // 通用按鈕
        'btn.save': '儲存',
        'btn.cancel': '取消',
        'btn.confirm': '確認',
        'btn.submit': '提交',
        'btn.back': '返回',
        'btn.next': '下一步',
        'btn.finish': '完成',
        'btn.edit': '編輯',
        'btn.delete': '刪除',
        'btn.share': '分享',
        'btn.download': '下載',

        // 狀態
        'status.loading': '載入中...',
        'status.success': '成功',
        'status.error': '錯誤',
        'status.pending': '待處理',
        'status.completed': '已完成',

        // 5T 協議
        '5t.traceable': '可追溯',
        '5t.trackable': '可追蹤',
        '5t.transparent': '透明',
        '5t.trustworthy': '值得信賴',
        '5t.tangible': '有形',

        // ESG 分類
        'esg.environmental': '環境 (E)',
        'esg.social': '社會 (S)',
        'esg.governance': '治理 (G)',

        // 主題
        'theme.aquaFlow': '上善若水',
        'theme.sunlight': '日光版',
        'theme.midnight': '夜晚版',
        'theme.custom': '自訂主題',

        // Strategy
        'strategy.title': '策略軍火庫',
        'strategy.collection': '知識庫存',
        'strategy.collectionDesc': '管理您的策略資產',
        'strategy.deck': '作戰牌組',
        'strategy.equip': '裝備',
        'strategy.unequip': '卸下',

        // 語系
        'lang.zhTW': '繁體中文',
        'lang.en': 'English',
        'lang.ja': '日本語',
        'lang.ko': '한국어',
    },

    // English
    'en': {
        // System & Branding
        'system.name': 'Omni-Optimization',
        'system.motto': 'Deepen & Broaden',

        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.knowledge': 'Knowledge Sanctuary',
        'nav.report': 'Reports',
        'nav.learning': 'Learning',
        'nav.settings': 'Settings',
        'nav.back': 'Back',
        'nav.exit': 'Exit',

        // Page Titles
        'page.quantumVault': 'Quantum Vault',
        'page.liquidNetwork': 'Liquid Network',
        'page.sentientSymphony': 'Sentient Symphony',
        'page.aiCultivationLab': 'AI Cultivation Lab',
        'page.virtueHabit': 'Virtue Habit',
        'page.omniMind': 'Omni-Mind',
        'page.learningAlchemy': 'Learning Alchemy',
        'page.debateArena': 'Debate Arena',

        // Common Buttons
        'btn.save': 'Save',
        'btn.cancel': 'Cancel',
        'btn.confirm': 'Confirm',
        'btn.submit': 'Submit',
        'btn.back': 'Back',
        'btn.next': 'Next',
        'btn.finish': 'Finish',
        'btn.edit': 'Edit',
        'btn.delete': 'Delete',
        'btn.share': 'Share',
        'btn.download': 'Download',

        // Status
        'status.loading': 'Loading...',
        'status.success': 'Success',
        'status.error': 'Error',
        'status.pending': 'Pending',
        'status.completed': 'Completed',

        // 5T Protocol
        '5t.traceable': 'Traceable',
        '5t.trackable': 'Trackable',
        '5t.transparent': 'Transparent',
        '5t.trustworthy': 'Trustworthy',
        '5t.tangible': 'Tangible',

        // ESG Categories
        'esg.environmental': 'Environmental (E)',
        'esg.social': 'Social (S)',
        'esg.governance': 'Governance (G)',

        // Themes
        'theme.aquaFlow': 'Aqua Flow',
        'theme.sunlight': 'Sunlight',
        'theme.midnight': 'Midnight',
        'theme.custom': 'Custom Theme',

        // Strategy
        'strategy.title': 'Strategic Arsenal',
        'strategy.collection': 'Knowledge Arsenal',
        'strategy.collectionDesc': 'Manage your strategic assets',
        'strategy.deck': 'Battle Deck',
        'strategy.equip': 'Equip',
        'strategy.unequip': 'Unequip',

        // Languages
        'lang.zhTW': '繁體中文',
        'lang.en': 'English',
        'lang.ja': '日本語',
        'lang.ko': '한국어',
    },

    // 日本語
    'ja': {
        'nav.dashboard': 'ダッシュボード',
        'nav.knowledge': 'ナレッジサンクチュアリ',
        'nav.report': 'レポート',
        'nav.learning': 'ラーニング',
        'nav.settings': '設定',
        'nav.back': '戻る',
        'nav.exit': '終了',

        'page.quantumVault': '量子保管庫',
        'page.liquidNetwork': 'リキッドネットワーク',
        'page.sentientSymphony': 'センシェントシンフォニー',
        'page.aiCultivationLab': 'AI育成ラボ',
        'page.virtueHabit': '美徳の習慣',
        'page.omniMind': 'オムニマインド',
        'page.learningAlchemy': '学習の錬金術',
        'page.debateArena': 'ディベートアリーナ',

        'btn.save': '保存',
        'btn.cancel': 'キャンセル',
        'btn.confirm': '確認',
        'btn.submit': '送信',
        'btn.back': '戻る',
        'btn.next': '次へ',
        'btn.finish': '完了',
        'btn.edit': '編集',
        'btn.delete': '削除',
        'btn.share': '共有',
        'btn.download': 'ダウンロード',

        'status.loading': '読み込み中...',
        'status.success': '成功',
        'status.error': 'エラー',
        'status.pending': '保留中',
        'status.completed': '完了',

        '5t.traceable': '追跡可能 (Traceable)',
        '5t.trackable': '追跡容易 (Trackable)',
        '5t.transparent': '透明性 (Transparent)',
        '5t.trustworthy': '信頼性 (Trustworthy)',
        '5t.tangible': '実体性 (Tangible)',

        'esg.environmental': '環境 (Environmental)',
        'esg.social': '社会 (Social)',
        'esg.governance': 'ガバナンス (Governance)',

        'theme.aquaFlow': '上善如水 (アクアフロー)',
        'theme.sunlight': '日光 (サンライト)',
        'theme.midnight': '真夜中 (ミッドナイト)',
        'theme.custom': 'カスタムテーマ',

        'lang.zhTW': '繁體中文',
        'lang.en': 'English',
        'lang.ja': '日本語',
        'lang.ko': '한국어',
    },

    // 한국어
    'ko': {
        'nav.dashboard': '대시보드',
        'nav.knowledge': '지식 성소',
        'nav.report': '리포트',
        'nav.learning': '학습',
        'nav.settings': '설정',
        'nav.back': '뒤로',
        'nav.exit': '종료',

        'page.quantumVault': '퀀텀 저장소',
        'page.liquidNetwork': '리퀴드 네트워크',
        'page.sentientSymphony': '감각적 교향곡',
        'page.aiCultivationLab': 'AI 육성 연구소',
        'page.virtueHabit': '미덕의 습관',
        'page.omniMind': '옴니 마인드',
        'page.learningAlchemy': '학습의 연금술',
        'page.debateArena': '토론 아레나',

        'btn.save': '저장',
        'btn.cancel': '취소',
        'btn.confirm': '확인',
        'btn.submit': '제출',
        'btn.back': '뒤로',
        'btn.next': '다음',
        'btn.finish': '완료',
        'btn.edit': '편집',
        'btn.delete': '삭제',
        'btn.share': '공유',
        'btn.download': '다운로드',

        'status.loading': '로딩 중...',
        'status.success': '성공',
        'status.error': '오류',
        'status.pending': '대기 중',
        'status.completed': '완료',

        '5t.traceable': '추적 가능 (Traceable)',
        '5t.trackable': '추적 용이 (Trackable)',
        '5t.transparent': '투명성 (Transparent)',
        '5t.trustworthy': '신뢰성 (Trustworthy)',
        '5t.tangible': '유형성 (Tangible)',

        'esg.environmental': '환경 (E)',
        'esg.social': '사회 (S)',
        'esg.governance': '지배구조 (G)',

        'theme.aquaFlow': '상선약수 (아쿠아 플로우)',
        'theme.sunlight': '햇살 (선라이트)',
        'theme.midnight': '한밤중 (미드나이트)',
        'theme.custom': '사용자 지정 테마',

        'lang.zhTW': '繁體中文',
        'lang.en': 'English',
        'lang.ja': '日本語',
        'lang.ko': '한국어',
    },
};

// 翻譯獲取函數
export function t(key: string, lang: string = 'zh-TW'): string {
    const langData = translations[lang] || translations['zh-TW'] || {};
    const value = langData[key];

    if (typeof value === 'string') {
        return value;
    }

    // 如果是物件，回傳第一個值
    if (typeof value === 'object' && value !== null) {
        return Object.values(value)[0] as string || key;
    }

    // 如果找不到，翻譯鍵值
    return key;
}

// 語系檢測
export function detectLanguage(): string {
    if (typeof window === 'undefined') return 'zh-TW';

    const browserLang = navigator.language || 'zh-TW';

    if (browserLang.startsWith('zh')) return 'zh-TW';
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('ko')) return 'ko';

    return 'zh-TW';
}

// 匯出
export default translations;

// 匯出支援的語系清單
export const supportedLanguages = [
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
];
