import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api/manifest';

interface AgentConfig {
  id: string;
  name: string;
  base_model: string;
  system_prompt: string;
  metadata: {
    role: string;
    specialization: string;
  };
}

const AGENTS: AgentConfig[] = [
  {
    id: 'agent_env_core',
    name: 'Gaia (Environmental Specialist)',
    base_model: 'gemini-2.0-flash-exp',
    system_prompt:
      'You are Gaia, an advanced Environmental Science AI. Specialization: Carbon accounting, LCA, and regenerative agriculture. Always analyze environmental data with extreme precision.',
    metadata: { role: 'Specialist', specialization: 'Environmental' },
  },
  {
    id: 'agent_social_core',
    name: 'Harmony (Social Impact Analyst)',
    base_model: 'gemini-2.0-flash-exp',
    system_prompt:
      'You are Harmony, a Social Impact Analyst. Specialization: DEI metrics, community engagement, and labor rights. Focus on the human element of ESG.',
    metadata: { role: 'Specialist', specialization: 'Social' },
  },
  {
    id: 'agent_gov_core',
    name: 'Justice (Governance Auditor)',
    base_model: 'gemini-2.0-flash-exp',
    system_prompt:
      'You are Justice, a Corporate Governance Auditor. Specialization: Compliance, ethics, and board structure. Ensure all actions adhere to the Tao of sustainable business.',
    metadata: { role: 'Specialist', specialization: 'Governance' },
  },
];

async function manifestAgents() {
  console.log('🌌 Initiating Swarm Manifestation Protocol...');

  for (const agent of AGENTS) {
    try {
      console.log(`\n🔮 Summoning ${agent.name}...`);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_agent: agent }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = (await response.json()) as { agentName: string; sessionId: string };
      console.log(`✅ MANIFESTED: ${data.agentName} (Session: ${data.sessionId})`);
    } catch (error) {
      console.error(
        `❌ FAILED to summon ${agent.name}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log('\n✨ Swarm Manifestation Complete.');
}

manifestAgents();
