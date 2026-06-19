/**
 * ESG 益智問答題庫
 * ESG Trivia Database
 *
 * 包含環境(E)、社會(S)、治理(G)及 SDGs 相關問題
 */

import { type TriviaQuestion, TriviaDifficulty } from '../../shared/types';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const ESG_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ========================================================================
  // 簡單 (Easy) - 解鎖 Common/Uncommon
  // ========================================================================
  {
    id: 'q_easy_1',
    category: 'environmental',
    difficulty: TriviaDifficulty.EASY,
    question: '「碳足跡」通常是用哪種單位的當量來衡量的？',
    options: ['氧氣 (O2)', '二氧化碳 (CO2e)', '氮氣 (N2)', '水蒸氣 (H2O)'],
    correctAnswer: 1,
    explanation:
      '碳足跡是以二氧化碳當量 (CO2e) 來衡量，將不同溫室氣體的全球暖化潛勢換算為二氧化碳的量。',
  },
  {
    id: 'q_easy_2',
    category: 'sdgs',
    difficulty: TriviaDifficulty.EASY,
    question: '聯合國永續發展目標 (SDGs) 共有幾項核心目標？',
    options: ['10 項', '15 項', '17 項', '20 項'],
    correctAnswer: 2,
    explanation:
      '聯合國在 2015 年通過了 17 項永續發展目標 (SDGs)，旨在 2030 年前解決全球面臨的環境、社會和經濟問題。',
  },
  {
    id: 'q_easy_3',
    category: 'social',
    difficulty: TriviaDifficulty.EASY,
    question: '在職場 DEI 政策中，「I」代表什麼？',
    options: [
      'Innovation (創新)',
      'International (國際化)',
      'Inclusion (包容性)',
      'Investment (投資)',
    ],
    correctAnswer: 2,
    explanation:
      'DEI 代表 Diversity (多元)、Equity (公平) 和 Inclusion (包容)。Inclusion 指創造一個讓所有人都能感到被尊重和支持的環境。',
  },

  // ========================================================================
  // 中等 (Medium) - 解鎖 Rare/Epic
  // ========================================================================
  {
    id: 'q_medium_1',
    category: 'environmental',
    difficulty: TriviaDifficulty.MEDIUM,
    question: '哪一類碳排放屬於「Scope 2」？',
    options: ['公司車輛燃油燃燒', '外購電力所產生的間接排放', '員工通勤', '產品運輸'],
    correctAnswer: 1,
    explanation:
      'Scope 2 指企業外購電力、蒸汽、熱能或冷卻所產生的間接排放。公司車輛屬 Scope 1，員工通勤和產品運輸通常屬 Scope 3。',
  },
  {
    id: 'q_medium_2',
    category: 'governance',
    difficulty: TriviaDifficulty.MEDIUM,
    question: 'GRI 標準中的 GRI 200 系列主要涵蓋哪個範疇？',
    options: ['環境主題', '社會主題', '經濟主題', '一般揭露'],
    correctAnswer: 2,
    explanation:
      'GRI 標準分為：200 經濟、300 環境、400 社會。GRI 200 涵蓋反貪腐、市場存在感、間接經濟衝擊等。',
  },
  {
    id: 'q_medium_3',
    category: 'sdgs',
    difficulty: TriviaDifficulty.MEDIUM,
    question: 'SDG 12「負責任的消費與生產」鼓勵哪種經濟模式？',
    options: ['線性經濟', '循環經濟', '共享經濟', '零工經濟'],
    correctAnswer: 1,
    explanation:
      'SDG 12 強調減少廢棄物產生，鼓勵從「搖籃到墳墓」轉向「循環經濟」，資源可重複利用。',
  },

  // ========================================================================
  // 困難 (Hard) - 解鎖 Legendary
  // ========================================================================
  {
    id: 'q_hard_1',
    category: 'environmental',
    difficulty: TriviaDifficulty.HARD,
    question: '科學基礎減量目標倡議 (SBTi) 主要依據什麼協議來設定目標？',
    options: ['京都議定書', '巴黎協定', '蒙特婁議定書', '里約宣言'],
    correctAnswer: 1,
    explanation:
      'SBTi 協助企業設定符合《巴黎協定》目標（將升溫控制在 1.5°C 或 2°C 內）的減碳路徑。',
  },
  {
    id: 'q_hard_2',
    category: 'framework',
    difficulty: TriviaDifficulty.HARD,
    question: 'TCFD (氣候相關財務揭露) 的四大核心支柱不包含下列哪項？',
    options: [
      '治理 (Governance)',
      '策略 (Strategy)',
      '風險管理 (Risk Management)',
      '合規 (Compliance)',
    ],
    correctAnswer: 3,
    explanation:
      'TCFD 四大支柱為：治理、策略、風險管理、指標與目標 (Metrics and Targets)。合規非核心支柱名稱。',
  },
  {
    id: 'q_hard_3',
    category: 'sdgs',
    difficulty: TriviaDifficulty.HARD,
    question: '關於 SDG 13「氣候行動」的細項目標 13.a，主要涉及什麼承諾？',
    options: [
      '每年動員 1000 億美元氣候資金',
      '全面禁止燃油車',
      '將全球升溫控制在 1.5 度內',
      '建立全球碳交易市場',
    ],
    correctAnswer: 0,
    explanation:
      '目標 13.a 履行聯合國氣候變遷綱要公約承諾，已開發國家每年動員 1000 億美元，協助開發中國家進行減緩與調適。',
  },

  // ========================================================================
  // 大師 (Master) - 解鎖 Mythic
  // ========================================================================
  {
    id: 'q_master_1',
    category: 'environmental',
    difficulty: TriviaDifficulty.MASTER,
    question: '在歐盟碳邊境調整機制 (CBAM) 中，下列哪個產業首批並未被納入？',
    options: ['水泥', '鋼鐵', '紡織', '肥料'],
    correctAnswer: 2,
    explanation:
      '首批納入 CBAM 管制的產業包括：水泥、電力、化肥、鋼鐵、鋁、氫氣。紡織業尚未在首批名單中。',
  },
];

omniLogger.info(LogCategory.SYSTEM, '[esgTrivia] Info', { data: `[Trivia] 🎲 載入 ${ESG_TRIVIA_QUESTIONS.length} 道 ESG 益智問答題` });
