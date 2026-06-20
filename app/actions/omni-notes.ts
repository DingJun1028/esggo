'use server';

import {
  syncTaskToOmniTable,
  syncNotesBatch,
  SyncResult,
  NotePayload,
  generateTitle,
  generateSummary,
  extractLabels,
  findBacklinks,
  syncToPersonalDB,
  getDeviceSyncStatus,
  mergeWithOmniSystem,
  fetchTasksFromNCB,
} from '@/lib/services/omni-notes.service';

export async function syncTaskAction(taskId: string, content: string, status: string = 'Todo'): Promise<SyncResult> {
  console.log(`[OmniNotes Action] Syncing task: ${taskId} with status ${status}`);
  return syncTaskToOmniTable(taskId, content, status);
}

export async function fetchTasksFromNCBAction() {
  return fetchTasksFromNCB();
}

export async function syncNotesBatchAction(notes: NotePayload[]): Promise<SyncResult[]> {
  console.log(`[OmniNotes Action] Syncing batch: ${notes.length} notes`);
  return syncNotesBatch(notes);
}

export async function generateTitleAction(content: string): Promise<string> {
  return generateTitle(content);
}

export async function generateSummaryAction(content: string): Promise<string> {
  return generateSummary(content);
}

export async function extractLabelsAction(content: string): Promise<string[]> {
  return extractLabels(content);
}

export async function getBacklinksAction(noteId: string, type: string) {
  const backlinks = await findBacklinks(noteId, type);
  return backlinks.map((r) => ({
    id: r.recordId,
    title: r.fields['Title'] || r.fields['Task Title'],
  }));
}

export async function syncToPersonalDBAction(
  userId: string,
  note: NotePayload,
  dbId: string
): Promise<SyncResult> {
  return syncToPersonalDB(userId, note, dbId);
}

export async function getDeviceSyncStatusAction(
  deviceId: string
): Promise<{ lastSync: number; pendingCount: number }> {
  return getDeviceSyncStatus(deviceId);
}

export async function mergeWithOmniSystemAction(noteId: string, type: string): Promise<SyncResult> {
  return mergeWithOmniSystem(noteId, type);
}
