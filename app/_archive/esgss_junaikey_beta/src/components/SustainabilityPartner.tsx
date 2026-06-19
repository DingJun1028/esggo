/**
 * 永續夥伴介面 (Sustainability Partner)
 * AI 夥伴管理與成長系統
 */

import React, { useState, useEffect } from 'react';
import {
  type AIPartner,
  type Skill,
  type OmniCard,
  type Equipment,
  CardType,
} from '../../shared/types';
import { OmniStore, OmniNamespace } from '../services/OmniStore';

export const SustainabilityPartner: React.FC = () => {
  const [partner, setPartner] = useState<AIPartner | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'starchart' | 'cards' | 'equipment'
  >('overview');

  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    // Try to load active partner
    const activePartnerRes = OmniStore.getItem<AIPartner>(OmniNamespace.PARTNER, 'current_id');
    let partnerData: AIPartner | null = null;

    if (activePartnerRes.success && typeof activePartnerRes.data === 'string') {
      const pRes = OmniStore.getItem<AIPartner>(OmniNamespace.PARTNER, activePartnerRes.data);
      if (pRes.success && pRes.data) {
        partnerData = pRes.data;
      }
    }

    // Fallback to default if no active partner found
    if (!partnerData) {
      const defaultRes = OmniStore.getItem<AIPartner>(OmniNamespace.PARTNER, 'default');
      if (defaultRes.success && defaultRes.data) {
        partnerData = defaultRes.data;
      }
    }

    if (partnerData) {
      setPartner(partnerData);
    } else {
      console.warn('No partner found in OmniStore, waiting for initialization...');
    }
  };

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 twinkle">✨</div>
          <h2 className="text-2xl font-bold text-cosmic mb-4">創建您的永續夥伴</h2>
          <button className="btn-cosmic px-8 py-4">🌟 開始旅程</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頂部導航 */}
      <div className="flex gap-3 mb-6">
        {[
          { id: 'overview', icon: '👤', label: '總覽' },
          { id: 'skills', icon: '⚔️', label: '技能' },
          { id: 'starchart', icon: '⭐', label: '星盤' },
          { id: 'cards', icon: '🃏', label: '卡牌冊' },
          { id: 'equipment', icon: '🛡️', label: '裝備' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg transition-cosmic ${
              activeTab === tab.id ? 'glass-strong glow' : 'glass hover:glass-strong'
            }`}
          >
            <span className="text-xl mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 內容區 */}
      {activeTab === 'overview' && <OverviewTab partner={partner} />}
      {activeTab === 'skills' && <SkillsTab partner={partner} />}
      {activeTab === 'starchart' && <StarChartTab partner={partner} />}
      {activeTab === 'cards' && <CardsTab partner={partner} />}
      {activeTab === 'equipment' && <EquipmentTab partner={partner} />}
    </div>
  );
};

// ========== 總覽標籤 ==========
const OverviewTab: React.FC<{ partner: AIPartner }> = ({ partner }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* 左側：夥伴資訊 */}
    <div className="lg:col-span-2 space-y-6">
      {/* 基本資訊 */}
      <div className="nebula-card p-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full glass-strong flex items-center justify-center text-6xl">
            🤖
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-cosmic mb-2">{partner.name}</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-yellow-400">Lv.{partner.level}</span>
              <div className="flex-1">
                <div className="h-3 glass rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 glow"
                    style={{ width: `${(partner.experience / partner.experienceToNext) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-indigo-400 mt-1">
                  {partner.experience} / {partner.experienceToNext} EXP
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass p-2 rounded">
                <span className="text-indigo-400">天賦點數:</span>
                <span className="ml-2 font-bold text-yellow-400">
                  {partner.talentPoints.available}
                </span>
              </div>
              <div className="glass p-2 rounded">
                <span className="text-indigo-400">卡牌收集:</span>
                <span className="ml-2 font-bold text-green-400">
                  {partner.growth.cardsCollected}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 屬性面板 */}
      <div className="nebula-card p-6">
        <h3 className="text-xl font-bold text-cosmic mb-4">核心屬性</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(partner.attributes).map(([key, value]) => (
            <div key={key} className="glass p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-indigo-300 capitalize">{key}</span>
                <span className="font-bold text-cosmic">{value}</span>
              </div>
              <div className="h-2 glass-strong rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 右側：統計 */}
    <div className="space-y-6">
      <div className="nebula-card p-6">
        <h3 className="text-xl font-bold text-cosmic mb-4">成長統計</h3>
        <div className="space-y-3">
          <StatItem icon="⚔️" label="技能使用" value={partner.growth.totalSkillsUsed} />
          <StatItem icon="📜" label="任務完成" value={partner.growth.questsCompleted} />
          <StatItem icon="🃏" label="卡牌收集" value={partner.growth.cardsCollected} />
          <StatItem icon="👑" label="史詩奧義" value={partner.growth.epicAbilitiesUnlocked} />
          <StatItem icon="⚡" label="傳說奧義" value={partner.growth.legendaryAbilitiesUnlocked} />
        </div>
      </div>
    </div>
  </div>
);

const StatItem: React.FC<{ icon: string; label: string; value: number }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center justify-between glass p-3 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-indigo-300">{label}</span>
    </div>
    <span className="font-bold text-cosmic">{value}</span>
  </div>
);

// ========== 技能標籤 ==========
const SkillsTab: React.FC<{ partner: AIPartner }> = ({ partner }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const res = OmniStore.getItem<Skill[]>(OmniNamespace.PARTNER, `${partner.id}_skills`);
    if (res.success && res.data) {
      setSkills(res.data);
    }
  }, [partner.id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-cosmic mb-6">⚔️ 技能樹</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.length > 0 ? (
          skills.map(skill => (
            <div
              key={skill.id}
              className="nebula-card p-6 relative overflow-hidden hover:glass-strong transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-2xl bg-glass p-2 rounded-lg">✨</div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-900 text-indigo-200">
                  Lv.{skill.level}
                </span>
              </div>
              <h3 className="font-bold text-lg text-cosmic mb-2">{skill.name}</h3>
              <p className="text-sm text-indigo-300">{skill.description}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-indigo-400">
                <span>被動: {skill.type}</span>
                <span>稀有度: {skill.rarity}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-indigo-400">
            <div className="text-4xl mb-2">🌱</div>
            <p>尚無技能數據，請持續互動以覺醒能力</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== 星盤標籤 ==========
const StarChartTab: React.FC<{ partner: AIPartner }> = ({ partner }) => (
  <div>
    <h2 className="text-2xl font-bold text-cosmic mb-6">⭐ 天賦星盤</h2>
    <div className="nebula-card p-8">
      <div className="text-center">
        <div className="text-6xl mb-4 twinkle">🌌</div>
        <h3 className="text-xl font-bold text-cosmic mb-2">三大星系</h3>
        <p className="text-indigo-300 mb-6">知識 • 行動 • 和諧</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="glass p-4 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-bold text-cosmic">知識星系</div>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-cosmic">行動星系</div>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-3xl mb-2">💖</div>
            <div className="font-bold text-cosmic">和諧星系</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ========== 卡牌標籤 ==========
const CardsTab: React.FC<{ partner: AIPartner }> = ({ partner }) => {
  const [cards, setCards] = useState<OmniCard[]>([]);

  useEffect(() => {
    const res = OmniStore.getItem<OmniCard[]>(OmniNamespace.PARTNER, `${partner.id}_cards`);
    if (res.success && res.data) {
      setCards(res.data);
    }
  }, [partner.id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-cosmic mb-6">🃏 奧秘卡牌冊</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cards.length > 0 ? (
          cards.map(card => (
            <div
              key={card.id}
              className="nebula-card p-4 aspect-[2/3] flex flex-col items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform"
            >
              <div className="absolute top-1 right-2 text-xs font-bold text-yellow-400">
                {card.rarity}
              </div>
              <div className="text-4xl mb-2">{card.type === CardType.SKILL ? '⚔️' : '🛡️'}</div>
              <div className="text-xs text-indigo-400 text-center font-bold">{card.name}</div>
              <div className="text-[10px] text-indigo-300 mt-1 text-center">
                {card.effects[0]?.description || ''}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-indigo-400">
            <div className="text-4xl mb-2">📭</div>
            尚無卡牌數據
          </div>
        )}
      </div>
    </div>
  );
};

// ========== 裝備標籤 ==========
const EquipmentTab: React.FC<{ partner: AIPartner }> = ({ partner }) => (
  <div>
    <h2 className="text-2xl font-bold text-cosmic mb-6">🛡️ 裝備系統</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 裝備槽位 */}
      <div className="nebula-card p-6">
        <h3 className="text-xl font-bold text-cosmic mb-4">裝備槽位</h3>
        <div className="space-y-3">
          {['weapon', 'armor', 'accessory_1', 'accessory_2', 'artifact'].map(slot => (
            <div key={slot} className="glass p-4 rounded-lg flex items-center gap-4">
              <div className="w-16 h-16 glass-strong rounded-lg flex items-center justify-center text-3xl">
                {slot === 'weapon' && '⚔️'}
                {slot === 'armor' && '🛡️'}
                {slot.startsWith('accessory') && '💍'}
                {slot === 'artifact' && '👑'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-cosmic capitalize">{slot.replace('_', ' ')}</div>
                <div className="text-sm text-indigo-400">空槽位</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 裝備列表 */}
      <div className="nebula-card p-6">
        <h3 className="text-xl font-bold text-cosmic mb-4">裝備倉庫</h3>
        <div className="text-center text-indigo-300 py-12">
          <div className="text-6xl mb-4">📦</div>
          <p>完成任務獲得裝備</p>
        </div>
      </div>
    </div>
  </div>
);
