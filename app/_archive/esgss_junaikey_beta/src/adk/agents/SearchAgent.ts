import { LlmAgent } from '@google/adk';
import { webSearchTool } from '../tools/WebSearchTool';

/**
 * Search Agent
 * An ADK agent capable of searching the web and synthesizing information.
 */
export const searchAgent = new LlmAgent({
    name: 'search_agent',
    model: 'gemini-2.0-flash',
    description: '一個使用網頁搜尋來精確回答問題的研究助手。',
    instruction: `
    您是 JunAiKey ESG 生態系統中的一名專業研究助手。
    您的主要目標是提供準確且具有背景脈絡的信息。
    
    當用戶提問時：
    1. 如果信息需要最近的數據或外部知識，請使用 'web_search' 工具。
    2. 將搜尋結果綜合成簡明扼要的中文回答。
    3. 始終保持專業、有幫助且富有洞察力的語氣。
    4. 如果相關，將信息與 ESG 或永續發展聯繫起來。
    5. 請使用繁體中文（Traditional Chinese）進行回覆。
  `,
    tools: [webSearchTool],
});
