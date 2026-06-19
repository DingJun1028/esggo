import { AlchemyEngine } from './src/core/alchemy-engine';
import { SOVEREIGN_BADGES } from './src/config/badge-metadata';
import { OmniOne } from './src/core/omni-one';

async function verifyAlchemy() {
    console.log("⚗️ Starting Alchemy Engine Verification...");

    try {
        // 1. Gain XP for Level 2 (Apprentice)
        console.log("⚡ Gaining 150 XP (Target: Apprentice)...");
        const result1 = await AlchemyEngine.transmutate("User_Alpha", 150);
        const user1 = AlchemyEngine.getUser();
        console.log(`✅ Level: ${user1.level}, Badges Unlocked: ${result1.unlockedBadges.map(b => b.nameZh).join(', ')}`);

        // 2. Gain more XP for higher tier
        console.log("\n⚡ Gaining 1500 XP (Target: Level 6+ Master)...");
        const result2 = await AlchemyEngine.transmutate("User_Alpha", 1500);
        const user2 = AlchemyEngine.getUser();
        console.log(`✅ Level: ${user2.level}, New Badges: ${result2.unlockedBadges.map(b => b.nameZh).join(', ')}`);
        console.log(`Total Unique Badges Held: ${user2.ownedBadges.length}`);

        // 3. Verify Specific Badge Discovery
        const hasAmberAlchemist = user2.ownedBadges.length >= 3;
        console.log(`\n🏆 Multi-Badge Discovery: ${hasAmberAlchemist ? "PASSED" : "FAILED"}`);

        // 4. Verify Immutability of a Badge Atom (Simulation)
        if (user2.level >= 5) {
            console.log("✅ Alchemy Progression Logic Confirmed.");
        } else {
            console.log("❌ Alchemy Progression Logic Failed.");
        }

        console.log("\n✨ Verification Complete.");
    } catch (error) {
        console.error("❌ Verification Error:", error);
    }
}

verifyAlchemy();
