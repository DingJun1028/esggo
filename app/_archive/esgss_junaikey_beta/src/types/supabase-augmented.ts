
import { Database as GeneratedDatabase } from './supabase';

/**
 * 💡 Best Practice: Augmented Database Types
 * -----------------------------------------
 * These types extend the auto-generated Supabase types to include tables
 * that are present in the live database but missing from the local generated file.
 */

export type AugmentedDatabase = Omit<GeneratedDatabase, 'public'> & {
    public: Omit<GeneratedDatabase['public'], 'Tables'> & {
        Tables: GeneratedDatabase['public']['Tables'] & {
            // Intelligence Domain
            intelligence_items: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            daily_briefs: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            trend_predictions: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_categories: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_sources: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_tags: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_analysis: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_notifications: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            intelligence_user_preferences: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            regulation_updates: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };

            // Omni Domain
            omni_space_entities: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            omni_tables: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            omni_table_rows: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            knowledge: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            knowledge_sync_status: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            omni_evolution_log: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            crystal_knowledge_mapping: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
            occ_cores: {
                Row: any;
                Insert: any;
                Update: any;
                Relationships: any[];
            };
        };
    };
}
