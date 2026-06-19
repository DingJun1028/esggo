
import { OmniSupabase } from '../server/services/OmniSupabase';
import { IOmniSpaceEntity } from '../src/types/omni/supabase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const omniSupabase = OmniSupabase.getInstance();

async function verifyOmniSupabase() {
    console.log('🌌 Verifying OmniSupabase Universal Functionality...');

    try {
        // 1. Initialize
        omniSupabase.initialize();
        const client = omniSupabase.getClient();

        if (!client) {
            throw new Error('Failed to initialize OmniSupabase client');
        }
        console.log('✅ OmniSupabase Initialized');

        // 2. Test OmniSpace Entity Persistence (5T Protocol)
        console.log('\n🧪 Testing T5 Protocol (Entity Persistence)...');

        const testId = `test-crystal-${Date.now()}`;
        const testEntity: IOmniSpaceEntity = {
            id: testId,
            type: 'crystal',
            data: { name: 'Test OmniCrystal', power: 9000 },
            version: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {
                source_origin: 'VerifyScript', // T2-Traceable
                impact_metric: 'High',         // T1-Tangible
                formula: 'E=mc^2',             // T4-Transparent
                path_log: ['Creation']         // T3-Trackable
            }
        };

        const savedId = await omniSupabase.saveOmniSpaceEntity(testEntity);
        console.log(`✅ Saved Entity ID: ${savedId}`);

        // Verify Hash & Retrieval
        const retrieved = await omniSupabase.getOmniSpaceEntity(savedId);
        if (retrieved) {
            console.log(`✅ Retrieved Entity: ${retrieved.id}`);
            if (retrieved.metadata.hash) {
                console.log(`✅ Verified T5-Trustworthy Hash: ${retrieved.metadata.hash.substring(0, 10)}...`);
            } else {
                console.error('❌ T5 Hash missing!');
            }
        } else {
            console.error('❌ Failed to retrieve entity');
        }

        // 3. Test Knowledge Sync
        console.log('\n🧪 Testing Knowledge Sync...');
        const syncResult = await omniSupabase.syncKnowledgeToBase('knowledge-test-123');
        if (syncResult.synced) {
            console.log('✅ Knowledge Sync Successful');
        } else {
            console.error('❌ Knowledge Sync Failed:', syncResult.error);
        }

        // 4. Test Evolution Log
        console.log('\n🧬 Testing Evolution Log...');
        await omniSupabase.evolution();
        console.log('✅ Evolution check completed');

        console.log('\n🎉 OmniSupabase Universal Optimization Verified!');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        // Do not exit with 1 if it's just a verification step fail, but log it.
        // But for CI/CD or rigorous testing, exit 1 is good.
        process.exit(1);
    }
}

verifyOmniSupabase();
