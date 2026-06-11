/**
 * Official GRI Master Chapters for ESG GO
 * Used by SustainWrite Editor and OmniAgent Swarm
 */

export interface Chapter {
  id: string;
  num: string;
  title: string;
  gri: string;
  category: 'env' | 'soc' | 'gov';
  order: number;
  fields?: { id: string; label: string; unit: string; gri: string }[];
}

export const GRI_CHAPTERS: Chapter[] = [
  { 
    id: 'intro', num: '01', title: '永續經營與策略願景', gri: 'GRI 2-22', category: 'gov', order: 1,
    fields: [{ id: 'ceo_statement', label: 'CEO 承諾度', unit: '%', gri: 'GRI 2-22' }]
  },
  { 
    id: 'ghg', num: '02', title: '溫室氣體排放與減量', gri: 'GRI 305', category: 'env', order: 2,
    fields: [
      { id: 'scope1', label: '範疇一排放', unit: 'tCO2e', gri: 'GRI 305-1' },
      { id: 'scope2', label: '範疇二排放', unit: 'tCO2e', gri: 'GRI 305-2' }
    ]
  },
  { 
    id: 'labor', num: '03', title: '勞雇關係與職場安全', gri: 'GRI 401', category: 'soc', order: 3,
    fields: [{ id: 'turnover_rate', label: '員工離職率', unit: '%', gri: 'GRI 401-1' }]
  },
  { 
    id: 'board', num: '04', title: '公司治理與董事會效能', gri: 'GRI 2-9', category: 'gov', order: 4,
    fields: [{ id: 'ind_directors', label: '獨立董事比例', unit: '%', gri: 'GRI 2-9' }]
  }
  // ... more chapters can be added
];
