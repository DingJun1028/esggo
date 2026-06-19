/**
 * 🎭 善向永續村 AI RPG 卡牌遊戲 - NPC 角色數據定義
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * ============================================================================
 */

import { INPCCard, ISkill } from '@/types/npc';
import { ComponentCoreFactory, computeHash } from '@/services/ceremony';

/**
 * 共用技能工廠
 */
function createSkill(params: Omit<ISkill, 'id'>): ISkill {
  return {
    id: `skill-${params.nameZh.replace(/\s/g, '')}`,
    ...params,
  };
}

/**
 * 核心 NPC 角色卡數據
 */
export const NPC_CARDS: INPCCard[] = [
  // ========== 導師層 - 核心 NPC ==========
  {
    uuid: 'npc-thoth-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'mentor',
    pillar: 'Transparent',
    rs_base: 100,
    village_function: '永恆記憶庫管理者',
    visualStyle: '古埃及祭司風格，金色與青色配色，量子光暈環繞',
    esgStats: { E: 85, S: 95, G: 100 },
    skills: [
      createSkill({
        name: 'As Water Flows',
        nameZh: '上善若水',
        description: '全域自癒能力，恢復所有友方單位 RS',
        effectType: 'heal',
        potency: 50,
        cooldown: 3,
        rsCost: 20,
        targetType: 'all_allies',
      }),
    ],
  },
  {
    uuid: 'npc-wangdao-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'mentor',
    pillar: 'Truth',
    rs_base: 95,
    village_function: '技能煉金坊管理者',
    visualStyle: '王道風格，金屬與光澤質感，煉金術元素',
    esgStats: { E: 80, S: 88, G: 92 },
    skills: [
      createSkill({
        name: 'Unity of Heaven and Man',
        nameZh: '天人合一',
        description: '技能加速，縮短所有技能冷卻時間',
        effectType: 'buff',
        potency: 30,
        cooldown: 4,
        rsCost: 25,
        targetType: 'all_allies',
      }),
    ],
  },

  // ========== 四大支柱詠嘆級 NPC ==========
  {
    uuid: 'npc-sunway-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'guide',
    pillar: 'Truth',
    rs_base: 75,
    village_function: '真理脈衝廣播站',
    visualStyle: '科技感藍光風格，高頻脈衝視覺效果',
    esgStats: { E: 90, S: 70, G: 88 },
    skills: [
      createSkill({
        name: 'High Frequency Truth Pulse',
        nameZh: '高頻真理脈衝',
        description: '對敵方造成真理傷害，降低其防禦',
        effectType: 'damage',
        potency: 40,
        cooldown: 2,
        rsCost: 15,
        targetType: 'single',
      }),
    ],
  },
  {
    uuid: 'npc-kentchu-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'guide',
    pillar: 'Goodness',
    rs_base: 72,
    village_function: '野外共鳴路徑嚮導',
    visualStyle: '自然風格，綠色與大地色系，共鳴光絲',
    esgStats: { E: 95, S: 85, G: 75 },
    skills: [
      createSkill({
        name: 'Wild Resonance Path',
        nameZh: '野外共鳴路徑',
        description: '增加友方移動範圍與迴避率',
        effectType: 'buff',
        potency: 35,
        cooldown: 3,
        rsCost: 18,
        targetType: 'all_allies',
      }),
    ],
  },
  {
    uuid: 'npc-language-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'guide',
    pillar: 'Transparent',
    rs_base: 70,
    village_function: '清晰共鳴腔語言教室',
    visualStyle: '晶瑩剔透風格，透明光澤，語音符號漂浮',
    esgStats: { E: 72, S: 90, G: 92 },
    skills: [
      createSkill({
        name: 'Clear Resonance Cavity',
        nameZh: '清晰共鳴腔',
        description: '提升所有攻擊的準確度與暴擊率',
        effectType: 'buff',
        potency: 40,
        cooldown: 2,
        rsCost: 12,
        targetType: 'all_allies',
      }),
    ],
  },
  {
    uuid: 'npc-holistic-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'guardian',
    pillar: 'Trackable',
    rs_base: 78,
    village_function: '全人靈魂刻印工坊',
    visualStyle: '金色刻印風格，齒輪與星盤元素，精確刻度',
    esgStats: { E: 75, S: 88, G: 95 },
    skills: [
      createSkill({
        name: 'Holistic Soul Seal',
        nameZh: '全人靈魂刻印',
        description: '為目標施加永久刻印，提升基礎屬性',
        effectType: 'buff',
        potency: 50,
        cooldown: 5,
        rsCost: 30,
        targetType: 'single',
      }),
    ],
  },

  // ========== 夥伴層 NPC ==========
  {
    uuid: 'npc-sage-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'partner',
    pillar: 'Truth',
    rs_base: 60,
    village_function: '智慧圖書館管理員',
    visualStyle: '賢者風格，古卷與星塵，柔和金光',
    esgStats: { E: 65, S: 75, G: 80 },
    skills: [
      createSkill({
        name: 'Wisdom of Ages',
        nameZh: '古老智慧',
        description: '揭示敵方弱點，提升下次攻擊傷害',
        effectType: 'utility',
        potency: 25,
        cooldown: 2,
        rsCost: 10,
        targetType: 'single',
      }),
    ],
  },
  {
    uuid: 'npc-guardian-001',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'guardian',
    pillar: 'Trackable',
    rs_base: 65,
    village_function: '村莊大門守衛',
    visualStyle: '守護者風格，盾牌與鎖鏈，沉穩藍光',
    esgStats: { E: 70, S: 72, G: 78 },
    skills: [
      createSkill({
        name: 'Shield of Trust',
        nameZh: '信任之盾',
        description: '為單一目標施加護盾，抵擋傷害',
        effectType: 'buff',
        potency: 45,
        cooldown: 3,
        rsCost: 15,
        targetType: 'single',
      }),
    ],
  },
];

/**
 * 根據 ID 獲取 NPC 卡片
 */
export function getNPCCardById(id: string): INPCCard | undefined {
  return NPC_CARDS.find((card) => card.uuid === id);
}

/**
 * 根據類別獲取 NPC 卡片
 */
export function getNPCCardsByCategory(category: INPCCard['category']): INPCCard[] {
  return NPC_CARDS.filter((card) => card.category === category);
}

/**
 * 根據支柱獲取 NPC 卡片
 */
export function getNPCCardsByPillar(pillar: INPCCard['pillar']): INPCCard[] {
  return NPC_CARDS.filter((card) => card.pillar === pillar);
}

/**
 * 計算 NPC 卡片的 Hash Lock
 */
export function computeNPCHashLock(npc: INPCCard): string {
  const content = JSON.stringify({
    uuid: npc.uuid,
    name: npc.skills.map((s) => s.nameZh),
    pillar: npc.pillar,
    rs_base: npc.rs_base,
  });
  return computeHash(content);
}
