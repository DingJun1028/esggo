/**
 * 🧪 Test: Redis Cache Verification
 * ---------------------------------------
 * 驗證 ESG 指標與市場情資的快取邏輯。
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
import jwt from 'jsonwebtoken';

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

async function testCache() {
    console.log('?? Starting Redis Cache Verification...');

    try {
        // 1. Test ESG Metrics
        console.log('\n--- [Testing ESG Metrics Cache] ---');
        console.log('? Fetching metrics (1st time - should be DB)...');
        const res1 = await axios.get(`${API_BASE}/esg/metrics`);
        const source1 = res1.headers['x-cache'] || res1.data.source || 'db/unknown';
        console.log(`Source: ${source1}, Status: ${res1.status}`);

        console.log('? Fetching metrics (2nd time - should be CACHE)...');
        const res2 = await axios.get(`${API_BASE}/esg/metrics`);
        const source2 = res2.headers['x-cache'] || res2.data.source || 'db/unknown';
        console.log(`Source: ${source2}, Status: ${res2.status}`);

        if (source2 === 'HIT' || res2.data.source === 'cache') {
            console.log('✅ Metrics caching verified!');
        } else {
            console.warn('⚠️ Metrics caching check failed (maybe Redis offline or TTL too short)');
        }

        // 2. Test Market Intelligence News
        console.log('\n--- [Testing Market Intelligence Cache] ---');
        console.log('? Fetching news (1st time - should be DB)...');

        // Use actual JWT signing for the test
        const secret = process.env.JWT_SECRET || 'default-jwt-secret-key';
        const mockToken = jwt.sign({ id: '123', email: 'test@example.com' }, secret);
        const authHeader = { Authorization: `Bearer ${mockToken}` };

        const news1 = await axios.get(`${API_BASE}/market/news?limit=5`, { headers: authHeader });
        const newsSource1 = news1.headers['x-cache'] || 'database';
        console.log(`Source: ${newsSource1}, Count: ${news1.data.data.length}`);

        console.log('? Fetching news (2nd time - should be CACHE)...');
        const news2 = await axios.get(`${API_BASE}/market/news?limit=5`, { headers: authHeader });
        const newsSource2 = news2.headers['x-cache'] || 'unknown';
        console.log(`Source: ${newsSource2}, Status: ${news2.status}`);

        if (newsSource2 === 'HIT') {
            console.log('✅ Market news caching verified!');
        }

        // 3. Test Cache Invalidation
        console.log('\n--- [Testing Cache Invalidation] ---');
        console.log('? Triggering crawl (should invalidate cache)...');
        await axios.post(`${API_BASE}/market/crawl`, { query: 'TestCompany' }, { headers: authHeader });

        console.log('? Fetching news after crawl (should be DB)...');
        const news3 = await axios.get(`${API_BASE}/market/news?limit=5`, { headers: authHeader });
        console.log(`Source: ${news3.data.source || 'database'} (Expected: database)`);

        if (news3.data.source === 'database') {
            console.log('✅ Cache invalidation verified!');
        }

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testCache();
