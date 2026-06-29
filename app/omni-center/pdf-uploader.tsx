'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  success: boolean;
  message: string;
  totalChunks?: number;
  pageCount?: number;
}

interface ProcessedDocument {
  id: string;
  sourceFile: string;
  ocrResult: { text: string; confidence: number };
  knowledgePoint: { why: string; what: string; how: string; tags: string[] };
  hashLock: string;
}

export function PdfUploader() {
  const [mode, setMode] = useState<'rag' | 'esg_ocr'>('rag');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [processedDoc, setProcessedDoc] = useState<ProcessedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setResult(null);
      setProcessedDoc(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    setProcessedDoc(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('userId', 'user_' + Math.random().toString(36).substring(2, 11));

    try {
      const endpoint = mode === 'rag' ? '/api/rag/ingest' : '/api/sustain-write/v5/documents';
      const res = await fetch(endpoint, {
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

      if (mode === 'rag') {
        const totalChunks = typeof data.totalChunks === 'number' ? data.totalChunks : undefined;
        const pageCount = typeof data.pageCount === 'number' ? data.pageCount : undefined;

        setResult({
          success: true,
          message: '上傳並解析成功！已同步至 NCBDB',
          totalChunks,
          pageCount
        });
      } else {
        const docData = data.data as ProcessedDocument;
        setProcessedDoc(docData);
        setResult({
          success: true,
          message: '單據已由 ESGSonnar 完成深度解析與 ZKP 封印'
        });
      }

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-accentTeal tracking-wide flex items-center gap-2">
          <Upload size={18} /> {mode === 'rag' ? 'RAG 知識庫上傳' : 'ESGSonnar 單據智能解析'}
        </div>
        <div className="flex gap-2 bg-secondary p-1 rounded-lg">
          <button onClick={() => setMode('rag')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'rag' ? 'bg-accentTeal text-white' : 'text-textSecondary hover:bg-white/5'}`}>RAG 寫入</button>
          <button onClick={() => setMode('esg_ocr')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'esg_ocr' ? 'bg-accentGold text-black font-bold' : 'text-textSecondary hover:bg-white/5'}`}>單據深度解析</button>
        </div>
      </div>
      
      <div className="text-[13px] text-textSecondary leading-[1.6]">
        {mode === 'rag' ? (
          <>上傳永續報告書 (PDF)，Omni-Core 將自動解析並進行切片 (Chunking)，寫入 <code className="text-accentGold bg-primary px-1 py-[1px] rounded-[3px]">Firestore</code> 的 rag_knowledge 集合中。</>
        ) : (
          <>上傳企業單據，透過 <strong>ESGSonnar</strong> 進行多模態 OCR 與知識點萃取 (Why, What, How)，並完成 5T 協議的 Trustworthy ZKP 封印。</>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('bg-accentTeal/10'); }}
        onDragLeave={e => { e.currentTarget.classList.remove('bg-accentTeal/10'); }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-accentTeal/10');
          const dropFile = e.dataTransfer?.files?.[0];
          if (dropFile && dropFile.type === 'application/pdf') {
            setFile(dropFile);
            setResult(null);
          }
        }}
        className="border-2 border-dashed border-borderColor rounded-xl py-10 px-5 text-center cursor-pointer bg-primary transition-all duration-200 hover:bg-accentTeal/5 group"
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <FileText size={36} className="mx-auto mb-3 text-accentTeal group-hover:scale-110 transition-transform duration-200" />
        <div className="text-textPrimary font-semibold text-sm">
          {file ? file.name : '點擊選擇或拖曳 PDF 檔案至此'}
        </div>
        <div className="text-textSecondary text-xs mt-2">
          {file ? `檔案大小: ${(file.size / 1024 / 1024).toFixed(2)} MB` : '支援 .pdf 格式'}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`border-none py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors ${
          !file || uploading ? 'bg-slate-300 dark:bg-slate-700 text-white/70 cursor-not-allowed' : 'bg-accentTeal text-white cursor-pointer hover:bg-accentTeal/90'
        }`}
      >
        {uploading ? '處理中 (解析與切片)...' : '開始上傳並寫入知識庫'}
      </button>

      {result && (
        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${result.success ? 'bg-accentGreen/10 border-accentGreen' : 'bg-[#FF4D6D]/10 border-[#FF4D6D]'}`}>
          <div className={`flex items-center gap-2 font-bold ${result.success ? 'text-accentGreen' : 'text-[#FF4D6D]'}`}>
            {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {result.message}
          </div>
          {result.success && result.totalChunks != null && (
            <div className="text-textPrimary text-[13px] mt-1">
              解析了 {result.pageCount ?? '?'} 頁，共產生 <strong className="text-accentTeal">{result.totalChunks}</strong> 個知識切片。
            </div>
          )}
        </div>
      )}

      {processedDoc && (
        <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-secondary p-4 rounded-xl border border-borderColor shadow-lg">
            <h4 className="text-accentGold text-sm font-bold flex items-center gap-2 mb-3">
              <FileText size={16} /> 教學即服務 (Service as Teaching)
            </h4>
            <div className="grid gap-3 text-[13px]">
              <div className="bg-primary/50 p-3 rounded-lg border-l-2 border-accentTeal">
                <span className="font-bold text-accentTeal block mb-1">Why 為什麼重要？</span>
                <span className="text-textPrimary">{processedDoc.knowledgePoint.why}</span>
              </div>
              <div className="bg-primary/50 p-3 rounded-lg border-l-2 border-accentBlue">
                <span className="font-bold text-accentBlue block mb-1">What 紀錄了什麼？</span>
                <span className="text-textPrimary">{processedDoc.knowledgePoint.what}</span>
              </div>
              <div className="bg-primary/50 p-3 rounded-lg border-l-2 border-accentPurple">
                <span className="font-bold text-accentPurple block mb-1">How 如何改善？</span>
                <span className="text-textPrimary">{processedDoc.knowledgePoint.how}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-borderColor/50 flex items-center justify-between">
              <div className="text-xs font-mono text-textSecondary bg-primary px-2 py-1 rounded">
                HashLock: {processedDoc.hashLock.substring(0, 16)}...
              </div>
              <div className="flex gap-1">
                {processedDoc.knowledgePoint.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-accentGold/20 text-accentGold px-2 py-[2px] rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
