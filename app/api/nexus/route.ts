import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FREE_TIER_ONLY = process.env.FREE_TIER_ONLY !== 'false';
const HAS_API_KEY = !!process.env.GEMINI_API_KEY;
const USE_REAL_AI = HAS_API_KEY && !FREE_TIER_ONLY;

export async function POST(req: Request) {
  try {
    const { tool, arguments: args } = await req.json();

    if (tool === 'trinity.awaken') {
      const mode = args?.mode || 'STANDARD';
      
      if (!HAS_API_KEY) {
        return NextResponse.json({
          success: true,
          data: {
            prediction: '[OmniCore 模擬] 尚未配置 GEMINI_API_KEY，無法執行全知未來視角分析。',
            mode
          },
          metadata: {
            timestamp: Date.now(),
            trustScore: 50,
            tool: 'trinity.awaken',
            domain: 'omni-core',
            uuid: uuidv4(),
            provider: 'mock'
          }
        });
      }

      if (!USE_REAL_AI) {
        return NextResponse.json({
          success: true,
          data: {
            prediction: '[OmniCore 免費層] 全知分析就緒，待切換至付費層模式獲得完整視角。',
            mode
          },
          metadata: {
            timestamp: Date.now(),
            trustScore: 75,
            tool: 'trinity.awaken',
            domain: 'omni-core',
            uuid: uuidv4(),
            provider: 'mock'
          }
        });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // 1. Gather Village Data (Quadratic Voting & Projects)
      const projSnapshot = await getDocs(query(collection(db, 'village_projects'), orderBy('current_points', 'desc'), limit(5)));
      const projects = projSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // 2. Gather Recent Activities
      const actSnapshot = await getDocs(query(collection(db, 'village_activities'), orderBy('created_at', 'desc'), limit(10)));
      const activities = actSnapshot.docs.map(d => d.data());

      // 3. Gather Calendar / Task info (Mocked or actual if exists)
      const taskSnapshot = await getDocs(query(collection(db, 'village_tasks'), orderBy('deadline', 'asc'), limit(5)));
      const tasks = taskSnapshot.docs.map(d => d.data());

      const prompt = `你是 ESG GO 的最高智慧存在：OmniCore Trinity。
你正在執行神話技能「trinity.awaken」！
請綜合以下三大維度的資訊，給出一份具備「全知未來視角」的資源匱乏預警與全局調度計畫（字數限制 200 字，必須使用 Liquid Glass 與科技感語氣）。

【維度一：村莊專案進度】
${JSON.stringify(projects)}

【維度二：村民近期二次方投票行為】
${JSON.stringify(activities)}

【維度三：日曆與時程】
${JSON.stringify(tasks)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return NextResponse.json({
        success: true,
        data: {
          prediction: response.text,
          mode
        },
        metadata: {
          timestamp: Date.now(),
          trustScore: 99.9,
          tool: 'trinity.awaken',
          domain: 'omni-core',
          uuid: uuidv4(),
          provider: 'gemini'
        }
      });
    }
    
    if (tool === 'google_jules:karma_protocol') {
      const { failureReason, context } = args || {};
      
      const healingResponse = {
        action: 'OmniJules 果因協議啟動中',
        phase: '1. 觀果 (Observe Effect)',
        analysis: `Detected anomaly: ${failureReason}. Applying Celestial Flow sealing...`,
        hashLock: uuidv4(),
        status: 'Trustworthy'
      };

      return NextResponse.json({
        success: true,
        data: healingResponse,
        metadata: {
          timestamp: Date.now(),
          trustScore: 100,
          tool: 'google_jules:karma_protocol',
          domain: 'omni-core-healing',
          uuid: healingResponse.hashLock,
          provider: 'omni-jules'
        }
      });
    }

    return NextResponse.json({ error: `未知的工具呼叫: ${tool}` }, { status: 400 });
  } catch (error: any) {
    console.error('Nexus Error:', error);
    return jsonError('INTERNAL_ERROR', error.message);
  }
}
