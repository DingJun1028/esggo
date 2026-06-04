export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { firebaseAdmin } from '@/lib/firebase-admin';
// Generate UUID using Firebase Admin Firestore (or we can use crypto)
// Using Firebase Admin Firestore doc id as UUID
function generateUUID() {
    return firebaseAdmin.firestore().collection('_').doc().id;
}
export async function POST(request) {
    try {
        const body = await request.json();
        const { contract_code, counterparty_tax_id, evidence_bundle_id } = body;
        // Validate required fields per spec: must include evidence_bundle_id
        if (!evidence_bundle_id) {
            return NextResponse.json({ error: 'evidence_bundle_id is required' }, { status: 400 });
        }
        // Generate a new contract record (simplified)
        const contract = {
            id: generateUUID(),
            contract_code,
            counterparty_tax_id,
            evidence_bundle_id,
            created_at: new Date().toISOString(),
        };
        // Insert into Supabase table 'contracts'
        const { data, error } = await supabase
            .from('contracts')
            .insert([contract])
            .select()
            .single();
        if (error)
            throw error;
        return NextResponse.json(data, { status: 201 });
    }
    catch (error) {
        console.error('Error creating contract:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
// Optional: GET all contracts
export async function GET() {
    try {
        const { data, error } = await supabase.from('contracts').select('*');
        if (error)
            throw error;
        return NextResponse.json(data ?? [], { status: 200 });
    }
    catch (error) {
        console.error('Error fetching contracts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map