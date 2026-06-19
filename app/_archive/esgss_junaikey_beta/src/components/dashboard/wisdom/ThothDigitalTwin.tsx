/**
 * @esgss/jun-ai-ceremony
 * Thoth 博士數位分身組件
 * 
 * 壽司博士數位分身 - 增強版液態玻璃效果
 * 
 * 遵循 IComponentCore 規範
 * Tangible, Traceable, Trackable, Transparent, Trustworthy (5T Protocol)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, ScrollArea } from '../../ui';
import { Sparkles, Send, ShieldCheck, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThothGate } from '@/core/wisdom/ThothGate';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '@/styles/liquid-glass.css';

interface Message {
  id: string;
  role: 'user' | 'thoth';
  content: string;
  meta?: {
    resonance: number;
    entropy: number;
    signature: string;
  };
}

import type { Language } from '@/types';
import { UserAvatarProfile } from '@/types/user';

/**
 * Thoth 博士數位分身 props
 */
export interface ThothDigitalTwinProps {
  language?: Language;
  userName?: string;
  archetype?: UserAvatarProfile['archetype'];
  /** 是否使用液態玻璃效果 */
  useLiquidGlass?: boolean;
}

/**
 * Thoth 博士數位分身組件
 */
export const ThothDigitalTwin: React.FC<ThothDigitalTwinProps> = ({
  language = 'zh-TW',
  userName,
  archetype,
  useLiquidGlass = true
}) => {
  const isZh = language === 'zh-TW';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // IComponentCore 元數據
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/wisdom/ThothDigitalTwin.tsx',
      '1.0.0',
      ['Thoth', 'DigitalTwin', 'Wisdom']
    )
  );

  const getInitialGreeting = () => {
    const name = userName || (isZh ? '架構師' : 'Architect');

    if (archetype === 'strategist') {
      return isZh
        ? `歡迎回來，策略家 ${name}。變數已備妥，您的下一步佈局為何？`
        : `Welcome back, Strategist ${name}. The variables are set. What is your next maneuver?`;
    }

    if (archetype === 'guardian') {
      return isZh
        ? `安好，守護者 ${name}。核心防護力場穩定。我們該如何鞏固信任與韌性？`
        : `Greetings, Guardian ${name}. The core shields are stable. How shall we fortify trust and resilience?`;
    }

    return isZh
      ? `您好，${name}。我是 Thoth 博士的數位殘響。今天我們要如何校準系統的價值觀？`
      : `Greetings, ${name}. I am the digital echo of Dr. Thoth. How shall we calibrate the system's values today?`;
  };

  // 初始化問候語
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: 'thoth',
        content: getInitialGreeting(),
      },
    ]);
  }, [userName, archetype, isZh]);

  // 自動滾動到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 模擬 Thoth 的處理
    setTimeout(() => {
      const calibration = ThothGate.calibrate(userMsg.content, 0.95);

      let responseContent = isZh
        ? '對齊尚不明確。我們必須專注於價值創造。'
        : 'The alignment is unclear. We must focus on Value Creation.';

      if (calibration.wisdomResonance > 0.8) {
        responseContent = isZh
          ? '精確的提議。這與治理的黃金比例產生了深刻共鳴。請繼續。'
          : 'An exquisite proposition. It resonates deeply with the Golden Ratio of governance. Proceed.';
      } else if (calibration.wisdomResonance > 0.5) {
        responseContent = isZh
          ? '邏輯成立，但靈魂微弱。請考慮對基層的影響。'
          : 'The logic holds, but the soul is faint. Consider the impact on the grassroots.';
      }

      const thothMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'thoth',
        content: responseContent,
        meta: {
          resonance: calibration.wisdomResonance,
          entropy: calibration.entropyReductionScore,
          signature: calibration.signature,
        },
      };

      setMessages((prev) => [...prev, thothMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // 容器樣式
  const containerClass = useLiquidGlass
    ? 'liquid-glass-strong h-full flex flex-col overflow-hidden relative'
    : 'h-full flex flex-col bg-slate-950/80 border-amber-900/30 overflow-hidden relative';

  const headerClass = useLiquidGlass
    ? 'p-4 border-b border-white/10 flex items-center justify-between relative z-10'
    : 'p-4 border-b border-amber-900/20 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm relative z-10';

  return (
    <Card
      className={containerClass}
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      {/* 液態玻璃量子流光效果 */}
      {useLiquidGlass && (
        <>
          {/* 背景漸層 */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.1) 0%, rgba(99, 166, 176, 0.05) 50%, transparent 100%)'
            }}
          />

          {/* 量子流光 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)',
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: ['-200% center', '200% center']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}

      {/* Header */}
      <div className={headerClass}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">🦉</span>
          </motion.div>
          <div>
            <h3 className="font-bold text-amber-100/90 text-sm">
              {isZh ? 'Thoth 博士數位孿生' : 'Dr. Thoth Digital Twin'}
            </h3>
            <p className="text-[10px] text-amber-500/60 font-mono tracking-widest">
              WISDOM.CORE.ACTIVE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-[10px] text-amber-500 font-mono">{isZh ? '在線' : 'ONLINE'}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${msg.role === 'user'
                      ? useLiquidGlass
                        ? 'bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-gray-200 rounded-2xl rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tr-none'
                      : useLiquidGlass
                        ? 'bg-[#d4af37]/10 border border-[#d4af37]/20 text-amber-100/80 rounded-2xl rounded-tl-none'
                        : 'bg-amber-950/30 border border-amber-900/30 text-amber-100/80 rounded-2xl rounded-tl-none'
                    } p-4 shadow-xl`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>

                  {msg.meta && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4 text-[10px] font-mono text-amber-500/70">
                      <div className="flex items-center gap-1">
                        <Sparkles size={10} />
                        Resonance: {(msg.meta.resonance * 100).toFixed(1)}%
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={10} />
                        {isZh ? '熵值減少' : 'Entropy'}: -{msg.meta.entropy}
                      </div>
                      <div className="ml-auto flex items-center gap-1 opacity-50">
                        <Fingerprint size={10} />
                        {msg.meta.signature}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-2xl rounded-tl-none flex items-center gap-1 ${useLiquidGlass ? 'bg-[#d4af37]/10 border border-[#d4af37]/10' : 'bg-amber-950/10 border border-amber-900/10'
                    }`}
                >
                  <motion.div
                    className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div
        className={`p-4 z-10 backdrop-blur-md ${useLiquidGlass ? 'bg-[#63a6b0]/5 border-t border-white/10' : 'bg-slate-900/80 border-t border-slate-800'
          }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isZh
                ? '向 Thoth 博士諮詢價值創造...'
                : 'Consult Dr. Thoth regarding Value Creation...'
            }
            className={`${useLiquidGlass
                ? 'bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-[#d4af37]/50'
                : 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-amber-900/50'
              }`}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isTyping}
            className={`${useLiquidGlass
                ? 'bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/30'
                : 'bg-amber-700 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)]'
              }`}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ThothDigitalTwin;
