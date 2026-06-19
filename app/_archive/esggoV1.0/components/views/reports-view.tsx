"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
const EnterpriseReportHub = dynamic(() => import("@/components/views/archive/enterprise-report-hub"), {
  ssr: false,
  loading: () => <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin opacity-50" /></div>
});
import {
  Wand2,
  Grid,
  Archive,
  Globe,
  Play,
  PenTool,
  ShieldCheck,
  Lock,
  Send,
  Database,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Sparkles,
  Save,
  Activity,
  FileText,
  AlertCircle,
  Download,
  Search,
  Filter,
  Zap,
  BookOpen
} from "lucide-react";
import React from "react";
import { useAppContext } from "@/lib/context/app-context";
import { OmniStat } from "@/components/omni-terminal/omni-stat";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { OmniTable } from "@/components/omni-terminal/omni-table";
import { FirestoreService } from "@/lib/services/firestore-service";
import { INcbReport } from "@/lib/types/ncb-types";
import { toast } from "sonner";


export function ReportsView() {
  const { lang, user, authLoading } = useAppContext();
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [reports, setReports] = useState<INcbReport[]>([]);
  const [loading, setLoading] = useState(true);

  // 使用 useSyncExternalStore 完美取代 useEffect 來判定 Client-side 是否已掛載
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => { }, []), // empty subscribe
    () => true,  // getSnapshot: 在 Client side 會回傳 true
    () => false  // getServerSnapshot: 在 Server side 會回傳 false
  );

  useEffect(() => {
    async function loadReports() {
      if (user?.uid) {
        setLoading(true);
        try {
          const data = await FirestoreService.loadUserReports(user.uid);
          setReports(data);
        } catch (error) {
          console.error("Failed to load user reports:", error);
          toast.error("讀取報告失敗，請確認您的網路連線或稍後再試。");
        } finally {
          setLoading(false);
        }
      }
    }
    if (mounted && !authLoading) {
      loadReports();
    }
  }, [user, authLoading, mounted]);

  // Derived Stats
  const sealedCount = (reports || []).filter(r => r?.status === "Sealed").length;
  const auditPending = (reports || []).filter(r => r?.status === "Verified").length;
  const inProgress = (reports || []).filter(r => r?.status === "In Progress" || r?.status === "draft").length;
  const avgCompletion = (reports?.length || 0) > 0
    ? Math.round(reports.reduce((acc, r) => acc + (typeof r.report_data?.completion === 'number' ? r.report_data.completion : 0), 0) / (reports?.length || 1))
    : 0;

  const handleDownload = (report: INcbReport) => {
    toast.info(`Initiating Download for ${report.title}`, {
      description: "Generating authenticated PDF via 5T Transmission Protocol..."
    });
    // In a real app, this would trigger the Cloud Function downloader
  };

  const handleView = (report: INcbReport) => {
    toast.success(`Opening ${report.title}`, {
      description: `Manifest Hash: ${report.metadata?.hash || 'Pending Calculation'}`
    });
  };

  if (!mounted) return null;

  if (isWizardActive) {
    return (
      <div className="flex flex-col gap-6 -mt-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <OmniBadge label="企業合規模式" status="optimal" dot />
            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Enterprise Compliance Hub</span>
          </div>
          <button
            onClick={() => setIsWizardActive(false)}
            className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-2"
          >
            <Archive className="w-3 h-3" /> 返回列表
          </button>
        </div>
        <EnterpriseReportHub />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-32">
      {/* 1. Welcoming Hero & Primary Action */}
      <section className="relative group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 pt-16 pb-8">
          <div className="flex flex-col gap-6 max-w-2xl relative z-10">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-black text-emerald-700 uppercase tracking-[0.3em] font-sans">
                ESG Studio | Premium Workspace
              </div>
            </div>
            <h1 className="text-7xl font-headline font-black text-on-surface tracking-tighter leading-[0.95] mb-4">
              Welcome back.<br />
              <span className="text-primary italic font-serif">Continue your ESG journey.</span>
            </h1>
            <p className="text-xl font-medium text-on-surface-variant leading-relaxed opacity-80 max-w-lg">
              Empowering your organization with transparent, GRI-compliant sustainability reporting through high-fidelity AI-assisted orchestration.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => setIsWizardActive(true)}
              className="group relative flex flex-col items-center justify-center w-56 h-56 rounded-full bg-primary text-on-primary shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-700"
            >
              <div className="absolute inset-2 border-2 border-dashed border-on-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
              <Sparkles className="w-12 h-12 mb-4 group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-[14px] font-black uppercase tracking-[0.2em]">Start New Report</span>
              <div className="mt-2 w-8 h-1 bg-on-primary/30 rounded-full" />
            </button>
          </div>
        </div>

        {/* Soft Background Accents */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* 2. Insight Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Journeys", value: inProgress, icon: <Activity />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Audited Manifests", value: sealedCount, icon: <ShieldCheck />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Compliance Index", value: `${avgCompletion || 98}%`, icon: <Zap />, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <div key={i} className={cn("p-10 rounded-[40px] border border-outline-variant/50 flex flex-col gap-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500")}>
            <div className="flex items-center justify-between">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", stat.bg, stat.color)}>
                {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <span className="text-[12px] font-black text-on-surface-variant/40 uppercase tracking-widest leading-none">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-black text-on-surface">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Recent Journeys Grid (Replacing Table) */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b border-outline-variant/30 pb-8">
          <div className="space-y-2">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] font-sans px-1 border-l-4 border-primary">Recent Journeys</h2>
            <p className="text-2xl font-headline font-black text-on-surface">Your Ongoing Disclosures</p>
          </div>
          <button className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            View All Reports <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] rounded-[48px] bg-surface-container-low animate-pulse border border-outline-variant/30" />
              ))
            ) : reports.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-outline-variant/50 rounded-[48px] bg-surface-container-lowest">
                <p className="text-lg font-headline font-bold text-on-surface-variant">No active journeys found.</p>
                <p className="text-sm text-on-surface-variant opacity-60">Ready to start your first sustainability story?</p>
              </div>
            ) : (
              reports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group block rounded-[48px] bg-white border border-outline-variant/50 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-700"
                >
                  <div className="p-10 space-y-8 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          report.status === "Sealed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>
                          {report.status}
                        </div>
                        <span className="text-[10px] font-mono text-on-surface-variant opacity-40">#{report.id.slice(-6).toUpperCase()}</span>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-3xl font-headline font-black text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors duration-500">
                          {report.title}
                        </h3>
                        <p className="text-sm font-medium text-on-surface-variant opacity-60 italic">
                          Modified on {new Date(report.metadata?.timestamp || 0).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                          <span>Progress</span>
                          <span className="text-on-surface">{report.report_data?.completion || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden border border-outline-variant/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${report.report_data?.completion || 0}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
                        <button
                          onClick={() => handleView(report)}
                          className="flex-1 h-12 rounded-2xl bg-on-surface text-surface text-[11px] font-black uppercase tracking-widest hover:bg-on-surface/90 transition-all active:scale-95"
                        >
                          Continue
                        </button>
                        <button
                          onClick={() => handleDownload(report)}
                          className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center hover:bg-white hover:border-primary/40 transition-all"
                        >
                          <Download size={18} className="text-on-surface-variant" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Guided Resources / Secondary Action */}
      <section className="bg-surface-container-highest p-12 rounded-[64px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/20 transition-colors duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-5xl font-headline font-black text-on-surface tracking-tighter leading-none">Need guidance on <span className="text-primary italic font-serif">GRI 2024</span>?</h2>
            <p className="text-lg font-medium text-on-surface-variant opacity-80 max-w-xl">
              Our AI Consultants are ready to help you navigate the latest sustainability disclosure requirements. Explore our resource library or start a specialized audit journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-2xl bg-white text-on-surface border border-outline-variant font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
                Download GRI Handbook
              </button>
              <button className="px-8 py-4 rounded-2xl bg-on-surface text-surface font-black text-[11px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all">
                Speak with an AI Auditor
              </button>
            </div>
          </div>
          <div className="w-full md:w-80 h-48 rounded-[48px] bg-white border border-outline-variant/50 shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-50" />
            <BookOpen size={64} className="text-primary opacity-20" />
          </div>
        </div>
      </section>
    </div>
  );
}
