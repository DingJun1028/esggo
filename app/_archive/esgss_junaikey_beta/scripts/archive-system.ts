import { OmniStore, OmniNamespace } from '../src/services/OmniStore';
import * as fs from 'fs';
import * as path from 'path';

// Define Mock Data for Archival Demonstration
const MOCK_DATA = {
  agents: {
    agent_demo_1: { id: 'agent_demo_1', name: 'Demo Agent', status: 'ACTIVE' },
  },
  economy: {
    market_cap: { value: 1000000, currency: 'GSC' },
  },
  system: {
    config_v1: { theme: 'dark', mode: 'pro' },
  },
};

/**
 * System Archive Script
 * Dumps key system stats to JSON.
 */
async function archiveSystem() {
  console.log('📦 Starting System Archive Process...');

  // 0. Seed Data (Since we are in a fresh Node process with MemoryStore)
  console.log('🌱 Seeding Memory Store for demonstration...');
  OmniStore.setItem(OmniNamespace.AGENT, 'agent_demo_1', MOCK_DATA.agents['agent_demo_1']);
  OmniStore.setItem(OmniNamespace.ECONOMY, 'market_cap', MOCK_DATA.economy['market_cap']);
  OmniStore.setItem(OmniNamespace.SYSTEM, 'config_v1', MOCK_DATA.system['config_v1']);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveFile = path.join(process.cwd(), `system_archive_${timestamp}.json`);

  // 1. Collect Agent Data
  console.log('... Archiving Agents');
  const agents = OmniStore.listKeys(OmniNamespace.AGENT).map(key => {
    return OmniStore.getItem(OmniNamespace.AGENT, key).data;
  });

  // 2. Collect Economy Data
  console.log('... Archiving Economy');
  const economy = OmniStore.listKeys(OmniNamespace.ECONOMY).reduce(
    (acc, key) => {
      acc[key] = OmniStore.getItem(OmniNamespace.ECONOMY, key).data;
      return acc;
    },
    {} as Record<string, any>
  );

  // 3. Collect Partner Data
  console.log('... Archiving Partners');
  const partners = OmniStore.listKeys(OmniNamespace.PARTNER).reduce(
    (acc, key) => {
      acc[key] = OmniStore.getItem(OmniNamespace.PARTNER, key).data;
      return acc;
    },
    {} as Record<string, any>
  );

  // 4. Collect System Configs
  console.log('... Archiving System Configs');
  const system = OmniStore.listKeys(OmniNamespace.SYSTEM).reduce(
    (acc, key) => {
      acc[key] = OmniStore.getItem(OmniNamespace.SYSTEM, key).data;
      return acc;
    },
    {} as Record<string, any>
  );

  const archiveData = {
    meta: {
      timestamp,
      version: '5.0.0-beta',
      environment: process.env.NODE_ENV || 'development',
    },
    stats: {
      agentCount: agents.length,
      economyKeys: Object.keys(economy).length,
      partnerKeys: Object.keys(partners).length,
      systemKeys: Object.keys(system).length,
    },
    data: {
      agents,
      economy,
      partners,
      system,
    },
  };

  fs.writeFileSync(archiveFile, JSON.stringify(archiveData, null, 2));
  console.log(`✅ System Archived Successfully: ${archiveFile}`);
  console.log(`📊 Stats: ${JSON.stringify(archiveData.stats, null, 2)}`);
}

archiveSystem().catch(error => {
  console.error('❌ Archive failed:', error);
  process.exit(1);
});
