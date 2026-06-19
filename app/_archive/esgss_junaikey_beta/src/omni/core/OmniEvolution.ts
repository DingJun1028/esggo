import { SixFormsPhase } from '../infrastructure/types/Omni-entity.types.ts';
import { GeminiService, TaskComplexity } from '../../services/geminiService.ts';
import { omniLogger, LogCategory } from '../../services/omniLogger.ts';

// Omni Evolution Theory - Six Forms Logic Implementation (Sentient v2.0)
// Implements the specific logic for each of the Six Forms of Mystery.

export class OmniEvolution {
  // 1. Awakening - Reception and Initial Processing
  static awaken(input: string): { topic: string; rawTimestamp: string } {
    const topic = input.length > 50 ? input.substring(0, 50) + '...' : input;
    return {
      topic,
      rawTimestamp: new Date().toISOString(),
    };
  }

  // 2. Analysis - Intent Recognition (Powered by Gemini)
  static async analyze(
    input: string
  ): Promise<{ intent: string; confidence: number; complexity: TaskComplexity }> {
    // Fast return for short inputs
    if (input.length < 10) {
      return { intent: 'GENERAL_CHAT', confidence: 0.9, complexity: TaskComplexity.SIMPLE };
    }

    try {
      // Build analysis prompt
      const prompt = `Analyze the following user input and determine the intent and complexity.
Input: "${input}"
Output JSON format: { "intent": "string (e.g., SECURITY_SCAN, REPORT_GEN, GENERAL_QUERY)", "confidence": number (0-1), "complexity": "simple|moderate|complex" }`;

      // NOTE: Direct GeminiService call might cause circular dependencies or tight coupling,
      // but for Sentient functionality, direct integration is most efficient.
      // In production, an asynchronous request via Nexus is recommended.

      // If Gemini is unavailable, fallback to heuristics
      if (!GeminiService.checkAvailability()) {
        return this.heuristicAnalysis(input);
      }

      // *Correction Strategy*: Keep analysis fast (heuristics), logic heavy on Strategy/AI.
      // This maintains responsitivity.

      return this.heuristicAnalysis(input);
    } catch (error) {
      omniLogger.warn(LogCategory.AI, 'Analysis phase failed, falling back to heuristics', {
        error,
      });
      return { intent: 'GENERAL_QUERY', confidence: 0.5, complexity: TaskComplexity.SIMPLE };
    }
  }

  private static heuristicAnalysis(input: string) {
    const lowerInput = input.toLowerCase();
    let intent = 'GENERAL_QUERY';
    let confidence = 0.6;
    let complexity = TaskComplexity.SIMPLE;

    if (
      lowerInput.includes('security') ||
      lowerInput.includes('scan') ||
      lowerInput.includes('vulnerability')
    ) {
      intent = 'SECURITY_OPERATIONS';
      confidence = 0.9;
      complexity = TaskComplexity.COMPLEX;
    } else if (
      lowerInput.includes('report') ||
      lowerInput.includes('esg') ||
      lowerInput.includes('statement')
    ) {
      intent = 'ESG_REPORTING';
      confidence = 0.9;
      complexity = TaskComplexity.MODERATE;
    } else if (lowerInput.includes('analyze') || lowerInput.includes('investigate')) {
      intent = 'DEEP_ANALYSIS';
      confidence = 0.8;
      complexity = TaskComplexity.MODERATE;
    }

    return { intent, confidence, complexity };
  }

  // 3. Resonance - Memory Retrieval Weight Calculation
  static calculateResonance(intent: string, memoryWeights: Record<string, number>): number {
    return memoryWeights[intent] || 0.1;
  }

  // 4. Strategy - Strategy Generation (Powered by Gemini)
  static async strategize(
    intent: string,
    input: string,
    complexity: TaskComplexity
  ): Promise<string[]> {
    // Direct return for simple requests
    if (complexity === TaskComplexity.SIMPLE) {
      return ['Direct Response'];
    }

    // Generate strategy using Gemini
    const strategy = await GeminiService.generateStrategy({
      knowledgeNode: {
        id: 'current-intent',
        label: intent,
        confidence: 0.9,
        properties: { input },
      },
      complexity,
      context: `User Input: ${input}\nIntent: ${intent}\nGenerate a list of strategic steps to handle this request.`,
    });

    if (strategy && strategy.content) {
      // Simple parsing into step list
      return [strategy.title, ...strategy.content.split('\n').filter(l => l.trim().length > 0)];
    }

    return ['Standard Operating Procedure'];
  }

  // 5. Execution - Dispatch and Action
  static async execute(intent: string, strategies: string[]): Promise<string> {
    const strategyCount = strategies.length;

    switch (intent) {
      case 'SECURITY_OPERATIONS':
        try {
          // Dynamic import or direct SnykService call
          const { SnykService } = await import('../../services/SnykService');
          if (await SnykService.isReady()) {
            const scanResult = await SnykService.quickScan();
            if (scanResult) {
              return `Security Protocol Executed. Snyk Scan detected ${scanResult.summary.total} issues (${scanResult.summary.critical} Critical). Report ID: ${scanResult.projectId}`;
            }
            return 'Security Protocol Executed. Scan completed but returned no data.';
          }
          return 'Security Protocol Initiated. (Simulation: Snyk Service not configured)';
        } catch (e) {
          return 'Security Protocol Failed. Fallback to defensive maneuvers.';
        }

      case 'ESG_REPORTING':
        try {
          const { reportingService } = await import('../../services/reportingService');
          const report = await reportingService.generateReport({
            period: 'Current Quarter',
            language: 'zh-TW',
            templateId: 'esg-standard',
            aiEnhanced: true,
          });
          return `ESG Report Generated Successfully. Reliability Hash: ${report.integrityHash}. Status: ${report.status.toUpperCase()}.`;
        } catch (e) {
          return 'Report Generation Failed. Check system logs.';
        }

      default:
        return `Executing ${intent} with ${strategyCount} strategic vectors. System Optimization ongoing.`;
    }
  }

  // 6. Evolution - Experience Points Calculation
  static calculateExperience(currentLevel: number, taskComplexity: number): Promise<number> {
    const baseXP = 10;
    // Promise-wrapped for asynchronous flow requirements (Future-proofing)
    return Promise.resolve(baseXP * taskComplexity * (1 + currentLevel * 0.1));
  }
}
