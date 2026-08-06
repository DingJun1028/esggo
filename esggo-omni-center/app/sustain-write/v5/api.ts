/**
 * app/sustain-write/v5/api.ts — Sustain Write v5 API Helpers
 */

import type { Company, NoteData, CustomCompanyForm, TaskProgress, EvidenceCard } from './types';
import { CUSTOM_COMPANY_ID } from './types';

// ── localStorage Helpers ──────────────────────────────────────

const CUSTOM_COMPANIES_KEY = 'esggo_custom_companies';

export function loadCustomCompanies(): CustomCompanyForm[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_COMPANIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCompanies(companies: CustomCompanyForm[]) {
  try {
    localStorage.setItem(CUSTOM_COMPANIES_KEY, JSON.stringify(companies));
  } catch { /* ignore */ }
}

// ── API Functions ─────────────────────────────────────────────

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const res = await fetch('/api/sustain-write/v5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || !Array.isArray(data.companies)) {
      throw new Error('回應格式不正確：缺少 companies 陣列');
    }
    return data.companies;
  } catch (err) {
    const msg = err instanceof Error ? err.message : '無法載入公司列表';
    throw new Error(msg);
  }
}

export async function fetchNotes(): Promise<NoteData[]> {
  try {
    const res = await fetch('/api/notes');
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.notes || [];
  } catch {
    return [];
  }
}

export async function startAsyncReport(
  companyId: string,
  templateId: string,
  noteIds?: string[],
  customCompany?: CustomCompanyForm
): Promise<{ taskId: string }> {
  const res = await fetch('/api/sustain-write/v5/async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyId,
      templateId,
      ...(noteIds && noteIds.length > 0 ? { noteIds } : {}),
      ...(companyId === CUSTOM_COMPANY_ID && customCompany ? { customCompany } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function pollTaskProgress(taskId: string): Promise<TaskProgress> {
  const res = await fetch(`/api/sustain-write/v5/progress/${taskId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data?.data || data;
}

export async function cancelTask(taskId: string): Promise<void> {
  await fetch(`/api/sustain-write/v5/progress/${taskId}`, { method: 'DELETE' });
}

export async function fetchEvidence(companyId: string): Promise<EvidenceCard[]> {
  const res = await fetch(`/api/sustain-write/v5/evidence?companyId=${companyId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data?.evidence || [];
}

export function getDownloadUrl(companyId: string, format: 'html' | 'md'): string {
  return `/api/sustain-write/v5/download?companyId=${companyId}&format=${format}`;
}

export function getPreviewUrl(companyId: string, format: 'html' | 'md'): string {
  return `/api/sustain-write/v5/preview?companyId=${companyId}&format=${format}`;
}
