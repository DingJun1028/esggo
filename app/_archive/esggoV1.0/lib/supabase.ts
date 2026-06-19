import { createClient } from "@supabase/supabase-js";

// Sanitize inputs to prevent "String contains non ISO-8859-1 code point" errors
const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mruetmtibkbzfaawfjbm.supabase.co";
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydWV0bXRpYmtiemZhYXdmamJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDU0MjIsImV4cCI6MjA3ODYyMTQyMn0.PIBhYztcwZhmsFWd_8anuuj5sb8xoST-rHgAVH9kou8";

const supabaseUrl = rawUrl.replace(/[^\x20-\x7E]/g, "").trim();
const supabaseAnonKey = rawKey.replace(/[^\x20-\x7E]/g, "").trim();

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
