CREATE TABLE websites (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  normalized_url TEXT NOT NULL,
  tos_url TEXT,
  favicon_url TEXT,
  simplified_overview JSONB,
  category TEXT,
  last_crawled TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE terms_of_service (
  id SERIAL PRIMARY KEY,
  website_id INTEGER REFERENCES websites(id),
  content TEXT,
  simplified_content JSONB,
  tos_url TEXT,
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);