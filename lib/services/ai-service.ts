import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const getGeminiResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "AI \u5f15\u64ce\u76ee\u524d\u7121\u6cd5回應，請檢查 API 金鑰配置。";
  }
};

export const analyzeGreenwashing = async (content: string) => {
  const prompt = `
    \u4f5c\u70ba ESG \u5be9\u8a08\u5c08\u5bb6\uff0c\u8acb\u5206\u6790\u4ee5\u4e0b\u6c38\u7e8c\u5831\u544a\u5167\u5bb9\u662f\u5426\u5b58\u5728\u300c\u7da0\u6f02 (Greenwashing)\u300d\u98a8\u96aa\u3002
    \u8acb\u6839\u64da GRI \u6a19\u6e96\u8207\u5be6\u8b49\u53ef\u8ffd\u8e64\u6027\u8a55\u5206 (0-100)\uff0c\u4e26\u63d0\u4f9b\u6539\u9032\u5efa\u8b70\u3002
    \u5167\u5bb9\uff1a${content}
  `;
  return getGeminiResponse(prompt);
};