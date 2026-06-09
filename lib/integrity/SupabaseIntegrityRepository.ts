import { IIntegrityRepository, IntegrityRecord } from './IIntegrityRepository';
import { getSupabaseClient } from '../supabase'; // Import the function

// In-memory fallback when Supabase unavailable
const memoryStore = new Map<string, IntegrityRecord>();

export class SupabaseIntegrityRepository implements IIntegrityRepository {
    async saveRecord(record: IntegrityRecord): Promise<void> {
        console.log(`[Repository] Saving integrity record: ${record.id}`);
        
        try {
            const supabase = getSupabaseClient(); // Get client here
            await supabase.from('integrity_logs').insert(record);
        } catch (error) {
            console.warn('[Repository] DB save failed, falling back to memory:', error);
            memoryStore.set(record.id, record);
        }
    }

    async getRecord(id: string): Promise<IntegrityRecord | null> {
        console.log(`[Repository] Fetching integrity record: ${id}`);
        
        try {
            const supabase = getSupabaseClient(); // Get client here
            const { data } = await supabase.from('integrity_logs').select('*').eq('id', id).single();
            return data as IntegrityRecord | null;
        } catch (error) {
            console.warn('[Repository] DB fetch failed, falling back to memory:', error);
            return memoryStore.get(id) ?? null;
        }
    }

    async verifyHash(id: string, currentHash: string): Promise<boolean> {
        const record = await this.getRecord(id);
        if (!record) return false;
        return record.hash === currentHash;
    }
}