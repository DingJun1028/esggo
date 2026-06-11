import { SustainaLogicValidator, LogicValidator } from '../validators/LogicValidator.js';

export interface LogicNodeConfig {
  name: string;
  version: string;
  logic_type: string;
  compliance_score?: number;
  rules?: Record<string, any>;
}

export class LogicNode {
  private validator: LogicValidator;
  private state: Map<string, any>;

  constructor(private config: LogicNodeConfig) {
    this.validator = new SustainaLogicValidator();
    this.state = new Map();
  }

  async initialize(): Promise<void> {
    const score = await this.validator.getComplianceScore(this.config.name);
    this.config.compliance_score = score;
  }

  async autoExport(targetSystem: string): Promise<{ content: string }> {
    try {
      const payload = {
        node: this.config.name,
        score: this.config.compliance_score,
        timestamp: Date.now(),
        target: targetSystem
      };
      this.state.set('last_export', payload);
      return { content: JSON.stringify(payload) };
    } catch {
      this.state.set('error', 'export_failed');
      throw new Error(`LogicNode autoExport failed for ${this.config.name}`);
    }
  }
}

export function createLogicNode(config: LogicNodeConfig): LogicNode {
  return new LogicNode(config);
}