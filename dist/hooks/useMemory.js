'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { writeMemory, readMemory, saveAIConversation, loadAIConversation, } from '../lib/memory';
// useSustainWriteStore is now the primary store for SustainWrite content
import { useCompanyProfileStore } from '../store/useCompanyProfileStore';
// ─── Generic Memory Hook ─────────────────────────────────────────────────────
export function useMemory(type, key, defaultValue) {
    const [value, setValue] = useState(defaultValue ?? null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const saveTimeoutRef = useRef();
    useEffect(() => {
        let mounted = true;
        // setLoading(true); // Removed - already initialized to true in useState
        readMemory(type, key).then(mem => {
            if (mounted) {
                setValue((mem ?? defaultValue ?? null));
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [type, key, defaultValue]);
    const save = useCallback((newValue) => {
        setValue(newValue);
        setSaved(false);
        clearTimeout(saveTimeoutRef.current);
        // Debounce: 800ms after last change
        saveTimeoutRef.current = setTimeout(() => {
            writeMemory(type, key, newValue)
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
export function useAIMemory(persona) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        // setLoading(true); // Removed - already initialized to true in useState
        loadAIConversation(persona).then(msgs => {
            if (mounted) {
                setMessages(msgs);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [persona]);
    const addMessage = useCallback(async (role, content) => {
        const msg = { role, content, timestamp: new Date().toISOString(), persona };
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
//# sourceMappingURL=useMemory.js.map