export interface GeneticBlueprint {
  id: string;
  parentAgentId: string;
  parentName: string;
  version: number;
  extractedAt: number;
  attributes: {
    computePower: number;
    empathyLevel: number;
    governanceScore: number;
  };
  passiveTraits: string[];
}

export class GeneticEngine {
  /**
   * 基因提取 (Genetic Synthesis)
   * 從高等級代理人提取屬性藍圖
   */
  public static extractBlueprint(agent: any): GeneticBlueprint {
    // 藍圖屬性為原始屬性的 20% 作為繼承加成
    return {
      id: `DNA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      parentAgentId: agent.id,
      parentName: agent.name,
      version: 1,
      extractedAt: Date.now(),
      attributes: {
        computePower: Math.floor(agent.computePower * 0.2),
        empathyLevel: Math.floor(agent.empathyLevel * 0.2),
        governanceScore: Math.floor(agent.governanceScore * 0.2),
      },
      passiveTraits: agent.skills?.slice(0, 2).map((s: any) => s.id) || [],
    };
  }

  /**
   * 基因突變計算 (Generational Mutation)
   */
  public static calculateMutation(blueprint: GeneticBlueprint): GeneticBlueprint {
    const mutationFactor = Math.random();
    if (mutationFactor > 0.9) {
      // 10% 概率突變
      return {
        ...blueprint,
        attributes: {
          computePower: Math.floor(blueprint.attributes.computePower * 1.5),
          empathyLevel: Math.floor(blueprint.attributes.empathyLevel * 1.5),
          governanceScore: Math.floor(blueprint.attributes.governanceScore * 1.5),
        },
      };
    }
    return blueprint;
  }
}
