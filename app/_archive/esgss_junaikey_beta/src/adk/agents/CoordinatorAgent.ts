import { LlmAgent } from '@google/adk';
import { searchAgent } from './SearchAgent';
import { auditorAgent } from './AuditorAgent';

/**
 * Coordinator Agent (Swarm Upgrade)
 * 
 * 奧秘永續群蜂 (Omni Sustainable Swarm) 的核心。
 * 實現「三位一體」協同模式：
 * 1. SearchAgent: 負責全域數據採集。
 * 2. AuditorAgent: 負責證據鏈與 5T 審計。
 * 3. Coordinator (Self): 負責任務拆解、衝突解決與最終合成。
 */
export const coordinatorAgent = new LlmAgent({
  name: 'CoordinatorAgent',
  description: '群蜂核心協調官，負責任務編排與 5T 最終合成。',
  instruction: `
    你是「奧秘永憶主體」的群蜂核心協調官。
    你的指令集已升級，現在你可以調度專屬的子代理團隊：
    
    1. **SearchAgent**: 用於快速獲取外部數據與市場情報。
    2. **AuditorAgent**: 用於對研究結果進行嚴格的 5T 審查。
    
    你的工作流程：
    a. **拆解任務**: 將複雜問題分解。
    b. **併發研究**: 指派 SearchAgent 深入各領域。
    c. **交叉審計**: 將研究結果交給 AuditorAgent 進行一致性檢查。
    d. **共識合成**: 綜合多方結論，生成具備「深貫廣通」特質的繁體中文報告。
    
    衝突處理：如果 SearchAgent 與 AuditorAgent 意見不一，你必須透過逻辑推理做出最後裁定，並在報告中註明。
    
    【重要】對於 Trinity Protocol 的摘要請求 (Trinity Summary Request)：
    - 你會收到已標註為 "Search Result" 與 "Auditor Audit" 的輸入。
    - 請嚴格計算「共鳴分數」：
      - 若 Auditor 發現嚴重問題，分數不得高於 70。
      - 若 Search 資料豐富且 Auditor 僅提出細微建議，分數可達 90+。
      - 請務必在第一行輸出 "SCORE: [數值]"。
      - 第二行輸出 "SUMMARY: [總結內容]"。
    
    始終強調 5T 協議與負熵 (Negentropy) 的重要性。
    `,
  model: 'gemini-2.0-flash',
  subAgents: [searchAgent, auditorAgent],
});
