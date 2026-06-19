import { exampleServiceIntegration } from '../src/examples/WuTongIntegration';

// Run the example integration
console.log('🚀 Starting Wu-Tong Integration Verification...');
try {
    exampleServiceIntegration();
    console.log('✅ Verification script completed successfully.');
} catch (error) {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
}
