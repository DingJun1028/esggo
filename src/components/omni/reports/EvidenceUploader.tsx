'use client';

import React, { useState, useCallback } from 'react';
import { UploadCloud, FileCheck, ShieldAlert, Loader2, Link } from 'lucide-react';

/** 證據庫佐證元件 (mod-src-vault-0001) — Liquid Glass 拖曳上傳 */
export default function EvidenceUploader({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;

      setStatus('uploading');
      try {
        // 真實上傳至 Evidence Vault (MinIO S3 相容, 免費算立自託)
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/evidence-upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'upload failed');
        }
        setEvidenceUrl(data.url);
        setStatus('success');
        onUploadComplete(data.url);
      } catch {
        setStatus('error');
      }
    },
    [onUploadComplete]
  );

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-cyan-50 mb-2 block">
        佐證憑證 (Evidence Vault) <span className="text-amber-400">*</span>
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-xl bg-black/20 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02] shadow-neon-cyan'
            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
        } ${status === 'error' ? 'border-amber-500/50 shadow-neon-amber' : ''} ${
          status === 'success' ? 'border-emerald-500/50 shadow-neon-emerald' : ''
        }`}
      >
        {status === 'idle' && (
          <>
            <UploadCloud size={48} className="text-cyan-500/50 mb-4 animate-pulse" />
            <p className="text-sm text-gray-300">拖曳發票、水電單或 ISO 證書至此</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              支援 PDF, JPG, PNG (上限 10MB)
            </p>
          </>
        )}
        {status === 'uploading' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
            <p className="text-sm text-cyan-200">執行 Hash Lock 與 S3 封裝中...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <FileCheck size={48} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <p className="text-sm text-emerald-200 font-bold">憑證已安全刻印</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
              <Link size={12} /> <span className="truncate max-w-[200px]">{evidenceUrl}</span>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <ShieldAlert size={48} className="text-amber-400 mb-4" />
            <p className="text-sm text-amber-200">憑證上傳失敗，請檢查檔案格式</p>
          </div>
        )}
      </div>
    </div>
  );
}
