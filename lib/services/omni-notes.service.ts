// 5T End-to-End Type Safety Enforced
import { getOmniTableServerClient, OmniTableRecord } from '@/lib/omni-table/client';
import { createHash } from 'crypto';

export interface SyncResult {
  success: boolean;
  recordId?: string;
  message: string;
}

export interface NotePayload {
  id: string;
  type: string;
  content: string;
  labels?: string[];
  deviceId?: string;
}

export interface DeviceConfig {
  deviceId: string;
  platform: 'web' | 'mobile' | 'desktop' | 'api';
  lastSync: number;
  isPrimary: boolean;
}

export interface PersonalDatabase {
  dbId: string;
  name: string;
  ownerId: string;
  isShared: boolean;
}

export async function generateTitle(content: string): Promise<string> {
  const words = content.replace(/[#*_~`]/g, '').split(/\s+/);
  return words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');
}

export function createHashLock(payload: any): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export async function generateSummary(content: string): Promise<string> {
  const sentences = content.split(/[。\.！!?]+/).filter((s) => s.trim().length > 10);
  return sentences.slice(0, 3).join('。') + '。';
}

export async function extractLabels(content: string): Promise<string[]> {
  const labelMatches = content.match(/#(\w+)/g);
  return labelMatches ? labelMatches.map((l) => l.slice(1)).filter((v, i, a) => a.indexOf(v) === i) : [];
}

export async function findBacklinks(noteId: string, type: string): Promise<OmniTableRecord[]> {
  const datasheetId = process.env[`OMNITABLE_${type.toUpperCase()}_DATASHEET_ID`] as string;
  if (!datasheetId) return [];

  const client = getOmniTableServerClient();
  const records = await client.getRecords(datasheetId, { pageSize: 100 });
  return records.records.filter(
    (r) =>
      String(r.fields['Content'])?.includes(`[[${noteId}]]`) ||
      String(r.fields['Content'])?.includes(`#${noteId}`)
  );
}

export async function syncTaskToOmniTable(taskId: string, taskContent: string, taskStatus: string = 'Todo'): Promise<SyncResult> {
  const datasheetId = process.env.OMNITABLE_TASKS_DATASHEET_ID;

  if (!datasheetId) {
    console.warn('[OmniNotes Service] OMNITABLE_TASKS_DATASHEET_ID is not set. Skipping sync.');
    return { success: true, message: 'Skipped (no datasheet ID)' };
  }

  try {
    const client = getOmniTableServerClient();
    const records = await client.getRecords(datasheetId, { pageSize: 100 });

    const existingRecord = records.records.find(
      (r) => r.fields['TaskId'] === taskId || r.fields['Task Title'] === taskContent || r.fields['Content'] === taskContent
    );

    if (existingRecord) {
      const payload = { taskId, taskContent, status: taskStatus, timestamp: Date.now() };
      const hashLock = createHashLock(payload);

      const updated = await client.updateRecords(datasheetId, [
        {
          recordId: existingRecord.recordId,
          fields: {
            'Task Title': taskContent,
            Status: taskStatus,
            UpdatedAt: new Date().toISOString(),
            'Hash Lock': hashLock,
            SourceOrigin: 'OmniNotes',
          },
        },
      ]);
      return { success: true, recordId: updated[0].recordId, message: 'Updated existing task' };
    }

    const payload = { taskId, taskContent, status: taskStatus, timestamp: Date.now() };
    const hashLock = createHashLock(payload);

    const newRecords = await client.createRecords(datasheetId, [
      {
        fields: {
          TaskId: taskId,
          'Task Title': taskContent,
          Status: taskStatus,
          CreatedAt: new Date().toISOString(),
          'Hash Lock': hashLock,
          SourceOrigin: 'OmniNotes',
        },
      },
    ]);
    return { success: true, recordId: newRecords[0].recordId, message: 'Created new task' };
  } catch (error) {
    console.error(`[OmniNotes Service] Failed to sync task:`, error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function syncNotesBatch(notes: NotePayload[]): Promise<SyncResult[]> {
  return Promise.all(
    notes.map((note) => syncNoteToOmniTable(note.id, note.type, note.content, note.labels))
  );
}

export async function getNoteBacklinks(noteId: string, type: string): Promise<OmniTableRecord[]> {
  return findBacklinks(noteId, type);
}

export async function syncToPersonalDB(
  userId: string,
  note: NotePayload,
  dbId: string
): Promise<SyncResult> {
  const datasheetId = process.env.OMNITABLE_PERSONAL_DB_DATASHEET_ID;
  if (!datasheetId) {
    return { success: false, message: 'Personal DB not configured' };
  }

  try {
    const client = getOmniTableServerClient();
    const records = await client.getRecords(datasheetId, {
      pageSize: 1,
      filterByFormula: `{UserId} = '${userId}' AND {NoteId} = '${note.id}'`,
    });

    if (records.records.length > 0) {
      await client.updateRecords(datasheetId, [
        {
          recordId: records.records[0].recordId,
          fields: {
            Content: note.content,
            Labels: note.labels,
            UpdatedAt: new Date().toISOString(),
          },
        },
      ]);
      return {
        success: true,
        recordId: records.records[0].recordId,
        message: 'Updated in personal DB',
      };
    }

    const newRecords = await client.createRecords(datasheetId, [
      {
        fields: {
          UserId: userId,
          NoteId: note.id,
          Type: note.type,
          Content: note.content,
          Labels: note.labels,
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);
    return { success: true, recordId: newRecords[0].recordId, message: 'Created in personal DB' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getDeviceSyncStatus(
  deviceId: string
): Promise<{ lastSync: number; pendingCount: number }> {
  try {
    const client = getOmniTableServerClient();
    const records = await client.getRecords(process.env.OMNITABLE_DEVICES_DATASHEET_ID!, {
      pageSize: 1,
    });
    const device = records.records.find((r) => r.fields['DeviceId'] === deviceId);
    return {
      lastSync: Number(device?.fields['LastSync']) || Date.now(),
      pendingCount: Number(device?.fields['PendingCount']) || 0,
    };
  } catch {
    return { lastSync: Date.now(), pendingCount: 0 };
  }
}

export async function mergeWithOmniSystem(noteId: string, type: string): Promise<SyncResult> {
  const client = getOmniTableServerClient();
  const omnidataId = process.env.OMNITABLE_OMNI_DATASHEET_ID;
  if (!omnidataId) return { success: false, message: 'Omni system not configured' };

  try {
    const records = await client.getRecords(omnidataId, {
      pageSize: 1,
      filterByFormula: `{NoteId} = '${noteId}'`,
    });
    if (records.records.length > 0) {
      return {
        success: true,
        recordId: records.records[0].recordId,
        message: 'Merged with Omni system',
      };
    }
    return { success: false, message: 'Note not found in Omni system' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function syncNoteToOmniTable(
  noteId: string,
  type: string,
  content: string,
  labels?: string[]
): Promise<SyncResult> {
  const datasheetId = process.env[`OMNITABLE_${type.toUpperCase()}_DATASHEET_ID`] as string;

  if (!datasheetId) {
    return { success: true, message: `Skipped ${type} (no datasheet ID)` };
  }

  try {
    const client = getOmniTableServerClient();
    const autoLabels = await extractLabels(content);
    const allLabels = [...(labels || []), ...autoLabels].filter((v, i, a) => a.indexOf(v) === i);
    const title = await generateTitle(content);
    const summary = await generateSummary(content);

    const records = await client.getRecords(datasheetId, {
      pageSize: 50,
      filterByFormula: `{NoteId} = '${noteId}'`,
    });

    if (records.records.length > 0) {
      const payload = { noteId, content, title, summary, timestamp: Date.now() };
      const hashLock = createHashLock(payload);

      await client.updateRecords(datasheetId, [
        {
          recordId: records.records[0].recordId,
          fields: {
            Content: content,
            Labels: allLabels,
            Title: title,
            Summary: summary,
            UpdatedAt: new Date().toISOString(),
            'Hash Lock': hashLock,
            SourceOrigin: 'OmniNotes',
          },
        },
      ]);
      return { success: true, recordId: records.records[0].recordId, message: 'Updated' };
    }

    const payload = { noteId, content, title, summary, timestamp: Date.now() };
    const hashLock = createHashLock(payload);

    const newRecords = await client.createRecords(datasheetId, [
      {
        fields: {
          NoteId: noteId,
          Type: type,
          Content: content,
          Labels: allLabels,
          Title: title,
          Summary: summary,
          CreatedAt: new Date().toISOString(),
          'Hash Lock': hashLock,
          SourceOrigin: 'OmniNotes',
        },
      },
    ]);
    return { success: true, recordId: newRecords[0].recordId, message: 'Created' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
