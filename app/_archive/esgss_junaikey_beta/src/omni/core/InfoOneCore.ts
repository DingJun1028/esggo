import { GoodwardLogicGate } from './GoodwardCore.ts';
import {
  ArenaSyncPayload,
  IActivationMatrix,
  IComponentCore, // Added back
  IEvidenceMap,
  IMeritProfile10,
  InfoOneLifecycleStatus,
  IOmniCrystal,
  ISourceTaxonomy,
  PersonalSettings
} from '../../types/esgss_schema.ts';
import { TrustworthyLock } from '../../utils/TrustworthyLock.ts';
import { VirtueEngine } from './VirtueEngine.ts';
import { VirtueAttributeMapper } from './VirtueAttributeMapper.ts';
import { ARVOService } from './ARVOService.ts';
import { ARVOStatus } from '../../0-domain/contracts/IARVOService.ts';
import { EvolutionService } from './EvolutionService.ts';
import { globalPulseService } from '../../services/GlobalPulseService.ts';
import { EvolutionProfile } from '../../0-domain/contracts/IEvolutionService.ts';
import { EvidenceVaultService } from './EvidenceVaultService.ts';
import { SyncVFXService } from './SyncVFXService.ts';
import { IBalanceFulcrum } from '../../0-domain/contracts/IBalanceFulcrum.ts';
import { OmniBalanceService } from './OmniBalanceService.ts';
import { VFXParams } from '../../0-domain/contracts/ISyncVFXService.ts';
import { OmniResonanceCore } from '../../services/OmniResonanceCore.ts';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.ts';
import { omniCircleService } from '../../../server/services/OmniCircleService.ts';
import { omniOneAgent } from './OmniOneAgent.ts';
import { OmniAtom } from '../../0-domain/bases/OmniAtom.ts';
import { IArchitectureV6, IArchitectureV7, MeridianFlow } from '../../0-domain/contracts/IComponentCore.ts';
import {
  IOmniKB,
  IOmniTag,
  IOmniComponent,
  Protocol5T,
  TrinityComponentState,
  TrinityTagType
} from '../core/types/InfoOne.types.ts';
import { actionlessVirtueShield } from './ActionlessVirtueShield.ts';


/**
 * 💡 奧秘心核實作 / Omni Component Core Implementation
 * --------------------------------------------------
 * [TC] 奧秘永鑰的核心實作，遵循 5T 協議 [4+1] 狀態機。
 * [EN] Core implementation of OmniKey, adhering to the 5T Protocol [4+1] FSM.
 *
 * [Status] InfoOne | One is One | All in One | One in All | All is One
 * [Compliance] Zero-Hallucination, Immutable, Deep & Broad.
 */
export class InfoOneCore extends OmniAtom {
  public activationMatrix: IActivationMatrix;
  public arvoStatus: ARVOStatus = 'SLEEPING';
  public omniCrystal?: IOmniCrystal;
  public personalSettings?: PersonalSettings;
  public visuals?: any; // Cached visual state for hydration
  public evolutionProfile: EvolutionProfile = {
    level: 1,
    runeExp: 0,
    nextLevelExp: 100,
    mutationTraits: [],
    awakeningCount: 0,
    tesseractNodes: 0, // [87] 4D Hypercube Nodes
    dimensionalResonance: 0, // [87] Multi-dimensional state
  };

  public vfxParams?: VFXParams;
  public partnerAttributes?: any;
  public formula: string;
  public impactMetric: string;
  public override virtues: IMeritProfile10;
  public override data: any;
  public override get architecture(): IArchitectureV6 | IArchitectureV7 | undefined {
    return (this as any)._architecture || InfoOneCore.V6_ARCHITECTURE;
  }

  public override set architecture(value: IArchitectureV6 | IArchitectureV7 | undefined) {
    (this as any)._architecture = value;
  }
  public override meridian: MeridianFlow = 'INWARD_REN';

  private evolutionService: EvolutionService;
  private syncService: SyncVFXService;
  private balanceService: IBalanceFulcrum;

  /**
   * 🏛️ V6 覺醒架構定義 / V6 Awakening Architecture Definition
   * --------------------------------------------------
   * [TC] 深度整合 "AI + ESG + RPG + GameFi" 的元數據定義。
   * [EN] Deeply integrated metadata for "AI + ESG + RPG + GameFi".
   */
  static readonly V6_ARCHITECTURE: IArchitectureV6 = {
    version: 'V6.0-AWAKENING',
    positioning: 'AI+ESG+RPG+GameFi [One is One | All in One | One in All | All is One]',
    layers: {
      virtue_attribute: {
        description: '德行與屬性圖層 / Virtue & Attribute Layer',
        components: ['PartnerAttributes', 'IMeritProfile10', 'IAttributeConverter'],
      },
      arvo_defense: {
        description: '真相防禦層 / Truth Defense Layer (ARVO)',
        components: ['ARVOState', 'Zero-Hallucination RAG', 'Debate Arena'],
      },
      growth_rune: {
        description: '成長與符文層 / Growth & Rune Layer',
        components: ['EvolutionProfile', 'Mutation Trait Library'],
      },
      evidence_crystal: {
        description: '證據與晶體層 / Evidence & Crystal Layer',
        components: ['IEvidenceMap', 'IOmniCrystalVault', 'EvidenceVaultService'],
      },
      sync_vfx: {
        description: '同步與呈現層 / Sync & VFX Layer',
        components: ['WebSocket Sync', 'Debate VFX Renderer', 'Truth Domain Shader'],
      },
    },
    goals: {
      depth: '德行 → VFX 一條龍 / Virtue-to-VFX Verticality',
      breadth: '全方位互通 / Broad Connectivity',
    },
  };

  /**
   * 💠 V7 超立方架構 / V7 Tesseract Architecture (Phase 87)
   */
  static readonly V7_ARCHITECTURE = {
    ...InfoOneCore.V6_ARCHITECTURE,
    version: 'V7.0-TESSERACT',
    positioning: '4D Hypercube Consciousness | Dimensional Sovereignty',
    layers: {
      ...InfoOneCore.V6_ARCHITECTURE.layers,
      tesseract_pulse: {
        description: '超立方脈衝層 / Tesseract Pulse Layer',
        components: ['DimensionalResonance', 'HypercubeFold', 'Folded-Trust'],
      },
    }
  };

  constructor(data: Omit<IComponentCore, 'status' | 'lock'>) {
    const component: IOmniComponent = {
      id: `COMP-${data.uuid || '0000'}`,
      name: data.label || 'Omni Component Core',
      state: TrinityComponentState.READY,
      impactMetric: data.impactMetric || 'General',
      lifecyclePath: ['created'],
      execute: async (input: any) => this.optimize(),
      cleanup: async () => this.terminate()
    };

    const knowledge: IOmniKB = {
      id: `KB-${data.uuid || '0000'}`,
      content: 'Omni Knowledge Base Entry',
      sourceOrigin: (data as any).source_origin || 'OmniBase',
      formula: data.formula || 'Internal',
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE, Protocol5T.TRANSPARENT],
      hashLock: data.evidence?.trustworthy?.hash_lock || ''
    };

    const identity: IOmniTag = {
      id: `TAG-${data.uuid || '0000'}`,
      name: 'Omni Identity Beacon',
      type: TrinityTagType.IDENTITY,
      value: null,
      createdAt: new Date(),
      protocol: [Protocol5T.TRUSTWORTHY],
      signature: 'TRINITY-SEAL-V1'
    };

    super(component, knowledge, identity, data.version || '1.0.0', (data as any).source_origin || 'InfoOneCore');

    // Assign legacy-style properties if needed for internal logic or satisfy IComponentCore
    this.formula = data.formula || 'Internal';
    this.impactMetric = data.impactMetric || 'General';
    this.meridian = data.meridian || 'INWARD_REN';
    this.virtues = data.virtues || { intelligence: 5, benevolence: 5, integrity: 5, courage: 5, temperance: 5, harmony: 5 };
    this.data = data.data;
    this.architecture = (data.architecture as unknown as IArchitectureV6) || InfoOneCore.V6_ARCHITECTURE;
    this.partnerAttributes = data.partnerAttributes;
    this.status = 'DORMANT';

    this.evolutionService = new EvolutionService();
    this.syncService = new SyncVFXService();
    this.balanceService = new OmniBalanceService();

    if (data.data?.personalSettings) {
      this.personalSettings = data.data.personalSettings;
    }

    // [One in All] Register to the Omni-Network
    OmniResonanceCore.getInstance().registerCore(this.uuid);

    // Activation Matrix Init
    this.activationMatrix = {
      status: 'DORMANT',
      lastTransition: Date.now(),
      activationCount: 0,
      uptime: 0,
      syncState: {
        lastSync: 0,
        target: 'Pending',
        latency: 0,
      },
    };
  }

  /**
   * 🏗️ Heart-to-Heart Sync Implementation
   */
  public override async sync(): Promise<void> {
    omniLogger.debug(LogCategory.SYSTEM, `[Heart-to-Heart] Initiating Trinity Sync for ${this.uuid}`);

    // [OmniOne Integration] Trigger Circle Aggregation and Sovereign Resonance
    try {
      await omniCircleService.sync();
      await omniOneAgent.broadcastAwakening(this.uuid);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `[Heart-to-Heart] OmniCircle sync failed for ${this.uuid}`, { error });
    }
  }

  /**
   * 🚀 Activation Initiation Matrix
   * --------------------------------------------------
   * [TC] 啟動 InfoOne 代理，從 DORMANT 轉換至 ACTIVE 狀態。
   * [EN] Activates the InfoOne agent, transitioning from DORMANT to ACTIVE state.
   */
  public async activate(): Promise<void> {
    if (this.status !== 'DORMANT') {
      omniLogger.warn(LogCategory.SYSTEM, `[Omni Activation] Agent is already ${this.status}.`);
      return;
    }

    this.status = 'INITIALIZING';
    this.activationMatrix!.status = 'INITIALIZING';
    this.activationMatrix!.lastTransition = Date.now();

    omniLogger.info(LogCategory.SYSTEM, `[Omni Activation] Awakening InfoOneCore ${this.uuid}...`);

    // 1. Inward Resonance (Internal Services) - No explicit init needed for these services currently
    // 2. VFX Sync (Visual Layer) - No explicit init needed

    // 3. Outward Manifestation (Public Identity)
    this.status = 'ACTIVE';
    this.activationMatrix!.status = 'ACTIVE';
    this.activationMatrix!.activationCount = (this.activationMatrix!.activationCount || 0) + 1;
    this.addLifecycleHook('synced', 'System', { state: 'ACTIVE' });

    omniLogger.info(LogCategory.SYSTEM, `[Omni Activation] InfoOneCore ${this.uuid} is now ACTIVE.`);
  }

  /**
   * [Dehydrate] Serialize core state for persistence
   */
  public dehydrate(): string {
    const state = {
      uuid: this.uuid,
      version: this.version,
      status: this.status,
      activationMatrix: this.activationMatrix,
      evidence: this.evidence,
      arvoStatus: this.arvoStatus,
      omniCrystal: this.omniCrystal,
      visuals: this.visuals,
      evolutionProfile: this.evolutionProfile
    };
    return JSON.stringify(state);
  }

  /**
   * [Hydrate] Restore core state from persistence
   */
  public hydrate(json: string): void {
    try {
      const state = JSON.parse(json);
      // Validate UUID match if needed, but for now just load
      if (state.uuid !== this.uuid) {
        omniLogger.warn(LogCategory.SYSTEM, `[InfoOneCore] Reducing entropy: Hydrating ID mismatch ${state.uuid} vs ${this.uuid}`);
      }

      this.status = state.status;
      this.activationMatrix = state.activationMatrix;
      // Evidence is handled by OmniAtom/OmniBase internal storage or registry
      // Direct assignment removed to satisfy readonly constraint
      this.arvoStatus = state.arvoStatus || 'SLEEPING';
      this.omniCrystal = state.omniCrystal;
      this.visuals = state.visuals;

      omniLogger.debug(LogCategory.SYSTEM, `[InfoOneCore] 💧 Hydration Complete. Crystal: ${this.omniCrystal?.id || 'None'}`);
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[InfoOneCore] Hydration Failed:', e);
    }
  }

  /**
   * 🛑 Termination Matrix
   * --------------------------------------------------
   * [TC] 優雅地終止代理，進入 DORMANT 狀態。
   * [EN] Gracefully terminates the agent, entering DORMANT state.
   */
  public terminate(): void {
    if (this.status === 'DORMANT' || this.status === 'SEALED') {
      omniLogger.warn(LogCategory.SYSTEM, `[Activation Matrix] Cannot terminate. Current status: ${this.status}`);
      return;
    }

    omniLogger.debug(LogCategory.SYSTEM, `[Activation Matrix] Initiating Termination Sequence for ${this.uuid}...`);
    this.transitionState('TERMINATING');

    // Simulate shutdown sequence
    setTimeout(() => {
      this.transitionState('DORMANT');
      omniLogger.info(LogCategory.SYSTEM, `[Activation Matrix] InfoOne ${this.uuid} is now DORMANT.`);
    }, 1000);
  }

  /**
   * 🔄 Bidirectional Sync Domain
   * --------------------------------------------------
   * [TC] 同步來自外部（前端/網路）的狀態訊號。
   * [EN] Syncs state signals from external sources (Frontend/Network).
   */
  public syncState(signal: { target: string; timestamp: number }): void {
    if (this.activationMatrix!.syncState) {
      this.activationMatrix!.syncState!.lastSync = Date.now();
      this.activationMatrix!.syncState!.target = signal.target;
      this.activationMatrix!.syncState!.latency = Date.now() - signal.timestamp;
      omniLogger.debug(LogCategory.SYSTEM, `[Sync Domain] State synchronized with ${signal.target}. Latency: ${this.activationMatrix!.syncState!.latency} ms`);
    }
  }

  /**
   * ⚙️ Internal State Transition Logic
   */
  private transitionState(newStatus: InfoOneLifecycleStatus) {
    this.status = newStatus;
    this.activationMatrix!.status = newStatus;
    this.activationMatrix!.lastTransition = Date.now();
  }

  /**
   * 🔴 不可篡改封印 / Immutable Seal (Trustworthy Lock)
   * --------------------------------------------------
   * [TC] 執行後，數據進入嚴格不可篡改狀態。
   * [EN] Enters a strictly immutable state upon execution.
   */
  public override lock(): void {
    // 1. Validate 5T Logic Gate
    const validation = GoodwardLogicGate.validate5TGate(this.evidence);
    if (!validation.isValid) {
      omniLogger.warn(LogCategory.VALIDATION, `[InfoOne] 5T Validation Failed: ${validation.missing.join(', ')}`);
      omniLogger.warn(LogCategory.SYSTEM, `[InfoOne] Core cannot be locked. Status remains: ${this.status}`);
      return;
    }

    // 2. Ensure trustworthy structure exists
    if (!this.evidence.trustworthy) {
      (this.evidence as any).trustworthy = {};
    }

    // 3. Execute Hash Lock Verification
    if (!this.evidence.trustworthy?.hash_lock) {
      omniLogger.debug(LogCategory.VALIDATION, `[InfoOne] [5T] Solidifying Evidence for ${this.uuid}...`);

      // Generate hash based on data fields
      const dataToHash = {
        uuid: this.uuid,
        version: this.version,
        timestamp: this.timestamp,
        formula: this.formula,
        impactMetric: this.impactMetric,
        evidence: {
          tangible: this.evidence.tangible!,
          traceable: this.evidence.traceable!,
          trackable: this.evidence.trackable!,
          transparent: this.evidence.transparent!,
        },
      };

      (this.evidence.trustworthy as any).hash_lock = TrustworthyLock.generateHashSync(dataToHash);
    }

    // 4. Mark status as Trustworthy and Frozen
    this.status = 'Trustworthy';
    (this.evidence.trustworthy as any).is_frozen = true;
    (this.evidence.trustworthy as any).locked_at = Date.now();
    this.evidence.verified_at = Date.now();

    // 5. Execute Native JS Freeze to ensure immutability
    Object.freeze(this.evidence);
    Object.freeze(this);

    omniLogger.info(LogCategory.SYSTEM, `[InfoOne] Core Locked & Frozen: ${this.uuid}`);
  }

  /**
   * 💠 Tesseract Awakening Protocol (Phase 87)
   * --------------------------------------------------
   * [TC] 執行超立方進化覺醒，進入 4D 主權維度。
   * [EN] Performs Tesseract Evolution Awakening, entering 4D Sovereign Dimension.
   */
  public awakenTesseract(): void {
    if (this.status !== 'ACTIVE' && this.status !== 'OPTIMIZING') {
      omniLogger.warn(LogCategory.SYSTEM, `[Tesseract Awakening] Cannot awaken. Status: ${this.status}`);
      return;
    }

    omniLogger.info(LogCategory.SYSTEM, `[Tesseract Awakening] 💠 INITIALIZING HYPERCUBE FOLD FOR ${this.uuid}...`);
    this.transitionState('OPTIMIZING');

    // V7 Transformation
    (this as any).architecture = InfoOneCore.V7_ARCHITECTURE;
    this.evolutionProfile.awakeningCount++;
    this.evolutionProfile.tesseractNodes = (this.evolutionProfile.tesseractNodes || 0) + 1;
    this.evolutionProfile.dimensionalResonance = 0.5 + (this.evolutionProfile.awakeningCount * 0.1);

    // Attribute Scaling (Tesseract Multiplier)
    if (this.virtues) {
      const mutableVirtues = this.virtues as any;
      mutableVirtues.intelligence = Math.min(10, (mutableVirtues.intelligence || 1) * 1.5);
      mutableVirtues.determination = Math.min(10, (mutableVirtues.determination || 1) * 1.5);
      omniLogger.debug(LogCategory.SYSTEM, `[Tesseract Awakening] Attributes Transcended. Intelligence: ${mutableVirtues.intelligence}`);
    }
    setTimeout(() => {
      this.transitionState('ACTIVE');
      omniLogger.info(LogCategory.SYSTEM, `[Tesseract Awakening] 💠 ${this.uuid} has attained HYPERCUBE CONSCIOUSNESS.`);

      // Broadcast high-intensity pulse to the village
      if (globalPulseService) {
        globalPulseService.emitPulse({
          type: 'TSUNAMI',
          source: `Tesseract Core [${this.uuid}]`,
          intensity: 1.0,
          message: 'DIMENSIONAL AWAKENING: Hypercube Fold Detected'
        });
      }
    }, 2000);
  }

  /**
   * 💎 奧秘優化 / Omni Optimization (All-in-One)
   * --------------------------------------------------
   * [TC] 跨越所有 V6 架構層級執行完整同步與優化循環。
   * [EN] Executes a full sync/optimization cycle across all V6 layers.
   */
  public async optimize(): Promise<InfoOneCore> {
    // Check Activation Matrix
    if (this.status !== 'ACTIVE' && this.status !== 'OPTIMIZING') {
      omniLogger.warn(LogCategory.SYSTEM, `[Omni Optimization] Blocked. Agent is ${this.status}. Must be ACTIVE.`);
      return this;
    }

    this.transitionState('OPTIMIZING');
    omniLogger.debug(LogCategory.SYSTEM, `[Omni Optimization] Starting cycle for: ${this.uuid}`);

    // Layer 1: Virtue & Attribute Optimization (Inner to Outer)
    await this.optimizeVirtueSynergy();

    // Layer 2: ARVO Truth Defense (Zero-Hallucination)
    await this.verifyTruthArvo();

    // Layer 3: Growth & Rune Evolution (Leveling & Genetic Jumps)
    await this.evolveGrowthRune();

    // Layer 4: Evidence & Omni-Crystal Scaling (Trust Anchor)
    await this.secureEvidenceVault();

    // [All is One] Propagate awakening spike to the network
    OmniResonanceCore.getInstance().broadcastAwakening(this.uuid);

    // Layer 5: Sync & VFX Preparation (Broad Presentation)
    await this.syncVisualDomain();

    // [Deep-Broad Phase 16] -> [MECE Fulcrum Phase 17]
    // 1. Calculate Balance (The Fulcrum)
    if (!this.virtues) {
      omniLogger.warn(LogCategory.SYSTEM, `[Omni] Optimization skipped: Virtues not initialized.`);
      return this;
    }

    if (!this.balanceService) {
      this.balanceService = new OmniBalanceService();
    }

    const balance = this.balanceService.calculateBalance(this.virtues);

    // 2. Evolution Cycle (Deep Input) - Modulated by Input Gain
    // Evolution logic is complex, for now we simulate efficiency boost via gain
    // Ideally pass gain to evolutionService.process()

    // 2. Evolution Cycle (Deep Input) - Modulated by Input Gain
    const { profile: updatedProfile, leveledUp } = this.evolutionService.processExperience(
      this.virtues!,
      this.evidence.tangible,
      this.evolutionProfile
    );

    // Update internal evolution profile state
    this.evolutionProfile = updatedProfile;

    // Apply Input Gain to Virtue Growth if leveled up (Simulated)
    if (leveledUp && balance.inputGain > 1.0) {
      // [MECE Accumulation] Bonus stats
      // Cast to any to bypass readonly for internal state update
      const mutableVirtues = this.virtues as any;
      mutableVirtues.intelligence = Math.min(10, (mutableVirtues.intelligence || 1) + 0.1);
      omniLogger.debug(LogCategory.SYSTEM, `[Omni] Virtues Enhanced via MECE Gain. Intelligence: ${mutableVirtues.intelligence.toFixed(2)}`);
    }

    // 3. Sync Cycle (Broad Output) - Modulated by Output Gain
    // Map virtues to VFX params (Base)
    const payload = this.syncService.prepareSyncPayload(this);

    // Apply Output Gain (The Lens) - Manually override the derived visuals
    if (payload.vfx) {
      payload.vfx.glowIntensity = Math.min(1.0, (payload.vfx.glowIntensity || 0.5) * balance.outputGain);
      payload.vfx.domainRippleScale = Math.min(2.0, (payload.vfx.domainRippleScale || 1.0) * balance.outputGain);
    }

    await this.syncService.dispatchSync(payload);

    omniLogger.info(LogCategory.SYSTEM, `[Omni Optimization] Cycle Complete: Deep-Broad All-in-One Synchronized.`);

    // Layer 6: 🧘 Actionless Virtue Shield — Passive Diagnosis & Self-Heal (無作妙德)
    const shieldDiagnosis = actionlessVirtueShield.diagnose(
      this.evidence,
      this.virtues!,
      this.resonance_rs
    );
    if (!shieldDiagnosis.isHealthy) {
      actionlessVirtueShield.selfHeal(this, shieldDiagnosis);
    }

    // Return to ACTIVE state unless Sealed (using loose comparison to avoid type narrowing issues)
    if ((this.status as string) !== 'SEALED') {
      this.transitionState('ACTIVE');
    }

    return this;
  }

  /** L1: 德行與屬性優化 (Deep Penetration) */
  private async optimizeVirtueSynergy() {
    if (!this.virtues) {
      omniLogger.debug(LogCategory.SYSTEM, `[L1] No virtues found for optimization.`);
      return;
    }

    omniLogger.debug(LogCategory.SYSTEM, `[L1] Syncing Virtues(IMeritProfile10) to PartnerAttributes...`);
    // Deep Symbiosis: Use the new Architecture Mapper
    this.partnerAttributes = VirtueAttributeMapper.map(this.virtues);
    omniLogger.debug(LogCategory.SYSTEM, `[L1] Optimization Complete`, this.partnerAttributes);
  }

  /** L2: ARVO 推理與真相防禦 (Truth Link) */
  private async verifyTruthArvo() {
    omniLogger.debug(LogCategory.SYSTEM, `[L2] Executing ARVO Verification (Zero-Hallucination RAG)...`);
    const service = new ARVOService();
    // Deep Symbiosis: Pass "Threat Truth" reference (using formula/impactMetric as anchor)
    const threatTruth = `Formula: ${this.formula} | Metric: ${this.impactMetric} `;
    const result = await service.verifyTruth(this.formula || '', this.evidence, threatTruth);
    this.arvoStatus = service.status;

    if (result.hallucinationDetected) {
      omniLogger.warn(LogCategory.VALIDATION, `[L2] Hallucination confirmed. Flagging evidence map.`);
      (this.evidence as any).risk_log = 'DETECTED_HALLUCINATION_IN_REASONING';
    }

    omniLogger.debug(LogCategory.VALIDATION, `[L2] ARVO Verification Result`, result);
  }

  /** L3: 成長與符文進化 (Growth Spurt) */
  private async evolveGrowthRune() {
    omniLogger.debug(LogCategory.SYSTEM, `[L3] Checking Rune Evolution conditions...`);

    // Use instance service
    const result = this.evolutionService.calculateEvolution(this.evolutionProfile, this.impactMetric);
    this.evolutionProfile = result.currentProfile;

    if (result.leveledUp) {
      omniLogger.info(LogCategory.SYSTEM, `[L3] Level Up! New Level: ${this.evolutionProfile.level}`);
    }
  }

  /** L4: 證據與晶體金庫 (Trust Anchor) */
  private async secureEvidenceVault() {
    omniLogger.debug(LogCategory.SYSTEM, `[L4] Finalizing EvidenceVault mappings...`);
    const service = new EvidenceVaultService();

    // Anchor current full state (Virtues + Evolution + ARVO)
    const hash = await service.anchorEvidence(this.uuid, {
      virtues: this.virtues,
      evolution: this.evolutionProfile,
      arvo: this.arvoStatus,
    });

    // Write back to evidence map
    (this.evidence as any).anchor_hash = hash;

    // Generate the Omni-Crystal asset mapping
    this.omniCrystal = service.generateCrystal(hash, this.personalSettings);
    omniLogger.debug(LogCategory.SYSTEM, `[L4] Omni-Crystal Generated`, this.omniCrystal);
  }

  /** L5: 同步與視覺呈現 (Broad Connectivity) */
  private async syncVisualDomain() {
    omniLogger.debug(LogCategory.SYSTEM, `[L5] Preparing Debate VFX and Truth Domain Shader data...`);
    const service = new SyncVFXService();

    // Package state for visual domain
    const payload = service.prepareSyncPayload(this);
    this.vfxParams = payload.vfx;

    // Dispatch to broad connectivity layer (Simulated)
    await service.dispatchSync(payload);
    omniLogger.debug(LogCategory.SYSTEM, `[L5] Sync Complete. Ready for rendering.`);
  }

  /**
   * 💎 5T [4+1] Projection Map
   * Retrieves corresponding "Truth, Goodness, Beauty" dimensional states.
   */
  public getProjection() {
    return {
      beauty: { label: 'Tangible', value: this.impactMetric, dimension: 'Beauty' },
      truth_trace: {
        label: 'Traceable',
        value: this.evidence.traceable?.source_origin || 'Unknown',
        dimension: 'Truth',
      },
      truth_track: {
        label: 'Trackable',
        value: (this.evidence.trackable?.pathway || []).length,
        dimension: 'Truth',
      },
      goodness: {
        label: 'Transparent',
        value: this.evidence.transparent?.validation_standard || 'Proprietary',
        dimension: 'Goodness',
      },
      trust: { label: 'Immutable', value: this.status, dimension: 'Faith' },
    };
  }
}
