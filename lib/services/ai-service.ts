export const getGeminiResponse = async (prompt: string) => {
  if (!prompt.trim()) {
    return '請提供要分析的內容。';
  }

  return 'AI 引擎目前以離線模式執行，請完成 Gemini API 設定後再啟用即時生成。';
};

export const analyzeGreenwashing = async (content: string) => {
  if (!content.trim()) {
    return '缺少可分析內容。';
  }

  return '目前為離線分析模式：請補齊可驗證數據、揭露範圍與佐證來源，以降低漂綠風險。';
};
