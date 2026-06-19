/**
 * 🃏 OmniCardTCG - 萬能卡牌系統 (ESG TCG)
 *
 * 整合功能：
 * - 知識卡 (Knowledge): ESG 專業知識
 * - 行動卡 (Action): 立即執行策略
 * - 關係卡 (Relationship): 人脈合作
 * - 資源卡 (Resource): 資源獲取
 * - 傳說卡 (Legendary): 超稀有傳奇
 *
 * 戰役冒險 PvE + 玩家對戰 PvP
 *
 * @version 1.2.0
 * @date 2026-02-19
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniTheme } from '@/omni/infrastructure/ui/OmniThemeProvider';
import {
  WalletCards,
  Swords,
  Trophy,
  Users,
  ShoppingCart,
  ChevronLeft,
  Zap,
  Shield,
  Brain,
  Heart,
  Star,
  Lock,
  Plus,
  Minus,
  Target,
  Crown,
  Gem,
  BookOpen,
  Leaf,
  Globe,
  Scroll,
  Play,
  Grid,
  List,
  Search,
  Coins,
  Skull,
  Award,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';

export interface ITCGCard {
  id: string;
  name: string;
  nameEn: string;
  category: 'knowledge' | 'action' | 'relationship' | 'resource' | 'legendary';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  cost: number;
  power: number;
  defense: number;
  hp: number;
  description: string;
  knowledgePoints: string[];
  isoReference?: string;
  esgType: 'E' | 'S' | 'G' | 'ESG';
  stats: { E: number; S: number; G: number; INT: number; STR: number; CHR: number };
  abilities: { name: string; description: string; cost: number }[];
  flavorText?: string;
  source_origin: string;
  evidence_hash: string;
  impact_metric: number;
  isSealed: boolean;
  status: string;
}

const ALL_CARDS: ITCGCard[] = [
  {
    id: 'KN-E-001',
    name: 'ISO 14064 碳盤查',
    nameEn: 'Carbon Inventory',
    category: 'knowledge',
    rarity: 'rare',
    cost: 3,
    power: 0,
    defense: 0,
    hp: 0,
    description: '學習溫室氣體盤查',
    knowledgePoints: ['GHG Protocol', 'ISO 14064-1'],
    isoReference: 'ISO 14064-1:2018',
    esgType: 'E',
    stats: { E: 40, S: 10, G: 20, INT: 80, STR: 10, CHR: 20 },
    abilities: [{ name: '精準溯源', description: '揭示敵方弱點', cost: 2 }],
    source_origin: 'ISO_Standard',
    evidence_hash: 'sha256:v1',
    impact_metric: 85,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'KN-E-002',
    name: '範疇三排放分析',
    nameEn: 'Scope 3 Analysis',
    category: 'knowledge',
    rarity: 'epic',
    cost: 4,
    power: 0,
    defense: 0,
    hp: 0,
    description: '供應鏈上下游碳排放',
    knowledgePoints: ['Scope 3', 'Value Chain'],
    isoReference: 'GHG Protocol',
    esgType: 'E',
    stats: { E: 60, S: 30, G: 30, INT: 95, STR: 15, CHR: 25 },
    abilities: [{ name: '供應鏈透視', description: '看穿整條供應鏈', cost: 3 }],
    flavorText: '最複雜的碳排放往往隱藏在供應鏈深處',
    source_origin: 'GHG_Protocol',
    evidence_hash: 'sha256:v2',
    impact_metric: 92,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'KN-S-001',
    name: 'DEI 多元共融',
    nameEn: 'DEI Framework',
    category: 'knowledge',
    rarity: 'rare',
    cost: 2,
    power: 0,
    defense: 0,
    hp: 0,
    description: '多元、公平、共融工作環境',
    knowledgePoints: ['DEI', 'GRI 405'],
    isoReference: 'GRI 405',
    esgType: 'S',
    stats: { E: 10, S: 50, G: 30, INT: 40, STR: 20, CHR: 70 },
    abilities: [{ name: '共融之力', description: '團隊攻擊力提升', cost: 2 }],
    flavorText: '多元是世界最强大的力量',
    source_origin: 'DEI_Best_Practices',
    evidence_hash: 'sha256:v3',
    impact_metric: 78,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'KN-G-001',
    name: 'ESG 透明治理',
    nameEn: 'ESG Governance',
    category: 'knowledge',
    rarity: 'rare',
    cost: 3,
    power: 0,
    defense: 40,
    hp: 30,
    description: '透明可問責治理架構',
    knowledgePoints: ['Corporate Governance', 'GRI 2-9'],
    isoReference: 'GRI 2-9',
    esgType: 'G',
    stats: { E: 20, S: 20, G: 60, INT: 50, STR: 30, CHR: 40 },
    abilities: [{ name: '透明護盾', description: '減免下次攻擊', cost: 2 }],
    flavorText: '陽光是最好的防腐劑',
    source_origin: 'Governance_Framework',
    evidence_hash: 'sha256:v4',
    impact_metric: 82,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'KN-ESG-001',
    name: 'GRI 永續報告',
    nameEn: 'GRI Standards',
    category: 'knowledge',
    rarity: 'epic',
    cost: 5,
    power: 0,
    defense: 0,
    hp: 0,
    description: '全球最廣泛永續報告框架',
    knowledgePoints: ['GRI Standards', 'Materiality'],
    isoReference: 'GRI Universal 2021',
    esgType: 'ESG',
    stats: { E: 40, S: 40, G: 40, INT: 90, STR: 20, CHR: 50 },
    abilities: [{ name: '全面披露', description: '強制揭露所有資訊', cost: 4 }],
    flavorText: '用全球標準說你的永續故事',
    source_origin: 'GRI_Global',
    evidence_hash: 'sha256:v5',
    impact_metric: 95,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'AC-E-001',
    name: '太陽能發電計畫',
    nameEn: 'Solar Project',
    category: 'action',
    rarity: 'uncommon',
    cost: 3,
    power: 35,
    defense: 0,
    hp: 0,
    description: '啟動太陽能發電',
    knowledgePoints: ['Solar Energy'],
    isoReference: 'ISO 50001',
    esgType: 'E',
    stats: { E: 70, S: 10, G: 15, INT: 30, STR: 60, CHR: 20 },
    abilities: [],
    source_origin: 'Renewable_Projects',
    evidence_hash: 'sha256:a1',
    impact_metric: 75,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'AC-E-002',
    name: '節能改造方案',
    nameEn: 'Energy Retrofit',
    category: 'action',
    rarity: 'rare',
    cost: 4,
    power: 50,
    defense: 0,
    hp: 0,
    description: '全面升級設備能效',
    knowledgePoints: ['Energy Efficiency'],
    isoReference: 'ISO 50001',
    esgType: 'E',
    stats: { E: 80, S: 15, G: 20, INT: 40, STR: 70, CHR: 25 },
    abilities: [{ name: '節能加成', description: '額外造成等效益', cost: 2 }],
    flavorText: '最乾淨的能源是節省下來的能源',
    source_origin: 'Energy_Audit',
    evidence_hash: 'sha256:a2',
    impact_metric: 88,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'AC-S-001',
    name: '員工培訓計畫',
    nameEn: 'Training Program',
    category: 'action',
    rarity: 'uncommon',
    cost: 2,
    power: 0,
    defense: 20,
    hp: 25,
    description: '投資員工成長',
    knowledgePoints: ['Human Capital', 'GRI 404'],
    isoReference: 'GRI 404',
    esgType: 'S',
    stats: { E: 10, S: 60, G: 20, INT: 35, STR: 25, CHR: 55 },
    abilities: [],
    source_origin: 'HR_Development',
    evidence_hash: 'sha256:a3',
    impact_metric: 70,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'AC-G-001',
    name: '獨立董事審計',
    nameEn: 'Director Audit',
    category: 'action',
    rarity: 'rare',
    cost: 3,
    power: 0,
    defense: 45,
    hp: 0,
    description: '獨立董事治理審計',
    knowledgePoints: ['Board Independence'],
    isoReference: 'GRI 2-10',
    esgType: 'G',
    stats: { E: 15, S: 25, G: 70, INT: 45, STR: 20, CHR: 40 },
    abilities: [{ name: '防禦加固', description: '降低下次傷害', cost: 1 }],
    flavorText: '獨立董事是治理的守護者',
    source_origin: 'Corporate_Governance',
    evidence_hash: 'sha256:a4',
    impact_metric: 80,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'RL-S-001',
    name: '供應商聯盟',
    nameEn: 'Supplier Alliance',
    category: 'relationship',
    rarity: 'rare',
    cost: 4,
    power: 0,
    defense: 30,
    hp: 40,
    description: '永續供應商策略聯盟',
    knowledgePoints: ['Supply Chain'],
    isoReference: 'GRI 308',
    esgType: 'S',
    stats: { E: 40, S: 55, G: 35, INT: 45, STR: 50, CHR: 60 },
    abilities: [{ name: '聯盟護盾', description: '所有隊友防禦加成', cost: 3 }],
    flavorText: '團結永續力量',
    source_origin: 'Supplier_Network',
    evidence_hash: 'sha256:r1',
    impact_metric: 85,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'RL-S-002',
    name: '社區共建計畫',
    nameEn: 'Community Co-Build',
    category: 'relationship',
    rarity: 'epic',
    cost: 5,
    power: 0,
    defense: 25,
    hp: 60,
    description: '與社區共同推動永續',
    knowledgePoints: ['Community Engagement'],
    isoReference: 'GRI 413',
    esgType: 'S',
    stats: { E: 30, S: 80, G: 30, INT: 50, STR: 35, CHR: 85 },
    abilities: [{ name: '社區之力', description: '根據支持度提升全隊', cost: 4 }],
    flavorText: '永續從來不是獨角戲',
    source_origin: 'Community_Programs',
    evidence_hash: 'sha256:r2',
    impact_metric: 92,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'RS-E-001',
    name: '綠色融資額度',
    nameEn: 'Green Finance',
    category: 'resource',
    rarity: 'epic',
    cost: 5,
    power: 0,
    defense: 0,
    hp: 0,
    description: '銀行綠色融資優惠',
    knowledgePoints: ['Green Bond', 'Taxonomy'],
    isoReference: 'EU Taxonomy',
    esgType: 'E',
    stats: { E: 50, S: 30, G: 50, INT: 40, STR: 30, CHR: 45 },
    abilities: [{ name: '資金湧入', description: '恢復額外能量', cost: 0 }],
    flavorText: '永續是最值得的投資',
    source_origin: 'Green_Finance',
    evidence_hash: 'sha256:rs1',
    impact_metric: 88,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'RS-E-002',
    name: '政府補助申請',
    nameEn: 'Gov Subsidy',
    category: 'resource',
    rarity: 'rare',
    cost: 2,
    power: 0,
    defense: 0,
    hp: 0,
    description: '申請政府永續補助',
    knowledgePoints: ['Policy', 'Subsidy'],
    esgType: 'E',
    stats: { E: 55, S: 25, G: 30, INT: 50, STR: 40, CHR: 35 },
    abilities: [{ name: '補助加成', description: '抽多一張牌', cost: 1 }],
    flavorText: '善用政府資源加速轉型',
    source_origin: 'Government_Policy',
    evidence_hash: 'sha256:rs2',
    impact_metric: 75,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'LG-E-001',
    name: '碳中和聖杯',
    nameEn: 'Carbon Grail',
    category: 'legendary',
    rarity: 'mythic',
    cost: 8,
    power: 100,
    defense: 50,
    hp: 0,
    description: '達成組織碳中和',
    knowledgePoints: ['Net Zero', 'SBTi'],
    isoReference: 'SBTi',
    esgType: 'E',
    stats: { E: 100, S: 40, G: 50, INT: 90, STR: 95, CHR: 70 },
    abilities: [
      { name: '零碳衝擊', description: '造成等同敵方剩餘血量', cost: 5 },
      { name: '碳中和光環', description: '全場永續加成', cost: 3 },
    ],
    flavorText: '當碳排放歸零，奇蹟降臨',
    source_origin: 'Carbon_Neutrality',
    evidence_hash: 'sha256:l1',
    impact_metric: 100,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'LG-S-001',
    name: '社會影響力王冠',
    nameEn: 'Social Crown',
    category: 'legendary',
    rarity: 'mythic',
    cost: 8,
    power: 50,
    defense: 50,
    hp: 100,
    description: '社會正向影響力象徵',
    knowledgePoints: ['SROI', 'SDG'],
    isoReference: 'SDG',
    esgType: 'S',
    stats: { E: 40, S: 100, G: 50, INT: 70, STR: 60, CHR: 100 },
    abilities: [
      { name: '影響力爆發', description: '恢復所有隊友生命', cost: 5 },
      { name: '萬人敬仰', description: '根據影響力永久加成', cost: 4 },
    ],
    flavorText: '一人的善行，能改變整個世界',
    source_origin: 'Social_Impact',
    evidence_hash: 'sha256:l2',
    impact_metric: 100,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'LG-G-001',
    name: '永續治理皇冠',
    nameEn: 'Governance Throne',
    category: 'legendary',
    rarity: 'mythic',
    cost: 8,
    power: 80,
    defense: 80,
    hp: 0,
    description: '史上最完善治理體系',
    knowledgePoints: ['ESG Governance'],
    isoReference: 'GRI',
    esgType: 'G',
    stats: { E: 50, S: 50, G: 100, INT: 85, STR: 50, CHR: 80 },
    abilities: [
      { name: '治理鐵壁', description: '獲得無敵三回合', cost: 6 },
      { name: '透明之光', description: '消除所有debuff', cost: 3 },
    ],
    flavorText: '完美治理是永續的根本',
    source_origin: 'Governance_Archetype',
    evidence_hash: 'sha256:l3',
    impact_metric: 100,
    isSealed: true,
    status: 'Trustworthy',
  },
  {
    id: 'LG-ESG-001',
    name: '六德聖徽',
    nameEn: 'Six Virtues',
    category: 'legendary',
    rarity: 'mythic',
    cost: 10,
    power: 150,
    defense: 100,
    hp: 100,
    description: '集齊六德最高象徵',
    knowledgePoints: ['Six Virtues'],
    esgType: 'ESG',
    stats: { E: 80, S: 80, G: 80, INT: 100, STR: 80, CHR: 100 },
    abilities: [
      { name: '六德合一', description: '發動所有六德效果', cost: 8 },
      { name: '聖光普照', description: '敵方全場重創', cost: 6 },
    ],
    flavorText: '當六德合一，世間再無永續難題',
    source_origin: 'Six_Virtues',
    evidence_hash: 'sha256:l4',
    impact_metric: 100,
    isSealed: true,
    status: 'Trustworthy',
  },
];

const CAMPAIGN_STAGES = [
  {
    id: 's1',
    name: '碳足跡覺醒',
    nameEn: 'Carbon Awakening',
    desc: '覺醒！了解企業碳排放現況',
    diff: 'easy',
    lvl: 1,
    enemy: '🌱',
    hp: 50,
    xp: 100,
    tokens: 50,
  },
  {
    id: 's2',
    name: '節能大作戰',
    nameEn: 'Energy Battle',
    desc: '啟動節能計畫戰勝能源怪',
    diff: 'easy',
    lvl: 3,
    enemy: '⚡',
    hp: 70,
    xp: 150,
    tokens: 75,
  },
  {
    id: 's3',
    name: '多元共融挑戰',
    nameEn: 'DEI Challenge',
    desc: '建立多元團隊戰勝偏見',
    diff: 'normal',
    lvl: 5,
    enemy: '🧱',
    hp: 100,
    xp: 250,
    tokens: 125,
  },
  {
    id: 's4',
    name: '供應鏈風暴',
    nameEn: 'Supply Storm',
    desc: '穿越複雜供應鏈找出源頭',
    diff: 'normal',
    lvl: 7,
    enemy: '🌫️',
    hp: 120,
    xp: 350,
    tokens: 175,
  },
  {
    id: 's5',
    name: '治理黑暗騎士',
    nameEn: 'Governance Knight',
    desc: '揭露黑箱迎接透明光芒',
    diff: 'hard',
    lvl: 10,
    enemy: '🖤',
    hp: 150,
    xp: 500,
    tokens: 250,
  },
  {
    id: 's6',
    name: '碳中和終極之戰',
    nameEn: 'Carbon Final',
    desc: '達成碳中和最後一哩路',
    diff: 'nightmare',
    lvl: 15,
    enemy: '🔥',
    hp: 200,
    xp: 1000,
    tokens: 500,
  },
];

// Avatar & Digital Twin System
export interface IAvatar {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  description: string;
  job: string;
  virtues: { INT: number; WIS: number; STR: number; CHR: number; VIT: number; DEX: number };
  skills: {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    level: number;
    maxLevel: number;
    effect: string;
  }[];
  talents: string[];
  unlocked: boolean;
}

export const AVATARS: IAvatar[] = [
  {
    id: 'a1',
    name: '永續學者',
    nameEn: 'Scholar',
    avatar: '📚',
    description: '熱愛學習ESG知識',
    job: '學者',
    virtues: { INT: 10, WIS: 8, STR: 3, CHR: 5, VIT: 5, DEX: 4 },
    skills: [
      {
        id: 's1',
        name: '知識萃取',
        nameEn: 'Knowledge',
        description: '額外知識點',
        level: 1,
        maxLevel: 5,
        effect: '+1',
      },
    ],
    talents: ['知識博覽'],
    unlocked: true,
  },
  {
    id: 'a2',
    name: '綠色戰士',
    nameEn: 'Warrior',
    avatar: '⚔️',
    description: '以行動實踐永續',
    job: '戰士',
    virtues: { INT: 3, WIS: 5, STR: 10, CHR: 4, VIT: 8, DEX: 5 },
    skills: [
      {
        id: 's2',
        name: '綠色衝擊',
        nameEn: 'Strike',
        description: '環境傷害',
        level: 1,
        maxLevel: 5,
        effect: '+5',
      },
    ],
    talents: ['戰鬥大師'],
    unlocked: true,
  },
  {
    id: 'a3',
    name: '社會使徒',
    nameEn: 'Priest',
    avatar: '💝',
    description: '傳播社會價值',
    job: '牧師',
    virtues: { INT: 5, WIS: 6, STR: 4, CHR: 10, VIT: 6, DEX: 4 },
    skills: [
      {
        id: 's3',
        name: '共融之光',
        nameEn: 'Unity',
        description: '治療',
        level: 1,
        maxLevel: 5,
        effect: '+15',
      },
    ],
    talents: ['治療者'],
    unlocked: true,
  },
  {
    id: 'a4',
    name: '治理賢者',
    nameEn: 'Sage',
    avatar: '🏛️',
    description: '追求完美治理',
    job: '法師',
    virtues: { INT: 8, WIS: 10, STR: 3, CHR: 6, VIT: 4, DEX: 4 },
    skills: [
      {
        id: 's4',
        name: '透明結界',
        nameEn: 'Shield',
        description: '防護',
        level: 1,
        maxLevel: 5,
        effect: '+20',
      },
    ],
    talents: ['策略家'],
    unlocked: true,
  },
  {
    id: 'a5',
    name: '創意發明家',
    nameEn: 'Inventor',
    avatar: '💡',
    description: '創新解決問題',
    job: '工程師',
    virtues: { INT: 7, WIS: 7, STR: 5, CHR: 3, VIT: 5, DEX: 8 },
    skills: [
      {
        id: 's5',
        name: '節能裝置',
        nameEn: 'Efficiency',
        description: '減少消耗',
        level: 1,
        maxLevel: 5,
        effect: '-1',
      },
    ],
    talents: ['發明家'],
    unlocked: false,
  },
  {
    id: 'a6',
    name: '自然遊俠',
    nameEn: 'Ranger',
    avatar: '🌿',
    description: '與自然合一',
    job: '遊俠',
    virtues: { INT: 4, WIS: 6, STR: 6, CHR: 5, VIT: 6, DEX: 10 },
    skills: [
      {
        id: 's6',
        name: '自然之力',
        nameEn: 'Nature',
        description: '自然攻擊',
        level: 1,
        maxLevel: 5,
        effect: '+10',
      },
    ],
    talents: ['追跡者'],
    unlocked: false,
  },
];

// 善向永續村莊 NPC
export interface INPC {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  role: string;
  description: string;
  services: { id: string; name: string; description: string; cost: number }[];
  unlocked: boolean;
}

export const VILLAGE_NPCS: INPC[] = [
  {
    id: 'npc1',
    name: '善向永續',
    nameEn: 'GoodDirection',
    avatar: '🌱',
    role: '村莊管理員',
    description: '善向永續村的村長，負責村莊的營運與發展',
    services: [
      { id: 's1', name: '村莊任務', description: '領取每日任務', cost: 0 },
      { id: 's2', name: '商店採購', description: '購買基礎物資', cost: 50 },
      { id: 's3', name: '村莊升級', description: '建設村莊設施', cost: 200 },
    ],
    unlocked: true,
  },
  {
    id: 'npc2',
    name: '君愛元鑰',
    nameEn: 'JunAiKey',
    avatar: '🔑',
    role: 'AI 助手',
    description: '您的專屬 AI 永續顧問，隨時提供 ESG 知識解答',
    services: [
      { id: 's1', name: '知識諮詢', description: '解答 ESG 問題', cost: 10 },
      { id: 's2', name: '卡牌推薦', description: '根據局勢推薦卡牌', cost: 20 },
      { id: 's3', name: '戰鬥指導', description: '戰鬥策略建議', cost: 30 },
    ],
    unlocked: true,
  },
  {
    id: 'npc3',
    name: '山衛科技',
    nameEn: 'MountainGuard',
    avatar: '🛡️',
    role: '科技商店',
    description: '提供高科技永續解決方案與資安服務',
    services: [
      { id: 's1', name: '科技商品', description: '購買科技道具', cost: 100 },
      { id: 's2', name: '數據分析', description: '分析戰鬥數據', cost: 50 },
      { id: 's3', name: '系統升級', description: '升級帳號功能', cost: 300 },
    ],
    unlocked: true,
  },
  {
    id: 'npc4',
    name: '全人測評',
    nameEn: 'HolisticAssessment',
    avatar: '📊',
    role: '測評中心',
    description: '專業的 ESG 能力評估與認證服務',
    services: [
      { id: 's1', name: '能力測評', description: '評估你的實力', cost: 0 },
      { id: 's2', name: '認證考試', description: '獲取專業認證', cost: 150 },
      { id: 's3', name: '排行榜', description: '查看全服排名', cost: 0 },
    ],
    unlocked: true,
  },
  {
    id: 'npc5',
    name: '墾趣',
    nameEn: 'EcoAdventure',
    avatar: '🏕️',
    role: '戶外商店',
    description: '戶外活動與生態旅遊裝備專賣店',
    services: [
      { id: 's1', name: '戶外裝備', description: '購買戶外道具', cost: 80 },
      { id: 's2', name: '生態體驗', description: '參與生態活動', cost: 100 },
      { id: 's3', name: '知識分享', description: '獲取環保知識', cost: 20 },
    ],
    unlocked: true,
  },
  {
    id: 'npc6',
    name: '語言步驟',
    nameEn: 'LanguageSteps',
    avatar: '📚',
    role: '語言學校',
    description: '學習國際 ESG 術語與跨文化溝通',
    services: [
      { id: 's1', name: '語言課程', description: '學習 ESG 英文', cost: 60 },
      { id: 's2', name: '翻譯服務', description: '翻譯卡牌說明', cost: 15 },
      { id: 's3', name: '文化交流', description: '了解國際標準', cost: 40 },
    ],
    unlocked: true,
  },
  {
    id: 'npc7',
    name: '王道阿丹',
    nameEn: 'KingDan',
    avatar: '👑',
    role: '傳奇導師',
    description: '傳說中的 ESG 大師，傳授終極智慧',
    services: [
      { id: 's1', name: '終極指導', description: '獲得傳奇卡牌線索', cost: 500 },
      { id: 's2', name: '王道路線', description: '開啟王者之路任務', cost: 1000 },
      { id: 's3', name: '王者挑戰', description: '接受王者試煉', cost: 2000 },
    ],
    unlocked: false,
  },
];

// Dr. Thoth Mentor
const DrThoth: React.FC<{ message: string; isDark: boolean; onClose?: () => void }> = ({
  message,
  isDark,
  onClose,
}) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="fixed bottom-6 right-6 z-50 flex items-end gap-4"
  >
    <div
      className={`${isDark ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-md border border-amber-500/30 p-4 rounded-t-2xl rounded-bl-2xl max-w-md shadow-xl`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-400 text-xs font-mono">[DR. THOTH]</span>
        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
      </div>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {message}
      </p>
      {onClose && (
        <button onClick={onClose} className="mt-3 text-xs text-amber-400 hover:underline">
          知道了
        </button>
      )}
    </div>
    <div
      className={`w-16 h-16 rounded-full border-2 border-amber-500 ${isDark ? 'bg-slate-900' : 'bg-amber-50'} flex items-center justify-center text-4xl shadow-lg`}
    >
      🦉
    </div>
  </motion.div>
);

const CardDisplay: React.FC<{ card: ITCGCard | null; isDark: boolean; onClose: () => void }> = ({
  card,
  isDark,
  onClose,
}) => {
  if (!card) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`max-w-lg w-full rounded-2xl border-2 ${
          isDark ? 'bg-slate-800 border-amber-500/50' : 'bg-white border-amber-300'
        } p-6 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              {card.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {card.nameEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
          >
            ✕
          </button>
        </div>
        <div className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {card.description}
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className={`p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-amber-50'}`}>
            ⚡ {card.cost}
          </div>
          <div className={`p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-amber-50'}`}>
            💪 {card.power}
          </div>
          <div className={`p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-amber-50'}`}>
            🛡️ {card.defense}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

type TabType = 'collection' | 'deck' | 'avatar' | 'campaign' | 'pvp' | 'trade' | 'village';

const CardItem: React.FC<{
  card: ITCGCard;
  isDark: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}> = ({ card, isDark, onClick, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-16 h-22' : 'w-28 h-40';
  const rarityColors: Record<string, string> = {
    common: isDark ? 'border-slate-500' : 'border-gray-300',
    uncommon: isDark ? 'border-green-500' : 'border-green-400',
    rare: isDark ? 'border-blue-500' : 'border-blue-400',
    epic: isDark ? 'border-purple-500' : 'border-purple-400',
    legendary: isDark ? 'border-amber-500' : 'border-amber-400',
    mythic: isDark ? 'border-red-500' : 'border-red-500',
  };

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses} rounded-lg border-2 ${rarityColors[card.rarity]} ${
        isDark ? 'bg-slate-800' : 'bg-white'
      } p-2 cursor-pointer hover:scale-105 transition-transform flex flex-col`}
    >
      <div className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'} truncate`}>
        {card.name}
      </div>
      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-gray-500'} truncate`}>
        {card.nameEn}
      </div>
      <div className="flex-1 flex items-center justify-center text-2xl">
        {card.esgType === 'E'
          ? '🌱'
          : card.esgType === 'S'
            ? '❤️'
            : card.esgType === 'G'
              ? '⚖️'
              : '🌍'}
      </div>
      <div className="flex justify-between text-[10px] mt-auto">
        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>⚡{card.cost}</span>
        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>💪{card.power}</span>
      </div>
    </div>
  );
};

interface TutorialStep {
  id: number;
  title: string;
  titleEn: string;
  content: string;
  highlight?: string;
  action?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: '🌟 歡迎來到萬能卡牌世界',
    titleEn: 'Welcome to OmniCard Universe',
    content:
      '我是壽星博士 Dr. Thoth，將引導你進入 ESG 永續知識的奇幻世界！在這裡，你將收集卡牌、組建套牌、挑戰敵人，成為真正的永續大師！',
  },
  {
    id: 2,
    title: '🃏 什麼是萬能卡牌？',
    titleEn: 'What is OmniCard?',
    content:
      '萬能卡牌是 ESG 知識的結晶！每張卡牌代表一個永續概念：\n\n📚 知識卡：學習專業知識\n⚡ 行動卡：執行永續策略\n❤️ 關係卡：建立人脈合作\n💎 資源卡：獲取實際資源\n👑 傳說卡：超稀有神話卡',
    highlight: 'collection',
  },
  {
    id: 3,
    title: '🎯 卡牌戰鬥機制',
    titleEn: 'Card Battle System',
    content:
      '戰鬥是回合制的卡牌對戰：\n\n1️⃣ 每回合開始獲得 3 能量\n2️⃣ 消耗能量使用卡牌\n3️⃣ 攻擊力造成傷害\n4️⃣ 防禦力減少受到的傷害\n5️⃣ 消滅敵人獲得勝利！\n\n💡 提示：善用屬性相剋（E→S→G）可以造成額外傷害！',
    highlight: 'campaign',
  },
  {
    id: 4,
    title: '📖 ESG 知識點系統',
    titleEn: 'ESG Knowledge Points',
    content:
      '每張卡牌都蘊含 ESG 專業知識：\n\n🌿 環境 E：碳排放、能源效率、循環經濟\n❤️ 社會 S：DEI、員工福利、社區參與\n🏛️ 治理 G：透明治理、風險管理、報告標準\n\n收集卡牌同時學習永續知識！',
  },
  {
    id: 5,
    title: '🎴 套牌構築',
    titleEn: 'Deck Building',
    content:
      '組建你的專屬套牌（最多5張）：\n\n1. 選擇你喜歡的卡牌\n2. 注意費用平衡（1-10）\n3. 搭配攻擊與防禦\n4. 找出最佳策略組合！\n\n💡 新手建議：先用費用低的卡牌熟悉規則',
    highlight: 'deck',
  },
  {
    id: 6,
    title: '⚔️ 戰役冒險',
    titleEn: 'Campaign Adventure',
    content:
      '踏上永續英雄的旅程：\n\n🌱 碳足跡覺醒 → ⚡ 節能大作戰\n🧱 多元共融挑戰 → 🌫️ 供應鏈風暴\n🖤 治理黑暗騎士 → 🔥 碳中和終極之戰\n\n每關戰勝獲得 XP、代幣、稀有卡牌！',
    highlight: 'campaign',
  },
  {
    id: 7,
    title: '🛡️ 5T 協議驗證',
    titleEn: '5T Protocol Verification',
    content:
      '所有卡牌都經過 5T 協議驗證，確保知識真實可靠：\n\n🟢 可感知 Tangible：impact_metric 量化指標\n🟢 可溯源 Traceable：source_origin 來源追蹤\n🟢 可追蹤 Trackable：lifecycle_stage 生命週期\n🟢 可透明 Transparent：isoReference ISO 標準\n🟢 不可篡改 Trustworthy：SHA-256 驗證',
  },
  {
    id: 8,
    title: '🚀 準備啟程！',
    titleEn: 'Ready to Start!',
    content:
      '你已完成新手教學！\n\n現在你可以：\n📚 瀏覽收藏的卡牌\n🎴 組建你的第一套牌\n⚔️ 挑戰第一個關卡\n🏆 與其他玩家對戰\n\n記住：永續之路，永遠不嫌晚！\n\n讓我們開始冒險吧！🎉',
    action: 'start',
  },
];

// TCG 遊戲存檔接口
export interface ITCGGameSave {
  version: string;
  lastSaved: number;
  player: {
    level: number;
    xp: number;
    tokens: number;
    rank: number;
    wins: number;
    losses: number;
  };
  selectedAvatarId: string | null;
  unlockedAvatars: string[];
  avatarSkills: Record<string, { skillId: string; level: number }[]>;
  unlockedNPCs: string[];
  npcRelationships: Record<string, number>;
  completedStages: string[];
  ownedCards: string[];
  deck: string[];
  tutorialComplete: boolean;
}

const DEFAULT_GAME_SAVE: ITCGGameSave = {
  version: '1.0.0',
  lastSaved: Date.now(),
  player: {
    level: 1,
    xp: 0,
    tokens: 100,
    rank: 999,
    wins: 0,
    losses: 0,
  },
  selectedAvatarId: null,
  unlockedAvatars: ['a1', 'a2', 'a3'],
  avatarSkills: {
    a1: [{ skillId: 's1', level: 1 }],
    a2: [{ skillId: 's2', level: 1 }],
    a3: [{ skillId: 's3', level: 1 }],
  },
  unlockedNPCs: ['npc1', 'npc2', 'npc3', 'npc4', 'npc5', 'npc6'],
  npcRelationships: {
    npc1: 50,
    npc2: 30,
    npc3: 20,
    npc4: 40,
    npc5: 10,
    npc6: 15,
    npc7: 0,
  },
  completedStages: [],
  ownedCards: ALL_CARDS.slice(0, 8).map(c => c.id),
  deck: [],
  tutorialComplete: false,
};

const STORAGE_KEY = 'omniCardTCG_gameSave';

const loadGameSave = (): ITCGGameSave => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ITCGGameSave;
      return { ...DEFAULT_GAME_SAVE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load game save:', e);
  }
  return DEFAULT_GAME_SAVE;
};

const saveGameSave = (save: ITCGGameSave) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...save, lastSaved: Date.now() }));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
};

const OmniCardTCGPage: React.FC = () => {
  const { theme } = useOmniTheme();
  const isDark = theme === 'midnight' || theme === 'moon' || theme === 'cyber';

  // 遊戲存檔狀態
  const [gameSave, setGameSave] = useState<ITCGGameSave>(loadGameSave);

  // 自動存檔
  useEffect(() => {
    saveGameSave(gameSave);
  }, [gameSave]);

  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [showRules, setShowRules] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(gameSave.tutorialComplete);
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [rarity, setRarity] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<ITCGCard | null>(null);
  const [battleStage, setBattleStage] = useState<(typeof CAMPAIGN_STAGES)[0] | null>(null);
  const [battleResult, setBattleResult] = useState<'none' | 'win' | 'lose'>('none');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // 從存檔初始化套牌
  const [deck, setDeck] = useState<ITCGCard[]>(() => {
    return gameSave.deck.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean) as ITCGCard[];
  });

  // 同步套牌到存檔
  useEffect(() => {
    setGameSave(prev => ({ ...prev, deck: deck.map(c => c.id) }));
  }, [deck]);

  // 同步教學狀態到存檔
  useEffect(() => {
    setGameSave(prev => ({ ...prev, tutorialComplete }));
  }, [tutorialComplete]);

  // 戰鬥狀態
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(50);
  const [energy, setEnergy] = useState(3);
  const [hand, setHand] = useState<ITCGCard[]>([]);

  // NPC 互動狀態
  const [selectedNPC, setSelectedNPC] = useState<INPC | null>(null);
  const [npcMessage, setNpcMessage] = useState<string>('');

  // 處理 NPC 服務互動
  const handleNPCService = (npc: INPC, service: { id: string; name: string; cost: number }) => {
    if (gameSave.player.tokens < service.cost) {
      setNpcMessage(
        `⚠️ 代幣不足！需要 ${service.cost} 代幣，你現在有 ${gameSave.player.tokens} 代幣。`
      );
      setSelectedNPC(npc);
      return;
    }

    // 扣除代幣
    setGameSave(prev => ({
      ...prev,
      player: { ...prev.player, tokens: prev.player.tokens - service.cost },
      npcRelationships: {
        ...prev.npcRelationships,
        [npc.id]: (prev.npcRelationships[npc.id] || 0) + 10,
      },
    }));

    // 根據服務給予回饋
    let response = '';
    switch (service.id) {
      case 's1':
        response =
          npc.id === 'npc1'
            ? '🎯 今日任務：收集 5 張知識卡！'
            : npc.id === 'npc2'
              ? '💡 ESG 知識：碳中和是指通過減少排放和抵消來實現净零排放。'
              : npc.id === 'npc3'
                ? '🛡️ 科技提示：最新的碳足跡計算工具已上線！'
                : npc.id === 'npc4'
                  ? '📊 測評結果：你的環境意識達到 B+ 等級！'
                  : npc.id === 'npc5'
                    ? '🌿 戶外知識：種植一棵樹每天可吸收約 21kg CO₂。'
                    : '📚 語言技巧：Sustainable Development Goals (SDGs) 永續發展目標！';
        break;
      case 's2':
        response =
          npc.id === 'npc1'
            ? '🏪 商店已開放，更多商品即將上架！'
            : npc.id === 'npc2'
              ? '🃏 推薦卡牌：範疇三排放分析，讓你了解供應鏈碳排放！'
              : npc.id === 'npc3'
                ? '📈 數據分析：你的戰鬥勝率為 65%，表現優異！'
                : npc.id === 'npc4'
                  ? '📜 認證考試：下次考試日期為月底，請準備！'
                  : npc.id === 'npc5'
                    ? '🎒 戶外裝備：新手背包讓你獲得額外 10% 經驗！'
                    : '🔤 Translation: Carbon Footprint = 碳足跡';
        break;
      case 's3':
        response =
          npc.id === 'npc1'
            ? '🏗️ 村莊升級成功！解鎖新建築：永續學院！'
            : npc.id === 'npc2'
              ? '⚔️ 戰鬥策略：記住，先用知識卡削弱敵人，再用行動卡給予重擊！'
              : npc.id === 'npc3'
                ? '⚡ 系統升級：戰鬥動畫效果已開啟！'
                : npc.id === 'npc4'
                  ? '🏆 排行榜：目前你在全服排名第 42 位！'
                  : npc.id === 'npc5'
                    ? '🌱 生態體驗：下週將舉辦森林探索活動！'
                    : '🌏 文化交流：ISO 14064 是最新的碳盤查國際標準！';
        break;
      default:
        response = `✅ 感謝使用 ${npc.name} 的服務！`;
    }

    setNpcMessage(response);
    setSelectedNPC(npc);
  };

  // 計算玩家屬性（含 Avatar 加成）
  const getAvatarBonus = () => {
    if (!gameSave.selectedAvatarId) return { power: 0, defense: 0, hp: 0 };
    const avatar = AVATARS.find(a => a.id === gameSave.selectedAvatarId);
    if (!avatar) return { power: 0, defense: 0, hp: 0 };

    const skillLevels = gameSave.avatarSkills[avatar.id] || [];
    const bonus = { power: 0, defense: 0, hp: 0 };

    skillLevels.forEach(s => {
      if (s.skillId === 's1' || s.skillId === 's2') bonus.power += s.level * 5;
      if (s.skillId === 's3' || s.skillId === 's4') bonus.defense += s.level * 3;
      if (s.skillId === 's5' || s.skillId === 's6') bonus.hp += s.level * 10;
    });

    return bonus;
  };

  const avatarBonus = getAvatarBonus();

  // 玩家資料（從存檔讀取）
  const playerProfile = {
    level: gameSave.player.level,
    xp: gameSave.player.xp,
    tokens: gameSave.player.tokens,
    rank: gameSave.player.rank,
    wins: gameSave.player.wins,
    losses: gameSave.player.losses,
    winRate:
      gameSave.player.wins + gameSave.player.losses > 0
        ? Math.round((gameSave.player.wins / (gameSave.player.wins + gameSave.player.losses)) * 100)
        : 0,
  };

  const filteredCards = useMemo(
    () =>
      ALL_CARDS.filter(c => {
        const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.knowledgePoints.some(k => k.toLowerCase().includes(search.toLowerCase()));
        const matchCat = category === 'all' || c.category === category;
        const matchRar = rarity === 'all' || c.rarity === rarity;
        return matchSearch && matchCat && matchRar;
      }),
    [search, category, rarity]
  );

  const addToDeck = (card: ITCGCard) => {
    if (deck.length < 5 && !deck.find(c => c.id === card.id)) setDeck([...deck, card]);
  };
  const removeFromDeck = (id: string) => setDeck(deck.filter(c => c.id !== id));

  const startBattle = (stage: (typeof CAMPAIGN_STAGES)[0]) => {
    setBattleStage(stage);
    setEnemyHp(stage.hp);
    setPlayerHp(100);
    setEnergy(3);
    setHand(ALL_CARDS.slice(0, 4));
    setBattleResult('none');
    setIsPlayerTurn(true);
  };

  const playCard = (card: ITCGCard) => {
    if (!isPlayerTurn || energy < card.cost || battleResult !== 'none') return;
    setEnergy(energy - card.cost);
    setHand(hand.filter(c => c.id !== card.id));
    const damage = Math.max(0, card.power - Math.floor(enemyHp / 10));
    setEnemyHp(Math.max(0, enemyHp - damage));
    if (enemyHp - damage <= 0) {
      setBattleResult('win');
      return;
    }
    setIsPlayerTurn(false);
    setTimeout(() => {
      const edmg = Math.floor(Math.random() * 15) + 5;
      setPlayerHp(Math.max(0, playerHp - edmg));
      if (playerHp - edmg <= 0) setBattleResult('lose');
      else {
        setEnergy(3);
        setIsPlayerTurn(true);
      }
    }, 1000);
  };

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50';
  const textClass = isDark ? 'text-white' : 'text-slate-800';
  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-amber-200';
  const inputClass = isDark
    ? 'bg-slate-800/50 border-slate-700 text-white'
    : 'bg-white border-amber-200 text-slate-800';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-6 transition-colors duration-500`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className={`p-2 rounded-lg ${cardClass}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
              🃏 萬能卡牌 TCG
            </h1>
            <p className={mutedClass}>ESG 知識點 × 集換式收藏 × 戰役冒險</p>
          </div>
        </div>
        <div className={`flex items-center gap-6 ${cardClass} px-4 py-2 rounded-xl`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧙</span>
            <div>
              <p className={`text-sm ${mutedClass}`}>Lv.{playerProfile.level}</p>
              <p className="text-yellow-400 font-bold">{playerProfile.xp} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold">{playerProfile.tokens}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold">#{playerProfile.rank}</span>
          </div>
          <button
            onClick={() => setShowRules(true)}
            className={`p-2 rounded-lg ${cardClass} hover:text-amber-400`}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {!tutorialComplete && (
            <button
              onClick={() => {
                setCurrentTutorial(1);
                setTutorialComplete(false);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:from-amber-400 hover:to-yellow-400 transition-all"
            >
              🦉 新手教學
            </button>
          )}
        </div>
      </div>

      {/* Dr. Thoth Tutorial */}
      {!tutorialComplete &&
        currentTutorial >= 1 &&
        currentTutorial <= TUTORIAL_STEPS.length &&
        TUTORIAL_STEPS[currentTutorial - 1] && (
          <DrThoth
            message={TUTORIAL_STEPS[currentTutorial - 1]?.content || ''}
            isDark={isDark}
            onClose={() => {
              if (currentTutorial >= TUTORIAL_STEPS.length) {
                setTutorialComplete(true);
                localStorage.setItem('omniCardTCG_tutorial', 'true');
              } else {
                setCurrentTutorial(currentTutorial + 1);
              }
            }}
          />
        )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { id: 'collection', label: '📚 卡牌收藏', icon: WalletCards },
          { id: 'deck', label: '🎴 套牌構築', icon: Zap },
          { id: 'avatar', label: '👤 數位分身', icon: Sparkles },
          { id: 'campaign', label: '⚔️ 戰役冒險', icon: Target },
          { id: 'pvp', label: '🏆 玩家對戰', icon: Swords },
          { id: 'trade', label: '💱 交易所', icon: ShoppingCart },
          { id: 'village', label: '🏘️ 村莊', icon: Globe },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30' : `${cardClass} ${mutedClass} hover:text-white`}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'collection' && (
          <motion.div
            key="c"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`}
                />
                <input
                  type="text"
                  placeholder="搜尋卡牌..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 ${inputClass} rounded-lg focus:border-amber-500/50 focus:outline-none`}
                />
              </div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={`px-4 py-2 ${inputClass} rounded-lg`}
              >
                <option value="all">全部類型</option>
                <option value="knowledge">📚 知識卡</option>
                <option value="action">⚡ 行動卡</option>
                <option value="relationship">❤️ 關係卡</option>
                <option value="resource">💎 資源卡</option>
                <option value="legendary">👑 傳說卡</option>
              </select>
              <select
                value={rarity}
                onChange={e => setRarity(e.target.value)}
                className={`px-4 py-2 ${inputClass} rounded-lg`}
              >
                <option value="all">全部稀有度</option>
                <option value="common">⚪ 普通</option>
                <option value="uncommon">🟢 罕見</option>
                <option value="rare">🔵 稀有</option>
                <option value="epic">🟣 史詩</option>
                <option value="legendary">🟡 傳說</option>
                <option value="mythic">🔴 神話</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCards.map(card => (
                <CardItem
                  key={card.id}
                  card={card}
                  isDark={isDark}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
            </div>
            <p className={`mt-6 text-center ${mutedClass}`}>共 {filteredCards.length} 張卡牌</p>
          </motion.div>
        )}

        {activeTab === 'deck' && (
          <motion.div
            key="d"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className={`${cardClass} rounded-xl p-6`}>
              <h3 className="text-xl font-bold mb-4">🎴 我的套牌</h3>
              <p className={`${mutedClass} mb-4`}>
                套牌數量：
                <span
                  className={`font-bold ${deck.length === 5 ? 'text-green-400' : 'text-yellow-400'}`}
                >
                  {deck.length}/5
                </span>
              </p>
              <div
                className={`flex flex-wrap gap-2 min-h-[150px] p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-amber-50/50'}`}
              >
                {deck.length === 0 ? (
                  <p className={`${mutedClass} text-center w-full py-8`}>點擊下方卡牌添加到套牌</p>
                ) : (
                  deck.map(c => (
                    <motion.div
                      key={c.id}
                      layout
                      className={`w-16 h-22 rounded-lg overflow-hidden cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-amber-100'} relative`}
                      onClick={() => removeFromDeck(c.id)}
                    >
                      <div className="p-1 flex flex-col h-full">
                        <span className="text-[8px] text-yellow-400">{c.cost}⚡</span>
                        <div className="flex-1 flex items-center justify-center">
                          {c.category === 'legendary' ? (
                            <Crown className="w-4 h-4 text-amber-400" />
                          ) : c.category === 'knowledge' ? (
                            <Brain className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Zap className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <span className="text-[8px] truncate">{c.name}</span>
                      </div>
                      <button className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              <button
                disabled={deck.length !== 5}
                className={`w-full mt-4 py-2 rounded-lg font-bold transition-all ${deck.length === 5 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-700 text-slate-500'}`}
              >
                💾 儲存套牌
              </button>
            </div>
            <div className={`${cardClass} rounded-xl p-6`}>
              <h3 className="text-xl font-bold mb-4">🃏 可用卡牌</h3>
              <p className={`${mutedClass} text-sm mb-4`}>點擊卡牌添加到套牌</p>
              <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto p-2">
                {ALL_CARDS.map(card => (
                  <button
                    key={card.id}
                    onClick={() => addToDeck(card)}
                    disabled={deck.length >= 5 || !!deck.find(c => c.id === card.id)}
                    className={`p-2 rounded-lg text-left transition-all ${deck.find(c => c.id === card.id) ? 'bg-amber-500/20 border border-amber-500/50' : `${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-amber-100 border-amber-200'} hover:border-amber-400/50`} ${deck.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] text-amber-400">{card.cost}⚡</span>
                      <span
                        className={`text-[8px] ${card.rarity === 'mythic' ? 'text-rose-400' : card.rarity === 'legendary' ? 'text-amber-400' : 'text-slate-400'}`}
                      >
                        {card.rarity}
                      </span>
                    </div>
                    <p className="text-xs truncate mt-1">{card.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'campaign' && !battleStage && (
          <motion.div
            key="cp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">⚔️ 戰役冒險</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAMPAIGN_STAGES.map(stage => (
                <motion.div
                  key={stage.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50' : 'bg-white border-amber-200 hover:border-amber-400'}`}
                  onClick={() => startBattle(stage)}
                >
                  <div className="flex justify-between mb-4">
                    <span className="text-4xl">{stage.enemy}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${stage.diff === 'easy' ? 'bg-green-500/20 text-green-400' : stage.diff === 'normal' ? 'bg-blue-500/20 text-blue-400' : stage.diff === 'hard' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {stage.diff}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{stage.name}</h3>
                  <p className={`text-sm ${mutedClass} mb-2`}>{stage.nameEn}</p>
                  <p className={`text-xs ${mutedClass} mb-4`}>{stage.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${mutedClass}`}>Lv.{stage.lvl}+</span>
                    <span className={`text-xs ${mutedClass}`}>💰 {stage.xp} XP</span>
                  </div>
                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg font-bold text-slate-900">
                    開始挑戰
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'campaign' && battleStage && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setBattleStage(null)}
                className={`flex items-center gap-2 ${mutedClass} hover:text-white`}
              >
                <ChevronLeft className="w-5 h-5" />
                返回
              </button>
              <h2 className="text-xl font-bold">{battleStage.name}</h2>
              <div className="w-20" />
            </div>
            <div className={`${cardClass} rounded-2xl p-8 mb-6 relative overflow-hidden`}>
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={
                    battleResult === 'none'
                      ? { y: [0, -10, 0] }
                      : battleResult === 'win'
                        ? { rotate: [0, 360], scale: [1, 1.2, 0] }
                        : { scale: [1, 1.5, 0], opacity: [1, 0] }
                  }
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-2">{battleStage.enemy}</div>
                  <p className="font-bold">{battleStage.name}</p>
                  <div className="flex justify-center mt-2">
                    <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(enemyHp / battleStage.hp) * 100}%` }}
                      />
                    </div>
                    <span className="text-red-400 ml-2">
                      {enemyHp}/{battleStage.hp}
                    </span>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-center mb-8">
                <span className="text-4xl font-black text-slate-600">VS</span>
              </div>
              <div className="flex justify-center">
                <motion.div
                  animate={
                    battleResult === 'none'
                      ? { y: [0, 5, 0] }
                      : battleResult === 'win'
                        ? { scale: [1, 1.2, 1] }
                        : { opacity: 0.5 }
                  }
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-2">🧙</div>
                  <p className="font-bold">永續冒險者</p>
                  <div className="flex justify-center mt-2">
                    <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: '100%' }}
                        animate={{ width: `${playerHp}%` }}
                      />
                    </div>
                    <span className="text-green-400 ml-2">{playerHp}/100</span>
                  </div>
                  <div className="flex justify-center mt-2 gap-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">{energy}/3</span>
                  </div>
                </motion.div>
              </div>
              {battleResult !== 'none' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl"
                >
                  <div className="text-center">
                    {battleResult === 'win' ? (
                      <>
                        <Trophy className="w-24 h-24 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-4xl font-bold text-amber-400 mb-2">戰鬥勝利！</h3>
                        <p className={mutedClass}>
                          +{battleStage.xp} XP, +{battleStage.tokens} 代幣
                        </p>
                      </>
                    ) : (
                      <>
                        <Skull className="w-24 h-24 text-red-400 mx-auto mb-4" />
                        <h3 className="text-4xl font-bold text-red-400 mb-2">戰鬥失敗</h3>
                      </>
                    )}
                    <button
                      onClick={() => setBattleStage(null)}
                      className="px-6 py-2 bg-slate-700 rounded-lg mt-4"
                    >
                      返回
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <div className={`${cardClass} rounded-xl p-4`}>
              <div className="flex justify-between mb-4">
                <h3 className="font-bold">🃏 手牌</h3>
                {isPlayerTurn && battleResult === 'none' && (
                  <button
                    onClick={() => {
                      setIsPlayerTurn(false);
                      setTimeout(() => {
                        setEnergy(3);
                        setIsPlayerTurn(true);
                      }, 1000);
                    }}
                    className="px-4 py-1 bg-slate-700 rounded-lg text-sm"
                  >
                    結束回合
                  </button>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {hand.map(card => (
                  <button
                    key={card.id}
                    onClick={() => playCard(card)}
                    disabled={!isPlayerTurn || energy < card.cost || battleResult !== 'none'}
                    className={
                      !isPlayerTurn || energy < card.cost ? 'opacity-40 cursor-not-allowed' : ''
                    }
                  >
                    <CardItem card={card} isDark={isDark} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pvp' && (
          <motion.div
            key="pvp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <Swords className="w-24 h-24 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">🏆 玩家對戰</h2>
            <p className={mutedClass}>與全球永續冒險者一決高下！</p>
            <div className={`max-w-md mx-auto ${cardClass} rounded-xl p-6 mt-6`}>
              <div className="space-y-4">
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white">
                  ⚔️ 快速對戰
                </button>
                <button className="w-full py-3 bg-slate-700 rounded-lg font-bold">
                  👥 好友對戰
                </button>
                <button className="w-full py-3 bg-slate-700 rounded-lg font-bold">🏆 排名賽</button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className={mutedClass}>我的排名</p>
                <p className="text-3xl font-bold text-purple-400">#{playerProfile.rank}</p>
                <div className="flex justify-center gap-6 mt-2">
                  <span className="text-green-400">{playerProfile.wins} 勝</span>
                  <span className="text-red-400">{playerProfile.losses} 敗</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'trade' && (
          <motion.div
            key="trade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">💱 卡牌交易所</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold">市場上架</h3>
                  <button className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                    + 上架卡牌
                  </button>
                </div>
                {[
                  { s: '永續達人A', c: '碳中和聖杯', p: 500 },
                  { s: '綠色小子', c: '範疇三排放分析', p: 200 },
                  { s: 'ESG大師', c: '節能改造方案', p: 150 },
                ].map((i, x) => (
                  <div
                    key={x}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{i.c}</p>
                        <p className="text-xs text-slate-500">賣家: {i.s}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
                      🪙 {i.p}
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="font-bold mb-4">我的上架</h3>
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">暫無上架卡牌</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className={mutedClass}>帳戶餘額</p>
                  <p className="text-2xl font-bold text-amber-400">{playerProfile.tokens} 代幣</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'avatar' && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">👤 數位分身 Avatar</h2>

            {/* 當前選擇的 Avatar */}
            {gameSave.selectedAvatarId && (
              <div className={`mb-6 p-4 rounded-xl ${cardClass}`}>
                <h3 className="font-bold mb-2">⚔️ 戰鬥加成</h3>
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-slate-500">攻擊力</p>
                    <p className="text-2xl font-bold text-red-400">+{avatarBonus.power}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">防禦力</p>
                    <p className="text-2xl font-bold text-blue-400">+{avatarBonus.defense}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">生命值</p>
                    <p className="text-2xl font-bold text-green-400">+{avatarBonus.hp}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVATARS.map(avatar => {
                const isSelected = gameSave.selectedAvatarId === avatar.id;
                const isUnlocked = gameSave.unlockedAvatars.includes(avatar.id);
                const skillLevels = gameSave.avatarSkills[avatar.id] || [];

                return (
                  <div
                    key={avatar.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setGameSave(prev => ({
                          ...prev,
                          selectedAvatarId: isSelected ? null : avatar.id,
                        }));
                      }
                    }}
                    className={`${cardClass} rounded-xl p-6 border-2 ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'hover:border-amber-500/50'} ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-all`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${isSelected ? 'bg-gradient-to-br from-amber-400 to-yellow-600 animate-pulse' : 'bg-gradient-to-br from-amber-400 to-yellow-600'}`}
                      >
                        {avatar.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{avatar.name}</h3>
                        <p className={`text-sm ${mutedClass}`}>{avatar.job}</p>
                        {isSelected && <span className="text-xs text-amber-400">✓ 已選擇</span>}
                        {!isUnlocked && <span className="text-xs text-red-400">🔒 未解鎖</span>}
                      </div>
                    </div>
                    <p className={`text-sm mb-4 ${mutedClass}`}>{avatar.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {Object.entries(avatar.virtues).map(([stat, value]) => (
                        <div
                          key={stat}
                          className={`text-center p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-amber-50'}`}
                        >
                          <p className="text-xs text-slate-500">{stat}</p>
                          <p className="font-bold text-amber-400">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {avatar.skills.map(skill => {
                        const userSkill = skillLevels.find(s => s.skillId === skill.id);
                        const currentLevel = userSkill?.level || 0;
                        return (
                          <div
                            key={skill.id}
                            className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700' : 'bg-amber-100'}`}
                          >
                            <span>{skill.name}</span>
                            <span className="text-amber-400">Lv.{currentLevel}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* 技能升級按鈕 */}
                    {isSelected && (
                      <div className="space-y-2">
                        {avatar.skills.map(skill => {
                          const userSkill = skillLevels.find(s => s.skillId === skill.id);
                          const currentLevel = userSkill?.level || 0;
                          const upgradeCost = currentLevel * 50;
                          const canUpgrade =
                            currentLevel < skill.maxLevel && gameSave.player.tokens >= upgradeCost;

                          return (
                            <button
                              key={skill.id}
                              disabled={!canUpgrade}
                              onClick={e => {
                                e.stopPropagation();
                                if (canUpgrade) {
                                  setGameSave(prev => {
                                    const newSkills = { ...prev.avatarSkills };
                                    const avatarSkillList = newSkills[avatar.id] || [];
                                    const existingSkillIndex = avatarSkillList.findIndex(
                                      s => s.skillId === skill.id
                                    );

                                    if (
                                      existingSkillIndex >= 0 &&
                                      avatarSkillList[existingSkillIndex]
                                    ) {
                                      avatarSkillList[existingSkillIndex]!.level += 1;
                                      newSkills[avatar.id] = avatarSkillList;
                                    } else {
                                      newSkills[avatar.id] = [
                                        ...avatarSkillList,
                                        { skillId: skill.id, level: 1 },
                                      ];
                                    }

                                    return {
                                      ...prev,
                                      player: {
                                        ...prev.player,
                                        tokens: prev.player.tokens - upgradeCost,
                                      },
                                      avatarSkills: newSkills,
                                    };
                                  });
                                }
                              }}
                              className={`w-full p-2 rounded text-sm text-left transition-all ${
                                canUpgrade
                                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {currentLevel >= skill.maxLevel
                                ? '⭐ 已滿級'
                                : `➕ 升級 ${skill.name} (🪙${upgradeCost})`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'village' && (
          <motion.div
            key="village"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">🏘️ 善向永續村莊</h2>

            {/* NPC 互動訊息 */}
            {npcMessage && (
              <div
                className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}
              >
                <p className={isDark ? 'text-gray-200' : 'text-gray-800'}>{npcMessage}</p>
                <button onClick={() => setNpcMessage('')} className="mt-2 text-sm text-amber-400">
                  ✕ 關閉
                </button>
              </div>
            )}

            {/* 村民關係顯示 */}
            <div className={`mb-6 p-4 rounded-xl ${cardClass}`}>
              <h3 className="font-bold mb-3">📈 村民關係</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(gameSave.npcRelationships).map(([npcId, value]) => {
                  const npc = VILLAGE_NPCS.find(n => n.id === npcId);
                  return npc ? (
                    <span
                      key={npcId}
                      className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-700' : 'bg-amber-100'}`}
                    >
                      {npc.avatar} {npc.name}: {value}%
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {VILLAGE_NPCS.map(npc => (
                <div
                  key={npc.id}
                  className={`${cardClass} rounded-xl p-6 border-2 ${npc.unlocked ? 'hover:border-amber-500/50' : 'opacity-60'} transition-all`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${npc.unlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : 'bg-slate-600'}`}
                    >
                      {npc.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{npc.name}</h3>
                      <p className={`text-xs ${mutedClass}`}>{npc.role}</p>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${mutedClass}`}>{npc.description}</p>
                  <div className="space-y-2">
                    {npc.services.map(service => (
                      <button
                        key={service.id}
                        disabled={!npc.unlocked}
                        onClick={() => handleNPCService(npc, service)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                          npc.unlocked
                            ? isDark
                              ? 'bg-slate-700 hover:bg-slate-600'
                              : 'bg-amber-50 hover:bg-amber-100'
                            : 'bg-slate-800/50 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm">{service.name}</p>
                          <p className={`text-xs ${mutedClass}`}>{service.description}</p>
                        </div>
                        <span
                          className={`text-sm font-bold ${service.cost === 0 ? 'text-green-400' : 'text-amber-400'}`}
                        >
                          {service.cost === 0 ? '免費' : `🪙${service.cost}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
              className={`${cardClass} rounded-2xl p-6 max-w-lg w-full`}
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedCard.name}</h3>
                  <p className={mutedClass}>{selectedCard.nameEn}</p>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${selectedCard.esgType === 'E' ? 'bg-emerald-500/20 text-emerald-400' : selectedCard.esgType === 'S' ? 'bg-pink-500/20 text-pink-400' : selectedCard.esgType === 'G' ? 'bg-blue-500/20 text-blue-400' : 'bg-gradient-to-r from-emerald-500 via-pink-500 to-blue-500 text-white'}`}
                >
                  {selectedCard.esgType === 'ESG'
                    ? '🌍 ESG'
                    : selectedCard.esgType === 'E'
                      ? '🌿 環境 E'
                      : selectedCard.esgType === 'S'
                        ? '❤️ 社會 S'
                        : '🏛️ 治理 G'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${selectedCard.rarity === 'mythic' ? 'bg-rose-500/20 text-rose-400' : selectedCard.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' : selectedCard.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}
                >
                  {selectedCard.rarity}
                </span>
              </div>
              <p className="mb-4">{selectedCard.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-red-400 font-bold text-lg">{selectedCard.power} ⚔️</p>
                  <p className="text-xs text-slate-500">攻擊</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-blue-400 font-bold text-lg">{selectedCard.defense} 🛡️</p>
                  <p className="text-xs text-slate-500">防禦</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 font-bold text-lg">{selectedCard.cost} ⚡</p>
                  <p className="text-xs text-slate-500">費用</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">📚 知識點</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.knowledgePoints.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700/50 rounded text-xs">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              {selectedCard.isoReference && (
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">📋 標準參照</p>
                  <p className="text-amber-400 text-sm font-mono">{selectedCard.isoReference}</p>
                </div>
              )}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                  <Shield className="w-4 h-4" />
                  5T 協議驗證
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">來源:</span>
                    <span>{selectedCard.source_origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">影響力:</span>
                    <span className="text-green-400">{selectedCard.impact_metric}%</span>
                  </div>
                </div>
              </div>
              {selectedCard.flavorText && (
                <p className="mt-4 text-slate-500 text-sm italic text-center">
                  "{selectedCard.flavorText}"
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OmniCardTCGPage;
