import redisService from '../server/services/redisService.js';

async function clearCache() {
    console.log('[ClearCache] Connecting to Redis...');
    try {
        await redisService.del('acceptance:result:OmniCelestial');
        console.log('[ClearCache] Deleted key: acceptance:result:OmniCelestial');
    } catch (error) {
        console.error('[ClearCache] Error:', error);
    } finally {
        await redisService.disconnect();
        process.exit(0);
    }
}

clearCache();
