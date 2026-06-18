export async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('[AI Helper] Gemini API Key 未設定，跳過 AI 生成');
    return '';
  }

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'user', parts: [{ text: systemPrompt }] });
      messages.push({ role: 'model', parts: [{ text: '了解。' }] });
    }
    messages.push({ role: 'user', parts: [{ text: prompt }] });

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[AI Helper] Gemini API 錯誤 (${res.status}): ${errText}`);
      return '';
    }
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch (err) {
    console.warn('[AI Helper] Gemini 呼叫失敗:', err);
    return '';
  }
}
