/**
 * 🎯 OMC-1: Omni-Core Engine
 * ================================================
 *
 * Scripture Alignment:
 * - Rule 10: OMC-12 Dimension Classification - OMC-1 Central Decision and Process Control
 * - Rule 19: Card Interaction Model - Sense-Diagnose-Act-Learn (SDAL) Cycle
 *
 * Features:
 * - Turn Structure Management
 * - Phase Management
 * - SDAL Cycle Execution
 * - Event Card Generation
 */

import { OmniKey } from '../../core/OmniKey.ts';
import type { Context, Result } from '../../../types.ts';
import { esgCardService, type EsgCard } from '../../../services/esgCardService.ts';
import { OmniEvolution } from '../../core/OmniEvolution.ts';
import { useOmniMemory } from '../memory/OmniMemory.ts';

import { omniLogger, LogCategory, LogLevel } from '../../../services/omniLogger.ts';
import { OmniElement } from '../../core/types/OmniElement.ts';
import { createOmniElement } from '../core/OmniFactory.ts';
import { OmniKnowledge } from '../knowledge/OmniKnowledge.ts';

/**
 * Turn Phase Enumeration
 */
export enum TurnPhase {
  IDLE = 'idle', // Idle Phase
  SENSING = 'sensing', // Sensing Phase: Awakening events
  DIAGNOSING = 'diagnosing', // Diagnosing Phase: Problems manifestation
  ACTING = 'acting', // Acting Phase: Deploying solutions
  LEARNING = 'learning', // Learning Phase: Wisdom inscription
}

/**
 * Turn State
 */
export interface TurnState {
  currentPhase: TurnPhase;
  turnNumber: number;
  phaseStartTime: number;
  events: EsgCard[];
  problems: EsgCard[];

  solutions: EsgCard[];
  omniElements: OmniElement[];
}

/**
 * Turn Result
 */
export interface TurnResult {
  turnNumber: number;
  eventsProcessed: number;
  problemsIdentified: number;
  solutionsExecuted: number;
  learningExtracted: string[];
  xpGained: number;
  duration: number; // ms
  omniElements: OmniElement[];
}

/**
 * OmniCoreEngine Class
 *
 * Core Responsibilities:
 * 1. Manage turn structure for system operation
 * 2. Execute SDAL Cycle
 * 3. Coordinate modules (ESGCardService, OmniEvolution, OmniMemory)
 */
export class OmniCoreEngine extends OmniKey {
  protected static override instance: OmniCoreEngine;
  private turnState: TurnState;
  private isRunning: boolean = false;

  constructor() {
    super();
    this.turnState = {
      currentPhase: TurnPhase.IDLE,
      turnNumber: 0,
      phaseStartTime: Date.now(),
      events: [],
      problems: [],

      solutions: [],
      omniElements: [],
    };
  }

  /**
   * Get singleton instance
   */
  public static override getInstance(): OmniCoreEngine {
    if (!this.instance) {
      this.instance = new OmniCoreEngine();
    }
    return this.instance;
  }

  /**
   * Start the Core Engine
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      omniLogger.warn(LogCategory.SYSTEM, '[OmniCoreEngine] Engine already running');
      return;
    }

    this.isRunning = true;
    omniLogger.info(LogCategory.SYSTEM, '[OmniCoreEngine] Engine started - SDAL Cycle initiated');
  }

  /**
   * Execute one full turn (SDAL Cycle)
   */
  async executeTurn(context?: Context): Promise<TurnResult> {
    const turnStartTime = Date.now();
    this.turnState.turnNumber++;

    omniLogger.info(
      LogCategory.SYSTEM,
      `[OmniCoreEngine] Turn ${this.turnState.turnNumber} - SDAL Cycle Beginning`
    );

    try {
      // Phase 1: SENSING
      await this.sensePhase(context);

      // Phase 2: DIAGNOSING
      await this.diagnosePhase();

      // Phase 3: ACTING
      await this.actPhase();

      // Phase 4: LEARNING
      const { learnings, xpGained } = await this.learnPhase();

      const result: TurnResult = {
        turnNumber: this.turnState.turnNumber,
        eventsProcessed: this.turnState.events.length,
        problemsIdentified: this.turnState.problems.length,
        solutionsExecuted: this.turnState.solutions.length,
        learningExtracted: learnings,
        xpGained,
        duration: Date.now() - turnStartTime,
        omniElements: [...this.turnState.omniElements], // Capture before reset
      };

      omniLogger.info(
        LogCategory.SYSTEM,
        `[OmniCoreEngine] Turn ${this.turnState.turnNumber} completed`,
        result
      );

      // Reset turn state, prepare for next turn
      this.resetTurnState();

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      omniLogger.critical(
        LogCategory.SYSTEM,
        `[OmniCoreEngine] Turn ${this.turnState.turnNumber} execution failed`,
        { error: errorMessage }
      );
      this.transitionPhase(TurnPhase.IDLE);
      throw error;
    }
  }

  /**
   * Phase 1: SENSING
   * Captures and generates event cards from metrics
   */
  private async sensePhase(context?: Context): Promise<void> {
    this.transitionPhase(TurnPhase.SENSING);
    omniLogger.debug(LogCategory.AGENT, '[SENSING] Detecting events from context and metrics...');

    try {
      // Get active event cards from ESGCardService
      const activeCards = esgCardService.getActiveCards();
      this.turnState.events = activeCards.filter(c => c.type === 'event');

      if (context?.metadata?.metrics) {
        const generated = esgCardService.generateEventCardsFromMetrics(context.metadata.metrics);
        this.turnState.events.push(...generated.filter(c => c.type === 'event'));
      }

      omniLogger.info(
        LogCategory.AGENT,
        `[SENSING] Captured ${this.turnState.events.length} events.`
      );

      // --- Omni Core (Trinity) Integration ---
      // Generate the Sensing Element (The "Atom" of the Sense phase)
      const sensingElement = createOmniElement('OmniSensing', {
        context: context || {},
        eventCount: this.turnState.events.length,
        turnNumber: this.turnState.turnNumber,
      });

      // Store into Knowledge Warehouse
      await OmniKnowledge.storeElement(sensingElement);

      this.turnState.omniElements.push(sensingElement);
      omniLogger.debug(LogCategory.SYSTEM, `[Trinity] Generated Element: ${sensingElement.label}`);
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, '[SENSING] Error during sensing phase', { error });
      throw error;
    }
  }

  /**
   * Phase 2: DIAGNOSING
   * Analyzes events and generates problem cards
   */
  private async diagnosePhase(): Promise<void> {
    this.transitionPhase(TurnPhase.DIAGNOSING);
    omniLogger.debug(LogCategory.AGENT, '[DIAGNOSING] Identifying problems from events...');

    try {
      // Get pending problem cards from ESGCardService
      this.turnState.problems = esgCardService.getPendingProblemCards();

      omniLogger.info(
        LogCategory.AGENT,
        `[DIAGNOSING] ${this.turnState.problems.length} problems identified for resolution.`
      );
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, '[DIAGNOSING] Error during diagnosing phase', { error });
      throw error;
    }
  }

  /**
   * Phase 3: ACTING
   * Executes solutions for identified problems
   */
  private async actPhase(): Promise<void> {
    this.transitionPhase(TurnPhase.ACTING);
    omniLogger.debug(LogCategory.AGENT, '[ACTING] Generating and executing solutions...');

    try {
      for (const problem of this.turnState.problems) {
        // Generate solution card for each problem
        const solution = esgCardService.generateSolutionCard(problem);

        // Activate solution
        try {
          esgCardService.activateCard(solution.id);
          solution.status = 'active';

          // Simulate execution delay and results verification
          await new Promise(resolve => setTimeout(resolve, 50));

          // Resolve problem
          esgCardService.resolveCard(problem.id);
          esgCardService.resolveCard(solution.id);

          this.turnState.solutions.push(solution);
          omniLogger.info(
            LogCategory.AGENT,
            `[ACTING] Resolved problem: ${problem.title} via ${solution.title}`
          );
        } catch (subError) {
          omniLogger.error(
            LogCategory.AGENT,
            `[ACTING] Failed to execute solution for ${problem.id}`,
            { error: subError }
          );
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, '[ACTING] Error during acting phase', { error });
      throw error;
    }
  }

  /**
   * Phase 4: LEARNING
   * Extracts wisdom and inscribes eternally
   */
  private async learnPhase(): Promise<{ learnings: string[]; xpGained: number }> {
    this.transitionPhase(TurnPhase.LEARNING);
    omniLogger.debug(
      LogCategory.AGENT,
      '[LEARNING] Extracting wisdom and updating evolution metrics...'
    );

    const learnings: string[] = [];
    let totalXp = 0;

    try {
      const memory = useOmniMemory.getState();

      // Reinforce successful problem areas
      for (const solution of this.turnState.solutions) {
        if (solution.status === 'resolved') {
          const intent =
            solution.esgCategory === 'E'
              ? 'Environmental'
              : solution.esgCategory === 'S'
                ? 'Social'
                : 'Governance';

          memory.reinforceConcept(intent, 0.2);
          learnings.push(`Reinforced ${intent} mastery via ${solution.title}`);

          // Calculate XP
          const xp = await OmniEvolution.calculateExperience(
            memory.evolutionState.evolutionLevel,
            0.9
          );
          totalXp += xp;
        }
      }

      // Update Memory Palace metrics
      if (totalXp > 0) {
        memory.updateEvolutionMetrics({
          experiencePoints: memory.evolutionState.experiencePoints + totalXp,
          inferenceSpeed: 100 - (this.turnState.turnNumber % 50), // Simulated performance boost
        } as any);
        omniLogger.info(LogCategory.SYSTEM, `[LEARNING] Evolution sublimation: +${totalXp} XP`);
      }

      return { learnings, xpGained: totalXp };
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, '[LEARNING] Error during learning phase', { error });
      return { learnings, xpGained: 0 };
    }
  }

  /**
   * Phase Transition
   */
  private transitionPhase(newPhase: TurnPhase): void {
    const now = Date.now();
    const duration = now - this.turnState.phaseStartTime;

    omniLogger.debug(
      LogCategory.PERFORMANCE,
      `[OmniCoreEngine] Phase Transition: ${this.turnState.currentPhase} -> ${newPhase} (spent ${duration}ms)`
    );

    this.turnState.currentPhase = newPhase;
    this.turnState.phaseStartTime = now;

    // Sync to global memory state if needed
    const memory = useOmniMemory.getState();
    if (newPhase !== TurnPhase.IDLE) {
      // Map to EvolutionPhase
      const phaseMap: Record<TurnPhase, any> = {
        [TurnPhase.IDLE]: 'AWAKENING',
        [TurnPhase.SENSING]: 'AWAKENING',
        [TurnPhase.DIAGNOSING]: 'ANALYSIS',
        [TurnPhase.ACTING]: 'EXECUTION',
        [TurnPhase.LEARNING]: 'EVOLUTION',
      };
      memory.setEvolutionPhase(phaseMap[newPhase]);
    }
  }

  /**
   * Reset turn state
   */
  private resetTurnState(): void {
    this.turnState.events = [];
    this.turnState.problems = [];

    this.turnState.solutions = [];
    this.turnState.omniElements = [];
    this.transitionPhase(TurnPhase.IDLE);
  }

  /**
   * Get current turn state
   */
  getTurnState(): Readonly<TurnState> {
    return { ...this.turnState };
  }

  /**
   * Stop the core engine
   */
  stop(): void {
    this.isRunning = false;
    omniLogger.info(LogCategory.SYSTEM, '[OmniCoreEngine] Engine stopped');
  }
}
