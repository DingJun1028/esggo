/**
 * 符文奧義等級定義
 */
export enum RuneRank {
  BASIC = '基礎',
  ADVANCED = '進階',
  ESOTERIC = '奧義',
}

/**
 * 智庫標籤結構
 */
export interface KnowledgeTag {
  id: string;
  category: 'ESG' | 'ARCHITECTURE' | 'A11Y';
  title: string;
  description: string;
  rank: RuneRank;
}

// 預設的師徒智庫數據
export const ARCANE_LIBRARY: KnowledgeTag[] = [
  {
    id: 'tag-a11y-001',
    category: 'A11Y',
    title: 'ARIA 活區動態',
    description: '使用 aria-live 確保螢幕閱讀器使用者能即時獲得 AI 運算結果。',
    rank: RuneRank.ESOTERIC,
  },
  {
    id: 'tag-arch-002',
    category: 'ARCHITECTURE',
    title: '陣列邊界守護',
    description: '針對 EARTHBONE_ZONES[0] 進行非空檢查，防止系統崩潰。',
    rank: RuneRank.ADVANCED,
  },
];
