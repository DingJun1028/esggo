
import { supabase } from './server/db/supabaseClient.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const API_URL = 'http://localhost:5000/api';
// Assuming we have a test user or can generate a token
// For this script, we might need to bypass auth or use a known test token if verify_token middleware is active.
// Or we can test the service layer directly if API verification is too complex due to auth.

// However, testing routes is better. Let's try to hit the health check or a public endpoint first.
// If auth is needed, we can simulate a logged-in user if we have a way to generate a JWT, 
// or we can test the 'public' webhook route in boostSpaceRoutes.

async function verifyMigration() {
    console.log('🚀 Starting Supabase Migration Verification...');

    // 1. Verify Supabase Connection
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Supabase Connection: OK');
    } catch (e: any) {
        console.error('❌ Supabase Connection Failed:', e.message);
        process.exit(1);
    }

    // 2. Verify OmniSpace Webhook Route (No Auth required for simple check or uses query param)
    try {
        // We defined it as needing a secret in the new code
        const secret = process.env.OMNI_SPACE_WEBHOOK_SECRET || 'test_secret';
        // Note: The code checks process.env.OMNI_SPACE_WEBHOOK_SECRET, 
        // so we must ensure the request matches what's on the server.
        // If the server isn't running with this env var, check might fail or pass depending on logic.

        // Actually, we can't easily test routes without the server running. 
        // We should assume the user will run this script alongside the server, OR we verify the Service Layer directly.

        // Service Layer Verification is more reliable for this script as it doesn't require separate process.
        console.log('\n🔍 Verifying Service Layer Integration...');

        // Check Evidence Service (using Supabase)
        // We can't easily import services here if they require the server to be running or are ESM modules that conflict with ts-node if not setup right.
        // But since we are in the same project, we can try importing.

        // Dynamic import to handle ESM if needed
        const { omniSpaceService } = await import('./server/src/services/integration/OmniSpaceService.js');
        if (omniSpaceService) {
            console.log('✅ OmniSpaceService loaded successfully');
        }

        // We can try to query directly using supabase to ensure 'evidence' table exists/accessible
        const { error: matchError } = await supabase.from('evidence').select('id').limit(1);
        if (!matchError) {
            console.log('✅ Evidence Table Accessible');
        } else {
            console.error('❌ Evidence Table Error:', matchError.message);
        }

        const { error: battleError } = await supabase.from('battle_records').select('id').limit(1);
        if (!battleError) {
            console.log('✅ Battle Records Table Accessible');
        } else {
            console.error('❌ Battle Records Table Error:', battleError.message);
        }

        const { error: auditError } = await supabase.from('audit_logs').select('id').limit(1);
        if (!auditError) {
            console.log('✅ Audit Logs Table Accessible');
        } else {
            console.error('❌ Audit Logs Table Error:', auditError.message);
        }

    } catch (e: any) {
        console.error('❌ Verification Failed:', e);
    }

    console.log('\n✨ Verification Complete.');
}

verifyMigration();
