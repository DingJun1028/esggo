'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input } from './Input';
import { Shield, CheckCircle2, XCircle, Search, Key, Database, Cpu, Zap } from 'lucide-react';
import { verifyZKPProof, ZKPRangeProof, ZKPVerifyResult } from '../../lib/crypto-proof';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  proof: ZKPRangeProof;
  title?: string;
  onVerify?: (valid: boolean) => void;
}

export function ZKPRangeProofVisualizer({ proof, title = 'ZKP 隱私區間驗證', onVerify }: Props) {
  const [blindingFactor, setBlindingFactor] = useState('');
  const [result, setResult] = useState<ZKPVerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate complex calculation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const verifyResult = await verifyZKPProof(proof.commitment, blindingFactor);
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

        {/* Input for Blinding Factor (The Secret Key for verification) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">驗證密鑰 (Blinding Factor)</label>
          <div className="flex gap-2">
            <Input 
              type="password"
              placeholder="輸入 256-bit 盲化因子..."
              value={blindingFactor}
              onChange={(e) => setBlindingFactor(e.target.value)}
              className="font-mono text-xs"
            />
            <Button 
              size="sm" 
              onClick={handleVerify} 
              disabled={isVerifying || !blindingFactor}
              className="shrink-0"
            >
              {isVerifying ? <Zap size={14} className="animate-pulse" /> : <Search size={14} />}
              驗證
            </Button>
          </div>
        </div>

        {/* Verification Steps */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 pt-2 border-t border-slate-100"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">驗證路徑 (Audit Trail)</p>
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
