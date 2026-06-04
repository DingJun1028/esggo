import { getSupabaseClient } from './supabase.ts';
// ─── Constants ───────────────────────────────────────────────────────────────
const DEFAULT_USER = 'default';
const DEFAULT_COMPANY = 'default';
// ─── Hash Utility ────────────────────────────────────────────────────────────
async function computeMemoryHash(data) {
    try {
        const encoder = new TextEncoder();
        const buf = encoder.encode(JSON.stringify(data) + Date.now());
        const hashBuf = await crypto.subtle.digest('SHA-256', buf);
        return ('sha256:' +
            Array.from(new Uint8Array(hashBuf))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join(''));
    }
    catch {
        return 'sha256:' + Math.random().toString(16).slice(2, 34);
    }
}
// ─── Core Memory Operations ───────────────────────────────────────────────────
/**
 * Write a memory record (upsert)
 */
export async function writeMemory(type, key, value, context, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    // Always persist to localStorage for instant access
    const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(lsKey, JSON.stringify({ value, context, ts: Date.now() }));
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return null;
    try {
        const hash = await computeMemoryHash({ type, key, value, userId, companyId });
        const { data, error } = await client
            .from('user_memory')
            .upsert({
            user_id: userId,
            company_id: companyId,
            memory_type: type,
            memory_key: key,
            memory_value: value,
            context: context || {},
            hash_lock: hash,
            last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,company_id,memory_type,memory_key' })
            .select()
            .single();
        if (error) {
            console.warn('writeMemory Supabase error:', error.message);
            return null;
        }
        return data;
    }
    catch (e) {
        console.warn('writeMemory failed:', e);
        return null;
    }
}
/**
 * Read a memory record (localStorage first, then Supabase)
 */
export async function readMemory(type, key, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    // Try localStorage first for instant response
    const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
    try {
        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(lsKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                // Async refresh from Supabase (background sync)
                syncMemoryFromSupabase(type, key, userId, companyId).catch(() => { });
                return parsed.value;
            }
        }
    }
    catch { }
    return syncMemoryFromSupabase(type, key, userId, companyId);
}
async function syncMemoryFromSupabase(type, key, userId, companyId) {
    const client = getSupabaseClient();
    if (!client)
        return null;
    try {
        const { data, error } = await client
            .from('user_memory')
            .select('memory_value, context')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .eq('memory_type', type)
            .eq('memory_key', key)
            .single();
        if (error || !data)
            return null;
        // Update access timestamp
        await client
            .from('user_memory')
            .update({ last_accessed: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .eq('memory_type', type)
            .eq('memory_key', key);
        // Refresh localStorage cache
        const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(lsKey, JSON.stringify({ value: data.memory_value, context: data.context, ts: Date.now() }));
            }
        }
        catch { }
        return data.memory_value;
    }
    catch {
        return null;
    }
}
/**
 * Read all memories of a given type for a user
 */
export async function readMemoryByType(type, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    const client = getSupabaseClient();
    if (!client)
        return [];
    try {
        const { data } = await client
            .from('user_memory')
            .select('*')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .eq('memory_type', type)
            .order('last_accessed', { ascending: false });
        return (data || []);
    }
    catch {
        return [];
    }
}
/**
 * Delete a specific memory
 */
export async function deleteMemory(type, key, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(lsKey);
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return false;
    try {
        await client
            .from('user_memory')
            .delete()
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .eq('memory_type', type)
            .eq('memory_key', key);
        return true;
    }
    catch {
        return false;
    }
}
// ─── SustainWrite Section Operations ─────────────────────────────────────────
/**
 * Save a SustainWrite chapter (content + field values + documents)
 */
export async function saveSustainWriteSection(params) {
    const lsKey = `sw:${params.company_id}:${params.chapter_id}`;
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(lsKey, JSON.stringify({ ...params, ts: Date.now() }));
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return params;
    try {
        const hash = await computeMemoryHash(params);
        const { data, error } = await client
            .from('sustainwrite_sections')
            .upsert({
            company_id: params.company_id || DEFAULT_COMPANY,
            chapter_id: params.chapter_id,
            chapter_name: params.chapter_name,
            content: params.content || '',
            content_md: params.content_md || params.content || '',
            field_values: params.field_values || {},
            notes: params.notes || '',
            documents_state: params.documents_state || {},
            status: params.status || 'draft',
            chapter_order: params.chapter_order || 0,
            gri_references: params.gri_references || [],
            hash_lock: hash,
            input_snapshot: {
                field_values: params.field_values,
                saved_at: new Date().toISOString(),
            },
        }, { onConflict: 'company_id,chapter_id' })
            .select()
            .single();
        if (error) {
            console.warn('saveSustainWriteSection error:', error.message);
            return params;
        }
        return data;
    }
    catch {
        return params;
    }
}
/**
 * Load all SustainWrite sections for a company
 */
export async function loadSustainWriteSections(companyId = DEFAULT_COMPANY) {
    const client = getSupabaseClient();
    if (!client)
        return loadSWFromLocalStorage(companyId);
    try {
        const { data, error } = await client
            .from('sustainwrite_sections')
            .select('*')
            .eq('company_id', companyId)
            .order('chapter_order', { ascending: true });
        if (error || !data)
            return loadSWFromLocalStorage(companyId);
        return data;
    }
    catch {
        return loadSWFromLocalStorage(companyId);
    }
}
function loadSWFromLocalStorage(companyId) {
    const results = [];
    try {
        if (typeof localStorage !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(`sw:${companyId}:`)) {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    if (data.chapter_id)
                        results.push(data);
                }
            }
        }
    }
    catch { }
    return results.sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0));
}
/**
 * Load a single SustainWrite section
 */
export async function loadSustainWriteSection(chapterId, companyId = DEFAULT_COMPANY) {
    // localStorage first
    const lsKey = `sw:${companyId}:${chapterId}`;
    try {
        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(lsKey);
            if (cached)
                return JSON.parse(cached);
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return null;
    try {
        const { data } = await client
            .from('sustainwrite_sections')
            .select('*')
            .eq('company_id', companyId)
            .eq('chapter_id', chapterId)
            .single();
        if (data) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(lsKey, JSON.stringify(data));
                }
            }
            catch { }
        }
        return data;
    }
    catch {
        return null;
    }
}
export async function saveAIConversation(persona, messages, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    // localStorage
    const lsKey = `ai:${userId}:${companyId}:${persona}`;
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(lsKey, JSON.stringify({ messages, ts: Date.now() }));
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return;
    try {
        await client.from('ai_memory').upsert({
            user_id: userId,
            company_id: companyId,
            persona,
            messages,
            token_count: messages.reduce((s, m) => s + m.content.length, 0),
        }, { onConflict: 'user_id,company_id,persona' });
    }
    catch { }
}
export async function loadAIConversation(persona, userId = DEFAULT_USER, companyId = DEFAULT_COMPANY) {
    const lsKey = `ai:${userId}:${companyId}:${persona}`;
    try {
        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(lsKey);
            if (cached)
                return JSON.parse(cached).messages || [];
        }
    }
    catch { }
    const client = getSupabaseClient();
    if (!client)
        return [];
    try {
        const { data } = await client
            .from('ai_memory')
            .select('messages')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .eq('persona', persona)
            .single();
        return (data?.messages || []);
    }
    catch {
        return [];
    }
}
// ─── Preference Helpers ───────────────────────────────────────────────────────
export async function savePreference(key, value) {
    await writeMemory('preference', key, { value });
}
export async function loadPreference(key, defaultValue) {
    const mem = await readMemory('preference', key);
    return mem?.value ?? defaultValue;
}
// ─── Company Profile Helpers ──────────────────────────────────────────────────
export async function saveCompanyProfile(profile) {
    await writeMemory('company_profile', 'basic_info', profile);
}
export async function loadCompanyProfile() {
    return readMemory('company_profile', 'basic_info');
}
// ─── Field Value Helpers (for SustainWrite) ───────────────────────────────────
export async function saveFieldValues(chapterId, values) {
    await writeMemory('field_value', `editor.${chapterId}`, values);
}
export async function loadFieldValues(chapterId) {
    const mem = await readMemory('field_value', `editor.${chapterId}`);
    return mem || {};
}
//# sourceMappingURL=memory.js.map