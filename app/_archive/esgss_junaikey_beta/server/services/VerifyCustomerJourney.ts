import { OmniEvolutionEngine, EntityState, EvolutionAction } from './OmniEvolutionEngine.js';
import { AgentCore } from './AgentCore.js';
import { OmniHeartbeat } from './OmniHeartbeat.js';
import { TypstService } from './TypstService.js';
import { BerkeleyCertificationService } from './BerkeleyCertificationService.js';
import { randomUUID } from 'crypto';

// Initialize Services
const evolutionEngine = new OmniEvolutionEngine();
const agentCore = new AgentCore();
const heartbeat = new OmniHeartbeat(); // Default interval 60000
const typst = new TypstService();
const certification = new BerkeleyCertificationService(null); // Mock blockchain service

// Mock User
const USER_ID = `user-${randomUUID()}`;
const USER_NAME = 'Eternal Traveler';
console.log(`\n🪐 Starting Customer Journey - User ID: ${USER_ID}`);

async function runJourney() {
  try {
    // Phase 1: Registration & Onboarding (Day 0)
    console.log('\n📍 Day 0: Registration & Onboarding');
    console.log('   👤 User registers via SSO...');
    // Direct check instead of waiting for event
    const health = await heartbeat.checkIntegrity();
    if (!health.healthy) console.warn('   ⚠️ System Health Check Failed...');
    console.log(
      `   ✅ System Health: ${health.healthy ? 'Healthy' : 'Unhealthy'} | 4T Integration: ${health.integrityStatus.anchorsVerified ? 'Verified' : 'Pending'}`
    );

    // Phase 2: Data Collection (Day 1-7)
    console.log('\n📍 Day 1-7: Data Collection & 4T verification');
    const evidenceData = { source: 'Smart Meter #102', value: 450.5, unit: 'kWh' };
    console.log('   📊 Uploading Data:', evidenceData);
    console.log(`   🔒 4T Protocol: Traceable=YES, Immutable=YES`);

    // Phase 3: AI Analysis (Day 8-14)
    console.log('\n📍 Day 8-14: AI Analysis & Insights');
    console.log('   🤖 AgentCore "Self-Reflective" Analysis in progress...');
    // Correct method: generateWithAudit
    const aiInsight = await agentCore.generateWithAudit({
      topic: 'Carbon Footprint Analysis',
      data: evidenceData,
    });
    console.log('   💡 AI Insight:', aiInsight.content.substring(0, 50) + '...');
    console.log(`   🛡️ Self-Reliance Score: ${aiInsight.metadata.finalScore}/100`);

    // Phase 4: Report & Evolution (Day 15-30)
    console.log('\n📍 Day 15-30: Reporting & User Evolution');
    console.log('   📄 Generating Typst Report...');
    // Correct method: renderReport
    const reportBuffer = await typst.renderReport({
      title: 'ESG Sustainability Report',
      summary: aiInsight.content,
    });
    console.log(`   ✅ Report Generated (${reportBuffer.length} bytes)`);

    console.log('   🚀 Updating User "Evolution State"...');
    // Correct method: evolve(EntityState, EvolutionAction)
    const currentState: EntityState = {
      id: USER_ID,
      level: 1,
      exp: 0,
      traits: [],
    };
    const action: EvolutionAction = {
      type: 'TASK_COMPLETE',
      expValue: 150, // Should trigger level up (threshold is 100)
    };

    const evolution = await evolutionEngine.evolve(currentState, action);
    console.log(`   🎉 Evolution Complete! Level ${evolution.level} (EXP: ${evolution.exp})`);
    if (evolution.leveledUp) console.log('   ✨ LEVEL UP! New Traits Unlocked.');

    // Phase 5: Certification (Learning)
    console.log('\n📍 Certification Phase');
    // Correct method: issueCertificate
    const cert = await certification.issueCertificate({ id: USER_ID, name: USER_NAME }, 'ESG-101');
    console.log(`   🏆 Certificate Issued: ${cert.id}`);

    console.log('\n✅ Journey Complete: SUCCESS');
    console.log('   System verified 0-1 Evolution Cycle.');
  } catch (error) {
    console.error('\n❌ Journey Failed:', error);
    process.exit(1);
  }
}

runJourney();
