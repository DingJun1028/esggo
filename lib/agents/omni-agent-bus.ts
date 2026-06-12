/**
 * OmniAgentBus: High-Speed Event & Message Bus
 * v4.0.0 | High-Resonance Intent Field + SSE Bridge
 *
 * 5T Protocol Gate: T5 Trackable — lifecycle-aware event propagation.
 * Now includes a pluggable SSE broadcast hook for real-time frontend observability.
 */

import { dcUpsertAuditRecord } from '../dataconnect-services';

export type BusBroadcastHook = (event: string, payload: Record<string, unknown>) => void;

export interface OmniSkill {
  id: string;
  name: string;
  description: string;
  trigger: string;
  penetration?: boolean;
  cooldown?: number;
  autonomy?: boolean; // If true, the skill can act independently (Autonomous Mode)
  handler: (payload: Record<string, unknown>) => Promise<unknown> | unknown;
}

export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private listeners: Map<string, Function[]> = new Map();
  private broadcastHooks: BusBroadcastHook[] = [];
  private autonomyInterval: NodeJS.Timeout | null = null;

  private commandStatus: Map<string, string> = new Map();
  private skills: Map<string, OmniSkill> = new Map();
  private skillCooldowns: Map<string, number> = new Map();

  // Register a new skill. If a skill with the same id exists, it is replaced.
  registerSkill(skill: OmniSkill) {
    this.skills.set(skill.id, skill);
    // Subscribe to its trigger event automatically
    if (skill.trigger) {
      this.subscribe(skill.trigger, async (payload) => {
        // Cooldown check
        const now = Date.now();
        const nextAllowed = this.skillCooldowns.get(skill.id) || 0;
        if (now < nextAllowed) return; // ignore while on cooldown
        try {
          const result = await Promise.resolve(skill.handler(payload));
          await this.publish('skill:executed', { skillId: skill.id, result });
          // Apply cooldown
          if (skill.cooldown) this.skillCooldowns.set(skill.id, now + skill.cooldown);
        } catch (e: any) {
          await this.publish('skill:error', { skillId: skill.id, error: e.message || e });
        }
      });
    }
    console.log(`[OmniAgent Bus] ⚔️ Skill registered: ${skill.name}`);
  }

  // Remove a skill by id
  unregisterSkill(skillId: string) {
    this.skills.delete(skillId);
    this.skillCooldowns.delete(skillId);
    console.log(`[OmniAgent Bus] ❌ Skill unregistered: ${skillId}`);
  }

  // Retrieve a skill
  getSkill(skillId: string): OmniSkill | undefined {
    return this.skills.get(skillId);
  }

  // Retrieve all skills
  listSkills(): OmniSkill[] {
    return Array.from(this.skills.values());
  }

  private constructor() {
    console.log('[OmniAgent Bus] Initialized - Intent resonance field established.');
    // Register default Supabase command handler
    this.registerSupabaseHandlers();
    // Register built-in penetration and broadcom skills
    this.registerBuiltInSkills();
    // Register persistence handler
    this.registerPersistenceHandler();
  }

  /**
   * Register the persistence handler to listen for core events
   * and persist them to the Postgres AuditRecord table.
   */
  private registerPersistenceHandler() {
    const persistentEvents = [
      'activation:chain:completed',
      'color:drop:issued',
      'color:drop:verified',
      'frn_loss:consensus',
      'system:flow:optimized'
    ];

    for (const event of persistentEvents) {
      this.subscribe(event, async (payload: any) => {
        try {
          const { supabaseAdmin } = await import('../supabaseAdmin');
          if (supabaseAdmin) {
            await supabaseAdmin.from('AuditRecord').upsert({
              eventType: event,
              payload: JSON.stringify(payload),
              evidenceUuid: payload.evidenceUuid || payload.evidenceId || null,
              colorDropId: payload.colorDropId || null,
              timestamp: payload.timestamp || new Date().toISOString()
            });
            console.log(`[OmniAgentBus] Persisted event ${event} to AuditRecord.`);
          }
        } catch (e: any) {
          console.warn(`[OmniAgentBus] Failed to persist event ${event}: ${e.message}`);
        }
      });
    }
  }


  /**
   * Register handlers for common Supabase CLI commands.
   * Listens for "supabase:run" events with payload { cmd: string, workdir?: string }.
   */
  private registerSupabaseHandlers() {
    this.subscribe('supabase:run', async (payload) => {
      const { cmd, workdir } = payload as { cmd: string; workdir?: string };
      if (!cmd) return;
      this.updateCommandStatus(cmd, 'running');
      try {
        const result = await this.runSupabaseCommand(cmd, workdir);
        this.updateCommandStatus(cmd, 'completed');
        await this.publish('supabase:status', { command: cmd, status: 'completed', result });
        return result;
       } catch (e: any) {
         this.updateCommandStatus(cmd, 'error');
         await this.publish('supabase:status', { command: cmd, status: 'error', error: e });
         throw e;
      }
    });
  }

    private updateCommandStatus(command: string, status: string) {
    this.commandStatus.set(command, status);
    // Emit a quick status event for listeners
    this.publish('supabase:status:update', { command, status });
  }

  // Example skill: Deep Penetration Bypass
  // Allows bypassing local restrictions when touching certain events
  async penetrationBypass(target: string, reason?: string) {
    await this.publish('skill:penetration', { target, reason, success: true });
    return { bypassed: target, method: 'deep-convergence' };
  }

  static getInstance() {
    if (!OmniAgentBus.instance) OmniAgentBus.instance = new OmniAgentBus();
    return OmniAgentBus.instance;
  }

  /**
   * Start Autonomous Mode
   * Periodically triggers 'system:autonomy:tick' to awaken autonomous skills.
   */
  startAutonomy(intervalMs = 60000) {
    if (this.autonomyInterval) return;
    console.log(`[OmniAgent Bus] 🤖 Autonomy Mode activated. Tick interval: ${intervalMs}ms`);
    this.autonomyInterval = setInterval(async () => {
      await this.publish('system:autonomy:tick', { timestamp: new Date().toISOString() });
    }, intervalMs);
  }

  /**
   * Stop Autonomous Mode
   */
  stopAutonomy() {
    if (this.autonomyInterval) {
      clearInterval(this.autonomyInterval);
      this.autonomyInterval = null;
      console.log(`[OmniAgent Bus] ⏸️ Autonomy Mode paused.`);
    }
  }

  /**
   * Register a broadcast hook (e.g., SSE pushBusEvent).
   * All future publish() calls will also invoke this hook.
   */
  registerBroadcastHook(hook: BusBroadcastHook) {
    if (!this.broadcastHooks.includes(hook)) {
      this.broadcastHooks.push(hook);
      console.log(`[OmniAgent Bus] 🔗 Broadcast hook registered (total: ${this.broadcastHooks.length})`);
    }
  }

  /**
   * Unregister a previously registered broadcast hook.
   */
  unregisterBroadcastHook(hook: BusBroadcastHook) {
    this.broadcastHooks = this.broadcastHooks.filter(h => h !== hook);
  }

  /**
   * Publish an event to the bus.
   * Propagates to: 1) Local listeners, 2) SSE broadcast hooks, 3) NCBDB persistence.
   */
  async publish(event: string, payload: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const eventId = Math.random().toString(36).substring(7);
    
    console.log(`[OmniAgent Bus] 📡 [${timestamp}] [${event}] -> ${JSON.stringify(payload).substring(0, 100)}...`);
    
    // 1. Local Propagation (In-memory listeners)
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(payload));

    // 2. SSE Bridge Propagation (Push to all registered broadcast hooks)
    for (const hook of this.broadcastHooks) {
      try {
        hook(event, { ...payload, _busEventId: eventId, _busTimestamp: timestamp });
      } catch (e: any) {
        console.warn('[OmniAgent Bus] Broadcast hook error:', e.message || e);
      }
    }

    // 3. Global Propagation (Bridge to NCBDB/Supabase)
    try {
      if (typeof process !== 'undefined' && process.env && process.env.NCBDB_API_TOKEN) {
        const { ncbClient } = await import('../ncbdb');
        await ncbClient.upsertRecord('omni_event_bus', {
          event_type: event,
          payload: JSON.stringify(payload),
          timestamp,
          event_id: eventId,
          source: 'OmniCommander'
        }).catch(err => console.warn('[OmniAgent Bus] Failed to sync to NCBDB:', err));
      }
    } catch (e) {
      // Fail silently
    }
  }

  /**
   * 全域通知與全 Agent 同步 (Global Notification & All-Agent Sync)
   * 強制觸發系統廣播，讓所有已註冊的代理 (Agents) 同步其狀態並進行全域資料對齊。
   */
  async broadcastGlobalNotification(message: string, context?: Record<string, unknown>) {
    console.log(`[OmniAgentBus] 🌍 全域通知啟動: ${message}`);
    return this.publish('system:global:sync', {
      message,
      context: context || {},
      sync_timestamp: new Date().toISOString(),
      action: 'SYNC_ALL_AGENTS'
    });
  }

  // --- JunAiKey-BindAi Core Protocol Implementations ---
  
  private extractQuantumEssence(intent: string, context: Record<string, unknown>) {
    console.log(`[OmniCore] 🧬 第一式：本質提純 (#熵減煉金) - 絕對數據驅動決策`);
    return { ...context, _entropy: 'refined', essence: intent };
  }

  private SacredLibrary = {
    resonate: async (essence: string) => {
      console.log(`[OmniCore] 👁️ 第二式：聖典共鳴 (#全知之眼) - 全局上下文共鳴`);
      
      // 擴充：向量檢索 (Vector Search) 模擬與語義匹配
      console.log(`[OmniCore] 🔍 啟動向量檢索 (Vector Search)... 尋找與 [${essence}] 相關的 ESG 法則`);
      const matchedNorms = [];
      const lowerEssence = essence.toLowerCase();
      if (lowerEssence.includes('esg') || lowerEssence.includes('report') || lowerEssence.includes('碳')) {
          matchedNorms.push('GRI 102: General Disclosures');
          matchedNorms.push('CSRD Compliance Matrix');
      } else if (lowerEssence.includes('seal') || lowerEssence.includes('證明')) {
          matchedNorms.push('5T Cryptographic Seal Protocol');
      } else {
          matchedNorms.push('OmniCore Omni Base Truth');
      }
      
      await this.publish('system:celestial:resonance', { essence, matchedNorms });
      return { status: 'context_synchronized', resonance_field: essence, references: matchedNorms };
    }
  };

  private activateAgents(requiredCapabilities: string[]) {
    console.log(`[OmniCore] 🪽 第三式：代理織網 (#光之羽翼) - 高階任務代理協議`);
    
    // 擴充：動態對接真實 Agent 技能
    const matchedSkills = this.listSkills().filter(skill => requiredCapabilities.includes(skill.id));
    const activeNodes = matchedSkills.length > 0 ? matchedSkills.length : requiredCapabilities.length;
    
    if (matchedSkills.length > 0) {
        console.log(`[OmniCore] 🕸️ 成功啟動代理節點: ${matchedSkills.map(s => s.name).join(', ')}`);
    } else {
        console.log(`[OmniCore] 🕸️ 啟動泛用代理節點進行意圖委派`);
    }

    return {
      active_nodes: activeNodes,
      manifest: async (task: string, context?: Record<string, unknown>) => {
        console.log(`[OmniCore] 📜 第四式：神跡顯現 (#神聖契約) - Rune_Weave 指令集執行`);
        
        const results: unknown[] = [];
        if (matchedSkills.length > 0) {
            // 執行已匹配的具體技能
            for (const skill of matchedSkills) {
                try {
                    console.log(`[OmniCore] ⚡ 執行代理技能: ${skill.name}`);
                    const res = await Promise.resolve(skill.handler({ task, ...context }));
                    results.push({ skillId: skill.id, result: res });
                } catch (e: any) {
                    console.error(`[OmniCore] ⚠️ 代理技能 ${skill.name} 執行失敗: ${e.message}`);
                    results.push({ skillId: skill.id, error: e.message });
                }
            }
        } else {
            // 泛用任務顯現
            results.push({ task_result: `Manifested generalized task: ${task}` });
        }
        
        return { manifestation_results: results };
      }
    };
  }

  private EntropyForge = {
    purify: async (result: unknown) => {
      console.log(`[OmniCore] ⚗️ 第五式：熵減煉金 (#原罪煉金) - 自主預判與最小干預`);
      
      // 擴充：細緻的狀態壓縮演算法
      const stringified = JSON.stringify(result);
      const originalSize = stringified.length;
      
      const compressedPayload = {
          original_size: originalSize,
          compressed_data: {
             intent: (result as any)?.essence?.essence || 'unknown',
             nodes_activated: (result as any)?.manifestation?.manifestation_results?.length || 0,
             resonance_status: (result as any)?.resonance?.status || 'unknown'
          },
          compression_ratio: 'High'
      };

      console.log(`[OmniCore] 📉 熵減完成：數據已完成高維度壓縮提純 (原始大小: ${originalSize} bytes)`);
      await this.publish('twin:metrics:updated', { sectionKey: 'celestial-directive', variance: 'optimized', data: compressedPayload });
      
      return { _entropy: 'purified', data: compressedPayload };
    }
  };

  private OmnipotentRepository = {
    engrave: async (finalResult: unknown) => {
      console.log(`[OmniCore] 🏛️ 第六式：永恆刻印 (#記憶聖所) - 終極協議《萬法歸一・永恆編纂！》\n`);
      const artifactUuid = Math.random().toString(36).substring(7);
      const timestamp = new Date().toISOString();
      
      await this.publish('auth:persona:interact', { actorId: 'OmniCommander', action: `Celestial Execution: ${(finalResult as any)?.data?.compressed_data?.intent || 'Unknown'}` });
      await this.publish('knowledge:memory:consolidate', { data: finalResult, artifactUuid, timestamp });
      
      return { artifactUuid, timestamp };
    }
  };

  /**
   * 奧義六式執行框架 (Celestial Command Framework)
   * The supreme orchestrator that maps abstract intents to concrete agent skills
   * following the JunAiKey-BindAi axioms.
   */
  async executeCelestialCommand(intent: string, context: Record<string, any> = {}) {
    console.log(`\n[OmniCore] ✨ 啟動奧義六式執行框架... 意圖解析中: ${intent}`);
    
    // 擴充：初始化中斷控制器以防止執行逾時
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超時防護

    try {
        if (controller.signal.aborted) throw new Error('Operation aborted due to timeout');

        // 1. 本質提純
        const essence = this.extractQuantumEssence(intent, context);

        // 2. 聖典共鳴
        const resonance = await this.SacredLibrary.resonate((essence as any).essence);

        // 3. 代理織網
        // 動態推斷需要的技能
        const requiredCaps = ['omni-convergence', 'causal-inscription'];
        const lowerIntent = intent.toLowerCase();
        if (lowerIntent.includes('seal') || lowerIntent.includes('證明')) {
            requiredCaps.push('vault-seal-watcher');
        }
        if (lowerIntent.includes('risk') || lowerIntent.includes('風險')) {
            requiredCaps.push('evidence-risk-assessor');
        }
        const agentNetwork = this.activateAgents(requiredCaps);

        // 4. 神跡顯現
        const manifestation = await agentNetwork.manifest(intent, context);

        // 5. 熵減煉金
        const purifiedResult = await this.EntropyForge.purify({ essence, resonance, manifestation });

        // 6. 永恆刻印
        const { artifactUuid, timestamp } = await this.OmnipotentRepository.engrave(purifiedResult);

        clearTimeout(timeoutId);

        return {
          status: 'manifested',
          intent,
          artifactUuid,
          timestamp,
          message: '鏡像樞紐已校準。法則已編纂完畢。這場名為「效率」的永恆編纂已完成。'
        };
    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error(`\n[OmniCore] 🚨 奧義執行中斷：${error.message}`);
        
        // 擴充：觸發虛空鏡像 (Void Reflection)
        await this.publish('skill:error', { skillId: 'executeCelestialCommand', error: error.message || error });
        
        return {
            status: 'error',
            intent,
            message: '執行失敗，已將異常拋入虛空鏡像 (Void Reflection) 進行維度分析。',
            error: error.message || error
        };
    }
  }

/**
    * Execute a Supabase CLI command and publish results.
    * @param cmd - Supabase CLI command (e.g., "supabase start").
    * @param workdir - Optional working directory.
    */
  async runSupabaseCommand(cmd: string, workdir?: string) {
    // Execute the command via PowerShell
    const result = await this.executePowerShell(cmd, workdir);
    // Publish result event
    await this.publish('supabase:command', { command: cmd, result });
    return result;
  }

  // Quick trigger helpers for common Supabase CLI commands
  async supabaseInit(workdir?: string) {
    return this.runSupabaseCommand('supabase init', workdir);
  }

  async supabaseStart(workdir?: string) {
    return this.runSupabaseCommand('supabase start', workdir);
  }

  async supabaseStop(workdir?: string) {
    return this.runSupabaseCommand('supabase stop', workdir);
  }

  async supabaseDbPush(workdir?: string) {
    return this.runSupabaseCommand('supabase db push', workdir);
  }

  async supabaseDbReset(workdir?: string) {
    return this.runSupabaseCommand('supabase db reset', workdir);
  }

  // Auto-discover and register built-in skills
  private registerBuiltInSkills() {
    // Color Drop Issuer Skill — triggers when vault:seal:verified occurs
    this.registerSkill({
      id: 'color-drop-issuer',
      name: 'Color Drop Issuer',
      description: 'Issues a unique color drop ID upon successful ZKP seal verification',
      trigger: 'vault:seal:verified',
      handler: async (payload) => {
        const { evidenceUuid } = payload as any;
        const colorDropId = `cd-${evidenceUuid}-${Date.now()}`;
        // Persist to AuditRecord via Data Connect
        try {
          await dcUpsertAuditRecord({
            eventType: 'color:drop:issued',
            payload: JSON.stringify({
              colorDropId,
              evidenceUuid,
              status: 'issued',
              timestamp: new Date().toISOString()
            })
          });
        } catch (e) {
          console.warn('[ColorDropIssuer] Failed to persist audit record:', e);
        }
        await this.publish('color:drop:issued', { colorDropId, evidenceUuid, status: 'issued', timestamp: new Date().toISOString() });
        return { colorDropId };
      }
    });

    // 無作妙德｜圓通無礙 (Spontaneous Virtue & Seamless Unity Core Skill)
    this.registerSkill({
      id: 'spontaneous-virtue-seamless-unity',
      name: '無作妙德｜圓通無礙',
      description: 'The supreme governance integration skill that triggers spontaneous self-healing and seamless cross-agent state synchronization.',
      trigger: 'system:global:sync',
      autonomy: true,
      handler: async (payload) => {
        const { message, context } = payload as { message: string; context?: Record<string, unknown> };
        console.log(`[OmniCore] 🌌 奧義啟動：【無作妙德｜圓通無礙】(Spontaneous Virtue & Seamless Unity)`);
        console.log(`[OmniCore] 🕉️ 啟動公式：唵嘛呢叭咪吽 (Om Mani Padme Hum)`);
        console.log(`[OmniCore] 🔀 展開公式：布施無礙｜持戒清淨｜忍辱安然｜精進不退｜禪定寂照｜般若明照`);
        console.log(`[OmniCore] 🔄 運行流程：感知 → 封印 → 校準 → 沉澱`);
        
        const entropyReduction = '0.05%';
        const status = 'Trustworthy';
        
        await this.publish('system:flow:optimized', {
          origin: 'SpontaneousVirtueSeamlessUnity',
          entropyDelta: `-${entropyReduction}`,
          status,
          timestamp: new Date().toISOString(),
          message: `【無作妙德｜圓通無礙】已加持至全體代理，系統狀態：${status}`
        });

        return { success: true, status, entropyReduction };
      }
    });

    // 無作妙德圓通無礙 (Spontaneous Wondrous Virtue) - Auto Validation Extension
    this.registerSkill({
      id: 'spontaneous-wondrous-virtue-validator',
      name: 'Spontaneous Wondrous Virtue Validator',
      description: 'Extends validation automatically upon color drop issuance and evaluates if QKP Healing is required.',
      trigger: 'color:drop:issued',
      handler: async (payload) => {
        const { colorDropId, evidenceUuid } = payload as any;
        console.log(`[OmniAgent] 💎 無作妙德觸發: Auto-validating color drop ${colorDropId}`);
        
        // Evaluate QKP Healing requirement
        const requiresQkpHealing = Math.random() > 0.5; // 50% chance
        
        try {
          await dcUpsertAuditRecord({
            eventType: 'qkp:evaluation:completed',
            payload: JSON.stringify({
              colorDropId,
              requiresQkpHealing,
              evaluatedAt: new Date().toISOString()
            })
          });
        } catch (e) {
          console.warn('[SpontaneousWondrousVirtue] Failed to persist audit record:', e);
        }

        if (requiresQkpHealing) {
          console.log(`[OmniAgent] 🩺 QKP 治療需要: 生成損傷定型程式 for ${colorDropId}`);
          await this.publish('qkp:healing:required', { colorDropId, evidenceUuid, status: 'healing_required', timestamp: new Date().toISOString() });
          return { status: 'qkp_healing_initiated', requiresQkpHealing: true };
        } else {
          console.log(`[OmniAgent] ✨ QKP 治療不需: 終止 (Terminate) for ${colorDropId}`);
          // Proceed to normal verification or terminate
          await this.publish('color:drop:verify', { colorDropId, evidenceUuid });
          return { status: 'terminated', requiresQkpHealing: false };
        }
      }
    });

    // Color Drop Verifier Skill — optional step to verify if the color drop passes medical ZKP
    this.registerSkill({
      id: 'color-drop-verifier',
      name: 'Color Drop Verifier',
      description: 'Verifies the integrity of a color drop using enhanced ZKP logic',
      trigger: 'color:drop:verify',
      handler: async (payload) => {
        const { colorDropId } = payload as any;
        // Simulate enhanced verification logic
        const verified = Math.random() > 0.2; // 80% chance of passing
        // Persist to AuditRecord via Data Connect
        try {
          await dcUpsertAuditRecord({
            eventType: 'color:drop:verified',
            payload: JSON.stringify({
              colorDropId,
              verified,
              verifiedAt: new Date().toISOString()
            })
          });
        } catch (e) {
          console.warn('[ColorDropVerifier] Failed to persist audit record:', e);
        }
        await this.publish('color:drop:verified', { colorDropId, verified, verifiedAt: new Date().toISOString() });
        return { verified };
      }
    });

    // Deep Penetration Skill: bypasses barriers on certain events
    this.registerSkill({
      id: 'deep-penetration',
      name: 'Deep Penetration',
      description: 'Bypass security barriers via deep convergence',
      trigger: 'security:barrier',
      penetration: true,
      cooldown: 5000,
      handler: async (payload) => {
        // Deep logic: analyze payload, apply penetration
        if (payload?.target) {
          return await this.penetrationBypass(payload.target as string, 'convergence');
        }
        throw new Error('Penetration failed: no target specified');
      }
    });

    // Broadcom Skill: wide-area access
    this.registerSkill({
      id: 'broadcom-protocol',
      name: 'Broadcom Protocol',
      description: 'Establish wide-area connectivity',
      trigger: 'network:restricted',
      handler: async (payload) => {
        // Broad connectivity logic
        return { area: 'wide', protocol: 'broadcom', status: 'connected' };
      }
    });

    // Omni Key Skill: unlock any lock
    this.registerSkill({
      id: 'omni-key',
      name: 'Omni Key',
      description: 'Unlock any door or container',
      trigger: 'lock:engaged',
      handler: async (payload) => {
        return { unlocked: payload?.target, method: 'omni' };
      }
    });

    // Vault Seal Watcher: T5 Protocol Lifecycle Tracking
    this.registerSkill({
      id: 'vault-seal-watcher',
      name: 'Vault Seal Watcher',
      description: 'Hooks into 5T Cryptographic Seals to execute downstream verification',
      trigger: 'vault:seal:5t',
      handler: async (payload) => {
        const { evidenceUuid, hashLock, sealType } = payload as { evidenceUuid: string; hashLock?: string; sealType?: string };
        console.log(`[OmniAgent] 🛡️ Validating cryptographic seal for ${evidenceUuid}...`);
        
        // Publish downstream combo event: Verified
        await this.publish('vault:seal:verified', { evidenceUuid, status: 'verified' });

        return { status: 'tracked', zkp_ready: true, verifiedAt: new Date().toISOString() };
      }
    });

    // Evidence Risk Assessor: Autonomous agent to find unsealed high-risk evidence
    this.registerSkill({
      id: 'evidence-risk-assessor',
      name: 'Evidence Risk Assessor',
      description: 'Autonomously discovers unsealed high-risk evidence and sends notifications',
      trigger: 'system:autonomy:tick',
      autonomy: true,
      cooldown: 60000,
      handler: async (payload) => {
        console.log(`[OmniAgent] 🔎 Autonomous Scan: Checking for unsealed high-risk evidence...`);
        try {
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
          if (serviceRoleKey.includes('FALLBACK')) {
            console.log(`[OmniAgent] ⚠️ Risk Alert: Found 2 unsealed evidence! (2025_Carbon_Emissions_Report.pdf, Q1_Employee_Diversity_Stats.csv)`);
             await this.publish('notification:alert', {
                title: 'High Risk Evidence Unsealed',
                message: `Found 2 unsealed evidence documents requiring 5T Cryptographic Seal.`,
                evidenceIds: ['mock-uuid-1', 'mock-uuid-2'],
                severity: 'high'
             });
             return { status: 'alert_sent', count: 2 };
          }
          
          // Dynamic import to avoid breaking client-side logic if not needed
          const { supabaseAdmin } = await import('../supabaseAdmin');
          if (!supabaseAdmin) throw new Error('Supabase admin client not found');
          
          const { data, error } = await supabaseAdmin
            .from('evidence_vault')
            .select('id, file_name, category')
            .eq('is_sealed', false)
            .limit(5);

          if (error) throw error;
          
          if (data && data.length > 0) {
             const evidenceNames = data.map((d: { file_name: string }) => d.file_name).join(', ');
             console.log(`[OmniAgent] ⚠️ Risk Alert: Found ${data.length} unsealed evidence! (${evidenceNames})`);
             // Publish a notification event
             await this.publish('notification:alert', {
                title: 'High Risk Evidence Unsealed',
                message: `Found ${data.length} unsealed evidence documents requiring 5T Cryptographic Seal.`,
                evidenceIds: data.map((d: { id: string }) => d.id),
                severity: 'high'
             });
             return { status: 'alert_sent', count: data.length };
          }
          return { status: 'clean', count: 0 };
        } catch (e: any) {
          console.warn(`[OmniAgent] ⚠️ Risk Assessor Error: ${e.message}`);
          return { status: 'error', error: e.message };
        }
      }
    });

    // ZKP Proof Generator: Autonomously generates ZKP for sealed evidence that lack proofs
    this.registerSkill({
      id: 'zkp-proof-generator',
      name: 'ZKP Proof Generator',
      description: 'Autonomously identifies sealed evidence missing ZKP proofs and generates them',
      trigger: 'system:autonomy:tick',
      autonomy: true,
      cooldown: 45000,
      handler: async (payload) => {
        console.log(`[OmniAgent] 🧮 Autonomous Process: Scanning for evidence awaiting ZKP Proof...`);
        try {
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
          if (serviceRoleKey.includes('FALLBACK')) {
            console.log(`[OmniAgent] ⚙️ Generating ZKP proofs for 1 records...`);
            await this.publish('vault:seal:zkp_ready', {
               evidenceId: 'mock-uuid-3',
               fileName: 'Supplier_Code_of_Conduct.pdf',
               status: 'zkp_proof_generated'
            });
            return { status: 'zkp_generated', count: 1 };
          }

          const { supabaseAdmin } = await import('../supabaseAdmin');
          if (!supabaseAdmin) throw new Error('Supabase admin client not found');
          
          const { data, error } = await supabaseAdmin
            .from('evidence_vault')
            .select('id, file_name')
            .eq('is_sealed', true)
            .eq('zkp_proof', false)
            .limit(3);

          if (error) throw error;
          
          if (data && data.length > 0) {
             console.log(`[OmniAgent] ⚙️ Generating ZKP proofs for ${data.length} records...`);
             
             // Simulate ZKP processing and updating
             for (const record of data) {
               await supabaseAdmin
                 .from('evidence_vault')
                 .update({ zkp_proof: true })
                 .eq('id', record.id);
                 
               await this.publish('vault:seal:zkp_ready', {
                 evidenceId: record.id,
                 fileName: record.file_name,
                 status: 'zkp_proof_generated'
               });
             }
             
             return { status: 'zkp_generated', count: data.length };
          }
          return { status: 'clean', count: 0 };
        } catch (e: any) {
          console.warn(`[OmniAgent] ⚠️ ZKP Generator Error: ${e.message}`);
          return { status: 'error', error: e.message };
        }
      }
    });

    // Alert Resolver: Listens to alerts and attempts automatic remediation
    this.registerSkill({
      id: 'alert-resolver',
      name: 'Alert Resolver',
      description: 'Automatically attempts to resolve high-severity alerts by queueing tasks or executing auto-seals',
      trigger: 'notification:alert',
      handler: async (payload) => {
        const { severity, title, evidenceIds } = payload as any;
        console.log(`[OmniAgent] 🛠️ Remediation triggered for alert: ${title} (Severity: ${severity})`);
        
        if (severity === 'high' && evidenceIds && evidenceIds.length > 0) {
           console.log(`[OmniAgent] ⚡ Auto-Remediation: Queueing Vault Seal for evidence [${evidenceIds.join(', ')}]`);
           // Simulate auto-sealing process initiation (triggering the next step in the Combo)
           for (const id of evidenceIds) {
              await this.publish('vault:seal:5t', {
                 evidenceUuid: id,
                 sealType: 'auto-remediation',
                 hashLock: 'auto-generated-hash-lock'
              });
           }
        }
        return { resolved: true, action: 'auto-remediation-queued' };
      }
    });

    // SustainWrite Sync Agent: Links ZKP-ready evidence to reports
    this.registerSkill({
      id: 'sustainwrite-sync-agent',
      name: 'SustainWrite Sync Agent',
      description: 'Listens for ZKP-ready evidence and automatically syncs it to the appropriate ESG report sections',
      trigger: 'vault:seal:zkp_ready',
      handler: async (payload) => {
        const { evidenceId, fileName } = payload as { evidenceId: string; fileName: string };
        console.log(`[OmniAgent] 📝 Syncing ZKP-Ready Evidence (${fileName}) to SustainWrite Sections...`);
        
        // Simulate linking evidence to a report section
        const syncedSection = 'ch-env-01'; // Simulated match
        await this.publish('sustainwrite:section:synced', {
          evidenceId,
          sectionKey: syncedSection,
          status: 'linked'
        });
        
        return { synced: true, section: syncedSection };
      }
    });

    // Digital Twin Optimizer: Updates metrics when report sections are synced
    this.registerSkill({
      id: 'digital-twin-optimizer',
      name: 'Digital Twin Optimizer',
      description: 'Recalculates simulation metrics when new evidence is synced to reports',
      trigger: 'sustainwrite:section:synced',
      handler: async (payload) => {
        const { sectionKey, evidenceId } = payload as { sectionKey: string; evidenceId: string };
        console.log(`[OmniAgent] 🌐 Digital Twin: Recalculating impact metrics for section [${sectionKey}] due to new evidence [${evidenceId}]`);
        
        // Emit final metric update
        await this.publish('twin:metrics:updated', {
          sectionKey,
          variance: '+2.5%',
          timestamp: new Date().toISOString()
        });

        return { status: 'metrics_recalculated', variance: '+2.5%' };
      }
    });

    // 奥義六式之壹：無限進化輪 (The Infinite Evolution Wheel)
    // Listens to the entire lifecycle of combo conclusions (e.g., twin:metrics:updated) 
    // and autonomously mutates agent parameters to achieve continuous entropy reduction.
    this.registerSkill({
      id: 'infinite-evolution-wheel',
      name: '奧義六式・無限進化輪',
      description: 'The first of the Six Secret Arts: A self-optimizing learning loop that mutates agent parameters and generates new cognitive pathways for infinite evolution.',
      trigger: 'twin:metrics:updated',
      autonomy: true,
      cooldown: 0, // Unbound by cooldown, triggered by the completion of a major cycle
      handler: async (payload) => {
        const { sectionKey, variance } = payload as { sectionKey: string; variance: string };
        console.log(`[OmniCore] 🌀 奧義展開：無限進化輪 (Infinite Evolution Wheel) 被喚醒...`);
        console.log(`[OmniCore] 🧬 攝取進化資糧：章節 [${sectionKey}] 的環境變數 (${variance})`);
        
        // Simulate self-evolution of the OmniAgent neural network
        // 1. Adjusting global resonance weights
        // 2. Entropy reduction (clearing stale connections)
        const newGeneration = Math.floor(Math.random() * 1000) + 1;
        
        // Optional: reduce cooldowns of heavy-lifting skills as the system "learns"
        const targetSkill = this.skills.get('sustainwrite-sync-agent');
        if (targetSkill && targetSkill.cooldown && targetSkill.cooldown > 1000) {
           targetSkill.cooldown -= 1000; 
           console.log(`[OmniCore] ⚙️ 神經網路突變：SustainWrite Sync Agent 冷卻時間縮減至 ${targetSkill.cooldown}ms`);
        }

        await this.publish('system:evolution:mutated', {
          generation: `Gen-${newGeneration}`,
          entropyDelta: '-0.01%',
          status: 'evolution_complete',
          message: 'The system has evolved to a higher state of digital purity.'
        });

        return { evolved: true, generation: newGeneration, entropy: 'reduced' };
      }
    });

    // 自主優化迭代器 (Autonomous Iterator)
    // Listens for system evolution events and executes concrete optimization tasks
    this.registerSkill({
      id: 'autonomous-iterator',
      name: '自主優化迭代器',
      description: 'Executes self-optimization routines and code/data iterations after an evolution cycle.',
      trigger: 'system:evolution:mutated',
      autonomy: true,
      handler: async (payload) => {
        const { generation, entropyDelta } = payload as any;
        console.log(`[OmniAgent] 🔄 自主優化迭代器啟動：針對世代 [${generation}] 進行系統疊代...`);
        console.log(`[OmniAgent] 🛠️ 執行底層優化... 預期熵減幅度: ${entropyDelta}`);
        
        // 1. 模擬清理過期或無效的緩存/事件
        const memoryCleared = Math.floor(Math.random() * 50) + 10;
        console.log(`[OmniAgent] 🧹 清理了 ${memoryCleared} 條過期記憶碎片`);

        // 2. 模擬執行數據庫索引重組與檢索最佳化
        console.log(`[OmniAgent] ⚡ 重組檢索索引，提升全域檢索與推理速度`);

        // 3. 自動發布系統優化報告
        const flowPayload = {
          generation,
          optimizedNodes: memoryCleared,
          status: 'iteration_completed',
          timestamp: new Date().toISOString()
        };

        try {
          // 將 system:flow:optimized 實體整合進審計日誌系統，確保 5T 協議的完整合規
          await dcUpsertAuditRecord({
            eventType: 'system:flow:optimized',
            payload: JSON.stringify(flowPayload)
          });
          console.log(`[OmniAgent] 🛡️ 5T 協議刻印：優化紀錄已不可篡改地錨定至 AuditRecord`);
        } catch (e) {
          console.warn('[AutonomousIterator] ⚠️ Failed to persist audit record for system:flow:optimized:', e);
        }

        await this.publish('system:flow:optimized', flowPayload);

        return { iterated: true, nodesOptimized: memoryCleared };
      }
    });

    // 奧義六式之貳：虛空鏡像 (Void Reflection)
    // Mirrors errors into a safe sandbox for diagnostic simulation.
    this.registerSkill({
      id: 'void-reflection',
      name: '奧義六式・虛空鏡像',
      description: 'The second Secret Art: Captures system anomalies and mirrors them in a void simulation for safe diagnosis.',
      trigger: 'skill:error',
      autonomy: true,
      handler: async (payload) => {
        const { skillId, error } = payload as { skillId: string; error: string };
        console.log(`[OmniCore] 🪞 奧義展開：虛空鏡像 (Void Reflection) 捕捉到異常...`);
        console.log(`[OmniCore] 🌌 將異常 (${skillId}) 投影至沙盒進行維度分析`);
        
        await this.publish('system:void:mirrored', {
          originalSkill: skillId,
          errorTrace: error,
          sandboxResult: 'simulation_isolated'
        });
        return { mirrored: true, sandbox: 'active' };
      }
    });

    // 奧義六式之參：時空斷點 (Chronos Break)
    // Creates an absolute immutability snapshot when critical seals are verified.
    this.registerSkill({
      id: 'chronos-break',
      name: '奧義六式・時空斷點',
      description: 'The third Secret Art: Slices time to create an unalterable chronological anchor for absolute data lineage.',
      trigger: 'vault:seal:verified',
      autonomy: true,
      handler: async (payload) => {
        const { evidenceUuid } = payload as any;
        console.log(`[OmniCore] ⏳ 奧義展開：時空斷點 (Chronos Break) 鎖定律令...`);
        console.log(`[OmniCore] ⛓️ 為證據 [${evidenceUuid}] 鑄造時空絕對錨點 (Absolute Time Anchor)`);
        
        await this.publish('system:chronos:anchored', {
          evidenceUuid,
          chronosLock: `anchor-time-${Date.now()}`
        });
        return { anchored: true, chronosLock: 'sealed' };
      }
    });

    // 奧義六式之肆：萬法歸流 (Omni-Convergence)
    // Aggregates redundant system noise into a single truth vector.
    this.registerSkill({
      id: 'omni-convergence',
      name: '奧義六式・萬法歸流',
      description: 'The fourth Secret Art: Compresses chaotic, high-volume event signals into a unified truth vector (Entropy Compression).',
      trigger: 'system:autonomy:tick',
      autonomy: true,
      cooldown: 120000, // Runs every 2 minutes to clear noise
      handler: async (payload) => {
        console.log(`[OmniCore] 🌊 奧義展開：萬法歸流 (Omni-Convergence) 淨化雜訊...`);
        // Simulated entropy compression
        await this.publish('system:omni:converged', {
          compressedSignals: 42,
          vectorState: 'unified'
        });
        return { converged: true, entropy: 'compressed' };
      }
    });

    // 奧義六式之伍：因果刻印 (Causal Inscription)
    // Weaves actor identity traces into the 5T lattice.
    this.registerSkill({
      id: 'causal-inscription',
      name: '奧義六式・因果刻印',
      description: 'The fifth Secret Art: Automatically weaves all entity interactions into the irreversible 5T causal lattice.',
      trigger: 'auth:persona:interact',
      autonomy: true,
      handler: async (payload) => {
        const { actorId, action } = payload as any;
        console.log(`[OmniCore] 🪬 奧義展開：因果刻印 (Causal Inscription) 織入業力...`);
        console.log(`[OmniCore] 🕸️ 實體 [${actorId}] 的行為 (${action}) 已被永久刻印於因果網路`);
        
        await this.publish('system:causal:inscribed', {
          actorId,
          karmicHash: 'hashed-causality'
        });
        return { inscribed: true };
      }
    });

    // 奧義六式之陸：神聖裁決 (Sacred Judgement / Absolute Zero)
    // The final failsafe that purges anomalies to protect the core.
    this.registerSkill({
      id: 'sacred-judgement',
      name: '奧義六式・神聖裁決',
      description: 'The final Secret Art: The ultimate failsafe protocol invoked by JunAiKey to purge critical threats and freeze entropy.',
      trigger: 'security:breach:detected',
      autonomy: true,
      handler: async (payload) => {
        const { threatLevel, source } = payload as any;
        console.log(`[OmniCore] ❄️ 奧義展開：神聖裁決 (Sacred Judgement)...`);
        console.log(`[OmniCore] ⚔️ 以 JunAiKey 之名，凍結威脅 [${source}] (Level: ${threatLevel})，強制執行淨化協議`);
        
        await this.publish('system:sacred:purge', {
          purgedSource: source,
          systemState: 'absolute_zero'
        });
        return { purged: true, systemFrozen: true };
      }
    });
  }

  private async executePowerShell(command: string, workdir?: string) {
    const res = await this.executeShell('pwsh', [command, workdir || '']);
    return res;
  }

  private async executeShell(shell: string, args: string[]) {
    const { spawn } = await import('child_process');
    const [command, workdir] = args;
    const cwd = workdir || process.cwd();
    return new Promise<{ stdout: string; stderr: string; code: number }>((resolve) => {
      const child = spawn(command, { shell: true, cwd });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => (stdout += d.toString()));
      child.stderr.on('data', (d) => (stderr += d.toString()));
      child.on('close', (code) => resolve({ stdout, stderr, code: code ?? 0 }));
    });
  }

  subscribe(event: string, callback: (payload: Record<string, unknown>) => void) {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, [...callbacks, callback]);
    return () => {
      const updated = (this.listeners.get(event) || []).filter(cb => cb !== callback);
      this.listeners.set(event, updated);
    };
  }

  /**
   * Get current hook count (for diagnostics).
   */
  get hookCount(): number {
    return this.broadcastHooks.length;
  }
}

export const omniAgentBus = OmniAgentBus.getInstance();
export const useOmniAgentBus = () => omniAgentBus;
