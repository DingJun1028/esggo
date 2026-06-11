import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = (() => {
  try {
    if (supabaseUrl && serviceRoleKey && serviceRoleKey !== 'your_service_role_key_here') {
      return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
    }
  } catch {}
  return null;
})();

export default supabaseAdmin;