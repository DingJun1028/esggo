import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna,
  Zap,
  Beaker,
  Trash2,
  Download,
  AlertCircle,
  Copy,
  ChevronRight,
  Search,
  Leaf,
} from 'lucide-react';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { useGeneticEngine, GeneticBlueprint } from '../../hooks/useGeneticEngine';
import { Language } from '@/types';

interface GeneticForgeProps {
  readonly language?: Language;
}

export const GeneticForge: React.FC<GeneticForgeProps> = ({ language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  const { profile } = useAgentRpg();
  const { blueprints, extractBlueprint, deleteBlueprint } = useGeneticEngine();
  const [isExtracting, setIsExtracting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Calibrate Sequencer', description: 'Align the primary DNA scanner.' },
    { id: 2, title: 'Run Diagnostics', description: 'Check all systems for errors.' },
    { id: 3, title: 'Archive Old Data', description: 'Move legacy blueprints to cold storage.' },
  ]);

  const isEligible = profile.level >= 10;

  const handleExtract = async () => {
    setIsExtracting(true);
    // Artificial delay for "Scanning" effect
    await new Promise(r => setTimeout(r, 2000));

    const result = extractBlueprint(profile);
    if (result.success) {
      // Success log handled by internal logic or could add toast
    }
    setIsExtracting(false);
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredBlueprints = blueprints.filter(
    b =>
      b.sourceAgentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Extraction Chamber */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Dna className={`w-6 h-6 text-purple-400 ${isExtracting ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isZh ? '基因提取室' : 'Extraction Chamber'}
                </h3>
                <p className="text-xs text-purple-400/70 font-mono">GENETIC_SEQUENCER_v4.2</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 uppercase font-bold">
                  {isZh ? '當前目標' : 'Current Subject'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded ${isEligible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {isEligible ? (isZh ? '符合資格' : 'Eligible') : isZh ? '資格不符' : 'Ineligible'}
                </span>
              </div>

              <div className="border-l-2 border-purple-500 pl-4 py-1">
                <div className="text-lg font-bold text-gray-200">{profile.title}</div>
                <div className="text-xs text-gray-500">
                  Lv.{profile.level} • {profile.archetypeId}
                </div>
              </div>
            </div>

            {!isEligible ? (
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-8 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="text-xs text-red-400/80 leading-relaxed">
                  <span className="font-bold text-red-500">
                    {isZh ? '提取鎖定。' : 'Extraction Locked.'}
                  </span>
                  {isZh
                    ? '目標必須達到 等級 10 才能提供穩定的基因序列。'
                    : 'Subject must reach Level 10 to provide a stable genetic sequence.'}
                </div>
              </div>
            ) : (
              <button
                onClick={handleExtract}
                disabled={isExtracting}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isExtracting
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/20'
                }`}
              >
                <Zap className={`w-5 h-5 ${isExtracting ? 'animate-pulse' : ''}`} />
                {isExtracting
                  ? isZh
                    ? '序列分析中...'
                    : 'Analyzing Sequence...'
                  : isZh
                    ? '提取基因藍圖'
                    : 'Extract Genetic Blueprint'}
              </button>
            )}

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-4">
                {isZh ? '科學協定' : 'Scientific Protocol'}
              </div>
              <ul className="space-y-3">
                <li className="flex gap-2 text-[10px] text-gray-500">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  {isZh
                    ? '提取 20% 的顯性屬性作為遺傳加成。'
                    : 'Extract 20% of dominant traits as genetic bonus.'}
                </li>
                <li className="flex gap-2 text-[10px] text-gray-500">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  {isZh
                    ? '藍圖可用於新代理人具現化過程。'
                    : 'Blueprints can be used in the embodiment of new agents.'}
                </li>
                <li className="flex gap-2 text-[10px] text-gray-500">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  {isZh
                    ? '提取過程不會影響目標本體。'
                    : 'Extraction does not affect the source unit.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Blueprint Library */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-purple-500" />
                {isZh ? '基因藍圖庫' : 'Blueprint Archive'}
              </h3>
              <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-tight">
                {isZh
                  ? `已存儲 ${blueprints.length} 條序列`
                  : `${blueprints.length} sequences archived`}
              </p>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                type="text"
                placeholder={isZh ? '搜尋藍圖...' : 'Search Blueprints...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50 w-48 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            <div className="space-y-3">
              {filteredBlueprints.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  {isZh ? '未找到藍圖' : 'No blueprints found'}
                </div>
              ) : (
                filteredBlueprints.map(bp => (
                  <div
                    key={bp.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          bp.rarity === 'Legendary'
                            ? 'bg-orange-500/20 text-orange-400'
                            : bp.rarity === 'Epic'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        <Dna className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">{bp.sourceAgentName}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {bp.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title={isZh ? '複製' : 'Clone'}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteBlueprint(bp.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title={isZh ? '刪除' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
