import { ARVOStatus, IARVOEngine, ITruthVerification } from '../../0-domain/contracts/IARVOService.ts';
import { geminiCore } from '../../services/ai/GeminiService.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

/**
 * 🤖 ARVOService: Truth Defense & AI Reasoning
 * --------------------------------------------------
 * Implements the Zero-Hallucination state machine.
 */
export class ARVOService implements IARVOEngine {
  private _status: ARVOStatus = 'SLEEPING';

  get status(): ARVOStatus {
    return this._status;
  }

  async verifyTruth(claim: string, evidenceVault: any, threatTruthReference?: string): Promise<ITruthVerification> {
    this._status = 'REASONING';
    omniLogger.debug(LogCategory.VALIDATION, `[ARVO] Reasoning with Gemini about claim: "${claim.substring(0, 50)}..."`);

    // Construct Prompt
    const context = `
      Claim to Verify: "${claim}"
      Evidence Available: ${JSON.stringify(evidenceVault)}
      Trusted Reference (Threat Truth): "${threatTruthReference || 'None'}"
    `;

    const instructions = `
      Analyze the Claim against the Evidence and Reference.
      Determine if the Claim varies significantly from the Reference (Hallucination) or is unsupported by Evidence.
      Return a JSON object with:
      - isValid: boolean
      - confidence: number (0.0 to 1.0)
      - hallucinationDetected: boolean
      - remediationAction: string (optional)
    `;

    this._status = 'VERIFYING';

    try {
      const result = await geminiCore.generateStructuredData<ITruthVerification>(
        context,
        instructions
      );

      if (!result) {
        throw new Error('Gemini returned null structure.');
      }

      if (result.hallucinationDetected) {
        this._status = 'HALLUCINATING';
        omniLogger.warn(LogCategory.VALIDATION, `[ARVO] ⚠️ Gemini detected hallucination! Confidence: ${result.confidence}`);
      } else {
        this._status = 'AWAKENED';
        omniLogger.info(LogCategory.VALIDATION, `[ARVO] ✅ Gemini verified truth. Confidence: ${result.confidence}`);
      }

      return result;
    } catch (e) {
      omniLogger.error(LogCategory.VALIDATION, `[ARVO] AI Verification Failed, falling back to heuristic.`, e);
      // Fallback or "Safe" default
      return { isValid: false, confidence: 0.5, hallucinationDetected: false, remediationAction: 'AI_FAILURE_RETRY' };
    }
  }

  reset() {
    this._status = 'SLEEPING';
  }
}
