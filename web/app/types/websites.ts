export interface website {
  id: number;
  slug: string;
  type: 'technology' | 'popular';
  category: string;
  developer: string;
  title: string;
  description: string;
  logo: string;
  images: string[];
  overview: string;
  website: string;
  docs: string;
  approved: boolean;
}

export interface WebsiteContact {
  id?: number;
  type: 'technology' | 'popular';
  company: string;
  country: string;
  details?: string;
  email: string;
  first: string;
  last: string;
  phone?: string;
  size?: number;
  title?: string;
  website: string;
  created_at?: string;
}

export interface WebsiteData {
  website_id: number; // Ensure this property is correctly defined
  url: string;
  site_name: string;
  last_crawled: Date;
}
