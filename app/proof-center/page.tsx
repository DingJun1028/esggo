'use client';

import React, { useState, useEffect } from 'react';
import { omniCore } from '../../lib/omni-core';
import { ZKPRangeProof } from '../../lib/crypto-proof';
import { ZKPRangeProofVisualizer } from '../../components/ui/ZKPRangeProofVisualizer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Shield, Zap, Lock, EyeOff, CheckCircle, Info, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProofCenterPage() {
  const [proof, setProof] = useState<ZKPRangeProof | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blindingFactor, setBlindingFactor] = useState('');

  // Example data
  const sensitiveData = {
    metric: '年度溫室氣體排放量 (Scope 2)',
    value: 1250,
    unit: 'tCO2e',
    range: { min: 1000, max: 1500 }
  };

  const generateProof = async () => {
    setIsGenerating(true);
    // Fixed blinding factor for the demo to show the user
    const factor = 'demo-blinding-factor-' + Math.random().toString(36).substring(7);
    setBlindingFactor(factor);
    
    // Simulate generation time
    await new Promise(r => setTimeout(r, 1200));
    
    const p = await omniCore.generatePrivacyProof(
      sensitiveData.metric,
      sensitiveData.value,
      sensitiveData.range.min,
      sensitiveData.range.max,
      factor
    );
    
    setProof(p);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="text-berkeley-blue" size={24} />
            <h1 className="text-2xl font-bold text-berkeley-blue tracking-tight">ZKP 隱私證明中心</h1>
          </div>
          <p className="text-slate-500 text-sm">基於 Zero-Knowledge Proof 協議的敏感 ESG 數據驗證系統</p>
        </div>
        <Badge variant="primary" className="py-1 px-3">Protocol v1.1.0 Active</Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Data Owner Side */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-berkeley-blue text-white flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-lg font-semibold text-berkeley-blue">數據持有者 (Prover)</h2>
          </div>
          
          <div className="bg-white rounded-card border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <EyeOff size={14} /> 敏感原始數據
                </span>
                <Badge variant="warning">Confidential</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">指標名稱</p>
                  <p className="text-sm font-semibold text-berkeley-blue">{sensitiveData.metric}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">原始數值</p>
                  <p className="text-sm font-bold text-berkeley-blue">{sensitiveData.value} {sensitiveData.unit}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-md border border-blue-100/50">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p>點擊生成 ZKP，系統將對原始數值進行加密承諾 (Commitment)，並產出區間證明。</p>
              </div>

              <Button 
                onClick={generateProof} 
                disabled={isGenerating}
                className="w-full h-12 text-base shadow-lg"
              >
                {isGenerating ? (
                  <Zap size={18} className="animate-spin mr-2" />
                ) : (
                  <Lock size={18} className="mr-2" />
                )}
                {isGenerating ? '正在計算 ZKP 證明...' : '生成隱私證明 (Generate Proof)'}
              </Button>
            </div>

            {proof && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-2 border-dashed border-verified/30 rounded-lg bg-verified/5"
              >
                <div className="flex items-center gap-2 text-verified mb-3">
                  <CheckCircle size={18} />
                  <span className="font-bold text-sm">證明已生成！</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">您的盲化因子 (私鑰 - 請妥善保存)</p>
                    <div className="mt-1 p-2 bg-white border border-verified/20 rounded font-mono text-[11px] text-berkeley-blue break-all">
                      {blindingFactor}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-2">
                    * 在現實場景中，您只需將此「盲化因子」提供給授權的審核員。
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Step 2: Auditor Side */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-lg font-semibold text-berkeley-blue">審核驗證端 (Verifier)</h2>
          </div>

          {!proof ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-card flex flex-center items-center justify-center bg-slate-50/30">
              <p className="text-slate-400 text-sm font-medium">等待 Prover 提供證明數據...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ZKPRangeProofVisualizer proof={proof} />
              
              <div className="mt-6 p-4 bg-white rounded-card border border-slate-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-berkeley-blue flex items-center gap-2">
                  <Cpu size={16} /> 驗證邏輯摘要
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li>驗證器不需要知道原始數值 {sensitiveData.value}。</li>
                  <li>透過 HMAC-SHA256 驗證承諾的一致性。</li>
                  <li>確保証據在發布後未被篡改 (T4 Integrity)。</li>
                  <li>一旦驗證密鑰正確，即可 100% 確認數值落於指定區間。</li>
                </ul>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
