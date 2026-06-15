-- Create User Preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE DEFAULT 'default-user' NOT NULL,
    theme TEXT DEFAULT 'light' NOT NULL,
    language TEXT DEFAULT 'zh-TW' NOT NULL,
    sidebar_collapsed BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write access for default user" 
ON public.user_preferences FOR ALL 
TO anon, authenticated 
USING (user_id = 'default-user') 
WITH CHECK (user_id = 'default-user');

-- Create User Activity Logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Activity Logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insertions for all users" 
ON public.user_activity_logs FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow read access for own logs" 
ON public.user_activity_logs FOR SELECT 
TO anon, authenticated 
USING (user_id = 'default-user');

-- Create Index for high performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);
