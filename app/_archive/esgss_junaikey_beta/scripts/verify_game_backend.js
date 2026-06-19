
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const API_URL = 'http://localhost:3001/api/game';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
console.log('DEBUG: Loaded JWT_SECRET starts with:', JWT_SECRET.substring(0, 5));
const TEST_USER_ID = 'test-user-nexus-001';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
};

async function runVerification() {
    console.log(`${colors.cyan}🌌 Starting Impact Nexus Backend Verification...${colors.reset}\n`);

    // 1. Generate Test Token
    const token = jwt.sign(
        { id: TEST_USER_ID, email: 'test@nexus.com', role: 'sovereign' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log(`${colors.green}✅ [AUTH] Generated Test Token${colors.reset}`);

    // 2. Define Mock State
    const mockState = {
        playerSoul: { xp: 100, level: 2, resonance: 60, rank: 'INITIATE' },
        village: { globalHealth: 90, entropyPressure: 10, nodes: [] },
        hand: [],
        deck: [],
        activeEvents: []
    };

    // 3. Test Sync (POST /sync)
    try {
        const syncRes = await axios.post(`${API_URL}/sync`, {
            userId: TEST_USER_ID,
            state: mockState
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (syncRes.data && syncRes.data.success) {
            console.log(`${colors.green}✅ [SYNC] State synced successfully${colors.reset}`);
        } else {
            console.error(`${colors.red}❌ [SYNC] Failed: ${JSON.stringify(syncRes.data)}${colors.reset}`);
            process.exit(1);
        }
    } catch (e) {
        console.error(`${colors.red}❌ [SYNC] Error Object:`, e);
        console.error(`Target URL: ${API_URL}/sync`);
        console.error(`${colors.red}❌ [SYNC] Error Message: ${e.message}${colors.reset}`);
        if (e.response) {
            console.error(`${colors.red}   Response: ${JSON.stringify(e.response.data)}${colors.reset}`);
        }
        process.exit(1);
    }

    // 4. Test Load (GET /state/:userId)
    try {
        const loadRes = await axios.get(`${API_URL}/state/${TEST_USER_ID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (loadRes.data && loadRes.data.success) {
            console.log(`${colors.green}✅ [LOAD] State loaded successfully${colors.reset}`);

            // Verify content
            if (loadRes.data.state.playerSoul.xp === mockState.playerSoul.xp) {
                console.log(`${colors.green}✅ [VERIFY] Loaded state matches synced state${colors.reset}`);
            } else {
                console.warn(`${colors.yellow}⚠️ [VERIFY] State mismatch!${colors.reset}`);
                console.log('Expected:', mockState.playerSoul.xp);
                console.log('Received:', loadRes.data.state.playerSoul.xp);
            }
        } else {
            console.error(`${colors.red}❌ [LOAD] Failed: ${JSON.stringify(loadRes.data)}${colors.reset}`);
        }
    } catch (e) {
        console.error(`${colors.red}❌ [LOAD] Error: ${e.message}${colors.reset}`);
        if (e.response) {
            console.error(`${colors.red}   Response: ${JSON.stringify(e.response.data)}${colors.reset}`);
        }
    }

    // 5. Test Crystallize (POST /crystallize)
    try {
        const crystalPayload = {
            userId: TEST_USER_ID,
            sessionData: {
                uuid: 'test-crystal-uuid',
                evidence: {
                    trustworthy: { hash_lock: 'test-hash-lock-123' }
                }
            }
        };

        const crystalRes = await axios.post(`${API_URL}/crystallize`, crystalPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (crystalRes.data && crystalRes.data.success) {
            console.log(`${colors.green}✅ [CRYSTALIZE] Crystallization successful${colors.reset}`);
        } else {
            console.error(`${colors.red}❌ [CRYSTALIZE] Failed: ${JSON.stringify(crystalRes.data)}${colors.reset}`);
        }
    } catch (e) {
        console.error(`${colors.red}❌ [CRYSTALIZE] Error: ${e.message}${colors.reset}`);
        if (e.response) {
            console.error(`${colors.red}   Response: ${JSON.stringify(e.response.data)}${colors.reset}`);
        }
    }

    console.log(`\n${colors.cyan}✨ Verification Complete${colors.reset}`);
}

runVerification();
