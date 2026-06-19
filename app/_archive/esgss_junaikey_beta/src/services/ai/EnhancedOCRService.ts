import Tesseract from 'tesseract.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExtractedMetric {
  metricKey: string;
  category: 'E' | 'S' | 'G';
  numericValue?: number;
  textValue?: string;
  dateValue?: Date;
  unit?: string;
  confidence: number;
}

/**
 * 🔍 Enhanced OCR Service: The Intelligent Scribe
 * --------------------------------------------------
 * This service transforms unstructured documents (PDFs, Images) into 5T-compliant ESG data.
 * It uses a multi-stage pipeline:
 * 1. Native Extraction (Fastest) - Currently mocked
 * 2. Tesseract OCR (Fallback for Scanned Docs)
 * 3. Gemini Vision/Context (Structuring & Reasoning)
 */
export class EnhancedOCRService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey || 'MOCK_KEY');
  }

  /**
   * 🏗️ Extract text from a document
   * (Simplified mock for browser environment)
   */
  public async extractText(file: File | string): Promise<string> {
    omniLogger.info(LogCategory.SYSTEM, '[EnhancedOCRService] 🔍 [EnhancedOCR] Extracting text from document...');

    // In a real Node environment, we'd use pdf-parse here for PDFs.
    // For the demo, we support Tesseract for images/scans.
    if (typeof file !== 'string' && file.type.startsWith('image/')) {
      const result = await Tesseract.recognize(file, 'eng+chi_tra');
      return result.data.text;
    }

    return 'Successfully extracted text (Simulated PDF content for Carbon Emission Report 2026).';
  }

  /**
   * 🧠 AI Structured Extraction & Cleaning
   * Uses Gemini to find specific ESG metrics and format the text into clean, bilingual-ready paragraphs.
   */
  public async extractMetrics(text: string, documentType: string): Promise<ExtractedMetric[]> {
    omniLogger.info(LogCategory.SYSTEM, '[EnhancedOCRService] Info', { data: `🧠 [EnhancedOCR] AI structured extraction for: ${documentType}` });

    // 🧪 Test/Mock Mode
    if (this.genAI.apiKey === 'MOCK_KEY') {
      omniLogger.info(LogCategory.SYSTEM, '[EnhancedOCR] Using Mock AI Metrics.');
      return [
        { metricKey: 'carbon_emission', category: 'E', numericValue: 450.5, unit: 'tCO2e', confidence: 0.95 },
        { metricKey: 'renewable_energy', category: 'E', numericValue: 25, unit: '%', confidence: 0.88 },
        { metricKey: 'employee_training', category: 'S', numericValue: 1200, unit: 'hours', confidence: 0.92 }
      ];
    }

    const prompt = `
      Analyze the following raw text extracted from an ESG document.
      ...
    `;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{.*\}|\[.*\]/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const metrics = parsed.metrics || (Array.isArray(parsed) ? parsed : []);
        return metrics.map((m: any) => ({
          ...m,
          confidence: m.confidence || 0.7 // Default confidence for AI extractions
        }));
      }
      return [];
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[EnhancedOCR] AI structuring failed', { error });
      return [{ metricKey: 'system_fallback', category: 'E', numericValue: 0, unit: 'N/A', confidence: 0 }];
    }
  }

  /**
   * 🧽 Clean and format text into structured paragraphs
   */
  public async cleanText(text: string): Promise<string> {
    if (this.genAI.apiKey === 'MOCK_KEY') {
      return `[MOCK 結構化輸出]\n\n根據採集到的原始文本，${text.substring(0, 50)}...\n\n該文件內容已由 JunAiKey 奧秘採集器自動清洗並格式化為標準 ESG 知識段落。`;
    }

    const prompt = `
        Clean and format the following raw OCR text into professional, structured paragraphs in Traditional Chinese.
        ...
      `;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      return text.split('\n').filter(line => line.length > 10).join('\n\n');
    }
  }
}
