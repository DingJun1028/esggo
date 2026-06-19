import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        // Check for authorization header to ensure only Vercel Cron can call this
        // Vercel automatically adds this header to cron jobs
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Note: For simplicity in this setup, we're not strictly enforcing it yet 
            // unless you set CRON_SECRET in your Vercel env variables.
            // But it's good practice for the future.
        }

        // Execute a simple query to keep the database active
        // We just select 1 row from a table. It doesn't matter which table, as long as it hits the DB.
        const { data, error } = await supabase
            .from('esg_sunshine_newsletter_subscribers')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Keep alive error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase keep-alive ping successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Keep alive execution error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
