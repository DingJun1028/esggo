import redisService from './redisService.js';
import { supabase } from '../db/supabaseClient.js';
import crypto from 'crypto';

export const sessionService = {
  /**
   * Create a new session (Manifestation)
   * Stores in Redis (Hot) and DB (Cold/Audit)
   */
  async createSession(agentData, overrides, systemInstruction) {
    console.log('[SESSION] createSession() initiated');
    // 🛡️ Sentinel: Use UUIDv4 for cryptographically secure session IDs
    const sessionId = `session_${Date.now()}_${crypto.randomUUID()}`;
    const defaultModel = 'gemini-2.0-flash';

    // Redis Payload (Stateless "DNA")
    const sessionPayload = {
      agentId: agentData.id,
      agentName: agentData.name || agentData.metadata?.name,
      kbId: agentData.kb_id || overrides?.kb_id,
      baseModel: agentData.base_model || defaultModel,
      systemInstruction: systemInstruction,
      history: [],
      createdAt: Date.now(),
    };

    // 1. Hot Storage: Redis (24h TTL)
    try {
      console.log('[SESSION] Attempting Redis save...');
      await redisService.setSession(sessionId, sessionPayload, 3600 * 24);
      console.log('[SESSION] Redis save success');
    } catch (redisError) {
      console.error('[SESSION] ??Redis Failed:', redisError);
    }

    // 2. Cold Storage: Postgres (Audit/Persistence)
    console.log('[SESSION] Attempting DB save...');
    try {
      const { error } = await supabase
        .from('sessions')
        .insert({
          id: sessionId,
          agent_id: agentData.id,
          kb_id: agentData.kb_id,
          metadata: overrides || {},
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });

      if (error) throw error;
      console.log('[SESSION] DB save success');
    } catch (dbError: any) {
      console.log('[SESSION] ⚠️ DB Persistence failed (Expected in dev/verify):', dbError.message);
      // We swallow the error to allow "Redis Only" operation
    }

    return sessionId;
  },

  /**
   * Retrieve session state (Rehydration)
   */
  async getSession(sessionId) {
    return await redisService.getSession(sessionId);
  },

  /**
   * Update session history and persist interaction
   */
  async saveInteraction(sessionId, sessionData, interactionData) {
    const { userMessage, agentResponse, skillCalls, ragContext } = interactionData;

    // 1. Update In-Memory History
    const newHistoryItemUser = { role: 'user', parts: [{ text: userMessage }] };
    const newHistoryItemModel = { role: 'model', parts: [{ text: agentResponse }] };

    sessionData.history.push(newHistoryItemUser, newHistoryItemModel);

    // 2. Redis Update
    await redisService.setSession(sessionId, sessionData, 3600 * 24);

    // 3. DB Audit Log
    try {
      const { error } = await supabase
        .from('conversations')
        .insert({
          session_id: sessionId,
          agent_id: sessionData.agentId,
          user_message: userMessage,
          agent_response: agentResponse,
          skill_calls: skillCalls || [],
          rag_context: ragContext?.map(c => ({ id: c.id, similarity: c.similarity })) || []
        });

      if (error) throw error;

    } catch (dbError: any) {
      console.warn('[SESSION] ⚠️ DB Audit failed:', dbError.message);
    }
  },
};

export default sessionService;
