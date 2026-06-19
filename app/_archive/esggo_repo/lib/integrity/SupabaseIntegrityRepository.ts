import { IIntegrityRepository, IntegrityRecord } from './IIntegrityRepository';
import { supabase } from '../supabase';

// In-memory fallback when Supabase unavailable
const memoryStore = new Map<string, IntegrityRecord>();

export class SupabaseIntegrityRepository implements IIntegrityRepository {
    async saveRecord(record: IntegrityRecord): Promise<void> {
        console.log(`[Repository] Saving integrity record: ${record.id}`);
        
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!url || !key) {
            console.log(`[Repository] Supabase unavailable, using memory fallback.`);
            memoryStore.set(record.id, record);
            return;
        }
        
        try {
            await supabase.from('integrity_logs').insert(record);
        } catch (error) {
            console.warn('[Repository] DB save failed, falling back to memory:', error);
            memoryStore.set(record.id, record);
        }
    }

    async getRecord(id: string): Promise<IntegrityRecord | null> {
        console.log(`[Repository] Fetching integrity record: ${id}`);
        
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!url || !key) {
            return memoryStore.get(id) ?? null;
        }
        
        try {
            const { data } = await supabase.from('integrity_logs').select('*').eq('id', id).single();
            return data as IntegrityRecord | null;
        } catch {
            return memoryStore.get(id) ?? null;
        }
    }

    async verifyHash(id: string, currentHash: string): Promise<boolean> {
        const record = await this.getRecord(id);
        if (!record) return false;
        return record.hash === currentHash;
    }
}