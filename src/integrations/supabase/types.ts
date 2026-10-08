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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          body_ur: string | null
          created_at: string
          created_by: string | null
          id: string
          pinned: boolean
          title: string
          title_ur: string | null
          updated_at: string
        }
        Insert: {
          body?: string
          body_ur?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title: string
          title_ur?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          body_ur?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title?: string
          title_ur?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          category: string
          created_at: string
          description: string | null
          event_date: string | null
          grade: number | null
          id: string
          is_public: boolean
          subject: string | null
          title: string
          title_ur: string | null
          url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          grade?: number | null
          id?: string
          is_public?: boolean
          subject?: string | null
          title: string
          title_ur?: string | null
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          grade?: number | null
          id?: string
          is_public?: boolean
          subject?: string | null
          title?: string
          title_ur?: string | null
          url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          requested_grade: number | null
        }
        Insert: {
          approved?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          requested_grade?: number | null
        }
        Update: {
          approved?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          requested_grade?: number | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          created_at: string
          id: string
          quiz_id: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_id: string
          score?: number
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          advice: string | null
          correct_index: number
          created_at: string
          id: string
          options: Json
          prompt: string
          prompt_ur: string | null
          quiz_id: string
          sort_order: number
        }
        Insert: {
          advice?: string | null
          correct_index?: number
          created_at?: string
          id?: string
          options?: Json
          prompt: string
          prompt_ur?: string | null
          quiz_id: string
          sort_order?: number
        }
        Update: {
          advice?: string | null
          correct_index?: number
          created_at?: string
          id?: string
          options?: Json
          prompt?: string
          prompt_ur?: string | null
          quiz_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          grade: number | null
          id: string
          is_published: boolean
          kind: string
          points_per_question: number
          subject: string | null
          title: string
          title_ur: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          grade?: number | null
          id?: string
          is_published?: boolean
          kind?: string
          points_per_question?: number
          subject?: string | null
          title: string
          title_ur?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          grade?: number | null
          id?: string
          is_published?: boolean
          kind?: string
          points_per_question?: number
          subject?: string | null
          title?: string
          title_ur?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      leaderboard: {
        Args: never
        Returns: {
          attempts: number
          full_name: string
          points: number
          requested_grade: number
          user_id: string
        }[]
      }
      member_names: {
        Args: never
        Returns: {
          full_name: string
          id: string
          requested_grade: number
        }[]
      }
      quiz_advice: {
        Args: { _quiz_id: string }
        Returns: {
          advice: string
          id: string
          prompt: string
          sort_order: number
        }[]
      }
      submit_quiz: {
        Args: { _answers: Json; _quiz_id: string }
        Returns: {
          score: number
          total: number
        }[]
      }
      take_quiz: {
        Args: { _quiz_id: string }
        Returns: {
          id: string
          options: Json
          prompt: string
          prompt_ur: string
          sort_order: number
        }[]
      }
      teacher_list: {
        Args: never
        Returns: {
          full_name: string
          id: string
          role: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "member" | "teacher"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "member", "teacher"],
    },
  },
} as const
