-- server/db/migrations/create_news_articles.sql

CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name text NOT NULL,
  title text NOT NULL,
  content text,
  url text UNIQUE NOT NULL,
  source text,
  category text,
  impact_score numeric(3,2),
  tags text[],
  is_collected boolean DEFAULT true,
  magazine_issue text,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  updated_at timestamp NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_news_company ON news_articles (company_name);
CREATE INDEX IF NOT EXISTS idx_news_created ON news_articles (created_at);
