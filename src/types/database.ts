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
      baby_logs: {
        Row: {
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
          budget_id: string
          category: string
          created_at: string | null
          description: string | null
          is_premium: boolean | null
          item: string
          notes: string | null
          price_currency: string | null
          price_high: number | null
          price_low: number | null
          price_mid: number | null
          priority: string | null
          stage: Database["public"]["Enums"]["family_stage"]
          subcategory: string | null
          week_end: number | null
          week_start: number | null
        }
        Insert: {
          budget_id: string
          category: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          item: string
          notes?: string | null
          price_currency?: string | null
          price_high?: number | null
          price_low?: number | null
          price_mid?: number | null
          priority?: string | null
          stage: Database["public"]["Enums"]["family_stage"]
          subcategory?: string | null
          week_end?: number | null
          week_start?: number | null
        }
        Update: {
          budget_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          is_premium?: boolean | null
          item?: string
          notes?: string | null
          price_currency?: string | null
          price_high?: number | null
          price_low?: number | null
          price_mid?: number | null
          priority?: string | null
          stage?: Database["public"]["Enums"]["family_stage"]
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
          category: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          due_date: string
          family_id: string
          id: string
          is_custom: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          snoozed_until: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: Database["public"]["Enums"]["task_assignee"] | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          family_id: string
          id?: string
          is_custom?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: Database["public"]["Enums"]["task_assignee"] | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          family_id?: string
          id?: string
          is_custom?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_template_id?: string | null
          title?: string
          updated_at?: string | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          family_id: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          family_id?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          family_id?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
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
          category: string | null
          created_at: string | null
          default_assignee: Database["public"]["Enums"]["task_assignee"] | null
          description: string | null
          due_date_offset_days: number
          is_premium: boolean | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          sort_order: number | null
          stage: Database["public"]["Enums"]["family_stage"]
          task_id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          default_assignee?: Database["public"]["Enums"]["task_assignee"] | null
          description?: string | null
          due_date_offset_days: number
          is_premium?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          sort_order?: number | null
          stage: Database["public"]["Enums"]["family_stage"]
          task_id: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          default_assignee?: Database["public"]["Enums"]["task_assignee"] | null
          description?: string | null
          due_date_offset_days?: number
          is_premium?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          sort_order?: number | null
          stage?: Database["public"]["Enums"]["family_stage"]
          task_id?: string
          title?: string
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
      get_shift_briefing: { Args: { p_family_id: string }; Returns: Json }
      get_user_family_id: { Args: { user_uuid: string }; Returns: string }
      is_family_member: { Args: { family_uuid: string }; Returns: boolean }
      is_premium_user: { Args: Record<PropertyKey, never>; Returns: boolean }
      regenerate_invite_code: { Args: { p_family_id: string }; Returns: string }
    }
    Enums: {
      family_stage: "pregnancy" | "post-birth"
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
      family_stage: ["pregnancy", "post-birth"],
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
