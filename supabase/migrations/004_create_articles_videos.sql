-- Articles table for resource library
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL,
  stage_label TEXT NOT NULL,
  week INTEGER,
  excerpt TEXT,
  read_time INTEGER NOT NULL DEFAULT 5,
  is_free BOOLEAN NOT NULL DEFAULT false,
  reviewed_by TEXT,
  content TEXT NOT NULL,
  sources TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Videos table for resource library
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  youtube_id TEXT,
  stage TEXT NOT NULL,
  stage_label TEXT NOT NULL,
  duration INTEGER,
  thumbnail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for filtering and lookups
CREATE INDEX IF NOT EXISTS idx_articles_stage ON public.articles(stage);
CREATE INDEX IF NOT EXISTS idx_articles_is_free ON public.articles(is_free);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_videos_stage ON public.videos(stage);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON public.videos(slug);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Public read access (content is public for SEO)
CREATE POLICY "Articles are publicly readable" ON public.articles
  FOR SELECT USING (true);

CREATE POLICY "Videos are publicly readable" ON public.videos
  FOR SELECT USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to both tables
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
