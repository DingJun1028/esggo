// @google/adk removed from build - using stubs

type AnyObject = Record<string, unknown>;

class InMemorySessionService {
  private sessions = new Map<string, AnyObject>();

  async createSession(sessionId: string): Promise<AnyObject> {
    const session = { id: sessionId, events: [] } as AnyObject;
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<AnyObject | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async appendEvent(request: AnyObject): Promise<AnyObject> {
    return request;
  }
}

export class AdkSquadFactory {
  private static sessionService = new InMemorySessionService();

  static createAgent(config: {
    name: string;
    description: string;
    model?: string;
    instruction: string;
    tools?: any[];
  }) {
    return {
      name: config.name,
      description: config.description,
      model: config.model || 'gemini-2.5-flash',
      instruction: config.instruction,
      tools: config.tools || [],
    };
  }

  static registerRuneAsTool(rune: any) {
    return {
      definition: {
        name: rune.name,
        description: rune.description,
        parameters: {
          type: 'object',
          properties: Object.entries(((rune.schema as AnyObject)._def as any)?.shape?.() ?? {}).reduce(
            (acc: AnyObject, [key, value]: [string, any]) => {
              acc[key] = {
                type: String(value._def?.typeName ?? 'string').replace('Zod', '').toLowerCase(),
                description: value.description ?? key,
              };
              return acc;
            },
            {} as AnyObject,
          ),
          required: Object.keys(((rune.schema as AnyObject)._def as any)?.shape?.() ?? {}),
        },
      },
      execute: async (args: any) => rune.execute({}, args),
    };
  }

  static createRunner(rootAgent: any, sessionService?: any) {
    return {
      agent: rootAgent,
      sessionService: sessionService ?? this.sessionService,
      appName: 'InfoOne-ESG-Swarm',
    };
  }

  static getSessionService() {
    return this.sessionService;
  }
}
