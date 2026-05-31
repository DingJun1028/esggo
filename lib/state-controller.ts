/**
 * Simple hybrid state controller for OmniCLI + Jules integration.
 * Keeps track of whether the system is in ESG mode or Jules AI mode.
 * After every command, the controller checks if the latest result
 * signals a need to switch to Jules for a code fix or logic enhancement.
 */

import type { Command } from 'commander';
import { omniAgent } from './agents/adk-swarm.ts';
import pc from 'picocolors';

export class StateController {
  private currentState: 'esg' | 'jules' = 'esg';

  /**
   * After a command has finished, this method inspects the output or
   * task description to determine if a transition to Jules is necessary.
   */
  async postCommandExecution(args: string[]): Promise<void> {
    // Skip if no actionable command executed
    if (!args || args.length === 0) return;

    const [cmd, ...rest] = args;
    // Example: when a CLI command contains "audit" and expects a bug fix.
    if (cmd.includes('audit') && rest.some(r => r.includes('fix'))) {
      await this.triggerJulesFix(rest.join(' '));
    }
  }

  /**
   * Trigger a Jules code generation or repair task based on a prompt.
   */
  async triggerJulesFix(prompt: string) {
    try {
      console.log(pc.blue('[State] Switching to Jules for auto-repair...'));
      const result = await omniAgent.command('CODEGEN', { prompt });
      if (result?.success) {
        console.log(pc.green('[State] Jules repair applied \u2192 ' + result.message || 'done'));
        this.currentState = 'esg';
      } else {
        console.log(pc.red('[State] Jules repair failed.'));
        this.currentState = 'esg';
      }
    } catch (e) {
      console.error(pc.red('[State] Jules integration error:'), e);
      this.currentState = 'esg';
    }
  }
}
