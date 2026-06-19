/**
 * 🧪 Phase 4 Intelligent Services Verification
 * --------------------------------------------------
 * Tests OCR extraction and Report generation logic.
 */

import { EnhancedOCRService } from '../src/services/ai/EnhancedOCRService';
import { EnhancedReportService } from '../src/services/reporting/EnhancedReportService';

async function verifyPhase4() {
    console.log('🧪 Starting Phase 4 Intelligent Services Verification...');

    // 1. Test OCR Extraction
    const ocr = new EnhancedOCRService();
    console.log('🔍 Testing OCR extraction...');
    const text = await ocr.extractText('test-document.pdf');
    const metrics = await ocr.extractMetrics(text, 'Carbon Report');

    if (metrics.length > 0) {
        console.log('🟢 OCR Metric Extraction Successful.');
    } else {
        throw new Error('OCR extraction failed to yield metrics.');
    }

    // 2. Test Report Generation
    const reporter = new EnhancedReportService();
    console.log('📄 Testing Report generation...');
    const reportResult = await reporter.generateReport({
        userId: 'user-001',
        reportType: 'ESG_COMPREHENSIVE'
    });

    if (reportResult.success) {
        console.log(`🟢 Report Generation Successful: ${reportResult.url}`);
    } else {
        throw new Error('Report generation failed.');
    }

    console.log('🏆 Phase 4 Verification Successful: Intelligent Services are operational.');
}

verifyPhase4().catch(err => {
    console.error('❌ Phase 4 Verification Error:', err);
    process.exit(1);
});
