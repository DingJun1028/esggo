"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit, doc, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { getValue } from "firebase/remote-config";
import { logEvent } from "firebase/analytics";
import { useFirebase } from "@/components/layout/firebase-provider";
import { AppContextType, Report, AppNotification, ReportStatus, Task, IntelligenceModule, IntelligenceSourceData as IntelligenceSource, CompanyProfile, SustainWriteSubView } from "@/types";
import { logger } from "@/lib/utils/logger";
import { queryRef, mutationRef, executeMutation, subscribe as subscribeDC } from "firebase/data-connect";
import {
  listAllTasks,
  createTask as createTaskDC,
  updateTaskStatus as updateTaskStatusDC,
  listAllTasksRef,
  deleteTask as deleteTaskDC,
  createAuditRecord as createAuditRecordDC,
  updateAuditRecord as updateAuditRecordDC,
  deleteAuditRecord as deleteAuditRecordDC,
  listIntelligenceModulesRef,
  listIntelligenceSourcesRef,
  upsertIntelligenceModule as upsertIntelligenceModuleDC,
  upsertIntelligenceSource as upsertIntelligenceSourceDC,
  listCompanyMetric,
  listCompanyMetricRef,
  upsertCompanyMetric as upsertCompanyMetricDC
} from "@/src/dataconnect-generated";
import {
  INITIAL_REPORTS,
  DEFAULT_COMPANY_PROFILE,
  SYSTEM_CONFIG,
  INITIAL_INTELLIGENCE_MODULES,
  INITIAL_INTELLIGENCE_SOURCES,
  DEFAULT_COMPANY_ID
} from "@/lib/config/constants";


// Removed usePersistentState as we are migrating to Firestore


const AppContext = createContext<AppContextType | undefined>(undefined);



export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, remoteConfig, analytics, dataconnect } = useFirebase();
  const pathname = usePathname();
  const router = useRouter();
  const [activeView, setActiveViewState] = useState("dashboard");

  // Sync activeView with pathname
  useEffect(() => {
    if (pathname) {
      const view = pathname === '/' ? 'dashboard' : pathname.split('/').pop() || 'dashboard';
      setActiveViewState(view);
    }
  }, [pathname]);

  const setActiveView = useCallback((view: string) => {
    router.push(`/${view}`);
  }, [router]);
  const [activeSubView, setActiveSubView] = useState<SustainWriteSubView>("home");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [traceTarget, setTraceTarget] = useState<any>(null);
  const setAssistantPersona = useCallback((persona: "compliance" | "harmony" | "innovation") => {
    setSelectedSpirit(persona);
  }, []);
  const [isSpiritOpen, setIsSpiritOpen] = useState(false);
  const [selectedSpirit, setSelectedSpirit] = useState<"compliance" | "harmony" | "innovation">("compliance");
  const [globalEsgData, setGlobalEsgData] = useState({
    totalReports: INITIAL_REPORTS.length,
    completedReports: INITIAL_REPORTS.filter(r => r.status === "completed").length,
    linkedSourcesCount: INITIAL_REPORTS.reduce((acc, r) => acc + (r.linkedSourceCount || 0), 0),
    complianceRate: 92,
    trustScore: 98.4,
    readinessScore: 88,
    companyMetrics: []
  });
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [benchmarkHistory, setBenchmarkHistory] = useState<any[]>([]);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS || []);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditRecords, setAuditRecords] = useState<any[]>([]);
  const [intelligenceModules, setIntelligenceModules] = useState<IntelligenceModule[]>([]);
  const [intelligenceSources, setIntelligenceSources] = useState<IntelligenceSource[]>([]);
  const [isIntelligenceLoading, setIsIntelligenceLoading] = useState(true);

  // Firestore Sync Effect
  useEffect(() => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    
    // Sync Company Profile & Global Data
    const companyRef = doc(db, "companies", companyId);
    const unsubCompany = onSnapshot(companyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.profile) setCompanyProfile(data.profile);
        if (data.benchmarkHistory) setBenchmarkHistory(data.benchmarkHistory);
        // Do not override globalEsgData entirely if you rely on Data Connect metrics, 
        // but sync parts if needed. Currently metrics come from DataConnect.
      } else {
        // Initialize default company profile if not exists
        setDoc(companyRef, { profile: DEFAULT_COMPANY_PROFILE, benchmarkHistory: [] }, { merge: true });
      }
    });

    // Sync Reports
    const reportsRef = collection(db, "companies", companyId, "reports");
    const reportsQuery = query(reportsRef, orderBy("lastEdited", "desc"));
    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      const dbReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      if (dbReports.length > 0) {
        setReports(dbReports);
      }
    });

    // Sync Notifications
    const notificationsRef = collection(db, "companies", companyId, "notifications");
    const notifsQuery = query(notificationsRef, orderBy("timestamp", "desc"), limit(50));
    const unsubNotifications = onSnapshot(notifsQuery, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification)));
    });

    return () => {
      unsubCompany();
      unsubReports();
      unsubNotifications();
    };
  }, [user]);

  // Provide a wrapped setCompanyProfile that updates Firestore
  const updateCompanyProfile = useCallback((newProfile: CompanyProfile | ((prev: CompanyProfile) => CompanyProfile)) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    setCompanyProfile(prev => {
      const updated = typeof newProfile === "function" ? newProfile(prev) : newProfile;
      setDoc(doc(db, "companies", companyId), { profile: updated }, { merge: true });
      return updated;
    });
  }, [user]);

  // Safety check for selectedReportId
  useEffect(() => {
    if (selectedReportId && Array.isArray(reports)) {
      const exists = reports.some(r => r.id === selectedReportId);
      if (!exists) {
        setSelectedReportId(null);
      }
    }
  }, [selectedReportId, reports]);

  const safeSetSelectedReportId = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedReportId(null);
      return;
    }
    if (Array.isArray(reports) && reports.some(r => r.id === id)) {
      setSelectedReportId(id);
    }
  }, [reports]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "zh" ? "en" : "zh");
  };

  const [achievements] = useState([
    { id: "a1", title: "數據先鋒", description: "首位導入 5T 協議的用戶" },
    { id: "a2", title: "信賴大師", description: "平均信賴評分超過 98%" }
  ]);

  const todoCount = useMemo(() => {
    if (!Array.isArray(reports) || !Array.isArray(tasks)) return 0;
    const reportTodos = reports.reduce((acc, report) => acc + (report.sections - report.completedSections), 0);
    const taskTodos = tasks.filter(t => !t.completed).length;
    return reportTodos + taskTodos;
  }, [reports, tasks]);

  const [hiddenGoals] = useState({
    systemHarmony: 98.4,
    dataPurity: 99.1,
    governanceWisdom: 97.5,
    ecosystemCoordination: 96.8
  });

  const [activities, setActivities] = useState<any[]>([]);

  const addActivity = useCallback(async (action: string, metadata: any = {}) => {
    const log = {
      action,
      metadata,
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [log, ...prev].slice(0, SYSTEM_CONFIG.MAX_ACTIVITIES_LOG));

    // Analytics tracking
    analytics.then(a => {
      if (a) logEvent(a, 'user_action', { action, ...metadata });
    });

    try {
      await addDoc(collection(db, "user_activities"), {
        ...log,
        serverTime: serverTimestamp()
      });
      logger.info(`Activity logged: ${action}`, metadata, "AppContext");
    } catch (e) {
      logger.error(`Firestore logging failed: ${action}`, { error: e }, "AppContext");
    }
  }, [analytics]);

  // Dynamic config from Remote Config
  const [themeMode, setThemeMode] = useState<string>("standard");
  useEffect(() => {
    if (remoteConfig) {
      const mode = getValue(remoteConfig, "ui_theme_mode").asString();
      if (mode) setThemeMode(mode);
    }
  }, [remoteConfig]);

  const addReport = useCallback(async (report: Partial<Report>) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    const reportId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const newReport: Report = {
      id: reportId,
      title: report.title || "未命名報告",
      year: report.year || new Date().getFullYear(),
      chapters: report.chapters || 0,
      sections: report.sections || 0,
      completedSections: 0,
      progress: 0,
      status: "draft",
      lastEdited: new Date().toISOString(),
      linkedSourceCount: 0,
      issaReadiness: 0,
      trustSeal: "Bronze",
      ...report
    };
    
    // Write to Firestore
    await setDoc(doc(db, "companies", companyId, "reports", reportId), newReport);
    
    addNotification({
      type: "success",
      title: "報告已建立",
      message: `成功建立報告：${newReport.title}`
    });
  }, [user]);

  const updateReport = useCallback(async (id: string, updates: Partial<Report>) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    const reportRef = doc(db, "companies", companyId, "reports", id);
    try {
      await updateDoc(reportRef, { ...updates, lastEdited: new Date().toISOString() });
    } catch (error) {
      logger.error("Failed to update report in Firestore", { error }, "AppContext");
    }
  }, [user]);

  const updateSectionContent = useCallback(async (reportId: string, sectionId: string, content: string) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    const reportRef = doc(db, "companies", companyId, "reports", reportId);
    try {
      await setDoc(reportRef, {
        lastEdited: new Date().toISOString(),
        sectionContents: {
          [sectionId]: content
        }
      }, { merge: true });
    } catch (error) {
      logger.error("Failed to update section content in Firestore", { error }, "AppContext");
    }
  }, [user]);

  const deleteReport = useCallback(async (id: string) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    try {
      await deleteDoc(doc(db, "companies", companyId, "reports", id));
    } catch (error) {
      logger.error("Failed to delete report in Firestore", { error }, "AppContext");
    }
  }, [user]);

  const addNotification = useCallback(async (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    const notifId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newNotification: AppNotification = {
      id: notifId,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    try {
      await setDoc(doc(db, "companies", companyId, "notifications", notifId), newNotification);
    } catch (error) {
      logger.error("Failed to add notification in Firestore", { error }, "AppContext");
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    const companyId = user?.uid || DEFAULT_COMPANY_ID;
    try {
      await updateDoc(doc(db, "companies", companyId, "notifications", id), { read: true });
    } catch (error) {
      logger.error("Failed to mark notification as read in Firestore", { error }, "AppContext");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }
    const q = query(collection(db, "user_activities"), orderBy("serverTime", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (logs.length > 0) setActivities(logs);
    }, (err) => {
      logger.error("Firestore listener failed", { error: err }, "AppContext");
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time sync tasks from Data Connect
  useEffect(() => {
    if (!dataconnect) return;

    const ref = listAllTasksRef(dataconnect);
    const unsubscribe = subscribeDC(ref, (result) => {
      if (result.data && result.data.tasks) {
        setTasks(result.data.tasks.map(t => ({
          ...t,
          createdAt: t.createdAt.toString()
        })));
      }
    });

    return () => unsubscribe();
  }, [dataconnect]);

  const addTask = async (title: string, description?: string) => {
    try {
      await createTaskDC(dataconnect, { title, description, createdAt: new Date().toISOString() });
      addNotification({
        type: "success",
        title: "任務已建立",
        message: `成功建立任務：${title}`
      });
    } catch (error) {
      logger.error("Failed to create task", { error }, "AppContext");
      addNotification({
        type: "error",
        title: "建立失敗",
        message: "無法連線至雲端資料庫"
      });
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateTaskStatusDC(dataconnect, { id, completed });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    } catch (error) {
      logger.error("Failed to update task", { error }, "AppContext");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskDC(dataconnect, { id });
      setTasks(prev => prev.filter(t => t.id !== id));
      addNotification({
        type: "info",
        title: "任務已刪除",
        message: "已從雲端端清空該任務記錄"
      });
    } catch (error) {
      logger.error("Failed to delete task", { error }, "AppContext");
    }
  };

  // Audit Records Sync
  useEffect(() => {
    if (!dataconnect) return;
    const ref = queryRef(dataconnect, 'ListAuditRecords');
    const unsubscribe = subscribeDC(ref, (result) => {
      if (result.data && (result.data as any).auditRecords) {
        setAuditRecords((result.data as any).auditRecords);
      }
    });
    return () => unsubscribe();
  }, [dataconnect]);

  const addAuditRecord = async (record: any) => {
    try {
      const result = await createAuditRecordDC(dataconnect, record);
      addNotification({
        type: "success",
        title: "證據已存證",
        message: "ZKP 存證記錄已同步至雲端"
      });
      return result;
    } catch (error) {
      logger.error("Failed to create audit record", { error }, "AppContext");
      return { error };
    }
  };

  const updateAuditRecord = async (vars: any) => {
    try {
      const result = await updateAuditRecordDC(dataconnect, vars);
      addNotification({
        type: "info",
        title: "記錄已更新",
        message: "存證記錄已成功更新"
      });
      return result;
    } catch (error) {
      logger.error("Failed to update audit record", { error }, "AppContext");
      return { error };
    }
  };

  const deleteAuditRecord = async (id: string) => {
    try {
      const result = await deleteAuditRecordDC(dataconnect, { id });
      addNotification({
        type: "info",
        title: "記錄已刪除",
        message: "存證記錄已成功刪除"
      });
      return result;
    } catch (error) {
      logger.error("Failed to delete audit record", { error }, "AppContext");
      return { error };
    }
  };

  // Intelligence Center Sync
  useEffect(() => {
    if (!dataconnect) return;

    const modRef = listIntelligenceModulesRef(dataconnect);
    const modUnsubscribe = subscribeDC(modRef, (result) => {
      if (result.data && result.data.intelligenceModules) {
        if (result.data.intelligenceModules.length === 0) {
          INITIAL_INTELLIGENCE_MODULES.forEach(m => {
            upsertIntelligenceModuleDC(dataconnect, {
              ...m,
              details: Array.isArray(m.details) ? (m.details as string[]).join('|') : m.details,
            });
          });
        } else {
          setIntelligenceModules(
            result.data.intelligenceModules.map((m: any) => ({
              ...m,
              details: typeof m.details === 'string' ? m.details.split('|').filter(Boolean) : (m.details ?? []),
            }))
          );
        }
      }
    });

    const srcRef = listIntelligenceSourcesRef(dataconnect);
    const srcUnsubscribe = subscribeDC(srcRef, (result) => {
      if (result.data && result.data.intelligenceSources) {
        if (result.data.intelligenceSources.length === 0) {
          INITIAL_INTELLIGENCE_SOURCES.forEach((s, idx) => {
            const uuid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `550e8400-e29b-41d4-a716-44665544000${idx}`;
            upsertIntelligenceSourceDC(dataconnect, { id: uuid, ...s });
          });
        } else {
          setIntelligenceSources(result.data.intelligenceSources);
        }
        setIsIntelligenceLoading(false);
      }
    });

    // Company Metrics Sync
    const metricRef = listCompanyMetricRef(dataconnect, { companyId: DEFAULT_COMPANY_ID });
    const metricUnsubscribe = subscribeDC(metricRef, (result) => {
      if (result.data && (result.data as any).companyMetrics && Array.isArray((result.data as any).companyMetrics) && (result.data as any).companyMetrics.length > 0) {
        const primaryMetric = (result.data as any).companyMetrics[0];

        // Calculate dynamic readiness based on audit records
        const verifiedCategories = new Set(
          auditRecords
            .filter(r => r.zkpStatus === "Verified" || r.zkpStatus === "Synced")
            .map(r => r.category)
            .filter(Boolean)
        );

        const baseReadiness = primaryMetric.readinessScore || 60;
        const recordBonus = verifiedCategories.size * 10; // 10% per category verified
        const finalReadiness = Math.min(100, baseReadiness + recordBonus);

        setGlobalEsgData({
          totalReports: INITIAL_REPORTS.length,
          completedReports: INITIAL_REPORTS.filter(r => r.status === "completed").length,
          linkedSourcesCount: INITIAL_REPORTS.reduce((acc, r) => acc + (r.linkedSourceCount || 0), 0),
          complianceRate: primaryMetric.complianceRate || 92,
          trustScore: primaryMetric.trustScore || 98.4,
          readinessScore: finalReadiness,
          companyMetrics: (result.data as any).companyMetrics.map((m: any) => ({
            category: m.category,
            label: m.label,
            value: m.value,
            unit: m.unit,
            trend: m.trend,
            trust_score: m.trust_score
          }))
        });
      }
    });

    return () => {
      modUnsubscribe();
      srcUnsubscribe();
      metricUnsubscribe();
    };
  }, [dataconnect, setGlobalEsgData]);

  const upsertIntelligenceModule = async (module: IntelligenceModule) => {
    try {
      await upsertIntelligenceModuleDC({
        ...module,
        details: Array.isArray(module.details) ? module.details.join('|') : (module.details as unknown as string ?? ''),
      });
      addNotification({
        type: "success",
        title: "模組已更新",
        message: `商情模組 ${module.titleZh} 已同步至雲端`
      });
    } catch (error) {
      logger.error("Failed to upsert intelligence module", { error }, "AppContext");
    }
  };

  const upsertIntelligenceSource = async (source: IntelligenceSource) => {
    try {
      await upsertIntelligenceSourceDC(source);
    } catch (error) {
      logger.error("Failed to upsert intelligence source", { error }, "AppContext");
    }
  };

  const toggleIntelligenceSource = useCallback(async (id: string) => {
    const source = intelligenceSources.find(s => s.id === id);
    if (!source) return;
    const newStatus = (source.status === "Active" || source.status === "Live") ? "Paused" : "Active";
    try {
      await upsertIntelligenceSourceDC({ ...source, status: newStatus });
      addNotification({
        type: "info",
        title: "來源狀態變更",
        message: `${source.name} 已切換為 ${newStatus}`
      });
    } catch (error) {
      logger.error("Failed to toggle intelligence source", { error }, "AppContext");
    }
  }, [intelligenceSources, addNotification]);

  const contextValue = useMemo(() => ({
    activeView,
    setActiveView,
    activeSubView,
    setActiveSubView,
    selectedReportId,
    setSelectedReportId: safeSetSelectedReportId,
    traceTarget,
    setTraceTarget,
    isSpiritOpen,
    setIsSpiritOpen,
    globalEsgData,
    setGlobalEsgData,
    companyProfile,
    setCompanyProfile: updateCompanyProfile,
    benchmarkHistory,
    setBenchmarkHistory,
    todoCount,
    achievements,
    addActivity,
    activities,
    reports,
    addReport,
    updateReport,
    updateSectionContent,
    deleteReport,
    notifications,
    addNotification,
    markNotificationAsRead,
    hiddenGoals,
    language,
    toggleLanguage,
    setAssistantPersona,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    auditRecords,
    addAuditRecord,
    updateAuditRecord,
    deleteAuditRecord,
    selectedSpirit,
    setSelectedSpirit,
    intelligenceModules,
    intelligenceSources,
    isIntelligenceLoading,
    upsertIntelligenceModule,
    upsertIntelligenceSource,
    toggleIntelligenceSource
  }), [
    activeView,
    activeSubView,
    isSpiritOpen,
    globalEsgData,
    companyProfile,
    updateCompanyProfile,
    benchmarkHistory,
    todoCount,
    achievements,
    activities,
    reports,
    notifications,
    hiddenGoals,
    language,
    tasks,
    auditRecords,
    selectedSpirit,
    setSelectedSpirit,
    intelligenceModules,
    intelligenceSources,
    selectedReportId,
    traceTarget,
    isIntelligenceLoading
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
