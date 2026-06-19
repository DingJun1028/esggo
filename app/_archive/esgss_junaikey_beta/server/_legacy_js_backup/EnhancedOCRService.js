/**
 * Enhanced OCR Service
 *
 * Integrates partner system's dual-fallback OCR mechanism with our AI enhancement:
 * 1. Primary: pdf-parse for digital-native PDFs
 * 2. Fallback: tesseract.js for scanned documents
 * 3. Enhancement: Gemini 2.0 for multi-metric extraction
 * 4. Integration: 4T Protocol logging and tracing
 */
import fs from 'fs';
// @ts-ignore
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { omniLogger } from './omni/infrastructure/logging/OmniLogger.js';
export class EnhancedOCRService {
  genAI;
  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is required for Enhanced OCR Service');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }
  /**
   * Dual-fallback OCR text extraction (from partner system)
   */
  async extractText(filePath) {
    const traceId = this.generateTraceId();
    const startTime = Date.now();
    omniLogger.info('Starting OCR extraction', {
      traceId,
      filePath,
      source: 'EnhancedOCRService.extractText',
    });
    try {
      // Step 1: Try digital-native PDF extraction (fast)
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      if (pdfData.text && pdfData.text.trim().length > 0) {
        const processingTime = Date.now() - startTime;
        omniLogger.info('PDF text extracted successfully (digital-native)', {
          traceId,
          textLength: pdfData.text.length,
          processingTime,
          method: 'pdf-parse',
        });
        return {
          text: pdfData.text,
          method: 'pdf-parse',
          textLength: pdfData.text.length,
          processingTime,
        };
      }
      // Step 2: Fallback to OCR for scanned documents (slower but comprehensive)
      omniLogger.warn('PDF appears to be scanned or has no extractable text, falling back to OCR', {
        traceId,
      });
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, 'eng+chi_tra', {
        logger: m => {
          if (m.status === 'recognizing text') {
            omniLogger.debug('OCR progress', {
              traceId,
              progress: `${Math.round(m.progress * 100)}%`,
            });
          }
        },
      });
      const processingTime = Date.now() - startTime;
      omniLogger.info('OCR extraction complete (scanned document)', {
        traceId,
        textLength: text.length,
        processingTime,
        method: 'tesseract',
      });
      return {
        text,
        method: 'tesseract',
        textLength: text.length,
        processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      omniLogger.error('OCR extraction failed', {
        traceId,
        error: error instanceof Error ? error.message : String(error),
        processingTime,
      });
      throw new Error(
        `Failed to extract text from document: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * AI multi-metric extraction (fusion of both systems)
   *
   * Partner system: Multi-metric extraction in array format
   * Our system: Enhanced with Gemini 2.0 Flash
   */
  async extractMetrics(text, documentType) {
    const traceId = this.generateTraceId();
    const startTime = Date.now();
    omniLogger.info('Starting AI metric extraction', {
      traceId,
      documentType,
      textLength: text.length,
      source: 'EnhancedOCRService.extractMetrics',
    });
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });
      const prompt = this.buildExtractionPrompt(text, documentType);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        omniLogger.warn('No JSON found in AI response', {
          traceId,
          responseText,
        });
        return [];
      }
      const jsonText = jsonMatch[1] || jsonMatch[0];
      const extracted = JSON.parse(jsonText);
      const processingTime = Date.now() - startTime;
      omniLogger.info('AI metric extraction complete', {
        traceId,
        count: extracted.length,
        metrics: extracted.map(m => m.metricKey),
        processingTime,
      });
      return extracted;
    } catch (error) {
      const processingTime = Date.now() - startTime;
      omniLogger.error('AI metric extraction failed', {
        traceId,
        error: error instanceof Error ? error.message : String(error),
        processingTime,
      });
      // Return empty array instead of throwing, to allow manual entry
      return [];
    }
  }
  /**
   * Build AI extraction prompt
   */
  buildExtractionPrompt(text, documentType) {
    return `
You are a professional ESG data analyst. Extract all relevant ESG metrics from the following document.

Document Type: ${documentType}
Document Text:
${text}

Please return a JSON array of metrics. Each metric should include:
- metricKey: string (e.g., "electricity_usage", "employee_training_hours", "board_meeting_date")
- category: "E" | "S" | "G" (Environmental, Social, or Governance)
- numericValue: number (if applicable)
- textValue: string (if applicable)
- dateValue: string in ISO format (if applicable)
- unit: string (e.g., "kWh", "hours", "USD")
- confidenceScore: number between 0 and 1 (your confidence in this extraction)

Examples:
[
  {
    "metricKey": "electricity_usage",
    "category": "E",
    "numericValue": 12500,
    "unit": "kWh",
    "confidenceScore": 0.95
  },
  {
    "metricKey": "employee_name",
    "category": "S",
    "textValue": "John Doe",
    "confidenceScore": 0.98
  },
  {
    "metricKey": "board_meeting_date",
    "category": "G",
    "dateValue": "2026-01-15",
    "confidenceScore": 0.92
  }
]

Return ONLY the JSON array, no additional explanation.
    `.trim();
  }
  /**
   * Calculate data hash for 4T Protocol (Calculable)
   */
  calculateHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }
  /**
   * Generate trace ID for 4T Protocol (Traceable)
   */
  generateTraceId() {
    return crypto.randomUUID();
  }
}
export default EnhancedOCRService;
