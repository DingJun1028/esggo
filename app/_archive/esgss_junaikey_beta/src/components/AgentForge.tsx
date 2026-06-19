/**
 * Agent Forge - 靈魂鑄造台
 * Agent 管理介面
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { omniClient } from '../api/omniClient';
import { OmniStore, OmniNamespace } from '../services/OmniStore';
import type { AgentInfo, AgentConfig } from '../../shared/types';

export const AgentForge: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newAgent, setNewAgent] = useState<AgentConfig>({
    name: '',
    description: '',
    systemPrompt: '',
    baseModel: 'gemini-1.5-flash',
    temperature: 0.7,
  });

  const loadAgents = async () => {
    // Load agents from OmniStore
    const agentKeys = OmniStore.listKeys(OmniNamespace.AGENT);
    const loadedAgents: AgentInfo[] = [];

    agentKeys.forEach(key => {
      const res = OmniStore.getItem<AgentInfo>(OmniNamespace.AGENT, key);
      if (res.success && res.data) {
        loadedAgents.push(res.data);
      }
    });
    setAgents(loadedAgents);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleCreate = async () => {
    try {
      // Local persistence via OmniStore
      const agentId = `agent_${Date.now()}`;
      const createdAgent: AgentInfo = {
        id: agentId,
        name: newAgent.name,
        description: newAgent.description,
        baseModel: newAgent.baseModel || 'gemini-1.5-flash',
        temperature: newAgent.temperature || 0.7,
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = OmniStore.setItem(OmniNamespace.AGENT, agentId, createdAgent);
      if (result.success) {
        setIsCreating(false);
        loadAgents();
      } else {
        omniLogger.error(LogCategory.SYSTEM, '[AgentForge] 創建失敗:', { error: result.error });
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[AgentForge] 創建失敗:', { error });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cosmic">🔨 靈魂鑄造台</h1>
        <button onClick={() => setIsCreating(true)} className="btn-cosmic px-6 py-3">
          ✨ 創建新 Agent
        </button>
      </div>

      {isCreating && (
        <div className="nebula-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-cosmic">創建新 Agent</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Agent 名稱"
              value={newAgent.name}
              onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
              className="input-cosmic w-full"
            />
            <textarea
              placeholder="描述"
              value={newAgent.description}
              onChange={e => setNewAgent({ ...newAgent, description: e.target.value })}
              className="input-cosmic w-full"
              rows={3}
            />
            <textarea
              placeholder="系統提示詞"
              value={newAgent.systemPrompt}
              onChange={e => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
              className="input-cosmic w-full"
              rows={5}
            />
            <div className="flex gap-4">
              <button onClick={handleCreate} className="btn-cosmic flex-1">
                創建
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="glass px-6 py-3 rounded-lg flex-1"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="nebula-card p-6">
            <h3 className="text-xl font-bold text-cosmic mb-2">{agent.name}</h3>
            <p className="text-indigo-300 text-sm mb-4">{agent.description}</p>
            <div className="text-xs text-indigo-400">
              <div>模型: {agent.baseModel}</div>
              <div>技能: {agent.skills.length} 個</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
