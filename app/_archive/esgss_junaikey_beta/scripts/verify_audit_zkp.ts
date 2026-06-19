/**
 * ZK-Audit Trail 驗證腳本
 * --------------------------------------------------
 * [目的] 驗證 AuditTrail 組件中使用的 ZKP 邏輯是否正確
 * [步驟] 
 * 1. 模擬審計日誌數據
 * 2. 使用 ZKPIntegrityService 驗證證明
 * 3. 斷言驗證結果
 */

import { ZKPIntegrityService, ZKPProof } from '../src/omni/services/ZKPIntegrityService';

async function verifyAuditZkp() {
    console.log('🚀 開始驗證 ZK-Audit Trail 整合邏輯...');

    // 1. 模擬一個帶有 ZKP 證明的審計日誌
    const mockProof: ZKPProof = {
        publicInput: '0x' + 'a'.repeat(62),
        proofData: 'b'.repeat(64), // 簡化版驗證要求長度為 64
        timestamp: Date.now(),
        privacyLevel: 'granular'
    };

    console.log('📦 模擬證明數據:', {
        publicInput: mockProof.publicInput.substring(0, 10) + '...',
        privacyLevel: mockProof.privacyLevel
    });

    // 2. 執行驗證
    try {
        const result = await ZKPIntegrityService.verifyProof(mockProof);

        // 3. 檢查結果
        if (result.valid) {
            console.log('✅ 驗證成功:', result.message);
        } else {
            console.error('❌ 驗證失敗:', result.message);
            process.exit(1);
        }

        // 4. 測試過期邏輯 (模擬 25 小時前)
        const expiredProof: ZKPProof = {
            ...mockProof,
            timestamp: Date.now() - (25 * 60 * 60 * 1000)
        };

        const expiredResult = await ZKPIntegrityService.verifyProof(expiredProof);
        if (!expiredResult.valid && expiredResult.confidenceLevel === 'expired') {
            console.log('✅ 過期檢測正常:', expiredResult.message);
        } else {
            console.error('❌ 過期檢測異常');
            process.exit(1);
        }

        console.log('\n✨ 所有驗證項目通過！ZK-Audit Trail 整合邏輯正確。');
    } catch (error) {
        console.error('💥 驗證過程中發生錯誤:', error);
        process.exit(1);
    }
}

verifyAuditZkp();
