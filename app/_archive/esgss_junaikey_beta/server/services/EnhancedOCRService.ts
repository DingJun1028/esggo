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

interface ExtractedMetric {
  metricKey: string;
  category: 'E' | 'S' | 'G';
  numericValue?: number;
  textValue?: string;
  dateValue?: Date;
  unit?: string;
  confidenceScore?: number;
}

interface OCRResult {
  text: string;
  method: 'pdf-parse' | 'tesseract' | 'hybrid';
  textLength: number;
  processingTime: number;
}

export class EnhancedOCRService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is required for Enhanced OCR Service');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }

  /**
   * Dual-fallback OCR text extraction (from partner system)
   */
  async extractText(filePath: string): Promise<OCRResult> {
    const traceId = this.generateTraceId();
    const startTime = Date.now();

    omniLogger.info('OCR', 'Starting OCR extraction', {
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

        omniLogger.info('OCR', 'PDF text extracted successfully (digital-native)', {
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
      omniLogger.warn('OCR', 'PDF appears to be scanned or has no extractable text, falling back to OCR', {
        traceId,
      });

      const {
        data: { text },
      } = await Tesseract.recognize(filePath, 'eng+chi_tra', {
        logger: m => {
          if (m.status === 'recognizing text') {
            omniLogger.debug('OCR', 'OCR progress', {
              traceId,
              progress: `${Math.round(m.progress * 100)}%`,
            });
          }
        },
      });

      const processingTime = Date.now() - startTime;

      omniLogger.info('OCR', 'OCR extraction complete (scanned document)', {
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

      omniLogger.error('OCR', 'OCR extraction failed', {
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
  async extractMetrics(
    text: string,
    documentType: string,
    onProgress?: (stage: string, percentage: number) => void
  ): Promise<{ metrics: ExtractedMetric[]; frameworks: string[] }> {
    const traceId = this.generateTraceId();
    const startTime = Date.now();

    onProgress?.('AI_ANALYSIS', 50);

    omniLogger.info('OCR', 'Starting AI metric extraction', {
      traceId,
      documentType,
      textLength: text.length,
      source: 'EnhancedOCRService.extractMetrics',
    });

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash', // Using 1.5-flash for stability as 2.0-flash-exp might be unstable
      });

      const prompt = this.buildExtractionPrompt(text, documentType);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

      if (!jsonMatch) {
        omniLogger.warn('OCR', 'No JSON found in AI response', {
          traceId,
          responseText,
        });
        return { metrics: [], frameworks: [] };
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);
      const extracted: ExtractedMetric[] = Array.isArray(parsed) ? parsed : (parsed.metrics || []);
      const frameworks: string[] = parsed.frameworks || [];

      const processingTime = Date.now() - startTime;

      omniLogger.info('OCR', 'AI metric extraction complete', {
        traceId,
        count: extracted.length,
        frameworks,
        processingTime,
      });

      return { metrics: extracted, frameworks };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      omniLogger.error('OCR', 'AI metric extraction failed', {
        traceId,
        error: error instanceof Error ? error.message : String(error),
        processingTime,
      });

      return { metrics: [], frameworks: [] };
    }
  }

  /**
   * Build AI extraction prompt
   */
  private buildExtractionPrompt(text: string, documentType: string): string {
    return `
You are a professional ESG data analyst. Extract all relevant ESG metrics and identify the ESG reporting framework used in the following document.

Document Type: ${documentType}
Document Text:
${text}

Please return a JSON object with the following structure:
{
  "metrics": [
    {
      "metricKey": "string (e.g., 'electricity_usage')",
      "category": "E" | "S" | "G",
      "numericValue": number,
      "textValue": "string",
      "dateValue": "ISO date",
      "unit": "string",
      "confidenceScore": number (0-1)
    }
  ],
  "frameworks": ["string (e.g., 'GRI', 'SASB', 'TCFD', 'ISSB')"]
}

Guidelines:
1. Identify frameworks based on explicit mentions or specific indicator codes (e.g., GRI 302-1, SASB RR-WT-130a.1).
2. Return ONLY the JSON object, no additional explanation.
    `.trim();
  }

  /**
   * Calculate data hash for 4T Protocol (Calculable)
   */
  calculateHash(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Generate trace ID for 4T Protocol (Traceable)
   */
  private generateTraceId(): string {
    return crypto.randomUUID();
  }
}

export default EnhancedOCRService;
