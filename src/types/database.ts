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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          id: string
          is_free: boolean
          read_time: number
          reviewed_by: string | null
          slug: string
          sources: string[] | null
          stage: string
          stage_label: string
          title: string
          updated_at: string
          week: number | null
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_free?: boolean
          read_time?: number
          reviewed_by?: string | null
          slug: string
          sources?: string[] | null
          stage: string
          stage_label: string
          title: string
          updated_at?: string
          week?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_free?: boolean
          read_time?: number
          reviewed_by?: string | null
          slug?: string
          sources?: string[] | null
          stage?: string
          stage_label?: string
          title?: string
          updated_at?: string
          week?: number | null
        }
        Relationships: []
      }
      babies: {
        Row: {
          baby_name: string | null
          birth_date: string | null
          created_at: string
          current_week: number
          due_date: string | null
          family_id: string
          id: string
          is_active: boolean
          signup_week: number | null
          sort_order: number
          stage: Database["public"]["Enums"]["family_stage"]
          updated_at: string
        }
        Insert: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string
          current_week?: number
          due_date?: string | null
          family_id: string
          id?: string
          is_active?: boolean
          signup_week?: number | null
          sort_order?: number
          stage?: Database["public"]["Enums"]["family_stage"]
          updated_at?: string
        }
        Update: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string
          current_week?: number
          due_date?: string | null
          family_id?: string
          id?: string
          is_active?: boolean
          signup_week?: number | null
          sort_order?: number
          stage?: Database["public"]["Enums"]["family_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "babies_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      baby_logs: {
        Row: {
          baby_id: string | null
          created_at: string | null
          family_id: string
          id: string
          log_data: Json
          log_type: Database["public"]["Enums"]["log_type"]
          logged_at: string
          logged_by: string
          notes: string | null
        }
        Insert: {
          baby_id?: string | null
          created_at?: string | null
          family_id: string
          id?: string
          log_data?: Json
          log_type: Database["public"]["Enums"]["log_type"]
          logged_at?: string
          logged_by: string
          notes?: string | null
        }
        Update: {
          baby_id?: string | null
          created_at?: string | null
          family_id?: string
          id?: string
          log_data?: Json
          log_type?: Database["public"]["Enums"]["log_type"]
          logged_at?: string
          logged_by?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baby_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baby_logs_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_templates: {
        Row: {
          baby_update: string | null
          briefing_id: string
          coming_up: string | null
          created_at: string | null
          dad_focus: string[] | null
          field_notes: string | null
          is_premium: boolean | null
          linked_task_ids: string[] | null
          medical_source: string | null
          mom_update: string | null
          relationship_tip: string | null
          stage: Database["public"]["Enums"]["family_stage"]
          title: string
          week: number
        }
        Insert: {
          baby_update?: string | null
          briefing_id: string
          coming_up?: string | null
          created_at?: string | null
          dad_focus?: string[] | null
          field_notes?: string | null
          is_premium?: boolean | null
          linked_task_ids?: string[] | null
          medical_source?: string | null
          mom_update?: string | null
          relationship_tip?: string | null
          stage: Database["public"]["Enums"]["family_stage"]
          title: string
          week: number
        }
        Update: {
          baby_update?: string | null
          briefing_id?: string
          coming_up?: string | null
          created_at?: string | null
          dad_focus?: string[] | null
          field_notes?: string | null
          is_premium?: boolean | null
          linked_task_ids?: string[] | null
          medical_source?: string | null
          mom_update?: string | null
          relationship_tip?: string | null
          stage?: Database["public"]["Enums"]["family_stage"]
          title?: string
          week?: number
        }
        Relationships: []
      }
      budget_templates: {
        Row: {
          affiliate_url_premium: string | null
          affiliate_url_value: string | null
          brand_premium: string | null
          brand_value: string | null
          budget_id: string
          category: string
          created_at: string | null
          description: string | null
          is_premium: boolean | null
          is_recurring: boolean | null
          item: string
          notes: string | null
          period: string | null
          price_currency: string | null
          price_display: string | null
          price_high: number | null
          price_low: number | null
          price_max: number | null
          price_mid: number | null
          price_min: number | null
          priority: string | null
          product_examples: Json | null
          recurring_frequency: string | null
          stage: Database["public"]["Enums"]["family_stage"] | null
          subcategory: string | null
          week_end: number | null
          week_start: number | null
        }
        Insert: {
          affiliate_url_premium?: string | null
          affiliate_url_value?: string | null
          brand_premium?: string | null
          brand_value?: string | null
          budget_id: string
          category: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          is_recurring?: boolean | null
          item: string
          notes?: string | null
          period?: string | null
          price_currency?: string | null
          price_display?: string | null
          price_high?: number | null
          price_low?: number | null
          price_max?: number | null
          price_mid?: number | null
          price_min?: number | null
          priority?: string | null
          product_examples?: Json | null
          recurring_frequency?: string | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          subcategory?: string | null
          week_end?: number | null
          week_start?: number | null
        }
        Update: {
          affiliate_url_premium?: string | null
          affiliate_url_value?: string | null
          brand_premium?: string | null
          brand_value?: string | null
          budget_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          is_recurring?: boolean | null
          item?: string
          notes?: string | null
          period?: string | null
          price_currency?: string | null
          price_display?: string | null
          price_high?: number | null
          price_low?: number | null
          price_max?: number | null
          price_mid?: number | null
          price_min?: number | null
          priority?: string | null
          product_examples?: Json | null
          recurring_frequency?: string | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          subcategory?: string | null
          week_end?: number | null
          week_start?: number | null
        }
        Relationships: []
      }
      checklist_item_templates: {
        Row: {
          bring_or_do: string | null
          category: string | null
          checklist_id: string
          created_at: string | null
          details: string | null
          item: string
          item_id: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          bring_or_do?: string | null
          category?: string | null
          checklist_id: string
          created_at?: string | null
          details?: string | null
          item: string
          item_id: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          bring_or_do?: string | null
          category?: string | null
          checklist_id?: string
          created_at?: string | null
          details?: string | null
          item?: string
          item_id?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_templates_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["checklist_id"]
          },
        ]
      }
      checklist_progress: {
        Row: {
          baby_id: string | null
          checked_at: string | null
          checked_by: string | null
          checklist_id: string
          created_at: string | null
          family_id: string
          id: string
          is_checked: boolean | null
          item_id: string
        }
        Insert: {
          baby_id?: string | null
          checked_at?: string | null
          checked_by?: string | null
          checklist_id: string
          created_at?: string | null
          family_id: string
          id?: string
          is_checked?: boolean | null
          item_id: string
        }
        Update: {
          baby_id?: string | null
          checked_at?: string | null
          checked_by?: string | null
          checklist_id?: string
          created_at?: string | null
          family_id?: string
          id?: string
          is_checked?: boolean | null
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_progress_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_progress_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["checklist_id"]
          },
          {
            foreignKeyName: "checklist_progress_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_progress_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_item_templates"
            referencedColumns: ["item_id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          checklist_id: string
          created_at: string | null
          description: string | null
          is_premium: boolean | null
          name: string
          sort_order: number | null
          stage: Database["public"]["Enums"]["family_stage"] | null
          week_relevant: string | null
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          name: string
          sort_order?: number | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          week_relevant?: string | null
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          name?: string
          sort_order?: number | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          week_relevant?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dad_challenge_content: {
        Row: {
          action_items: Json
          created_at: string | null
          dad_quotes: Json
          headline: string
          icon: string
          id: string
          is_premium: boolean
          narrative: string
          phase: string
          pillar: Database["public"]["Enums"]["dad_challenge_pillar"]
          preview: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          action_items?: Json
          created_at?: string | null
          dad_quotes?: Json
          headline: string
          icon: string
          id?: string
          is_premium?: boolean
          narrative: string
          phase: string
          pillar: Database["public"]["Enums"]["dad_challenge_pillar"]
          preview: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          action_items?: Json
          created_at?: string | null
          dad_quotes?: Json
          headline?: string
          icon?: string
          id?: string
          is_premium?: boolean
          narrative?: string
          phase?: string
          pillar?: Database["public"]["Enums"]["dad_challenge_pillar"]
          preview?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      dad_profiles: {
        Row: {
          concerns: string[] | null
          created_at: string | null
          family_nearby: boolean | null
          has_friend_support: boolean | null
          id: string
          is_first_time_dad: boolean | null
          partner_relationship: string | null
          updated_at: string | null
          user_id: string
          work_situation: string | null
        }
        Insert: {
          concerns?: string[] | null
          created_at?: string | null
          family_nearby?: boolean | null
          has_friend_support?: boolean | null
          id?: string
          is_first_time_dad?: boolean | null
          partner_relationship?: string | null
          updated_at?: string | null
          user_id: string
          work_situation?: string | null
        }
        Update: {
          concerns?: string[] | null
          created_at?: string | null
          family_nearby?: boolean | null
          has_friend_support?: boolean | null
          id?: string
          is_first_time_dad?: boolean | null
          partner_relationship?: string | null
          updated_at?: string | null
          user_id?: string
          work_situation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dad_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          baby_name: string | null
          birth_date: string | null
          created_at: string | null
          current_week: number | null
          due_date: string | null
          id: string
          invite_code: string | null
          name: string | null
          owner_id: string | null
          stage: Database["public"]["Enums"]["family_stage"] | null
          updated_at: string | null
        }
        Insert: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string | null
          current_week?: number | null
          due_date?: string | null
          id?: string
          invite_code?: string | null
          name?: string | null
          owner_id?: string | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          updated_at?: string | null
        }
        Update: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string | null
          current_week?: number | null
          due_date?: string | null
          id?: string
          invite_code?: string | null
          name?: string | null
          owner_id?: string | null
          stage?: Database["public"]["Enums"]["family_stage"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_budget: {
        Row: {
          actual_price: number | null
          budget_template_id: string | null
          category: string | null
          created_at: string | null
          estimated_price: number | null
          family_id: string
          id: string
          is_custom: boolean | null
          is_purchased: boolean | null
          is_recurring: boolean | null
          item: string
          notes: string | null
          purchased_at: string | null
          updated_at: string | null
        }
        Insert: {
          actual_price?: number | null
          budget_template_id?: string | null
          category?: string | null
          created_at?: string | null
          estimated_price?: number | null
          family_id: string
          id?: string
          is_custom?: boolean | null
          is_purchased?: boolean | null
          is_recurring?: boolean | null
          item: string
          notes?: string | null
          purchased_at?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_price?: number | null
          budget_template_id?: string | null
          category?: string | null
          created_at?: string | null
          estimated_price?: number | null
          family_id?: string
          id?: string
          is_custom?: boolean | null
          is_purchased?: boolean | null
          is_recurring?: boolean | null
          item?: string
          notes?: string | null
          purchased_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_budget_budget_template_id_fkey"
            columns: ["budget_template_id"]
            isOneToOne: false
            referencedRelation: "budget_templates"
            referencedColumns: ["budget_id"]
          },
          {
            foreignKeyName: "family_budget_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_tasks: {
        Row: {
          assigned_to: Database["public"]["Enums"]["task_assignee"] | null
          baby_id: string | null
          backlog_status: string | null
          category: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          due_date: string
          family_id: string
          id: string
          is_backlog: boolean | null
          is_custom: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug: string | null
          snoozed_until: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_template_id: string | null
          time_estimate_minutes: number | null
          title: string
          triage_action: string | null
          triage_date: string | null
          updated_at: string | null
          week_due: number | null
          why_it_matters: string | null
        }
        Insert: {
          assigned_to?: Database["public"]["Enums"]["task_assignee"] | null
          baby_id?: string | null
          backlog_status?: string | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          family_id: string
          id?: string
          is_backlog?: boolean | null
          is_custom?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug?: string | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_template_id?: string | null
          time_estimate_minutes?: number | null
          title: string
          triage_action?: string | null
          triage_date?: string | null
          updated_at?: string | null
          week_due?: number | null
          why_it_matters?: string | null
        }
        Update: {
          assigned_to?: Database["public"]["Enums"]["task_assignee"] | null
          baby_id?: string | null
          backlog_status?: string | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          family_id?: string
          id?: string
          is_backlog?: boolean | null
          is_custom?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug?: string | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_template_id?: string | null
          time_estimate_minutes?: number | null
          title?: string
          triage_action?: string | null
          triage_date?: string | null
          updated_at?: string | null
          week_due?: number | null
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_tasks_task_template_id_fkey"
            columns: ["task_template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["task_id"]
          },
        ]
      }
      mood_checkins: {
        Row: {
          checked_in_at: string
          created_at: string | null
          family_id: string
          id: string
          mood: string
          note: string | null
          phase: string | null
          situation_flags: string[] | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          created_at?: string | null
          family_id: string
          id?: string
          mood: string
          note?: string | null
          phase?: string | null
          situation_flags?: string[] | null
          user_id: string
        }
        Update: {
          checked_in_at?: string
          created_at?: string | null
          family_id?: string
          id?: string
          mood?: string
          note?: string | null
          phase?: string | null
          situation_flags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_checkins_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mood_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          partner_activity: boolean | null
          push_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          task_reminders_1_day: boolean | null
          task_reminders_3_day: boolean | null
          task_reminders_7_day: boolean | null
          updated_at: string | null
          user_id: string
          weekly_briefing: boolean | null
          weekly_briefing_day: number | null
          weekly_briefing_time: string | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          partner_activity?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          task_reminders_1_day?: boolean | null
          task_reminders_3_day?: boolean | null
          task_reminders_7_day?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_briefing?: boolean | null
          weekly_briefing_day?: number | null
          weekly_briefing_time?: string | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          partner_activity?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          task_reminders_1_day?: boolean | null
          task_reminders_3_day?: boolean | null
          task_reminders_7_day?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_briefing?: boolean | null
          weekly_briefing_day?: number | null
          weekly_briefing_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          read_at: string | null
          title: string
          type: string
          url: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          url?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_baby_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          family_id: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          signup_week: number | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
        }
        Insert: {
          active_baby_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          family_id?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          signup_week?: number | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Update: {
          active_baby_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          family_id?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          signup_week?: number | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_family"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          catch_up_behavior: string | null
          category: string | null
          commonly_completed_early: boolean | null
          created_at: string | null
          default_assignee: Database["public"]["Enums"]["task_assignee"] | null
          description: string | null
          due_date_offset_days: number
          is_premium: boolean | null
          is_time_sensitive: boolean | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug: string | null
          sort_order: number | null
          stage: Database["public"]["Enums"]["family_stage"]
          task_id: string
          time_estimate_minutes: number | null
          title: string
          week: number | null
          why_it_matters: string | null
          window_weeks: number | null
        }
        Insert: {
          catch_up_behavior?: string | null
          category?: string | null
          commonly_completed_early?: boolean | null
          created_at?: string | null
          default_assignee?: Database["public"]["Enums"]["task_assignee"] | null
          description?: string | null
          due_date_offset_days: number
          is_premium?: boolean | null
          is_time_sensitive?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug?: string | null
          sort_order?: number | null
          stage: Database["public"]["Enums"]["family_stage"]
          task_id: string
          time_estimate_minutes?: number | null
          title: string
          week?: number | null
          why_it_matters?: string | null
          window_weeks?: number | null
        }
        Update: {
          catch_up_behavior?: string | null
          category?: string | null
          commonly_completed_early?: boolean | null
          created_at?: string | null
          default_assignee?: Database["public"]["Enums"]["task_assignee"] | null
          description?: string | null
          due_date_offset_days?: number
          is_premium?: boolean | null
          is_time_sensitive?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          related_article_slug?: string | null
          sort_order?: number | null
          stage?: Database["public"]["Enums"]["family_stage"]
          task_id?: string
          time_estimate_minutes?: number | null
          title?: string
          week?: number | null
          why_it_matters?: string | null
          window_weeks?: number | null
        }
        Relationships: []
      }
      timeline_dots: {
        Row: {
          created_at: string | null
          description: string
          domain: string
          id: string
          is_active: boolean
          milestone_id: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          domain: string
          id?: string
          is_active?: boolean
          milestone_id?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          domain?: string
          id?: string
          is_active?: boolean
          milestone_id?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_dots_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "timeline_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_milestones: {
        Row: {
          created_at: string | null
          direction: string
          id: string
          label: string
          slug: string
          sort_order: number
          sub_label: string
        }
        Insert: {
          created_at?: string | null
          direction?: string
          id?: string
          label: string
          slug: string
          sort_order: number
          sub_label: string
        }
        Update: {
          created_at?: string | null
          direction?: string
          id?: string
          label?: string
          slug?: string
          sort_order?: number
          sub_label?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          id: string
          slug: string
          source: string
          stage: string
          stage_label: string
          thumbnail: string | null
          title: string
          updated_at: string
          url: string
          youtube_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          slug: string
          source: string
          stage: string
          stage_label: string
          thumbnail?: string | null
          title: string
          updated_at?: string
          url: string
          youtube_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          slug?: string
          source?: string
          stage?: string
          stage_label?: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
          url?: string
          youtube_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_current_week: {
        Args: { p_birth_date?: string; p_due_date: string }
        Returns: number
      }
      create_family_for_user: {
        Args: {
          p_baby_name?: string
          p_birth_date?: string
          p_due_date?: string
          p_stage: string
        }
        Returns: Json
      }
      generate_family_tasks: {
        Args: {
          p_birth_date?: string
          p_due_date?: string
          p_family_id: string
        }
        Returns: number
      }
      get_shift_briefing:
        | { Args: { p_family_id: string }; Returns: Json }
        | { Args: { p_baby_id?: string; p_family_id: string }; Returns: Json }
      get_trimester_from_week: {
        Args: { pregnancy_week: number }
        Returns: Database["public"]["Enums"]["family_stage"]
      }
      get_user_family_id: { Args: { user_uuid: string }; Returns: string }
      initialize_baby_tasks_with_catchup: {
        Args: { p_baby_id: string; p_signup_week: number }
        Returns: number
      }
      initialize_family_tasks_with_catchup: {
        Args: { p_due_date: string; p_family_id: string; p_signup_week: number }
        Returns: number
      }
      is_family_member: { Args: { family_uuid: string }; Returns: boolean }
      is_premium_user: { Args: never; Returns: boolean }
      regenerate_invite_code: { Args: { p_family_id: string }; Returns: string }
    }
    Enums: {
      dad_challenge_pillar:
        | "knowledge"
        | "planning"
        | "finances"
        | "anxiety"
        | "baby_bonding"
        | "relationship"
        | "extended_family"
      family_stage:
        | "pregnancy"
        | "post-birth"
        | "first-trimester"
        | "second-trimester"
        | "third-trimester"
      log_type:
        | "feeding"
        | "diaper"
        | "sleep"
        | "temperature"
        | "medicine"
        | "vitamin_d"
        | "mood"
        | "weight"
        | "height"
        | "milestone"
        | "custom"
      subscription_tier: "free" | "premium" | "lifetime"
      task_assignee: "mom" | "dad" | "both" | "either"
      task_priority: "must-do" | "good-to-do"
      task_status: "pending" | "completed" | "skipped" | "snoozed"
      user_role: "mom" | "dad" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
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
      dad_challenge_pillar: [
        "knowledge",
        "planning",
        "finances",
        "anxiety",
        "baby_bonding",
        "relationship",
        "extended_family",
      ],
      family_stage: [
        "pregnancy",
        "post-birth",
        "first-trimester",
        "second-trimester",
        "third-trimester",
      ],
      log_type: [
        "feeding",
        "diaper",
        "sleep",
        "temperature",
        "medicine",
        "vitamin_d",
        "mood",
        "weight",
        "height",
        "milestone",
        "custom",
      ],
      subscription_tier: ["free", "premium", "lifetime"],
      task_assignee: ["mom", "dad", "both", "either"],
      task_priority: ["must-do", "good-to-do"],
      task_status: ["pending", "completed", "skipped", "snoozed"],
      user_role: ["mom", "dad", "other"],
    },
  },
} as const
