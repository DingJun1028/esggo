
import express from 'express';
import { apiRateLimiter } from './middleware/rateLimiters.js';
import { createServer } from 'http';

const app = express();
const PORT = 3003; // Change port to avoid conflict

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Express Error:', err);
    res.status(500).json({ error: err.message });
});

// Apply Rate Limiter
app.use('/api/test', apiRateLimiter, (req, res) => {
    res.json({ success: true, message: 'Request accepted' });
});

const server = createServer(app);

async function runVerification() {
    console.log('🚀 Starting Verification...');
    return new Promise<void>((resolve) => {
        server.listen(PORT, async () => {
            console.log(`🛡️ Isolated Verification Server running on port ${PORT}`);

            const limit = 100; // Hardcoded based on known config
            console.log(`🛡️ Testing Rate Limit: ${limit} requests`);

            console.log(`🛡️ Sending ${limit + 5} requests...`);

            let blocked = false;
            for (let i = 0; i < limit + 10; i++) {
                try {
                    const res = await fetch(`http://localhost:${PORT}/api/test`);
                    if (res.status === 429) {
                        console.log(`✅ Request ${i + 1} BLOCKED (429 Too Many Requests)`);
                        blocked = true;
                        break;
                    } else {
                        if (i % 10 === 0) process.stdout.write('.');
                    }
                } catch (err) {
                    console.error(`Request ${i + 1} failed`, err);
                }
            }
            console.log('');

            if (blocked) {
                console.log('✅ Rate Limiting PASSED');
            } else {
                console.error('❌ Rate Limiting FAILED: No requests were blocked');
            }

            server.close(() => {
                resolve();
            });
        });
    });
}

runVerification().catch(err => console.error('Fatal Error:', err));
