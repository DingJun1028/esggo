/**
 * API 測試腳本
 * 執行：npx tsx scripts/test-api.ts
 */

const API_BASE_URL = 'http://localhost:3000/api/vault';

async function testWriteAPI() {
    console.log('🧪 測試寫入 API...');

    const response = await fetch(`${API_BASE_URL}/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            formula: 'E = Σ(AD × EF)',
            impactMetric: {
                source: 'ISO-14064-1',
                value: 1234.56,
                unit: 'tCO2e',
            },
            sourceOrigin: 'ISO-14064-1',
            lifecycleStage: 'verified',
            metadata: {
                company: 'Test Corp',
                year: 2024,
            },
        }),
    });

    const result = await (response.json() as Promise<any>);
    console.log('✅ 寫入結果:', JSON.stringify(result, null, 2));
    return result.data?.uuid;
}

async function testReadAPI(uuid: string) {
    console.log('\n🧪 測試讀取 API...');

    const response = await fetch(`${API_BASE_URL}/read?uuid=${uuid}`);
    const result = await response.json();
    console.log('✅ 讀取結果:', JSON.stringify(result, null, 2));
}

async function testVerifyAPI(uuid: string) {
    console.log('\n🧪 測試驗證 API...');

    const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
    });

    const result = await response.json();
    console.log('✅ 驗證結果:', JSON.stringify(result, null, 2));
}

async function testListAPI() {
    console.log('\n🧪 測試列表 API...');

    const response = await fetch(`${API_BASE_URL}/list?page=1&limit=10`);
    const result = await response.json();
    console.log('✅ 列表結果:', JSON.stringify(result, null, 2));
}

async function testStatsAPI() {
    console.log('\n🧪 測試統計 API...');

    const response = await fetch(`${API_BASE_URL}/stats`);
    const result = await response.json();
    console.log('✅ 統計結果:', JSON.stringify(result, null, 2));
}

async function testTraceAPI(uuid: string) {
    console.log('\n🧪 測試溯源 API...');

    const response = await fetch(`${API_BASE_URL}/trace?uuid=${uuid}`);
    const result = await response.json();
    console.log('✅ 溯源結果:', JSON.stringify(result, null, 2));
}

async function runAllTests() {
    console.log('🚀 開始完整 API 測試\n');

    try {
        // 1. 寫入測試
        const uuid = await testWriteAPI();

        if (!uuid) {
            console.error('❌ 寫入失敗，終止測試');
            return;
        }

        // 2. 讀取測試
        await testReadAPI(uuid);

        // 3. 驗證測試
        await testVerifyAPI(uuid);

        // 4. 列表測試
        await testListAPI();

        // 5. 統計測試
        await testStatsAPI();

        // 6. 溯源測試
        await testTraceAPI(uuid);

        console.log('\n✅ 所有測試完成！');
    } catch (error) {
        console.error('❌ 測試失敗:', error);
    }
}

runAllTests();
