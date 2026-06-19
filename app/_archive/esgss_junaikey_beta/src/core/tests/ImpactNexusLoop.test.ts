import { sustainabilityVillageService } from '../../services/SustainabilityVillageService';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

async function verifyGameLoop() {
    const service = sustainabilityVillageService;

    console.log('--- starting Impact Nexus Loop Verification ---');

    // 1. Initial State
    await service.drawInitialHand();
    let state = service.getState();
    console.log(`Initial Hand Size: ${state.hand.length} (Expected: 5)`);
    console.log(`Initial XP: ${state.playerSoul.xp}`);

    if (state.hand.length !== 5) {
        throw new Error('Initial hand draw failed');
    }

    // 2. Play a card
    const cardId = state.hand[0].uuid;
    const nodeId = state.village.nodes[0].id;
    const cardTitle = state.hand[0].metadata.title;

    console.log(`Playing card: ${cardTitle} on Node: ${state.village.nodes[0].name}`);
    const success = await service.playCard(cardId, nodeId);

    if (!success) {
        throw new Error('Card play failed');
    }

    state = service.getState();
    console.log(`New Hand Size: ${state.hand.length} (Expected: 5)`);
    console.log(`New XP: ${state.playerSoul.xp} (Expected: 50)`);
    console.log(`Recent Event: ${state.activeEvents[0].message}`);

    // 3. Crystallize
    console.log('Crystallizing session...');
    const asset = await service.crystallizeSession();
    console.log(`Crystallized Asset UUID: ${asset.uuid}`);
    console.log(`5T Hash Lock: ${asset.evidence.trustworthy?.hash_lock}`);

    if (!asset.evidence.trustworthy?.hash_lock) {
        throw new Error('Crystallization failed: No hash lock');
    }

    console.log('--- verification COMPLETED SUCCESSFULY ---');
}

verifyGameLoop().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
