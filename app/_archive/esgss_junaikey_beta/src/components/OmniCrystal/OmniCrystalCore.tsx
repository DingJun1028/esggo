/**
 * 🌟 Omni Crystal Core Component
 * --------------------------------------------------
 * [核心] 奧秘晶體主組件
 * [功能] 管理三種互動模式、狀態切換、事件處理
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrystalState, InteractionMode, OmniCrystalProps } from './types';
import { ToolMenu } from './ToolMenu';
import { CrystalChat } from './CrystalChat';

export const OmniCrystalCore: React.FC<OmniCrystalProps> = ({
  onToolSelect,
  onQuestionSubmit,
  initialState = CrystalState.IDLE,
  language = 'zh-TW',
}) => {
  const [state, setState] = useState<CrystalState>(initialState);
  const [mode, setMode] = useState<InteractionMode>(InteractionMode.CLOSED);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  // 處理點擊事件（單擊 vs 雙擊）
  const handleClick = () => {
    setClickCount(prev => prev + 1);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount === 0) {
        // 單擊 → 工具選單
        setMode(InteractionMode.TOOL_MENU);
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  };

  const handleDoubleClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    setClickCount(0);
    // 雙擊 → AI 對話
    setMode(InteractionMode.AI_CHAT);
  };

  // 獲取光球顏色
  const getGlowColor = () => {
    switch (state) {
      case CrystalState.IDLE:
        return 'rgba(255, 215, 0, 0.8)';
      case CrystalState.THINKING:
        return 'rgba(0, 191, 255, 0.8)';
      case CrystalState.EXECUTING:
        return 'rgba(50, 205, 50, 0.8)';
      case CrystalState.ERROR:
        return 'rgba(255, 69, 0, 0.8)';
      case CrystalState.COMPLETE:
        return 'rgba(0, 255, 127, 0.8)';
      case CrystalState.HYPER:
        return 'rgba(255, 0, 255, 0.9)'; // Magenta for Hypercube
      default:
        return 'rgba(255, 215, 0, 0.8)';
    }
  };

  // 獲取動畫變體
  const getAnimationVariant = () => {
    switch (state) {
      case CrystalState.THINKING:
        return {
          rotate: 360,
          transition: { duration: 1, repeat: Infinity, ease: 'linear' as const },
        };
      case CrystalState.EXECUTING:
        return {
          rotate: 360,
          scale: [1, 1.05, 1],
          transition: { duration: 1.5, repeat: Infinity, ease: 'linear' as const },
        };
      case CrystalState.ERROR:
        return {
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.4, repeat: 2 },
        };
      case CrystalState.COMPLETE:
        return {
          scale: [1, 1.2, 1],
          transition: { duration: 0.5 },
        };
      case CrystalState.HYPER:
        return {
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
          filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
        };
      default:
        return {
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
        };
    }
  };

  // 處理工具選擇
  const handleToolSelect = (skillId: string) => {
    setState(CrystalState.EXECUTING);
    onToolSelect(skillId);

    // 模擬執行完成
    setTimeout(() => {
      setState(CrystalState.COMPLETE);
      setTimeout(() => setState(CrystalState.IDLE), 2000);
    }, 3000);
  };

  // 處理問題提交
  const handleQuestionSubmit = (question: string) => {
    setState(CrystalState.THINKING);
    onQuestionSubmit(question);

    // 模擬思考完成
    setTimeout(() => {
      setState(CrystalState.IDLE);
    }, 2000);
  };

  return (
    <>
      {/* Crystal Orb - Premium 2D Design */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        animate={getAnimationVariant()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="omni-crystal-orb"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${getGlowColor()}, ${getGlowColor().replace('0.8', '0.5')})`,
          boxShadow: `
                        0 8px 32px ${getGlowColor().replace('0.8', '0.4')},
                        0 0 0 1px ${getGlowColor().replace('0.8', '0.3')},
                        inset 0 -8px 16px rgba(0, 0, 0, 0.3),
                        inset 0 8px 16px rgba(255, 255, 255, 0.15)
                    `,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column' as const,
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        {/* Glossy highlight overlay */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <motion.div
          style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: `0 2px 8px rgba(0,0,0,0.5)`,
            fontFamily: 'JetBrains Mono, monospace',
            zIndex: 1,
          }}
        >
          {state === CrystalState.IDLE && '✨'}
          {state === CrystalState.THINKING && '🤔'}
          {state === CrystalState.EXECUTING && '⚡'}
          {state === CrystalState.ERROR && '❌'}
          {state === CrystalState.COMPLETE && '✅'}
          {state === CrystalState.HYPER && '💠'}
        </motion.div>
        <div
          style={{
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.9)',
            marginTop: '2px',
            letterSpacing: '0.1em',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        >
          {language === 'zh-TW' ? '奧秘' : 'OMNI'}
        </div>
      </motion.div>

      {/* Interaction Panels */}
      <AnimatePresence>
        {mode === InteractionMode.TOOL_MENU && (
          <ToolMenu
            onSelect={handleToolSelect}
            onClose={() => setMode(InteractionMode.CLOSED)}
            language={language}
          />
        )}
        {mode === InteractionMode.AI_CHAT && (
          <CrystalChat
            onSubmit={handleQuestionSubmit}
            onClose={() => setMode(InteractionMode.CLOSED)}
            language={language}
          />
        )}
      </AnimatePresence>
    </>
  );
};
