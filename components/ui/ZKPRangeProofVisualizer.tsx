'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Shield, CheckCircle2, XCircle, Search, Database, Cpu, Zap, Fingerprint } from 'lucide-react';
import { verifySnarkJSProof, ZKPRangeProof, ZKPVerifyResult } from '../../lib/crypto-proof';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  proof: ZKPRangeProof;
  title?: string;
  onVerify?: (valid: boolean) => void;
}

export function ZKPRangeProofVisualizer({ proof, title = 'ZKP 隱私區間驗證 (SNARK)', onVerify }: Props) {
  const [result, setResult] = useState<ZKPVerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    const startTime = Date.now();
    
    let isValid = false;
    if (proof.snarkProof && proof.publicSignals) {
      isValid = await verifySnarkJSProof(null, proof.publicSignals, proof.snarkProof);
    } else {
      // Fallback delay if no snark proof is present
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    const timeTaken = Date.now() - startTime;
    
    const verifyResult: ZKPVerifyResult = {
      valid: isValid,
      steps: [
        { name: 'Public Signals 結構檢查', passed: !!proof.publicSignals && proof.publicSignals.length >= 4, input: 'Array length >= 4' },
        { name: 'Groth16 證明解析 (pi_a, pi_b, pi_c)', passed: !!proof.snarkProof, input: proof.snarkProof?.protocol || 'None' },
        { name: '雙線性配對驗證 (Bilinear Pairing)', passed: isValid, input: 'e(A, B) = e(C, 1) * e(VK.a, VK.b)' }
      ],
      timeTaken
    };
    
    setResult(verifyResult);
    setIsVerifying(false);
    
    if (onVerify) onVerify(verifyResult.valid);
  };

  return (
    <Card className="max-w-md w-full overflow-hidden border-berkeley-blue/20">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-berkeley-blue flex items-center gap-2">
            <Shield size={20} className="text-berkeley-blue" />
            {title}
          </CardTitle>
          <Badge variant={result ? (result.valid ? 'verified' : 'error') : 'default'}>
            {result ? (result.valid ? '驗證通過' : '驗證失敗') : '待驗證'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-6">
        {/* Public Claim */}
        <div className="p-3 bg-primary-50/50 rounded-lg border border-primary-100">
          <p className="text-[10px] font-black text-berkeley-blue/50 uppercase tracking-widest mb-1">Public Claim (合規宣告)</p>
          <p className="text-sm font-semibold text-berkeley-blue">
            數據位於區間: <span className="text-primary-700">[{proof.min}, {proof.max}]</span>
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 overflow-hidden">
            <Database size={12} />
            <span className="truncate font-mono">Commitment: {proof.commitment.commitment.substring(0, 24)}...</span>
          </div>
        </div>

        {/* Public Signals */}
        {proof.publicSignals && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Fingerprint size={12} /> 公開訊號 (Public Signals)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 border border-slate-100 rounded p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase font-bold">InRange[0]</p>
                <p className="text-xs font-mono font-bold text-berkeley-blue">{proof.publicSignals[0]}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase font-bold">Commitment Hash</p>
                <p className="text-xs font-mono font-bold text-berkeley-blue truncate">{proof.publicSignals[3]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Snark Proof details */}
        {proof.snarkProof && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Cpu size={12} /> SNARK Proof (Groth16)
            </p>
            <div className="text-[9px] font-mono text-slate-500 space-y-1">
              <p className="truncate">pi_a: [{proof.snarkProof.pi_a[0].substring(0, 16)}...]</p>
              <p className="truncate">pi_b: [[{proof.snarkProof.pi_b[0][0].substring(0, 16)}...]]</p>
              <p className="truncate">pi_c: [{proof.snarkProof.pi_c[0].substring(0, 16)}...]</p>
            </div>
          </div>
        )}

        {/* Verify Action */}
        <div className="pt-2">
          <Button 
            className="w-full h-10 shadow-sm"
            onClick={handleVerify} 
            disabled={isVerifying}
          >
            {isVerifying ? <Zap size={16} className="animate-spin mr-2" /> : <Search size={16} className="mr-2" />}
            {isVerifying ? '驗證零知識電路中...' : '執行 ZKP 驗證 (Verify)'}
          </Button>
          <p className="text-[10px] text-center text-slate-400 mt-2 italic">
            * 驗證者僅需使用 Public Signals 與 Proof 即可驗證，無需 Blinding Factor。
          </p>
        </div>

        {/* Verification Steps */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 pt-2 border-t border-slate-100 overflow-hidden"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">驗證路徑 (Audit Trail)</p>
              {result.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs p-2 rounded hover:bg-slate-50 transition-colors">
                  {step.passed ? (
                    <CheckCircle2 size={14} className="text-verified mt-0.5" />
                  ) : (
                    <XCircle size={14} className="text-error mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-700">{step.name}</span>
                      <span className={step.passed ? "text-verified font-mono" : "text-error font-mono"}>
                        {step.passed ? "MATCH" : "FAIL"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      IN: {step.input}
                    </p>
                  </div>
                </div>
              ))}

              {/* Range Result */}
              {result.valid && (
                <div className="mt-3 p-2 bg-verified/5 rounded border border-verified/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-verified animate-pulse" />
                  <span className="text-[11px] font-bold text-verified uppercase">
                    區間誠信確認: {proof.inRange ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
              )}
              
              <div className="text-[9px] text-center text-slate-400 font-mono">
                Total Verification Time: {result.timeTaken}ms | 5T v1.1.0
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
