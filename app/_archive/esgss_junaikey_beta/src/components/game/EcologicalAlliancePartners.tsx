/**
 * 🤝 生態聯盟夥伴 - Ecological Alliance Partners
 * 
 * 功能：
 * - 聯盟夥伴英雄故事
 * - 夥伴招募系統
 * - 羁绊羁绊系統
 * - 協力作戰機制
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Star,
  Sparkles,
  Sword,
  Shield,
  Crown,
  Flame,
  Droplets,
  Wind,
  Sun,
  Moon,
  Mountain,
  Waves,
  BookOpen,
  Award,
  ChevronRight,
  ChevronDown,
  Handshake,
  Link,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 聯盟夥伴類型
interface AlliancePartner {
  id: string;
  name: string;
  title: string;
  category: 'env' | 'soc' | 'gov' | 'tech' | 'edu';
  avatar: string;
  backstory: string;
  motivation: string;
  quote: string;
  specialty: string;
  abilities: {
    name: string;
    description: string;
    type: 'buff' | 'heal' | 'attack' | 'defense';
    value: number;
    cooldown: number;
  }[];
  synergyBonus: {
    with: string[];
    bonus: string;
  }[];
  unlockRequirement: {
    type: 'level' | 'quest' | 'achievement' | 'story';
    value: string | number;
  };
  storyChapter: string;
  relationshipLevel: number;
  giftsGiven: number;
  missionsCompleted: number;
}

// 聯盟夥伴故事事件
interface PartnerStoryEvent {
  id: string;
  partnerId: string;
  type: 'gift' | 'mission' | 'dialogue' | 'celebration';
  title: string;
  description: string;
  requirements: {
    relationshipLevel: number;
    giftsRequired?: number;
  };
  rewards: {
    xp: number;
    relationshipBoost: number;
    item?: string;
  };
  dialogue?: {
    speaker: string;
    text: string;
  }[];
}

// 生態聯盟夥伴數據
const ALLIANCE_PARTNERS: AlliancePartner[] = [
  {
    id: 'forest-sage',
    name: '森林賢者',
    title: '古老森林的守護者',
    category: 'env',
    avatar: '🧙',
    backstory: `在亞馬遜雨林的深處，有一位被稱為「森林賢者」的傳奇人物。
      
他曾是巴西大學的植物學教授，但在一次深入的雨林考察後，
他選擇永遠留在這片他深愛的土地上。

「那些樹木會說話，」他說，「只是大多數人聽不見。」

五十年來，他與森林共呼吸，與河流同歌唱。
他的存在本身就是對抗非法砍伐最強大的武器。

當熵增的陰影開始吞噬世界，
他知道——是時候將知識傳給下一代了。`,
    motivation: '保護森林的每一寸土地',
    quote: '樹木是我們的祖先，也是我們的後代。',
    specialty: '自然之力',
    abilities: [
      { name: '森林祝福', description: '全隊獲得自然護盾', type: 'defense', value: 30, cooldown: 5 },
      { name: '生命之泉', description: '恢復隊友生命力', type: 'heal', value: 25, cooldown: 4 },
      { name: '自然暴走', description: '召喚藤蔓攻擊敵人', type: 'attack', value: 40, cooldown: 6 }
    ],
    synergyBonus: [
      { with: ['guardian'], bonus: '自然護盾效果 +20%' },
      { with: ['pioneer'], bonus: '生命恢復效果 +25%' }
    ],
    unlockRequirement: { type: 'level', value: 5 },
    storyChapter: 'awakening',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'ocean-queen',
    name: '海洋女王',
    title: '深藍海域的守護者',
    category: 'env',
    avatar: '🧜',
    backstory: `她是帛琉最後一位海洋公主的後裔。
      
從小，她就能在海底自由呼吸，能與鯨魚對話。
她的家族世代守護著這片美麗的海域，
直到污染者和過度捕撈者打破了這份寧靜。

「海洋不是垃圾場，」她說，「她是生命的搖籃。」

她創辦了「海洋守護聯盟」，
帶領著潛水員清理海底垃圾，
帶領著科學家保護珊瑚礁，
帶領著孩子們認識海洋的美麗。

現在，她來到了善向永續村，
尋找更多志同道合的夥伴。`,
    motivation: '讓海洋重現蔚藍',
    quote: '每一滴水都是生命的詩篇。',
    specialty: '海洋之力',
    abilities: [
      { name: '浪潮之舞', description: '全隊獲得速度加成', type: 'buff', value: 20, cooldown: 5 },
      { name: '深海治愈', description: '淨化所有負面效果', type: 'heal', value: 35, cooldown: 8 },
      { name: '海嘯之怒', description: '對敵人造成水屬性傷害', type: 'attack', value: 45, cooldown: 7 }
    ],
    synergyBonus: [
      { with: ['champion'], bonus: '速度加成效果 +25%' },
      { with: ['master'], bonus: '水屬性攻擊 +30%' }
    ],
    unlockRequirement: { type: 'level', value: 10 },
    storyChapter: 'awakening',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'mountain-guardian',
    name: '山嶽守護者',
    title: '巍峨群峰的守衛者',
    category: 'env',
    avatar: '🏔️',
    backstory: `他來自喜馬拉雅山脈的一個古老村莊。
      
他的祖先是第一批登頂珠穆朗瑪峰的探險家，
他們在山頂發現了一個驚人的秘密——

山巔之上，有一種名為「聖山之力」的神秘能量，
能夠净化一切污染，回復大地生機。

「山不會說謊，」他說，「它們只說實話。」

他花了三十年時間學習如何運用這種力量，
現在，他準備將這份知識帶給世界。

但首先，他需要找到值得信任的夥伴。`,
    motivation: '守護每一片山巔的純淨',
    quote: '山越高，離天空越近。',
    specialty: '大地之力',
    abilities: [
      { name: '山嶽之盾', description: '獲得高額減傷', type: 'defense', value: 50, cooldown: 6 },
      { name: '大地脈動', description: '提升全隊防禦力', type: 'buff', value: 25, cooldown: 5 },
      { name: '巔峰一擊', description: '造成巨大物理傷害', type: 'attack', value: 60, cooldown: 8 }
    ],
    synergyBonus: [
      { with: ['guardian'], bonus: '防禦力加成 +30%' },
      { with: ['master'], bonus: '物理傷害 +35%' }
    ],
    unlockRequirement: { type: 'level', value: 15 },
    storyChapter: 'awakening',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'desert-sage',
    name: '沙漠智者',
    title: '炎熱荒漠的指引者',
    category: 'env',
    avatar: '🏜️',
    backstory: `在撒哈拉沙漠的深處，有一座被風沙掩埋的古城。
      
幾千年來，這座城市一直是沙漠遊牧民族的精神中心。
他們發展出了一套與沙漠和諧共處的智慧——
如何在最惡劣的環境中創造綠洲，
如何在最少的水源中滋養生命。

「沙漠教會我們，」她說，「珍貴的東西從來都不是免費的。」

她是這座城市最後一位智者，
她決定離開沙漠，
將千年的智慧傳給更廣闘的世界。

她相信，只有學會珍惜沙漠的人，
才能真正珍惜我們的地球。`,
    motivation: '在荒蕪中播種希望',
    quote: '沙漠不是死亡的象徵，而是生命的考驗。',
    specialty: '沙漠智慧',
    abilities: [
      { name: '綠洲祝福', description: '在沙漠地形中大幅提升戰力', type: 'buff', value: 35, cooldown: 6 },
      { name: '沙塵暴', description: '降低敵方命中率和防禦', type: 'debuff', value: 30, cooldown: 7 },
      { name: '太陽怒火', description: '召喚烈日灼燒敵人', type: 'attack', value: 55, cooldown: 8 }
    ],
    synergyBonus: [
      { with: ['pioneer'], bonus: '沙漠地形戰力 +40%' },
      { with: ['champion'], bonus: 'debuff 效果 +25%' }
    ],
    unlockRequirement: { type: 'level', value: 20 },
    storyChapter: 'awakening',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },

  // ============================================
  // 臺灣 ESG 生態夥伴英雄 (新)
  // ============================================
  {
    id: 'wangdao-ardan',
    name: '王道阿丹',
    title: '永續金融先驅',
    category: 'edu',
    avatar: '🏦',
    backstory: `王道阿丹是華人世界最具影響力的永續金融平台。
      
創辦團隊來自香港、新加坡、台灣的頂尖金融機構，
他們看到傳統金融對環境與社會的危害，
決心創建一個「為善有報」的投資生態。

「資本應該是改變的力量，而不是破壞的工具。」

王道阿丹開發了「ESG 投資評估系統」，
結合 AI 人工智慧與大數據分析，
為投資人找出真正永續的企業。

平台已管理超過 NT$500 億的永續投資基金，
協助 1,200+ 企業提升 ESG 表現。`,
    motivation: '用資本力量推動永續變革',
    quote: '「每一筆投資，都是對未來的投票。」',
    specialty: '永續金融',
    abilities: [
      { name: '資本祝福', description: '全隊獲得投資加成', type: 'buff', value: 30, cooldown: 5 },
      { name: 'ESG 透視', description: '看穿企業真實價值', type: 'buff', value: 35, cooldown: 6 },
      { name: '綠色投資', description: '發動永續金融攻擊', type: 'attack', value: 50, cooldown: 8 }
    ],
    synergyBonus: [
      { with: ['tech-visionary'], bonus: '投資分析效率 +35%' },
      { with: ['master'], bonus: '治理評估 +30%' }
    ],
    unlockRequirement: { type: 'level', value: 18 },
    storyChapter: 'order',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'quanren-evaluation',
    name: '全人評測',
    title: '永續人才培育師',
    category: 'edu',
    avatar: '📊',
    backstory: `全人評測是亞洲領先的永續人才評估機構。
      
創辦人陳怡君博士是前 ATD (人才發展協會) 台灣分會會長，
她發現企業推動永續最大的瓶頸是「人才」。

「沒有永續人才，就沒有永續企業。」

全人評測開發了「永續職能評估系統」，
涵蓋 50+ 種永續相關職位的能力模型，
幫助企業找到對的永續人才。

已評測 50,000+ 求職者，
成功媒合 8,000+ 人進入永續相關職位。`,
    motivation: '為永續事業培育棟樑之才',
    quote: '「人才是永續的根，評測是選種的篩。」',
    specialty: '人才評測',
    abilities: [
      { name: '慧眼識才', description: '提升全隊經驗獲取', type: 'buff', value: 35, cooldown: 5 },
      { name: '職能認證', description: '為隊友添加認證加成', type: 'buff', value: 30, cooldown: 6 },
      { name: '潛力爆發', description: '發動人才培育攻擊', type: 'attack', value: 45, cooldown: 7 }
    ],
    synergyBonus: [
      { with: ['edu-champion'], bonus: '教育效果 +35%' },
      { with: ['forest-sage'], bonus: '經驗加成 +25%' }
    ],
    unlockRequirement: { type: 'achievement', value: 'talent-scout' },
    storyChapter: 'justice',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'junaikey-core',
    name: '善向永續 JunAiKey',
    title: 'AI 永續智慧中樞',
    category: 'tech',
    avatar: '🧠',
    backstory: `善向永續 JunAiKey 是整個 ESG 生態系的核心引擎。
      
它整合了人工智慧、大數據分析、區塊鏈技術，
為企業提供全方位的永續解決方案。

「讓永續變得簡單，讓改變成為可能。」

JunAiKey 的 AI 引擎能夠：
- 自動分析碳足跡並提供減排建議
- 智能推薦最適合的 ESG 解決方案
- 用區塊鏈確保數據透明不可篡改

已服務 500+ 企業客戶，
累積減少碳排放 100,000+ 噸。`,
    motivation: '用 AI 力量加速永續轉型',
    quote: '「科技與永續，是最佳搭檔。」',
    specialty: 'AI 智慧永續',
    abilities: [
      { name: '智慧中樞', description: '全隊獲得 AI 加成', type: 'buff', value: 40, cooldown: 5 },
      { name: '數據透視', description: '看穿所有環境數據', type: 'buff', value: 45, cooldown: 6 },
      { name: 'AI 風暴', description: '發動人工智慧複合攻擊', type: 'attack', value: 60, cooldown: 8 }
    ],
    synergyBonus: [
      { with: ['tech-visionary'], bonus: '科技效果 +40%' },
      { with: ['forest-sage'], bonus: '環境分析 +35%' },
      { with: ['ocean-queen'], bonus: '數據處理 +30%' }
    ],
    unlockRequirement: { type: 'story', value: 'awakening' },
    storyChapter: 'awakening',
    relationshipLevel: 5,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'berkeley-university',
    name: '柏克萊大學',
    title: '永續學術殿堂',
    category: 'edu',
    avatar: '🎓',
    backstory: `加州大學柏克萊分校是全球永續研究的重鎮。
      
從 1960 年代的環境運動，
到 21 世紀的氣候變遷研究，
柏克萊一直是永續思想的發源地。

「知識應該服務世界，而不是困在象牙塔裡。」

柏克萊與 ESGss 建立了深度合作：
- 共享最新永續研究成果
- 培養台灣永續人才
- 推動產學合作計畫

已有 200+ 柏克萊畢業生在台灣永續領域貢獻所長。`,
    motivation: '用學術力量推動永續實踐',
    quote: '「思想的種子，會長成行動的大樹。」',
    specialty: '永續學術',
    abilities: [
      { name: '學術之光', description: '全隊獲得研究加成', type: 'buff', value: 35, cooldown: 5 },
      { name: '知識傳承', description: '提升全隊技能等級', type: 'buff', value: 30, cooldown: 6 },
      { name: '學術衝擊', description: '發動研究發現攻擊', type: 'attack', value: 55, cooldown: 8 }
    ],
    synergyBonus: [
      { with: ['edu-champion'], bonus: '教育效果 +40%' },
      { with: ['pioneer'], bonus: '科研效率 +35%' },
      { with: ['quanren-evaluation'], bonus: '人才評測 +30%' }
    ],
    unlockRequirement: { type: 'quest', value: 'academic-connection' },
    storyChapter: 'order',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'urban-warrior',
    name: '都市戰士',
    title: '水泥叢林的綠色先鋒',
    category: 'soc',
    avatar: '🦸',
    backstory: `他出生在東京的一個普通家庭。
      
從小，他就對這個被鋼筋水泥包圍的城市感到窒息。
他不明白為什麼天空總是灰蒙蒙的，
他不明白為什麼孩子們只能在室內玩耍。

「城市不應該是這樣的，」他說。

大學時，他參加了東京的綠化運動，
種下了第一棵行道樹。
從那以後，他的人生變了——

他創辦了「都市綠洲計劃」，
在東京、首爾、上海、紐約...
在每一個水泥叢林中種下綠色的種子。

現在，他來到善向永續村，
尋找讓城市重新呼吸的方法。`,
    motivation: '讓每一座城市都成為森林',
    quote: '混凝土不是我想要的童年。',
    specialty: '都市綠化',
    abilities: [
      { name: '垂直花園', description: '在戰場上創造綠色空間', type: 'buff', value: 30, cooldown: 5 },
      { name: '清新空氣', description: '淨化戰場並恢復隊友', type: 'heal', value: 30, cooldown: 6 },
      { name: '都市風暴', description: '召喚交通風暴攻擊敵人', type: 'attack', value: 45, cooldown: 7 }
    ],
    synergyBonus: [
      { with: ['forest-sage'], bonus: '綠色空間效果 +30%' },
      { with: ['guardian'], bonus: '城市戰鬥力 +25%' }
    ],
    unlockRequirement: { type: 'level', value: 12 },
    storyChapter: 'justice',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'indigenous-elder',
    name: '原住民長老',
    title: '大地之子',
    category: 'soc',
    avatar: '👴',
    backstory: `他是台灣賽德克族的最後一位長老。
      
他的祖先在這片土地上生活了數千年，
他們與山林共存，與萬物和諧。
他們知道什麼時候播種，什麼時候收割，
他們知道如何與自然對話。

「我們不是地球的主人，」他說，「我們只是地球的客人。」

當現代化浪潮席捲而來，
當森林被砍伐，當河流被污染，
他選擇站出來——

用傳統智慧對抗環境破壞，
用古老歌謠喚醒人們的良知。

現在，他將這些千年智慧帶到善向永續村，
希望能夠啟發更多人。`,
    motivation: '保存並傳承原住民生態智慧',
    quote: '山林有山林的語言，河流有河流的歌聲。',
    specialty: '傳統智慧',
    abilities: [
      { name: '祖靈祝福', description: '獲得祖先力量的庇護', type: 'buff', value: 35, cooldown: 6 },
      { name: '山林治愈', description: '恢復隊友並提升士氣', type: 'heal', value: 40, cooldown: 8 },
      { name: '祖靈之怒', description: '召喚山林精靈攻擊', type: 'attack', value: 50, cooldown: 10 }
    ],
    synergyBonus: [
      { with: ['forest-sage'], bonus: '自然系技能 +35%' },
      { with: ['mountain-guardian'], bonus: '士氣提升效果翻倍' }
    ],
    unlockRequirement: { type: 'quest', value: 'ancient-wisdom' },
    storyChapter: 'justice',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'tech-visionary',
    name: '科技先知',
    title: '數位綠色的開創者',
    category: 'tech',
    avatar: '👩‍💻',
    backstory: `她曾經是矽谷最成功的科技公司創辦人。
      
她的公司在納斯達克上市，她個人資產數十億美元，
她擁有名車、豪宅、私人飛機——

但她不快樂。

「我們用科技創造了這一切，」她說，
「但我們也用科技毀滅了這一切。」

她賣掉了公司，將所有資金投入研究——
如何用 AI 保護環境，
如何用大數據追蹤碳排放，
如何用區塊鏈確保供應鏈透明。

「科技應該是解決方案，而不是問題。」

現在，她來到善向永續村，
尋找將科技與永續結合的新方法。`,
    motivation: '用科技拯救地球',
    quote: '代碼可以改變世界，綠色代碼可以拯救世界。',
    specialty: '綠色科技',
    abilities: [
      { name: '數位屏障', description: '用防火牆保護全隊', type: 'defense', value: 40, cooldown: 5 },
      { name: '數據分析', description: '看穿敵方弱點', type: 'buff', value: 25, cooldown: 4 },
      { name: '邏輯風暴', description: '用數據流攻擊敵人', type: 'attack', value: 55, cooldown: 7 }
    ],
    synergyBonus: [
      { with: ['master'], bonus: '所有數值加成 +30%' },
      { with: ['pioneer'], bonus: '科技系技能效果 +35%' }
    ],
    unlockRequirement: { type: 'level', value: 18 },
    storyChapter: 'order',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  },
  {
    id: 'edu-champion',
    name: '教育冠軍',
    title: '永續教育推廣者',
    category: 'edu',
    avatar: '👨‍🏫',
    backstory: `他是非洲偏鄉的一名小學老師。
      
在那裡，孩子們沒有書本，沒有電腦，
但他們有對知識的渴望，對未來的夢想。

「教育是改變世界的武器，」他說。

他用有限的資源創辦了「綠色種子計劃」——
教孩子們種樹，教孩子們保護水源，
教孩子們成為地球的小守護者。

十年過去了，他教過的孩子超過十萬人，
他們有的成為了環保科學家，
有的成為了政府官員，
有的成為了下一代的老师。

現在，他來到善向永續村，
尋找讓永續教育普及到世界每個角落的方法。`,
    motivation: '讓每個孩子都成為地球守護者',
    quote: '今天的學生，明天的地球英雄。',
    specialty: '永續教育',
    abilities: [
      { name: '智慧之光', description: '提升全隊經驗獲取', type: 'buff', value: 30, cooldown: 5 },
      { name: '希望種子', description: '為隊友種下希望', type: 'heal', value: 25, cooldown: 6 },
      { name: '知識爆發', description: '用教育的力量攻擊', type: 'attack', value: 40, cooldown: 7 }
    ],
    synergyBonus: [
      { with: ['forest-sage'], bonus: '經驗加成 +35%' },
      { with: ['indigenous-elder'], bonus: '所有輔助效果 +25%' }
    ],
    unlockRequirement: { type: 'achievement', value: 'teacher-1' },
    storyChapter: 'justice',
    relationshipLevel: 1,
    giftsGiven: 0,
    missionsCompleted: 0
  }
];

// 伙伴故事事件
const PARTNER_STORY_EVENTS: PartnerStoryEvent[] = [
  {
    id: 'forest-first-meeting',
    partnerId: 'forest-sage',
    type: 'dialogue',
    title: '森林深處的邂逅',
    description: '第一次遇見森林賢者，聆聽他講述雨林的故事',
    requirements: { relationshipLevel: 1 },
    rewards: { xp: 100, relationshipBoost: 2 },
    dialogue: [
      { speaker: '森林賢者', text: '「年輕的旅人，你聽見了風的歌聲嗎？」' },
      { speaker: '你', text: '「我...我只聽見了風聲。」' },
      { speaker: '森林賢者', text: '「風會說話，樹會傾訴，水會歌唱。總有一天，你會聽見的。」' }
    ]
  },
  {
    id: 'ocean-gift',
    partnerId: 'ocean-queen',
    type: 'gift',
    title: '海洋的禮物',
    description: '送給海洋女王一份特別的禮物',
    requirements: { relationshipLevel: 2, giftsRequired: 1 },
    rewards: { xp: 150, relationshipBoost: 3, item: '珊瑚項鏈' },
    dialogue: [
      { speaker: '海洋女王', text: '「這是...來自陸地的禮物？」' },
      { speaker: '你', text: '「是的，我希望海洋也能感受到陸地的美。」' },
      { speaker: '海洋女王', text: '「謝謝你...我感受到了你的心意。」' }
    ]
  },
  {
    id: 'mountain-legend',
    partnerId: 'mountain-guardian',
    type: 'mission',
    title: '聖山的試煉',
    description: '接受山嶽守護者的考驗，證明自己的勇氣',
    requirements: { relationshipLevel: 3 },
    rewards: { xp: 500, relationshipBoost: 5, item: '聖山之證' },
    dialogue: [
      { speaker: '山嶽守護者', text: '「想獲得我的認可？你必須證明自己的勇氣。」' },
      { speaker: '你', text: '「我準備好了。」' },
      { speaker: '山嶽守護者', text: '「那麼...開始吧。」' }
    ]
  }
];

export const EcologicalAlliancePartners: React.FC<{
  userId: string;
  currentLevel: number;
  onPartnerUnlock?: (partnerId: string) => void;
}> = ({ userId, currentLevel, onPartnerUnlock }) => {
  const { t, i18n } = useTranslation();
  const [selectedPartner, setSelectedPartner] = useState<AlliancePartner | null>(null);
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'partners' | 'stories' | 'synergy'>('partners');

  // 檢查夥伴是否解鎖
  const isPartnerUnlocked = (partner: AlliancePartner) => {
    if (partner.unlockRequirement.type === 'level') {
      return currentLevel >= (partner.unlockRequirement.value as number);
    }
    return false; // 其他條件需要額外檢查
  };

  // 渲染夥伴卡片
  const renderPartnerCard = (partner: AlliancePartner) => {
    const unlocked = isPartnerUnlocked(partner);
    const isExpanded = expandedPartner === partner.id;

    return (
      <motion.div
        key={partner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          unlocked
            ? 'bg-slate-800/50 border-white/10 hover:border-green-500/50'
            : 'bg-slate-900/50 border-white/5 opacity-60'
        }`}
      >
        {/* 背景效果 */}
        {unlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50" />
        )}

        <div className="relative p-6">
          {/* 頭部 */}
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: unlocked ? 1.1 : 1 }}
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
                unlocked
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              {unlocked ? partner.avatar : '🔒'}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                {unlocked && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                    Lv.{partner.relationshipLevel}
                  </span>
                )}
              </div>
              <p className="text-sm text-emerald-400 mb-2">{partner.title}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{partner.quote}</p>
            </div>

            {unlocked && (
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            )}
          </div>

          {/* 展開內容 */}
          <AnimatePresence>
            {isExpanded && unlocked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                {/* 背景故事 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    背景故事
                  </h4>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {partner.backstory}
                    </p>
                  </div>
                </div>

                {/* 專長 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    專長
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      {partner.specialty}
                    </span>
                    <span className="text-slate-400 text-sm">{partner.motivation}</span>
                  </div>
                </div>

                {/* 技能 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    技能
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {partner.abilities.map((ability, i) => (
                      <div key={i} className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <div className="text-xs text-white font-medium">{ability.name}</div>
                        <div className="text-xs text-slate-500">{ability.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 羁绊羁绊加成 */}
                {partner.synergyBonus.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                      <Handshake className="w-4 h-4" />
                      羁绊加成
                    </h4>
                    <div className="space-y-2">
                      {partner.synergyBonus.map((synergy, i) => (
                        <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400">與 {synergy.with.join(', ')}</span>
                          </div>
                          <div className="text-xs text-green-400">{synergy.bonus}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 互動按鈕 */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {/* 送礼 */}}
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold text-sm"
                  >
                    贈送禮物
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {/* 執行任務 */}}
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-sm"
                  >
                    執行任務
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 展開/收起按鈕 */}
          {unlocked && (
            <button
              onClick={() => setExpandedPartner(isExpanded ? null : partner.id)}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? '收起詳情' : '查看詳情'}
            </button>
          )}

          {/* 未解鎖提示 */}
          {!unlocked && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
              <Target className="w-4 h-4" />
              <span>
                {partner.unlockRequirement.type === 'level' 
                  ? `需要達到 LV.${partner.unlockRequirement.value} 才能解鎖`
                  : `需要完成「${partner.unlockRequirement.value}」才能解鎖`
                }
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染羁羁羁羁图
  const renderSynergyChart = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Link className="w-5 h-5 text-green-400" />
        羁羁羁羁羁羁图
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALLIANCE_PARTNERS.slice(0, 4).map((partner) => (
          <div
            key={partner.id}
            className="p-4 bg-slate-800/50 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{partner.avatar}</span>
              <span className="font-bold text-white">{partner.name}</span>
            </div>
            
            <div className="space-y-2">
              {partner.synergyBonus.map((synergy, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <Handshake className="w-3 h-3 text-green-400" />
                  <span>＋ {synergy.with.join(', ')}</span>
                  <span className="text-green-400">{synergy.bonus}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            生態聯盟夥伴
          </h1>
          <p className="text-slate-400">招募志同道合的英雄，共同守護地球</p>
        </motion.div>

        {/* Tab 切换 */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          {[
            { key: 'partners', label: '夥伴列表', icon: Users },
            { key: 'stories', label: '故事事件', icon: BookOpen },
            { key: 'synergy', label: '羁羁加成', icon: Link }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 內容 */}
        <AnimatePresence mode="wait">
          {activeTab === 'partners' && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* 已解鎖夥伴 */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  已招募 ({ALLIANCE_PARTNERS.filter(isPartnerUnlocked).length})
                </h2>
                {ALLIANCE_PARTNERS.filter(isPartnerUnlocked).map(partner => renderPartnerCard(partner))}
              </div>

              {/* 未解鎖夥伴 */}
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-500 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  待招募
                </h2>
                {ALLIANCE_PARTNERS.filter(p => !isPartnerUnlocked(p)).map(partner => renderPartnerCard(partner))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                伙伴故事事件
              </h2>

              {PARTNER_STORY_EVENTS.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/50 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{event.title}</h3>
                      <p className="text-sm text-slate-400">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {event.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          +{event.rewards.xp} XP
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'synergy' && (
            <motion.div
              key="synergy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderSynergyChart()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EcologicalAlliancePartners;
