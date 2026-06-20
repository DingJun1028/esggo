-- Create reading_room_documents table
CREATE TABLE IF NOT EXISTS public.reading_room_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'standard',
  file_url TEXT,
  gri_reference TEXT,
  esg_category TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  published_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reading_room_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read reading_room_documents"
  ON public.reading_room_documents FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage reading_room_documents"
  ON public.reading_room_documents FOR ALL
  USING (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_reading_room_documents_category ON public.reading_room_documents(category);
CREATE INDEX IF NOT EXISTS idx_reading_room_documents_esg_category ON public.reading_room_documents(esg_category);
