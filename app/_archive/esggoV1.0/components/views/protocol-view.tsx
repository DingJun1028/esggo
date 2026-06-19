"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ServiceExplanationCard } from "@/components/ui/service-explanation-card";
import { ZKPMask } from "@/components/ui/zkp-mask";
import {
  ShieldCheck,
  Eye,
  Link,
  Activity,
  Code,
  Lock,
  Grid,
  X,
  Database,
  FileCheck,
  Server,
  BrainCircuit,
  Network,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/lib/context/app-context";
import { useAuditTrailListener } from "@/hooks/use-audit-listener";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PROTOCOLS = [
  {
    id: "Traceable",
    name: "真 (Truthful)",
    desc: "確保每筆數據皆有清晰的原始起點與負責人。",
    icon: Link,
    color: "text-stitch-teal-start",
    bg: "bg-stitch-teal-start/10",
  },
  {
    id: "Transparent",
    name: "善 (Thankful)",
    desc: "算法透明，符合 ISO-14064-1 等國際標準。",
    icon: Code,
    color: "text-stitch-teal-start",
    bg: "bg-stitch-teal-start/10",
  },
  {
    id: "Tangible",
    name: "美 (Tasteful)",
    desc: "數據指標可視化，提供沉浸式的操作體驗。",
    icon: Eye,
    color: "text-stitch-teal-start",
    bg: "bg-stitch-teal-start/10",
  },
  {
    id: "Trustworthy",
    name: "信 (Trustful)",
    desc: "核心禁區：Hash Lock。寫入即刻封印，不可篡改。",
    icon: Lock,
    color: "text-stitch-teal-start",
    bg: "bg-stitch-teal-start/10",
  },
  {
    id: "Trackable",
    name: "通 (Transferful)",
    desc: "實作生命週期 Hook 紀錄流轉路徑。",
    icon: Activity,
    color: "text-stitch-teal-start",
    bg: "bg-stitch-teal-start/10",
  },
];

const MECE_SERVICES = [
  {
    name: "碳足跡盤查 (Scope 1,2,3)",
    desc: "直接排放與能源間接排放、其他間接排放的全面盤查，符合國際認證數據收集原則。",
    docs: ["ISO 14064-1", "GHG Protocol", "EPA Guidelines"]
  },
  {
    name: "能源管理與效能服務",
    desc: "能源監控與自動化系統設備導入，優化能源消耗並提供節能診斷分析。",
    docs: ["ISO 50001", "ASHRAE Standards"]
  },
  {
    name: "水資源風險評估",
    desc: "評估企業對水資源的依賴程度與回收率，建立預警指標與循環再利用方案。",
    docs: ["ISO 14046", "WRI Aqueduct"]
  },
  {
    name: "廢棄物循環與管理",
    desc: "針對廢棄物產量、分類與回收流程，提供符合循環經濟規範的管理機制。",
    docs: ["ISO 14001", "GRI 306"]
  },
];

export function ProtocolView() {
  const { setActiveTab } = useAppContext();
  const [isMeceOpen, setIsMeceOpen] = useState(false);
  const [selectedMeceService, setSelectedMeceService] = useState<typeof MECE_SERVICES[0] | null>(null);

  // Archival State
  const [auditId, setAuditId] = useState<string | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Listen for archival completion
  const { status } = useAuditTrailListener(auditId);

  const handleArchive = async () => {
    setIsArchiving(true);
    setAuditId(null); // Reset

    try {
      const res = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "企業年度永續發展報告 (Omni_Terminal v4.3)",
          metrics: {
            scope1Emissions: 1240.5,
            scope2Emissions: 850.2,
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAuditId(data.auditId);
        toast.info("歸檔程序已啟動", {
          description: "正在生成 5T 存證報告與 PDF 封印..."
        });
      } else {
        toast.error("歸檔初始化失敗");
        setIsArchiving(false);
      }
    } catch (error) {
      toast.error("網路通訊錯誤");
      setIsArchiving(false);
    }
  };

  // Sync isArchiving with status
  useEffect(() => {
    if (status === "SEALED") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsArchiving(false);
    }
  }, [status]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stitch-text tracking-tight">
            5T 協議 & ZKP 審計軌跡
          </h1>
          <p className="text-stitch-muted mt-2 text-sm">
            基於存證中心協議之數據透明度 - 提供原始數據、透明一致與信任之證明
          </p>
        </div>
        <Badge
          variant="optimal"
          styleType="soft"
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-stitch-shallow-gray border-stitch-shallow-gray text-stitch-teal-start"
        >
          <ShieldCheck className="w-5 h-5" />
          System Active
        </Badge>
      </div>

      {/* SRC Section */}
      <GlassCard className="p-8 border-stitch-shallow-gray stitch-glass">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-[12px] bg-stitch-teal-start/10 flex items-center justify-center">
            <Database className="w-7 h-7 text-stitch-teal-start" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stitch-text tracking-tight">
              SRC 永續存證中心 (Sustainable Report Center)
            </h2>
            <p className="text-stitch-muted font-medium text-xs">
              企業級 ESG 數據與報告的不可變動存證核心
            </p>
          </div>
          <button
            onClick={handleArchive}
            disabled={isArchiving}
            className={cn(
              "ml-auto px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-minimal",
              isArchiving
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-stitch-text text-white hover:bg-stitch-teal-start"
            )}
          >
            {isArchiving ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                正在歸檔簽署...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                歸檔報告並封印 (Seal)
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-shallow-gray shadow-minimal">
            <Server className="w-6 h-6 text-stitch-teal-start mb-3" />
            <h4 className="text-lg font-bold text-stitch-text mb-2">全球化分散儲存架構</h4>
            <p className="text-xs text-stitch-muted leading-relaxed">
              利用高可用性分散式節點，確保 ESG 原始數據、變更日誌、報告與存證文件永久存儲且不可丟失。
            </p>
          </div>
          <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-shallow-gray shadow-minimal">
            <Lock className="w-6 h-6 text-stitch-teal-start mb-3" />
            <h4 className="text-lg font-bold text-stitch-text mb-2">零信任加密傳輸隱私</h4>
            <p className="text-xs text-stitch-muted leading-relaxed">
              所有傳入 SRC 的數據均經過 AES-256 加密，並搭配動態 RBAC 權限控管機制，防止企業機敏洩漏。
            </p>
          </div>
          <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-shallow-gray shadow-minimal">
            <FileCheck className="w-6 h-6 text-stitch-teal-start mb-3" />
            <h4 className="text-lg font-bold text-stitch-text mb-2">全方位自動化審計線索</h4>
            <p className="text-xs text-stitch-muted leading-relaxed">
              與 5T 協議深度結合，記錄任何數據的存取、修改或調整歷史，生成不可篡改的審計日誌 (Audit Trail)。
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* MECE Matrix Card */}
        <ServiceExplanationCard
          title="MECE Matrix"
          description="自動矩陣生成技術。透過 OmniAPI 映射至 MECE 矩陣，並對應至 FSC 97 與 SASB 規範。"
          icon={<Grid className="w-6 h-6" />}
          stats={{
            label: "OmniAPI 狀態", value: "Active", unit: ""
          }}
          features={["FSC 97 掃描", "SASB 映射", "自動映射"]}
          color="var(--color-stitch-teal-start)"
          actionText="查看解析矩陣"
          onAction={() => setIsMeceOpen(true)}
        />

        {PROTOCOLS.map((p, i) => (
          <ServiceExplanationCard
            key={i}
            title={`${p.name} (${p.id})`}
            description={
              (p.id === "Tangible" || p.id === "Trustworthy") ? (
                <ZKPMask label="Sensitive Protocol Data">
                  {p.desc}
                </ZKPMask>
              ) : (
                p.desc
              )
            }
            icon={<p.icon className="w-6 h-6" />}
            stats={{
              label: "協議狀態", value: "Verified", unit: ""
            }}
            features={["5T 協議", "自動驗證", "證書核發"]}
            color="var(--color-stitch-teal-start)"
          />
        ))}
      </div>

      <GlassCard className="p-8 border-stitch-shallow-gray stitch-glass">
        <h2 className="text-2xl font-bold text-stitch-text mb-6 flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-stitch-teal-start" />
          Evolutionary Levels: Skill Tree (L0 - L3)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { level: "L0", name: "Raw Data", desc: "原始數據採集", color: "text-stitch-muted/40", bg: "bg-stitch-shallow-gray" },
            { level: "L1", name: "Structured", desc: "結構化與標準化", color: "text-stitch-muted/40", bg: "bg-stitch-shallow-gray" },
            { level: "L2", name: "Traceable", desc: "溯源軌跡鏈結", color: "text-stitch-muted/40", bg: "bg-stitch-shallow-gray" },
            { level: "L3", name: "Validated", desc: "5T 協議深度認證", color: "text-stitch-teal-start", bg: "bg-stitch-teal-start/10 border-stitch-teal-start/30 shadow-minimal" },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-[12px] border border-stitch-shallow-gray ${item.bg} flex flex-col items-center text-center group hover:shadow-minimal transition-all stitch-glass`}>
              <span className={`text-2xl font-black ${item.color} mb-1 group-hover:scale-110 transition-transform`}>{item.level}</span>
              <span className="text-[10px] font-bold text-stitch-text uppercase tracking-widest">{item.name}</span>
              <span className="text-[8px] font-bold text-stitch-muted mt-1 uppercase tracking-widest">{item.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-8 border-stitch-shallow-gray stitch-glass">
        <h2 className="text-2xl font-bold text-stitch-text mb-6">
          核心哲學：真善美信通 (5T Protocol Philosophy)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              char: "真",
              eng: "Truthful",
              desc1: "Traceable (可溯源)",
              desc2: "源頭清洗，職責分明",
              color: "text-stitch-teal-start",
            },
            {
              char: "善",
              eng: "Thankful",
              desc1: "Transparent (可透明)",
              desc2: "公式公開，排除幻覺",
              color: "text-stitch-teal-start",
            },
            {
              char: "美",
              eng: "Tasteful",
              desc1: "Tangible (可感知)",
              desc2: "液態玻璃，動態回饋",
              color: "text-stitch-teal-start",
            },
            {
              char: "信",
              eng: "Trustful",
              desc1: "Trustworthy (不可篡改)",
              desc2: "Hash Lock, 寫入即封印",
              color: "text-stitch-teal-start",
            },
            {
              char: "通",
              eng: "Transferful",
              desc1: "Trackable (可追蹤)",
              desc2: "Hook 紀錄，鏈式傳遞",
              color: "text-stitch-teal-start",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-stitch-shallow-gray border border-stitch-shallow-gray rounded-[8px] p-6 hover:bg-stitch-shallow-gray/80 transition-colors duration-150 flex flex-col stitch-glass"
            >
              <h4 className={`text-3xl font-bold ${item.color} mb-1`}>
                {item.char}
              </h4>
              <p className="text-lg font-bold text-stitch-text mb-3">
                {item.eng}
              </p>
              <p className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mb-2">
                {item.desc1}
              </p>
              <div className="text-[8px] font-bold text-stitch-muted/60 uppercase tracking-widest">
                {(item.eng === "Tasteful" || item.eng === "Trustful") ? (
                  <ZKPMask label="ZKP Security">
                    {item.desc2}
                  </ZKPMask>
                ) : (
                  item.desc2
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* MECE Matrix Modal */}
      <AnimatePresence>
        {
          isMeceOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsMeceOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[24px] overflow-hidden flex flex-col max-h-[90vh] border border-stitch-border shadow-minimal"
              >
                <div className="p-6 border-b border-stitch-border flex items-center justify-between bg-stitch-shallow-gray">
                  <div className="flex items-center gap-3">
                    {selectedMeceService ? (
                      <button
                        onClick={() => setSelectedMeceService(null)}
                        className="w-10 h-10 rounded-[8px] bg-white border border-stitch-border flex items-center justify-center hover:bg-stitch-shallow-gray transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-stitch-muted rotate-180" />
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-[8px] bg-stitch-teal-start/10 flex items-center justify-center">
                        <Grid className="w-5 h-5 text-stitch-teal-start" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-stitch-text">
                        {selectedMeceService ? selectedMeceService.name : "MECE Matrix"}
                      </h2>
                      <p className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest">
                        {selectedMeceService ? "Technical Details & Documentation" : "OmniAPI 持續盤查功能"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMeceOpen(false);
                      setTimeout(() => setSelectedMeceService(null), 300);
                    }}
                    className="p-2 hover:bg-stitch-shallow-gray rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-stitch-muted" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto bg-transparent">
                  <AnimatePresence mode="wait">
                    {selectedMeceService ? (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-shallow-gray shadow-minimal">
                          <h3 className="text-[10px] font-bold text-stitch-teal-start mb-3 flex items-center gap-2 uppercase tracking-widest">
                            <Activity className="w-3 h-3" />
                            Service Description
                          </h3>
                          <p className="text-xs text-stitch-muted leading-relaxed">
                            {selectedMeceService.desc}
                          </p>
                        </div>

                        <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-border shadow-minimal">
                          <h3 className="text-[10px] font-bold text-stitch-teal-start mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <FileCheck className="w-3 h-3" />
                            Associated Documentation & Standards
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {selectedMeceService.docs.map((doc, idx) => (
                              <Badge key={idx} variant="optimal" className="px-3 py-1.5 bg-white text-stitch-text border-stitch-border text-[10px] font-bold uppercase tracking-widest">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border border-stitch-border shadow-minimal">
                          <h3 className="text-[10px] font-bold text-stitch-teal-start mb-3 flex items-center gap-2 uppercase tracking-widest">
                            <Code className="w-3 h-3" />
                            OmniAPI Integration
                          </h3>
                          <div className="bg-stitch-text rounded-[8px] p-4 font-mono text-xs text-white/80 overflow-x-auto border border-stitch-text">
                            <div className="flex gap-2 mb-2">
                              <span className="text-stitch-teal-start font-bold uppercase tracking-widest text-[10px]">POST</span>
                              <span className="text-white/40">/api/v1/mece/analyze</span>
                            </div>
                            <pre className="text-white/80">
                              {`{
  "service": "${selectedMeceService.name}",
  "protocol": "5T-Strict",
  "data_source": "src_vault_ref_88291"
}`}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        {MECE_SERVICES.map((service, i) => {
                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedMeceService(service)}
                              key={i}
                              className="p-4 rounded-[12px] border border-stitch-shallow-gray flex flex-col justify-center items-center text-center h-24 hover:shadow-minimal transition-all bg-stitch-shallow-gray hover:bg-stitch-shallow-gray/80 cursor-pointer group"
                            >
                              <span className="text-[8px] font-bold text-stitch-muted/40 mb-1 uppercase tracking-widest">
                                MECE - {i + 1}
                              </span>
                              <span className="text-[10px] font-bold text-stitch-text uppercase tracking-widest group-hover:text-stitch-teal-start transition-colors">
                                {service.name}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )
        }
      </AnimatePresence >
    </div >
  );
}
