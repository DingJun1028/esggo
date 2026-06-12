import { NextResponse } from 'next/server';
import { ncbClient } from '@/lib/ncbdb';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client to bypass RLS if needed, or just use regular client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 1. Fetch from Supabase (omniblue_nodes)
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('omniblue_nodes')
      .select('*')
      .limit(5);

    if (supabaseError) {
      console.warn('[OmniBlue API] Supabase query failed:', supabaseError);
    }

    // 2. Fetch from NCBDB (OmniBlue / ESG data)
    // We try to list records from a hypothetical "omniblue" or "esg_records" table
    const ncbdbRes = await ncbClient.listRecords('omniblue');
    
    // 3. Merge data
    return NextResponse.json({
      success: true,
      data: {
        supabase: supabaseData || [],
        ncbdb: ncbdbRes.success ? ncbdbRes.data : [],
        ncbdbError: ncbdbRes.error
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
