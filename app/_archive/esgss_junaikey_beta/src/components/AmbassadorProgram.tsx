import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type AmbassadorProfile, Faction } from '@/types';
import { omniClient } from '../api/omniClient';

export const AmbassadorProgram: React.FC = () => {
  const [profile, setProfile] = useState<AmbassadorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const p = await socialEconomyService.getAmbassadorProfile('partner_1');
    setProfile(p);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoinFaction = async (faction: Faction) => {
    setLoading(true);
    try {
      await socialEconomyService.joinFaction('partner_1', faction);
      await loadData();
      // Trigger animation or sound here
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  const handleSimulateReferral = async () => {
    if (!profile) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // fake delay
    await socialEconomyService.simulateReferralSuccess('partner_1');
    await loadData();
    alert('🎉 恭喜！一位新夥伴使用了您的邀請碼註冊成功！您獲得了 200 GSC！');
    setLoading(false);
  };

  const factionInfo = {
    [Faction.TERRA_GUARDIANS]: {
      name: '大地守護者',
      desc: '專注於環境保護 (E)，守護森林與海洋',
      color: 'from-emerald-500 to-green-600',
      icon: '🌍',
    },
    [Faction.HUMANITY_UNITED]: {
      name: '人類同盟',
      desc: '致力於社會福祉 (S)，推動平等與教育',
      color: 'from-pink-500 to-rose-600',
      icon: '🤝',
    },
    [Faction.FUTURE_ARCHITECTS]: {
      name: '未來架構師',
      desc: '構建良善治理 (G)，設計永續制度',
      color: 'from-blue-500 to-indigo-600',
      icon: '🏛️',
    },
  };

  if (!profile) {
    return (
      <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            選擇您的陣營
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            成為永續大使，招募夥伴加入，共同打造美好未來。
            <br />
            <span className="text-amber-400 text-sm">現在加入即贈送 100 GSC 啟動資金！</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(Faction).map(f => (
              <div
                key={f}
                className={`
                                    relative group p-1 rounded-2xl transition-all duration-300 hover:-translate-y-2
                                    bg-gradient-to-b ${factionInfo[f].color} cursor-pointer
                                `}
                onClick={() => !loading && handleJoinFaction(f)}
              >
                <div className="bg-slate-900 rounded-xl p-8 h-full flex flex-col items-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    {factionInfo[f].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{factionInfo[f].name}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">{factionInfo[f].desc}</p>
                  <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    加入陣營
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentFaction = factionInfo[profile.faction];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{currentFaction.icon}</span>
            <h1 className="text-3xl font-bold text-white">{currentFaction.name} 大使中心</h1>
          </div>
          <p className="text-slate-400">
            您的身份: <span className="text-amber-400 font-bold">{profile.rank}</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">累積收益</div>
          <div className="text-3xl font-mono font-bold text-yellow-400">
            {profile.totalEarnedGSC} <span className="text-sm">GSC</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Invite Code Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>💌</span> 您的專屬邀請碼
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-900 border-2 border-emerald-500/30 text-emerald-400 text-4xl font-mono font-bold px-8 py-4 rounded-xl tracking-wider select-all">
              {profile.referralCode}
            </div>
            <button
              className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-xl text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              onClick={() => {
                navigator.clipboard.writeText(profile.referralCode);
                alert('已複製到剪貼簿！');
              }}
            >
              複製
            </button>
          </div>

          <p className="text-slate-400">
            每邀請一位好友成功註冊，您將獲得{' '}
            <span className="text-yellow-400 font-bold">200 GSC</span>，<br />
            好友也將獲得 <span className="text-emerald-400 font-bold">新手大禮包 (含稀有卡片)</span>
            ！
          </p>

          {/* Simulation Button */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleSimulateReferral}
              disabled={loading}
              className="text-sm text-slate-500 underline hover:text-white"
            >
              [開發測試] 模擬一位好友註冊成功
            </button>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="bg-slate-800 p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">晉升進度</h2>

          <div className="relative pt-4 pb-8 text-center">
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white mb-1">{profile.totalReferrals} / 10</div>
            <div className="text-sm text-slate-400">已招募人數</div>

            {/* Progress Bar */}
            <div className="mt-6 h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, (profile.totalReferrals / 10) * 100)}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-amber-500 flex justify-between">
              <span>大使</span>
              <span>領事 (10人)</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-4">
            晉升為「領事」可解鎖：
            <br />
            <span className="text-white">• 1000 GSC 獎金</span>
            <br />
            <span className="text-white">• 生成專屬學會徽章</span>
          </p>
        </div>
      </div>

      {/* Recent History (Placeholder / Simple List) */}
      <h3 className="text-xl font-bold mb-4">最近收益記錄</h3>
      <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5">
        {[...Array(Math.min(5, profile.totalReferrals))].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-slate-700/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs">
                +
              </div>
              <div>
                <div className="font-bold text-sm">成功邀請新夥伴</div>
                <div className="text-xs text-slate-500">邀請碼使用</div>
              </div>
            </div>
            <div className="text-yellow-400 font-mono font-bold">+200 GSC</div>
          </div>
        ))}
        {profile.totalReferrals === 0 && (
          <div className="p-8 text-center text-slate-500">尚無記錄，快去分享您的邀請碼吧！</div>
        )}
      </div>
    </div>
  );
};
