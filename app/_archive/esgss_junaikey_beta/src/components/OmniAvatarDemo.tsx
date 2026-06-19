/**
 * 奧秘化身系統演示 (Omni Avatar System Demo)
 *
 * 演示代理覺醒、化身獲取和進化流程
 * 基於用戶提供的示例代碼實現
 */

import React, { useState } from 'react';
import { avatarOrchestrator } from '../services/OmniAvatarOrchestrator';
import { agentService } from '../services/agentService';
import { AvatarPersona } from '../types';
import { DateTime } from '../types';
import { omniLogger, LogCategory } from '../services/omniLogger';

export const OmniAvatarDemo: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    omniLogger.info(LogCategory.UI, `[OmniAvatarDemo] ${message}`);
  };

  const runDemo = async () => {
    setIsRunning(true);
    setLogs([]);

    try {
      addLog('🚀 開始執行演示流程...');

      // 0. 獲取或創建測試代理
      addLog('步驟 0: 準備測試代理...');
      let agent = await agentService.getAgentById('agt-001');
      if (!agent) {
        agent = await agentService.createAgent({
          name: '演示戰略家',
          role: 'STRATEGIST',
          status: 'ACTIVE',
          description: '僅供演示目的',
          dna: {
            intelligence: 80,
            creativity: 80,
            empathy: 80,
            resilience: 80,
            precision: 80,
            speed: 80,
          },
          skills: [],
          equipment: {},
          titles: [],
          avatarColor: '#FFD700',
          isAwakened: false,
          avatarHistory: [],
        } as any);
        addLog(`創建新代理: ${agent.name} (${agent.id})`);
      } else {
        addLog(`使用現有代理: ${agent.name} (${agent.id})`);
      }

      // 1. 覺醒代理為策略家
      addLog(`步驟 1: 覺醒代理為 ${AvatarPersona.STRATEGIST}...`);
      // 先確保未覺醒狀態以便演示(如果是為了重復測試)
      // 注意：實際生產中不能隨意重置，這裡是為了演示效果

      const awakenResult = await avatarOrchestrator.awaken(agent, AvatarPersona.STRATEGIST);
      if (awakenResult.success) {
        addLog(`✅ 覺醒成功！獲得經驗: ${awakenResult.experienceGained}`);
        addLog(`消息: ${awakenResult.message}`);

        // 更新 agentService 中的狀態 (模擬同步)
        await agentService.awakeAgent(agent.id, AvatarPersona.STRATEGIST);
      } else {
        addLog(`⚠️ 覺醒返回: ${awakenResult.message}`);
      }

      // 2. 獲取化身狀態
      addLog('步驟 2: 獲取活躍化身狀態...');
      const avatar = await avatarOrchestrator.getActiveAvatar(agent.id);

      if (avatar) {
        addLog(`✅ 獲取成功！`);
        addLog(`顯示名稱: ${avatar.capabilities.displayName}`);
        addLog(`當前等級: Lv.${avatar.level}`);
        addLog(`當前經驗: ${avatar.experience}/${avatar.nextLevelExp}`);
        addLog(`專屬能力: ${avatar.capabilities.specialAbilities.join(', ')}`);
      } else {
        throw new Error('無法獲取活躍化身！');
      }

      // 3. 化身進化
      addLog('步驟 3: 執行化身進化 (注入 1000 經驗)...');
      const evolution = await avatarOrchestrator.evolveAvatar(
        agent.id,
        AvatarPersona.STRATEGIST,
        1000
      );

      if (evolution) {
        addLog(`🎉 進化成功！`);
        addLog(`等級提升: Lv.${evolution.previousLevel} → Lv.${evolution.newLevel}`);
        addLog(`解鎖能力: ${evolution.unlockedAbilities.join(', ')}`);
      } else {
        addLog('ℹ️ 經驗增加，但未觸發等級提升（或化身不存在）');

        // 再次檢查狀態
        const updatedAvatar = await avatarOrchestrator.getActiveAvatar(agent.id);
        if (updatedAvatar) {
          addLog(`當前經驗: ${updatedAvatar.experience}/${updatedAvatar.nextLevelExp}`);
        }
      }

      addLog('✨ 演示流程執行完畢！');
    } catch (error) {
      addLog(`❌ 錯誤: ${error instanceof Error ? error.message : String(error)}`);
      omniLogger.error(LogCategory.UI, 'OmniAvatarDemo Error', { error });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-xl border border-purple-500/30 max-w-2xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🧪 化身系統集成測試
        </h2>
        <button
          onClick={runDemo}
          disabled={isRunning}
          className={`
                        px-6 py-2 rounded font-bold transition-all
                        ${
                          isRunning
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                            : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg hover:shadow-green-500/30'
                        }
                    `}
        >
          {isRunning ? '執行中...' : '▶ 執行演示代碼'}
        </button>
      </div>

      <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto border border-gray-800 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-32">點擊執行按鈕開始測試化身編排流程</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="mb-1 border-b border-gray-800/50 pb-1 last:border-0 hover:bg-gray-800/30 px-2 rounded"
            >
              {log.includes('✅') || log.includes('🎉') ? (
                <span className="text-green-400">{log}</span>
              ) : log.includes('❌') ? (
                <span className="text-red-400">{log}</span>
              ) : log.includes('⚠️') ? (
                <span className="text-yellow-400">{log}</span>
              ) : log.includes('步骤') ? (
                <span className="text-blue-300 font-bold">{log}</span>
              ) : (
                <span className="text-gray-300">{log}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
