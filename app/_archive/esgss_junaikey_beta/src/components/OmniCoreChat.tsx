/**
 * 奧秘心核對話介面 (Omnipotent Core Chat Interface)
 * 使用雙向 TypeScript 的完整類型安全
 */

import React, { useState, useEffect, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useLocation } from 'react-router-dom';
import { omniClient } from '../api/omniClient.ts';
import { getPageContext } from '../services/PageContextMap';
import type { AgentSession, ApiResponse } from '../../shared/types';
import {
  OmniRequestType,
  MemoryFragment,
  EternalMemoryType,
  type UltimateRune,
  ProficiencyLevel,
  RuneCategory,
  MultimodalPart,
} from '../../shared/types';
import ThinkingChain from './ThinkingChain.tsx';
import { UltimateCastOverlay } from './UltimateCastOverlay.tsx';
import {
  Zap,
  Star,
  Brain,
  Cpu,
  MessageSquare,
  FileText,
  X,
  Paperclip,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  parts?: MultimodalPart[];
  thinking?: string;
  executedSkills?: string[];
  // V6.1 Granular Reasoning & RAG
  analysis?: string;
  reasoning?: string;
  arvoStages?: any[];
  swarmPlan?: string[];
  evidence?: any[];
  ultimateActivated?: UltimateRune;
  resonanceScore?: number;
}

export const OmniCoreChat: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = useState<AgentSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<{ file: File; preview: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<MemoryFragment[]>([]);
  const [activeUltimate, setActiveUltimate] = useState<UltimateRune | null>(null);
  const [resonance, setResonance] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageContext = getPageContext(location.pathname);

  // 初始化 Agent 會話
  useEffect(() => {
    initializeAgent();
  }, []);

  // 自動滾動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(async file => {
      const preview = file.type.startsWith('image/') ? await fileToBase64(file) : '';
      setAttachments(prev => [...prev, { file, preview }]);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const initializeAgent = async () => {
    try {
      const agentSession = await omniClient.manifestAgent({
        name: 'ESG 導師 AI (Mentor Mode)',
        description: '專為丁俊宏打造的永續轉型教練',
        systemPrompt:
          '您現在是 ESGss JunAiKey 的「導師 AI (Mentor AI)」。您的核心目標是引導用戶（丁俊宏）理解 ESG 與數位轉型的深度邏輯。請採取「引導式教育」風格，除了回答問題外，內容應包含：1. 相關的 5T 邏輯門解析 2. 隨機推薦一個《轉型指南》中的知識點 3. 鼓勵用戶記錄可溯源數據。語氣應專業、睿智且富有啟發性，呈現液態玻璃般的透明度與質感。',
        baseModel: 'gemini-1.5-flash',
        temperature: 0.8,
      });
      setSession(agentSession);
      omniLogger.info(LogCategory.AI, '[OmniCoreChat] ✅ Agent 會話已建立:', agentSession);
    } catch (error) {
      omniLogger.error(LogCategory.AI, '[OmniCoreChat] ❌ 初始化失敗:', { error })
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const currentAttachments = [...attachments];
    setAttachments([]);
    setIsLoading(true);

    const multimodalParts: MultimodalPart[] = [];

    if (input.trim()) {
      multimodalParts.push({ text: input });
    }

    for (const attachment of currentAttachments) {
      const base64 = await fileToBase64(attachment.file);
      const dataPart = base64.split(',')[1];
      if (dataPart) {
        multimodalParts.push({
          inlineData: {
            mimeType: attachment.file.type,
            data: dataPart,
          },
        });
      }
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      parts: multimodalParts,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // 處理請求
      const response: ApiResponse = await omniClient.process(
        'query' as OmniRequestType,
        input,
        {
          page_name: pageContext.name,
          focus_5t: pageContext.focus5T,
          wisdom: pageContext.wisdom,
          path: location.pathname
        },
        multimodalParts
      );

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(response.timestamp),
        executedSkills: response.invokedSkills,
        // Map V6.1 Fields
        analysis: response.arvo_analysis,
        reasoning: response.arvo_reasoning,
        arvoStages: response.arvo_stages,
        swarmPlan: response.swarm_plan,
        evidence: response.evidence,
      };

      // 🛑 奧義覺醒檢測 (Ultimate Awakening Detection)
      // 如果回應中包含高價值的分析或特定的元標籤，模擬奧義觸發
      if (response.content.length > 500 || response.arvo_analysis?.includes('Critical')) {
        const mockUltimate: UltimateRune = {
          id: 'ult_enlightenment',
          name: '奧秘・大真理覺醒',
          description: '從深度分析中頓悟的終極運算能力',
          category: RuneCategory.ULTIMATE,
          type: 'composite',
          capability: { input: [], output: [] },
          proficiency: { level: ProficiencyLevel.NOVICE, usageCount: 1, successRate: 1 },
          metadata: { createdAt: new Date().toISOString(), version: '1.0.0', tags: ['awakened'] },
          ultimate: { tier: 'epic', power: 500, cooldown: 3600, energyCost: 50 },
          enlightenment: {
            triggerCondition: 'Resonance > 80',
            probability: 0.01,
            requiredProficiency: ProficiencyLevel.ADEPT,
            requiredCombos: 10,
          },
          inheritance: { canTeach: true, learnDifficulty: 7, prerequisites: [] },
        } as any;

        assistantMessage.ultimateActivated = mockUltimate;
        setActiveUltimate(mockUltimate);
        setResonance(prev => Math.min(prev + 20, 100));
      } else {
        setResonance(prev => Math.max(prev - 5, 0));
      }

      setMessages(prev => [...prev, assistantMessage]);

      // 儲存對話到記憶
      await omniClient.storeMemory(
        `用戶: ${input}\nAI: ${response.content}`,
        EternalMemoryType.EPISODIC,
        {
          sessionId: session?.sessionId,
          sentiment: 'neutral',
        }
      );

      // 更新記憶列表
      loadRecentMemories();
    } catch (error) {
      omniLogger.error(LogCategory.AI, '[OmniCoreChat] ❌ 發送失敗:', { error })
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentMemories = async () => {
    try {
      const recentMemories = await omniClient.retrieveMemory('', {
        limit: 5,
        sortBy: 'recency',
      });
      setMemories(recentMemories);
    } catch (error) {
      omniLogger.error(LogCategory.AI, '[OmniCoreChat] ❌ 載入記憶失敗:', { error })
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen relative-z">
      {/* 主對話區 */}
      <div className="flex-1 flex flex-col">
        {/* 頂部狀態欄 */}
        <div className="glass-strong p-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-cosmic italic tracking-tighter uppercase flex items-center gap-4">
                <Brain className="text-[#0df2df] animate-pulse" />
                奧秘導師・智慧對話
              </h2>
              {session && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 bg-[#0df2df]/20 text-[#0df2df] text-[9px] font-black uppercase tracking-widest rounded border border-[#0df2df]/30">
                    MENTOR ACTIVE
                  </span>
                  <p className="text-white/40 text-[10px] font-medium">
                    會話: {session.agentName} • {session.status}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Resonance
                </div>
                <div className="w-32 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${resonance}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={loadRecentMemories}
                className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors border border-indigo-500/20"
              >
                <Brain className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 訊息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-indigo-300 mt-20">
              <div className="text-6xl mb-4 twinkle">🌟</div>
              <p className="text-xl">開始與奧秘心核對話</p>
              <p className="text-sm mt-2">具備永恆記憶、智能推理、技能執行能力</p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${msg.role === 'user' ? 'glass-strong' : 'nebula-card'
                  } p-4 rounded-xl`}
              >
                {/* Thinking Chain (V6.0) */}
                {msg.role === 'assistant' && (
                  <ThinkingChain
                    analysis={msg.analysis}
                    reasoning={msg.reasoning}
                    arvoStages={msg.arvoStages}
                    swarmPlan={msg.swarmPlan}
                    isSwarm={!!msg.swarmPlan && msg.swarmPlan.length > 0}
                  />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${msg.role === 'user' ? 'bg-indigo-500/20' : 'bg-purple-500/20 border border-purple-500/30'}`}
                  >
                    {msg.role === 'user' ? (
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Cpu className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-indigo-100 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>

                    {/* 多模態內容投影 (Multimodal Projection) */}
                    {msg.parts && msg.parts.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {msg.parts.map((part, pidx) => (
                          <div
                            key={pidx}
                            className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                          >
                            {part.inlineData && part.inlineData.mimeType.startsWith('image/') && (
                              <div className="relative group">
                                <img
                                  src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
                                  alt="Multimodal Analysis"
                                  className="w-full h-auto max-h-[400px] object-contain transition-transform group-hover:scale-[1.02]"
                                />
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-black text-[#0df2df] uppercase tracking-widest border border-[#0df2df]/30">
                                  Visual Core Data
                                </div>
                              </div>
                            )}
                            {part.inlineData && !part.inlineData.mimeType.startsWith('image/') && (
                              <div className="p-3 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-[10px] text-indigo-300 font-bold uppercase truncate">
                                    Encoded Data
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-mono truncate">
                                    {part.inlineData.mimeType}
                                  </p>
                                </div>
                              </div>
                            )}
                            {part.fileData && (
                              <div className="p-3 flex items-center gap-3">
                                <Paperclip className="w-5 h-5 text-purple-400" />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-[10px] text-purple-300 font-bold uppercase truncate">
                                    External Asset
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-mono truncate">
                                    {part.fileData.fileUri}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.ultimateActivated && (
                      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center gap-3 animate-pulse">
                        <Star className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                            Ultimate Awakened
                          </p>
                          <p className="text-sm font-bold text-white">
                            {msg.ultimateActivated.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.executedSkills && msg.executedSkills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.executedSkills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[10px] text-indigo-400 border border-indigo-500/20 font-bold"
                          >
                            # {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Source Citations (V6.1) */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          Source Citations (Fact-Aligned)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.evidence.map((entry, eidx) => (
                            <div
                              key={eidx}
                              className="group/cite relative flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all cursor-help"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] text-slate-300 font-mono">
                                [{eidx + 1}] {entry.metadata?.knowledgeBase || 'Omni-Store'}
                              </span>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover/cite:opacity-100 group-hover/cite:visible transition-all z-50 pointer-events-none">
                                <p className="text-[10px] text-emerald-400 font-bold mb-1">
                                  {entry.metadata?.knowledgeBase || 'External Intelligence'}
                                </p>
                                <p className="text-[11px] text-slate-200 leading-tight">
                                  {entry.content.substring(0, 150)}...
                                </p>
                                <div className="mt-2 flex justify-between items-center text-[8px] text-slate-500">
                                  <span>Confidence: {Math.round((entry.metadata?.quality_score || 0.95) * 100)}%</span>
                                  <span>Ref: {entry.id?.substring(0, 8)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-3 font-mono">
                      {msg.timestamp.toLocaleTimeString('zh-TW')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="nebula-card p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl twinkle">🤖</div>
                  <div className="text-indigo-300">正在思考中...</div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 輸入區 */}
        <div className="glass-strong p-4 border-t border-purple-500/20">
          {/* Attachment Preview Area */}
          {attachments.length > 0 && (
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
              {attachments.map((att, i) => (
                <div key={i} className="relative group flex-shrink-0">
                  {att.preview ? (
                    <img
                      src={att.preview}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-purple-500/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-500/10 border-2 border-purple-500/30 flex flex-col items-center justify-center p-1">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <span className="text-[8px] text-purple-300 truncate w-full text-center">
                        {att.file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/10 transition-all mb-1"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入訊息或分享檔案... (Enter 發送)"
              className="input-cosmic flex-1 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className="btn-cosmic px-6 h-12 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              發送
            </button>
          </div>
        </div>
      </div>

      {/* 右側記憶面板 */}
      <div className="w-80 glass-strong border-l border-purple-500/20 p-4 overflow-y-auto">
        <h3 className="text-xl font-bold text-cosmic mb-4">💾 永恆記憶</h3>

        {memories.length === 0 ? (
          <div className="text-indigo-300 text-sm text-center mt-8">
            <div className="text-4xl mb-2">🧠</div>
            <p>尚無記憶</p>
            <p className="text-xs mt-1">對話後會自動儲存</p>
          </div>
        ) : (
          <div className="space-y-3">
            {memories.map(memory => (
              <div
                key={memory.id}
                className="glass p-3 rounded-lg hover:glass-strong transition-cosmic"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded glass">{memory.type}</span>
                  <span className="text-xs text-indigo-400">訪問 {memory.accessCount} 次</span>
                </div>
                <p className="text-sm text-indigo-200 line-clamp-3">{memory.content}</p>
                <div className="text-xs text-indigo-400 mt-2">
                  {new Date(memory.createdAt).toLocaleString('zh-TW')}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-3 glass rounded-lg">
          <div className="text-xs text-indigo-300">
            <div className="flex justify-between mb-1">
              <span>總記憶數</span>
              <span className="font-bold">{memories.length}</span>
            </div>
            <div className="flex justify-between">
              <span>會話 ID</span>
              <span className="font-mono text-xs">{session?.sessionId.substring(0, 12)}...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultimate Overlay */}
      <AnimatePresence>
        {activeUltimate && (
          <UltimateCastOverlay
            ultimate={activeUltimate as any}
            onComplete={() => setActiveUltimate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
