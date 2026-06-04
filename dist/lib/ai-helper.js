export async function callGemini(prompt, systemPrompt) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey)
        return "";
    try {
        const messages = [];
        if (systemPrompt) {
            messages.push({ role: 'user', parts: [{ text: systemPrompt }] });
            messages.push({ role: 'model', parts: [{ text: '了解。' }] });
        }
        messages.push({ role: 'user', parts: [{ text: prompt }] });
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: messages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                },
            }),
        });
        if (!res.ok)
            throw new Error('Gemini error');
        const json = await res.json();
        return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
    catch (err) {
        console.warn('[AI Helper] Error:', err);
        return "";
    }
}
//# sourceMappingURL=ai-helper.js.map