'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('ESGGO Global Boundary Caught Error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-50 min-h-screen flex items-center justify-center font-sans p-4">
        <OmniBaseCard variant="default" className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">系統發生未預期錯誤</h1>
            <p className="text-slate-500 text-sm">
              系統已自動觸發 5T 治理保護機制，您的資料安全無虞。OmniAgent 已記錄此錯誤以進行根因分析。
            </p>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg text-left overflow-hidden">
            <p className="text-xs font-mono text-slate-600 break-words">
              {error.message || 'Unknown Exception occurred in OmniCore routing.'}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <OmniButton 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              返回主控台
            </OmniButton>
            <OmniButton 
              variant="primary" 
              icon={<ShieldCheck size={16} />}
              onClick={() => reset()}
            >
              嘗試自動修復 (Auto-Heal)
            </OmniButton>
          </div>
        </OmniBaseCard>
      </body>
    </html>
  );
}
