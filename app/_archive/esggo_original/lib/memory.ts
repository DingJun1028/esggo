import { getSupabaseClient } from './supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MemoryType =
  | 'field_value'
  | 'chapter_progress'
  | 'preference'
  | 'document_state'
  | 'session_context'
  | 'ai_conversation'
  | 'company_profile'
  | 'esg_target'
  | 'template_usage'
  | 'search_history';

export interface MemoryRecord {
  id?: string;
  user_id: string;
  company_id: string;
  memory_type: MemoryType;
  memory_key: string;
  memory_value: Record<string, any>;
  context?: Record<string, any>;
  hash_lock?: string;
  version?: number;
  last_accessed?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SustainWriteSection {
  id?: string;
  company_id: string;
  chapter_id: string;
  chapter_name: string;
  content?: string;
  content_md?: string;
  field_values?: Record<string, any>;
  notes?: string;
  documents_state?: Record<string, boolean>;
  status?: 'empty' | 'draft' | 'reviewing' | 'completed';
  chapter_order?: number;
  gri_references?: string[];
  hash_lock?: string;
  updated_at?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_USER = 'default';
const DEFAULT_COMPANY = 'default';

// ─── Hash Utility ────────────────────────────────────────────────────────────

async function computeMemoryHash(data: unknown): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const buf = encoder.encode(JSON.stringify(data) + Date.now());
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return 'sha256:' + Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'sha256:' + Math.random().toString(16).slice(2, 34);
  }
}

// ─── Core Memory Operations ───────────────────────────────────────────────────

/**
 * Write a memory record (upsert)
 */
export async function writeMemory(
  type: MemoryType,
  key: string,
  value: Record<string, any>,
  context?: Record<string, any>,
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<MemoryRecord | null> {
  // Always persist to localStorage for instant access
  const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
  try {
    localStorage.setItem(lsKey, JSON.stringify({ value, context, ts: Date.now() }));
  } catch {}

  const client = getSupabaseClient();
  if (!client) return null;

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
    return data as MemoryRecord;
  } catch (e) {
    console.warn('writeMemory failed:', e);
    return null;
  }
}

/**
 * Read a memory record (localStorage first, then Supabase)
 */
export async function readMemory(
  type: MemoryType,
  key: string,
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<Record<string, any> | null> {
  // Try localStorage first for instant response
  const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
  try {
    const cached = localStorage.getItem(lsKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Async refresh from Supabase (background sync)
      syncMemoryFromSupabase(type, key, userId, companyId).catch(() => {});
      return parsed.value;
    }
  } catch {}

  return syncMemoryFromSupabase(type, key, userId, companyId);
}

async function syncMemoryFromSupabase(
  type: MemoryType,
  key: string,
  userId: string,
  companyId: string
): Promise<Record<string, any> | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('user_memory')
      .select('memory_value, context')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('memory_type', type)
      .eq('memory_key', key)
      .single();

    if (error || !data) return null;

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
      localStorage.setItem(lsKey, JSON.stringify({ value: data.memory_value, context: data.context, ts: Date.now() }));
    } catch {}

    return data.memory_value;
  } catch {
    return null;
  }
}

/**
 * Read all memories of a given type for a user
 */
export async function readMemoryByType(
  type: MemoryType,
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<MemoryRecord[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from('user_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('memory_type', type)
      .order('last_accessed', { ascending: false });

    return (data || []) as MemoryRecord[];
  } catch {
    return [];
  }
}

/**
 * Delete a specific memory
 */
export async function deleteMemory(
  type: MemoryType,
  key: string,
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<boolean> {
  const lsKey = `memory:${userId}:${companyId}:${type}:${key}`;
  try { localStorage.removeItem(lsKey); } catch {}

  const client = getSupabaseClient();
  if (!client) return false;

  try {
    await client
      .from('user_memory')
      .delete()
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('memory_type', type)
      .eq('memory_key', key);
    return true;
  } catch {
    return false;
  }
}

// ─── SustainWrite Section Operations ─────────────────────────────────────────

/**
 * Save a SustainWrite chapter (content + field values + documents)
 */
export async function saveSustainWriteSection(params: SustainWriteSection): Promise<SustainWriteSection | null> {
  const lsKey = `sw:${params.company_id}:${params.chapter_id}`;
  try {
    localStorage.setItem(lsKey, JSON.stringify({ ...params, ts: Date.now() }));
  } catch {}

  const client = getSupabaseClient();
  if (!client) return params;

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
    return data as SustainWriteSection;
  } catch {
    return params;
  }
}

/**
 * Load all SustainWrite sections for a company
 */
export async function loadSustainWriteSections(
  companyId = DEFAULT_COMPANY
): Promise<SustainWriteSection[]> {
  const client = getSupabaseClient();
  if (!client) return loadSWFromLocalStorage(companyId);

  try {
    const { data, error } = await client
      .from('sustainwrite_sections')
      .select('*')
      .eq('company_id', companyId)
      .order('chapter_order', { ascending: true });

    if (error || !data) return loadSWFromLocalStorage(companyId);
    return data as SustainWriteSection[];
  } catch {
    return loadSWFromLocalStorage(companyId);
  }
}

function loadSWFromLocalStorage(companyId: string): SustainWriteSection[] {
  const results: SustainWriteSection[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`sw:${companyId}:`)) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.chapter_id) results.push(data);
      }
    }
  } catch {}
  return results.sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0));
}

/**
 * Load a single SustainWrite section
 */
export async function loadSustainWriteSection(
  chapterId: string,
  companyId = DEFAULT_COMPANY
): Promise<SustainWriteSection | null> {
  // localStorage first
  const lsKey = `sw:${companyId}:${chapterId}`;
  try {
    const cached = localStorage.getItem(lsKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data } = await client
      .from('sustainwrite_sections')
      .select('*')
      .eq('company_id', companyId)
      .eq('chapter_id', chapterId)
      .single();

    if (data) {
      try { localStorage.setItem(lsKey, JSON.stringify(data)); } catch {}
    }
    return data as SustainWriteSection | null;
  } catch {
    return null;
  }
}

// ─── AI Memory Operations ─────────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: string;
}

export async function saveAIConversation(
  persona: string,
  messages: AIMessage[],
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<void> {
  // localStorage
  const lsKey = `ai:${userId}:${companyId}:${persona}`;
  try { localStorage.setItem(lsKey, JSON.stringify({ messages, ts: Date.now() })); } catch {}

  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('ai_memory').upsert({
      user_id: userId,
      company_id: companyId,
      persona,
      messages,
      token_count: messages.reduce((s, m) => s + m.content.length, 0),
    }, { onConflict: 'user_id,company_id,persona' });
  } catch {}
}

export async function loadAIConversation(
  persona: string,
  userId = DEFAULT_USER,
  companyId = DEFAULT_COMPANY
): Promise<AIMessage[]> {
  const lsKey = `ai:${userId}:${companyId}:${persona}`;
  try {
    const cached = localStorage.getItem(lsKey);
    if (cached) return JSON.parse(cached).messages || [];
  } catch {}

  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from('ai_memory')
      .select('messages')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('persona', persona)
      .single();

    return (data?.messages || []) as AIMessage[];
  } catch {
    return [];
  }
}

// ─── Preference Helpers ───────────────────────────────────────────────────────

export async function savePreference(key: string, value: unknown): Promise<void> {
  await writeMemory('preference', key, { value });
}

export async function loadPreference<T = unknown>(key: string, defaultValue?: T): Promise<T> {
  const mem = await readMemory('preference', key);
  return (mem?.value as T) ?? (defaultValue as T);
}

// ─── Company Profile Helpers ──────────────────────────────────────────────────

export async function saveCompanyProfile(profile: Record<string, any>): Promise<void> {
  await writeMemory('company_profile', 'basic_info', profile);
}

export async function loadCompanyProfile(): Promise<Record<string, any> | null> {
  return readMemory('company_profile', 'basic_info');
}

// ─── Field Value Helpers (for SustainWrite) ───────────────────────────────────

export async function saveFieldValues(
  chapterId: string,
  values: Record<string, string>
): Promise<void> {
  await writeMemory('field_value', `editor.${chapterId}`, values);
}

export async function loadFieldValues(chapterId: string): Promise<Record<string, string>> {
  const mem = await readMemory('field_value', `editor.${chapterId}`);
  return (mem as Record<string, string>) || {};
}