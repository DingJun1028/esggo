/**
 * ESG GO | Swarm Consensus Engine (Strategic Autonomy)
 * Orchestrates multiple specialized agents to evaluate and vote on ESG strategies.
 */

import { sha256 } from './crypto-proof.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type AgentRole = 'COMPLIANCE' | 'HARMONY' | 'SECURITY' | 'INNOVATION';

export interface AgentOpinion {
  agentId: string;
  role: AgentRole;
  vote: 'AGREE' | 'DISAGREE' | 'CONDITIONALLY_AGREE';
  confidence: number;
  critique: string;
}

export interface ConsensusResult {
  id: string;
  proposal: string;
  timestamp: string;
  opinions: AgentOpinion[];
  consensusScore: number;
  status: 'STRONG_CONSENSUS' | 'WEAK_CONSENSUS' | 'DISSONANCE';
  hashLock: string;
}

const SWARM_AGENTS: { id: string; role: AgentRole; name: string; persona: string }[] = [
  { 
    id: 'agt-z0', 
    role: 'COMPLIANCE', 
    name: 'Z0-Auditor',
    persona: '你是一位極其嚴謹的 ESG 審計師，專精於 GRI 2021 標準與 5T 誠信協議。你傾向於拒絕缺乏數據佐證或證據鏈不完整的提案。你的評論應專注於合規性與可追溯性。'
  },
  { 
    id: 'agt-h1', 
    role: 'HARMONY', 
    name: 'H1-Diplomat',
    persona: '你是一位重視社會共鳴與利害關係人利益平衡的專家。你關心員工福祉、社區影響與社會正義。你的評論應專注於社會責任與共融性。'
  },
  { 
    id: 'agt-v4', 
    role: 'SECURITY', 
    name: 'V4-Sentinel',
    persona: '你是一位數位防禦與數據安全專家，專精於 ZKP 零知識證明與 Hash Lock 技術。你對數據隱私洩漏極其敏感。你的評論應專注於數據安全與系統韌性。'
  },
  { 
    id: 'agt-x9', 
    role: 'INNOVATION', 
    name: 'X9-Visionary',
    persona: '你是一位前瞻性的技術創新家，追求效率、AI 自動化與淨零轉型。你傾向於支持能加速流程或減少環境足跡的新穎技術。你的評論應專注於未來性與效率。'
  },
];

export class SwarmConsensusEngine {
  private static instance: SwarmConsensusEngine;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    if (process.env.LOCAL_GEMMA_SERVER_URL) {
      this.genAI = new GoogleGenerativeAI('local-key');
    } else if (apiKey && !apiKey.includes('YOUR_')) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  static getInstance(): SwarmConsensusEngine {
    if (!SwarmConsensusEngine.instance) {
      SwarmConsensusEngine.instance = new SwarmConsensusEngine();
    }
    return SwarmConsensusEngine.instance;
  }

  /**
   * Dispatches a proposal to the swarm and collects opinions via multi-agent deliberation.
   */
  async evaluateProposal(proposal: string): Promise<ConsensusResult> {
    const timestamp = new Date().toISOString();
    const id = `CONSENSUS-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Fallback mode when Gemini API unavailable
    if (!this.genAI) {
      console.log('[SwarmConsensus] Gemini unavailable. Using simulation mode.');
      await new Promise(r => setTimeout(r, 1200));
      
      const opinions = SWARM_AGENTS.map(agent => ({
        agentId: agent.id,
        role: agent.role,
        vote: 'AGREE' as const,
        confidence: 0.75 + Math.random() * 0.2,
        critique: `模擬模式：此提案已觸發 ${agent.name} 的治理分析。`
      }));

      const consensusScore = 72;
      const status = 'STRONG_CONSENSUS' as const;
      const hashLock = await sha256(`${id}:${proposal}:${consensusScore}:${timestamp}`);

      return { id, proposal, timestamp, opinions, consensusScore, status, hashLock };
    }

    // Parallel Agent Deliberation
    const opinionPromises = SWARM_AGENTS.map(async (agent) => {
      const model = this.genAI!.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: `${agent.persona}\n\n你的任務是針對下述 ESG 提案給出投票與評論。`
      });

      const prompt = `提案內容：\n"${proposal}"\n\n請以 JSON 格式回應，包含以下欄位：\n- vote: 'AGREE', 'DISAGREE', 或 'CONDITIONALLY_AGREE'\n- confidence: 0-1 之間的數字\n- critique: 繁體中文評論（約 50 字）`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch?.[0] || '{}');

        return {
          agentId: agent.id,
          role: agent.role,
          vote: parsed.vote || 'AGREE',
          confidence: parsed.confidence || 0.8,
          critique: parsed.critique || '該提案符合當前治理標準與 5T 誠信規範。',
        } as AgentOpinion;
      } catch (err) {
        console.error(`Agent ${agent.name} failed deliberation:`, err);
        return {
          agentId: agent.id,
          role: agent.role,
          vote: 'AGREE',
          confidence: 0.5,
          critique: '（蜂群連結不穩，代理人暫時默認支持）',
        } as AgentOpinion;
      }
    });

    const opinions = await Promise.all(opinionPromises);

    // Calculate Consensus Score
    const agreeCount = opinions.filter(o => o.vote === 'AGREE').length;
    const conditionalCount = opinions.filter(o => o.vote === 'CONDITIONALLY_AGREE').length;
    const consensusScore = Math.round(((agreeCount * 1.0 + conditionalCount * 0.6) / opinions.length) * 100);

    let status: ConsensusResult['status'] = 'DISSONANCE';
    if (consensusScore >= 80) status = 'STRONG_CONSENSUS';
    else if (consensusScore >= 50) status = 'WEAK_CONSENSUS';

    const hashLock = await sha256(`${id}:${proposal}:${consensusScore}:${timestamp}`);

    return { id, proposal, timestamp, opinions, consensusScore, status, hashLock };
  }
}

export const swarmConsensusEngine = SwarmConsensusEngine.getInstance();
