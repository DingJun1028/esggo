
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// [Best Practice] Single authority dotenv load — try project root, then fall back to server dir
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// [Best Practice] Warn if falling back to anon key — service role key provides elevated privileges needed for server operations
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('[SupabaseClient] ⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key. RLS policies may block server-side operations.');
}

let client: any;

if (!supabaseUrl || !supabaseKey) {
    // Check if we are in a build/test env where secrets might be mocked
    if (process.env.NODE_ENV !== 'test') {
        console.warn('[SupabaseClient] Warning: SUPABASE_URL or Key missing. Database calls will fail.');
    }

    // Resilience Mock: Returns a chainable object that resolves to an error
    // This allows code like `await supabase.from('...').insert(...)` to run without crashing.
    const createMockBuilder = () => {
        const builder: any = {
            then: (resolve: any) => {
                // When awaited, resolve with an error object (simulating Supabase response)
                resolve({
                    data: null,
                    error: { message: 'Supabase credentials missing (Resilience Mode)', code: 'MOCK_ERROR' }
                });
            }
        };

        // Proxy to trap all method calls (select, insert, eq, etc.) and return the builder itself
        return new Proxy(builder, {
            get: (target, prop) => {
                if (prop in target) return target[prop]; // 'then', etc.
                return (...args: any[]) => {
                    // console.debug(`[SupabaseMock] Call: ${String(prop)}`); // Optional debug
                    return createMockBuilder(); // Return new builder for chaining
                };
            }
        });
    };

    const mockClient = {
        from: (table: string) => createMockBuilder(),
        storage: {
            from: (bucket: string) => createMockBuilder()
        },
        auth: {
            getUser: async () => ({ data: { user: null }, error: { message: 'No auth' } }),
            signInWithPassword: async () => ({ data: { user: null }, error: { message: 'No auth' } }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
        },
        // Add other root methods if needed
    };

    client = mockClient;

} else {
    client = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false, // Backend service usually doesn't need session persistence in local storage
            autoRefreshToken: false,
        }
    });
}

export const supabase = client;
export default supabase;
