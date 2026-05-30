'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ShieldCheck, Lock, Activity, Bot, ArrowRight, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ConsentContent() {
  const searchParams = useSearchParams();
  const consentId = searchParams.get('consent');
  const [status, setStatus] = useState<'pending' | 'approving' | 'success' | 'error'>('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!consentId) {
      setStatus('error');
      setErrorMsg('缺少授權標識符 (consent_id)。');
    }
  }, [consentId]);

  const handleApprove = async () => {
    if (!consentId) return;
    setStatus('approving');
    
    try {
      // 在實際生產環境中，這裡會呼叫 Supabase 的 /auth/v1/oauth/consent 端點
      // 這裡示範如何透過 Supabase JS Client 處理同意邏輯 (需確認 Supabase 具體支援方式，通常是透過 redirect)
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        throw new Error('未授權的存取，請先登入。');
      }

      // 由於 Supabase OAuth 2.1 處於早期階段，一般是導向至一個特定的處理 API 或使用 auth.signInWithOAuth 附帶參數
      // 這裡模擬成功邏輯，實務上你需要將同意結果送回 Supabase Authorization Endpoint
      const response = await fetch('/api/oauth/consent/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_id: consentId, user_id: data.session.user.id })
      });

      if (!response.ok) {
        throw new Error('授權批准失敗。');
      }

      setStatus('success');
      setTimeout(() => {
        // 重導回請求方，或者關閉視窗
        window.close();
      }, 3000);

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || '發生未知錯誤');
    }
  };

  const handleDeny = () => {
    setStatus('error');
    setErrorMsg('您已拒絕授權。');
    setTimeout(() => {
      window.close();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-void-stark to-void-stark pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <UniversalCard variant="hologram" className="p-8 md:p-10 border-cyan-500/30">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex justify-center mb-4 relative">
              <div className="absolute inset-0 bg-cyan-core/20 blur-xl rounded-full" />
              <div className="w-20 h-20 bg-void-stark border-2 border-cyan-500/50 rounded-[2rem] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <ShieldCheck size={40} className="text-cyan-core" />
              </div>
            </div>

            <div className="space-y-2">
              <UniversalBadge variant="success" className="mb-2">OAuth 2.1 授權</UniversalBadge>
              <h1 className="text-2xl font-black tracking-tight">授權存取請求</h1>
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white">OmniAgent (MCP)</strong> 想要存取您的 ESGGO 帳號與 5T 治理數據。
              </p>
            </div>

            {status === 'pending' && (
              <>
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                  <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest">要求權限範圍 (Scopes)</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Lock size={16} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white/90">讀寫 Evidence Vault</p>
                        <p className="text-[10px] text-white/50 mt-0.5">允許讀取與創建 5T 實證。</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Activity size={16} className="text-cyan-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white/90">寫入 Audit Logs</p>
                        <p className="text-[10px] text-white/50 mt-0.5">允許代表您寫入不可篡改的稽核日誌。</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4 w-full pt-4">
                  <UniversalButton variant="secondary" onClick={handleDeny} className="flex-1 py-4">拒絕</UniversalButton>
                  <UniversalButton variant="primary" onClick={handleApprove} className="flex-1 py-4">允許存取</UniversalButton>
                </div>
              </>
            )}

            {status === 'approving' && (
              <div className="py-12 space-y-4 flex flex-col items-center">
                <Bot size={48} className="text-cyan-core animate-bounce" />
                <p className="text-sm font-bold text-white/80">正在建立加密授權通道...</p>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 2, ease: "linear" }}
                    className="h-full bg-cyan-core" 
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="py-12 space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">授權成功</h3>
                <p className="text-xs text-white/50">OmniAgent 已成功與您的身份綁定。<br/>此視窗將自動關閉。</p>
              </div>
            )}

            {status === 'error' && (
              <div className="py-12 space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                  <XCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-rose-400">授權失敗</h3>
                <p className="text-xs text-rose-300/70">{errorMsg}</p>
                <UniversalButton variant="secondary" onClick={() => window.close()} className="mt-4">關閉視窗</UniversalButton>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center border-t border-white/5 pt-4">
             <p className="text-[9px] text-white/20 uppercase tracking-widest font-mono">Secured by Supabase Row Level Security</p>
          </div>
        </UniversalCard>
      </motion.div>
    </div>
  );
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void-stark flex items-center justify-center text-white/50 font-mono text-sm">Loading Sacred Auth Protocol...</div>}>
      <ConsentContent />
    </Suspense>
  );
}
