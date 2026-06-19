import { reportService } from '../src/services/ReportService';

async function testReportService() {
    console.log('Testing ReportService...');

    try {
        const report = await reportService.generateReport({
            type: 'sustainability',
            timeframe: 'monthly',
            format: 'pdf'
        });

        console.log('Report generated successfully:');
        console.log(JSON.stringify(report, null, 2));

        if (report.id && report.title.includes('Sustainability Report')) {
            console.log('✅ Verification Passed');
        } else {
            console.error('❌ Verification Failed: Invalid report output');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error testing ReportService:', error);
        process.exit(1);
    }
}

testReportService();
