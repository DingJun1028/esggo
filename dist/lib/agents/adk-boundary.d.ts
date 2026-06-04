/**
 * Auto-repair boundary for OmniAgent.
 *
 * This module is automatically imported to enable the ADK Boundary system.
 *
 * Usage:
 * - Any error in ADK agents will emit ERROR_OCCURRED.
 * - ErrorHandler agent will trigger HealingGuardian.
 * - Recovery actions are logged and emitted as HEALING_COMPLETE.
 */
export { errorHandlerAgent } from './error-handler';
//# sourceMappingURL=adk-boundary.d.ts.map