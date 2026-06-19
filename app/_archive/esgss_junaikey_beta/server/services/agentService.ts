import redisService from './redisService.js';
import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * 🛠️ Transform Agent: Maps Supabase JSON metadata to Sentient Agent Format
 */
export const transformAgent = (dbAgent: any) => {
  if (!dbAgent) return null;
  const metadata = dbAgent.metadata || {};
  return {
    ...dbAgent,
    soul: metadata.soul || null,
    isCrystallized: metadata.isCrystallized || false,
    sealedMetadata: metadata.crystallization ? {
      signature: metadata.crystallization.crystal_hash,
      timestamp: metadata.crystallization.sealed_at,
      purity_score: metadata.crystallization.purity_score || 100,
      verified_by: metadata.crystallization.verified_by || 'Dr. Thoth'
    } : null
  };
};

export const getAllAgents = async () => {
  const CACHE_KEY = 'omni_agents_all';

  // Try cache first
  const cached = await redisService.get(CACHE_KEY);
  if (cached) return (cached as any[]).map(transformAgent);

  // Fetch from Supabase
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    omniLogger.error(LogCategory.SYSTEM, `[AgentService] Failed to fetch agents`, { error: error.message });
    throw error;
  }

  // Cache the result
  await redisService.set(CACHE_KEY, agents, 600); // 10 minutes cache

  return agents.map(transformAgent);
};

export const getAgentById = async (id: string) => {
  const CACHE_KEY = `agent:${id}`;

  return redisService.getOrSet(
    CACHE_KEY,
    async () => {
      const { data: agent, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        omniLogger.error(LogCategory.SYSTEM, `[AgentService] Failed to fetch agent by id: ${id}`, { error: error.message });
        throw error;
      }

      return transformAgent(agent);
    },
    300 // 5 minutes TTL per agent
  );
};

export const createAgent = async (agentData: any) => {
  const { data: newAgent, error } = await supabase
    .from('agents')
    .insert([agentData])
    .select()
    .single();

  if (error) {
    omniLogger.error(LogCategory.SYSTEM, `[AgentService] Failed to create agent`, { error: error.message });
    throw error;
  }

  // Invalidate cache
  await redisService.del('omni_agents_all');

  return transformAgent(newAgent);
};

export const updateAgentMetadata = async (id: string, metadata: any) => {
  // Merge metadata or replace? Usually merge in our system.
  // First get current row WITHOUT transformation for merging
  const { data: currentAgent, error: getError } = await supabase
    .from('agents')
    .select('metadata')
    .eq('id', id)
    .single();

  if (getError) throw getError;
  const updatedMetadata = { ...(currentAgent.metadata || {}), ...metadata };

  const { data: updatedAgent, error } = await supabase
    .from('agents')
    .update({ metadata: updatedMetadata, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    omniLogger.error(LogCategory.SYSTEM, `[AgentService] Failed to update agent metadata: ${id}`, { error: error.message });
    throw error;
  }

  // Invalidate cache: list key + per-item key
  await Promise.all([
    redisService.del('omni_agents_all'),
    redisService.del(`agent:${id}`),
  ]);

  return transformAgent(updatedAgent);
};
