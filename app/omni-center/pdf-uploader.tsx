"use client";
import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const C = {
  teal: "#009EB0",
  gold: "#D4AF37",
  purple: "#8B5CF6",
  muted: "#9CA3AF",
  surface: "#1A1A1F",
  border: "rgba(0,158,176,0.2)",
  text: "#E8E8E8",
  green: "#22C55E",
  red: "#FF4D6D",
};

export function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    totalChunks?: number;
    pageCount?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "userId",
      "user_" + Math.random().toString(36).substr(2, 9),
    ); // Simulate logged-in user

    try {
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResult({
        success: true,
        message: "上傳並解析成功！已同步至 NCBDB",
        totalChunks: data.totalChunks,
        pageCount: data.pageCount,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "發生未知錯誤",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: C.teal,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Upload size={18} /> RAG 知識庫上傳
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        上傳永續報告書 (PDF)，Omni-Core 將自動解析並進行切片 (Chunking)，寫入{" "}
        <code style={{ color: C.gold }}>54686_esg_go_userdb</code> 的
        knowledge_chunks 中。
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="選擇 PDF 檔案上傳"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        style={{
          border: `2px dashed ${C.border}`,
          borderRadius: 12,
          padding: "40px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(0,158,176,0.05)",
          transition: "all 0.2s",
          outline: "none",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "rgba(0,158,176,0.1)")
        }
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(0,158,176,0.05)";
          e.currentTarget.style.boxShadow = "none";
        }}
        onFocus={(e) => {
          e.currentTarget.style.background = "rgba(0,158,176,0.1)";
          e.currentTarget.style.boxShadow = `0 0 0 2px ${C.teal}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = "rgba(0,158,176,0.05)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <FileText
          size={36}
          color={C.teal}
          style={{ margin: "0 auto 12px auto" }}
        />
        <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>
          {file ? file.name : "點擊選擇或拖曳 PDF 檔案至此"}
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
          {file
            ? `檔案大小: ${(file.size / 1024 / 1024).toFixed(2)} MB`
            : "支援 .pdf 格式"}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          background: !file || uploading ? C.muted : C.teal,
          color: "#000",
          border: "none",
          padding: "12px",
          borderRadius: 8,
          fontWeight: 700,
          cursor: !file || uploading ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          transition: "background 0.2s",
        }}
      >
        {uploading ? "處理中 (解析與切片)..." : "開始上傳並寫入知識庫"}
      </button>

      {result && (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: result.success
              ? "rgba(34,197,94,0.1)"
              : "rgba(255,77,109,0.1)",
            border: `1px solid ${result.success ? C.green : C.red}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: result.success ? C.green : C.red,
              fontWeight: 700,
            }}
          >
            {result.success ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {result.message}
          </div>
          {result.success && result.totalChunks && (
            <div style={{ color: C.text, fontSize: 13, marginTop: 4 }}>
              解析了 {result.pageCount} 頁，共產生{" "}
              <strong style={{ color: C.teal }}>{result.totalChunks}</strong>{" "}
              個知識切片。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
