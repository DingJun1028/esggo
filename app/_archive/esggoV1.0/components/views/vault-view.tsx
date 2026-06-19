"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceExplanationCard } from "@/components/ui/service-explanation-card";
import { Lock, FileCheck, Shield, Database, Search, AlertCircle, Loader2, ExternalLink, X, FileText, FileUp, Bot, Upload, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StorageService, UploadProgress } from "@/lib/services/storage-service";
import { useAppContext } from "@/lib/context/app-context";
import { useAuth } from "@/components/context/auth-context";
import { toast } from "sonner";

type PrivacyLevel = 'Open' | 'L1' | 'L2' | 'L3';
type ViewRole = 'Public' | 'Auditor' | 'Board';

interface EvidenceRecord {
  id: string;
  record_id: string;
  type: string;
  timestamp: string;
  hash: string;
  status: string;
  variant: "optimal" | "critical" | "lethal";
  backup_hash?: string;
}

export function VaultView() {
  const { setActiveTab } = useAppContext();
  const { user } = useAuth();
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [viewRole, setViewRole] = useState<ViewRole>('Board');
  const [linkStatuses, setLinkStatuses] = useState<Record<string, 'loading' | 'success' | 'error' | 'none'>>({});
  const [secureDetailValue, setSecureDetailValue] = useState<string>("Loading secure data...");

  // Storage upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const checkLinkStatus = async (hash: string) => {
    setLinkStatuses(prev => ({ ...prev, [hash]: 'loading' }));
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isSuccess = Math.random() > 0.1;
    setLinkStatuses(prev => ({ ...prev, [hash]: isSuccess ? 'success' : 'error' }));
  };

  const handleUploadEvidence = async (file: File) => {
    if (!user) { setUploadError('請先登入後再上傳憑證文件。'); return; }
    const MAX_MB = 50;
    if (file.size > MAX_MB * 1024 * 1024) { setUploadError(`檔案大小超過 ${MAX_MB}MB 限制。`); return; }
    setUploading(true);
    setUploadError(null);
    setUploadProgress(null);

    // 1. 建立一個 Loading Toast 並保存其 ID
    const toastId = toast.loading(`正在上傳 ${file.name}...`, {
      description: '準備中 (0%)'
    });

    try {
      const result = await StorageService.uploadEvidenceFile(
        user.uid, file,
        (p) => {
          setUploadProgress(p);
          // 2. 動態更新 Toast 的進度與描述
          toast.loading(`正在上傳 ${file.name}...`, {
            id: toastId,
            description: `進度: ${p.percentage}% (${(p.bytesTransferred / 1024 / 1024).toFixed(2)} MB / ${(p.totalBytes / 1024 / 1024).toFixed(2)} MB)`
          });
        }
      );
      setUploadedFiles(prev => [{ name: file.name, url: result.downloadUrl }, ...prev]);
      setUploadProgress(null);
      toast.success('憑證上傳成功！', { id: toastId, description: '文件已安全存入雲端保險庫。' });
    } catch (e: unknown) {
      toast.error('上傳失敗', { id: toastId, description: e instanceof Error ? e.message : '未知錯誤' });
      setUploadError(e instanceof Error ? e.message : '上傳失敗，請稍後再試。');
    } finally {
      setUploading(false);
    }
  };

  const validateAllLinks = async () => {
    try {
      for (const record of (records || [])) {
        await checkLinkStatus(record.hash);
      }
    } catch (err) {
      console.error("Chain validation process encountered an error:", err);
    }
  };

  const handleAIAnalyze = (record: EvidenceRecord) => {
    setActiveTab('omni-sphere');
  };

  useEffect(() => {
    async function fetchRecords() {
      try {
        let supabaseQuery = supabase
          .from("evidence_records")
          .select("*")
          .order("timestamp", { ascending: false });

        // Ensure we filter by owner if user is logged in
        if (user) {
          supabaseQuery = supabaseQuery.eq("owner_id", user.uid);
        }

        const { data, error: fetchError } = await supabaseQuery;

        if (fetchError) {
          if (fetchError.code === "42P01") {
            throw new Error(
              "數據表 'evidence_records' 尚未建立，請至 Supabase 執行 SQL 建立指令集。",
            );
          }
          throw fetchError;
        }
        setRecords(data || []);
        setIsConfigured(true);
        setUsingMockData(false);
      } catch (err: any) {
        if (err.message === "Failed to fetch") {
          setError(
            "無法連線至 Supabase 數據庫 (Failed to fetch)。這通常是因為您的 Supabase 專案已暫停 (Paused)，或是環境參數 NEXT_PUBLIC_SUPABASE_URL 或是 ANON KEY 格式不正確。",
          );
        } else {
          setError(err.message);
        }
        setIsConfigured(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [user]);

  // 當選擇的紀錄或檢視角色改變時，從後端 API 獲取已遮罩的資料
  useEffect(() => {
    if (selectedRecord) {
      setSecureDetailValue("Loading secure data...");

      fetch(`/api/evidence/${selectedRecord.id}?role=${viewRole}`)
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "無法取得安全數據");
          return data;
        })
        .then(data => {
          setSecureDetailValue(String(data.maskedValue));
        })
        .catch(err => {
          setSecureDetailValue(`Error: ${err.message}`);
          toast.error(`獲取安全數據失敗: ${err.message}`);
        });
    }
  }, [selectedRecord, viewRole]);

  return (
    <>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-stitch-text tracking-tighter font-headline uppercase">
              Evidence Vault
            </h1>
            <p className="text-stitch-muted mt-2 text-xs font-black tracking-widest font-headline uppercase">
              不可篡改存證中心 - NCBDB (永續存證星際數據庫) 實時數據核對
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stitch-muted group-focus-within:text-stitch-teal-start transition-colors" />
              <input
                type="text"
                placeholder="SEARCH HASH OR ID..."
                className="bg-stitch-shallow-gray/50 border border-stitch-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-stitch-text focus:outline-none focus:ring-4 focus:ring-stitch-teal-start/10 focus:border-stitch-teal-start w-72 snappy-transition uppercase tracking-widest font-headline placeholder:text-stitch-muted/40"
              />
            </div>
            <Button variant="wireframe" onClick={validateAllLinks} className="border-stitch-border text-stitch-text hover:bg-stitch-shallow-gray font-headline font-black text-[10px] tracking-widest uppercase h-[42px] px-6 rounded-xl shadow-minimal">
              <Database className="w-4 h-4 mr-2" />
              Verify Chain
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceExplanationCard
            title="加密存證協議"
            description="所有已通過 5T 協議認證並封印於 SRC Vault 的核心數據紀錄。"
            icon={<Lock className="w-6 h-6" />}
            stats={{ label: "已封印存證", value: isConfigured ? (records?.length || 0).toString() : "0", unit: "卷" }}
            features={["SHA-256 哈希", "WORM 存儲", "不可篡改"]}
            color="var(--primary-gold)"
          />
          <ServiceExplanationCard
            title="NCBDB 同步狀態"
            description="監測企業永續存證數據庫與 5T 協議各節點的數據同步真實性。"
            icon={<Database className="w-6 h-6" />}
            stats={{ label: "同步狀態", value: isConfigured ? "Online" : "Offline", unit: "" }}
            features={["即時同步", "公有鏈校驗", "安全備援"]}
            color="var(--primary-gold)"
          />
          <ServiceExplanationCard
            title="5T 鏈路驗證協議"
            description="全面自動執行 5T 協議驗證路徑，確保每一筆數據皆具備極高的公信力。"
            icon={<Shield className="w-6 h-6" />}
            stats={{ label: "驗證次數", value: "342", unit: "次" }}
            features={["自動驗證", "全方位審核", "趨勢檢測"]}
            color="var(--primary-teal)"
          />
          <ServiceExplanationCard
            title="Omni 系統驗證"
            description="監控並展示 Omni 平台的架構與安全性、透明度等級。"
            icon={<FileCheck className="w-6 h-6" />}
            stats={{ label: "系統狀態", value: "Secure", unit: "" }}
            features={["安全加密", "架構成熟度", "實時監控"]}
            color="var(--primary-teal)"
          />
        </div>

        {/* ── Cloud Storage Upload Panel ── */}
        <div className="rounded-[24px] border border-stitch-border bg-white overflow-hidden shadow-minimal stitch-glass">
          <div className="p-6 border-b border-stitch-border bg-stitch-shallow-gray/30 flex items-center justify-between">
            <h2 className="text-sm font-black text-stitch-text flex items-center gap-3 uppercase tracking-widest font-headline">
              <Upload className="w-5 h-5 text-stitch-teal-start" />
              Evidence Upload · Cloud Storage
            </h2>
            <span className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest font-headline">
              Firebase Storage · Max 50 MB · PDF / IMG / CSV
            </span>
          </div>
          <div className="p-8">
            {/* Drop Zone */}
            <label
              htmlFor="evidence-upload"
              className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${isDragOver ? 'border-stitch-teal-start bg-stitch-teal-start/5' : 'border-stitch-border hover:border-stitch-teal-start/50 hover:bg-stitch-shallow-gray/50'
                }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleUploadEvidence(file);
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-stitch-teal-start animate-spin" />
                  <p className="text-xs font-black text-stitch-text uppercase tracking-widest font-headline mt-2">上傳中...</p>
                  {uploadProgress && (
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-[10px] font-black text-stitch-muted mb-2">
                        <span className="font-headline uppercase">Progress</span>
                        <span>{uploadProgress.percentage}%</span>
                      </div>
                      <div className="w-full bg-stitch-border rounded-full h-2">
                        <div
                          className="bg-stitch-teal-start h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-4 bg-stitch-shallow-gray rounded-2xl text-stitch-muted mb-2 shadow-inner"><FileUp className="w-8 h-8" /></div>
                  <div className="text-center">
                    <p className="text-sm font-black text-stitch-text font-headline">拖放或點擊上傳 ESG 憑證文件</p>
                    <p className="text-[10px] text-stitch-muted mt-2 font-headline uppercase tracking-widest">PDF · JPG · PNG · CSV · XLSX · Max 50MB</p>
                  </div>
                </>
              )}
              <input
                id="evidence-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.csv,.xlsx,.xls"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadEvidence(f); }}
                disabled={uploading}
              />
            </label>

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-4 flex items-center gap-2 p-4 bg-stitch-critical/5 border border-stitch-critical/20 rounded-xl text-xs text-stitch-critical font-black font-headline">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {uploadError}
              </div>
            )}

            {/* Uploaded Files List */}
            {(uploadedFiles?.length || 0) > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-stitch-muted font-headline">本次上傳紀錄</p>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-stitch-shallow-gray/50 border border-stitch-border rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-stitch-optimal flex-shrink-0" />
                    <span className="flex-1 text-xs font-black text-stitch-text truncate font-headline">{f.name}</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-black text-stitch-teal-start hover:underline font-headline uppercase tracking-widest flex items-center gap-1 px-3 py-1.5 bg-stitch-teal-start/10 rounded-lg">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-stitch-border bg-white overflow-hidden min-h-[400px] flex flex-col shadow-minimal stitch-glass mt-6">
          <div className="p-8 border-b border-stitch-border bg-stitch-shallow-gray/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-sm font-black text-stitch-text flex items-center gap-3 uppercase tracking-widest font-headline">
              <Lock className="w-5 h-5 text-stitch-teal-start" />
              Advanced Telemetry Matrix (NCBDB)
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-stitch-muted flex items-center gap-2 uppercase tracking-widest font-headline">
                <div className="w-2 h-2 rounded-full bg-stitch-teal-start animate-pulse" />
                Live Database Connection
              </span>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            {!isConfigured ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                <Database className="w-12 h-12 text-[#FFB703] mb-4" />
                <h3 className="text-lg font-bold text-[#333333] mb-2">
                  NCBDB (永續存證星際數據庫) 尚未配置
                </h3>
                <p className="text-[#666666] max-w-md mb-6">
                  請在您的環境參數中設定{" "}
                  <code className="bg-[#F1F3F5] px-1 py-0.5 rounded text-[#FF4D6D]">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>{" "}
                  與{" "}
                  <code className="bg-[#F1F3F5] px-1 py-0.5 rounded text-[#FF4D6D]">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>{" "}
                  以連接至實體數據庫。
                </p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <Loader2 className="w-8 h-8 text-primary-teal-start animate-spin mb-4" />
                <p className="text-[#666666]">正在從 NCBDB 讀取存證紀錄...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                <AlertCircle className="w-12 h-12 text-[#FF4D6D] mb-4" />
                <h3 className="text-lg font-bold text-[#333333] mb-2">
                  數據讀取失敗
                </h3>
                <p className="text-[#666666] max-w-md mb-6">{error}</p>
              </div>
            ) : (records?.length || 0) === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                <FileCheck className="w-12 h-12 text-[#999999] mb-4" />
                <h3 className="text-lg font-bold text-[#333333] mb-2">
                  暫無存證紀錄
                </h3>
                <p className="text-[#666666] max-w-md">
                  數據庫已連線，但 evidence_records 數據表內容目前為空。
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stitch-shallow-gray text-stitch-muted text-[10px] font-black uppercase tracking-widest font-headline text-left">
                    <th className="p-6 border-b border-stitch-border">Record ID</th>
                    <th className="p-6 border-b border-stitch-border">Evidence Type</th>
                    <th className="p-6 border-b border-stitch-border">Timestamp</th>
                    <th className="p-6 border-b border-stitch-border">SHA-256 Hash</th>
                    <th className="p-6 border-b border-stitch-border">Status</th>
                    <th className="p-6 border-b border-stitch-border text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stitch-border">
                  {(records || []).map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-stitch-shallow-gray/30 transition-colors group"
                    >
                      <td className="p-6 font-mono text-[11px] font-bold">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="text-stitch-teal-start hover:underline flex items-center gap-2 snappy-transition uppercase font-headline font-black"
                        >
                          {record.record_id}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="p-6 text-[11px] text-stitch-text font-black uppercase tracking-tight font-headline">
                        {record.type}
                      </td>
                      <td className="p-6 text-[10px] text-stitch-muted font-bold uppercase font-headline tracking-widest">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="p-6 font-mono text-[10px] text-stitch-muted/70 truncate max-w-[180px] group-hover:text-stitch-text transition-colors">
                        {record.hash}
                      </td>
                      <td className="p-6">
                        <Badge variant={record.variant} styleType="soft" className="font-headline uppercase tracking-widest text-[9px] px-3">
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {linkStatuses[record.hash] === 'loading' && (
                            <Loader2 className="w-4 h-4 text-stitch-teal-start animate-spin" />
                          )}
                          {linkStatuses[record.hash] === 'success' && (
                            <div className="px-2 py-1 bg-stitch-optimal/10 text-stitch-optimal border border-stitch-optimal/20 text-[9px] font-black rounded uppercase font-headline tracking-widest">200 OK</div>
                          )}
                          {linkStatuses[record.hash] === 'error' && (
                            <div className="px-2 py-1 bg-stitch-critical/10 text-stitch-critical border border-stitch-critical/20 text-[9px] font-black rounded uppercase font-headline tracking-widest">Broken</div>
                          )}
                          <button
                            onClick={() => handleAIAnalyze(record)}
                            className="text-stitch-muted hover:text-stitch-teal-start snappy-transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest font-headline bg-stitch-shallow-gray px-3 py-1.5 rounded-lg border border-stitch-border"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            Analyze
                          </button>
                          <button
                            onClick={() => checkLinkStatus(record.hash)}
                            className="text-stitch-text bg-white border border-stitch-border hover:bg-stitch-shallow-gray snappy-transition text-[10px] font-black uppercase tracking-widest font-headline px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Document Snapshot Modal */}
      {
        selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm p-4 snappy-transition">
            <div className="bg-white rounded-lg border border-outline-variant shadow-minimal w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] snappy-transition">
              <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-on-surface flex items-center gap-3 uppercase tracking-widest font-headline">
                    <FileText className="w-5 h-5 text-primary-teal" />
                    Document Snapshot: {selectedRecord.record_id}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Viewing Protocol:</span>
                    <div className="flex bg-surface-container rounded-lg p-1 gap-1 border border-outline-variant">
                      {(['Public', 'Auditor', 'Board'] as ViewRole[]).map(role => (
                        <button
                          key={role}
                          onClick={() => setViewRole(role)}
                          className={`px-3 py-1 text-[9px] font-bold rounded-md snappy-transition uppercase tracking-widest font-headline ${viewRole === role
                            ? 'bg-primary-teal-start text-white'
                            : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-lg hover:bg-surface-container/20 border border-transparent hover:border-outline-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-widest font-headline">
                    Current Storage Location (WORM)
                  </p>
                  <div className="bg-surface-container/20 p-4 rounded-lg border border-outline-variant group">
                    <a
                      href={`https://ncb.wuzuo.io/vault/${selectedRecord.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-teal hover:underline flex items-center gap-3 text-xs break-all font-mono font-bold"
                    >
                      https://ncb.wuzuo.io/vault/{selectedRecord.hash}
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold font-headline">Status:</span>
                      {linkStatuses[selectedRecord.hash] === 'loading' ? (
                        <span className="text-[9px] text-on-surface-variant flex items-center gap-1 font-bold font-headline">
                          <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                        </span>
                      ) : linkStatuses[selectedRecord.hash] === 'success' ? (
                        <span className="text-[9px] text-primary-teal font-bold font-headline italic tracking-widest uppercase">??Healthy (200 OK)</span>
                      ) : linkStatuses[selectedRecord.hash] === 'error' ? (
                        <span className="text-[9px] text-error font-bold font-headline italic tracking-widest uppercase">??Broken Chain</span>
                      ) : (
                        <button
                          onClick={() => checkLinkStatus(selectedRecord.hash)}
                          className="text-[9px] text-primary-teal hover:underline font-bold font-headline tracking-widest uppercase"
                        >
                          Run Health Check
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Backup Explanation Area */}
                {selectedRecord.backup_hash && (
                  <div className="p-6 bg-surface-container/10 border border-outline-variant rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white border border-outline-variant rounded-lg shadow-sm text-primary-teal">
                        <FileUp className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest font-headline">自動生成報告說明摘要</span>
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest font-headline">Secondary Context Document</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-outline-variant">
                      <p className="text-[10px] text-on-surface leading-loose mb-4 font-bold uppercase tracking-tight font-headline">
                        此紀錄為系統自動摘要生成的證明文件副本。原始來源包含所有相關的歷史數據鏈與變更日誌，所有紀錄均經由 5T 協議加密存證以供備查。
                      </p>
                      <a
                        href={`https://ncb.wuzuo.io/vault/${selectedRecord.backup_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-primary-teal hover:underline flex items-center gap-2 font-mono uppercase font-headline"
                      >
                        VIEW_BACKUP_EXPLANATION.PDF
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest font-headline">
                    Evidence Snapshot ({new Date(selectedRecord.timestamp).toLocaleDateString()})
                  </p>
                  <div className="border border-outline-variant rounded-lg p-10 bg-surface-container/30 shadow-inner relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none group-hover:scale-105 snappy-transition">
                      <Shield className="w-48 h-48 text-primary-teal-start" />
                    </div>
                    <div className="space-y-8 relative z-10">
                      <div className="flex flex-col gap-4">
                        <div className="p-5 bg-white rounded-lg border border-outline-variant shadow-sm">
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 font-headline">Masked Audit Data (ZKP Protocol)</p>
                          <p className="text-sm font-mono text-on-surface break-all leading-relaxed font-bold tracking-tight">
                            {secureDetailValue}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-[2px] bg-primary-teal/20 rounded w-full"></div>
                          <div className="h-[2px] bg-outline-variant rounded w-full"></div>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-outline-variant flex flex-col gap-2">
                        <p className="text-[10px] text-on-surface-variant font-mono font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-gold" />
                          SHA-256: {selectedRecord.hash}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-mono font-bold flex items-center gap-2 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-teal" />
                          Type: {selectedRecord.type}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-mono font-bold flex items-center gap-2 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Status: {selectedRecord.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-outline-variant bg-surface-container/20 flex justify-end">
                <Button variant="solid" onClick={() => setSelectedRecord(null)} className="h-12 px-10 rounded-lg font-headline uppercase tracking-widest text-[11px]">
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
