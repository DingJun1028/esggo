import { NextResponse } from 'next/server';
import { supabase } from '@/src/server/lib/supabase';
import { IOmniComponent } from '@/components/omni/types';

/**
 * Omni Components API (App Router)
 * Returns the list of Omni components from Supabase.
 */
export async function GET() {
  try {
    const { data, error } = await supabase.from('omni_components' as any).select('*');
    
    if (error) {
      console.error('Error fetching omni components', error);
      return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
    }

    const components = data as IOmniComponent[];
    return NextResponse.json({ components });
  } catch (e) {
    console.error('Unexpected error in omni-components API', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
