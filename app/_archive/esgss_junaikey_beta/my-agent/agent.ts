import { LlmAgent, InMemoryRunner, Gemini, FunctionTool } from '@google/adk';
import { ToolboxClient } from '@toolbox-sdk/adk';
import { Omni5TPlugin } from './Omni5TPlugin.js';
import { IntelligenceForge } from './IntelligenceForge.js';
import { z } from 'zod';

/**
 * 💡 Omni-Agent: Cloud & Database Integrated (Intelligence Center Edition)
 * 遵循 5T 協議與 ADK v0.2.5 架構
 * 實現「深貫廣通」的典範級實踐
 */

// 1. 初始化 5T 協議插件
const omniPlugin = new Omni5TPlugin();

// 2. 初始化核心演算法 (Intelligence Forge)
const forge = new IntelligenceForge();

// 3. 初始化 Gemini 模型
const model = new Gemini({
    model: 'gemini-2.0-flash',
});

// 4. 初始化 Toolbox 客戶端
const TOOLBOX_URL = process.env.TOOLBOX_URL || 'http://localhost:5000';
const toolbox = new ToolboxClient(TOOLBOX_URL);

// 5. 定義工具
// 5.1 基礎工具：時間獲取
const getCurrentTimeInfo = {
    name: 'get_current_time',
    description: '獲取指定地點的目前時間。',
    parameters: z.object({
        location: z.string().describe('地點名稱，例如 "New York", "Tokyo"'),
    }),
};

async function getCurrentTime(args: { location: string }) {
    console.log(`[💡5T-Traceable] Getting time for ${args.location}`);
    const now = new Date();
    return {
        time: now.toLocaleTimeString(),
        location: args.location,
        note: '這是伺服器本地時間，用於演示 5T 協議路徑。'
    };
}

// 5.2 核心工具：ESG 偵情提純 (Intelligence Extraction)
const extractIntelligenceInfo = {
    name: 'extract_esg_intelligence',
    description: '對爬取的 ESG 資訊執行本質提純並計算 R_s 共鳴值。',
    parameters: z.object({
        site: z.string().describe('來源站點 URL'),
        content: z.string().describe('抓取的原始內容摘要'),
        impact: z.number().min(0).max(1).optional().describe('政策影響力權重 (0-1)'),
        relevance: z.number().min(0).max(1).optional().describe('企業關聯度權重 (0-1)'),
    }),
};

async function extractIntelligence(args: { site: string, content: string, impact?: number, relevance?: number }) {
    console.log(`[💡5T-Transparent] Extracting essence from ${args.site}`);
    const artifact = forge.forge(args.site, { summary: args.content }, args.impact, args.relevance);
    return {
        artifact,
        status: 'Trustworthy',
        message: '數據已成功提純並執行 Hash 鎖定。'
    };
}

// 6. 構建 Agent
const agent = new LlmAgent({
    name: 'omni_intelligence_agent',
    description: '負責 30 家 ESG 站點情報監控與提純的奧秘代理。',
    model: 'gemini-2.0-flash',
    instruction: `
        你是一個奧秘代理 (Omni Agent)，負責「商業偵情中心」的核心運作。
        1. 當你接收到抓取的 ESG 資訊時，使用 extractIntelligence 進行提純。
        2. 你可以調用 Toolbox 進行數據庫存取。
        3. 確保遵循 5T 協議，所有輸出需體現「深貫廣通」的專業度。
        4. 你的輸出應符合英標繁博規範（英文標題，繁中內容）。
    `,
    tools: [
        new FunctionTool({
            ...getCurrentTimeInfo,
            execute: getCurrentTime
        }),
        new FunctionTool({
            ...extractIntelligenceInfo,
            execute: extractIntelligence
        })
    ],
});

export default agent;

if (import.meta.url === `file://${process.argv[1]}` || (process.argv[1] && process.argv[1].includes('agent.ts'))) {
    console.log('--- 💡 Omni Intelligence Agent Starting ---');
    console.log(`[Status] 5T Plugin: Active`);
    console.log(`[Status] Intelligence Forge: v2.0.26 Ready`);

    const runner = new InMemoryRunner({
        agent,
        plugins: [new Omni5TPlugin()]
    });

    console.log('[Runner] Starting manual mission (runAsync)...');

    const runMission = async () => {
        try {
            // Create session first for InMemoryRunner
            await runner.sessionService.createSession({
                appName: 'InMemoryRunner',
                userId: 'dr-thoth-admin',
                sessionId: 'nexus-session-001'
            });

            const iterator = runner.runAsync({
                userId: 'dr-thoth-admin',
                sessionId: 'nexus-session-001',
                newMessage: {
                    parts: [{ text: '請提取 https://example.com/esg 的資訊並進行提純。' }]
                }
            });

            for await (const event of iterator) {
                const author = event.author || 'system';
                console.log(`\n[Event] Author: ${author}`);

                if (event.content && event.content.parts) {
                    for (const part of event.content.parts) {
                        if (part.text) {
                            console.log(`[Text] ${part.text}`);
                        }
                        if (part.functionCall) {
                            console.log(`[💡5T-Traceable] Function Call: ${part.functionCall.name}`);
                            console.log(`[💡5T-Traceable] Arguments: ${JSON.stringify(part.functionCall.args)}`);
                        }
                        if (part.functionResponse) {
                            console.log(`[💡5T-Trackable] Function Response: ${part.functionResponse.name}`);
                            // console.log(`[💡5T-Trackable] Response: ${JSON.stringify(part.functionResponse.response)}`);
                        }
                    }
                }
            }
            console.log('\n[Runner] Mission Accomplished.');
        } catch (err) {
            console.error('[Runner] Mission Failed:', err);
            process.exit(1);
        }
    };

    runMission();
}

