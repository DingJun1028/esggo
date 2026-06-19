export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_type: string
          actor_email: string | null
          actor_id: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_user_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      adk_research_logs: {
        Row: {
          created_at: string | null
          id: string
          query: string
          refined_query: string | null
          result: Json | null
          session_id: string
          state: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          refined_query?: string | null
          result?: Json | null
          session_id: string
          state: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          refined_query?: string | null
          result?: Json | null
          session_id?: string
          state?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      adk_sentient_lineage: {
        Row: {
          agent_name: string
          created_at: string | null
          id: string
          innovation_delta: string | null
          metadata: Json | null
          phase: string
          query: string
          session_id: string
          thought_process: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          id?: string
          innovation_delta?: string | null
          metadata?: Json | null
          phase: string
          query: string
          session_id: string
          thought_process?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          id?: string
          innovation_delta?: string | null
          metadata?: Json | null
          phase?: string
          query?: string
          session_id?: string
          thought_process?: string | null
        }
        Relationships: []
      }
      admin_candidates: {
        Row: {
          audit: Json | null
          created_at: string | null
          email: string | null
          id: string
          reason: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audit?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audit?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_configurations: {
        Row: {
          id: string
          traits: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          traits?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          traits?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_skills: {
        Row: {
          agent_id: string
          assigned_at: string | null
          custom_config: Json | null
          enabled: boolean | null
          skill_id: string
        }
        Insert: {
          agent_id: string
          assigned_at?: string | null
          custom_config?: Json | null
          enabled?: boolean | null
          skill_id: string
        }
        Update: {
          agent_id?: string
          assigned_at?: string | null
          custom_config?: Json | null
          enabled?: boolean | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_skills_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_full_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skills_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          base_model: string | null
          context_strategy: string | null
          created_at: string | null
          description: string | null
          id: string
          max_tokens: number | null
          metadata: Json | null
          name: string
          system_prompt: string
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          base_model?: string | null
          context_strategy?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_tokens?: number | null
          metadata?: Json | null
          name: string
          system_prompt: string
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          base_model?: string | null
          context_strategy?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_tokens?: number | null
          metadata?: Json | null
          name?: string
          system_prompt?: string
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_companions: {
        Row: {
          ai_name: string
          ai_type: string | null
          battle_strategy: Json | null
          created_at: string | null
          experience: number | null
          id: string
          level: number | null
          personality: string | null
          preferred_deck_id: string | null
          total_battles: number | null
          training_data: Json | null
          updated_at: string | null
          user_id: string
          virtue_benevolence: number | null
          virtue_courage: number | null
          virtue_harmony: number | null
          virtue_integrity: number | null
          virtue_intelligence: number | null
          virtue_temperance: number | null
          win_count: number | null
        }
        Insert: {
          ai_name: string
          ai_type?: string | null
          battle_strategy?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          personality?: string | null
          preferred_deck_id?: string | null
          total_battles?: number | null
          training_data?: Json | null
          updated_at?: string | null
          user_id: string
          virtue_benevolence?: number | null
          virtue_courage?: number | null
          virtue_harmony?: number | null
          virtue_integrity?: number | null
          virtue_intelligence?: number | null
          virtue_temperance?: number | null
          win_count?: number | null
        }
        Update: {
          ai_name?: string
          ai_type?: string | null
          battle_strategy?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          personality?: string | null
          preferred_deck_id?: string | null
          total_battles?: number | null
          training_data?: Json | null
          updated_at?: string | null
          user_id?: string
          virtue_benevolence?: number | null
          virtue_courage?: number | null
          virtue_harmony?: number | null
          virtue_integrity?: number | null
          virtue_intelligence?: number | null
          virtue_temperance?: number | null
          win_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_companions_preferred_deck_id_fkey"
            columns: ["preferred_deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged: boolean | null
          alert_type: string | null
          created_at: string | null
          details: Json | null
          id: string
          outbox_id: string | null
        }
        Insert: {
          acknowledged?: boolean | null
          alert_type?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          outbox_id?: string | null
        }
        Update: {
          acknowledged?: boolean | null
          alert_type?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          outbox_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_user_roles: {
        Row: {
          action: string
          details: Json | null
          id: string
          performed_at: string | null
          performed_by: string | null
          user_role_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          user_role_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          user_role_id?: string | null
        }
        Relationships: []
      }
      battle_records: {
        Row: {
          battle_duration_seconds: number | null
          battle_log: Json
          battle_type: string
          created_at: string | null
          crystal_hash: string
          difficulty: string | null
          evidence: Json
          id: string
          player1_deck_id: string | null
          player1_id: string
          player2_deck_id: string | null
          player2_id: string | null
          rewards: Json | null
          total_rounds: number | null
          virtue_scores: Json | null
          winner_id: string | null
        }
        Insert: {
          battle_duration_seconds?: number | null
          battle_log?: Json
          battle_type: string
          created_at?: string | null
          crystal_hash: string
          difficulty?: string | null
          evidence?: Json
          id?: string
          player1_deck_id?: string | null
          player1_id: string
          player2_deck_id?: string | null
          player2_id?: string | null
          rewards?: Json | null
          total_rounds?: number | null
          virtue_scores?: Json | null
          winner_id?: string | null
        }
        Update: {
          battle_duration_seconds?: number | null
          battle_log?: Json
          battle_type?: string
          created_at?: string | null
          crystal_hash?: string
          difficulty?: string | null
          evidence?: Json
          id?: string
          player1_deck_id?: string | null
          player1_id?: string
          player2_deck_id?: string | null
          player2_id?: string | null
          rewards?: Json | null
          total_rounds?: number | null
          virtue_scores?: Json | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_records_player1_deck_id_fkey"
            columns: ["player1_deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_records_player2_deck_id_fkey"
            columns: ["player2_deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      behavioral_events: {
        Row: {
          created_at: string
          data_hash: string
          event_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_hash: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_hash?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      boost_space_sync_log: {
        Row: {
          boost_space_id: string | null
          conflict_data: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          error_message: string | null
          id: string
          last_retry_at: string | null
          retry_count: number | null
          sync_direction: string
          sync_status: string
          synced_at: string | null
        }
        Insert: {
          boost_space_id?: string | null
          conflict_data?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          id?: string
          last_retry_at?: string | null
          retry_count?: number | null
          sync_direction: string
          sync_status: string
          synced_at?: string | null
        }
        Update: {
          boost_space_id?: string | null
          conflict_data?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          id?: string
          last_retry_at?: string | null
          retry_count?: number | null
          sync_direction?: string
          sync_status?: string
          synced_at?: string | null
        }
        Relationships: []
      }
      carbon_data: {
        Row: {
          confidence_score: number | null
          consumption_unit: string
          consumption_value: number
          created_at: string | null
          created_by: string | null
          data_source: string | null
          emission_factor: number | null
          emissions_co2e: number
          id: string
          organization_id: string | null
          reporting_period: string
          scope: number
          source_type: string
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          consumption_unit: string
          consumption_value: number
          created_at?: string | null
          created_by?: string | null
          data_source?: string | null
          emission_factor?: number | null
          emissions_co2e: number
          id?: string
          organization_id?: string | null
          reporting_period: string
          scope: number
          source_type: string
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          consumption_unit?: string
          consumption_value?: number
          created_at?: string | null
          created_by?: string | null
          data_source?: string | null
          emission_factor?: number | null
          emissions_co2e?: number
          id?: string
          organization_id?: string | null
          reporting_period?: string
          scope?: number
          source_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      chain_anchors: {
        Row: {
          created_at: string | null
          data_hash: string
          id: number
          status: string | null
          tx_hash: string
        }
        Insert: {
          created_at?: string | null
          data_hash: string
          id?: number
          status?: string | null
          tx_hash: string
        }
        Update: {
          created_at?: string | null
          data_hash?: string
          id?: number
          status?: string | null
          tx_hash?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_user_id: string | null
          content: string | null
          created_at: string | null
          id: string
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_user_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_user_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_user_id_fkey"
            columns: ["author_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string | null
          agent_response: string | null
          created_at: string | null
          id: string
          rag_context: Json | null
          response_time_ms: number | null
          session_id: string
          skill_calls: Json | null
          thought_process: string | null
          tokens_used: number | null
          user_message: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_response?: string | null
          created_at?: string | null
          id?: string
          rag_context?: Json | null
          response_time_ms?: number | null
          session_id: string
          skill_calls?: Json | null
          thought_process?: string | null
          tokens_used?: number | null
          user_message?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_response?: string | null
          created_at?: string | null
          id?: string
          rag_context?: Json | null
          response_time_ms?: number | null
          session_id?: string
          skill_calls?: Json | null
          thought_process?: string | null
          tokens_used?: number | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_full_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_factor_organization_map: {
        Row: {
          created_at: string | null
          emission_factor_id: string
          id: string
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          emission_factor_id: string
          id?: string
          organization_id: string
        }
        Update: {
          created_at?: string | null
          emission_factor_id?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emission_factor_organization_map_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_factor_organization_map_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_factors: {
        Row: {
          factor: number
          id: string
          metric_code: string
          source: string | null
          unit_from: string
          unit_to: string
          year: number
        }
        Insert: {
          factor: number
          id?: string
          metric_code: string
          source?: string | null
          unit_from: string
          unit_to: string
          year: number
        }
        Update: {
          factor?: number
          id?: string
          metric_code?: string
          source?: string | null
          unit_from?: string
          unit_to?: string
          year?: number
        }
        Relationships: []
      }
      esg_data: {
        Row: {
          company_name: string
          created_at: string | null
          details: Json | null
          environmental_score: number | null
          governance_score: number | null
          id: string
          overall_score: number | null
          report_date: string
          social_score: number | null
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          details?: Json | null
          environmental_score?: number | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          report_date: string
          social_score?: number | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          details?: Json | null
          environmental_score?: number | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          report_date?: string
          social_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      esg_embeddings: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          payload: Json | null
          report_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          report_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          report_id?: string | null
        }
        Relationships: []
      }
      esg_evidence: {
        Row: {
          file_name: string
          file_type: string | null
          id: string
          reading_id: string | null
          storage_path: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_type?: string | null
          id?: string
          reading_id?: string | null
          storage_path: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_type?: string | null
          id?: string
          reading_id?: string | null
          storage_path?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_evidence_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "esg_readings"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_insights: {
        Row: {
          body: string | null
          company_id: string | null
          created_at: string
          created_by: string | null
          id: string
          insight_type: string | null
          metadata: Json | null
          organization_id: string | null
          report_id: string | null
          score: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          organization_id?: string | null
          report_id?: string | null
          score?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          organization_id?: string | null
          report_id?: string | null
          score?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_insights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_insights_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_insights_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_insights_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_insights_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "esg_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_metrics: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          metric_key: string
          metric_unit: string | null
          metric_value: number
          organization_id: string | null
          reporting_period: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          metric_key: string
          metric_unit?: string | null
          metric_value: number
          organization_id?: string | null
          reporting_period?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          metric_key?: string
          metric_unit?: string | null
          metric_value?: number
          organization_id?: string | null
          reporting_period?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_metrics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_readings: {
        Row: {
          approved_by: string | null
          calculated_value: number | null
          created_at: string | null
          created_by: string | null
          factor_used: number | null
          id: string
          metric_id: string
          org_unit_id: string
          period_end: string
          period_start: string
          period_type: string | null
          status: string | null
          target_value: number | null
          updated_at: string | null
          value: number
        }
        Insert: {
          approved_by?: string | null
          calculated_value?: number | null
          created_at?: string | null
          created_by?: string | null
          factor_used?: number | null
          id?: string
          metric_id: string
          org_unit_id: string
          period_end: string
          period_start: string
          period_type?: string | null
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
          value: number
        }
        Update: {
          approved_by?: string | null
          calculated_value?: number | null
          created_at?: string | null
          created_by?: string | null
          factor_used?: number | null
          id?: string
          metric_id?: string
          org_unit_id?: string
          period_end?: string
          period_start?: string
          period_type?: string | null
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "esg_readings_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metric_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_readings_org_unit_id_fkey"
            columns: ["org_unit_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_reports: {
        Row: {
          completion_score: number | null
          created_at: string | null
          created_by: string | null
          file_url: string | null
          framework: string
          generated_by: string | null
          id: string
          organization_id: string | null
          page_count: number | null
          report_name: string
          reporting_period: string | null
          sections_included: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completion_score?: number | null
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          framework: string
          generated_by?: string | null
          id?: string
          organization_id?: string | null
          page_count?: number | null
          report_name: string
          reporting_period?: string | null
          sections_included?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completion_score?: number | null
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          framework?: string
          generated_by?: string | null
          id?: string
          organization_id?: string | null
          page_count?: number | null
          report_name?: string
          reporting_period?: string | null
          sections_included?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_scores: {
        Row: {
          company_id: string | null
          created_at: string | null
          environment_score: number | null
          governance_score: number | null
          id: string
          overall_score: number | null
          report_date: string
          social_score: number | null
          source: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          environment_score?: number | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          report_date: string
          social_score?: number | null
          source?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          environment_score?: number | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          report_date?: string
          social_score?: number | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_vault: {
        Row: {
          company_id: string | null
          contributes_to_qa_score: boolean | null
          created_at: string
          department: string | null
          description: string | null
          evidence_category: string
          evidence_sub_type: string | null
          expires_at: string | null
          file_hash_sha256: string
          file_name: string
          file_size_bytes: number
          file_type: string
          file_url: string
          id: string
          is_locked: boolean | null
          l1_assessment_id: string | null
          locked_at: string | null
          metadata_hash: string | null
          qa_score_weight: number | null
          shared_with_users: string[] | null
          source_origin: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          uploaded_by_name: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          visibility: string | null
        }
        Insert: {
          company_id?: string | null
          contributes_to_qa_score?: boolean | null
          created_at?: string
          department?: string | null
          description?: string | null
          evidence_category: string
          evidence_sub_type?: string | null
          expires_at?: string | null
          file_hash_sha256: string
          file_name: string
          file_size_bytes: number
          file_type: string
          file_url: string
          id?: string
          is_locked?: boolean | null
          l1_assessment_id?: string | null
          locked_at?: string | null
          metadata_hash?: string | null
          qa_score_weight?: number | null
          shared_with_users?: string[] | null
          source_origin?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by_name?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          visibility?: string | null
        }
        Update: {
          company_id?: string | null
          contributes_to_qa_score?: boolean | null
          created_at?: string
          department?: string | null
          description?: string | null
          evidence_category?: string
          evidence_sub_type?: string | null
          expires_at?: string | null
          file_hash_sha256?: string
          file_name?: string
          file_size_bytes?: number
          file_type?: string
          file_url?: string
          id?: string
          is_locked?: boolean | null
          l1_assessment_id?: string | null
          locked_at?: string | null
          metadata_hash?: string | null
          qa_score_weight?: number | null
          shared_with_users?: string[] | null
          source_origin?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by_name?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_vault_l1_assessment_id_fkey"
            columns: ["l1_assessment_id"]
            isOneToOne: false
            referencedRelation: "health_check_results"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_proposals: {
        Row: {
          created_at: string | null
          current_state: Json | null
          id: string
          implemented_at: string | null
          justification: string | null
          proposal_type: string
          proposed_by: string | null
          proposed_state: Json
          reviewed_at: string | null
          reviewed_by: string | null
          skill_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          current_state?: Json | null
          id?: string
          implemented_at?: string | null
          justification?: string | null
          proposal_type: string
          proposed_by?: string | null
          proposed_state: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          skill_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          current_state?: Json | null
          id?: string
          implemented_at?: string | null
          justification?: string | null
          proposal_type?: string
          proposed_by?: string | null
          proposed_state?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          skill_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_proposals_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      game_achievements: {
        Row: {
          achievement_id: string
          achievement_name: string
          achievement_tier: string | null
          boost_space_badge_id: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_unlocked: boolean | null
          player_id: string
          progress: number | null
          unlock_criteria: Json | null
          unlocked_at: string | null
        }
        Insert: {
          achievement_id: string
          achievement_name: string
          achievement_tier?: string | null
          boost_space_badge_id?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_unlocked?: boolean | null
          player_id: string
          progress?: number | null
          unlock_criteria?: Json | null
          unlocked_at?: string | null
        }
        Update: {
          achievement_id?: string
          achievement_name?: string
          achievement_tier?: string | null
          boost_space_badge_id?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_unlocked?: boolean | null
          player_id?: string
          progress?: number | null
          unlock_criteria?: Json | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_achievements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_battle_history: {
        Row: {
          achievements_unlocked: Json | null
          battle_ended_at: string | null
          battle_started_at: string | null
          battle_type: string
          boost_space_activity_id: string | null
          cards_earned: Json | null
          cards_used: Json | null
          damage_dealt: number | null
          damage_taken: number | null
          difficulty: string | null
          duration_seconds: number | null
          enemy_name: string | null
          enemy_type: string | null
          id: string
          moves_log: Json | null
          player_hp_remaining: number | null
          player_id: string
          result: string
          xp_earned: number | null
        }
        Insert: {
          achievements_unlocked?: Json | null
          battle_ended_at?: string | null
          battle_started_at?: string | null
          battle_type: string
          boost_space_activity_id?: string | null
          cards_earned?: Json | null
          cards_used?: Json | null
          damage_dealt?: number | null
          damage_taken?: number | null
          difficulty?: string | null
          duration_seconds?: number | null
          enemy_name?: string | null
          enemy_type?: string | null
          id?: string
          moves_log?: Json | null
          player_hp_remaining?: number | null
          player_id: string
          result: string
          xp_earned?: number | null
        }
        Update: {
          achievements_unlocked?: Json | null
          battle_ended_at?: string | null
          battle_started_at?: string | null
          battle_type?: string
          boost_space_activity_id?: string | null
          cards_earned?: Json | null
          cards_used?: Json | null
          damage_dealt?: number | null
          damage_taken?: number | null
          difficulty?: string | null
          duration_seconds?: number | null
          enemy_name?: string | null
          enemy_type?: string | null
          id?: string
          moves_log?: Json | null
          player_hp_remaining?: number | null
          player_id?: string
          result?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_battle_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_card_collections: {
        Row: {
          acquired_at: string | null
          acquisition_source: string | null
          boost_space_asset_id: string | null
          card_category: string | null
          card_id: string
          card_name: string
          card_type: string
          cost: number | null
          id: string
          iso_reference: string | null
          player_id: string
          power: number | null
          rarity: string
          times_used: number | null
        }
        Insert: {
          acquired_at?: string | null
          acquisition_source?: string | null
          boost_space_asset_id?: string | null
          card_category?: string | null
          card_id: string
          card_name: string
          card_type: string
          cost?: number | null
          id?: string
          iso_reference?: string | null
          player_id: string
          power?: number | null
          rarity: string
          times_used?: number | null
        }
        Update: {
          acquired_at?: string | null
          acquisition_source?: string | null
          boost_space_asset_id?: string | null
          card_category?: string | null
          card_id?: string
          card_name?: string
          card_type?: string
          cost?: number | null
          id?: string
          iso_reference?: string | null
          player_id?: string
          power?: number | null
          rarity?: string
          times_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_card_collections_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_cards: {
        Row: {
          abilities: Json | null
          attack_power: number | null
          card_code: string
          card_type: string
          created_at: string | null
          crystal_hash: string
          defense_power: number | null
          description: string
          element: string | null
          energy_cost: number | null
          evidence: Json
          flavor_text: string | null
          id: string
          name_en: string
          name_tc: string
          rarity: string
          source_knowledge_id: string | null
          source_type: string | null
          updated_at: string | null
          virtue_benevolence: number | null
          virtue_courage: number | null
          virtue_harmony: number | null
          virtue_integrity: number | null
          virtue_intelligence: number | null
          virtue_temperance: number | null
        }
        Insert: {
          abilities?: Json | null
          attack_power?: number | null
          card_code: string
          card_type: string
          created_at?: string | null
          crystal_hash: string
          defense_power?: number | null
          description: string
          element?: string | null
          energy_cost?: number | null
          evidence?: Json
          flavor_text?: string | null
          id?: string
          name_en: string
          name_tc: string
          rarity: string
          source_knowledge_id?: string | null
          source_type?: string | null
          updated_at?: string | null
          virtue_benevolence?: number | null
          virtue_courage?: number | null
          virtue_harmony?: number | null
          virtue_integrity?: number | null
          virtue_intelligence?: number | null
          virtue_temperance?: number | null
        }
        Update: {
          abilities?: Json | null
          attack_power?: number | null
          card_code?: string
          card_type?: string
          created_at?: string | null
          crystal_hash?: string
          defense_power?: number | null
          description?: string
          element?: string | null
          energy_cost?: number | null
          evidence?: Json
          flavor_text?: string | null
          id?: string
          name_en?: string
          name_tc?: string
          rarity?: string
          source_knowledge_id?: string | null
          source_type?: string | null
          updated_at?: string | null
          virtue_benevolence?: number | null
          virtue_courage?: number | null
          virtue_harmony?: number | null
          virtue_integrity?: number | null
          virtue_intelligence?: number | null
          virtue_temperance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_cards_source_knowledge_id_fkey"
            columns: ["source_knowledge_id"]
            isOneToOne: false
            referencedRelation: "sustainability_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_cards_source_knowledge_id_fkey"
            columns: ["source_knowledge_id"]
            isOneToOne: false
            referencedRelation: "user_knowledge_items"
            referencedColumns: ["id"]
          },
        ]
      }
      game_digital_twin: {
        Row: {
          avatar_url: string | null
          blockchain_hash: string | null
          blockchain_timestamp: string | null
          boost_space_profile_id: string | null
          certifications: Json | null
          created_at: string
          decision_patterns: Json | null
          evolution_stage: string | null
          id: string
          player_id: string
          preferred_strategies: Json | null
          risk_tolerance: string | null
          skill_tree: Json | null
          twin_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          blockchain_hash?: string | null
          blockchain_timestamp?: string | null
          boost_space_profile_id?: string | null
          certifications?: Json | null
          created_at?: string
          decision_patterns?: Json | null
          evolution_stage?: string | null
          id?: string
          player_id: string
          preferred_strategies?: Json | null
          risk_tolerance?: string | null
          skill_tree?: Json | null
          twin_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          blockchain_hash?: string | null
          blockchain_timestamp?: string | null
          boost_space_profile_id?: string | null
          certifications?: Json | null
          created_at?: string
          decision_patterns?: Json | null
          evolution_stage?: string | null
          id?: string
          player_id?: string
          preferred_strategies?: Json | null
          risk_tolerance?: string | null
          skill_tree?: Json | null
          twin_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_digital_twin_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_entropy_events: {
        Row: {
          entropy_delta: number
          event_type: string
          id: string
          mitigation_action: Json | null
          player_id: string
          player_response: string | null
          resolved_at: string | null
          trigger_source: string | null
          triggered_at: string | null
        }
        Insert: {
          entropy_delta: number
          event_type: string
          id?: string
          mitigation_action?: Json | null
          player_id: string
          player_response?: string | null
          resolved_at?: string | null
          trigger_source?: string | null
          triggered_at?: string | null
        }
        Update: {
          entropy_delta?: number
          event_type?: string
          id?: string
          mitigation_action?: Json | null
          player_id?: string
          player_response?: string | null
          resolved_at?: string | null
          trigger_source?: string | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_entropy_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_journey_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          id: string
          journey_id: string
          knowledge_gained: Json | null
          player_id: string
          skills_acquired: Json | null
          stage_id: string
          started_at: string | null
          status: string | null
          touchpoint_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          id?: string
          journey_id: string
          knowledge_gained?: Json | null
          player_id: string
          skills_acquired?: Json | null
          stage_id: string
          started_at?: string | null
          status?: string | null
          touchpoint_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          id?: string
          journey_id?: string
          knowledge_gained?: Json | null
          player_id?: string
          skills_acquired?: Json | null
          stage_id?: string
          started_at?: string | null
          status?: string | null
          touchpoint_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_journey_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_players: {
        Row: {
          boost_space_id: string | null
          boost_space_last_sync: string | null
          boost_space_sync_status: string | null
          completed_journeys: Json | null
          created_at: string
          current_streak: number | null
          environmental_affinity: number | null
          governance_affinity: number | null
          id: string
          innovation_affinity: number | null
          last_entropy_update: string | null
          last_login: string | null
          learned_strategies: Json | null
          level: number | null
          losses: number | null
          max_streak: number | null
          player_name: string
          skill_passport: Json | null
          social_affinity: number | null
          total_battles: number | null
          updated_at: string
          user_id: string
          village_entropy: number | null
          wins: number | null
          xp: number | null
        }
        Insert: {
          boost_space_id?: string | null
          boost_space_last_sync?: string | null
          boost_space_sync_status?: string | null
          completed_journeys?: Json | null
          created_at?: string
          current_streak?: number | null
          environmental_affinity?: number | null
          governance_affinity?: number | null
          id?: string
          innovation_affinity?: number | null
          last_entropy_update?: string | null
          last_login?: string | null
          learned_strategies?: Json | null
          level?: number | null
          losses?: number | null
          max_streak?: number | null
          player_name: string
          skill_passport?: Json | null
          social_affinity?: number | null
          total_battles?: number | null
          updated_at?: string
          user_id: string
          village_entropy?: number | null
          wins?: number | null
          xp?: number | null
        }
        Update: {
          boost_space_id?: string | null
          boost_space_last_sync?: string | null
          boost_space_sync_status?: string | null
          completed_journeys?: Json | null
          created_at?: string
          current_streak?: number | null
          environmental_affinity?: number | null
          governance_affinity?: number | null
          id?: string
          innovation_affinity?: number | null
          last_entropy_update?: string | null
          last_login?: string | null
          learned_strategies?: Json | null
          level?: number | null
          losses?: number | null
          max_streak?: number | null
          player_name?: string
          skill_passport?: Json | null
          social_affinity?: number | null
          total_battles?: number | null
          updated_at?: string
          user_id?: string
          village_entropy?: number | null
          wins?: number | null
          xp?: number | null
        }
        Relationships: []
      }
      governance_proposals: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          expires_at: string | null
          id: string
          impact_score: number | null
          quorum: number | null
          status: string
          title: string
          updated_at: string | null
          votes_against: number | null
          votes_for: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          expires_at?: string | null
          id?: string
          impact_score?: number | null
          quorum?: number | null
          status: string
          title: string
          updated_at?: string | null
          votes_against?: number | null
          votes_for?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          impact_score?: number | null
          quorum?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          votes_against?: number | null
          votes_for?: number | null
        }
        Relationships: []
      }
      health_check_results: {
        Row: {
          company_id: string | null
          created_at: string
          environmental_score: number
          estimated_workload_hours: number | null
          gaps: Json
          governance_score: number
          hash_signature: string | null
          id: string
          ip_address: unknown
          l1_score: number
          raw_data: Json
          recommendations: Json | null
          social_score: number
          source_origin: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          environmental_score: number
          estimated_workload_hours?: number | null
          gaps?: Json
          governance_score: number
          hash_signature?: string | null
          id?: string
          ip_address?: unknown
          l1_score: number
          raw_data: Json
          recommendations?: Json | null
          social_score: number
          source_origin?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          environmental_score?: number
          estimated_workload_hours?: number | null
          gaps?: Json
          governance_score?: number
          hash_signature?: string | null
          id?: string
          ip_address?: unknown
          l1_score?: number
          raw_data?: Json
          recommendations?: Json | null
          social_score?: number
          source_origin?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          priority: string | null
          reported_by: string | null
          source: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          reported_by?: string | null
          source?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          reported_by?: string | null
          source?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integrity_passports: {
        Row: {
          badge_type: string | null
          id: string
          is_sealed: boolean | null
          owner_id: string | null
          sealed_at: string | null
          verification_source: string | null
          xp_reward: number | null
        }
        Insert: {
          badge_type?: string | null
          id?: string
          is_sealed?: boolean | null
          owner_id?: string | null
          sealed_at?: string | null
          verification_source?: string | null
          xp_reward?: number | null
        }
        Update: {
          badge_type?: string | null
          id?: string
          is_sealed?: boolean | null
          owner_id?: string | null
          sealed_at?: string | null
          verification_source?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      intelligence_brief_items: {
        Row: {
          brief_id: string
          created_at: string | null
          display_order: number | null
          id: string
          is_highlighted: boolean | null
          item_id: string
        }
        Insert: {
          brief_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_highlighted?: boolean | null
          item_id: string
        }
        Update: {
          brief_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_highlighted?: boolean | null
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intelligence_brief_items_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "intelligence_daily_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intelligence_brief_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "intelligence_items"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_en: string
          name_tc: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_en: string
          name_tc: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string
          name_tc?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      intelligence_daily_briefs: {
        Row: {
          brief_date: string
          created_at: string | null
          critical_count: number | null
          generated_by: string | null
          high_count: number | null
          highlights: Json | null
          id: string
          is_published: boolean | null
          low_count: number | null
          medium_count: number | null
          published_at: string | null
          summary: string
          title: string
          total_items: number | null
          updated_at: string | null
        }
        Insert: {
          brief_date: string
          created_at?: string | null
          critical_count?: number | null
          generated_by?: string | null
          high_count?: number | null
          highlights?: Json | null
          id?: string
          is_published?: boolean | null
          low_count?: number | null
          medium_count?: number | null
          published_at?: string | null
          summary: string
          title: string
          total_items?: number | null
          updated_at?: string | null
        }
        Update: {
          brief_date?: string
          created_at?: string | null
          critical_count?: number | null
          generated_by?: string | null
          high_count?: number | null
          highlights?: Json | null
          id?: string
          is_published?: boolean | null
          low_count?: number | null
          medium_count?: number | null
          published_at?: string | null
          summary?: string
          title?: string
          total_items?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      intelligence_item_tags: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intelligence_item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "intelligence_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intelligence_item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "intelligence_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_items: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          impact_level: string
          language: string | null
          metadata: Json | null
          priority: string
          published_at: string | null
          relevance_score: number | null
          source_id: string | null
          source_url: string | null
          status: string | null
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          impact_level: string
          language?: string | null
          metadata?: Json | null
          priority: string
          published_at?: string | null
          relevance_score?: number | null
          source_id?: string | null
          source_url?: string | null
          status?: string | null
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          impact_level?: string
          language?: string | null
          metadata?: Json | null
          priority?: string
          published_at?: string | null
          relevance_score?: number | null
          source_id?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intelligence_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "intelligence_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intelligence_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "intelligence_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_sources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_en: string
          name_tc: string
          reliability_score: number | null
          source_type: string
          update_frequency: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_en: string
          name_tc: string
          reliability_score?: number | null
          source_type: string
          update_frequency?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string
          name_tc?: string
          reliability_score?: number | null
          source_type?: string
          update_frequency?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      intelligence_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_en: string
          name_tc: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_en: string
          name_tc: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string
          name_tc?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      intelligence_trend_predictions: {
        Row: {
          actual_date: string | null
          confidence_score: number | null
          created_at: string | null
          description: string
          id: string
          impact_assessment: Json | null
          is_accurate: boolean | null
          notes: string | null
          predicted_date: string | null
          prediction_type: string
          probability: string
          related_items: Json | null
          status: string | null
          time_horizon: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_date?: string | null
          confidence_score?: number | null
          created_at?: string | null
          description: string
          id?: string
          impact_assessment?: Json | null
          is_accurate?: boolean | null
          notes?: string | null
          predicted_date?: string | null
          prediction_type: string
          probability: string
          related_items?: Json | null
          status?: string | null
          time_horizon: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_date?: string | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          id?: string
          impact_assessment?: Json | null
          is_accurate?: boolean | null
          notes?: string | null
          predicted_date?: string | null
          prediction_type?: string
          probability?: string
          related_items?: Json | null
          status?: string | null
          time_horizon?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs_pdf: {
        Row: {
          attempts: number
          bucket: string
          created_at: string
          filename: string
          id: string
          last_error: string | null
          payload_hash: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attempts?: number
          bucket: string
          created_at?: string
          filename: string
          id: string
          last_error?: string | null
          payload_hash?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attempts?: number
          bucket?: string
          created_at?: string
          filename?: string
          id?: string
          last_error?: string | null
          payload_hash?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      key_metrics: {
        Row: {
          id: string
          last_updated: string | null
          metric_name: string
          trend: number | null
          unit: string | null
          value: number | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          metric_name: string
          trend?: number | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          metric_name?: string
          trend?: number | null
          unit?: string | null
          value?: number | null
        }
        Relationships: []
      }
      knowledge_bases: {
        Row: {
          agent_id: string | null
          created_at: string | null
          description: string | null
          embedding_model: string | null
          id: string
          metadata: Json | null
          name: string
          total_chunks: number | null
          total_size_bytes: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          name: string
          total_chunks?: number | null
          total_size_bytes?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          total_chunks?: number | null
          total_size_bytes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_bases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_full_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_bases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intelligence_items: {
        Row: {
          content: string | null
          crawled_at: string | null
          created_at: string | null
          id: string
          impact_score: number | null
          published_at: string | null
          sentiment: string | null
          source_id: string | null
          summary: string | null
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          crawled_at?: string | null
          created_at?: string | null
          id?: string
          impact_score?: number | null
          published_at?: string | null
          sentiment?: string | null
          source_id?: string | null
          summary?: string | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          crawled_at?: string | null
          created_at?: string | null
          id?: string
          impact_score?: number | null
          published_at?: string | null
          sentiment?: string | null
          source_id?: string | null
          summary?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_intelligence_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "market_intelligence_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intelligence_sources: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          reason: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reason?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reason?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          id: string
          metadata: Json | null
          name: string
          size_bytes: number | null
          storage_path: string
          type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          metadata?: Json | null
          name: string
          size_bytes?: number | null
          storage_path: string
          type?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          size_bytes?: number | null
          storage_path?: string
          type?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      memory_chunks: {
        Row: {
          chunk_index: number | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          kb_id: string | null
          metadata: Json | null
          parent_document_id: string | null
          source: string | null
        }
        Insert: {
          chunk_index?: number | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          kb_id?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          source?: string | null
        }
        Update: {
          chunk_index?: number | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          kb_id?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_chunks_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "kb_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_chunks_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_definitions: {
        Row: {
          category: string
          code: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          standard_ref: string | null
          unit: string
        }
        Insert: {
          category: string
          code: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          standard_ref?: string | null
          unit: string
        }
        Update: {
          category?: string
          code?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          standard_ref?: string | null
          unit?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          category: string | null
          company_name: string
          content: string | null
          created_at: string | null
          esg_score: number | null
          id: string
          impact_score: number | null
          is_collected: boolean | null
          magazine_issue: string | null
          sentiment: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          company_name: string
          content?: string | null
          created_at?: string | null
          esg_score?: number | null
          id?: string
          impact_score?: number | null
          is_collected?: boolean | null
          magazine_issue?: string | null
          sentiment?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          company_name?: string
          content?: string | null
          created_at?: string | null
          esg_score?: number | null
          id?: string
          impact_score?: number | null
          is_collected?: boolean | null
          magazine_issue?: string | null
          sentiment?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      org_units: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          tier_level: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          tier_level?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          tier_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          domain: string | null
          id: string
          industry: string | null
          location: string | null
          member_ids_jsonb: Json | null
          member_ids_uuid: string[] | null
          name: string
          owner_user_id: string | null
          size_category: string | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          member_ids_jsonb?: Json | null
          member_ids_uuid?: string[] | null
          name: string
          owner_user_id?: string | null
          size_category?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          member_ids_jsonb?: Json | null
          member_ids_uuid?: string[] | null
          name?: string
          owner_user_id?: string | null
          size_category?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      outbox_events: {
        Row: {
          attempts: number | null
          created_at: string | null
          headers: Json | null
          id: string
          last_error: string | null
          next_try_at: string | null
          payload: Json
          processed: boolean | null
          processing: boolean | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          last_error?: string | null
          next_try_at?: string | null
          payload: Json
          processed?: boolean | null
          processing?: boolean | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          last_error?: string | null
          next_try_at?: string | null
          payload?: Json
          processed?: boolean | null
          processing?: boolean | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      processed_documents: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          created_by: string | null
          document_category: string | null
          error_message: string | null
          extracted_data: Json | null
          file_type: string | null
          filename: string
          id: string
          organization_id: string | null
          original_file_url: string | null
          processed_by: string | null
          processing_status: string | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          document_category?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          file_type?: string | null
          filename: string
          id?: string
          organization_id?: string | null
          original_file_url?: string | null
          processed_by?: string | null
          processing_status?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          document_category?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          file_type?: string | null
          filename?: string
          id?: string
          organization_id?: string | null
          original_file_url?: string | null
          processed_by?: string | null
          processing_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processed_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processed_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          organization_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_scores: {
        Row: {
          accuracy_score: number | null
          calculation_method: string | null
          calculation_timestamp: string | null
          certification_requirements: Json | null
          company_id: string | null
          comparability_score: number | null
          completeness_score: number | null
          consistency_score: number | null
          created_at: string
          dimension_weights: Json | null
          evidence_count: number | null
          gaps: Json | null
          grade: string | null
          hash_signature: string | null
          id: string
          is_certifiable: boolean | null
          l1_assessment_id: string | null
          locked_evidence_count: number | null
          overall_score: number
          recommendations: Json | null
          report_id: string | null
          source_origin: string | null
          trustworthy_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          calculation_method?: string | null
          calculation_timestamp?: string | null
          certification_requirements?: Json | null
          company_id?: string | null
          comparability_score?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string
          dimension_weights?: Json | null
          evidence_count?: number | null
          gaps?: Json | null
          grade?: string | null
          hash_signature?: string | null
          id?: string
          is_certifiable?: boolean | null
          l1_assessment_id?: string | null
          locked_evidence_count?: number | null
          overall_score: number
          recommendations?: Json | null
          report_id?: string | null
          source_origin?: string | null
          trustworthy_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          calculation_method?: string | null
          calculation_timestamp?: string | null
          certification_requirements?: Json | null
          company_id?: string | null
          comparability_score?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string
          dimension_weights?: Json | null
          evidence_count?: number | null
          gaps?: Json | null
          grade?: string | null
          hash_signature?: string | null
          id?: string
          is_certifiable?: boolean | null
          l1_assessment_id?: string | null
          locked_evidence_count?: number | null
          overall_score?: number
          recommendations?: Json | null
          report_id?: string | null
          source_origin?: string | null
          trustworthy_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_scores_l1_assessment_id_fkey"
            columns: ["l1_assessment_id"]
            isOneToOne: false
            referencedRelation: "health_check_results"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          agreement: boolean
          chinese_name: string
          company_name: string
          created_at: string | null
          email: string
          english_name: string
          esg_role: string[] | null
          expectation: string | null
          id: string
          industry: string | null
          ip_address: string | null
          job_title: string
          line_id: string | null
          location: string | null
          mobile: string
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          agreement?: boolean
          chinese_name: string
          company_name: string
          created_at?: string | null
          email: string
          english_name: string
          esg_role?: string[] | null
          expectation?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          job_title: string
          line_id?: string | null
          location?: string | null
          mobile: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          agreement?: boolean
          chinese_name?: string
          company_name?: string
          created_at?: string | null
          email?: string
          english_name?: string
          esg_role?: string[] | null
          expectation?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          job_title?: string
          line_id?: string | null
          location?: string | null
          mobile?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      schema_backups: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          created_at: string | null
          id: string
          is_anomaly: boolean | null
          location: string | null
          metadata: Json | null
          reading_type: string
          sensor_id: string
          timestamp: string | null
          type: Database["public"]["Enums"]["source_taxonomy"] | null
          unit: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anomaly?: boolean | null
          location?: string | null
          metadata?: Json | null
          reading_type: string
          sensor_id: string
          timestamp?: string | null
          type?: Database["public"]["Enums"]["source_taxonomy"] | null
          unit: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anomaly?: boolean | null
          location?: string | null
          metadata?: Json | null
          reading_type?: string
          sensor_id?: string
          timestamp?: string | null
          type?: Database["public"]["Enums"]["source_taxonomy"] | null
          unit?: string
          value?: number
        }
        Relationships: []
      }
      sessions: {
        Row: {
          agent_id: string | null
          context_window: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          kb_id: string | null
          last_active_at: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          context_window?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id: string
          kb_id?: string | null
          last_active_at?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          context_window?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          kb_id?: string | null
          last_active_at?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_full_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "kb_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          implementation_code: string | null
          name: string
          parameters_schema: Json | null
          requires_hitl: boolean | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          implementation_code?: string | null
          name: string
          parameters_schema?: Json | null
          requires_hitl?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          implementation_code?: string | null
          name?: string
          parameters_schema?: Json | null
          requires_hitl?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          carbon_intensity: number | null
          certifications: string[] | null
          compliance_status: string | null
          created_at: string | null
          data_quality_score: number | null
          email: string | null
          esg_score: number | null
          id: string
          industry_category: string | null
          last_data_update: string | null
          location: string | null
          name: string
          organization_id: string | null
          scope3_impact: number | null
          updated_at: string | null
        }
        Insert: {
          carbon_intensity?: number | null
          certifications?: string[] | null
          compliance_status?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          email?: string | null
          esg_score?: number | null
          id?: string
          industry_category?: string | null
          last_data_update?: string | null
          location?: string | null
          name: string
          organization_id?: string | null
          scope3_impact?: number | null
          updated_at?: string | null
        }
        Update: {
          carbon_intensity?: number | null
          certifications?: string[] | null
          compliance_status?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          email?: string | null
          esg_score?: number | null
          id?: string
          industry_category?: string | null
          last_data_update?: string | null
          location?: string | null
          name?: string
          organization_id?: string | null
          scope3_impact?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sustainability_goals: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          goal_key: string
          id: string
          organization_id: string | null
          owners: Json | null
          progress: number | null
          status: string
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          goal_key: string
          id?: string
          organization_id?: string | null
          owners?: Json | null
          progress?: number | null
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          goal_key?: string
          id?: string
          organization_id?: string | null
          owners?: Json | null
          progress?: number | null
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sustainability_goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustainability_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustainability_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustainability_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sustainability_sources: {
        Row: {
          category: string
          category_name: string
          content_type: string[]
          created_at: string | null
          id: string
          is_active: boolean | null
          last_crawled_at: string | null
          name_en: string
          name_tc: string
          priority: number
          rationale: string
          source_id: number
          update_frequency: string
          updated_at: string | null
          url: string
        }
        Insert: {
          category: string
          category_name: string
          content_type: string[]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_crawled_at?: string | null
          name_en: string
          name_tc: string
          priority: number
          rationale: string
          source_id: number
          update_frequency: string
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string
          category_name?: string
          content_type?: string[]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_crawled_at?: string | null
          name_en?: string
          name_tc?: string
          priority?: number
          rationale?: string
          source_id?: number
          update_frequency?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      task_matrix: {
        Row: {
          agent_name: string | null
          id: string
          status: string | null
          task_payload: Json | null
          tracking_logs: Json[] | null
          updated_at: string | null
        }
        Insert: {
          agent_name?: string | null
          id?: string
          status?: string | null
          task_payload?: Json | null
          tracking_logs?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          agent_name?: string | null
          id?: string
          status?: string | null
          task_payload?: Json | null
          tracking_logs?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_user_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          project_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assignee_user_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assignee_user_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_user_id_fkey"
            columns: ["assignee_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ucc_cores: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          formula: string | null
          hash_lock: string
          id: string
          impact_metric: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          formula?: string | null
          hash_lock: string
          id?: string
          impact_metric?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          formula?: string | null
          hash_lock?: string
          id?: string
          impact_metric?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_card_collection: {
        Row: {
          card_id: string
          created_at: string | null
          enhancement_count: number | null
          experience: number | null
          id: string
          is_favorite: boolean | null
          level: number | null
          obtained_at: string | null
          obtained_from: string | null
          quantity: number | null
          times_used: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          enhancement_count?: number | null
          experience?: number | null
          id?: string
          is_favorite?: boolean | null
          level?: number | null
          obtained_at?: string | null
          obtained_from?: string | null
          quantity?: number | null
          times_used?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          enhancement_count?: number | null
          experience?: number | null
          id?: string
          is_favorite?: boolean | null
          level?: number | null
          obtained_at?: string | null
          obtained_from?: string | null
          quantity?: number | null
          times_used?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_card_collection_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "game_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_decks: {
        Row: {
          cards: Json
          created_at: string | null
          deck_name: string
          deck_type: string | null
          description: string | null
          id: string
          is_active: boolean | null
          loss_count: number | null
          primary_element: string | null
          times_used: number | null
          total_cards: number | null
          updated_at: string | null
          user_id: string
          win_count: number | null
        }
        Insert: {
          cards?: Json
          created_at?: string | null
          deck_name: string
          deck_type?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          loss_count?: number | null
          primary_element?: string | null
          times_used?: number | null
          total_cards?: number | null
          updated_at?: string | null
          user_id: string
          win_count?: number | null
        }
        Update: {
          cards?: Json
          created_at?: string | null
          deck_name?: string
          deck_type?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          loss_count?: number | null
          primary_element?: string | null
          times_used?: number | null
          total_cards?: number | null
          updated_at?: string | null
          user_id?: string
          win_count?: number | null
        }
        Relationships: []
      }
      user_digital_avatars: {
        Row: {
          avatar_name: string
          avatar_type: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          omni_crystal: Json
          total_knowledge_items: number | null
          total_sources_subscribed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_name: string
          avatar_type?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          omni_crystal?: Json
          total_knowledge_items?: number | null
          total_sources_subscribed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_name?: string
          avatar_type?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          omni_crystal?: Json
          total_knowledge_items?: number | null
          total_sources_subscribed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_knowledge_items: {
        Row: {
          author: string | null
          category: string | null
          created_at: string | null
          crystal_hash: string
          evidence: Json
          full_content: string | null
          id: string
          is_bookmarked: boolean | null
          is_in_library: boolean | null
          is_read: boolean | null
          language: string | null
          learning_progress: number | null
          library_category: string | null
          library_shelf: string | null
          original_url: string | null
          published_at: string | null
          publisher: string | null
          reading_position: number | null
          reading_time_minutes: number | null
          source_id: number | null
          summary: string | null
          synced_at: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          crystal_hash: string
          evidence?: Json
          full_content?: string | null
          id?: string
          is_bookmarked?: boolean | null
          is_in_library?: boolean | null
          is_read?: boolean | null
          language?: string | null
          learning_progress?: number | null
          library_category?: string | null
          library_shelf?: string | null
          original_url?: string | null
          published_at?: string | null
          publisher?: string | null
          reading_position?: number | null
          reading_time_minutes?: number | null
          source_id?: number | null
          summary?: string | null
          synced_at?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          crystal_hash?: string
          evidence?: Json
          full_content?: string | null
          id?: string
          is_bookmarked?: boolean | null
          is_in_library?: boolean | null
          is_read?: boolean | null
          language?: string | null
          learning_progress?: number | null
          library_category?: string | null
          library_shelf?: string | null
          original_url?: string | null
          published_at?: string | null
          publisher?: string | null
          reading_position?: number | null
          reading_time_minutes?: number | null
          source_id?: number | null
          summary?: string | null
          synced_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_knowledge_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sustainability_sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          org_unit_id: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          org_unit_id?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_unit_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_org_unit_id_fkey"
            columns: ["org_unit_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          active: boolean | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_source_subscriptions: {
        Row: {
          created_at: string | null
          custom_tags: string[] | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          priority_override: number | null
          source_id: number
          subscription_type: string | null
          sync_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_tags?: string[] | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          priority_override?: number | null
          source_id: number
          subscription_type?: string | null
          sync_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_tags?: string[] | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          priority_override?: number | null
          source_id?: number
          subscription_type?: string | null
          sync_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_source_subscriptions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sustainability_sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          attempts: number | null
          created_at: string | null
          delivered_at: string | null
          event_type: string | null
          id: string
          last_attempt_at: string | null
          next_attempt_at: string
          payload: Json | null
          status: string | null
          updated_at: string | null
          webhook_id: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          delivered_at?: string | null
          event_type?: string | null
          id?: string
          last_attempt_at?: string | null
          next_attempt_at?: string
          payload?: Json | null
          status?: string | null
          updated_at?: string | null
          webhook_id?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          delivered_at?: string | null
          event_type?: string | null
          id?: string
          last_attempt_at?: string | null
          next_attempt_at?: string
          payload?: Json | null
          status?: string | null
          updated_at?: string | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean | null
          created_at: string | null
          event_types: string[] | null
          id: string
          organization_id: string | null
          secret: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          event_types?: string[] | null
          id?: string
          organization_id?: string | null
          secret?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          event_types?: string[] | null
          id?: string
          organization_id?: string | null
          secret?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agent_full_info: {
        Row: {
          base_model: string | null
          context_strategy: string | null
          created_at: string | null
          description: string | null
          id: string | null
          max_tokens: number | null
          metadata: Json | null
          name: string | null
          skills: Json | null
          system_prompt: string | null
          temperature: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      companies_view: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          industry: string | null
          logo_url: string | null
          name: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: never
          id?: string | null
          industry?: string | null
          logo_url?: never
          name?: string | null
          website?: never
        }
        Update: {
          created_at?: string | null
          description?: never
          id?: string | null
          industry?: string | null
          logo_url?: never
          name?: string | null
          website?: never
        }
        Relationships: []
      }
      esg_knowledge_summary: {
        Row: {
          avg_content_length: number | null
          created_at: string | null
          description: string | null
          knowledge_base: string | null
          total_chunks: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      incidents_view: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          metadata: Json | null
          organization_id: string | null
          priority: string | null
          reported_by: string | null
          source: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          reported_by?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          reported_by?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "companies_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_statistics: {
        Row: {
          agent_name: string | null
          id: string | null
          last_updated: string | null
          name: string | null
          size_mb: number | null
          total_chunks: number | null
          total_size_bytes: number | null
          unique_sources: number | null
        }
        Relationships: []
      }
      registrations_public: {
        Row: {
          agreement: boolean | null
          chinese_name: string | null
          company_name: string | null
          created_at: string | null
          english_name: string | null
          id: string | null
          job_title: string | null
          updated_at: string | null
        }
        Insert: {
          agreement?: boolean | null
          chinese_name?: string | null
          company_name?: string | null
          created_at?: string | null
          english_name?: string | null
          id?: string | null
          job_title?: string | null
          updated_at?: string | null
        }
        Update: {
          agreement?: boolean | null
          chinese_name?: string | null
          company_name?: string | null
          created_at?: string | null
          english_name?: string | null
          id?: string | null
          job_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registrations_public_masked: {
        Row: {
          agreement: boolean | null
          company_name: string | null
          created_at: string | null
          email_masked: string | null
          id: string | null
          job_title: string | null
          mobile_masked: string | null
        }
        Relationships: []
      }
      sustainability_library: {
        Row: {
          author: string | null
          category: string | null
          created_at: string | null
          full_content: string | null
          id: string | null
          is_bookmarked: boolean | null
          is_read: boolean | null
          library_category: string | null
          library_shelf: string | null
          published_at: string | null
          publisher: string | null
          reading_time_minutes: number | null
          summary: string | null
          tags: string[] | null
          title: string | null
          user_id: string | null
          word_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          full_content?: string | null
          id?: string | null
          is_bookmarked?: boolean | null
          is_read?: boolean | null
          library_category?: string | null
          library_shelf?: string | null
          published_at?: string | null
          publisher?: string | null
          reading_time_minutes?: number | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
          word_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          full_content?: string | null
          id?: string | null
          is_bookmarked?: boolean | null
          is_read?: boolean | null
          library_category?: string | null
          library_shelf?: string | null
          published_at?: string | null
          publisher?: string | null
          reading_time_minutes?: number | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      view_outbox_backlog: {
        Row: {
          backlog_size: number | null
        }
        Relationships: []
      }
      view_outbox_failing: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string | null
          last_error: string | null
          topic: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string | null
          last_error?: string | null
          topic?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string | null
          last_error?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      view_outbox_latency: {
        Row: {
          avg_processing_seconds: number | null
          processed_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _registrations_masked_for_user: {
        Args: { p_user_id: string }
        Returns: Database["public"]["CompositeTypes"]["registrations_public_masked_row"][]
        SetofOptions: {
          from: "*"
          to: "registrations_public_masked_row"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      _registrations_masked_for_user_backup: {
        Args: { p_user_id: string }
        Returns: Database["public"]["CompositeTypes"]["registrations_public_masked_row"][]
        SetofOptions: {
          from: "*"
          to: "registrations_public_masked_row"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_current_auth_user_id: { Args: never; Returns: string }
      get_failed_syncs_for_retry: {
        Args: { retry_after_minutes?: number }
        Returns: {
          boost_space_id: string
          entity_id: string
          entity_type: string
          error_message: string
          id: string
          retry_count: number
        }[]
      }
      get_latest_esg_scores: {
        Args: never
        Returns: {
          company_id: string
          company_name: string
          environment_score: number
          governance_score: number
          industry: string
          overall_score: number
          report_date: string
          social_score: number
        }[]
      }
      get_latest_sync_status: {
        Args: { p_entity_id: string; p_entity_type: string }
        Returns: Json
      }
      get_my_claim: {
        Args: never
        Returns: {
          claim_org_id: string
          claim_role: string
        }[]
      }
      get_orgs_by_admin: {
        Args: never
        Returns: {
          admin_user_id: string | null
          created_at: string | null
          domain: string | null
          id: string
          industry: string | null
          location: string | null
          member_ids_jsonb: Json | null
          member_ids_uuid: string[] | null
          name: string
          owner_user_id: string | null
          size_category: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "organizations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_orgs_by_member_jsonb: {
        Args: never
        Returns: {
          admin_user_id: string | null
          created_at: string | null
          domain: string | null
          id: string
          industry: string | null
          location: string | null
          member_ids_jsonb: Json | null
          member_ids_uuid: string[] | null
          name: string
          owner_user_id: string | null
          size_category: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "organizations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_orgs_by_member_uuid_array: {
        Args: never
        Returns: {
          admin_user_id: string | null
          created_at: string | null
          domain: string | null
          id: string
          industry: string | null
          location: string | null
          member_ids_jsonb: Json | null
          member_ids_uuid: string[] | null
          name: string
          owner_user_id: string | null
          size_category: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "organizations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_orgs_by_owner: {
        Args: never
        Returns: {
          admin_user_id: string | null
          created_at: string | null
          domain: string | null
          id: string
          industry: string | null
          location: string | null
          member_ids_jsonb: Json | null
          member_ids_uuid: string[] | null
          name: string
          owner_user_id: string | null
          size_category: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "organizations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_unresolved_conflicts: {
        Args: never
        Returns: {
          boost_space_id: string
          conflict_data: Json
          entity_id: string
          entity_type: string
          synced_at: string
        }[]
      }
      get_user_organization: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
      is_user_admin: { Args: never; Returns: boolean }
      mark_outbox_processing: { Args: { p_id: string }; Returns: boolean }
      match_knowledge_chunks: {
        Args: {
          filter_kb_id: string
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
          source: string
        }[]
      }
      match_knowledge_chunks_cross_kb: {
        Args: {
          filter_kb_ids: string[]
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          kb_id: string
          metadata: Json
          similarity: number
          source: string
        }[]
      }
      move_outbox_to_alerts: {
        Args: { p_outbox_id: string }
        Returns: undefined
      }
      process_approval: {
        Args: { action: string; comment?: string; reading_id: string }
        Returns: undefined
      }
      process_outbox_batch: {
        Args: { batch_size?: number }
        Returns: undefined
      }
      process_outbox_batch_http: { Args: never; Returns: undefined }
      process_outbox_batch_scheduler: { Args: never; Returns: undefined }
      process_outbox_batch_with_dead_letter: { Args: never; Returns: undefined }
      search_esg_knowledge: {
        Args: { kb_names?: string[]; search_query: string; top_k?: number }
        Returns: {
          content: string
          kb_name: string
          metadata: Json
          similarity: number
          source: string
        }[]
      }
    }
    Enums: {
      agent_context_strategy: "none" | "user" | "system" | "hybrid"
      info_one_lifecycle_status: "draft" | "active" | "archived"
      source_taxonomy: "internal" | "external" | "partner" | "public"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      registrations_public_masked_row: {
        id: string | null
        created_at: string | null
        company_name: string | null
        job_title: string | null
        agreement: boolean | null
        mobile_masked: string | null
        email_masked: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_context_strategy: ["none", "user", "system", "hybrid"],
      info_one_lifecycle_status: ["draft", "active", "archived"],
      source_taxonomy: ["internal", "external", "partner", "public"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
