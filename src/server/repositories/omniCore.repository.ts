// src/server/repositories/omniCore.repository.ts
import { supabase, handleSupabaseError } from '../lib/supabase';
import type { OmniCoreRecord } from '../../shared/types/omniCore.types';

export class OmniCoreRepository {
  /**
   * Upsert a core record. On conflict (componentId) it updates.
   */
  async upsert(record: OmniCoreRecord): Promise<OmniCoreRecord | undefined> {
    try {
      const { data, error } = await supabase
        .from('omni_core')
        .upsert([record], { onConflict: 'componentId' })
        .select()
        .single();
      if (error) handleSupabaseError(error);
      return data as OmniCoreRecord;
    } catch (e) {
      handleSupabaseError(e);
      return undefined;
    }
  }

  /** Retrieve core record by componentId */
  async getByComponentId(componentId: string): Promise<OmniCoreRecord | null> {
    try {
      const { data, error } = await supabase
        .from('omni_core')
        .select('*')
        .eq('componentId', componentId)
        .single();
      if (error) {
        // PGRST116 is Supabase "Row not found"
        if ((error as any).code === 'PGRST116') return null;
        handleSupabaseError(error);
      }
      return data as OmniCoreRecord;
    } catch (e) {
      handleSupabaseError(e);
      return null;
    }
  }
}
