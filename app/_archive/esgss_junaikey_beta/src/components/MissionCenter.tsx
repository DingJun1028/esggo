import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { Mission, MissionType, MissionRarity } from '../../shared/types';

export const MissionCenter: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeTab, setActiveTab] = useState<MissionType>('DAILY');

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    const data = await socialEconomyService.getMissions('partner_1');
    setMissions(data);
  };

  const handleClaim = async (id: string) => {
    const success = await socialEconomyService.claimMission('partner_1', id);
    if (success) {
      setMissions(prev => prev.map(m => (m.id === id ? { ...m, status: 'CLAIMED' } : m)));
      // Show toast
      const toast = document.createElement('div');
      toast.className =
        'fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-3 rounded-full shadow-lg z-50 animate-bounce-in';
      toast.textContent = '🎉 獎勵已領取！ (Reward Claimed!)';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const filteredMissions = missions.filter(m => m.type === activeTab);

  // Rarity Colors
  const getRarityColor = (rarity: MissionRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] bg-orange-950/20';
      case 'EPIC':
        return 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] bg-purple-950/20';
      case 'RARE':
        return 'border-blue-400 bg-blue-950/20';
      default:
        return 'border-slate-700 bg-slate-800/50';
    }
  };

  const getRarityText = (rarity: MissionRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-orange-400';
      case 'EPIC':
        return 'text-purple-400';
      case 'RARE':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
          任務中心 (Mission Center)
        </h1>
        <p className="text-slate-400">完成挑戰，獲取豐厚獎勵</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1">
        {(['DAILY', 'WEEKLY', 'CAREER', 'CHALLENGE'] as MissionType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold transition-all relative ${
              activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        {filteredMissions.map(mission => (
          <div
            key={mission.id}
            className={`
                            relative p-6 rounded-xl border transition-all hover:-translate-y-1
                            ${getRarityColor(mission.rarity)}
                        `}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${getRarityText(mission.rarity)}`}
                  >
                    {mission.rarity}
                  </span>
                  <h3 className="text-xl font-bold">{mission.title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">{mission.description}</p>

                {/* Progress Bar */}
                <div className="max-w-md">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>進度</span>
                    <span>
                      {mission.progress} / {mission.target} {mission.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                {/* Rewards */}
                <div className="flex gap-2 text-xs">
                  {mission.rewards.gsc && (
                    <span className="px-2 py-1 bg-yellow-400/10 text-yellow-300 rounded border border-yellow-400/20">
                      +{mission.rewards.gsc} GSC
                    </span>
                  )}
                  {mission.rewards.exp && (
                    <span className="px-2 py-1 bg-purple-400/10 text-purple-300 rounded border border-purple-400/20">
                      +{mission.rewards.exp} EXP
                    </span>
                  )}
                </div>

                {/* Action Button */}
                {mission.status === 'COMPLETED' ? (
                  <button
                    onClick={() => handleClaim(mission.id)}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg shadow-lg hover:brightness-110 animate-pulse"
                  >
                    領取獎勵
                  </button>
                ) : mission.status === 'CLAIMED' ? (
                  <button
                    disabled
                    className="px-6 py-2 bg-slate-700 text-slate-500 font-bold rounded-lg cursor-not-allowed"
                  >
                    已領取
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2 bg-slate-800 text-slate-500 font-bold rounded-lg border border-slate-700"
                  >
                    進行中
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredMissions.length === 0 && (
          <div className="text-center py-20 text-slate-500">目前沒有此類別的任務</div>
        )}
      </div>
    </div>
  );
};
