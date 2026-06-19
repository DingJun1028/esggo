"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils"; // Strict enterprise utility
import { DashboardView } from "@/components/views/dashboard-view";
import { ReconnaissanceView } from "@/components/views/reconnaissance-view";
import { ReportsView } from "@/components/views/reports-view";
import { OmniView } from "@/components/views/omni-view";
import { OmniSrcView } from "@/components/views/omni-src-view";
import { OmniNavigationRail } from "@/components/omni-terminal/omni-navigation-rail";
import { OmniHeader } from "@/components/omni-terminal/omni-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { DailyBriefingOverlay } from "@/components/layout/daily-briefing-overlay";
import { StrategyWarRoomView } from "@/components/views/strategy-war-room-view";
import { AcademyView } from "@/components/views/academy-view";
import { AuditVaultView } from "@/components/views/audit-vault-view";
import { ExecutiveDashboardView } from "@/components/views/executive-dashboard-view";
import { SubscriptionView } from "@/components/views/subscription-view";
import { useAppContext, AppProvider } from "@/lib/context/app-context";
import { OmniSidebar } from "@/components/layout/omni-sidebar";
import { FloatingOmni } from "@/components/layout/floating-omni";
import { OmniCommandTray } from "@/components/layout/omni-command-tray";
import { ChartGradientProvider } from "@/components/ui/chart-gradient-provider";
import { OmniTraceabilityView } from "@/components/views/omni-traceability-view";
import { toast } from "sonner";
import { EsgMetrics } from "@/lib/services/omni-service";
import { ShareModal } from "@/components/ui/share-modal";

import { AuthSimulationView } from "@/components/views/auth-simulation-view";
import { NewslettersView } from "@/components/views/newsletters-view";
import { FrameworkAlignmentView } from "@/components/views/framework-alignment-view";
import { Scope3MonitoringView } from "@/components/views/scope3-monitoring-view";
import { SquadManagementView } from "@/components/views/squad-management-view";
import { TacticalWeaponryView } from "@/components/views/tactical-weaponry-view";
import { ForensicInvestigationView } from "@/components/views/forensic-investigation-view";
import { ReportBuilderView } from "@/components/views/report-builder-view";
import { EntityDataEntryView } from "@/components/views/entity-data-entry-view";
import { NCBDBView } from "@/components/views/ncbdb-view";
import { ProtocolView } from "@/components/views/protocol-view";
import { ESGDatabaseView } from "@/components/views/esg-database-view";
import { SettingsView } from "@/components/views/settings-view";
import { SystemOptimizationView } from "@/components/views/system-optimization-view";
import { FeatureMapView } from "@/components/views/feature-map-view";
import { GroupConsolidationView } from "@/components/views/group-consolidation-view";
import { OmniNoteView } from "@/components/views/wuzuo-note-view";
import { SmeDashboardView } from "@/components/views/sme-dashboard-view";
import { CoreServicesView } from "@/components/views/core-services-view";
import { GriImportView } from "@/components/views/gri-import-view";
import { PlatformIntroView } from "@/components/views/platform-intro-view";
import { CommandCenterV2 } from "@/components/views/command-center-v2";
import BusinessIntelligenceView from "@/components/views/business-intelligence-view";
import { ReadingRoomView } from "@/components/views/reading-room-view";
import { CoraHubView } from "@/components/views/cora-hub-view";
import { ZenVillageView } from "@/components/views/zen-village-view";


const MainContent: React.FC = () => {
  const { activeTab, isSidebarOpen, user, authLoading } = useAppContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Audit Vault 狀態管理
  // 最佳實踐：定義明確的型別，取代 any
  const [vaultReportData, setVaultReportData] = useState<{ title?: string; metrics?: Partial<EsgMetrics> }>({});
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 最佳實踐：允許子元件直接將最新數據作為參數傳入 (dynamicData)，避免 State 非同步的問題
  const handleExportVaultReport = async (dynamicData?: { title: string; metrics: EsgMetrics }) => {
    const payloadData = dynamicData || vaultReportData;

    if (!payloadData || !payloadData.metrics) {
      toast.error("沒有可供導出的資料");
      return;
    }

    const toastId = toast.loading("⏳ 正在生成加密 PDF 報告並歸檔...");

    try {
      // 確保 API 路徑正確指向您的後端路由
      const res = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payloadData.title || "ESG GO 稽核金庫報告",
          metrics: payloadData.metrics,
        }),
      });

      if (!res.ok) {
        throw new Error("生成 PDF 失敗");
      }

      const data = await res.json();
      toast.success("✅ 報告已成功生成並歸檔！", { id: toastId });

      // 取得後端回傳的 Signed URL，並在新分頁開啟下載
      if (data.url) {
        setShareUrl(data.url);
        // 開啟 Modal，Sonner Toast 的成功狀態會自動在幾秒後淡出，不需手動關閉
        setIsShareModalOpen(true);
      }
    } catch (error) {
      console.error("導出報告時發生錯誤:", error);
      toast.error("報告導出失敗，請稍後再試。", { id: toastId });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeTab]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-stitch-primary/30 border-t-stitch-primary rounded-full animate-spin" />
          <p className="text-stitch-text-muted text-sm font-bold tracking-widest uppercase">正在初始化系統 / Initializing Omni Systems...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show Platform Intro as the first gate, but allow switching to Auth via a state if needed
    // Actually, PlatformIntroView has a Link to /login, so we should keep it simple
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <PlatformIntroView />
      </div>
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case "daily-briefing":
        return <DashboardView />;
      case "strategy-war-room":
        return <StrategyWarRoomView />;
      case "esg-studio":
      case "sustainability-report-center": // Legacy Fallback
        return <ReportsView />;
      case "omni-ai":
        return <OmniView />;
      case "esg-database":
        return <OmniSrcView />;
      case "omni-matrix":
        return <OmniTraceabilityView />;
      case "audit-vault":
        return (
          <AuditVaultView
            reportData={vaultReportData}
            onExport={handleExportVaultReport}
          />
        );
      case "academy":
        return <AcademyView />;
      case "command-center":
        return <CommandCenterV2 />;
      case "reconnaissance":
        return <ReconnaissanceView />;
      case "business-intelligence":
        return <BusinessIntelligenceView />;
      case "subscription":
        return <SubscriptionView />;
      case "newsletters":
        return <NewslettersView />;
      case "alignment":
        return <FrameworkAlignmentView />;
      case "scope3":
        return <Scope3MonitoringView />;
      case "weaponry":
        return <TacticalWeaponryView />;
      case "squad":
        return <SquadManagementView />;
      case "forensics":
        return <ForensicInvestigationView />;
      case "report-builder":
        return <ReportBuilderView />;
      case "entity-data-entry":
        return <EntityDataEntryView />;
      case "ncbdb":
        return <NCBDBView />;
      case "protocol":
        return <ProtocolView />;
      case "esg-knowledge-base":
        return <ESGDatabaseView />;
      case "settings":
        return <SettingsView />;
      case "system-optimization":
        return <SystemOptimizationView />;
      case "feature-map":
        return <FeatureMapView />;
      case "group-consolidation":
        return <GroupConsolidationView />;
      case "omni-note":
        return <OmniNoteView />;
      case "sme-dashboard":
        return <SmeDashboardView />;
      case "core-services":
        return <CoreServicesView />;
      case "gri-import":
        return <GriImportView />;
      case "reading-room":
        return <ReadingRoomView />;
      case "cora-intel":
        return <CoraHubView />;
      case "zen-village":
        return <ZenVillageView />;
      default:
        return <CommandCenterV2 />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-teal-start/10 relative overflow-hidden">
      {/* Universal Navigation Rail */}
      <div className="hidden md:block">
        <OmniNavigationRail />
      </div>

      {/* Main Viewport Container */}
      <main
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "md:ml-[260px]" : "md:ml-[84px]"
        )}
      >
        {/* Enterprise Header */}
        <div className="hidden md:block sticky top-0 z-[50]">
          <OmniHeader />
        </div>

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-12 pt-20 md:pt-6 pb-24 md:pb-12"
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1600px] w-full mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        url={shareUrl}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Omni Command Tray (Platform 2.0 Feature) */}
      <OmniCommandTray />

      {/* Mobile Experience (Preserved for now) */}
      <div className="md:hidden">
        <MobileNav />
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <AppProvider>
      <ChartGradientProvider />
      <MainContent />
    </AppProvider>
  );
}
