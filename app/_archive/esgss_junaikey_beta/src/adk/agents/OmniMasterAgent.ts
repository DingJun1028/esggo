import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { omniCore } from '../../omni/core/OmniCore';
import { OMNI_DECREE } from '../../omni/core/OmniConstitution';

export class OmniMasterAgent {
  private static instance: OmniMasterAgent;

  private constructor() {
    omniLogger.info(LogCategory.AGENCY, '🤖 OmniMasterAgent Initialized.');
  }

  public static getInstance(): OmniMasterAgent {
    if (!OmniMasterAgent.instance) {
      OmniMasterAgent.instance = new OmniMasterAgent();
    }
    return OmniMasterAgent.instance;
  }

  public async executeDirective(
    directive: string,
    context: Record<string, unknown> = {}
  ): Promise<any> {
    omniLogger.info(LogCategory.AGENCY, `🤖 OmniMasterAgent Executing Directive: ${directive}`, {
      context,
    });

    // Process through OmniCore
    const result = await omniCore.process({
      id: 'MASTER-' + Date.now(),
      type: 'COMMAND',
      content: directive,
      timestamp: Date.now(),
      context: {
        ...context,
        source: 'OmniMasterAgent',
        decree: OMNI_DECREE.id,
      },
    });

    return result;
  }
}

export const omniMasterAgent = OmniMasterAgent.getInstance();
