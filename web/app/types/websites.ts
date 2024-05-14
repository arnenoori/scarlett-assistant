import { TermsOfServiceRow } from './terms_of_service';

export interface WebsiteRow {
  id: number;
  url: string;
  site_name: string;
  tos_url?: string | null;
  last_crawled?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  view_counter: number;
  website_description?: string | null;
  terms_of_service?: TermsOfServiceRow | null;
  category?: string | null;
  logo_svg?: string | null;
}