// scripts/test_report_generation.ts
/**
 * 🧪 Report Generation API — Verification Script
 * Tests: POST generate → GET status → GET history (MISS/HIT) → GET by ID → DELETE
 *
 * Usage:
 *   npx tsx scripts/test_report_generation.ts
 *
 * Environment:
 *   API_BASE_URL — defaults to http://localhost:3001
 *   TEST_USER_ID — the userId to use in requests (must exist in Supabase auth)
 *   TEST_AUTH_TOKEN — Bearer token for the authenticated user
 */
import 'dotenv/config';

const BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3001';
const USER_ID = process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000001';
const TOKEN = process.env.TEST_AUTH_TOKEN || '';

const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

let passed = 0;
let failed = 0;

function ok(label: string, condition: boolean, detail?: string) {
    if (condition) {
        console.log(`  ✅ ${label}`);
        passed++;
    } else {
        console.error(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
        failed++;
    }
}

async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

// ── Test 1: POST /api/reports/generate ──────────────────────────────────────
async function testGenerate(): Promise<string | null> {
    console.log('\n[1] POST /api/reports/generate');
    const res = await fetch(`${BASE_URL}/api/reports/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            userId: USER_ID,
            type: 'ESG_Intelligence',
            persona: 'Dr. Thoth',
            language: 'Traditional Chinese',
        }),
    });

    const body = await res.json();
    console.log('    →', JSON.stringify(body));

    ok('Returns 202 Accepted', res.status === 202, `status: ${res.status}`);
    ok('Has jobId', !!body.jobId, `body.jobId: ${body.jobId}`);
    ok('Status is pending', body.status === 'pending', `body.status: ${body.status}`);

    return body.jobId || null;
}

// ── Test 2: GET /api/reports/status/:jobId ───────────────────────────────────
async function testStatus(jobId: string): Promise<string | null> {
    console.log(`\n[2] GET /api/reports/status/${jobId}`);

    // Poll up to 60s for completion
    for (let attempt = 0; attempt < 30; attempt++) {
        const res = await fetch(`${BASE_URL}/api/reports/status/${jobId}`, { headers });
        const body = await res.json();

        console.log(`    [attempt ${attempt + 1}] status: ${body.status}`);

        ok('Returns 200', res.status === 200, `actual: ${res.status}`);

        if (body.status === 'completed') {
            ok('Job completed with reportId', !!body.result?.reportId, JSON.stringify(body.result));
            return body.result?.reportId || null;
        }

        if (body.status === 'failed') {
            ok('Job completed (should not be failed)', false, `error: ${body.error}`);
            return null;
        }

        await sleep(2000);
    }

    // If queue is in fallback mode (OmniQueue), status may not be 'completed' — check history
    ok('Job eventually completed', false, 'Timed out after 60s');
    return null;
}

// ── Test 3: GET /api/reports/history (cache MISS) ────────────────────────────
async function testHistoryMiss(): Promise<string | null> {
    console.log(`\n[3] GET /api/reports/history (first call — expect X-Cache: MISS)`);
    const res = await fetch(`${BASE_URL}/api/reports/history?userId=${USER_ID}`, { headers });
    const body = await res.json();

    ok('Returns 200', res.status === 200, `actual: ${res.status}`);
    ok('X-Cache: MISS', res.headers.get('X-Cache') === 'MISS', `actual: ${res.headers.get('X-Cache')}`);
    ok('Returns array', Array.isArray(body.data), `body.data type: ${typeof body.data}`);

    const firstId = body.data?.[0]?.id || null;
    if (firstId) console.log(`    → First report ID: ${firstId}`);
    return firstId;
}

// ── Test 4: GET /api/reports/history (cache HIT) ─────────────────────────────
async function testHistoryHit() {
    console.log(`\n[4] GET /api/reports/history (second call — expect X-Cache: HIT)`);
    const res = await fetch(`${BASE_URL}/api/reports/history?userId=${USER_ID}`, { headers });
    const body = await res.json();

    ok('Returns 200', res.status === 200);
    ok('X-Cache: HIT', res.headers.get('X-Cache') === 'HIT', `actual: ${res.headers.get('X-Cache')}`);
    ok('Returns array', Array.isArray(body.data));
}

// ── Test 5: GET /api/reports/:id ─────────────────────────────────────────────
async function testGetById(reportId: string) {
    console.log(`\n[5] GET /api/reports/${reportId}`);
    const res = await fetch(`${BASE_URL}/api/reports/${reportId}`, { headers });
    const body = await res.json();

    ok('Returns 200', res.status === 200, `actual: ${res.status}`);
    ok('Has report data', !!body.data, `body.data: ${JSON.stringify(body.data)?.substring(0, 80)}`);
    ok('Report ID matches', body.data?.id === reportId, `data.id: ${body.data?.id}`);
}

// ── Test 6: DELETE /api/reports/:id ──────────────────────────────────────────
async function testDelete(reportId: string) {
    console.log(`\n[6] DELETE /api/reports/${reportId}`);
    const res = await fetch(`${BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers,
    });
    const body = await res.json();

    ok('Returns 200', res.status === 200, `actual: ${res.status}`);
    ok('success: true', body.success === true);

    // Verify deletion — GET should return 404
    const checkRes = await fetch(`${BASE_URL}/api/reports/${reportId}`, { headers });
    ok('Report no longer accessible (404)', checkRes.status === 404, `actual: ${checkRes.status}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  Report Generation API — Verification Script   ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`  BASE_URL: ${BASE_URL}`);
    console.log(`  USER_ID:  ${USER_ID}`);
    console.log(`  AUTH:     ${TOKEN ? 'Bearer (set)' : '⚠️  No token — some tests may fail if auth is enforced'}`);

    try {
        const jobId = await testGenerate();
        if (!jobId) {
            console.warn('\n⚠️  No jobId returned — skipping status test');
        }

        let reportId: string | null = null;

        if (jobId) {
            // Allow time for worker in fallback (inline) mode
            await sleep(3000);
            const fromStatus = await testStatus(jobId);
            if (fromStatus) reportId = fromStatus;
        }

        // History provides a fallback path to get a reportId
        const firstId = await testHistoryMiss();
        await testHistoryHit();

        if (!reportId && firstId) reportId = firstId;

        if (reportId) {
            await testGetById(reportId);
            await testDelete(reportId);
        } else {
            console.warn('\n⚠️  No reportId — skipping getById/delete tests');
            console.warn('   (likely worker in fallback mode or no pre-existing reports)');
        }
    } catch (err: any) {
        console.error('\n💥 Fatal error:', err.message);
        failed++;
    }

    console.log('\n══════════════════════════════════════════════════');
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log('══════════════════════════════════════════════════\n');

    if (failed > 0) process.exit(1);
}

main();
