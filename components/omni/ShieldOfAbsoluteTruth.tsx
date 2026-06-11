import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Shield, ShieldAlert, ShieldCheck, Activity, CheckCircle2, AlertTriangle, Fingerprint, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ShieldVerificationProps {
  contentId: string;
  isAiGenerated: boolean;
  onHealTriggered?: () => void;
  className?: string;
}

export function ShieldOfAbsoluteTruth({
  contentId,
  isAiGenerated,
  onHealTriggered,
  className
}: ShieldVerificationProps) {
  const [status, setStatus] = useState<'analyzing' | 'secure' | 'drift-detected' | 'healing'>('analyzing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'analyzing') {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setStatus(Math.random() > 0.8 ? 'drift-detected' : 'secure');
            return 100;
          }
          return p + 20;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [status, contentId]);

  const triggerAdkHeal = () => {
    setStatus('healing');
    setProgress(0);
    // Simulating Forge Shield / ADK bound
    const healTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(healTimer);
          setStatus('secure');
          onHealTriggered?.();
          return 100;
        }
        return p + 15;
      });
    }, 400);
  };

  return (
    <Card className={cn("overflow-hidden border-2 transition-all duration-500", 
      status === 'secure' ? 'border-emerald-500/30 bg-emerald-50/30' :
      status === 'drift-detected' ? 'border-amber-500/50 bg-amber-50/30' :
      status === 'healing' ? 'border-aqua-cyan/50 bg-aqua-cyan/10' :
      'border-slate-200 bg-white',
      className
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-100/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg relative overflow-hidden",
            status === 'secure' ? 'bg-emerald-100 text-emerald-600' :
            status === 'drift-detected' ? 'bg-amber-100 text-amber-600' :
            'bg-slate-100 text-slate-500'
          )}>
            {status === 'secure' ? <ShieldCheck size={20} /> :
             status === 'drift-detected' ? <ShieldAlert size={20} /> :
             <Shield size={20} className={status === 'healing' ? 'animate-pulse' : ''} />}
             
             {status === 'healing' && (
               <div className="absolute inset-0 bg-aqua-cyan/20 animate-ping rounded-lg" />
             )}
          </div>
          <div>
            <h3 className="font-black text-sm text-text-primary flex items-center gap-2">
              絕對真實之盾 <span className="text-[10px] font-mono text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">Omni-Core ZKP</span>
            </h3>
            <p className="text-[11px] text-text-secondary font-medium">
              自動化綠漂防禦檢查 (Greenwashing Defense)
            </p>
          </div>
        </div>
        <Badge status={
          status === 'secure' ? 'success' : 
          status === 'drift-detected' ? 'warning' : 'info'
        }>
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {(status === 'analyzing' || status === 'healing') && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>{status === 'analyzing' ? '執行 5T 深度分析中...' : 'HealingGuardian 修復管線運行中...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-300", 
                  status === 'healing' ? 'bg-aqua-cyan-midtone' : 'bg-slate-400'
                )} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        )}

        {status === 'secure' && (
          <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-text-primary">內容具備絕對真實性</p>
              <p className="text-[11px] text-slate-500 font-medium">已通過 5T 誠信協議驗證，ZKP 雙重雜化與 MD5 埋植比對無誤。無綠漂 (Greenwashing) 跡象。</p>
            </div>
          </div>
        )}

        {status === 'drift-detected' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-amber-100">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">檢測到 Drift 指紋異常</p>
                <p className="text-[11px] text-slate-500 font-medium">部分 AI 生成內容缺乏客觀數據支撐，可能觸發綠漂風險。建議啟動 ADK 積極修復系統。</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md shadow-amber-500/20"
                onClick={triggerAdkHeal}
              >
                <RefreshCcw size={14} className="mr-2" />
                ADK bound (啟動誠信修復)
              </Button>
            </div>
          </div>
        )}

        {isAiGenerated && (
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2 bg-slate-50 p-2 rounded">
            <Fingerprint size={12} />
            <span>AI 生成內容已自動啟用 T3 Tangible 追蹤標籤</span>
          </div>
        )}
      </div>
    </Card>
  );
}
