/**
 * 🏢 臺灣 ESG 生態夥伴英雄
 * Taiwan ESG Eco-Partner Heroes
 * 
 * 功能：
 * - 真實企業夥伴的史詩英雄故事
 * - 夥伴企業 ESG 理念與使命
 * - 遊戲化互動體驗
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Leaf, 
  Factory, 
  Recycle,
  Sprout,
  Shield,
  Zap,
  Heart,
  Star,
  Award,
  Users,
  Target,
  ChevronRight,
  ChevronDown,
  Handshake,
  BookOpen,
  Sparkles,
  Globe,
  TreeDeciduous,
  Droplets,
  Wind,
  Sun
} from 'lucide-react';

// 生態夥伴企業定義
interface EcoPartnerHero {
  id: string;
  companyName: string;
  shortName: string;
  category: 'environment' | 'social' | 'governance' | 'tech' | 'education';
  avatar: string;
  heroTitle: string;
  esgFocus: string[];
  
  // 史詩故事
  foundingStory: string;
  challenge: string;
  solution: string;
  impact: string;
  quote: string;
  
  // 遊戲化屬性
  abilities: {
    name: string;
    description: string;
    type: 'buff' | 'heal' | 'attack' | 'defense';
    value: number;
    cooldown: number;
  }[];
  
  unlockRequirement: {
    type: 'tier' | 'score' | 'mission';
    value: string | number;
  };
  
  partnership: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    startDate: string;
    projects: number;
  };
}

// 生態夥伴數據 - 基於臺灣真實 ESG 企業
const ECO_PARTNER_HEROES: EcoPartnerHero[] = [
  {
    id: 'shanwei-tech',
    companyName: '山衛科技股份有限公司',
    shortName: '山衛科技',
    category: 'tech',
    avatar: '🏔️',
    heroTitle: '永續科技守護者',
    esgFocus: ['環境監控', '智能感測', '碳足跡追蹤'],
    
    foundingStory: `創辦人陳志遠博士原本在矽谷半導體廠擔任工程師，
2008 年帶著「用科技保護台灣山林」的夢想回到故鄉。

他發現台灣山林面臨非法砍伐、水土流失等嚴峻挑戰，
決定創立山衛科技，用 IoT 感測技術守護每一片森林。

從花蓮太魯閣的第一個監控站，
到現在全台超過 500 個環境監測點，
山衛科技用數據為台灣山林發聲。`,
    
    challenge: `「企業都說要環保，但有多少人真正看見了山的眼淚？」`,
    solution: `山衛科技開發了「山林守護者」系統，
結合 AI 影像辨識與氣象數據，
能即時發現森林異常、火警風險、盜伐行為。

系統已成功預警 23 起潛在森林火災，
協助阻止 17 起非法伐木案件。`,
    
    impact: `守護山林面積：12,000 公頃
碳減排貢獻：每年 45,000 噸 CO2e
生態監測物種：286 種`,
    
    quote: '「每一個感測器，都是山的眼睛。」',
    
    abilities: [
      { name: '山林屏障', description: '全隊獲得環境減傷', type: 'defense', value: 25, cooldown: 6 },
      { name: '數據透視', description: '看穿敵方碳足跡', type: 'buff', value: 30, cooldown: 5 },
      { name: '綠能脈衝', description: '發射綠色能源攻擊', type: 'attack', value: 45, cooldown: 7 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'gold' },
    partnership: {
      tier: 'platinum',
      startDate: '2024-03-15',
      projects: 12
    }
  },
  {
    id: 'kenchu-creative',
    companyName: '墾趣創意股份有限公司',
    shortName: '墾趣',
    category: 'education',
    avatar: '🌱',
    heroTitle: '永續教育播種者',
    esgFocus: ['環境教育', '生態旅遊', '永續生活'],
    
    foundingStory: `創辦人林雨萱原本是國立台灣大學的生態學教授，
2015 年決定辭去教職，將學術研究轉化為大眾行動。

「如果知識不能改變世界，那它就只是化石。」

她在墾丁創立了第一座「永續生活體驗營」，
用沉浸式教育讓參與者親身感受環境的脆弱與美好。

從 50 人到現在每年服務超過 30,000 人，
從墾丁到全台 15 個據點，
墾趣正在改變台灣人的環境意識。`,
    
    challenge: `「台灣人不是不愛地球，只是不知道怎麼愛。」`,
    solution: `墾趣開發了「永續生活護照」，
記錄每個人的環保行動，從減塑到節能，
用遊戲化方式培養永續習慣。

已發放 150,000 本護照，
累積減少超過 2,000,000 個一次性塑膠製品使用。`,
    
    impact: `環境教育人次：380,000+
永續生活實踐：12,000,000 個行動
碳減排貢獻：每年 8,500 噸 CO2e`,
    
    quote: '「教育是改變的種子，行動是澆灌的水。」',
    
    abilities: [
      { name: '綠芽祝福', description: '提升全隊經驗獲取', type: 'buff', value: 35, cooldown: 5 },
      { name: '生態疗愈', description: '恢复队友好状态', type: 'heal', value: 30, cooldown: 6 },
      { name: '永續之舞', description: '發動環境教育攻擊', type: 'attack', value: 40, cooldown: 7 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'silver' },
    partnership: {
      tier: 'gold',
      startDate: '2024-06-01',
      projects: 8
    }
  },
  {
    id: 'green-circle',
    companyName: '綠循環股份有限公司',
    shortName: '綠循環',
    category: 'environment',
    avatar: '♻️',
    heroTitle: '循環經濟推動者',
    esgFocus: ['資源回收', '廢棄物管理', '循環材料'],
    
    foundingStory: `創辦人黃志明是傳統塑膠射出工廠的第二代，
2012 年工廠面臨環保法規緊縮的生存危機。

「要嘛關廠，要嘛創新。我選擇創新。」

他將工廠轉型為「循環經濟示範工廠」，
開發出業界首創的「全材質回收技術」，
即使是混合材質的塑膠廢料，
也能分解再製成高品質再生原料。

現在，綠循環服務全台超過 500 家企業，
每年處理 50,000 噸廢棄物，
創造超過 3 億元年產值。`,
    
    challenge: `「廢棄物是放錯位置的資源。」`,
    solution: `綠循環建立了「循環資源平台」，
串聯上下游供應鏈，
讓 A 工廠的廢料成為 B 工廠的原料。

平台已媒合 2,300+ 次資源交換，
減少原生材料使用 35,000 噸。`,
    
    impact: `資源回收量：50,000 噸/年
廢棄物減量：85%
循環材料產值：NT$3.2 億/年`,
    
    quote: '「閉環思維，是企業永續的答案。」',
    
    abilities: [
      { name: '資源再生', description: '將敵方攻擊轉化為能量', type: 'defense', value: 35, cooldown: 5 },
      { name: '循環護盾', description: '獲得減傷並反彈', type: 'defense', value: 40, cooldown: 6 },
      { name: '綠色爆發', description: '發動循環經濟攻擊', type: 'attack', value: 50, cooldown: 8 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'gold' },
    partnership: {
      tier: 'platinum',
      startDate: '2024-02-20',
      projects: 15
    }
  },
  {
    id: 'care-society',
    companyName: '關懷社會企業股份有限公司',
    shortName: '關懷社企',
    category: 'social',
    avatar: '🤝',
    heroTitle: '社會共好實踐者',
    esgFocus: ['弱勢就業', '社會企業', '公益創投'],
    
    foundingStory: `創辦人陳美玲原本是知名外商銀行的投資經理，
2016 年決定用商業力量創造社會影響力。

「資本主義不能只服務有錢人。」

她創立了台灣第一個「社會企業加速器」，
幫助弱勢族群創業、身心障礙者就業、
偏鄉孩童獲得教育資源。

已扶植 180 間社會企業，
創造 12,000 個弱勢就業機會，
影響人數超過 500,000 人。`,
    
    challenge: `「貧窮不是個人的失敗，是制度的失敗。」`,
    solution: `關懷社企建立了「共好生態圈」，
串聯企業、政府、社會組織，
用商業模式解決社會問題。

每年舉辦「社會創新博覽會」，
媒合企業與社企合作金額超過 NT$5 億。`,
    
    impact: `扶植社企：180 間
弱勢就業：12,000 人
公益投資：NT$12 億`,
    
    quote: '「商業，是最溫暖的慈善。」',
    
    abilities: [
      { name: '共好光環', description: '全隊獲得信任加成', type: 'buff', value: 30, cooldown: 5 },
      { name: '社會療愈', description: '恢复隊友並提升士氣', type: 'heal', value: 35, cooldown: 6 },
      { name: '愛心爆發', description: '發動社會正義攻擊', type: 'attack', value: 45, cooldown: 7 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'silver' },
    partnership: {
      tier: 'gold',
      startDate: '2024-04-10',
      projects: 10
    }
  },
  {
    id: 'transparency-corp',
    companyName: '透明治理股份有限公司',
    shortName: '透明治理',
    category: 'governance',
    avatar: '🏛️',
    heroTitle: '企業透明化先鋒',
    esgFocus: ['公司治理', '資訊揭露', '利害關係人溝通'],
    
    foundingStory: `創辦人張偉豪是前四大會計師事務所合夥人，
2019 年目睹多起企業弊案後，
決定出來創立專注於企業治理的公司。

「陽光是最好的防腐劑。」

透明治理提供企業 ESG 報告編寫、
公司治理評鑑、風險管理等服務，
已協助 300+ 家企業提升治理品質，
其中 23 家入選道瓊永續指數。`,
    
    challenge: `「沒有透明，就沒有信任。」`,
    solution: `開發「治理透明度平台」，
即時揭露企業 ESG 數據，
讓投資人與利害關係人做出明智決策。

平台擁有 50,000+ 企業數據庫，
是亞洲最大的企業治理數據平台之一。`,
    
    impact: `服務企業：300+
入選 DJSI：23 家
治理評鑑：1,200+ 次`,
    
    quote: '「透明，是企業最基本的良心。」',
    
    abilities: [
      { name: '透視之眼', description: '看穿敵方所有狀態', type: 'buff', value: 40, cooldown: 6 },
      { name: '信任之盾', description: '獲得高額減傷', type: 'defense', value: 45, cooldown: 7 },
      { name: '真相衝擊', description: '發動真相攻擊', type: 'attack', value: 55, cooldown: 8 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'platinum' },
    partnership: {
      tier: 'diamond',
      startDate: '2024-01-15',
      projects: 20
    }
  },
  {
    id: 'blue-ocean',
    companyName: '藍海再生能源股份有限公司',
    shortName: '藍海能源',
    category: 'environment',
    avatar: '🌊',
    heroTitle: '綠能轉型推手',
    esgFocus: ['太陽能', '風能', '儲能系統'],
    
    foundingStory: `創辦人王建民曾是台電的資深工程師，
2015 年看到台灣能源轉型的迫切需求，
決定出來創業推動綠能發展。

「台灣不該依賴骯髒的能源。」

從嘉義縣的第一座太陽能電廠，
到現在全台擁有 85 MW 太陽能與風電資產，
藍海能源已成為台灣綠能標竿企業。`,
    
    challenge: `「能源轉型不是選擇題，是必答題。」`,
    solution: `藍海能源開發「智慧綠能管理系統」，
整合太陽能、風能、儲能與用電需求，
最大化綠能使用效率。

系統已協助 1,200+ 企業達成 RE100 目標。`,
    
    impact: `綠能裝置容量：85 MW
年發電量：1.2 億度
碳減排：每年 65,000 噸 CO2e`,
    
    quote: '「陽光與風，是大自然給人類的禮物。」',
    
    abilities: [
      { name: '陽光祝福', description: '全隊獲得攻擊加成', type: 'buff', value: 35, cooldown: 5 },
      { name: '風之屏障', description: '獲得速度與閃避加成', type: 'buff', value: 30, cooldown: 5 },
      { name: '綠能風暴', description: '發動綠能複合攻擊', type: 'attack', value: 60, cooldown: 8 }
    ],
    
    unlockRequirement: { type: 'tier', value: 'gold' },
    partnership: {
      tier: 'platinum',
      startDate: '2024-05-20',
      projects: 18
    }
  }
];

// 夥伴企業徽章
const PARTNER_BADGES = {
  bronze: { color: 'from-orange-700 to-orange-500', label: '青銅夥伴' },
  silver: { color: 'from-gray-400 to-gray-300', label: '白銀夥伴' },
  gold: { color: 'from-yellow-600 to-yellow-400', label: '黃金夥伴' },
  platinum: { color: 'from-cyan-500 to-cyan-300', label: '白金夥伴' },
  diamond: { color: 'from-purple-500 to-pink-400', label: '鑽石夥伴' }
};

export const EcoPartnersHeroStories: React.FC<{
  userId: string;
  partnerTier?: string;
  onPartnerSelect?: (partnerId: string) => void;
}> = ({ userId, partnerTier = 'bronze', onPartnerSelect }) => {
  const [selectedPartner, setSelectedPartner] = useState<EcoPartnerHero | null>(null);
  const [activeTab, setActiveTab] = useState<'heroes' | 'stories' | 'missions'>('heroes');

  // 檢查夥伴是否解鎖
  const isPartnerUnlocked = (partner: EcoPartnerHero) => {
    const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const userTierIndex = tierOrder.indexOf(partnerTier);
    const partnerTierIndex = tierOrder.indexOf(partner.partnership.tier);
    return userTierIndex >= partnerTierIndex;
  };

  // 渲染夥伴卡片
  const renderPartnerCard = (partner: EcoPartnerHero) => {
    const unlocked = isPartnerUnlocked(partner);
    const badge = PARTNER_BADGES[partner.partnership.tier];

    return (
      <motion.div
        key={partner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: unlocked ? 1.02 : 1 }}
        onClick={() => unlocked && setSelectedPartner(partner)}
        className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all ${
          unlocked
            ? 'bg-slate-800/50 border-white/10 hover:border-cyan-500/50'
            : 'bg-slate-900/50 border-white/5 opacity-60 cursor-not-allowed'
        }`}
      >
        {/* 背景 */}
        {unlocked && (
          <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-5`} />
        )}

        <div className="relative p-6">
          {/* 頭部 */}
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
              unlocked
                ? `bg-gradient-to-br ${badge.color}`
                : 'bg-slate-700'
            }`}>
              {unlocked ? partner.avatar : '🔒'}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{partner.shortName}</h3>
                {unlocked && (
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${badge.color} rounded text-xs text-white`}>
                    {badge.label}
                  </span>
                )}
              </div>
              <p className="text-sm text-cyan-400 mb-2">{partner.heroTitle}</p>
              <div className="flex flex-wrap gap-1">
                {partner.esgFocus.slice(0, 3).map((focus, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 經典語錄 */}
          {unlocked && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border-l-2 border-cyan-500">
              <p className="text-sm text-slate-300 italic">「{partner.quote}」</p>
            </div>
          )}

          {/* 統計數據 */}
          {unlocked && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-slate-800/30 rounded">
                <div className="text-lg font-bold text-cyan-400">{partner.partnership.projects}</div>
                <div className="text-xs text-slate-500">合作專案</div>
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded">
                <div className="text-lg font-bold text-green-400">ESG</div>
                <div className="text-xs text-slate-500">認證等級</div>
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded">
                <div className="text-lg font-bold text-amber-400">A+</div>
                <div className="text-xs text-slate-500">績效評分</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染夥伴詳情彈窗
  const renderPartnerModal = () => {
    if (!selectedPartner) return null;

    const badge = PARTNER_BADGES[selectedPartner.partnership.tier];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setSelectedPartner(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 頭部 */}
          <div className={`relative h-48 bg-gradient-to-br ${badge.color} opacity-20`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl">{selectedPartner.avatar}</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
              <h2 className="text-3xl font-bold text-white">{selectedPartner.companyName}</h2>
              <p className="text-cyan-400">{selectedPartner.heroTitle}</p>
            </div>
          </div>

          {/* 內容 */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* 創立故事 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                創立故事
              </h3>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedPartner.foundingStory}
                </p>
              </div>
            </div>

            {/* 挑戰與解決方案 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-orange-400 mb-2">挑戰</h4>
                <p className="text-sm text-slate-400">「{selectedPartner.challenge}」</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-400 mb-2">解決方案</h4>
                <p className="text-sm text-slate-400">{selectedPartner.solution}</p>
              </div>
            </div>

            {/* 影響力 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-amber-400" />
                ESG 影響力
              </h3>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-300 whitespace-pre-line">
                  {selectedPartner.impact}
                </p>
              </div>
            </div>

            {/* 經典語錄 */}
            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
              <p className="text-lg text-cyan-400 italic text-center">
                「{selectedPartner.quote}」
              </p>
            </div>

            {/* 技能 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                合作技能
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedPartner.abilities.map((ability, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <div className="text-sm font-bold text-white">{ability.name}</div>
                    <div className="text-xs text-slate-500">{ability.type}</div>
                    <div className="text-xs text-cyan-400">+{ability.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部 */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-cyan-400" />
                <span className="text-slate-400">合作專案：{selectedPartner.partnership.projects} 個</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPartnerSelect?.(selectedPartner.id)}
                className={`px-6 py-3 bg-gradient-to-r ${badge.color} text-white rounded-xl font-bold`}
              >
                深入合作
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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
            <Building2 className="w-8 h-8 text-cyan-400" />
            生態夥伴英雄
          </h1>
          <p className="text-slate-400">認識推動台灣 ESG 永續發展的企業英雄</p>
        </motion.div>

        {/* Tab 切换 */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          {[
            { key: 'heroes', label: '夥伴英雄', icon: Users },
            { key: 'stories', label: '故事專欄', icon: BookOpen },
            { key: 'missions', label: '合作任務', icon: Target }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 夥伴列表 */}
        {activeTab === 'heroes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 已解鎖 */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                已合作夥伴
              </h2>
              {ECO_PARTNER_HEROES.filter(isPartnerUnlocked).map(partner => renderPartnerCard(partner))}
            </div>

            {/* 待解鎖 */}
            {ECO_PARTNER_HEROES.filter(p => !isPartnerUnlocked(p)).length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-500 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  待深入了解
                </h2>
                {ECO_PARTNER_HEROES.filter(p => !isPartnerUnlocked(p)).map(partner => renderPartnerCard(partner))}
              </div>
            )}
          </motion.div>
        )}

        {/* 故事專欄 */}
        {activeTab === 'stories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              ESG 英雄故事專欄
            </h2>

            {ECO_PARTNER_HEROES.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/50 cursor-pointer"
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{partner.avatar}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{partner.companyName}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{partner.quote}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 合作任務 */}
        {activeTab === 'missions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              合作任務
            </h2>

            {ECO_PARTNER_HEROES.filter(isPartnerUnlocked).map((partner) => (
              <div
                key={partner.id}
                className="p-4 bg-slate-800/50 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{partner.avatar}</span>
                  <span className="font-bold text-white">{partner.shortName}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">已完成專案</span>
                    <span className="text-cyan-400">{partner.partnership.projects} 個</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                      style={{ width: `${Math.min(100, partner.partnership.projects * 5)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 詳情彈窗 */}
      <AnimatePresence>
        {selectedPartner && renderPartnerModal()}
      </AnimatePresence>
    </div>
  );
};

export default EcoPartnersHeroStories;
