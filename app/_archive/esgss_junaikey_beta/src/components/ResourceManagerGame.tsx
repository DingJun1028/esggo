import React, { useState } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';

export const ResourceManagerGame: React.FC = () => {
  const [resources, setResources] = useState({ energy: 100, materials: 50, output: 0 });
  const [log, setLog] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAction = async (action: 'ALLOCATE' | 'HARVEST') => {
    setIsPlaying(true);
    const result = await socialEconomyService.playResourceGame(
      action,
      action === 'ALLOCATE' ? 'energy' : 'materials'
    );

    if (result.success) {
      setResources(prev => ({
        energy: prev.energy - (action === 'ALLOCATE' ? 10 : 0),
        materials: prev.materials - (action === 'HARVEST' ? 10 : 0),
        output: prev.output + result.reward,
      }));
      addLog(`✅ 成功! 獲得 ${result.reward} 產出`, 'success');
    } else {
      setResources(prev => ({
        energy: prev.energy - 5,
        materials: prev.materials - 5,
        output: prev.output,
      }));
      addLog(`❌ 失敗! 損失了資源`, 'error');
    }
    setIsPlaying(false);
  };

  const addLog = (msg: string, type: 'success' | 'error') => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  return (
    <div className="h-full bg-slate-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
        資源調度室 (Resource Manager)
      </h1>

      <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-slate-900 p-4 rounded-lg border border-cyan-500/30">
            <div className="text-sm text-slate-400">⚡ 能量</div>
            <div className="text-2xl font-mono text-cyan-400">{resources.energy}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-emerald-500/30">
            <div className="text-sm text-slate-400">📦 原料</div>
            <div className="text-2xl font-mono text-emerald-400">{resources.materials}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-yellow-500/30">
            <div className="text-sm text-slate-400">🏭 總產出</div>
            <div className="text-3xl font-bold text-yellow-500">{resources.output}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => handleAction('ALLOCATE')}
            disabled={isPlaying || resources.energy < 10}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all hover:-translate-y-1"
          >
            投入能量 (-10⚡)
          </button>
          <button
            onClick={() => handleAction('HARVEST')}
            disabled={isPlaying || resources.materials < 10}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all hover:-translate-y-1"
          >
            提煉原料 (-10📦)
          </button>
        </div>

        <div className="bg-black/30 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm border border-slate-700">
          {log.map((entry, i) => (
            <div key={i} className={entry.includes('成功') ? 'text-green-400' : 'text-red-400'}>
              {entry}
            </div>
          ))}
          {log.length === 0 && <div className="text-slate-600 italic">系統待機中...請執行操作</div>}
        </div>
      </div>
    </div>
  );
};
