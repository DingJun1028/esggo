export interface ISupplierScore {
  id: string;
  name: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  emission_impact: number; // 0 to 1 (e.g., 0.2 means 20%)
  has_hash_lock: boolean;
  data_traceability: boolean;
}

export interface IStrategyResult {
  critical_action: string;
  optimization_path: string;
  compliance_alert: string;
}
