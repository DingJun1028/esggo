'use client';

/**
 * SlackGatewayCard
 * ─────────────────────────────────────────────────────
 * Dashboard 用的 Slack OmniAgent 整合狀態卡片。
 * 功能：
 *   - 顯示 Slack Gateway 連線狀態（有無 Token）
 *   - 一鍵手動推播 5T 報告至指定 Slack 頻道
 *   - 顯示最近推播記錄
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Slack, Zap, Hash } from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '@/components/brand';

interface PushLog {
  id: string;
  company: string;
  score: number;
  channel: string;
  time: string;
  status: 'success' | 'failed';
}

interface SlackGatewayCardProps {
  /** 額外的 CSS class */
  className?: string;
}

export function SlackGatewayCard({ className = '' }: SlackGatewayCardProps) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [companyName, setCompanyName] = useState('ESG GO 示範企業');
  const [pushLog, setPushLog] = useState<PushLog[]>([]);
  const [lastResult, setLastResult] = useState<'success' | 'failed' | null>(null);

  // 檢查 Slack Gateway 是否已設定
  useEffect(() => {
    fetch('/api/slack/status')
      .then(r => r.json())
      .then(d => setIsConfigured(d.configured ?? false))
      .catch(() => setIsConfigured(false));
  }, []);

  const handlePush5T = async () => {
    if (isPushing) return;
    setIsPushing(true);
    setLastResult(null);

    try {
      const res = await fetch('/api/slack/push5t', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      const data = await res.json();
      const ok = res.ok && data.ok;
      setLastResult(ok ? 'success' : 'failed');

      setPushLog(prev => [{
        id: `LOG-${Date.now()}`,
        company: companyName,
        score: (data.overallScore as number) ?? 0,
        channel: (data.channel as string) ?? '#esggo',
        time: new Date().toLocaleTimeString('zh-TW'),
        status: (ok ? 'success' : 'failed') as 'success' | 'failed',
      }, ...prev].slice(0, 5));

    } catch {
      setLastResult('failed');
    } finally {
      setIsPushing(false);
      setTimeout(() => setLastResult(null), 3000);
    }
  };

  const configStatus = isConfigured === null
    ? 'checking'
    : isConfigured ? 'online' : 'offline';

  return (
    <BrandCard className={`p-6 flex flex-col gap-5 ${className}`}>
      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A154B]/30 border border-[#4A154B]/50 flex items-center justify-center">
            <MessageSquare size={18} className="text-[#E01E5A]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wider">Slack OmniAgent</h3>
            <p className="text-xs text-slate-500 font-mono">Gateway 整合閘道</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {configStatus === 'checking' && (
            <Loader2 size={14} className="text-slate-500 animate-spin" />
          )}
          {configStatus === 'online' && (
            <BrandBadge variant="success" className="text-xs">
              <BrandStatusDot status="active" pulse size="sm" />
              已連線
            </BrandBadge>
          )}
          {configStatus === 'offline' && (
            <BrandBadge variant="warning" className="text-xs">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block mr-1" />
              未設定
            </BrandBadge>
          )}
        </div>
      </div>

      {/* ── 未設定提示 ─────────────────────────── */}
      {configStatus === 'offline' && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300 leading-relaxed">
          <p className="font-bold mb-1">⚙️ 需要設定 Slack Token</p>
          <p className="text-amber-400/70">在 <code className="bg-black/30 px-1 rounded">.env</code> 中加入：</p>
          <pre className="mt-2 text-emerald-400 bg-black/30 rounded-lg p-2 font-mono overflow-x-auto">{`SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_ALLOWED_USERS=U...
SLACK_HOME_CHANNEL=C...`}</pre>
        </div>
      )}

      {/* ── 推播控制區 ─────────────────────────── */}
      {configStatus === 'online' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="企業名稱..."
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
            <button
              onClick={handlePush5T}
              disabled={isPushing || !companyName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A154B]/60 hover:bg-[#4A154B]/80 border border-[#E01E5A]/30 hover:border-[#E01E5A]/60 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPushing
                ? <Loader2 size={14} className="animate-spin" />
                : lastResult === 'success'
                  ? <CheckCircle size={14} className="text-emerald-400" />
                  : lastResult === 'failed'
                    ? <AlertCircle size={14} className="text-red-400" />
                    : <Send size={14} />
              }
              推播 5T
            </button>
          </div>
        </div>
      )}

      {/* ── 推播記錄 ─────────────────────────── */}
      <AnimatePresence>
        {pushLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5"
          >
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">Recent Pushes</p>
            {pushLog.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between text-xs bg-black/20 rounded-lg px-3 py-2 border border-white/5"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {log.status === 'success'
                    ? <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                    : <AlertCircle size={12} className="text-red-400 shrink-0" />
                  }
                  <span className="text-slate-300 truncate">{log.company}</span>
                  <span className="text-cyan-400 font-mono font-bold shrink-0">{log.score}分</span>
                </div>
                <span className="text-slate-600 shrink-0 ml-2">{log.time}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer 快捷指令提示 ───────────────── */}
      <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2">
        {['/5t', '/status', '/alert', '/omni'].map(cmd => (
          <span key={cmd} className="text-xs font-mono text-slate-500 bg-black/20 px-2 py-1 rounded border border-white/5">
            {cmd}
          </span>
        ))}
        <span className="text-xs text-slate-600 ml-auto self-center">Slash Commands</span>
      </div>
    </BrandCard>
  );
}
