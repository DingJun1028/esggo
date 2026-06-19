import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

import { OmniTableService } from '../server/services/OmniTableService.js';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger.js';

async function verifyNodeRegistry() {
    console.log('🌌 Verifying Node-UUID Registry Persistence...');

    const testNodeId = `test-node-${Date.now()}`;
    const testUUID = '550e8400-e29b-41d4-a716-446655440000'; // Example UUID
    const testType = 'test-component';
    const testMetadata = { version: '1.0', label: 'Verification Test' };

    try {
        // 1. Register Node
        console.log(`\n🧪 Registering Node: ${testNodeId} -> ${testUUID}`);
        const regResult = await OmniTableService.registerNodeUUID(testNodeId, testUUID, testType, testMetadata);

        if (!regResult.success) {
            console.error('❌ Registration Failed:', regResult.error);
            if (regResult.error?.includes('relation "node_registry" does not exist')) {
                console.log('💡 TIP: You need to apply the migration: server/db/migrations/20260218_create_node_registry.sql');
            }
            process.exit(1);
        }
        console.log('✅ Registration Successful');

        // 2. Retrieve UUID
        console.log(`\n🧪 Retrieving UUID for Node: ${testNodeId}`);
        const retrievedUUID = await OmniTableService.getNodeUUID(testNodeId);

        if (retrievedUUID === testUUID) {
            console.log(`✅ Retrieval Successful: ${retrievedUUID}`);
        } else {
            console.error(`❌ Retrieval Mismatch! Expected ${testUUID}, got ${retrievedUUID}`);
            process.exit(1);
        }

        console.log('\n🎉 Node-UUID Registry Verified Successfully!');
    } catch (err) {
        console.error('❌ Verification Failed Critically:', err);
        process.exit(1);
    }
}

verifyNodeRegistry();
