import { beforeAll, afterAll, afterEach } from 'vitest';
import pool from '../db/index.js';

/**
 * Global Test Setup
 * Runs before all tests
 */
beforeAll(async () => {
    console.log('🧪 Setting up test environment...');

    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'error';

    // Initialize database connection pool for tests
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Test database connection established');
    } catch (error) {
        console.error('❌ Test database connection failed:', error);
    }
});

/**
 * Cleanup after each test
 */
afterEach(async () => {
    // Clear any test data if needed
    // await pool.query('TRUNCATE TABLE test_table CASCADE');
});

/**
 * Global Teardown
 * Runs after all tests complete
 */
afterAll(async () => {
    console.log('🧹 Cleaning up test environment...');

    // Close database connections
    await pool.end();

    console.log('✅ Test environment cleaned up');
});
