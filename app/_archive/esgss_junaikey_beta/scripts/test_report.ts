import { reportService } from '../src/services/ReportService';

async function testReport() {
    try {
        console.log('--- Testing Report Generation ---');
        const report = await reportService.generateReport({
            type: 'sustainability',
            timeframe: 'yearly',
            format: 'pdf'
        });

        console.log('Report Title:', report.title);
        console.log('Generated At:', report.generatedAt);
        console.log('Metadata:', JSON.stringify(report.metadata, null, 2));
        console.log('Content Preview (First 500 chars):');
        console.log(report.content.substring(0, 500));
        console.log('--- Test Complete ---');
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testReport();
