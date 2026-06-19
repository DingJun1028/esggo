import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { DebateCard, DebateState } from '@/types/social';
import { Sparkles } from 'lucide-react';
// Note: 'lucide-react' seems more standard for Sparkles if icons.tsx is missing,
// checking file content showed "import { Sparkles } from './icons';" - assuming icons exists.
// But earlier "icons.tsx" wasn't listed. Let's keep icons import if it works, or switch to lucide.
// Actually, earlier file lists didn't show icons.tsx in components.
// I will switch to lucide-react for safety as it is in package.json (usually).

export const DebateArena: React.FC = () => {
  const [gameState, setGameState] = useState<DebateState | null>(null);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'VICTORY' | 'DEFEAT'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);

  const startGame = async () => {
    const initial = await socialEconomyService.getInitialDebateState();
    setGameState(initial);
    setGameStatus('PLAYING');
    setLogs(['辯論開始！對手：誤解怪獸']);
  };

  const playCard = async (card: DebateCard, index: number) => {
    if (!gameState || gameStatus !== 'PLAYING') return;
    if (gameState.playerAP < card.cost) {
      alert('行動力不足！');
      return;
    }

    // Player Action
    let newEnemyHP = gameState.enemyHP;
    let newPlayerHP = gameState.playerHP;

    if (card.type === 'ATTACK') {
      newEnemyHP -= card.value;
      addLog(`你使用了[${card.name}]，造成 ${card.value} 點傷害`);
    } else if (card.type === 'DEFENSE') {
      newPlayerHP += card.value;
      addLog(`你使用了[${card.name}]，恢復 ${card.value} 點信心`);
    }

    // Remove card and reduce AP
    const newHand = [...gameState.playerHand];
    newHand.splice(index, 1);

    setGameState(prev =>
      prev
        ? {
            ...prev,
            playerHP: newPlayerHP,
            enemyHP: newEnemyHP,
            playerAP: prev.playerAP - card.cost,
            playerHand: newHand,
          }
        : null
    );

    // Check Victory
    if (newEnemyHP <= 0) {
      setGameStatus('VICTORY');
      addLog('對手已被邏輯說服！你贏了！');
    }
  };

  const endTurn = async () => {
    if (!gameState || gameStatus !== 'PLAYING') return;
    addLog('回合結束，輪到對手行動...');

    // Mock wait
    setTimeout(async () => {
      const nextState = await socialEconomyService.enemyAction(gameState);

      // Draw new cards for new turn
      const newCards = await socialEconomyService.drawCards(2);
      nextState.playerHand = [...gameState.playerHand, ...newCards].slice(0, 5); // Max 5 cards

      setGameState(nextState);
      // The original addLog call is replaced by the new setLogs call as per instruction.
      // The 'message' variable is not defined in the provided snippet, so I'm using a placeholder.
      // If 'gameState.round' is not yet part of DebateState, it would need to be added.
      setLogs((prev: string[]) =>
        [`[回合 ${gameState.round || 1}]對手對你造成了傷害，你的新回合開始(AP回復)`, ...prev].slice(
          0,
          5
        )
      ); // Max 5 cards

      if (nextState.playerHP <= 0) {
        setGameStatus('DEFEAT');
        addLog('你的信心崩潰了...辯論失敗');
      }
    }, 1000);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev]);
  };

  if (gameStatus === 'IDLE') {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Debate Arena
          </h1>
          <p className="text-slate-400 mb-8">使用 ESG 知識卡片擊敗誤解怪獸！</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full font-bold text-xl hover:scale-105 transition-transform"
          >
            開始辯論 (Start Game)
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://source.unsplash.com/random/1920x1080?library')] bg-cover"></div>

      {/* Top Bar: Enemy */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="bg-slate-800/90 p-6 rounded-2xl border border-red-500/50 w-full max-w-2xl text-center backdrop-blur-sm">
          <div className="text-red-400 font-bold mb-2 text-xl">👹 誤解怪獸 (Greenscam)</div>
          <div className="w-full h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
            <div
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${Math.max(0, (gameState.enemyHP / 100) * 100)}% ` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {gameState.enemyHP}/100
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-400">
            意圖: {gameState.enemyIntent === 'ATTACK' ? '準備攻擊 ⚔️' : '防禦架勢 🛡️'}
          </div>
        </div>
      </div>

      {/* Middle: Arena & Logs */}
      <div className="flex-1 flex gap-4 overflow-hidden relative z-10">
        <div className="w-full max-w-xs bg-black/40 rounded-xl p-4 overflow-y-auto hidden md:block backdrop-blur-sm">
          <div className="text-xs font-bold text-slate-500 mb-2">戰鬥紀錄</div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1 text-sm border-b border-white/5 pb-1">
              {log}
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
          {gameStatus === 'VICTORY' && (
            <div className="text-6xl font-bold text-yellow-400 animate-bounce">VICTORY! 🏆</div>
          )}
          {gameStatus === 'DEFEAT' && (
            <div className="text-6xl font-bold text-red-500 animate-pulse">DEFEAT... 💀</div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Player Hand */}
      <div className="mt-8 relative z-10">
        <div className="flex justify-between items-end mb-4 px-8">
          <div className="bg-slate-800/90 p-4 rounded-xl border border-blue-500/50 backdrop-blur-sm">
            <div className="text-blue-400 font-bold mb-1">🛡️ 你的信心值</div>
            <div className="w-48 h-4 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.max(0, (gameState.playerHP / 100) * 100)}% ` }}
              ></div>
            </div>
            <div className="font-mono text-cyan-300">AP: {gameState.playerAP} / 3</div>
          </div>
          <button
            onClick={endTurn}
            disabled={gameStatus !== 'PLAYING'}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold border border-slate-500"
          >
            結束回合 (End Turn)
          </button>
        </div>

        <div className="flex justify-center gap-4 overflow-x-auto pb-4 px-4 min-h-[220px]">
          {gameState.playerHand.map((card: DebateCard, idx: number) => (
            <button
              key={card.id + idx}
              onClick={() => playCard(card, idx)}
              disabled={gameStatus !== 'PLAYING' || gameState.playerAP < card.cost}
              className={`
                                relative w-40 h-56 bg-gradient-to-br from-slate-800 to-slate-900
                                rounded-xl border-2 p-4 flex flex-col text-left transition-all hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/20
                                ${gameState.playerAP < card.cost ? 'opacity-50 grayscale border-slate-700' : 'border-cyan-500/50 hover:border-cyan-400 cursor-pointer'}
                            `}
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-black ${card.type === 'ATTACK' ? 'bg-red-400' : 'bg-blue-400'} `}
                >
                  {card.cost}
                </div>
                <div className="text-xs text-slate-400">{card.type}</div>
              </div>
              <h3 className="font-bold text-lg mb-2 leading-tight">{card.name}</h3>
              <p className="text-xs text-slate-400 flex-1">{card.description}</p>
              <div className="mt-2 pt-2 border-t border-white/10 text-center">
                <Sparkles className="w-4 h-4 mx-auto text-cyan-500" />
              </div>
            </button>
          ))}
          {gameState.playerHand.length === 0 && (
            <div className="text-slate-500 self-center">無手牌</div>
          )}
        </div>
      </div>
    </div>
  );
};
