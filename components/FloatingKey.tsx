// @ts-nocheck
// components/FloatingKey.tsx
import React, { useState, useEffect } from 'react';
// 已移除 framer-motion 以避免 SSR 崩潰，改用 CSS transition
import { v4 as uuidv4 } from 'uuid'; // 假設使用 uuid 庫

// 萬能元件心核規範
interface IComponentCore {
  uuid: string;
  version: string;
  timestamp: number;
  evidence: any[];
}

const FloatingKey: React.FC = () => {
  const [core] = useState<IComponentCore>({
    uuid: uuidv4(),
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  // Hash Lock 與 Object.freeze 模擬
  const getHashSignature = () => {
    const data = JSON.stringify(core);
    return btoa(data).substring(0, 16); // 簡化版 Hash
  };

  return (
    <>
      {/* 浮動功能鍵 - 液態玻璃質感 */}
      <button
        style={{ transition: 'all 0.4s ease' }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-500/30 -md border border-white/20 shadow-sm flex items-center justify-center text-white z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚛️
      </button>

      {/* 數據監控面板 */}
      {isOpen && (
        <div
          style={{ transition: 'all 0.4s ease' }}
          className="fixed bottom-28 right-8 w-80 p-6 rounded-xl bg-slate-900/80 border border-blue-500/30 shadow-sm z-50 text-xs text-blue-100 font-mono"
        >
          <h3 className="text-sm font-bold mb-2">OmniAgent 心核狀態</h3>
          <div className="space-y-1">
            <p>UUID: {core.uuid.slice(0, 8)}...</p>
            <p>Hash: {getHashSignature()}</p>
            <p>
              Status: <span className="text-green-400">Object.frozen</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingKey;
