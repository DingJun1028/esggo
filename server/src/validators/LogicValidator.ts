export interface LogicValidator {
  validate(data: any): Promise<boolean>;
  getComplianceScore(entityId: string): Promise<number>;
}

export class SustainaLogicValidator implements LogicValidator {
  async validate(data: any): Promise<boolean> {
    return data?.logic_type && data?.compliance_score !== undefined;
  }

  async getComplianceScore(entityId: string): Promise<number> {
    const registry: Record<string, number> = {
      'carbon_footprint': 0.85,
      'data_integrity': 0.92,
      'supply_chain': 0.78
    };
    return registry[entityId] || 0.5;
  }
}