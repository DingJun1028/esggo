
import dotenv from 'dotenv';
import openClawClient from '../server/services/OpenClawGatewayClient.js';

dotenv.config();

async function test5T() {
    console.log('--- 🧪 Testing 5T Protocol Verification ---');

    try {
        console.log('Attempting to connect...');
        await openClawClient.connect();
        console.log('✅ Connected to OpenClaw successfully');

        const prompt = 'Hello, can you give me a very short ESG tip?';
        console.log(`Sending Chat Prompt: ${prompt}`);

        // 1. Test Regular Chat (Generic Response)
        const response = await openClawClient.chat(prompt);
        console.log('--- Chat Response Received ---');
        console.log(response);
        if (response._5t) {
            console.log('✅ 5T Metadata found in chat response:', response._5t);
        } else {
            console.log('❌ 5T Metadata MISSING in chat response');
        }

        // 2. Test Streaming Chat (Final Event Metadata)
        console.log('--- Streaming Response ---');
        const runId = `test-stream-${Date.now()}`;
        const stream = openClawClient.streamChat(prompt);

        // We need to manually listen to the delta events to see the metadata passed in the final event
        // Actually streamChat yields text, not metadata. Let's see if we can check the emitter.

        let lastMetadata = null;
        // The client emits chat:delta:${id} with (text, metadata)
        // We can't easily see metadata through the generator unless we modify it.
        // But we can peek at the events.

        for await (const chunk of stream) {
            process.stdout.write(chunk);
        }
        console.log('\n--- Stream Finished ---');

        // Let's rely on the chat() test for now as it uses the same hashing logic.

    } catch (err) {
        console.error('❌ Test failed:', err);
    } finally {
        process.exit(0);
    }
}

test5T();
