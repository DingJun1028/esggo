// 測試JunAiKey與ESG系統整合
const { exec } = require('child_process');

console.log('🧪 測試ESGss JunAiKey整合系統...\n');

// 測試1: 檢查前端服務
console.log('1. 檢查前端服務狀態...');
exec('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', (error, stdout) => {
    if (stdout === '200') {
        console.log('✅ 前端服務運行正常 (HTTP 200)');
    } else {
        console.log('❌ 前端服務未運行或有問題');
    }

    // 測試2: 檢查JunAiKey服務
    console.log('\n2. 檢查JunAiKey服務狀態...');
    exec('curl -s -H "x-celestial-token: celestial-access-2024" -X POST http://localhost:3003/api/manifest', (error, stdout) => {
        try {
            const response = JSON.parse(stdout);
            if (response.sessionId) {
                console.log('✅ JunAiKey服務運行正常');
                console.log('   Session ID:', response.sessionId);
            } else {
                console.log('❌ JunAiKey服務回應異常');
            }
        } catch (e) {
            console.log('❌ JunAiKey服務未運行或API密鑰未設置');
            console.log('   請確保 .env 文件中的 GEMINI_API_KEY 已正確設置');
        }

        // 測試3: 測試AI對話功能
        console.log('\n3. 測試AI對話功能...');
        const testMessage = encodeURIComponent('你好，這是ESG系統整合測試');
        exec(`curl -s -H "x-celestial-token: celestial-access-2024" "http://localhost:3003/api/interact?message=${testMessage}&sessionId=test-session"`, (error, stdout) => {
            if (stdout.includes('data:')) {
                console.log('✅ AI對話功能正常');
            } else {
                console.log('❌ AI對話功能異常');
            }

            console.log('\n📋 整合測試完成！');
            console.log('\n🚀 如需體驗完整功能：');
            console.log('   1. 打開瀏覽器訪問: http://localhost:3000');
            console.log('   2. 點擊右上角"AI助手"按鈕');
            console.log('   3. 查看"AI洞見"標籤頁的智慧分析');
            console.log('\n💡 示例問題：');
            console.log('   • "分析我們的ESG表現"');
            console.log('   • "如何提升永續評分"');
            console.log('   • "ESG投資趨勢分析"');
        });
    });
});