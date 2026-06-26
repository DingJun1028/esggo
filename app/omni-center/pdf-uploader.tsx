'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// Light theme color tokens
const C = { teal:'#009EB0', gold:'#D4AF37', purple:'#8B5CF6', muted:'#64748B', surface:'#F1F5F9', border:'#E2E8F0', text:'#0F172A', green:'#22C55E', red:'#FF4D6D', bg:'#F8FAFC' };

interface UploadResult {
  success: boolean;
  message: string;
  totalChunks?: number;
  pageCount?: number;
}

export function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'user_' + Math.random().toString(36).substring(2, 11));

    try {
      const res = await fetch('/api/rag/ingest', {
        method: 'POST',
        body: formData,
      });

      let data: Record<string, unknown> = {};
      try {
        data = await res.json() as Record<string, unknown>;
      } catch {
        // Response wasn't JSON — handle gracefully
        if (!res.ok) throw new Error(`伺服器返回 ${res.status}`);
      }

      if (!res.ok) {
        const errorMsg = typeof data.error === 'string' ? data.error : `上傳失敗 (${res.status})`;
        throw new Error(errorMsg);
      }

      const totalChunks = typeof data.totalChunks === 'number' ? data.totalChunks : undefined;
      const pageCount = typeof data.pageCount === 'number' ? data.pageCount : undefined;

      setResult({
        success: true,
        message: '上傳並解析成功！已同步至 NCBDB',
        totalChunks,
        pageCount
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發生未知錯誤';
      console.warn(`[PdfUploader] Upload failed: ${message}`);
      setResult({
        success: false,
        message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.teal, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Upload size={18} /> RAG 知識庫上傳
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        上傳永續報告書 (PDF)，Omni-Core 將自動解析並進行切片 (Chunking)，寫入 <code style={{color: C.gold, background: C.surface, padding: '1px 4px', borderRadius: 3}}>54686_esg_go_userdb</code> 的 knowledge_chunks 中。
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = `${C.teal}10`; }}
        onDragLeave={e => { e.currentTarget.style.background = `${C.surface}`; }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.style.background = C.surface;
          const dropFile = e.dataTransfer?.files?.[0];
          if (dropFile && dropFile.type === 'application/pdf') {
            setFile(dropFile);
            setResult(null);
          }
        }}
        style={{
          border: `2px dashed ${C.border}`,
          borderRadius: 12,
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: C.surface,
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = `${C.teal}08`}
        onMouseOut={e => e.currentTarget.style.background = C.surface}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <FileText size={36} color={C.teal} style={{ margin: '0 auto 12px auto' }} />
        <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>
          {file ? file.name : '點擊選擇或拖曳 PDF 檔案至此'}
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
          {file ? `檔案大小: ${(file.size / 1024 / 1024).toFixed(2)} MB` : '支援 .pdf 格式'}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          background: !file || uploading ? '#CBD5E1' : C.teal,
          color: '#FFFFFF',
          border: 'none',
          padding: '12px',
          borderRadius: 8,
          fontWeight: 700,
          cursor: !file || uploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          transition: 'background 0.2s'
        }}
      >
        {uploading ? '處理中 (解析與切片)...' : '開始上傳並寫入知識庫'}
      </button>

      {result && (
        <div style={{
          padding: 16,
          borderRadius: 8,
          background: result.success ? `${C.green}10` : `${C.red}10`,
          border: `1px solid ${result.success ? C.green : C.red}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: result.success ? C.green : C.red, fontWeight: 700 }}>
            {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {result.message}
          </div>
          {result.success && result.totalChunks != null && (
            <div style={{ color: C.text, fontSize: 13, marginTop: 4 }}>
              解析了 {result.pageCount ?? '?'} 頁，共產生 <strong style={{color: C.teal}}>{result.totalChunks}</strong> 個知識切片。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
