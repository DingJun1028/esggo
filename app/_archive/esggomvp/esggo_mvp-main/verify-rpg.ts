import { AlchemyEngine } from './src/core/alchemy-engine';
import { RPGEngine } from './src/core/rpg-engine';

async function verifyRPGNexus() {
    console.log("🎮 Starting Zen-Xiang RPG Nexus Verification...");

    try {
        console.log("\n1. Initial State Check");
        console.log("Avatar Wisdom:", RPGEngine.getAvatar().wisdom);
        console.log("Village Prosperity:", RPGEngine.getVillage().prosperity);

        console.log("\n2. Executing Alchemy Transmutation (Learning Action)");
        console.log("Action: Verified Carbon Footprint (+200 XP)");
        const result = await AlchemyEngine.transmutate("User_Alpha", 200);

        console.log(`✅ Level: ${AlchemyEngine.getUser().level}, Badges: ${result.unlockedBadges.length}`);

        console.log("\n3. Post-Alchemy RPG Sync Check");
        const avatar = RPGEngine.getAvatar();
        const village = RPGEngine.getVillage();

        console.log("Updated Avatar Props:", Object.entries(avatar).filter(([_, v]) => v > 10).map(([k, v]) => `${k}: ${v}`).join(', '));
        console.log(`Updated Village Prosperity: ${village.prosperity}%`);
        console.log(`Updated Village Ecosystem: ${village.ecosystemHealth}%`);

        console.log("\n4. Scenario Trigger Check");
        const scenario = RPGEngine.triggerScenario();
        console.log("Current Scenario:", scenario.title);
        console.log("Dialogue:", scenario.content);

        if (village.prosperity > 50 && Object.values(avatar).some(v => v > 10)) {
            console.log("\n✅ RPG Nexus Integration Confirmed: ESG Actions -> Alchemy -> RPG Growth -> Village State.");
        } else {
            console.log("\n❌ RPG Nexus Integration Failed: No growth detected.");
        }

        console.log("\n✨ Verification Complete.");
    } catch (error) {
        console.error("❌ Verification Error:", error);
    }
}

verifyRPGNexus();
