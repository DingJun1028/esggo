import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { WorldEvent, LeaderboardEntry, LeaderboardType } from '@/types/social';

export const WorldEventCenter: React.FC = () => {
  const [events, setEvents] = useState<WorldEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeType, setActiveType] = useState<LeaderboardType>('EXP');

  useEffect(() => {
    loadData();
  }, [activeType]);

  const loadData = async () => {
    const eventsData = await socialEconomyService.getWorldEvents();
    setEvents(eventsData);

    const rankData = await socialEconomyService.getLeaderboard(activeType);
    setLeaderboard(rankData);
  };

  const handleContribute = async (eventId: string) => {
    const amount = 100; // Mock fixed contribution
    await socialEconomyService.contributeToWorldEvent(eventId, amount);
    alert(`感謝您的貢獻！已投入 ${amount} 單位資源。`);
    // Refresh local state mock
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, totalProgress: e.totalProgress + amount, participants: e.participants + 1 }
          : e
      )
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0B0E14] text-white p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse">
          🌎 世界中心 (World Hub)
        </h1>
        <p className="text-slate-400 mt-2">全服共鬥 • 賽季排行 • 榮耀殿堂</p>
      </header>

      {/* World Events Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <span>全球緊急事件 (Global Events)</span>
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {events.map(event => {
            const progressPercent = Math.min(
              100,
              (event.totalProgress / event.targetProgress) * 100
            );

            return (
              <div
                key={event.id}
                className="relative bg-slate-900 border border-red-500/30 rounded-2xl p-8 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]"
              >
                {/* Background Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-bold text-white">{event.title}</h3>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30 animate-pulse">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-6 text-lg">{event.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-2 flex justify-between text-sm font-mono text-slate-400">
                      <span>
                        當前進度: {event.totalProgress.toLocaleString()} {event.unit}
                      </span>
                      <span>
                        目標: {event.targetProgress.toLocaleString()} {event.unit}
                      </span>
                    </div>
                    <div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-1000 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIOHY0MHptNDAgMEwwIDBoNDB2NDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30 animate-slide"></div>
                      </div>
                    </div>
                    <div className="mt-2 text-right text-orange-400 font-bold">
                      {progressPercent.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end min-w-[200px] border-l border-slate-800 pl-8">
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">參與人數</div>
                      <div className="text-2xl font-bold text-white">
                        {event.participants.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right my-4">
                      <div className="text-sm text-slate-500 mb-1">全服獎勵</div>
                      <div className="text-sm text-yellow-400 font-bold">{event.rewards.buff}</div>
                    </div>

                    <button
                      onClick={() => handleContribute(event.id)}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                    >
                      貢獻資源
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboards Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <span>賽季排行榜 (Season Rankings)</span>
          </h2>

          <div className="flex bg-slate-800 rounded-lg p-1">
            {(['EXP', 'GSC', 'CONTRIBUTION', 'CARBON_SAVED'] as LeaderboardType[]).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  activeType === type
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Player</th>
                <th className="px-6 py-4 font-medium">Guild</th>
                <th className="px-6 py-4 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard.map((entry, idx) => (
                <tr key={entry.userId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div
                      className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                            ${
                                              idx === 0
                                                ? 'bg-yellow-500 text-black'
                                                : idx === 1
                                                  ? 'bg-slate-300 text-black'
                                                  : idx === 2
                                                    ? 'bg-orange-700 text-white'
                                                    : 'bg-slate-800 text-slate-500'
                                            }
                                        `}
                    >
                      {entry.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                    {entry.nickname}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {entry.guildName ? `🛡️ ${entry.guildName}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-cyan-400 font-bold">
                    {entry.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
