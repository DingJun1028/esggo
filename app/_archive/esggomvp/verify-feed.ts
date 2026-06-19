import { RPGEngine } from './src/core/rpg-engine';

async function verifyFeedAndQuests() {
    console.log("🍲 Starting AI Feed & Quest System Verification...");

    try {
        // 1. Initial Attributes
        const initialAvatar = RPGEngine.getAvatar();
        console.log(`Initial Moderation: ${initialAvatar.temperance}`);

        // 2. Feed Environment Atom
        console.log("\n🍲 Feeding ENVIRONMENT Atom...");
        await RPGEngine.feedAtom('ENVIRONMENT');

        const afterFeed = RPGEngine.getAvatar();
        console.log(`Updated Moderation: ${afterFeed.temperance} (Expected: ${initialAvatar.temperance + 5})`);
        console.log(`Updated Harmony: ${afterFeed.harmony}`);

        // 3. Quest Check
        console.log("\n📜 Quest Board Check:");
        const quests = RPGEngine.getQuests();
        console.log(`Active Quests: ${quests.length}`);
        console.log(`First Quest: ${quests[0].title} - ${quests[0].status}`);

        // 4. Village Impact
        const village = RPGEngine.getVillage();
        console.log(`\n🏘️ Village Condition: Ecosystem @ ${village.ecosystemHealth}%`);

        if (afterFeed.temperance > initialAvatar.temperance && quests.length > 0) {
            console.log("\n✅ AI Feed & Quest Logic Confirmed.");
        } else {
            console.log("\n❌ Verification Failed.");
        }

        console.log("\n✨ Verification Complete.");
    } catch (error) {
        console.error("❌ Verification Error:", error);
    }
}

verifyFeedAndQuests();
