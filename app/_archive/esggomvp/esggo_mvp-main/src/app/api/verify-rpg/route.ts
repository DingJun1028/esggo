import { NextResponse } from 'next/server';
import { AlchemyEngine } from '@/core/alchemy-engine';
import { RPGEngine } from '@/core/rpg-engine';

export async function GET() {
    console.log("🎮 Starting RPG Nexus Verification API...");

    const results: string[] = [];
    results.push("🎮 Starting RPG Nexus Verification...");

    try {
        // 1. Initial State
        results.push(`Initial Wisdom: ${RPGEngine.getAvatar().wisdom}`);

        // 2. Transmutate (Learning Action)
        results.push("\n⚡ Gaining 500 XP (Level Up Path)...");
        const result = await AlchemyEngine.transmutate("User_Alpha", 500);

        results.push(`✅ New Level: ${AlchemyEngine.getUser().level}`);
        results.push(`✅ Badges Unlocked: ${result.unlockedBadges.length}`);

        // 3. Post-Alchemy Sync
        const avatar = RPGEngine.getAvatar();
        const village = RPGEngine.getVillage();

        results.push("\n🏘️ Village State:");
        results.push(`Prosperity: ${village.prosperity}%`);
        results.push(`Ecosystem: ${village.ecosystemHealth}%`);

        results.push("\n👤 Avatar Virtues (Updated):");
        results.push(Object.entries(avatar).filter(([_, v]) => v > 10).map(([k, v]) => `${k}: ${v}`).join(', '));

        // 4. Scenario
        const scenario = RPGEngine.triggerScenario();
        results.push(`\n📜 Current Scenario: ${scenario.title}`);

        return NextResponse.json({ success: true, log: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
