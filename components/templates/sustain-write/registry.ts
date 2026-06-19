import { ShieldCheck, Leaf, Users, Layers } from 'lucide-react';
import React from 'react';

export interface ReportChapter {
  title: string;
  desc: string;
  requiredIndicators: string[];
  contentBlueprint: string;
}

export interface ZeroComputeTemplate {
  id: string;
  name: string;
  theme: 'climate' | 'social' | 'comprehensive';
  description: string;
  personaMatch: string[];
  chapters: ReportChapter[];
  aiSelectionPrompt: string;
  icon: React.ElementType;
}

export const SustainWriteTemplates: ZeroComputeTemplate[] = [
  {
    id: 'TPL-CLIMATE-01',
    name: '氣候永續先鋒藍圖 (240K Optimized)',
    theme: 'climate',
    description: '專注於環境足跡、碳中和路徑與氣候變遷風險管理的深度披露。9 章節 × 27K 字 = 240K+ 字目標。',
    personaMatch: ['製造業', '能源密集', '淨零承諾'],
    aiSelectionPrompt: '系統偵測到高度環境指標關聯性與高碳排特徵，AI 已為您最佳化「氣候永續先鋒藍圖」。240K 字深度架構已啟動。',
    icon: Leaf,
    chapters: [
      { 
        title: 'Ch.1 氣候變遷治理與策略', 
        desc: '董事會監督與氣候風險管理架構 (TCFD)。深度展開與治理韌性分析。', 
        requiredIndicators: ['GOV-001'],
        contentBlueprint: '本公司深知氣候變遷對全球營運之深遠影響...[27K字深度目標]'
      },
      { 
        title: 'Ch.2 溫室氣體盤查與分析', 
        desc: 'Scope 1, 2, 3 排放量深度分析與確信。三階段遞迴擴充至 27K 字。', 
        requiredIndicators: ['GRI-305-1', 'GRI-305-2'],
        contentBlueprint: '為具體掌揍本公司營運邊界內之溫室氣體排放現況...[27K字深度目標]'
      },
      { 
        title: 'Ch.3 淨零轉型路徑規劃', 
        desc: '減碳目標、再生能源導入與內部碳定價機制。深度政策解析。', 
        requiredIndicators: ['ENV-003'],
        contentBlueprint: '我們已正式承諾於 2050 年達成淨零排放...[27K字深度目標]'
      },
      { 
        title: 'Ch.4 能源效率與綠電轉型', 
        desc: '能源管理、效率提升與再生能源採購策略。', 
        requiredIndicators: ['GRI-302-1'],
        contentBlueprint: '面對能源安全與碳定價挑戰...[27K字深度目標]'
      },
      { 
        title: 'Ch.5 網路安全與資料治理', 
        desc: '資訊安全防護、資料隱私與網路風險管理。', 
        requiredIndicators: ['GRI-418'],
        contentBlueprint: '數位化轉型帶來的網路風險挑戰與治理...[27K字深度目標]'
      }
    ]
  },
  {
    id: 'TPL-SOCIAL-01',
    name: '社會共融影響力藍圖 (240K Optimized)',
    theme: 'social',
    description: '聚焦於多元包容、員工福祉與社區共榮的社會影響力報告。9 章節 × 27K 字 = 240K+ 字目標。',
    personaMatch: ['服務業', '科技業', '注重人才'],
    aiSelectionPrompt: '您的資料結構呈現社會指標高度關聯，AI 已部署「社會共融影響力藍圖」9 章節深度架構。',
    icon: Users,
    chapters: [
      { 
        title: 'Ch.1 人權政策與治理', 
        desc: '企業人權盡職調查與供應商行為準則。', 
        requiredIndicators: ['GOV-002'],
        contentBlueprint: '本公司恪守國際人權法典...[27K字深度目標]'
      },
      { 
        title: 'Ch.2 員工福祉與發展', 
        desc: '薪酬平等、教育訓練與身心靈健康照護。深度人才投資分析。', 
        requiredIndicators: ['SOC-015', 'SOC-016'],
        contentBlueprint: '員工是我們最寶貴的資產...[27K字深度目標]'
      },
      { 
        title: 'Ch.3 職業安全與衛生', 
        desc: '職業災害預防、安全管理與健康促進。', 
        requiredIndicators: ['SOC-020'],
        contentBlueprint: '安全是基本人權，是我們的責任...[27K字深度目標]'
      },
      { 
        title: 'Ch.4 多元、平等與包容 (DEI)', 
        desc: '性別平等、多元文化與包容政策。', 
        requiredIndicators: ['GRI-405-1'],
        contentBlueprint: '多元與包容是我們的核心價值...[27K字深度目標]'
      },
      { 
        title: 'Ch.5 社會參與與投入', 
        desc: '社區投資、CSR 活動與社會影響力。', 
        requiredIndicators: ['GRI-413'],
        contentBlueprint: '取之於社會，用之於社會...[27K字深度目標]'
      }
    ]
  },
  {
    id: 'TPL-COMP-01',
    name: '全面合規基準藍圖 (240K Optimized)',
    theme: 'comprehensive',
    description: '符合多數國際法規要求（GRI, SASB）的平衡型 ESG 報告框架。9 章節 × 27K 字 = 240K+ 字目標。',
    personaMatch: ['金控業', '綜合企業', '初次編製'],
    aiSelectionPrompt: '您的資料結構呈現多維度平衡分佈，為確保全方位合規，AI 已推薦「全面合規基準藍圖」9 章節深度架構。',
    icon: Layers,
    chapters: [
      { 
        title: 'Ch.1 永續治理與策略', 
        desc: '董事會參與、ESG 目標與氣候變遷因應策略。', 
        requiredIndicators: ['GOV-001'],
        contentBlueprint: '本公司將永續發展 (ESG) 視為企業核心營運策略...[27K字深度目標]'
      },
      { 
        title: 'Ch.2 環境守護 (Environmental)', 
        desc: '溫室氣體盤查、能源管理與水資源足跡。', 
        requiredIndicators: ['GRI-305-1', 'GRI-305-2'],
        contentBlueprint: '面對氣候變遷帶來的極端挑戰...[27K字深度目標]'
      },
      { 
        title: 'Ch.3 社會共融 (Social)', 
        desc: '員工福祉、多元包容與供應商行為準則。', 
        requiredIndicators: ['SOC-015'],
        contentBlueprint: '我們致力於打造一個多元、包容且充滿活力的職場環境...[27K字深度目標]'
      },
      { 
        title: 'Ch.4 誠信經營 (Governance)', 
        desc: '商業道德、風險管理與資訊安全防護。', 
        requiredIndicators: ['GOV-003'],
        contentBlueprint: '「誠信」是本公司無可妥協的最高指導原則...[27K字深度目標]'
      },
      { 
        title: 'Ch.5 供應鏈永續管理', 
        desc: '供應商行為準則、議合與供應鏈韌性。', 
        requiredIndicators: ['GRI-308', 'GRI-414'],
        contentBlueprint: '供應鏈永續是企業責任的延伸...[27K字深度目標]'
      },
      { 
        title: 'Ch.6 員工健康與安全', 
        desc: '職業安全衛生管理與員工福祉。', 
        requiredIndicators: ['GRI-403'],
        contentBlueprint: '員工健康是企業永續的基礎...[27K字深度目標]'
      },
      { 
        title: 'Ch.7 平等與人權', 
        desc: '多元平等、人權保障與非歧視政策。', 
        requiredIndicators: ['GRI-401', 'GRI-406'],
        contentBlueprint: '我們致力於提供平等機會與安全的工作環境...[27K字深度目標]'
      },
      { 
        title: 'Ch.8 社會投入與社區發展', 
        desc: '社區投資、在地人才培訓與社會創新。', 
        requiredIndicators: ['GRI-413'],
        contentBlueprint: '社會投入是企業價值的體現...[27K字深度目標]'
      },
      { 
        title: 'Ch.9 GRI 對照表與第三方保證', 
        desc: 'GRI 指標對照、第三方核證與 SASB 對應。', 
        requiredIndicators: ['GRI-Index'],
        contentBlueprint: '本報告經過第三方核證與 GRI 指標對照...[27K字深度目標]'
      }
    ]
  }
];

// 零算力 AI 選擇演算法 (Zero-Compute AI Selector)
export function aiTemplateSelector(features: string[]): ZeroComputeTemplate {
  let bestMatch = SustainWriteTemplates[2]; // Default to comprehensive
  let maxScore = 0;

  for (const tpl of SustainWriteTemplates) {
    let score = 0;
    for (const f of features) {
      if (tpl.personaMatch.includes(f)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = tpl;
    }
  }
  return bestMatch;
}
