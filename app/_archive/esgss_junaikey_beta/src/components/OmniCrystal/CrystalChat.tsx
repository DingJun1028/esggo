/**
 * 💬 Crystal Chat Component
 * --------------------------------------------------
 * [核心] AI 對話介面
 * [功能] 自然語言問答、意圖識別、對話歷史
 */

import React, { useState, useRef, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Star } from 'lucide-react';
import { ChatMessage } from './types';
import { ThinkingChain, ThinkingStep } from './ThinkingChain';
import { StructuredResponseView, StructuredResponse } from './StructuredResponse';
import { processQuestion } from '@/services/aiProcessor';
import { favoriteManager } from '@/services/favoriteManager';
import { FavoritePanel } from './FavoritePanel';

interface CrystalChatProps {
  onSubmit: (question: string) => void;
  onClose: () => void;
  language?: 'zh-TW' | 'en';
}

export const CrystalChat: React.FC<CrystalChatProps> = ({
  onSubmit,
  onClose,
  language = 'zh-TW',
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'zh-TW'
          ? '你好！我是奧秘晶體，可以回答任何問題並執行各種技能。請問有什麼我可以幫助您的？'
          : 'Hello! I am the Omni Crystal, ready to answer any questions and execute various skills. How may I assist you?',
      timestamp: Date.now(),
    },
  ]);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    onSubmit(input);

    const questionText = input;
    setInput('');

    // 使用 AI 處理器生成智能回應
    setTimeout(async () => {
      try {
        const aiResponse = await processQuestion(questionText, { language });

        // 顯示思考過程
        for (let i = 0; i < aiResponse.thinkingSteps.length; i++) {
          const step = aiResponse.thinkingSteps[i];
          if (!step) continue;

          setThinkingSteps(prev => [...prev, { ...step, status: 'processing' as const }]);

          await new Promise(resolve => setTimeout(resolve, 1000));

          setThinkingSteps(prev =>
            prev.map(s => (s.id === step.id ? { ...s, status: 'complete' as const } : s))
          );
        }

        // 生成最終回應
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          structuredResponse: aiResponse.structuredResponse,
        };

        setMessages(prev => [...prev, aiMsg]);
        setThinkingSteps([]);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[CrystalChat] [Crystal Chat] AI processing error:', { error })
        // Fallback 回應
        const fallbackMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'zh-TW'
              ? '抱歉，處理您的問題時遇到錯誤。請稍後再試。'
              : 'Sorry, an error occurred while processing your question. Please try again later.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, fallbackMsg]);
        setThinkingSteps([]);
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center z-[10000] p-4"
      onClick={onClose}
    >
      {/* Backdrop with progressive blur */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(12px)' }}
        exit={{ backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Chat Container */}
      <motion.div
        className="relative w-full max-w-2xl h-[600px] bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
          opacity: { duration: 0.25 },
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">
                {language === 'zh-TW' ? '奧秘晶體' : 'Omni Crystal'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'zh-TW' ? 'AI 智能助手' : 'AI Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavorites(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title={language === 'zh-TW' ? '我的收藏' : 'My Favorites'}
            >
              <Star size={18} className="text-yellow-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Thinking Chain */}
          {thinkingSteps.length > 0 && <ThinkingChain steps={thinkingSteps} language={language} />}

          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white'
                      : 'bg-slate-800/50 border border-slate-700/30 text-slate-200'
                  }`}
                >
                  {/* 結構化回答 */}
                  {msg.structuredResponse ? (
                    <StructuredResponseView response={msg.structuredResponse} language={language} />
                  ) : (
                    /* 普通訊息 */
                    <p className="text-base leading-relaxed">{msg.content}</p>
                  )}

                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString(
                      language === 'zh-TW' ? 'zh-TW' : 'en-US'
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
              placeholder={language === 'zh-TW' ? '問我任何問題...' : 'Ask me anything...'}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Send size={18} className="text-white" />
              <span className="text-white font-medium text-sm">
                {language === 'zh-TW' ? '發送' : 'Send'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
