/**
 * Demo Script: Action & Engagement (行動與積累)
 * Scenario: User performs an ESG action and verifies it.
 */

// Mock Services
const MockActionService = {
  async submitAction(userId: string, actionId: string, proof: any) {
    console.log(`[Action] ⚡ User ${userId} submitted: ${actionId}`);
    console.log(`[Vision] 👁️  Analyzing proof... (${proof.type})`);
    await new Promise(r => setTimeout(r, 800));
    // Mock success
    return { valid: true, confidence: 0.98 };
  },
  async rewardUser(userId: string, actionId: string) {
    console.log(`[Wallet] 💰 Distributing rewards for ${actionId}...`);
    return { coins: 10, points: 50 };
  },
};

async function runActionDemo() {
  console.log('🚀 DEMO START: Action & Engagement');
  console.log('----------------------------------');

  const userId = 'USER-123';
  const action = { id: 'MEAT_FREE_MEAL', name: '無肉餐飲' };

  // Step 1: Perfrom Action
  console.log(`🍽️  User performs: ${action.name}`);

  // Step 2: Verification
  const verification = await MockActionService.submitAction(userId, action.id, {
    type: 'PHOTO',
    size: '2.4MB',
  });

  if (verification.valid) {
    console.log(`✅ Verification Passed (Confidence: ${verification.confidence * 100}%)`);

    // Step 3: Reward
    const reward = await MockActionService.rewardUser(userId, action.id);
    console.log(`🎁 Rewards Received:`);
    console.log(`   - +${reward.coins} ESG Coins`);
    console.log(`   - +${reward.points} Impact Points`);

    // Step 4: Streak
    console.log(`🔥 Streak Updated: 3 Days! (Bonus Active)`);
  } else {
    console.log(`❌ Verification Failed.`);
  }

  console.log('----------------------------------');
  console.log('演示完成 (Demo Complete)');
}

runActionDemo().catch(console.error);
