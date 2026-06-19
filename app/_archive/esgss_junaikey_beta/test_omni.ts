/**
 * Omni Integration Test Suite
 * 
 * 奧秘圓通全功能規劃整合測試
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

import { createOmni, Omni } from './server/services/Omni.js';
import { createOmniRequest, OmniServiceType } from './server/services/OmniGateway.js';
import { createNaturalLanguageRequest } from './server/services/OmniAgent.js';

// ============================================================================
// Test Runner
// ============================================================================

interface TestResult {
    name: string;
    success: boolean;
    message?: string;
    error?: unknown;
    duration: number;
}

class OmniTestRunner {
    private results: TestResult[] = [];
    private omni: Omni;

    constructor() {
        this.omni = createOmni({
            gateway: {
                prefix: '/api/omni',
                enableAuth: false
            },
            cache: {
                maxSize: 1000,
                defaultTTL: 60000,
                strategy: 'LRU'
            },
            queue: {
                name: 'test_queue',
                maxConcurrent: 5,
                maxRetries: 2
            }
        });
    }

    async runAllTests(): Promise<TestResult[]> {
        console.log('🧪 Starting Omni (奧秘圓通) Integration Tests...\n');

        // Initialize
        await this.test('Initialize Omni', () => this.omni.initialize());

        // Gateway Tests
        await this.test('Gateway Health Check', () => this.testGatewayHealth());
        await this.test('Gateway Service Info', () => this.testGatewayServices());
        await this.test('Gateway Process Request', () => this.testGatewayProcess());

        // Agent Tests
        await this.test('Agent NLP Processing', () => this.testAgentNLP());
        await this.test('Agent Intent Recognition', () => this.testAgentIntent());

        // Monitor Tests
        await this.test('Monitor Health Check', () => this.testMonitorHealth());
        await this.test('Monitor Metrics', () => this.testMonitorMetrics());

        // Cache Tests
        await this.test('Cache Set/Get', () => this.testCacheSetGet());
        await this.test('Cache Stats', () => this.testCacheStats());

        // Queue Tests
        await this.test('Queue Enqueue', () => this.testQueueEnqueue());
        await this.test('Queue Stats', () => this.testQueueStats());

        // Overall Health
        await this.test('Overall Health Check', () => this.testOverallHealth());

        console.log('\n📊 Test Results Summary:');
        console.log(`Total: ${this.results.length}`);
        console.log(`Passed: ${this.results.filter(r => r.success).length}`);
        console.log(`Failed: ${this.results.filter(r => !r.success).length}\n`);

        // Print failed tests
        const failed = this.results.filter(r => !r.success);
        if (failed.length > 0) {
            console.log('❌ Failed Tests:');
            for (const test of failed) {
                console.log(`  - ${test.name}: ${test.error}`);
            }
        }

        return this.results;
    }

    private async test(name: string, testFn: () => Promise<void>): Promise<void> {
        const startTime = Date.now();
        try {
            await testFn();
            const duration = Date.now() - startTime;
            this.results.push({
                name,
                success: true,
                duration
            });
            console.log(`✅ ${name} (${duration}ms)`);
        } catch (error) {
            const duration = Date.now() - startTime;
            this.results.push({
                name,
                success: false,
                error,
                duration
            });
            console.log(`❌ ${name} (${duration}ms): ${error}`);
        }
    }

    // ============================================================================
    // Test Methods
    // ============================================================================

    private async testGatewayHealth(): Promise<void> {
        const health = await this.omni.getGateway().initialize();
        console.log('    Gateway initialized');
    }

    private async testGatewayServices(): Promise<void> {
        const services = this.omni.getGateway().getServiceInfo();
        if (services.length === 0) {
            throw new Error('No services registered');
        }
        console.log(`    Found ${services.length} services`);
    }

    private async testGatewayProcess(): Promise<void> {
        const request = createOmniRequest(
            'CRM',
            'contacts',
            { operation: 'create', prompt: 'Add John Doe' }
        );
        const response = await this.omni.getGateway().processRequest(request);
        if (!response.success) {
            throw new Error(response.error?.message || 'Request failed');
        }
        console.log('    CRM request processed');
    }

    private async testAgentNLP(): Promise<void> {
        const request = createNaturalLanguageRequest(
            'Add a new contact for Alice from Google',
            'test_user'
        );
        const response = await this.omni.getAgent().processNaturalLanguage(request);
        if (!response.success) {
            throw new Error('NLP processing failed');
        }
        console.log(`    Intent: ${response.metadata.intent}, Confidence: ${response.metadata.confidence}`);
    }

    private async testAgentIntent(): Promise<void> {
        const testPhrases = [
            'Create a new deal for 50k',
            'Add a contact',
            'Generate a chart',
            'Analyze the data'
        ];

        for (const phrase of testPhrases) {
            const request = createNaturalLanguageRequest(phrase);
            const response = await this.omni.getAgent().processNaturalLanguage(request);
            console.log(`    "${phrase}" -> Intent: ${response.metadata.intent}`);
        }
    }

    private async testMonitorHealth(): Promise<void> {
        const health = await this.omni.getMonitor().getHealth();
        console.log(`    Overall status: ${health.overall}`);
    }

    private async testMonitorMetrics(): Promise<void> {
        const metrics = this.omni.getMonitor().getMetrics();
        console.log(`    Collected ${metrics.length} metrics`);
    }

    private async testCacheSetGet(): Promise<void> {
        const cache = this.omni.getCache();
        await cache.set('test_key', { name: 'test', value: 123 });
        const value = await cache.get<{ name: string; value: number }>('test_key');
        if (value?.value !== 123) {
            throw new Error('Cache get/set failed');
        }
        console.log('    Cache set/get successful');
    }

    private async testCacheStats(): Promise<void> {
        const stats = await this.omni.getCache().getStats();
        console.log(`    Cache size: ${stats.size}, Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
    }

    private async testQueueEnqueue(): Promise<void> {
        const task = await this.omni.getQueue().enqueue(
            'test_task',
            { data: 'test_payload' },
            { priority: 'HIGH' }
        );
        console.log(`    Task enqueued: ${task.id}`);
    }

    private async testQueueStats(): Promise<void> {
        const stats = await this.omni.getQueue().getStats();
        console.log(`    Queue pending: ${stats.pending}, Processing: ${stats.processing}`);
    }

    private async testOverallHealth(): Promise<void> {
        const health = await this.omni.healthCheck();
        console.log(`    Overall status: ${health.overall}, Uptime: ${health.uptime.toFixed(2)}s`);
    }
}

// ============================================================================
// Run Tests
// ============================================================================

async function main(): Promise<void> {
    const runner = new OmniTestRunner();
    const results = await runner.runAllTests();

    const exitCode = results.every(r => r.success) ? 0 : 1;
    process.exit(exitCode);
}

main().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});

// ============================================================================
// Export
// ============================================================================

export { OmniTestRunner };
export type { TestResult };
