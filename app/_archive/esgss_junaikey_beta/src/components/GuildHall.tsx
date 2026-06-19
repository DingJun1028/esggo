import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type Guild, SubscriptionTier } from '@/types';

export const GuildHall: React.FC = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');

  useEffect(() => {
    loadGuilds();
  }, []);

  const loadGuilds = async () => {
    const allGuilds = await socialEconomyService.getGuilds();
    setGuilds(allGuilds);
    // Mock check if user is in guild
    const userGuild = allGuilds.find(g => g.members.some(m => m.userId === 'partner_1'));
    setMyGuild(userGuild || null);
  };

  const handleCreateGuild = async () => {
    setLoading(true);
    try {
      await socialEconomyService.createGuild('partner_1', newGuildName, '初創的永續學會');
      await loadGuilds();
      setShowCreateModal(false);
      setNewGuildName('');
      alert('學會創建成功！');
    } catch (err: any) {
      alert('創建失敗: ' + err.message);
    }
    setLoading(false);
  };

  const handleJoinGuild = async (guildId: string) => {
    // Mock join
    alert('申請已發送！(模擬)');
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            永續學會大廳 (Guild Hall)
          </h1>
          <p className="text-slate-400">集結眾人之力，共創永續未來</p>
        </div>
        {!myGuild && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
          >
            創建學會 (PRO Only)
          </button>
        )}
      </header>

      {myGuild ? (
        <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl">
              🏛️
            </div>
            <div>
              <h2 className="text-3xl font-bold">{myGuild.name}</h2>
              <div className="text-amber-400">
                Level {myGuild.level} • 成員 {myGuild.members.length}/50
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <h3 className="text-slate-400 text-sm mb-1">學會資金</h3>
              <div className="text-2xl font-bold text-yellow-400">{myGuild.treasury.gold} GSC</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <h3 className="text-slate-400 text-sm mb-1">科研指數</h3>
              <div className="text-2xl font-bold text-blue-400">
                {myGuild.technologies.length} 項研發中
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <h3 className="text-slate-400 text-sm mb-1">本週貢獻</h3>
              <div className="text-2xl font-bold text-emerald-400">Top 5%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map(guild => (
            <div
              key={guild.id}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  🏛️
                </div>
                <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                  Lv.{guild.level}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{guild.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{guild.description}</p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>成員: {guild.members.length}/50</span>
                <span>
                  會長: {guild.members.find(m => m.userId === guild.leaderId)?.userId || 'Unknown'}
                </span>
              </div>
              <button
                onClick={() => handleJoinGuild(guild.id)}
                className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                申請加入
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Guild Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-amber-500/30">
            <h2 className="text-2xl font-bold mb-6">創建新學會</h2>
            <input
              type="text"
              value={newGuildName}
              onChange={e => setNewGuildName(e.target.value)}
              placeholder="輸入學會名稱..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mb-6 focus:border-amber-500 outline-none text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600"
              >
                取消
              </button>
              <button
                onClick={handleCreateGuild}
                disabled={loading || !newGuildName}
                className="flex-1 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold disabled:opacity-50"
              >
                {loading ? '創建中...' : '確認創建 (需 Pro)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
