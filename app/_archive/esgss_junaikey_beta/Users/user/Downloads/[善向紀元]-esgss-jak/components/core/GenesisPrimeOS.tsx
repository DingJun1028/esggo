import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Eye,
  Target,
  TrendingUp,
  Award,
  Star,
  Sword,
  Crown,
  MapPin,
  Activity,
  Users,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Language } from '../../types';
import { UniversalAgentContext } from '../../contexts/UniversalAgentContext';

interface HolographicHUDProps {
  language: Language;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface RPGCharacter {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  class: 'Strategist' | 'Visionary' | 'Guardian' | 'Innovator';
  attributes: {
    strategy: number;
    insight: number;
    leadership: number;
    resilience: number;
  };
  skills: string[];
  equipment: string[];
  reputation: number;
  quests: Quest[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  progress: number;
  total: number;
  reward: {
    xp: number;
    reputation: number;
    items?: string[];
  };
}

interface StrategicMetrics {
  systemIntegrity: number;
  contextLoad: number;
  evolutionProgress: number;
  activeAgents: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

const HolographicHUD: React.FC<HolographicHUDProps> = ({ language, isExpanded, onToggleExpand }) => {

  const [metrics, setMetrics] = useState<StrategicMetrics>({
    systemIntegrity: 98,
    contextLoad: 76,
    evolutionProgress: 85,
    activeAgents: 12,
    threatLevel: 'low'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        systemIntegrity: Math.max(90, Math.min(100, prev.systemIntegrity + (Math.random() - 0.5) * 2)),
        contextLoad: Math.max(0, Math.min(100, prev.contextLoad + (Math.random() - 0.5) * 5)),
        evolutionProgress: Math.min(100, prev.evolutionProgress + Math.random() * 0.1),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getIntegrityColor = (value: number) => {
    if (value >= 95) return 'text-green-400';
    if (value >= 85) return 'text-yellow-400';
    if (value >= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden ${isExpanded ? 'w-96 h-64' : 'w-64 h-32'
        }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold text-sm">
            {language === 'zh-TW' ? '全息戰略 HUD' : 'HOLOGRAPHIC HUD'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleExpand}
            className="p-1 rounded hover:bg-cyan-500/20 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          </motion.button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-3 grid grid-cols-2 gap-3">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Shield className={`w-4 h-4 ${getIntegrityColor(metrics.systemIntegrity)}`} />
          <div className="flex-1">
            <div className="text-xs text-gray-400">
              {language === 'zh-TW' ? '系統完整性' : 'SYSTEM INTEGRITY'}
            </div>
            <div className={`text-sm font-bold ${getIntegrityColor(metrics.systemIntegrity)}`}>
              {metrics.systemIntegrity.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Target className="w-4 h-4 text-blue-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">
              {language === 'zh-TW' ? '脈絡負載' : 'CONTEXT LOAD'}
            </div>
            <div className="text-sm font-bold text-blue-400">
              {metrics.contextLoad.toFixed(0)}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">
              {language === 'zh-TW' ? '演化進度' : 'EVOLUTION PROGRESS'}
            </div>
            <div className="text-sm font-bold text-purple-400">
              {metrics.evolutionProgress.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Users className="w-4 h-4 text-green-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">
              {language === 'zh-TW' ? '活躍代理' : 'ACTIVE AGENTS'}
            </div>
            <div className="text-sm font-bold text-green-400">
              {metrics.activeAgents}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Threat Level */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3"
          >
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${getThreatColor(metrics.threatLevel)}`} />
              <div className="flex-1">
                <div className="text-xs text-gray-400">
                  {language === 'zh-TW' ? '威脅等級' : 'THREAT LEVEL'}
                </div>
                <div className={`text-sm font-bold uppercase ${getThreatColor(metrics.threatLevel)}`}>
                  {metrics.threatLevel}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface RPGCharacterSheetProps {
  character: RPGCharacter;
  language: Language;
}

const RPGCharacterSheet: React.FC<RPGCharacterSheetProps> = ({ character, language }) => {
  const getClassIcon = (charClass: string) => {
    switch (charClass) {
      case 'Strategist': return <Target className="w-5 h-5" />;
      case 'Visionary': return <Eye className="w-5 h-5" />;
      case 'Guardian': return <Shield className="w-5 h-5" />;
      case 'Innovator': return <Zap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getClassColor = (charClass: string) => {
    switch (charClass) {
      case 'Strategist': return 'text-blue-400 border-blue-400/30';
      case 'Visionary': return 'text-purple-400 border-purple-400/30';
      case 'Guardian': return 'text-green-400 border-green-400/30';
      case 'Innovator': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <motion.div
      className={`bg-black/90 backdrop-blur-md border rounded-lg p-4 ${getClassColor(character.class)}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Character Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full border-2 ${getClassColor(character.class)}`}>
          {getClassIcon(character.class)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{character.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-cyan-400">Lv.{character.level}</span>
            <span className="text-gray-400">
              {language === 'zh-TW' ? character.class : character.class}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">
            {language === 'zh-TW' ? '聲望' : 'REPUTATION'}
          </div>
          <div className="text-sm font-bold text-yellow-400">{character.reputation}</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">
            {language === 'zh-TW' ? '經驗值' : 'XP'}
          </span>
          <span className="text-cyan-400">
            {character.xp} / {character.xpToNext}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(character.xp / character.xpToNext) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(character.attributes).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-sm text-gray-400 capitalize">
              {language === 'zh-TW' ? key : key}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-12 bg-gray-700 rounded h-1">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / 100) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
              <span className="text-xs text-white w-6">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Quests */}
      <div>
        <h4 className="text-sm font-bold text-white mb-2">
          {language === 'zh-TW' ? '活躍任務' : 'ACTIVE QUESTS'}
        </h4>
        <div className="space-y-2">
          {character.quests.slice(0, 2).map((quest) => (
            <div key={quest.id} className="bg-gray-800/50 rounded p-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-white font-medium">{quest.title}</span>
                <span className={`text-xs px-1 py-0.5 rounded ${quest.type === 'main' ? 'bg-blue-500/20 text-blue-400' :
                    quest.type === 'side' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {quest.type.toUpperCase()}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-400">
                {quest.progress} / {quest.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const GenesisPrimeOS: React.FC<{ language: Language }> = ({ language }) => {
  const [isHUDExpanded, setIsHUDExpanded] = useState(false);
  const [character, setCharacter] = useState<RPGCharacter>({
    id: 'player-1',
    name: 'JunAiKey Avatar',
    level: 42,
    xp: 8750,
    xpToNext: 10000,
    class: 'Strategist',
    attributes: {
      strategy: 85,
      insight: 78,
      leadership: 92,
      resilience: 88
    },
    skills: ['Data Synthesis', 'Strategic Planning', 'Crisis Management', 'Innovation Leadership'],
    equipment: ['Quantum Processor', 'ESG Oracle Lens', 'Resonance Amplifier'],
    reputation: 1250,
    quests: [
      {
        id: 'q1',
        title: language === 'zh-TW' ? '淨零轉型挑戰' : 'Net Zero Transformation Quest',
        description: language === 'zh-TW' ? '領導企業實現碳中和目標' : 'Lead company to achieve carbon neutrality',
        type: 'main',
        progress: 7,
        total: 10,
        reward: { xp: 2500, reputation: 150 }
      },
      {
        id: 'q2',
        title: language === 'zh-TW' ? '供應鏈韌性提升' : 'Supply Chain Resilience',
        description: language === 'zh-TW' ? '強化供應鏈的ESG韌性' : 'Strengthen supply chain ESG resilience',
        type: 'side',
        progress: 3,
        total: 5,
        reward: { xp: 1200, reputation: 80 }
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Holographic HUD */}
      <HolographicHUD
        language={language}
        isExpanded={isHUDExpanded}
        onToggleExpand={() => setIsHUDExpanded(!isHUDExpanded)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {language === 'zh-TW' ? '創世紀 Prime OS' : 'GENESIS PRIME OS'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {language === 'zh-TW'
              ? '全息戰略指揮系統與RPG養成體驗的完美融合'
              : 'Perfect fusion of holographic strategic command system and RPG growth experience'
            }
          </p>
        </motion.div>

        {/* Character Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RPGCharacterSheet character={character} language={language} />

          {/* System Status Panel */}
          <motion.div
            className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              {language === 'zh-TW' ? '系統狀態' : 'SYSTEM STATUS'}
            </h2>

            <div className="space-y-4">
              {[
                { label: language === 'zh-TW' ? 'AI核心活躍度' : 'AI Core Activity', value: 94, color: 'text-green-400' },
                { label: language === 'zh-TW' ? '脈絡同步率' : 'Context Sync Rate', value: 87, color: 'text-blue-400' },
                { label: language === 'zh-TW' ? '演化進度' : 'Evolution Progress', value: 76, color: 'text-purple-400' },
                { label: language === 'zh-TW' ? '威脅檢測' : 'Threat Detection', value: 12, color: 'text-yellow-400' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${item.color} w-8`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '戰略規劃' : 'STRATEGIC PLANNING'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '制定全息ESG轉型策略'
                : 'Craft holographic ESG transformation strategies'
              }
            </p>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '開始規劃' : 'START PLANNING'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '任務挑戰' : 'QUEST CHALLENGES'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '接受ESG英雄挑戰任務'
                : 'Accept ESG hero challenge quests'
              }
            </p>
            <motion.button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '查看任務' : 'VIEW QUESTS'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '成就系統' : 'ACHIEVEMENT SYSTEM'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '解鎖ESG領導者成就'
                : 'Unlock ESG leadership achievements'
              }
            </p>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '查看成就' : 'VIEW ACHIEVEMENTS'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GenesisPrimeOS;