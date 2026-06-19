/**
 * 奧秘智庫主入口
 * Main entry point for Omnipotent Think Tank
 */

import React from 'react';
import { OmniCoreChat } from './OmniCoreChat';
import { AgentForge } from './AgentForge';
import { KnowledgeLibrary } from './KnowledgeLibrary';
import { SkillMatrix } from './SkillMatrix';
import { HITLReviewer } from './HITLReviewer';

type OmniView = 'CHAT' | 'AGENT_FORGE' | 'KNOWLEDGE' | 'SKILLS' | 'HITL';

export const OmnipotentThinkTank: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<OmniView>('CHAT');

  const renderView = () => {
    switch (currentView) {
      case 'CHAT':
        return <OmniCoreChat />;
      case 'AGENT_FORGE':
        return <AgentForge />;
      case 'KNOWLEDGE':
        return <KnowledgeLibrary />;
      case 'SKILLS':
        return <SkillMatrix />;
      case 'HITL':
        return <HITLReviewer />;
      default:
        return <OmniCoreChat />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <div className="glass-strong border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-cosmic">🌌 奧秘智庫 (Omnipotent Think Tank)</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('CHAT')}
              className={`px-4 py-2 rounded-lg transition-cosmic ${
                currentView === 'CHAT' ? 'glass-strong glow' : 'glass hover:glass-strong'
              }`}
            >
              💬 對話
            </button>
            <button
              onClick={() => setCurrentView('AGENT_FORGE')}
              className={`px-4 py-2 rounded-lg transition-cosmic ${
                currentView === 'AGENT_FORGE' ? 'glass-strong glow' : 'glass hover:glass-strong'
              }`}
            >
              🔨 Agent
            </button>
            <button
              onClick={() => setCurrentView('KNOWLEDGE')}
              className={`px-4 py-2 rounded-lg transition-cosmic ${
                currentView === 'KNOWLEDGE' ? 'glass-strong glow' : 'glass hover:glass-strong'
              }`}
            >
              📚 知識庫
            </button>
            <button
              onClick={() => setCurrentView('SKILLS')}
              className={`px-4 py-2 rounded-lg transition-cosmic ${
                currentView === 'SKILLS' ? 'glass-strong glow' : 'glass hover:glass-strong'
              }`}
            >
              🎯 技能
            </button>
            <button
              onClick={() => setCurrentView('HITL')}
              className={`px-4 py-2 rounded-lg transition-cosmic ${
                currentView === 'HITL' ? 'glass-strong glow' : 'glass hover:glass-strong'
              }`}
            >
              🔍 審查
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{renderView()}</div>
    </div>
  );
};
