
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//     throw new Error("Missing Supabase environment variables. Check .env.local");
// }

// Create client with fallback dummy values to prevent build-time crash.
// Actual calls will fail if keys are missing/invalid, which is expected behavior without proper env vars.
// The dummy URL must be a valid URL format to pass 'new URL()' check inside supabase-js.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseKey || 'placeholder-key'
);
