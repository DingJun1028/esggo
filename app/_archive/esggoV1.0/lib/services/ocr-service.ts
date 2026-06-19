/**
 * OCR Service — Gemini Vision 單據擷取
 * 使用 BYOK Gemini API Key 對上傳圖片進行 OCR 並提取 ESG 相關數據
 */

export interface OcrExtractedItem {
    label: string;
    value: string;
    unit?: string;
    confidence: 'high' | 'medium' | 'low';
    suggestedField?: string;
    bbox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] for heatmap
}

export interface OcrResult {
    success: boolean;
    rawText: string;
    extractedItems: OcrExtractedItem[];
    suggestedChapter?: string;
    summary: string;
    chartStructure?: {
        type: 'bar' | 'line' | 'pie' | 'table';
        data: any[];
        insight: string;
    };
    error?: string;
}

/**
 * Convert file to base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Extract ESG data from an uploaded document image using Gemini Vision
 */
export async function extractDocumentData(
    file: File,
    chapterContext?: string
): Promise<OcrResult> {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            rawText: '',
            extractedItems: [],
            summary: 'API Key 未設定',
            error: 'MISSING_API_KEY',
        };
    }

    try {
        const base64 = await fileToBase64(file);
        // Strip MIME prefix for the API
        const mimeMatch = base64.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const imageData = base64.replace(/^data:[^;]+;base64,/, '');

        const prompt = `你是一位專業的 ESG 報告數據分析師，專門從企業文件中提取永續發展相關數據。

請對以下文件圖像進行 OCR 數據擷取，並以 JSON 格式回應。

${chapterContext ? `文件可能與章節「${chapterContext}」相關。` : ''}

請回傳以下格式的 JSON（不含 markdown 代碼塊包裝）：
{
  "rawText": "文件中的完整文字",
  "extractedItems": [
    {
      "label": "數據項目名稱",
      "value": "數值",
      "unit": "單位（若有）",
      "confidence": "high/medium/low",
      "suggestedField": "針對此數據的 GRI 指標建議",
      "bbox": [ymin, xmin, ymax, xmax] 
    }
  ],
  "chartStructure": {
    "type": "bar/line/pie/table",
    "data": [{"label": "A", "value": 10}, ...],
    "insight": "對此數據趨勢的專業解讀"
  },
  "suggestedChapter": "建議此數據對應的章節名稱",
  "summary": "一句話總結此文件的核心 ESG 數據"
}

請特別關注：溫室氣體排放量、能源消耗、用水量、員工人數、薪酬數據、廢棄物量、安全事故次數、訓練時數等 ESG 關鍵指標。
若發現圖表或表格，請務必在 chartStructure 中提取結構化數據以便進行二次可視化。`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: imageData,
                                }
                            },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: 'application/json',
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        let parsed: any = {};
        try {
            parsed = JSON.parse(text);
        } catch {
            // Try to extract JSON from text
            const jsonMatch = text.match(/\{[\s\S]+\}/);
            if (jsonMatch) {
                try { parsed = JSON.parse(jsonMatch[0]); } catch { }
            }
        }

        return {
            success: true,
            rawText: parsed.rawText || text,
            extractedItems: parsed.extractedItems || [],
            suggestedChapter: parsed.suggestedChapter,
            summary: parsed.summary || '已成功擷取文件數據。',
            chartStructure: parsed.chartStructure
        };
    } catch (error: any) {
        console.error('OCR extraction error:', error);
        return {
            success: false,
            rawText: '',
            extractedItems: [],
            summary: '擷取失敗',
            error: error?.message || 'UNKNOWN_ERROR',
        };
    }
}

/**
 * Format extracted items into text for insertion into editor
 */
export function formatOcrItemsForEditor(items: OcrExtractedItem[]): string {
    if (!items.length) return '';
    const lines = items.map(item => {
        const unitStr = item.unit ? ` ${item.unit}` : '';
        return `- **${item.label}**：${item.value}${unitStr}${item.suggestedField ? ` _(${item.suggestedField})_` : ''}`;
    });
    return `\n\n### 📋 OCR 擷取數據\n\n${lines.join('\n')}\n`;
}
