/*
 * ZKP 電路：數據完整性驗證
 * --------------------------------------------------
 * [標準] zk-SNARK (Groth16)
 * [工具] circom 2.0
 * [用途] 證明數據符合 4T 協議但不洩露原始數據
 * 
 * [電路邏輯]
 * 輸入：
 *   - privateData: 原始數據（私密）
 *   - dataHash: 數據雜湊（公開）
 *   - threshold: 閾值（公開）
 * 
 * 輸出：
 *   - valid: 數據是否有效（公開）
 * 
 * 約束：
 *   1. hash(privateData) == dataHash
 *   2. privateData >= threshold
 */

pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

// 主電路：數據完整性驗證
template DataIntegrityProof() {
    // 私密輸入
    signal input privateData;      // 原始數據（不會被公開）
    signal input privateSalt;      // 隨機鹽值（防止彩虹表攻擊）
    
    // 公開輸入
    signal input dataHash;         // 數據雜湊（公開）
    signal input threshold;        // 閾值（公開）
    
    // 公開輸出
    signal output valid;           // 驗證結果
    
    // 組件：Poseidon 雜湊函數
    component hasher = Poseidon(2);
    hasher.inputs[0] <== privateData;
    hasher.inputs[1] <== privateSalt;
    
    // 約束 1：雜湊值必須匹配
    dataHash === hasher.out;
    
    // 組件：大於等於比較器
    component gte = GreaterEqThan(252);
    gte.in[0] <== privateData;
    gte.in[1] <== threshold;
    
    // 約束 2：數據必須大於等於閾值
    valid <== gte.out;
}

// 主組件
component main {public [dataHash, threshold]} = DataIntegrityProof();
