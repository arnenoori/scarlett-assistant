export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      terms_of_service: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          simplified_content: Json | null
          tos_url: string | null
          updated_at: string | null
          website_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          simplified_content?: Json | null
          tos_url?: string | null
          updated_at?: string | null
          website_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          simplified_content?: Json | null
          tos_url?: string | null
          updated_at?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "terms_of_service_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      TermsOfService: {
        Row: {
          content: string
          lastUpdated: string
          simplifiedContent: string
          tosId: number
          tosUrl: string | null
          versionIdentifier: string | null
          websiteId: number
        }
        Insert: {
          content: string
          lastUpdated?: string
          simplifiedContent: string
          tosId?: number
          tosUrl?: string | null
          versionIdentifier?: string | null
          websiteId: number
        }
        Update: {
          content?: string
          lastUpdated?: string
          simplifiedContent?: string
          tosId?: number
          tosUrl?: string | null
          versionIdentifier?: string | null
          websiteId?: number
        }
        Relationships: []
      }
      website_contacts: {
        Row: {
          company: string | null
          country: string | null
          created_at: string | null
          details: string | null
          email: string
          first: string | null
          id: number
          last: string | null
          phone: string | null
          size: number | null
          title: string | null
          type: Database["public"]["Enums"]["website_type"] | null
          website: string | null
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          details?: string | null
          email: string
          first?: string | null
          id?: number
          last?: string | null
          phone?: string | null
          size?: number | null
          title?: string | null
          type?: Database["public"]["Enums"]["website_type"] | null
          website?: string | null
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          details?: string | null
          email?: string
          first?: string | null
          id?: number
          last?: string | null
          phone?: string | null
          size?: number | null
          title?: string | null
          type?: Database["public"]["Enums"]["website_type"] | null
          website?: string | null
        }
        Relationships: []
      }
      websites: {
        Row: {
          created_at: string | null
          favicon_url: string | null
          id: number
          last_crawled: string | null
          normalized_url: string
          simplified_overview: Json | null
          site_name: string
          tos_url: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          favicon_url?: string | null
          id?: number
          last_crawled?: string | null
          normalized_url: string
          simplified_overview?: Json | null
          site_name: string
          tos_url?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          favicon_url?: string | null
          id?: number
          last_crawled?: string | null
          normalized_url?: string
          simplified_overview?: Json | null
          site_name?: string
          tos_url?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      website_type: "technology" | "popular"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never