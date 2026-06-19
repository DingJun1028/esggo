import { FunctionTool } from '@google/adk';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { z } from 'zod';

/**
 * Web Search Tool
 * Simulated search tool for the ADK Lab.
 */
export const webSearchTool = new FunctionTool({
    name: 'web_search',
    description: 'Searches the web for information on a given topic.',
    parameters: z.object({
        query: z.string().describe('The search query or topic to look for.'),
    }),
    execute: async ({ query }) => {
        omniLogger.info(LogCategory.SYSTEM, '[WebSearchTool] Info', { data: `🔍 Searching for: "${query}"...` });

        // Simulated results based on query keywords
        const lowerQuery = query.toLowerCase();
        let results = '';

        if (lowerQuery.includes('esg')) {
            results = `
        1. ESG 準則：環境、社會和治理準則是衡量企業營運的一套標準...
        2. 2024 年 ESG 的演進：投資者越來越關注透明的報告和數據完整性...
        3. 十大 ESG 趨勢：永續報告的數位化和 AI 驅動分析是關鍵趨勢。
      `;
        } else if (lowerQuery.includes('adk') || lowerQuery.includes('agent')) {
            results = `
        1. Google ADK (代理開發工具包)：一個用於構建具有工具調用能力的強大 AI 代理的框架。
        2. Agent-to-Agent (A2A) 協議：不同 AI 代理之間進行通信和協作的標準化方式。
        3. ADK 入門：定義工具、代理和工作流，以自動化複雜的研究任務。
      `;
        } else {
            results = `
        1. 關於 "${query}" 的一般結果：找到了一些相關的文章和文檔頁面。
        2. "${query}" 的分析：最近的趨勢顯示關於此主題的討論有所增加。
        3. 資源指南：在現代技術景觀中理解 "${query}" 的綜合指南。
      `;
        }

        return {
            status: 'success',
            query,
            results,
            timestamp: new Date().toISOString()
        };
    },
});
