"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Report, Language } from "@/types";
import { getTemplateSections } from "@/lib/data/template-registry";
import { useAppContext } from "@/lib/context/app-context";
import { useFirebase } from "@/components/layout/firebase-provider";
import { upsertReportSection } from "@/src/dataconnect-generated";
import { saveReportAction } from "@/app/actions";

export function useReportEditor(
    selectedReport: Report | null,
    language: Language
) {
    const { updateReport, reports } = useAppContext();
    const { dataconnect } = useFirebase();

    // Local cache for section contents to avoid rapid global context updates on every keystroke
    const [localContents, setLocalContents] = useState<Record<string, string>>({});
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [integrityMark, setIntegrityMark] = useState<string | null>(null);
    const [lastSyncedReportId, setLastSyncedReportId] = useState<string | null>(null);

    // Sync global state to local cache when report changes or first load
    useEffect(() => {
        if (!selectedReport) {
            setLocalContents({});
            setLastSyncedReportId(null);
            return;
        }

        // Only sync if ID changed to avoid overwriting user's typing
        if (selectedReport.id !== lastSyncedReportId) {
            setLocalContents(selectedReport.sectionContents || {});
            setLastSyncedReportId(selectedReport.id);
            setLastSaved(selectedReport.lastAutosave ? new Date(selectedReport.lastAutosave) : null);
        }
    }, [selectedReport?.id, lastSyncedReportId]);

    // Dynamic sections based on template
    const editorSections = useMemo(() => {
        const templateId = selectedReport?.templateId;
        if (templateId) {
            const sections = getTemplateSections(templateId);
            if (sections.length > 0) {
                return sections.map(s => ({
                    id: s.id,
                    title: language === 'en' ? (s.titleEn || s.title) : s.title,
                    chapter: language === 'en' ? (s.chapterEn || s.chapter) : s.chapter,
                    guidance: language === 'en' ? s.guidanceEn : s.guidanceZh,
                    type: s.type,
                    isDone: selectedReport?.completedSectionIds?.includes(s.id) || false,
                    rawSection: s
                }));
            }
        }
        // Fallback: generic 5-section scaffold
        return [
            { id: "1.1", title: "組織概況 (Organizational Details)", chapter: "GRI 2: 一般揭露", guidance: "GRI 2-1: 組織細節...", type: "已匯入", isDone: selectedReport?.completedSectionIds?.includes("1.1") || false },
            { id: "1.2", title: "報導實務 (Reporting Practices)", chapter: "GRI 2: 一般揭露", guidance: "GRI 2-2: 報導期間...", type: "待補寫", isDone: selectedReport?.completedSectionIds?.includes("1.2") || false },
            { id: "1.3", title: "利害關係人鑑別", chapter: "第一章：導論", guidance: "辨識主要利害關係人類別。", type: "待補寫", isDone: selectedReport?.completedSectionIds?.includes("1.3") || false },
            { id: "2.1", title: "重大主題清單 (List of Material Topics)", chapter: "GRI 3: 重大主題", guidance: "GRI 3-1: 決定重大主題...", type: "審核中", isDone: selectedReport?.completedSectionIds?.includes("2.1") || false },
            { id: "3.1", title: "能源消耗 (Energy Consumption)", chapter: "GRI 302: 能源", guidance: "GRI 302-1: 能源消耗...", type: "待補寫", isDone: selectedReport?.completedSectionIds?.includes("3.1") || false },
        ];
    }, [selectedReport?.templateId, selectedReport?.completedSectionIds, language]);

    // Debounced autosave logic
    useEffect(() => {
        if (!selectedReport || !lastSyncedReportId || selectedReport.id !== lastSyncedReportId) return;

        const timer = setTimeout(async () => {
            // Deep comparison to avoid redundant saves
            const hasChanges = Object.keys(localContents).some(
                key => localContents[key] !== (selectedReport.sectionContents?.[key] || "")
            );

            if (hasChanges) {
                setIsSaving(true);
                try {
                    if (dataconnect) {
                        const changes = Object.keys(localContents).filter(
                            key => localContents[key] !== (selectedReport?.sectionContents?.[key])
                        );
                        
                        for (const sectionId of changes) {
                            const sectionData = editorSections.find(s => s.id === sectionId);
                            if (sectionData) {
                                await upsertReportSection(dataconnect, {
                                    reportId: selectedReport.id,
                                    sectionId: sectionId,
                                    title: sectionData.title,
                                    content: localContents[sectionId] || "",
                                    isDone: sectionData.isDone,
                                    lastUpdated: new Date().toISOString()
                                });
                            }
                        }
                    }

                    updateReport(selectedReport.id, {
                        sectionContents: localContents,
                        lastAutosave: new Date().toISOString(),
                        lastEdited: language === 'zh' ? "自動儲存於剛剛" : "Autosaved just now"
                    });
                    setLastSaved(new Date());
                } catch (e) {
                    console.error("Autosave error:", e);
                } finally {
                    setIsSaving(false);
                }
            }
        }, 3000); // 3 second debounce for better performance

        return () => clearTimeout(timer);
    }, [localContents, selectedReport?.id, lastSyncedReportId, dataconnect, editorSections, language]);

    const updateSectionContent = useCallback((sectionId: string, content: string) => {
        setLocalContents(prev => ({
            ...prev,
            [sectionId]: content
        }));
    }, []);

    const toggleSectionCompletion = useCallback((sectionId: string) => {
        if (!selectedReport) return;

        const currentIds = selectedReport.completedSectionIds || [];
        const isDone = currentIds.includes(sectionId);

        const newIds = isDone
            ? currentIds.filter(id => id !== sectionId)
            : [...currentIds, sectionId];

        const totalSections = editorSections.length;
        const progress = Math.round((newIds.length / totalSections) * 100);

        updateReport(selectedReport.id, {
            completedSectionIds: newIds,
            completedSections: newIds.length,
            progress: progress,
            status: progress === 100 ? "completed" : "draft"
        });
    }, [selectedReport, editorSections, updateReport]);

    const getNextSectionId = useCallback((currentId: string) => {
        const currentIndex = editorSections.findIndex(s => s.id === currentId);
        if (currentIndex !== -1 && currentIndex < editorSections.length - 1) {
            return editorSections[currentIndex + 1].id;
        }
        return null;
    }, [editorSections]);

    const getPrevSectionId = useCallback((currentId: string) => {
        const currentIndex = editorSections.findIndex(s => s.id === currentId);
        if (currentIndex > 0) {
            return editorSections[currentIndex - 1].id;
        }
        return null;
    }, [editorSections]);

    const refreshData = useCallback(async () => {
        if (!selectedReport) return;
        const refreshedReport = reports.find(r => r.id === selectedReport.id);
        if (refreshedReport?.sectionContents) {
            setLocalContents(refreshedReport.sectionContents);
            setLastSaved(refreshedReport.lastAutosave ? new Date(refreshedReport.lastAutosave) : null);
        }
    }, [selectedReport, reports]);

    const saveReport = useCallback(async () => {
        if (!selectedReport) return false;
        setIsSaving(true);
        try {
            const result = await saveReportAction(selectedReport.id, localContents);
            if (result.success) {
                setLastSaved(new Date());
                setIntegrityMark(result.integrityMark || "VERIFIED");

                updateReport(selectedReport.id, {
                    sectionContents: localContents,
                    lastEdited: language === 'zh' ? "剛剛經 5T 確信" : "Just now (5T Certified)"
                });
                return true;
            }
            return false;
        } catch (e) {
            console.error("Manual save error", e);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [selectedReport, localContents, updateReport, language]);

    return {
        editorSections,
        localContents,
        updateSectionContent,
        toggleSectionCompletion,
        getNextSectionId,
        getPrevSectionId,
        refreshData,
        lastSaved,
        saveReport,
        isSaving,
        integrityMark
    };
}
