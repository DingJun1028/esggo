import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type Mentorship } from '../../shared/types';

export const MentorshipCenter: React.FC = () => {
  const [role, setRole] = useState<'mentor' | 'apprentice' | null>(null);
  const [mentorships, setMentorships] = useState<{
    mentor?: Mentorship | undefined;
    apprentices: Mentorship[];
  }>({ apprentices: [] });
  const [loading, setLoading] = useState(false);

  // Mock Users for Demo
  const MOCK_USERS = [
    { id: 'user_2', name: 'Gaia Sage', level: 85, avatar: '🧙‍♂️', tier: 'PRO' },
    { id: 'user_3', name: 'Eco Novice', level: 12, avatar: '🌱', tier: 'FREE' },
    { id: 'user_4', name: 'Carbon Hunter', level: 45, avatar: '🏹', tier: 'PLUS' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await socialEconomyService.getUserMentorships('partner_1');
    setMentorships(data);
  };

  const handleCreateMentorship = async (targetId: string, type: 'recruit' | 'apply') => {
    setLoading(true);
    try {
      if (type === 'recruit') {
        await socialEconomyService.createMentorship('partner_1', targetId);
      } else {
        await socialEconomyService.createMentorship(targetId, 'partner_1');
      }
      await loadData();
      alert('關係建立成功！');
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleInherit = async (mentorshipId: string) => {
    await socialEconomyService.inheritKnowledge(mentorshipId, 'knowledge_esg_basis');
    alert('知識傳承成功！獲得 50 GSC 獎勵');
    await loadData();
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        師徒傳承中心 (Mentorship)
      </h1>
      <p className="text-slate-400 mb-8">傳承 ESG 智慧，培育下一代永續領袖</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Relationships */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎓</span> 我的導師 (Mentor)
            </h2>

            {mentorships.mentor ? (
              <div className="flex items-center gap-4 bg-slate-700/30 p-4 rounded-xl border border-purple-500/30">
                <div className="text-4xl">🧙‍♂️</div>
                <div>
                  <div className="font-bold text-lg">Grand Master 1</div>
                  <div className="text-xs text-purple-300">Level 99 • Pro Member</div>
                </div>
                <div className="ml-auto text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                  ESG 傳承中
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                尚未拜師
                <br />
                尋找資深玩家指引你的道路
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🌱</span> 我的學徒 (Apprentices)
            </h2>

            <div className="space-y-3">
              {mentorships.apprentices.length > 0 ? (
                mentorships.apprentices.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between bg-slate-700/30 p-4 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌱</div>
                      <div>
                        <div className="font-bold">{m.apprenticeId}</div>
                        <div className="text-xs text-slate-400">
                          傳承度: {m.inheritedKnowledgeIds.length} 知識點
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInherit(m.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      ✨ 傳功
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  暫無學徒
                  <br />
                  收徒可獲得大量聲望與 GSC
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recruitment Hall */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>🌍</span> 尋找夥伴
          </h2>

          <div className="space-y-4">
            {MOCK_USERS.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {user.name}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          user.tier === 'PRO'
                            ? 'border-amber-500 text-amber-500'
                            : user.tier === 'PLUS'
                              ? 'border-emerald-500 text-emerald-500'
                              : 'border-slate-500 text-slate-500'
                        }`}
                      >
                        {user.tier}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">Level {user.level}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateMentorship(user.id, 'apply')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-xs"
                  >
                    拜師
                  </button>
                  <button
                    onClick={() => handleCreateMentorship(user.id, 'recruit')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs shadow-lg shadow-emerald-500/20"
                  >
                    收徒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
