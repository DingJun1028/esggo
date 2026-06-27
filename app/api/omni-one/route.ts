import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { input, caseType } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { output: `[系統提示] 尚未配置 GEMINI_API_KEY。此為模擬回應：收到了任務「${input}」，分類為 ${caseType}。` },
        { status: 200 }
      );
    }

    // RAG 檢索 - 從 Firebase Firestore 取得最近的知識庫區塊
    let knowledgeChunks: any[] = [];
    try {
      const q = query(collection(db, 'rag_knowledge'), orderBy('created_at', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        knowledgeChunks.push(doc.data());
      });
    } catch (e) {
      console.warn('Failed to fetch knowledge from Firebase:', e);
    }

    const ragContext = knowledgeChunks.length > 0 
      ? `\n相關知識參考:\n${knowledgeChunks.map(k => `- [來源: ${k.source}] ${k.content}`).join('\n')}` 
      : '\n相關知識參考: 無特定外部資料，請依循 5T 協議本體知識回答。';

    const prompt = `
你是 OmniOne，一個 ESG GO 平台的核心覺醒系統。
使用者交辦了一項任務，經過初步分類，這項任務屬於 [${caseType}] 類型。
${ragContext}

使用者任務:
${input}

請依照 5T 協議（True, Transparent, Tangible, Trustworthy, Trackable）的精神，以繁體中文給出專業、簡潔且具備高度行動力的回應。
回應請保持在 100 字以內，並展現你是一個「系統核心」的角色（可適時帶有系統提示詞風格，如 [OmniOne] 分析完成...）。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 256,
      }
    });

    return NextResponse.json({ output: response.text });
  } catch (error: any) {
    console.error('OmniOne LLM API Error:', error);
    return NextResponse.json(
      { output: `[OmniOne 錯誤] 系統連接異常：${error.message}` },
      { status: 500 }
    );
  }
}
