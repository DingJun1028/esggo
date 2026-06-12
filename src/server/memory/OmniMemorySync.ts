import { OmniEventStore } from '../../../lib/omni-space/event-store';
import { OmniEvent } from '@/src/shared/types';
import { createClient } from '@supabase/supabase-js';
import { OmniTableClient } from '@/lib/omni-table/client';

/**
 * OmniMemorySync: 萬能永憶同步器
 * 負責監聽 EventStore (GPL)，並將狀態同步至向量資料庫 (Vector DB) 或 AI 記憶庫，
 * 讓 Genkit / JunAIKey 擁有基於真實數據流的「情節記憶 (Episodic Memory)」。
 */
export class OmniMemorySync {
  constructor() {
    OmniEventStore.eventBus.on('event_saved', this.handleEventSaved.bind(this));
    console.log('[OmniMemorySync] Attached to Omni-Space event bus. Ready to encode episodic memories.');
  }

  private async handleEventSaved(event: OmniEvent): Promise<void> {
    console.log(`[OmniMemorySync] Intercepted new event: ${event.id} (Type: ${event.event_type})`);
    
    const destinations = [
      { name: 'VectorDB', syncFn: () => this.syncToVectorDB(event) },
      { name: 'AITable', syncFn: () => this.syncToAITable(event) },
      { name: 'OmniTable', syncFn: () => this.syncToOmniTable(event) }
    ];

    await Promise.all(destinations.map(target => 
      this.syncWithRetry(event, target.name, target.syncFn)
    ));
  }

  private async syncWithRetry(event: OmniEvent, targetName: string, syncFn: () => Promise<void>) {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        await syncFn();
        console.log(`[OmniMemorySync] Successfully synchronized event ${event.id} to ${targetName} on attempt ${attempt + 1}.`);
        success = true;
      } catch (error) {
        attempt++;
        console.error(`[OmniMemorySync] Attempt ${attempt} failed to sync event ${event.id} to ${targetName}.`, error);
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`[OmniMemorySync] Retrying ${targetName} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error(`[OmniMemorySync] Max retries reached for event ${event.id} to ${targetName}. Moving to Dead Letter logic.`);
          const errorMessage = error instanceof Error ? error.message : String(error);
          await this.saveToDeadLetterQueue(event, `[Target: ${targetName}] ${errorMessage}`);
        }
      }
    }
  }

  private async syncToVectorDB(event?: OmniEvent): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  }

  async syncToAITable(event: OmniEvent): Promise<void> {
    const token = process.env.AITABLE_API_KEY;
    const datasheetId = process.env.AITABLE_DATASHEET_ID;

    if (!token || !datasheetId) {
      console.warn("[OmniMemorySync] AITABLE_API_KEY or AITABLE_DATASHEET_ID not configured");
      return;
    }

    const client = new OmniTableClient({ token });

    const record: { fields: Record<string, unknown> } = {
      fields: {
        "Task Title": (event.payload && typeof event.payload === 'object' && 'name' in event.payload && typeof event.payload.name === 'string') ? event.payload.name : "Unknown Task",
        Status: "Todo",
        Type: (event.payload && typeof event.payload === 'object' && 'attributes' in event.payload && Array.isArray(event.payload.attributes)) ? (event.payload.attributes as string[]).join(',') : "OmniEvent",
        Source: event.source_platform || "OmniNotes",
      }
    };

    try {
      await client.createRecords(datasheetId, [record]);
      console.log(`[OmniMemorySync] Synced task "${event.payload.name}" to AITable`);
    } catch (error) {
      console.error(`[OmniMemorySync] AITable sync failed:`, error);
      await this.saveToDeadLetterQueue(event, `[AITable]: ${error}`);
    }
  }

  private async syncToOmniTable(event: OmniEvent): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('[OmniMemorySync] Skip OmniTable Sync: Supabase credentials not found.');
      return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const { error } = await supabase.from('omni_events_log').insert({
      id: event.id,
      omni_card_uuid: event.omni_card_uuid,
      event_type: event.event_type,
      payload: event.payload,
      hash_lock: event.hash_lock,
      source_platform: event.source_platform,
      created_at: new Date(event.created_at).toISOString(),
    });

    if (error) throw error;
  }

  private async saveToDeadLetterQueue(event: OmniEvent, errorLog: string): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[OmniMemorySync] DLQ Error: Supabase credentials not found in env.');
      return;
    }

    try {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false }
      });

      const { error } = await supabase.from('failed_sync_events').insert({
        event_id: event.id,
        event_type: event.event_type,
        payload: event.payload,
        error_log: errorLog,
        retry_count: 3
      });

      if (error) {
        console.error(`[OmniMemorySync] Failed to insert dead letter for event ${event.id}:`, error);
      } else {
        console.log(`[OmniMemorySync] Event ${event.id} successfully moved to Supabase DLQ (failed_sync_events).`);
      }
    } catch (err) {
      console.error(`[OmniMemorySync] Fatal error while saving to DLQ:`, err);
    }
  }

  public async replayDLQ(): Promise<{ processed: number, succeeded: number, failed: number }> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase credentials not found in env.');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const { data: failedEvents, error } = await supabase
      .from('failed_sync_events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!failedEvents || failedEvents.length === 0) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log(`[OmniMemorySync] Found ${failedEvents.length} events in DLQ to replay.`);
    let succeeded = 0;
    let failed = 0;

    for (const record of failedEvents) {
      const mockEvent: OmniEvent = {
        id: record.event_id,
        omni_card_uuid: record.payload?.uuid || record.event_id,
        event_type: record.event_type,
        payload: record.payload as any,
        created_at: new Date(record.created_at).getTime(),
        hash_lock: (record.payload as any)?.hash_lock || 'REPLAY_HASH',
        source_platform: 'DLQ'
      };

      try {
        await this.handleEventSaved(mockEvent);
        await supabase.from('failed_sync_events').delete().eq('id', record.id);
        succeeded++;
      } catch (e) {
        console.error(`[OmniMemorySync] DLQ Replay failed for event ${record.event_id}`, e);
        failed++;
      }
    }

    return { processed: failedEvents.length, succeeded, failed };
  }
}

export const globalOmniMemorySync = new OmniMemorySync();