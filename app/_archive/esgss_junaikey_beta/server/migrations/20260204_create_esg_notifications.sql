-- 20260204_create_esg_notifications.sql
-- Proactive ESG Intelligence & Risk Alerts

CREATE TABLE IF NOT EXISTS public.esg_notifications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL, -- 'DAILY_BRIEFING', 'CRITICAL_RISK', 'ACTION_GUIDE'
    severity TEXT NOT NULL DEFAULT 'Info', -- 'High', 'Medium', 'Low', 'Info'
    action_guide TEXT,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) -- Optional: for targeted notifications
);

-- Enable RLS
ALTER TABLE public.esg_notifications ENABLE ROW LEVEL SECURITY;

-- Notifications are typically private or readable by all admins
CREATE POLICY "Users can read their own notifications" ON public.esg_notifications
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_esg_notifications_created_at ON public.esg_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_esg_notifications_unread ON public.esg_notifications(is_read) WHERE is_read = false;
