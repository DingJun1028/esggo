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
    name: '氣候永續先鋒藍圖',
    theme: 'climate',
    description: '專注於環境足跡、碳中和路徑與氣候變遷風險管理的深度披露。',
    personaMatch: ['製造業', '能源密集', '淨零承諾'],
    aiSelectionPrompt: '系統偵測到高度環境指標關聯性與高碳排特徵，AI 已為您最佳化「氣候永續先鋒藍圖」。',
    icon: Leaf,
    chapters: [
      { 
        title: 'Ch.1 氣候變遷治理', 
        desc: '董事會監督與氣候風險管理架構 (TCFD)。', 
        requiredIndicators: ['GOV-001'],
        contentBlueprint: '本公司深知氣候變遷對全球營運之深遠影響，已於董事會層級設立「永續發展委員會」，專責監督氣候相關風險與機會（依循 TCFD 框架）。本年度，董事會已就氣候策略進行深度盤點，並確保氣候變遷因應策略與企業整體營運目標高度一致。\n\n【治理績效指標】\n依據 {{GOV-001}} 指標，本公司高階主管與氣候相關之績效考核連結佔比已達業界領先標準，確保由上而下的氣候治理決心。'
      },
      { 
        title: 'Ch.2 溫室氣體盤查', 
        desc: 'Scope 1, 2, 3 排放量深度分析與確信。', 
        requiredIndicators: ['GRI-305-1', 'GRI-305-2'],
        contentBlueprint: '為具體掌握本公司營運邊界內之溫室氣體排放現況，本年度全面導入 ISO 14064-1 盤查機制。我們秉持「透明、精確、可溯源」之 5T 原則，將所有數據鎖定於區塊鏈與全息金庫中。\n\n【排放數據實證】\n本年度範疇一 (Scope 1) 直接溫室氣體排放量為 {{GRI-305-1}}；範疇二 (Scope 2) 間接溫室氣體排放量為 {{GRI-305-2}}。相較於基準年，整體碳排強度已展現初步下降趨勢，為未來的減碳路徑奠定堅實基礎。'
      },
      { 
        title: 'Ch.3 淨零轉型路徑', 
        desc: '減碳目標、再生能源導入與內部碳定價機制。', 
        requiredIndicators: ['ENV-003'],
        contentBlueprint: '我們已正式承諾於 2050 年達成淨零排放 (Net Zero)，並設定符合 SBTi (科學基礎減碳目標倡議) 的近期與長期減碳路徑。轉型策略包含三大主軸：(1) 製程能源效率提升、(2) 再生能源採購擴大、(3) 內部碳定價機制導入。\n\n【綠能推動成果】\n本年度我們大幅提升再生能源使用比例，透過自建太陽能與綠電採購，再生能源佔總用電量已達到 {{ENV-003}}，未來將持續推動低碳營運模式，引領產業綠色轉型。'
      }
    ]
  },
  {
    id: 'TPL-SOCIAL-01',
    name: '社會共融影響力藍圖',
    theme: 'social',
    description: '聚焦於多元包容、員工福祉與社區共榮的社會影響力報告。',
    personaMatch: ['服務業', '科技業', '注重人才'],
    aiSelectionPrompt: '從 Vault 資料庫中發現員工發展與社區投入為您的核心競爭力，AI 已部署「社會共融影響力藍圖」。',
    icon: Users,
    chapters: [
      { 
        title: 'Ch.1 人權政策與治理', 
        desc: '企業人權盡職調查與供應商行為準則。', 
        requiredIndicators: ['GOV-002'],
        contentBlueprint: '本公司恪守國際人權法典及《聯合國企業與人權指導原則》(UNGP)，並制定內部《人權政策》。我們致力於打造零歧視、零騷擾、且尊重結社自由的工作環境，並將此標準延伸至整體價值鏈。\n\n【盡職調查成效】\n本年度完成的人權盡職調查覆蓋率達 100%，並針對高風險供應商實施嚴格審查，確保整體供應鏈符合 {{GOV-002}} 規範，保障所有勞動者之基本權益。'
      },
      { 
        title: 'Ch.2 員工福祉與發展', 
        desc: '薪酬平等、教育訓練與身心靈健康照護。', 
        requiredIndicators: ['SOC-015', 'SOC-016'],
        contentBlueprint: '員工是我們最寶貴的資產。我們提供具市場競爭力的薪酬福利，並落實同工同酬原則。為陪伴員工成長，我們打造了全方位的「OmniLearning 學習生態圈」，提供豐富的專業與通識課程。\n\n【人才培育亮點】\n本年度員工平均教育訓練時數高達 {{SOC-015}}。此外，我們極度重視員工身心健康，透過各項健康促進計畫，員工滿意度調查分數達 {{SOC-016}}，展現我們對打造幸福職場的承諾。'
      },
      { 
        title: 'Ch.3 社會影響力', 
        desc: '社區投資與在地志工服務計畫。', 
        requiredIndicators: ['SOC-020'],
        contentBlueprint: '取之於社會，用之於社會。我們秉持「共創美好」的理念，長期投入社區關懷、教育弱勢扶助與環境保護行動。透過整合企業核心專業與志工動能，我們期盼成為帶動社會向上的正向力量。\n\n【社會共榮實績】\n本年度我們共支持超過 50 個非營利專案，企業志工總服務時數達 {{SOC-020}}。這些點滴付出不僅強化了在地連結，更深化了企業的社會影響力 (Social Impact)。'
      }
    ]
  },
  {
    id: 'TPL-COMP-01',
    name: '全面合規基準藍圖',
    theme: 'comprehensive',
    description: '符合多數國際法規要求（GRI, SASB）的平衡型 ESG 報告框架。',
    personaMatch: ['金控業', '綜合企業', '初次編製'],
    aiSelectionPrompt: '您的資料結構呈現多維度平衡分佈，為確保全方位合規，AI 已推薦「全面合規基準藍圖」。',
    icon: Layers,
    chapters: [
      { 
        title: 'Ch.1 永續治理與策略', 
        desc: '董事會參與、ESG 目標與氣候變遷因應策略。', 
        requiredIndicators: ['GOV-001'],
        contentBlueprint: '本公司將永續發展 (ESG) 視為企業核心營運策略。董事會層級設立之「永續治理委員會」，定期審閱 ESG 關鍵績效指標 (KPIs)，確保從風險控管到商業創新，皆與聯合國永續發展目標 (SDGs) 緊密契合。\n\n依據 {{GOV-001}} 標準，我們建立了透明且高效的治理架構，為股東與利害關係人創造長遠價值。'
      },
      { 
        title: 'Ch.2 環境守護 (Environmental)', 
        desc: '溫室氣體盤查、能源管理與水資源足跡。', 
        requiredIndicators: ['GRI-305-1', 'GRI-305-2'],
        contentBlueprint: '面對氣候變遷帶來的極端挑戰，我們採取積極的環境保護措施。除了逐步提高能源使用效率外，更全面展開範疇一與範疇二之溫室氣體盤查。\n\n本年度範疇一碳排放量為 {{GRI-305-1}}；範疇二碳排放量為 {{GRI-305-2}}。我們將依據此盤查結果，擬定具體可行的短中長期減碳路徑。'
      },
      { 
        title: 'Ch.3 社會共融 (Social)', 
        desc: '員工福祉、多元包容與供應商行為準則。', 
        requiredIndicators: ['SOC-015'],
        contentBlueprint: '我們致力於打造一個多元、包容且充滿活力的職場環境。我們堅信，唯有快樂健康的員工，才能創造優質的產品與服務。因此，我們提供完善的薪資福利與職涯發展藍圖。\n\n在人才培育方面，我們投入大量資源，本年度員工平均教育訓練時數達 {{SOC-015}}。同時，我們也將社會責任延伸至供應鏈，要求合作夥伴共同遵守人權與勞工準則。'
      },
      { 
        title: 'Ch.4 誠信經營 (Governance)', 
        desc: '商業道德、風險管理與資訊安全防護。', 
        requiredIndicators: ['GOV-003'],
        contentBlueprint: '「誠信」是本公司無可妥協的最高指導原則。我們透過嚴謹的內部控制與風險管理機制，防範貪腐、賄賂與不當利益輸送。\n\n此外，面對數位化時代的挑戰，我們大幅提升資訊安全防護等級，依循 {{GOV-003}} 指引，確保客戶資料隱私與公司機密安全，致力成為利害關係人最值得信賴的長期夥伴。'
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
