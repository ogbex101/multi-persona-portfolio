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
      brand_logos: {
        Row: {
          alt_text: string | null
          bg_color: string | null
          id: string
          is_starred: boolean | null
          logo_url: string
          niche_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          bg_color?: string | null
          id?: string
          is_starred?: boolean | null
          logo_url: string
          niche_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          bg_color?: string | null
          id?: string
          is_starred?: boolean | null
          logo_url?: string
          niche_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_logos_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          badge_url: string | null
          credential_link: string | null
          date_earned: string | null
          id: string
          issuer: string | null
          name: string
          niche_id: string
          sort_order: number | null
        }
        Insert: {
          badge_url?: string | null
          credential_link?: string | null
          date_earned?: string | null
          id?: string
          issuer?: string | null
          name: string
          niche_id: string
          sort_order?: number | null
        }
        Update: {
          badge_url?: string | null
          credential_link?: string | null
          date_earned?: string | null
          id?: string
          issuer?: string | null
          name?: string
          niche_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      email_designs: {
        Row: {
          client_name: string | null
          description: string | null
          id: string
          is_starred: boolean | null
          niche_id: string
          preview_url: string
          sort_order: number | null
          title: string
        }
        Insert: {
          client_name?: string | null
          description?: string | null
          id?: string
          is_starred?: boolean | null
          niche_id: string
          preview_url: string
          sort_order?: number | null
          title: string
        }
        Update: {
          client_name?: string | null
          description?: string | null
          id?: string
          is_starred?: boolean | null
          niche_id?: string
          preview_url?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_designs_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      niche_homepage_limits: {
        Row: {
          id: string
          max_display: number | null
          niche_id: string
          section_name: string
        }
        Insert: {
          id?: string
          max_display?: number | null
          niche_id: string
          section_name: string
        }
        Update: {
          id?: string
          max_display?: number | null
          niche_id?: string
          section_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "niche_homepage_limits_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      niche_settings: {
        Row: {
          accent_color: string | null
          animation_enabled: boolean | null
          bio: string | null
          custom_css: string | null
          email: string | null
          font_family: string | null
          full_name: string | null
          happy_clients: number | null
          hero_background_url: string | null
          hero_tagline: string | null
          id: string
          location: string | null
          niche_id: string
          phone: string | null
          primary_color: string | null
          profile_picture_url: string | null
          projects_count: number | null
          secondary_color: string | null
          title: string | null
          updated_at: string | null
          whatsapp: string | null
          years_experience: number | null
        }
        Insert: {
          accent_color?: string | null
          animation_enabled?: boolean | null
          bio?: string | null
          custom_css?: string | null
          email?: string | null
          font_family?: string | null
          full_name?: string | null
          happy_clients?: number | null
          hero_background_url?: string | null
          hero_tagline?: string | null
          id?: string
          location?: string | null
          niche_id: string
          phone?: string | null
          primary_color?: string | null
          profile_picture_url?: string | null
          projects_count?: number | null
          secondary_color?: string | null
          title?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          years_experience?: number | null
        }
        Update: {
          accent_color?: string | null
          animation_enabled?: boolean | null
          bio?: string | null
          custom_css?: string | null
          email?: string | null
          font_family?: string | null
          full_name?: string | null
          happy_clients?: number | null
          hero_background_url?: string | null
          hero_tagline?: string | null
          id?: string
          location?: string | null
          niche_id?: string
          phone?: string | null
          primary_color?: string | null
          profile_picture_url?: string | null
          projects_count?: number | null
          secondary_color?: string | null
          title?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "niche_settings_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: true
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      niche_stories: {
        Row: {
          id: string
          image_url: string | null
          niche_id: string
          quote: string | null
          story_text: string | null
        }
        Insert: {
          id?: string
          image_url?: string | null
          niche_id: string
          quote?: string | null
          story_text?: string | null
        }
        Update: {
          id?: string
          image_url?: string | null
          niche_id?: string
          quote?: string | null
          story_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "niche_stories_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: true
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      niches: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          brand_name: string
          category: string | null
          created_at: string | null
          description: string | null
          external_link: string | null
          figma_link: string | null
          id: string
          is_starred: boolean | null
          media_type: string | null
          media_url: string | null
          niche_id: string
          platform: string | null
          sort_order: number | null
        }
        Insert: {
          brand_name: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_link?: string | null
          figma_link?: string | null
          id?: string
          is_starred?: boolean | null
          media_type?: string | null
          media_url?: string | null
          niche_id: string
          platform?: string | null
          sort_order?: number | null
        }
        Update: {
          brand_name?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_link?: string | null
          figma_link?: string | null
          id?: string
          is_starred?: boolean | null
          media_type?: string | null
          media_url?: string | null
          niche_id?: string
          platform?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          is_starred: boolean | null
          niche_id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          is_starred?: boolean | null
          niche_id: string
          sort_order?: number | null
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          is_starred?: boolean | null
          niche_id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          icon: string | null
          id: string
          name: string
          niche_id: string
          percentage: number | null
          sort_order: number | null
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          niche_id: string
          percentage?: number | null
          sort_order?: number | null
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          niche_id?: string
          percentage?: number | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          icon: string | null
          id: string
          niche_id: string
          platform: string
          sort_order: number | null
          url: string
        }
        Insert: {
          icon?: string | null
          id?: string
          niche_id: string
          platform: string
          sort_order?: number | null
          url: string
        }
        Update: {
          icon?: string | null
          id?: string
          niche_id?: string
          platform?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          client_name: string
          id: string
          is_starred: boolean | null
          niche_id: string
          photo_url: string | null
          rating: number | null
          review_text: string
          role: string | null
          sort_order: number | null
        }
        Insert: {
          client_name: string
          id?: string
          is_starred?: boolean | null
          niche_id: string
          photo_url?: string | null
          rating?: number | null
          review_text: string
          role?: string | null
          sort_order?: number | null
        }
        Update: {
          client_name?: string
          id?: string
          is_starred?: boolean | null
          niche_id?: string
          photo_url?: string | null
          rating?: number | null
          review_text?: string
          role?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
