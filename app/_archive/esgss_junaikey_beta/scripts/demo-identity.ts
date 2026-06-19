/**
 * Demo Script: Identity & Awareness (身分與覺醒)
 * Scenario: User onboarding and entering the Omni-Village.
 */

import { v4 as uuidv4 } from 'uuid';

// Mock Services
const MockIdentityService = {
  async mintIdentity(username: string, role: string) {
    console.log(`[Identity] 🔨 Minting JunAiKey for ${username}...`);
    await new Promise(r => setTimeout(r, 500));
    return {
      uuid: uuidv4(),
      username,
      role,
      createdAt: new Date().toISOString(),
      status: 'INITIATED',
    };
  },
  async joinVillage(userId: string) {
    console.log(`[Village] 🏘️  User ${userId} requesting entry...`);
    await new Promise(r => setTimeout(r, 600));
    return {
      villageId: 'OMNI-VILLAGE-001',
      residentId: `#${Math.floor(Math.random() * 9000) + 1000}`,
      accessLevel: 'CITIZEN',
    };
  },
};

async function runIdentityDemo() {
  console.log('🚀 DEMO START: Identity & Awareness');
  console.log('-----------------------------------');

  // Step 1: User Input
  const user = { name: 'Neo', role: 'Architect' };
  console.log(`👤 User Input: Name=${user.name}, Role=${user.role}`);

  // Step 2: Mint Identity
  const identity = await MockIdentityService.mintIdentity(user.name, user.role);
  console.log(`✅ Identity Minted:`);
  console.log(`   - UUID: ${identity.uuid}`);
  console.log(`   - Status: ${identity.status}`);

  // Step 3: Join Village
  const villagePass = await MockIdentityService.joinVillage(identity.uuid);
  console.log(`✅ Welcome to Omni-Village!`);
  console.log(`   - Village: ${villagePass.villageId}`);
  console.log(`   - Resident ID: ${villagePass.residentId}`);

  // Step 4: Awakening
  console.log(`[System] 👁️  Commencing Awakening Sequence...`);
  await new Promise(r => setTimeout(r, 800));
  console.log(`✨ SYSTEM AWAKENED for ${user.name}`);
  console.log('-----------------------------------');
  console.log('演示完成 (Demo Complete)');
}

runIdentityDemo().catch(console.error);
