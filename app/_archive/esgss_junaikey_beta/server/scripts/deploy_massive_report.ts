
import { reportAdvancementService } from '../src/services/ReportAdvancementService.js';

async function deployMassiveReport() {
    console.log('--- STARTING MASSIVE REPORT DEPLOYMENT SIMULATION ---');

    const userId = 'user-massive-1';

    // 1. Initialize User
    console.log('\n[1] Initializing User...');
    let userRank = reportAdvancementService.initializeUserRank(userId);
    console.log('User initialized:', userRank.userId);

    // 2. Deploy Massive Report (505 pages)
    console.log('\n[2] Deploying Report (505 pages)...');

    // Base XP for report = 100
    // Page Bonus = 500
    // Expected Total = 600

    const activity = {
        type: 'report' as const,
        description: 'Deployed 2025 Comprehensive Sustainability Report',
        metadata: {
            pageCount: 505,
            completeness: 100,
            isFirstTime: false // keep it simple, no 2x multiplier
        }
    };

    userRank = await reportAdvancementService.updateUserRank(userId, activity);
    console.log(`XP after deployment: ${userRank.experiencePoints}`);

    if (userRank.experiencePoints >= 600) {
        console.log('✅ XP Calculation Verified (Includes Page Bonus)');
    } else {
        console.error(`❌ XP Calculation Failed. Expected >= 600, got ${userRank.experiencePoints}`);
        process.exit(1);
    }

    // 3. Check Achievements
    console.log('\n[3] Checking Achievements...');
    const newAchievements = reportAdvancementService.checkAndGrantAchievements(userRank);
    console.log('New Achievements:', newAchievements.map(a => a.name));

    const encyclopedic = newAchievements.find(a => a.id === 'encyclopedic-author');

    if (encyclopedic) {
        console.log('✅ Achievement Unlocked: Encyclopedic Author (百科全書作者)');
        console.log(`   Badge Reward: ${encyclopedic.reward.badge}`);
    } else {
        console.error('❌ Achievement Failed. Encyclopedic Author not found.');
        process.exit(1);
    }

    // 4. Verify Badge Existence
    console.log('\n[4] Verifying Badge Definition...');
    const allBadges = reportAdvancementService.getAllBadges();
    const giantBadge = allBadges.find(b => b.name === '知識巨擘');

    if (giantBadge) {
        console.log('✅ Badge Definition Found: 知識巨擘');
    } else {
        console.error('❌ Badge Definition Failed. 知識巨擘 not found.');
        process.exit(1);
    }

    console.log('\n✅ --- VERIFICATION COMPLETE: MASSIVE REPORT DEPLOYMENT SUCCESSFUL ---');
}

deployMassiveReport();
