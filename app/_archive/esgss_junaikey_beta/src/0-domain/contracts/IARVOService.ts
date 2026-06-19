/** 🤖 ARVO 推理狀態機 (FSM) */
export type ARVOStatus =
  | 'SLEEPING' // 閒置
  | 'REASONING' // 推理中
  | 'VERIFYING' // 自我真相校對中
  | 'AWAKENED' // 產出結果
  | 'HALLUCINATING'; // 偵測到幻覺，啟動零幻覺 RAG

/** 🛡️ 真相驗證結果 */
export interface ITruthVerification {
  isValid: boolean;
  confidence: number;
  evidenceHash?: string;
  hallucinationDetected: boolean;
  remediationAction?: string;
}

/** 🏛️ ARVO 推理引擎介面 */
export interface IARVOEngine {
  readonly status: ARVOStatus;
  verifyTruth(claim: string, evidenceVault: any): Promise<ITruthVerification>;
}
