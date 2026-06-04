"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalHealingServer_1 = require("../server/healing/GlobalHealingServer");
const resonanceEngine_1 = require("./resonanceEngine");
async function runFullProcess() {
    // 模擬一組卡牌
    const card = {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Demo Card',
        attributes: ['Cyan'],
        abilities: ['Heal'],
        status: 'todo',
        lastUpdated: Date.now()
    };
    // 1. 痊癒 (全域痊癒) - 假設已實作 GlobalHealingService
    const healingService = new GlobalHealingServer_1.GlobalHealingService();
    const healingResult = await healingService.healCard(card);
    console.log('HealingResult:', healingResult);
    const coreCard = {
        uuid: card.uuid,
        version: '1.0.0',
        timestamp: card.lastUpdated,
        evidence: [],
        formula: '',
        impact_metric: '',
        status: 'Trustworthy',
        hash_lock: ''
    };
    // 2. 全維共鳴計算
    const resonanceEngine = new resonanceEngine_1.ResonanceEngine();
    const resonanceResult = await resonanceEngine.calculateResonance([coreCard]);
    console.log('ResonanceResult:', resonanceResult);
}
runFullProcess().catch(console.error);
//# sourceMappingURL=full-process-test.js.map