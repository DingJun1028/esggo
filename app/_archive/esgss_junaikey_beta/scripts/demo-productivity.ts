/**
 * Demo Script: Productivity & Creation (生產與創造)
 * Scenario: Generating an ESG report from raw data.
 */

// Mock Services
const MockComputeEngine = {
  async calculateEmissions(data: any) {
    console.log(`[Engine] 🧮 Calculating Scope 2 Emissions for ${data.kwh} kWh...`);
    await new Promise(r => setTimeout(r, 500));
    // Simple coeff: 0.0005 tCO2e per kWh
    const result = data.kwh * 0.0005;
    return result; // tCO2e
  },
  async generateReport(metrics: any) {
    console.log(`[Generator] 📄 Compiling GRI-Standard Report...`);
    await new Promise(r => setTimeout(r, 1000));
    return {
      filename: 'esg_report_2026_q1.pdf',
      size: '4.2MB',
      pages: 12,
    };
  },
};

async function runProductivityDemo() {
  console.log('🚀 DEMO START: Productivity & Creation');
  console.log('--------------------------------------');

  // Step 1: Data Ingestion
  const inputData = { kwh: 12500, region: 'TW' };
  console.log(`📥 Raw Data Ingested: Electricity = ${inputData.kwh} kWh`);

  // Step 2: Calculation
  const emissions = await MockComputeEngine.calculateEmissions(inputData);
  console.log(`✅ Calculation Complete: ${emissions} tCO2e`);

  // Step 3: Generate Report
  const report = await MockComputeEngine.generateReport({ scope2: emissions });
  console.log(`✅ Report Generated:`);
  console.log(`   - File: ${report.filename}`);
  console.log(`   - Size: ${report.size}`);

  // Step 4: Archive
  console.log(`[Memory] 💾 Archiving report to Knowledge Base... OK`);

  console.log('--------------------------------------');
  console.log('演示完成 (Demo Complete)');
}

runProductivityDemo().catch(console.error);
