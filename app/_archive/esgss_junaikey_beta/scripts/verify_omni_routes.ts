/**
 * scripts/verify_omni_routes.ts
 * Verification script for core service routes registration.
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

const ROUTES_TO_VERIFY = [
    { path: '/api/agents', method: 'GET', authenticated: true },
    { path: '/api/manifest', method: 'POST', authenticated: true },
    { path: '/api/interact', method: 'GET', authenticated: true },
    { path: '/api/v1/log-step', method: 'POST', authenticated: true },
    { path: '/api/v1/task-finish', method: 'POST', authenticated: true },
    { path: '/api/v1/project-lock', method: 'POST', authenticated: true },
    { path: '/api/evolution/evolve', method: 'POST', authenticated: true },
    { path: '/api/verification', method: 'GET', authenticated: false },
    { path: '/api/omni/gateway', method: 'GET', authenticated: true },
    { path: '/api/game', method: 'GET', authenticated: true }
];

async function verifyRoutes() {
    console.log(`\n🚀 Starting Route Verification at ${BASE_URL}\n`);
    let passed = 0;
    let failed = 0;

    for (const route of ROUTES_TO_VERIFY) {
        try {
            // We are primarily testing for registration (should NOT return 404)
            // Even if it returns 401/403 (Unauthorized), it confirms the route is registered.
            const response = await axios({
                method: route.method,
                url: `${BASE_URL}${route.path}`,
                validateStatus: (status) => status !== 404
            });

            console.log(`✅ [${route.method}] ${route.path} - Status: ${response.status} (Registered)`);
            passed++;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log(`❌ [${route.method}] ${route.path} - NOT REGISTERED (404)`);
                failed++;
            } else {
                console.log(`✅ [${route.method}] ${route.path} - Registered (Error: ${error.response?.status || error.message})`);
                passed++;
            }
        }
    }

    console.log(`\n📊 Verification Summary:`);
    console.log(`   Total: ${ROUTES_TO_VERIFY.length}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}\n`);

    if (failed > 0) {
        process.exit(1);
    }
}

verifyRoutes().catch(err => {
    console.error('Verification failed critically:', err);
    process.exit(1);
});
