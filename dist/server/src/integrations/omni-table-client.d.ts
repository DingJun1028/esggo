export interface LogicNode {
    name: string;
    compliance_score: number;
    logic_type: string;
    timestamp: string | Date;
    targetSystem: string;
    source_origin?: string;
}
export declare function syncLogicNodesToOmniTable(nodes: LogicNode[]): Promise<boolean>;
//# sourceMappingURL=omni-table-client.d.ts.map