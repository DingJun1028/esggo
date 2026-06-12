'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap } from 'lucide-react';

/**
 * OmniJulesPassiveGuard (全域被動亂碼攔截守衛)
 * 作為全知之眼，主動掃描視覺 DOM。一旦發現亂碼 (Garbled Text)，
 * 立即觸發 OmniAgentBus 的 HEAL 訊號，由 OmniJules 介入。
 */
export default function OmniJulesPassiveGuard() {
  const [healingAlert, setHealingAlert] = useState<{ id: string, text: string } | null>(null);

  useEffect(() => {
    // 建立一個 MutationObserver 來監視 DOM 變化，充當全知之眼
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // 檢查新增的節點
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
              checkAndHealTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // 遞迴掃描子節點
              const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
              let textNode;
              while ((textNode = walker.nextNode())) {
                checkAndHealTextNode(textNode);
              }
            }
          });
        }
      });
    });

    const checkAndHealTextNode = async (node: Node) => {
      const text = node.nodeValue || '';
      // 偵測亂碼特徵：包含 replacement character () 或典型 Big5 轉 UTF-8 失敗的無意義符號
      if (text.includes('\ufffd') || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
        if (!node.parentElement?.hasAttribute('data-healed')) {
          const id = crypto.randomUUID();
          console.warn(`[OmniJules Passive Skill] 🚨 視覺層發現亂碼: ${text}`);
          
          setHealingAlert({ id, text: text.substring(0, 20) + '...' });
          
          // 標記避免重複掃描
          if (node.parentElement) {
            node.parentElement.setAttribute('data-healed', 'processing');
            // 加上高亮發光特效 (Liquid Glass 警告)
            node.parentElement.style.transition = 'all 0.5s';
            node.parentElement.style.boxShadow = '0 0 15px rgba(245, 34, 45, 0.8)';
            node.parentElement.style.color = '#F5222D';
          }

          try {
            // 呼叫智慧閘道攔截
            const res = await fetch('/api/omni-jules', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                failureReason: `發現 UI 視覺亂碼 (Garbled Text): ${text}`,
                sourceTaskId: id,
                context: 'OmniJulesPassiveGuard DOM Scanner',
                energyLoadFactor: 0.9,
                // 此處模擬將前端字串轉成 bytes 交由後端果因修復
                rawData: Array.from(new TextEncoder().encode(text))
              })
            });
            const result = await res.json();
            
            if (result.success && result.healedData) {
              // 替換原本的亂碼
              node.nodeValue = result.healedData;
              if (node.parentElement) {
                node.parentElement.setAttribute('data-healed', 'true');
                // 轉為清淨樣貌 (Cyan 發光)
                node.parentElement.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
                node.parentElement.style.color = '#06b6d4';
                
                setTimeout(() => {
                  if (node.parentElement) {
                    node.parentElement.style.boxShadow = 'none';
                    node.parentElement.style.color = '';
                  }
                }, 2000);
              }
            }
          } catch (e) {
            console.error('[OmniJules Passive Skill] 修復失敗', e);
          } finally {
            setTimeout(() => setHealingAlert(null), 3000);
          }
        }
      }
    };

    // 啟動全域觀測
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 發布啟動事件到全局 (供其他系統識別)
    window.dispatchEvent(new CustomEvent('omni-jules-guard-ready'));

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {healingAlert && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,34,45,0.3)]"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 relative overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border-2 border-transparent border-t-red-500 rounded-full"
            />
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-red-400">OmniJules 被動觸發</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Karma Protocol</span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Zap size={12} className="text-cyan-400" />
              <span>攔截視覺亂碼，果因修復中...</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
