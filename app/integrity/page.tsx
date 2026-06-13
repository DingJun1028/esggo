"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Database, Cpu, Lock, CheckCircle, Terminal } from 'lucide-react';

// ============================================================================
// 5T Protocol: /integrity Page
// ZKP (Zero Knowledge Proof) Simulation & Audit Trail
// UI Standard: Berkeley Sovereign v10.0
// ============================================================================

export default function IntegrityPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofData, setProofData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().substring(11, 23);
    setAuditLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [auditLogs]);

  const handleGenerateZKP = async () => {
    setIsGenerating(true);
    setProofData(null);
    setAuditLogs([]);

    addLog("初始化 5T 誠信協議矩陣 (T2/T3/T5)...");
    
    // Simulate generation steps for UI
    setTimeout(() => addLog("擷取原始憑證: 碳排數值區間檢查 (Claim: emission < 1000 tCO2e)..."), 800);
    setTimeout(() => addLog("編譯 SNARK 電路: Groth16 Proving System..."), 1600);
    setTimeout(() => addLog("生成 Witness 與 Public Signal..."), 2400);

    try {
      const res = await fetch('/api/integrity/zkp-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: '00000000-0000-0000-0000-000000000000',
          claim_type: 'carbon_emission_below_1000',
          actual_value: 850,
          target_threshold: 1000
        })
      });

      const result = await res.json();
      
      if (result.success) {
        setTimeout(() => {
          addLog("Circuit Hash 生成成功: " + result.data.circuit_hash.substring(0, 16) + "...");
          addLog("憑證已鎖定並寫入 Super Memory (integrity_proofs)...");
          addLog("5T 誠信憑證驗證完成 (Status: Verified) ✅");
          setProofData(result.data);
          setIsGenerating(false);
        }, 3200);
      } else {
        addLog("生成失敗: " + result.error);
        setIsGenerating(false);
      }
    } catch (error: any) {
      addLog("系統異常: " + error.message);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 font-sans selection:bg-[#003262] selection:text-white">
      
      {/* Header Section */}
      <header className="mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#FDB515]" />
          5T 數位誠信與 ZKP 零知識證明中心
        </h1>
        <p className="mt-2 text-gray-400 max-w-2xl text-sm leading-relaxed">
          基於 Berkeley Sovereign v10.0 架構，透過密碼學技術確保 ESG 數據的不可篡改性 (Trustworthy) 與可追溯性 (Traceable)。實作數值區間證明，保障企業隱私的同時提供透明的合規宣稱。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        
        {/* Left Column: ZKP Generator */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#003262]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Cpu className="w-5 h-5 text-[#52C41A]" />
              啟動 ZKP 運算矩陣
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">宣稱目標 (Claim Target)</span>
                <p className="font-mono text-sm mt-1 text-[#FDB515]">Scope 1 & 2 Carbon Emission &lt; 1000 tCO2e</p>
              </div>
              <div className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">資料來源 (Source Origin)</span>
                <p className="font-mono text-sm mt-1 text-gray-300">ESGGO Dataform Pipeline (GCP)</p>
              </div>
            </div>

            <button 
              onClick={handleGenerateZKP}
              disabled={isGenerating}
              className={`w-full relative overflow-hidden rounded-lg py-4 px-6 font-semibold transition-all duration-300 ${
                isGenerating 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#003262] to-[#005096] text-white hover:shadow-[0_0_20px_rgba(253,181,21,0.3)] border border-[#FDB515]/30 hover:border-[#FDB515]'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Cpu className="w-5 h-5" />
                  </motion.div>
                  運算中... (ZKP Generating)
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  啟動 ZKP 零知識證明運算
                </span>
              )}
            </button>
          </div>

          {/* Visualization / Animation Area */}
          <AnimatePresence>
            {proofData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#002014] to-[#111111] border border-[#52C41A]/30 rounded-xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle className="w-16 h-16 text-[#52C41A]/20" />
                </div>
                <h3 className="text-lg font-semibold text-[#52C41A] mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  5T 憑證已發行
                </h3>
                <div className="space-y-3 font-mono text-xs text-gray-400">
                  <p><span className="text-gray-500">Status:</span> <span className="text-[#52C41A] font-bold">Verified (Immutable)</span></p>
                  <p className="break-all"><span className="text-gray-500">Circuit Hash:</span> <br/>{proofData.circuit_hash}</p>
                  <p><span className="text-gray-500">Public Signal:</span> <br/>{JSON.stringify(proofData.public_signal)}</p>
                  <p><span className="text-gray-500">Proof [pi_a]:</span> <br/>{proofData.zkp_proof.pi_a.join(", ")}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Audit Trail */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-[600px]">
          <div className="bg-[#2D2D2D] px-4 py-3 border-b border-gray-800 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Audit Trail (System Memory)</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#52C41A]/50" />
            </div>
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar bg-[#0C0C0C]">
            <div className="space-y-2">
              {auditLogs.length === 0 && !isGenerating && (
                <div className="text-gray-600 italic">等待操作指令...</div>
              )}
              {auditLogs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`${log.includes('✅') || log.includes('成功') ? 'text-[#52C41A]' : log.includes('異常') ? 'text-red-400' : 'text-gray-300'}`}
                >
                  {log}
                </motion.div>
              ))}
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: [0, 1, 0] }} 
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-[#FDB515]"
                >
                  _
                </motion.div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
