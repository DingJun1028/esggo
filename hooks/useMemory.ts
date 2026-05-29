'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  saveSustainWriteSection, loadSustainWriteSections,
} from '../lib/dataconnect-memory';
import {
  writeMemory, readMemory, readMemoryByType,
  savePreference, loadPreference,
  saveCompanyProfile, loadCompanyProfile,
  saveFieldValues, loadFieldValues,
  saveAIConversation, loadAIConversation,
  type MemoryType, type MemoryRecord, type AIMessage,
} from '../lib/memory';
import { type SustainWriteSection } from '../lib/dataconnect-memory';
// useSustainWriteStore temporarily disabled - using direct Supabase fallback
import { useCompanyProfileStore } from '../store/useCompanyProfileStore';

// ─── Generic Memory Hook ─────────────────────────────────────────────────────

export function useMemory<T = Record<string, any>>(
  type: MemoryType,
  key: string,
  defaultValue?: T
) {
  const [value, setValue] = useState<T | null>(defaultValue ?? null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    readMemory(type, key).then(mem => {
      if (mounted) {
        setValue(mem as T ?? defaultValue ?? null);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [type, key]);

  const save = useCallback((newValue: T) => {
    setValue(newValue);
    setSaved(false);
    clearTimeout(saveTimeoutRef.current);
    // Debounce: 800ms after last change
    saveTimeoutRef.current = setTimeout(() => {
      writeMemory(type, key, newValue as Record<string, any>)
        .then(() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        })
        .catch(err => console.error('[useMemory] Failed to write memory:', err));
    }, 800);
  }, [type, key]);

  return { value, setValue: save, loading, saved };
}

// ─── SustainWrite Chapter Memory Hook ────────────────────────────────────────

export function useSustainWriteMemory(companyId = 'default') {
  const [sections, setSections] = useState<Record<string, SustainWriteSection>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [docStates, setDocStates] = useState<Record<string, boolean>>({});
  const [chapterStatuses, setChapterStatuses] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>();

  // Load all saved sections on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadSustainWriteSections(companyId).then(savedSections => {
      if (!mounted) return;
      const sectionMap: Record<string, SustainWriteSection> = {};
      const fvMap: Record<string, Record<string, string>> = {};
      const notesMap: Record<string, string> = {};
      const docMap: Record<string, boolean> = {};
      const statusMap: Record<string, string> = {};
      const contentMap: Record<string, string> = {};

      savedSections.forEach(s => {
        sectionMap[s.chapter_id] = s;
        if (s.field_values) fvMap[s.chapter_id] = s.field_values as Record<string, string>;
        if (s.notes) notesMap[s.chapter_id] = s.notes;
        if (s.documents_state) Object.assign(docMap, s.documents_state);
        if (s.status) statusMap[s.chapter_id] = s.status;
        if (s.content) contentMap[s.chapter_id] = s.content;
      });

      setSections(sectionMap);
      setFieldValues(fvMap);
      setNotes(notesMap);
      setDocStates(docMap);
      setChapterStatuses(statusMap);
      setGeneratedContent(contentMap);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [companyId]);

  // Auto-save debounced
  const triggerAutoSave = useCallback((
    chapterId: string,
    chapterName: string,
    chapterOrder: number,
    griRefs: string[],
    fv: Record<string, Record<string, string>>,
    nt: Record<string, string>,
    ds: Record<string, boolean>,
    st: Record<string, string>,
    ct: Record<string, string>
  ) => {
    clearTimeout(autoSaveRef.current);

    // 1. 離線備份：立即將編輯狀態存入 LocalStorage，防禦網路斷線
    const localKey = `esggo_sw_draft_${companyId}_${chapterId}`;
    const draftPayload = {
      company_id: companyId, chapter_id: chapterId, chapter_name: chapterName,
      content: ct[chapterId] || '', field_values: fv[chapterId] || {},
      notes: nt[chapterId] || '', documents_state: ds,
      status: (st[chapterId] || 'draft') as SustainWriteSection['status'],
      chapter_order: chapterOrder, gri_references: griRefs
    };
    try { localStorage.setItem(localKey, JSON.stringify(draftPayload)); } catch (e) { }

    autoSaveRef.current = setTimeout(() => {
      const chapDocs: Record<string, boolean> = {};
      Object.entries(ds).forEach(([k, v]) => { chapDocs[k] = v; });

      saveSustainWriteSection({ ...draftPayload, documents_state: chapDocs })
        .then(() => {
          setLastSaved(new Date());
          setSyncError(false);
          localStorage.removeItem(localKey); // 同步成功後移除本地備份
        })
        .catch((err) => {
          console.error('[SustainWrite] Auto-save failed, data kept in local storage:', err);
          setSyncError(true);
        });
    }, 1000);
  }, [companyId]);

  const updateFieldValue = useCallback((
    chapterId: string, fieldId: string, value: string,
    chapterName: string, chapterOrder: number, griRefs: string[]
  ) => {
    setFieldValues(prev => {
      const next = { ...prev, [chapterId]: { ...(prev[chapterId] || {}), [fieldId]: value } };
      triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs, next, notes, docStates, chapterStatuses, generatedContent);
      return next;
    });
  }, [notes, docStates, chapterStatuses, generatedContent, triggerAutoSave]);

  const updateNote = useCallback((
    chapterId: string, note: string,
    chapterName: string, chapterOrder: number, griRefs: string[]
  ) => {
    setNotes(prev => {
      const next = { ...prev, [chapterId]: note };
      triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs, fieldValues, next, docStates, chapterStatuses, generatedContent);
      return next;
    });
  }, [fieldValues, docStates, chapterStatuses, generatedContent, triggerAutoSave]);

  const updateDocState = useCallback((
    docId: string, uploaded: boolean,
    chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]
  ) => {
    setDocStates(prev => {
      const next = { ...prev, [docId]: uploaded };
      triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs, fieldValues, notes, next, chapterStatuses, generatedContent);
      return next;
    });
  }, [fieldValues, notes, chapterStatuses, generatedContent, triggerAutoSave]);

  const updateContent = useCallback((
    chapterId: string, content: string,
    chapterName: string, chapterOrder: number, griRefs: string[]
  ) => {
    setGeneratedContent(prev => {
      const next = { ...prev, [chapterId]: content };
      triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs, fieldValues, notes, docStates, chapterStatuses, next);
      return next;
    });
  }, [fieldValues, notes, docStates, chapterStatuses, triggerAutoSave]);

  const updateChapterStatus = useCallback((
    chapterId: string, status: string,
    chapterName: string, chapterOrder: number, griRefs: string[]
  ) => {
    setChapterStatuses(prev => {
      const next = { ...prev, [chapterId]: status };
      triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs, fieldValues, notes, docStates, next, generatedContent);
      return next;
    });
  }, [fieldValues, notes, docStates, generatedContent, triggerAutoSave]);

  const manualSave = useCallback(async (
    chapterId: string, chapterName: string,
    chapterOrder: number, griRefs: string[]
  ) => {
    clearTimeout(autoSaveRef.current);

    const payload = {
      company_id: companyId, chapter_id: chapterId, chapter_name: chapterName,
      content: generatedContent[chapterId] || '', field_values: fieldValues[chapterId] || {},
      notes: notes[chapterId] || '', documents_state: docStates,
      status: (chapterStatuses[chapterId] || 'draft') as SustainWriteSection['status'],
      chapter_order: chapterOrder, gri_references: griRefs,
    };

    try {
      const result = await saveSustainWriteSection(payload);
      setLastSaved(new Date());
      setSyncError(false);
      localStorage.removeItem(`esggo_sw_draft_${companyId}_${chapterId}`);
      return result;
    } catch (err) {
      console.error('[SustainWrite] Manual save failed:', err);
      setSyncError(true);
      throw err; // 保留錯誤以便 UI 層顯示提示（如 Toast）
    }
  }, [companyId, fieldValues, notes, docStates, chapterStatuses, generatedContent]);

  return {
    sections,
    fieldValues,
    notes,
    docStates,
    chapterStatuses,
    generatedContent,
    loading,
    syncError,
    lastSaved,
    updateFieldValue,
    updateNote,
    updateDocState,
    updateContent,
    updateChapterStatus,
    manualSave,
    setGeneratedContent,
  };
}

// ─── AI Conversation Memory Hook ──────────────────────────────────────────────

export function useAIMemory(persona: string) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadAIConversation(persona).then(msgs => {
      if (mounted) { setMessages(msgs); setLoading(false); }
    });
    return () => { mounted = false; };
  }, [persona]);

  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    const msg: AIMessage = { role, content, timestamp: new Date().toISOString(), persona };
    setMessages(prev => {
      const next = [...prev, msg];
      saveAIConversation(persona, next);
      return next;
    });
  }, [persona]);

  const clearMessages = useCallback(async () => {
    setMessages([]);
    await saveAIConversation(persona, []);
  }, [persona]);

  return { messages, loading, addMessage, clearMessages };
}

// ─── Company Profile Hook ─────────────────────────────────────────────────────

export function useCompanyProfile() {
  const store = useCompanyProfileStore();

  useEffect(() => {
    useCompanyProfileStore.getState().initData();
  }, []);

  return store;
}