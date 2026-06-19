-- Add Stripe Monetization columns to company_profiles
ALTER TABLE IF EXISTS public.company_profiles 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'Free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- Create an index on stripe_customer_id for faster lookups during webhooks
CREATE INDEX IF NOT EXISTS idx_company_profiles_stripe_customer_id ON public.company_profiles(stripe_customer_id);
