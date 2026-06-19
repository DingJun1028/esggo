
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Helper to log progress
const log = (msg) => console.log(`[DEBUG] ${msg}`);

async function debug() {
    log('Starting import debug...');

    try {
        log('Importing omniLogger...');
        await import('../server/utils/omniLogger.js');
        // OR is it server/src/utils? Let's try what ComplianceMonitor uses.
        // ComplianceMonitor uses '../utils/omniLogger.js' relative to server/services.
        // So server/utils/omniLogger.js.
        log('✅ omniLogger imported.');
    } catch (e) {
        log(`❌ omniLogger failed: ${e.message}`);
        console.error(e);
        return;
    }

    try {
        log('Importing SystemHealthService...');
        // ComplianceMonitor uses '../src/services/SystemHealthService.js' relative to server/services.
        // So server/src/services/SystemHealthService.js.
        await import('../server/src/services/SystemHealthService.js');
        log('✅ SystemHealthService imported.');
    } catch (e) {
        log(`❌ SystemHealthService failed: ${e.message}`);
        console.error(e);
        return;
    }

    try {
        log('Importing IntelligenceDispatchService...');
        await import('../server/services/IntelligenceDispatchService.js');
        log('✅ IntelligenceDispatchService imported.');
    } catch (e) {
        log(`❌ IntelligenceDispatchService failed: ${e.message}`);
        console.error(e);
        return;
    }

    try {
        log('Importing ComplianceMonitorService...');
        await import('../server/services/ComplianceMonitorService.js');
        log('✅ ComplianceMonitorService imported.');
    } catch (e) {
        log(`❌ ComplianceMonitorService failed: ${e.message}`);
        console.error(e);
        return;
    }

    log('All imports successful!');
}

debug();
