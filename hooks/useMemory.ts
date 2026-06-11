'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  writeMemory, readMemory,
  saveAIConversation, loadAIConversation,
  type MemoryType, type MemoryRecord, type AIMessage,
} from '../lib/memory';
// useSustainWriteStore is now the primary store for SustainWrite content
import { useCompanyProfileStore } from '../store/useCompanyProfileStore';

// ─── Generic Memory Hook ─────────────────────────────────────────────────────

export function useMemory<T = unknown>(
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
     // setLoading(true); // Removed - already initialized to true in useState
     readMemory(type, key).then(mem => {
       if (mounted) {
         setValue((mem ?? defaultValue ?? null) as T | null);
         setLoading(false);
       }
     });
     return () => { mounted = false; };
   }, [type, key, defaultValue]);

  const save = useCallback((newValue: T) => {
    setValue(newValue);
    setSaved(false);
    clearTimeout(saveTimeoutRef.current);
    // Debounce: 800ms after last change
    saveTimeoutRef.current = setTimeout(() => {
       writeMemory(type, key, newValue as Record<string, unknown>)
        .then(() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        })
        .catch(err => console.error('[useMemory] Failed to write memory:', err));
    }, 800);
  }, [type, key]);

  return { value, setValue: save, loading, saved };
}

// ─── AI Conversation Memory Hook ──────────────────────────────────────────────

export function useAIMemory(persona: string) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
     let mounted = true;
     // setLoading(true); // Removed - already initialized to true in useState
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
