"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { OmniStat } from "@/components/omni-terminal/omni-stat";
import { useWizardSession } from "@/hooks/use-wizard-session";
import { FirestoreService } from "@/lib/services/firestore-service";
import {
  UploadCloud,
  Database,
  FileOutput,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  Clock,
  Zap,
  Target,
  Users,
  Activity,
  Sparkles
} from "lucide-react";
import { OmniTrinityShield } from "@/components/ui/omni-trinity-shield";
import { createOmniHeart } from "@/lib/omni-heart";

const SME_MODULES = [
  {
    id: "input-center",
    title: "Input_Center",
    desc: "Automated ESG data ingestion with AI OCR support and high-performance CSV batch processing.",
    icon: UploadCloud,
    status: "Active",
    stats: "12_NODES_UP"
  },
  {
    id: "record-center",
    title: "Record_Center",
    desc: "Blockchain-anchored record center ensuring 5T protocol integrity and absolute audit transparency.",
    icon: Database,
    status: "Active",
    stats: "1.2k_ENTRIES"
  },
  {
    id: "output-studio",
    title: "Output_Studio",
    desc: "One-click generation of audit-ready ESG drafts compliant with GRI, SASB, and IFRS standards.",
    icon: FileOutput,
    status: "Ready",
    stats: "3_FORMATS"
  },
  {
    id: "reporting-dashboard",
    title: "Telemetry_Hub",
    desc: "Real-time monitoring of carbon footprint and social responsibility metrics with AI trend forecasting.",
    icon: LayoutDashboard,
    status: "Active",
    stats: "SYNCING..."
  },
  {
    id: "5t-badge-center",
    title: "Trust_Vault",
    desc: "Display of certified 5T integrity badges and blockchain-anchored credibility certificates.",
    icon: ShieldCheck,
    status: "New",
    stats: "2_AWARDS"
  }
];

export function SmeDashboardView() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { session: activeSession } = useWizardSession();
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecentData() {
      try {
        const reports = await FirestoreService.loadSealedReports("user-123");
        setRecentReports(reports.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    }
    fetchRecentData();
  }, []);

  const completedChaptersCount = Object.keys(activeSession?.chapterProgress || {}).length;
  const progressPercent = (completedChaptersCount / 7) * 100;
  const ratingLabel = completedChaptersCount > 4 ? "Optimal B+" : "Foundational C";

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-minimal">
              <Target size={24} />
            </div>
            <div>
              <OmniBadge label="PROFESSIONAL_PRACTICAL_GRADE" status="optimal" />
              <h1 className="text-3xl font-black text-black tracking-tighter mt-1 uppercase">
                Strategic_Command_Dashboard
              </h1>
            </div>
          </div>
          <p className="text-stone-400 text-sm font-bold leading-relaxed max-w-2xl uppercase opacity-60">
            Tailored for SME digital transformation. Anchored by the 5T Integrity Protocol.
            Ensuring absolute data transparency for global sustainability markets.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-matte-enterprise rounded border border-stone-100">
              <Users size={14} className="text-primary-teal-start" />
              <span className="text-[10px] font-black uppercase">ADMIN: JunAiKey</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-matte-enterprise rounded border border-stone-100">
              <ShieldCheck size={14} className="text-primary-teal-start" />
              <span className="text-[10px] font-black uppercase">CORE_PROTOCOL: v4.3_CHAINED</span>
            </div>
          </div>
        </div>

        <div className="lg:w-80">
          <OmniCard title="Integrity_Pulse" subtitle="DIVINE_TRINITY_SCORE" className="border-primary-teal-start/20 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <OmniTrinityShield
                  size="sm"
                  heart={createOmniHeart(
                    "KnowledgeBase",
                    "EnterpriseStrategy",
                    "Omni_Dashboard_v4.3",
                    activeSession?.lastEditedAt ? activeSession.lastEditedAt : undefined
                  )}
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-black tracking-tighter uppercase">{ratingLabel}</span>
                <Sparkles className="w-4 h-4 text-primary-teal-start animate-pulse" />
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-primary-teal-start"
                />
              </div>
              <div className="text-[8px] font-black text-stone-300 mt-2 uppercase tracking-widest">
                EVOLUTION: {completedChaptersCount} / 7_SEALED
              </div>
            </div>
          </OmniCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OmniStat label="INTEGRITY_COEFFICIENT" value="98.2" unit="%" icon={Zap} trend={{ value: 0.2, label: "STABLE" }} />
        <OmniStat label="CERTIFICATE_NODES" value="8" unit="NODES" icon={Activity} trend={{ value: 2, label: "UP" }} />
        <OmniStat label="CARBON_PROGRESS" value="65" unit="%" icon={UploadCloud} trend={{ value: 5, label: "OPTIMIZING" }} />
        <OmniStat label="MARKET_RANK" value="TOP 15" icon={Target} trend={{ value: 1, label: "RISING" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SME_MODULES.map((mod) => (
          <OmniCard
            key={mod.id}
            title={mod.title}
            subtitle={mod.status}
            className="group"
            onClick={() => setActiveModule(mod.id)}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-matte-enterprise flex items-center justify-center text-primary-teal-start group-hover:bg-black group-hover:text-white transition-all">
                <mod.icon size={24} />
              </div>
              <OmniBadge label={mod.status} status={mod.status === 'Active' ? 'optimal' : mod.status === 'New' ? 'info' : 'neutral'} />
            </div>
            <p className="text-[11px] text-stone-400 font-bold leading-relaxed mb-8 h-12">
              {mod.desc}
            </p>
            <div className="flex items-center justify-between pt-6 border-t border-stone-50">
              <span className="text-[9px] font-black bg-stone-100 px-2 py-1 rounded uppercase">{mod.stats}</span>
              <ArrowRight size={16} className="text-stone-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </div>
          </OmniCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OmniCard title="Audit_Chain_Telemetry" subtitle="REAL-TIME_ZKP_ANCHORING" noPadding>
            <div className="p-4 space-y-4">
              {(recentReports?.length || 0) > 0 ? (
                recentReports.map((report, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-xl hover:bg-matte-enterprise transition-all border border-transparent hover:border-stone-100 group">
                    <div className="w-2 h-2 rounded-full bg-primary-teal-start animate-pulse" />
                    <div className="flex-1">
                      <div className="text-[11px] font-black uppercase">{report.title} <span className="text-stone-300 ml-2">[{report.type}]</span></div>
                      <div className="text-[9px] font-bold text-stone-400 uppercase mt-1">
                        {new Date(report.createdAt).toLocaleString()} | HASH: {report.omniHeart?.A_Tagging?.hash_lock?.slice(-12)}
                      </div>
                    </div>
                    <OmniBadge label="SEALED" status="optimal" />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-20">
                  <Database size={40} className="mx-auto mb-4" />
                  <div className="text-[10px] font-black uppercase">NO_ACTIVE_TELEMETRY</div>
                </div>
              )}
            </div>
          </OmniCard>
        </div>

        <div className="lg:col-span-1">
          <OmniCard title="AI_Advisor_Jun" subtitle="PROTOCOL_GUIDANCE_ENGINE" className="bg-black text-white border-none h-full">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                  <Zap className="text-primary-teal-start" size={24} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary-teal-start">Status: Optimized</div>
              </div>

              <p className="text-sm font-bold italic text-stone-300 leading-relaxed border-l-2 border-primary-teal-start pl-4 py-1">
                {Object.keys(activeSession?.chapterProgress || {}).length > 3
                  ? "\"System stable. Evidence density satisfies GRI 302 protocol. Proceed to supply chain deconstruction.\""
                  : "\"Welcome to Omni v4.2. Initialize ingestion protocol via Input Center for baseline carbon telemetry.\""}
              </p>

              <div className="space-y-4 pt-10">
                <button className="w-full bg-primary-teal-start text-white py-4 rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
                  <span>LAUNCH_COMMAND_WIZARD</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  DOWNLOAD_WEEKLY_SYNOPSIS
                </button>
              </div>
            </div>
          </OmniCard>
        </div>
      </div>
    </div>
  );
}
