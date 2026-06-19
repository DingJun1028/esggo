import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    limit
} from "firebase/firestore";
import { db, functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { WizardSessionState, INcbReport, ChapterDraft } from "@/lib/types/ncb-types";

export interface WizardSession {
    currentStep: string;
    activeChapter: string;
    totalWordCount: number;
    lastEditedAt: string;
    chapterProgress: Record<string, { wordCount: number; lastEditedAt: string; status: string }>;
    selectedIssues: string[];
}

export interface ChapterSessionLog {
    chapterId: string;
    sessionDuration: number;
    wordCountBefore: number;
    wordCountAfter: number;
    timestamp: string;
}

/**
 * Firestore Service - 核心數據對接層
 */
export const FirestoreService = {
    /**
     * 加載所有報告 for current user and tenant
     */
    loadUserReports: async (userId: string, tenantId: string = "default"): Promise<INcbReport[]> => {
        try {
            const reportsRef = collection(db, "reports");
            const q = query(
                reportsRef,
                where("userId", "==", userId),
                where("tenantId", "==", tenantId),
                orderBy("updatedAt", "desc")
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as INcbReport));
        } catch (error) {
            console.error("Error loading user reports:", error);
            return [];
        }
    },

    /**
     * 加載歷史報告 from Firestore with tenant scoping
     */
    loadSealedReports: async (userId: string, tenantId: string = "default"): Promise<INcbReport[]> => {
        try {
            const reportsRef = collection(db, "reports");
            const q = query(
                reportsRef,
                where("userId", "==", userId),
                where("tenantId", "==", tenantId),
                where("status", "==", "Sealed"),
                orderBy("date", "desc")
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as INcbReport));
        } catch (error) {
            console.error("Error loading sealed reports:", error);
            return [];
        }
    },

    /**
     * 載入精靈進度 from Firestore (Tenant Scoped Path)
     */
    loadWizardSession: async (userId: string, tenantId: string = "default"): Promise<WizardSession | null> => {
        try {
            const sessionRef = doc(db, "tenants", tenantId, "wizard_sessions", userId);
            const snap = await getDoc(sessionRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data && typeof data.currentStep === 'string') {
                    return data as WizardSession;
                }
            }
            return null;
        } catch (error) {
            console.error("Error loading wizard session:", error);
            return null;
        }
    },

    /**
     * 儲存精靈進度 to Firestore (Tenant Scoped Path)
     */
    saveWizardSession: async (session: Omit<WizardSessionState, 'isLoading'>, tenantId: string = "default"): Promise<void> => {
        const { userId, ...data } = session;
        try {
            const sessionRef = doc(db, "tenants", tenantId, "wizard_sessions", userId);
            await setDoc(sessionRef, {
                ...data,
                tenantId,
                lastSyncAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving wizard session:", error);
            throw error;
        }
    },

    /**
     * 記錄章節撰寫日誌 (Tenant Scoped Path)
     */
    logChapterSession: async (userId: string, log: ChapterSessionLog, tenantId: string = "default"): Promise<void> => {
        try {
            const logsRef = collection(db, "tenants", tenantId, "wizard_sessions", userId, "session_logs");
            await setDoc(doc(logsRef), { ...log, tenantId });

            const sessionRef = doc(db, "tenants", tenantId, "wizard_sessions", userId);
            const snap = await getDoc(sessionRef);
            if (snap.exists()) {
                const currentData = snap.data();
                const newTotal = (currentData.totalWordCount || 0) + (log.wordCountAfter - log.wordCountBefore);
                await updateDoc(sessionRef, { totalWordCount: Math.max(0, newTotal) });
            }
        } catch (error) {
            console.error("Error logging chapter session:", error);
        }
    },

    /**
     * 儲存章節草稿 (Tenant Scoped Path)
     */
    saveChapterDraft: async (userId: string, chapterId: string, content: string, tenantId: string = "default"): Promise<void> => {
        try {
            const draftRef = doc(db, "tenants", tenantId, "wizard_sessions", userId, "chapter_drafts", chapterId);
            await setDoc(draftRef, {
                content,
                tenantId,
                updatedAt: new Date().toISOString(),
                omniVerified: true
            });
        } catch (error) {
            console.error("Error saving chapter draft:", error);
        }
    },

    /**
     * 儲存報告到 Firestore (一般報告或存證報告)
     */
    saveReport: async (report: Partial<INcbReport>): Promise<string> => {
        try {
            const reportId = report.id || `R-${Date.now()}`;
            const reportRef = doc(db, "reports", reportId);
            await setDoc(reportRef, {
                ...report,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            return reportId;
        } catch (error) {
            console.error("Error saving report:", error);
            throw error;
        }
    },

    /**
     * 5T 存證密封 (調用 Cloud Function)
     */
    finalizeReport: async (reportId: string): Promise<any> => {
        try {
            const finalize = httpsCallable(functions, 'generateReportPDF');
            const result = await finalize({ reportId });
            return result.data;
        } catch (error) {
            console.error("Error finalizing report:", error);
            throw new Error(`Finalizing failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    /**
     * 更新稽核軌跡狀態 (Audit Trail)
     */
    updateAuditTrail: async (auditId: string, data: any): Promise<void> => {
        try {
            const auditRef = doc(db, "audit_trails", auditId);
            await updateDoc(auditRef, {
                ...data,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error updating audit trail:", error);
            throw error;
        }
    },
    /**
     * 儲存 GRI 批次至 Vault (Tenant Scoped)
     */
    saveVaultBatch: async (batch: any, tenantId: string = "default"): Promise<void> => {
        try {
            const batchRef = doc(db, "tenants", tenantId, "esg_vault_batches", batch.id);
            await setDoc(batchRef, {
                ...batch,
                tenantId,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving vault batch:", error);
            throw error;
        }
    },
    /**
     * 讀取所有 Vault 批次 (Tenant Scoped)
     */
    loadVaultBatches: async (tenantId: string = "default"): Promise<any[]> => {
        try {
            const batchesRef = collection(db, "tenants", tenantId, "esg_vault_batches");
            const q = query(batchesRef, orderBy("timestamp", "desc"), limit(50));
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error("Error loading vault batches:", error);
            return [];
        }
    }
};
