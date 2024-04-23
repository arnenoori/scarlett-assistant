export interface WebsiteRow {
    id: number;
    url: string;
    site_name: string;
    normalized_url: string;
    tos_url?: string | null;
    favicon_url?: string | null;
    simplified_overview?: any | null;
    last_crawled?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }

  export interface WebsiteInsertData {
    url: string;
    site_name: string;
    normalized_url: string;
    last_crawled: string;
  }