/**
 * 🧠 Thinking Chain Component
 * --------------------------------------------------
 * [核心] 思考鏈可視化組件
 * [功能] 顯示 AI 思考過程的各個階段
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, Lightbulb, CheckCircle } from 'lucide-react';

export interface ThinkingStep {
  id: string;
  stage: string;
  stageEn: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'complete';
}

interface ThinkingChainProps {
  steps: ThinkingStep[];
  language?: 'zh-TW' | 'en';
}

const stageIcons = {
  問題理解: Brain,
  資料檢索: Search,
  結論生成: Lightbulb,
  Understanding: Brain,
  Retrieval: Search,
  Conclusion: Lightbulb,
};

export const ThinkingChain: React.FC<ThinkingChainProps> = ({ steps, language = 'zh-TW' }) => {
  if (steps.length === 0) return null;

  return (
    <div className="thinking-chain-container mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-slate-300">
          {language === 'zh-TW' ? '思考過程' : 'Thinking Process'}
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {steps.map((step, index) => {
            const Icon = stageIcons[step.stage as keyof typeof stageIcons] || Brain;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`thinking-step ${step.status}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`step-icon ${step.status}`}>
                    {step.status === 'complete' ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Icon
                        size={16}
                        className={
                          step.status === 'processing'
                            ? 'text-blue-400 animate-pulse'
                            : 'text-slate-500'
                        }
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-400">
                        {language === 'zh-TW' ? step.stage : step.stageEn}
                      </span>
                      {step.status === 'processing' && (
                        <div className="flex gap-1">
                          <div
                            className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <div
                            className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          />
                          <div
                            className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{step.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
                .thinking-chain-container {
                    background: rgba(100, 80, 150, 0.05);
                    border: 1px solid rgba(168, 85, 247, 0.2);
                    border-radius: 12px;
                    padding: 12px;
                }
                
                .thinking-step {
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 8px;
                    padding: 10px;
                    transition: all 0.3s ease;
                }
                
                .thinking-step.complete {
                    border-color: rgba(34, 197, 94, 0.3);
                    background: rgba(34, 197, 94, 0.05);
                }
                
                .thinking-step.processing {
                    border-color: rgba(59, 130, 246, 0.4);
                    background: rgba(59, 130, 246, 0.05);
                }
                
                .step-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    background: rgba(71, 85, 105, 0.3);
                }
                
                .step-icon.complete {
                    background: rgba(34, 197, 94, 0.2);
                }
                
                .step-icon.processing {
                    background: rgba(59, 130, 246, 0.2);
                }
            `}</style>
    </div>
  );
};
