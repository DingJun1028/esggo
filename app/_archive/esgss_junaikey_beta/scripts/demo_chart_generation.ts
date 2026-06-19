/**
 * 圖表生成工具示範
 * ==================
 * 展示如何自動生成並嵌入圖表到報告中
 */

import { chartGenerationTool } from '../src/adk/tools/ChartGenerationTool';

console.log('🎨 圖表生成工具示範\n');

// 1. 趨勢圖
console.log('1️⃣ 生成趨勢圖...');
const trendChart = chartGenerationTool.generateTrendChart({
    title: 'ESG綜合分數趨勢',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [65, 72, 78, 85, 92],
    label: 'ESG分數',
    target: 95
});
console.log(`  ✓ 保存至: ${trendChart.filepath}`);
console.log(`  ✓ 嵌入代碼: ${trendChart.embedCode}\n`);

// 2. 對比圖
console.log('2️⃣ 生成對比圖...');
const comparisonChart = chartGenerationTool.generateComparisonChart({
    title: '標竿企業ESG對比',
    companies: ['TSMC', 'Apple', 'Microsoft', '我們公司'],
    scores: [95, 92, 90, 88],
    metric: 'ESG綜合分數 (0-100)'
});
console.log(`  ✓ 保存至: ${comparisonChart.filepath}`);
console.log(`  ✓ 嵌入代碼: ${comparisonChart.embedCode}\n`);

// 3. 圓餅圖
console.log('3️⃣ 生成圓餅圖...');
const pieChart = chartGenerationTool.generatePieChart({
    title: 'ESG預算分配',
    data: [
        { label: '環境 (E)', value: 45 },
        { label: '社會 (S)', value: 35 },
        { label: '治理 (G)', value: 20 }
    ]
});
console.log(`  ✓ 保存至: ${pieChart.filepath}`);
console.log(`  ✓ 嵌入代碼: ${pieChart.embedCode}\n`);

// 4. 儀表板圖
console.log('4️⃣ 生成儀表板圖...');
const dashboardChart = chartGenerationTool.generateDashboardChart({
    title: '整體ESG表現',
    score: 88,
    maxScore: 100
});
console.log(`  ✓ 保存至: ${dashboardChart.filepath}`);
console.log(`  ✓ 嵌入代碼: ${dashboardChart.embedCode}\n`);

console.log('═'.repeat(60));
console.log('✅ 所有圖表已生成！');
console.log('');
console.log('📁 圖表保存位置: reports/adk-generated/charts/');
console.log('');
console.log('💡 在 Markdown 中使用：');
console.log('   只需複製上面的嵌入代碼即可！');
console.log('   例如：![ESG綜合分數趨勢](file:///path/to/chart.svg)');
console.log('');
