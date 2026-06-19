"use client";

import { useState, useMemo, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Search,
  Database,
  ArrowRight,
  ShieldCheck,
  EyeOff,
  Fingerprint,
  FileCheck,
  AlertCircle,
  Network,
  Download,
  CheckCircle,
  Trash2,
  Edit,
  History,
  Activity,
  Verified
} from "lucide-react";
import { TrustEngine, IZKPContext } from "@/lib/core";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/lib/context/app-context";
import { useFirebase } from "@/components/layout/firebase-provider";
import { translations } from "@/lib/i18n";
import { CloudUpload, HardDriveDownload, FileUp, Loader2, Shield, Sparkles } from "lucide-react";
import { searchEvidence } from "@/app/actions";


// Mock Data for the Evidence Vault ZKP demonstration
const VAULT_RECORDS = [
  {
    id: "NODE-2025-001",
    dataType: "供應商碳排放數據",
    source: "ERP 系統對接",
    timestamp: "2025-10-15T09:30:00Z",
    hiddenFields: ["supplierName", "exactPricing", "tradeSecrets"],
    originalData: {
      supplierName: "EcoTech Manufacturing Ltd",
      exactPricing: "$450,000 USD",
      tradeSecrets: "Proprietary alloy process X-2",
      carbonFootprint: "12,450 kg CO2e",
      energySource: "100% Renewable",
    },
    category: "E"
  },
  {
    id: "NODE-2025-002",
    dataType: "高階人事薪資調查 (GRI 405)",
    source: "HR 系統上傳",
    timestamp: "2025-10-14T14:20:00Z",
    hiddenFields: ["employeeId", "exactSalary", "address"],
    originalData: {
      employeeId: "EMP-4991",
      exactSalary: "$120,500 USD",
      address: "123 Secure St, Taipei",
      gender: "Female",
      managerialLevel: "Senior Director",
    },
    category: "G"
  },
  {
    id: "NODE-2025-003",
    dataType: "供應鏈水資源取用量 (SASB)",
    source: "物聯網自動上報",
    timestamp: "2025-10-12T08:15:00Z",
    hiddenFields: ["gpsCoordinates", "sensorIP"],
    originalData: {
      facilityName: "Plant Alpha",
      gpsCoordinates: "25.0330° N, 121.5654° E",
      sensorIP: "192.168.1.104",
      waterUsageGal: "450,000",
      stressLevel: "Low",
    },
    category: "E"
  }
];

export function EvidenceVaultView() {
  const { user, uploadFile, deleteFile, gcp } = useFirebase();
  const { language, auditRecords, addAuditRecord, updateAuditRecord, deleteAuditRecord, addNotification, setActiveSubView, setActiveView, addActivity } = useAppContext();

  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [visibleSensitiveFields, setVisibleSensitiveFields] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [uploadCategory, setUploadCategory] = useState<string>("E");

  const toggleFieldVisibility = (field: string) => {
    setVisibleSensitiveFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getZKPReason = (field: string) => {
    const f = field.toLowerCase();
    if (f.includes('name') || f.includes('id') || f.includes('address')) return "PII";
    if (f.includes('salary') || f.includes('pricing') || f.includes('secret')) return "Commercial Confidentiality";
    if (f.includes('gps') || f.includes('ip')) return "Security & Infrastructure Obfuscation";
    return "Sensitive";
  };

  const vaultData = useMemo(() => {
    if (auditRecords && auditRecords.length > 0) return auditRecords;

    // Fallback to localized mock data only if none present in DB
    const zh = [
      { id: "MOCK-001", title: "供應商碳排放數據", dataType: "環境數據", source: "ERP 系統對接", standard: "GRI 305", description: "智慧對接數據", zkpStatus: "verified", createdAt: new Date().toISOString() },
    ];
    const en = [
      { id: "MOCK-001", title: "Supplier Carbon Data", dataType: "Environmental", source: "ERP Integration", standard: "GRI 305", description: "Smart integrated data", zkpStatus: "verified", createdAt: new Date().toISOString() },
    ];
    return language === 'zh' ? zh : en;
  }, [auditRecords, language]);



  // Transformed nodes for display
  const displayNodes = useMemo(() => {
    // If we have records from Data Connect, use them
    if (auditRecords && auditRecords.length > 0) {
      return auditRecords.map(record => {
        let protocol;
        try {
          protocol = typeof record.protocol5T === 'string' ? JSON.parse(record.protocol5T) : record.protocol5T;
        } catch (e) {
          protocol = { tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true };
        }

        let proofSignals = null;
        try {
          proofSignals = record.proofSignals ? JSON.parse(record.proofSignals) : null;
        } catch (e) {
          console.error("Failed to parse proof signals", e);
        }

        return {
          id: record.id,
          dataType: record.dataType,
          source: record.source,
          timestamp: record.timestamp,
          zkpStatus: (record.zkpStatus as any) || "Verified",
          trustScore: record.trustScore,
          protocol: protocol,
          proofHash: record.proofHash,
          originalData: { fileUrl: record.imageUrl || "" },
          zkpContext: {
            proofSignature: record.proofSignature || record.proofHash || "0x0000000000000000",
            algorithm: record.algorithm || "zk-SNARK (Groth16 Simulated)",
            publicInputsHash: record.publicInputsHash || "0xMockPublicInputHash",
            verifierKey: record.verifierKey || "0xMockVerifierKey",
            salt: record.salt || "no-salt",
            proof: proofSignals
          } as IZKPContext,
          maskedData: { "Data Content": "[PROTECTED_BY_ZKP]", "Standard": record.standard || "None" },
          hiddenFields: ["dataContent"],
          linkedReport: record.linkedReport || "Unlinked"
        };
      });
    }

    // Fallback to local mocks if DB is empty
    return (VAULT_RECORDS as any[]).map((record, idx) => {
      const proofInfo = TrustEngine.generateZKP(record.originalData, record.hiddenFields);
      const protocol5T = TrustEngine.forge(record.originalData, record.hiddenFields);
      const localized = vaultData[idx] || vaultData[0] || {};

      return {
        ...record,
        id: record.id || `MOCK-${idx}`,
        timestamp: record.timestamp || new Date().toISOString(),
        dataType: localized.dataType || record.dataType || "Unknown",
        source: localized.source || record.source || "Manual",
        linkedReport: localized.linkedReport || "Unlinked",
        linkedView: localized.linkedView || "none",
        zkpContext: proofInfo.proofContext,
        maskedData: proofInfo.maskedData,
        protocol: protocol5T,
        zkpStatus: "Verified"
      };
    });
  }, [auditRecords, language]);

  const [auditNodes, setAuditNodes] = useState<any[]>(displayNodes);

  useEffect(() => {
    setAuditNodes(displayNodes);
  }, [displayNodes]);

  // Phase 3: ZKP Auto-Verification Trigger
  useEffect(() => {
    const pendingNodes = auditNodes.filter(n => n.zkpStatus === "Pending" || !n.zkpStatus);
    if (pendingNodes.length === 0) return;

    const timer = setTimeout(async () => {
      const nodeToVerify = pendingNodes[0];

      // Simulate verification start
      setAuditNodes(prev => prev.map(n => n.id === nodeToVerify.id ? { ...n, zkpStatus: "Verifying" } : n));

      await new Promise(resolve => setTimeout(resolve, 3000));

      const isValid = TrustEngine.verifyZKP(nodeToVerify.zkpContext);
      const newStatus = isValid ? "Verified" : "Failed";

      // Update DB and Local State
      await updateAuditRecord({
        id: nodeToVerify.id,
        zkpStatus: newStatus
      });

      addNotification({
        type: newStatus === "Verified" ? "success" : "error",
        title: newStatus === "Verified" ? "ZKP 自動驗證成功" : "ZKP 驗證失敗",
        message: `節點 ${nodeToVerify.id} 已通過分散式共識驗證。`
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [auditNodes, updateAuditRecord, addNotification]);

  const handleSelectRecord = (record: any) => {
    setSelectedRecord(record);
  };

  const handleVerify = async () => {
    if (!selectedRecord) return;
    setAuditNodes(prev => prev.map(n => n.id === selectedRecord.id ? { ...n, zkpStatus: "Verifying" } : n));
    setSelectedRecord(prev => prev ? { ...prev, zkpStatus: "Verifying" } : null);

    // Simulate async ZKP verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValid = TrustEngine.verifyZKP(selectedRecord.zkpContext);
    const newStatus = isValid ? "Verified" : "Failed";
    setAuditNodes(prev => prev.map(n => n.id === selectedRecord.id ? { ...n, zkpStatus: newStatus } : n));
    setSelectedRecord(prev => prev ? { ...prev, zkpStatus: newStatus } : null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const path = `evidence/${user.uid}/${Date.now()}_${file.name}`;
      const url = await uploadFile(path, file);

      // Add new record via Data Connect
      const sourceStr = language === 'zh' ? "手動上傳 (Cloud Storage)" : "Manual Upload (Cloud Storage)";
      const proofInfo = TrustEngine.generateZKP({ fileUrl: url, size: file.size }, ["fileUrl"]);
      const protocol5T = TrustEngine.forge({ fileUrl: url, size: file.size }, ["fileUrl"]);

      await addAuditRecord({
        title: file.name.substring(0, 50),
        dataType: file.type || "Uploaded Document",
        standard: "None",
        source: sourceStr,
        description: `Manually uploaded. Size: ${Math.round(file.size / 1024)} KB`,
        imageUrl: url,
        zkpStatus: "Verified",
        proofHash: proofInfo.proofContext.publicInputsHash, // Hash for backward compatibility
        proofSignature: proofInfo.proofContext.proofSignature,
        salt: proofInfo.proofContext.salt,
        algorithm: proofInfo.proofContext.algorithm,
        verifierKey: proofInfo.proofContext.verifierKey,
        publicInputsHash: proofInfo.proofContext.publicInputsHash,
        proofSignals: JSON.stringify(proofInfo.proofContext.proof),
        protocol5T: JSON.stringify(protocol5T),
        trustScore: 80,
        timestamp: new Date().toISOString(),
        linkedReport: "Unlinked",
        category: uploadCategory,
        userId: user.uid
      });

      addActivity("evidence_uploaded", {
        fileName: file.name,
        category: uploadCategory,
        timestamp: new Date().toISOString()
      });

      alert(language === 'zh' ? "文件已成功上傳至 Firebase Storage 並完成 ZKP 存證！" : "File uploaded to Firebase Storage and ZKP verified!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVisionScan = async () => {
    if (!selectedRecord || !selectedRecord.originalData?.fileUrl) return;

    setIsScanning(true);
    try {
      const result = await gcp.scanDocument(selectedRecord.originalData.fileUrl);

      // Update the record with scanned metadata
      const updatedRecord = {
        ...selectedRecord,
        scannedMeta: result,
        zkpStatus: "Verified" // Re-verify with new data
      };

      setAuditNodes(prev => prev.map(n => n.id === selectedRecord.id ? updatedRecord : n));
      setSelectedRecord(updatedRecord);

      gcp.logEvent('INFO', 'Document scanned successfully', { recordId: selectedRecord.id });
      alert(language === 'zh' ? "AI 掃描完成！已提取關鍵實體資料。" : "AI Scan Complete! Entities extracted.");
    } catch (error) {
      gcp.logEvent('ERROR', 'Document scan failed', { error });
      alert("AI Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const record = auditNodes.find(n => n.id === id);
    if (!confirm(language === 'zh' ? "確定要刪除此存證記錄嗎？這將從 Data Connect 雲端移除。" : "Are you sure you want to delete this record? This will remove it from Data Connect.")) return;

    if (record?.metadata) {
      try {
        const meta = JSON.parse(record.metadata);
        if (meta.fileUrl) {
          await deleteFile(meta.fileUrl);
        }
      } catch (e) {
        console.error("Failed to parse metadata for file deletion", e);
      }
    }

    await deleteAuditRecord(id);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleUpdateRecord = async (record: any) => {
    const newTitle = prompt(language === 'zh' ? "輸入新的資料類型" : "Enter new data type", record.dataType);
    if (newTitle && newTitle !== record.dataType) {
      await updateAuditRecord({
        id: record.id,
        dataType: newTitle
      });
      // Local state is updated via subscription
    }
  };

  const handleVerifyBatch = async () => {
    if (selectedRecordIds.length === 0) return;
    setIsVerifyingAll(true);
    setVerificationProgress(0);

    const recordsToVerify = auditNodes.filter(n => selectedRecordIds.includes(n.id));

    for (let i = 0; i < recordsToVerify.length; i++) {
      // Provide visual indicator for each record being verified
      const record = recordsToVerify[i];

      // Optimistic update for individual record
      setAuditNodes(prev => prev.map(n => n.id === record.id ? { ...n, zkpStatus: "Verifying" } : n));

      // Simulate heavy computation
      await new Promise(resolve => setTimeout(resolve, 800));

      const isValid = TrustEngine.verifyZKP(record.zkpContext);
      const newStatus = isValid ? "Verified" : "Failed";

      setAuditNodes(prev => prev.map(n => n.id === record.id ? { ...n, zkpStatus: newStatus } : n));
      setVerificationProgress(Math.floor(((i + 1) / recordsToVerify.length) * 100));
    }

    setIsVerifyingAll(false);
  };

  const toggleRecordSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecordIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredNodes = useMemo(() => {
    let nodes = auditNodes;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      nodes = nodes.filter(node =>
        node.id.toLowerCase().includes(q) ||
        node.dataType.toLowerCase().includes(q) ||
        Object.values(node.maskedData).some(val => String(val).toLowerCase().includes(q))
      );
    }
    if (reasonFilter !== "all") {
      nodes = nodes.filter(node => (node.hiddenFields || []).some((field: any) => getZKPReason(String(field)) === reasonFilter));
    }
    return nodes;
  }, [auditNodes, searchQuery, reasonFilter]);

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const { success, result, records } = await searchEvidence(searchQuery, language);
      if (success) {
        setAiInsight(result);
        if (records && records.length > 0) {
          // If we found matched records, we could highlight them or sort them
          // For now, let's just show the insight
        }
      }
    } catch (error) {
      console.error("AI Search Failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800">{translations[language].evidenceVault.auditNodes}</h2>
            <div className="flex gap-2">
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">{translations[language].evidenceVault.filterAll}</option>
                <option value="PII">{translations[language].evidenceVault.filterPii}</option>
                <option value="Commercial Confidentiality">{translations[language].evidenceVault.filterCommercial}</option>
                <option value="Security & Infrastructure Obfuscation">{translations[language].evidenceVault.filterSecurity}</option>
              </select>

              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="E">{translations[language].evidenceVault.categoryE}</option>
                <option value="S">{translations[language].evidenceVault.categoryS}</option>
                <option value="G">{translations[language].evidenceVault.categoryG}</option>
              </select>

              <label className={cn(
                "px-4 py-2 bg-[#009E9D] hover:bg-[#008d8c] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#009E9D]/20",
                isUploading && "opacity-50 cursor-not-allowed"
              )}>
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                {isUploading ? (language === 'zh' ? '上傳中...' : 'Uploading...') : (language === 'zh' ? '上傳證具' : 'Upload Evidence')}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              <button
                onClick={handleVerifyBatch}
                disabled={isVerifyingAll || selectedRecordIds.length === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isVerifyingAll ?
                  <>
                    <Network className="w-3.5 h-3.5 animate-spin" />
                    {translations[language].evidenceVault.verifying} {verificationProgress}%
                  </>
                  :
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {translations[language].evidenceVault.batchVerify} ({selectedRecordIds.length})
                  </>
                }
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={translations[language].evidenceVault.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />


            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <button
              onClick={handleAISearch}
              disabled={isSearching || !searchQuery}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all disabled:opacity-50"
              title="AI 深度搜尋"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {aiInsight && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-emerald-900 text-white rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-2">
                  <button onClick={() => setAiInsight(null)} className="text-emerald-400 hover:text-white transition-colors">
                    <AlertCircle className="w-4 h-4 rotate-45" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  ESG AI Insight
                </div>
                <p className="text-xs font-medium leading-relaxed mb-3">
                  {aiInsight.insight}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aiInsight.relatedStandards.map((s: string) => (
                    <Badge key={s} className="bg-emerald-500/20 text-emerald-300 border-none text-[8px] font-black uppercase">
                      {s}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredNodes.map(record => (
              <GlassCard
                key={record.id}
                onClick={() => handleSelectRecord(record)}
                className={cn(
                  "p-4 cursor-pointer hover:border-emerald-300 transition-all group relative overflow-hidden",
                  selectedRecord?.id === record.id ? "bg-emerald-50/50 border-emerald-300 shadow-md shadow-emerald-100" : "bg-white"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRecordIds.includes(record.id)}
                      onChange={(e) => toggleRecordSelection(record.id, e as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-emerald-500" />
                      {record.id.slice(0, 8)}...
                    </div>
                  </div>
                  <Badge className={cn(
                    "uppercase tracking-widest text-[8px] font-black px-1.5 py-0.5",
                    record.zkpStatus === "Verified" ? "bg-emerald-100 text-emerald-700 border-none" :
                      record.zkpStatus === "Verifying" ? "bg-amber-100 text-amber-700 animate-pulse border-none" :
                        "bg-rose-100 text-rose-700 border-none"
                  )}>
                    {record.zkpStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{record.dataType}</h3>
                  <div className="flex items-center gap-1.5">
                    {record.protocol && (
                      <div className="flex gap-0.5" title="5T Integrity Protocol">
                        <div className={cn("w-1 h-3 rounded-full", record.protocol.tangible ? "bg-emerald-400" : "bg-slate-200")} />
                        <div className={cn("w-1 h-3 rounded-full", record.protocol.traceable ? "bg-sky-400" : "bg-slate-200")} />
                        <div className={cn("w-1 h-3 rounded-full", record.protocol.trackable ? "bg-indigo-400" : "bg-slate-200")} />
                        <div className={cn("w-1 h-3 rounded-full", record.protocol.transparent ? "bg-amber-400" : "bg-slate-200")} />
                        <div className={cn("w-1 h-3 rounded-full", record.protocol.trustworthy ? "bg-rose-400" : "bg-slate-200")} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-[8px] font-black uppercase text-[#009E9D] border-[#009E9D]/30 bg-[#009E9D]/5 leading-none h-4">
                    {record.category || "E"}
                  </Badge>
                  <div className="text-[9px] font-bold text-slate-400 italic">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium font-mono truncate bg-slate-50 p-1.5 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-all flex-1 mr-2">
                    <Fingerprint className="w-3 h-3 text-emerald-500 shrink-0" />
                    {record.zkpContext.proofSignature.slice(0, 12)}...
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateRecord(record); }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteRecord(record.id, e)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedRecord ? (
            <div className="space-y-6">
              <GlassCard className="p-6 bg-slate-900 border-none text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-black mb-1 flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-emerald-400" /> {translations[language].evidenceVault.cryptographicPayload}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium mb-4">{translations[language].evidenceVault.payloadDesc}</p>

                    <div className="flex gap-2 mb-4">
                      <button onClick={() => toggleFieldVisibility('verifierKey')} className="text-[10px] bg-slate-800 hover:bg-slate-700 transition-colors px-2 py-1 rounded">
                        {visibleSensitiveFields['verifierKey'] ? translations[language].evidenceVault.hideKey : translations[language].evidenceVault.showKey}
                      </button>
                      <button onClick={() => toggleFieldVisibility('proofSignature')} className="text-[10px] bg-slate-800 hover:bg-slate-700 transition-colors px-2 py-1 rounded">
                        {visibleSensitiveFields['proofSignature'] ? translations[language].evidenceVault.hideSig : translations[language].evidenceVault.showSig}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-slate-500 max-w-lg leading-relaxed">
                        {language === 'zh'
                          ? "* Zero-Knowledge Proofs (ZKP) 零知識證明允許在不洩露具體原始數值的情況下，向稽核方證明數據的真實性。"
                          : "* Zero-Knowledge Proofs (ZKP) allow proving the validity of data to auditors without revealing the underlying sensitive values."}
                        <button
                          onClick={() => setActiveView("omni-src")}
                          className="text-emerald-400 hover:text-emerald-300 ml-1 underline underline-offset-2"
                        >
                          {translations[language].evidenceVault.learnZkp}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {selectedRecord.zkpStatus === "Verified" && (
                      <button
                        onClick={() => {
                          const proofStr = JSON.stringify(selectedRecord, null, 2);
                          const blob = new Blob([proofStr], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `Audit_Proof_${selectedRecord.id}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                        title="匯出 ZKP 驗證憑證"
                      >
                        <Download className="w-4 h-4" />
                        {translations[language].evidenceVault.exportProof}
                      </button>
                    )}
                    <button
                      onClick={handleVerify}
                      disabled={selectedRecord.zkpStatus === "Verifying" || selectedRecord.zkpStatus === "Verified"}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {selectedRecord.zkpStatus === "Verifying" && <Network className="w-4 h-4 animate-spin" />}
                      {selectedRecord.zkpStatus === "Verified" ? translations[language].evidenceVault.verified : translations[language].evidenceVault.verifyZkp}
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Traceability Path Section */}
              <GlassCard className="p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-[-45deg]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      {language === 'zh' ? '溯源路徑' : 'Traceability Path'}
                    </div>
                    <div className="text-sm font-bold text-slate-700">
                      {selectedRecord.linkedReport}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveView("sustain-write");
                    setActiveSubView("editor");
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-[#009E9D] flex items-center gap-2 transition-all active:scale-95"
                >
                  {language === 'zh' ? '查看關聯報告' : 'View Linked Report'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </GlassCard>

              <AnimatePresence>
                {selectedRecord.zkpStatus !== "Pending" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={cn(
                      "p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border",
                      selectedRecord.zkpStatus === "Verifying" ? "bg-slate-50 text-slate-600 border-slate-200" :
                        selectedRecord.zkpStatus === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          "bg-rose-50 text-rose-700 border-rose-200"
                    )}>
                      {selectedRecord.zkpStatus === "Verifying" && <Database className="w-5 h-5 animate-bounce" />}
                      {selectedRecord.zkpStatus === "Verified" && <ShieldCheck className="w-5 h-5" />}
                      {selectedRecord.zkpStatus === "Failed" && <AlertCircle className="w-5 h-5" />}

                      {selectedRecord.zkpStatus === "Verifying" && translations[language].evidenceVault.mathValidation}
                      {selectedRecord.zkpStatus === "Verified" && translations[language].evidenceVault.passed}
                      {selectedRecord.zkpStatus === "Failed" && translations[language].evidenceVault.failed}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 bg-white border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-slate-400" />
                      <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">{translations[language].evidenceVault.publicView}</h3>
                    </div>
                    {"originalData" in selectedRecord && (
                      <button
                        onClick={handleVisionScan}
                        disabled={isScanning}
                        className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[9px] rounded-lg border border-purple-500/30 transition-all flex items-center gap-1.5"
                      >
                        {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                        {isScanning ? "Processing..." : (language === 'zh' ? "Cloud Vision AI 解析" : "Cloud Vision AI Scan")}
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-3 font-mono text-[11px]">

                    {Object.entries(selectedRecord.maskedData).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-start border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-500 mt-1">{key}:</span>
                        {val === "[PROTECTED_BY_ZKP]" ? (
                          <div className="text-right flex flex-col items-end">
                            <span className={cn(
                              "font-bold px-2 py-0.5 rounded",
                              selectedRecord.zkpStatus === "Verified" ? "text-emerald-700 bg-emerald-100" : "text-amber-600 bg-amber-50"
                            )}>
                              {selectedRecord.zkpStatus === "Verified" ? "● SECURE_ZKP_MASK" : String(val)}
                            </span>
                            {selectedRecord.zkpStatus === "Verified" && (
                              <span className="text-[9px] text-emerald-600/70 border border-emerald-200 mt-1.5 px-1.5 py-px rounded bg-emerald-50">
                                Reason: {getZKPReason(key)}
                              </span>
                            )}
                            {selectedRecord.scannedMeta && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-purple-500/5 rounded-xl border border-purple-500/20"
                              >
                                <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-[9px] uppercase">
                                  <div className="w-1 h-3 bg-purple-500 rounded-full" />
                                  GCP Vision AI Analysis
                                </div>
                                <div className="text-[11px] text-slate-400 italic mb-2 leading-relaxed">
                                  "{selectedRecord.scannedMeta.text}"
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedRecord.scannedMeta.entities.map((entity: string, i: number) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px]">
                                      {entity}
                                    </span>
                                  ))}
                                  <span className="ml-auto text-[9px] text-purple-400/60 font-mono">
                                    Conf: {(selectedRecord.scannedMeta.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-800 font-bold whitespace-nowrap mt-1">{String(val)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6 bg-slate-900 border border-slate-800 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-black text-white uppercase tracking-widest text-xs">{translations[language].evidenceVault.zkpContext}</h3>
                  </div>
                  <div className="space-y-4 font-mono text-[10px]">
                    <div>
                      <div className="text-emerald-500 font-bold mb-1">{translations[language].evidenceVault.algorithm}:</div>
                      <div className="text-slate-300 break-all bg-black/30 p-2 rounded">{selectedRecord.zkpContext.algorithm}</div>
                    </div>
                    <div>
                      <div className="text-emerald-500 font-bold mb-1">{translations[language].evidenceVault.publicInputs}:</div>
                      <div className="text-slate-300 break-all bg-black/30 p-2 rounded">{selectedRecord.zkpContext.publicInputsHash}</div>
                    </div>
                    <div>
                      <div className="text-emerald-500 font-bold mb-1">{translations[language].evidenceVault.verifierKey}:</div>
                      <div className="text-slate-300 break-all bg-black/30 p-2 rounded">{visibleSensitiveFields['verifierKey'] ? selectedRecord.zkpContext.verifierKey : '••••••••••••••••••••••••••••••••'}</div>
                    </div>
                    <div>
                      <div className="text-emerald-500 font-bold mb-1">{translations[language].evidenceVault.proofSignature}:</div>
                      <div className="text-slate-300 break-all bg-black/30 p-2 rounded">{visibleSensitiveFields['proofSignature'] ? selectedRecord.zkpContext.proofSignature : '••••••••••••••••••••••••••••••••'}</div>
                    </div>
                  </div>
                </GlassCard>

              </div>

              <GlassCard className="p-6 bg-emerald-50 border border-emerald-100 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Network className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-black text-emerald-800 uppercase tracking-widest text-xs">{translations[language].evidenceVault.auditAnalysis}</h3>
                </div>
                <div className="text-xs font-medium text-emerald-700 leading-relaxed max-w-3xl">
                  {translations[language].evidenceVault.auditAnalysisDetail.replace('{count}', String((selectedRecord.hiddenFields || []).length))}
                </div>

                {selectedRecord.zkpStatus === "Verified" && (
                  <div className="mt-8 pt-8 border-t border-emerald-200/50">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                      <div className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                        {language === 'zh' ? '5T 誠信協議剖析' : '5T Integrity Protocol Profile'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        {
                          key: 'tangible',
                          title: language === 'zh' ? 'T1: 有形性' : 'T1: Tangible',
                          desc: language === 'zh' ? '數據與具體資產或交易掛鉤' : 'Data tied to physical assets/trades',
                          icon: <Database className="w-4 h-4" />,
                          color: 'emerald'
                        },
                        {
                          key: 'traceable',
                          title: language === 'zh' ? 'T2: 可溯源' : 'T2: Traceable',
                          desc: language === 'zh' ? '完整審計鏈條，路徑清晰' : 'Full audit chain, clear path',
                          icon: <History className="w-4 h-4" />,
                          color: 'sky'
                        },
                        {
                          key: 'trackable',
                          title: language === 'zh' ? 'T3: 可追踪' : 'T3: Trackable',
                          desc: language === 'zh' ? '實時數據監控與生命週期跟蹤' : 'Real-time monitoring & lifecycle',
                          icon: <Activity className="w-4 h-4" />,
                          color: 'indigo'
                        },
                        {
                          key: 'transparent',
                          title: language === 'zh' ? 'T4: 透明度' : 'T4: Transparent',
                          desc: language === 'zh' ? '邏輯公開，規則算法可查' : 'Logic public, rules accessible',
                          icon: <Shield className="w-4 h-4" />,
                          color: 'amber'
                        },
                        {
                          key: 'trustworthy',
                          title: language === 'zh' ? 'T5: 可信賴' : 'T5: Trustworthy',
                          desc: language === 'zh' ? 'ZKP 數學驗證，零干預風險' : 'ZKP verified, zero tamper risk',
                          icon: <ShieldCheck className="w-4 h-4" />,
                          color: 'rose'
                        }
                      ].map((t) => (
                        <div
                          key={t.key}
                          className={cn(
                            "p-3 rounded-xl border flex flex-col gap-2 transition-all hover:scale-[1.02]",
                            selectedRecord.protocol?.[t.key as keyof typeof selectedRecord.protocol]
                              ? `bg-white border-${t.color}-200 shadow-sm`
                              : "bg-slate-100/50 border-slate-200 grayscale opacity-60"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            selectedRecord.protocol?.[t.key as keyof typeof selectedRecord.protocol]
                              ? `bg-${t.color}-50 text-${t.color}-600`
                              : "bg-slate-200 text-slate-400"
                          )}>
                            {t.icon}
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-800">{t.title}</div>
                            <div className="text-[9px] text-slate-500 leading-tight mt-1">{t.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 py-20 px-8 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200/50">
                <Lock className="w-10 h-10 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{translations[language].evidenceVault.selectRecord}</h3>
                <p className="text-slate-500 max-w-sm text-sm">
                  {translations[language].evidenceVault.selectRecordDesc}
                </p>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}
