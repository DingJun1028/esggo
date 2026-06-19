/**
 * Trinity Protocol Verification Script
 * Verifies that OmniGateway and OmniAgent are correctly implementing the Trinity Protocol.
 */
import { OmniGateway, createOmniRequest } from './OmniGateway.js';
import { OmniAgent, createNaturalLanguageRequest } from './OmniAgent.js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';

async function verifyTrinity() {
    console.log('🛡️ Verifying Trinity Protocol Implementation...');

    try {
        // 1. Initialize Gateway
        const gateway = OmniGateway.getInstance();
        await gateway.initialize();
        console.log('✅ OmniGateway Initialized');

        // 2. Test Direct Trinity Request (OmniRequest)
        console.log('📡 Testing Direct Trinity Request...');
        const request = createOmniRequest(
            'CRM',
            'contacts',
            { prompt: 'Create test contact', metadata: { operation: 'create' } },
            { sessionId: 'test-session', source: 'TrinityVerifier' }
        );

        console.log('   Header:', JSON.stringify(request.header));
        console.log('   Payload:', JSON.stringify(request.payload));

        const response = await gateway.processRequest(request);

        if (response.success) {
            console.log('✅ Direct Request Succeeded');
            console.log('   Response Meta:', JSON.stringify(response.meta));
            if (response.meta.requestId && response.meta.timestamp) {
                console.log('   Trinity Metadata Valid');
            } else {
                console.error('❌ Trinity Metadata Missing');
            }
        } else {
            console.error('❌ Direct Request Failed:', response.error);
        }

        // 3. Test Agent Flow (which uses Gateway internally)
        console.log('🤖 Testing OmniAgent Flow...');
        const agent = OmniAgent.getInstance();
        await agent.initialize();

        const nlRequest = createNaturalLanguageRequest('Create a contact for John Doe at Acme Corp');
        const agentResponse = await agent.processNaturalLanguage(nlRequest);

        if (agentResponse.success) {
            console.log('✅ Agent Request Succeeded');
            console.log('   Agent Response Metadata:', JSON.stringify(agentResponse.metadata));
        } else {
            console.error('❌ Agent Request Failed:', agentResponse.error);
        }

        console.log('🛡️ Verification Complete.');

    } catch (error) {
        console.error('❌ Verification Failed with Exception:', error);
    }
}

verifyTrinity();
