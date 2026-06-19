import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Language, McpRunActionOutput } from '@/types';
import { logKernelEvent, omniLogger, LogCategory } from '@infra/logging/OmniLogger';

const checkRateLimit = async () => {
  // Rate limit implementation placeholder
  await new Promise(resolve => setTimeout(resolve, 50));
};

const safeErrorString = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions,
  retries: number,
  timeout: number,
  onRetry: (attempt: number, err: Error, delay: number) => void
): Promise<unknown> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);

      if (!res.ok) {
        // Retry on 408 (Timeout), 429 (Rate Limit), or 5xx (Server Error)
        const isRetryable = res.status === 408 || res.status === 429 || res.status >= 500;

        if (!isRetryable) {
          const errorText = await res.text().catch(() => '');
          const error = new Error(
            `HTTP ${res.status} ${res.statusText}${errorText ? `: ${errorText.substring(0, 100)}` : ''}`
          );
          (error as any).isFatal = true;
          throw error;
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
      // Try parsing as JSON even if content-type is missing, fallback to text object
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { response: text };
      }
    } catch (e) {
      const error = e as Error & { isFatal?: boolean };
      if (error.isFatal) throw error;

      if (i === retries) {
        if (error.name === 'AbortError') {
          throw new Error(`Connection timed out after ${timeout}ms`);
        }
        throw error;
      }

      const delay = 1000 * Math.pow(2, i);
      onRetry(i + 1, error, delay);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  // 如果所有重試都失敗,返回空對象
  return {};
}

export async function runMcpAction(
  action: string,
  inputParams: Record<string, unknown>,
  language: Language,
  onLog?: (msg: string, type: 'info' | 'warning' | 'error' | 'success') => void
): Promise<McpRunActionOutput> {
  logKernelEvent('MCP', 'ACTION_START', 'INFO', { action, params: inputParams });

  try {
    await checkRateLimit();
    const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
    const ai = new GoogleGenAI(options);
    const isZh = language === 'zh-TW';

    if (action === 'api_call') {
      const method = ((inputParams.method as string) || 'GET').toUpperCase();
      const url = inputParams.url as string;
      if (!url) throw new Error('Missing target URL for API handshake.');

      omniLogger.info(
        LogCategory.INTEGRATION,
        `[NEXUS] Initiating remote handshake: ${method} ${url}`
      );
      onLog?.(`[NEXUS] Initiating remote handshake: ${method} ${url}`, 'info');

      try {
        const result = await fetchWithRetry(
          url,
          {
            method,
            headers: (inputParams.headers as Record<string, string>) || {
              'Content-Type': 'application/json',
            },
            body: inputParams.body ? JSON.stringify(inputParams.body) : undefined,
          },
          3,
          15000,
          (attempt, err, delay) => {
            const msg = err.name === 'AbortError' ? 'Timeout' : err.message;
            onLog?.(
              isZh
                ? `[重試] 第 ${attempt} 次 (${msg}) - 等待 ${delay}ms`
                : `[RETRY] Attempt ${attempt} (${msg}) - Waiting ${delay}ms`,
              'warning'
            );
          }
        );

        onLog?.(`[NEXUS] Handshake successful. Status 200 OK.`, 'success');
        return { success: true, result, error: null };
      } catch (e: any) {
        const errorMsg = e.message || 'Unknown Network Error';
        omniLogger.error(LogCategory.INTEGRATION, `[NEXUS] Connection Failed: ${errorMsg}`, {
          error: e,
        });
        onLog?.(`[NEXUS] Connection Failed: ${errorMsg}`, 'error');
        throw e;
      }
    }

    if (action === 'execute_js_code') {
      onLog?.(`[KERNEL] Compiling dynamic logic shard...`, 'info');
      try {
        const { code, params } = inputParams;
        const func = new Function(
          'params',
          `
                  "use strict";
                  try {
                      ${code}
                  } catch (e) {
                      throw new Error("Runtime Error: " + e.message);
                  }
              `
        );

        const executionStart = performance.now();
        const result = func(params);
        const duration = (performance.now() - executionStart).toFixed(2);

        onLog?.(`[KERNEL] Logic executed in ${duration}ms`, 'success');

        const resultObj = typeof result === 'object' ? result : { output: result };

        logKernelEvent('MCP', 'ACTION_SUCCESS', 'SUCCESS', { action, result: resultObj });
        return { success: true, result: resultObj, error: null };
      } catch (e: any) {
        omniLogger.error(LogCategory.AI, `Script Execution Failed`, { error: e });
        throw new Error(`Script Execution Failed: ${e.message}`);
      }
    }

    const promptMap: Record<string, string> = {
      web_scraping: `Parse and extract corporate ESG metrics from ${inputParams.url}. Format: ${inputParams.format}. Output JSON.`,
      supplier_carbon_audit: `Generate a formal ESG audit email for ${inputParams.supplierName} regarding ${inputParams.standard}. Output JSON with email_body field.`,
      perform_entropy_transmutation: `Analyze technical debt shards and optimize system vitals: ${JSON.stringify(inputParams.vitals)}. Output strict JSON with optimizationDirective. Ensure numbers are standard JSON (no plus signs).`,
      forge_financial_certificate: `Calculate green interest discount for ESG performance: ${JSON.stringify(inputParams.esgMetrics)}. Output JSON.`,
      list_carbon_credits: `Manifest tradable carbon credits for ${inputParams.verifiedReduction} tCO2e. Output JSON.`,
      perform_deep_doc_analysis: `Identify layouts and tables in the following query: ${inputParams.query}. Output JSON.`,
      compliance_gap_analysis: `Identify GRI compliance gaps for ${inputParams.projectName} against ${inputParams.standard}. Output JSON.`,
      perform_architecture_audit: `Run defensive architecture unit tests for v16.1. Output JSON with tests array.`,
      weekly_insight_manifestation: `Synthesize weekly strategic highlights from ${JSON.stringify(inputParams.weeklyStats)}. Output JSON.`,
      board_report_grand_manifestation: `Manifest grand executive board report from ${JSON.stringify(inputParams.annualMetrics)}. Output JSON.`,
      carbon_reduction_calculation: `Calculate carbon reduction potential for usage ${inputParams.currentUsage} against baseline ${inputParams.baseline}. Output JSON.`,
      perform_incident_investigation: `Investigate anomaly "${inputParams.anomalyType}" for entity "${inputParams.targetEntity}". Output JSON.`,
      verify_data_purity: `Analyze document purity and clarity for OCR. Output JSON.`,
      perform_collective_benchmarking: `Compare tenant efficiency ${(inputParams.currentTenant as { efficiency?: number })?.efficiency} against industry peers. Output JSON with roadmap.`,
      perform_flowlu_field_mapping: `Map Flowlu CRM fields for ESG module ${inputParams.module}. Output JSON.`,
      extract_text_from_file: `Perform OCR text extraction on the file at ${inputParams.fileUrl}. Identify document type (PDF, Image, etc.). Return JSON with 'extracted_text' field containing the raw text content.`,
      dispatch_supplier_survey: `Generate supplier survey distribution plan for ${inputParams.supplierName}. Output JSON.`,
    };

    const prompt = promptMap[action];
    if (!prompt) {
      logKernelEvent('MCP', 'ACTION_NOT_FOUND', 'ERROR', { action });
      return { success: false, result: null, error: `Action '${action}' not implemented.` };
    }

    onLog?.(
      isZh ? `[系統] 執行協議: ${action}` : `[SYSTEM] Executing protocol: ${action}`,
      'info'
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let text = response.text || '{}';
    // Sanitize JSON: remove plus signs before numbers (e.g. +12 -> 12) which are invalid in JSON
    text = text.replace(/:\s*\+(\d+)/g, ': $1');

    const parsedResult = JSON.parse(text);
    logKernelEvent('MCP', 'ACTION_SUCCESS', 'SUCCESS', { action, result: parsedResult });
    return { success: true, result: parsedResult, error: null };
  } catch (err: any) {
    const errMsg = safeErrorString(err);

    // Fallback for background tasks to prevent UI spam on rate limit
    if (
      action === 'perform_entropy_transmutation' &&
      (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED'))
    ) {
      logKernelEvent('MCP', 'ACTION_FALLBACK', 'WARNING', { action, reason: 'Rate Limit' });
      return {
        success: true,
        result: {
          optimizationDirective: { title: 'Emergency Entropy Stasis' },
          originalSin: 'Neural Link Saturated. Local stasis field activated.',
        },
        error: null,
      };
    }

    logKernelEvent('MCP', 'ACTION_ERROR', 'ERROR', { action, error: errMsg });
    onLog?.(`[FAULT] Logic Breach: ${errMsg}`, 'error');
    return { success: false, result: null, error: errMsg };
  }
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatTool {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export async function* streamChat(
  message: string,
  language: Language,
  systemInstruction: string,
  history: ChatMessage[] = [],
  tools: ChatTool[] = [],
  model: string = 'gemini-3-flash-preview',
  thinking: boolean = false
) {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const config: any = { systemInstruction };
  if (thinking && (model.includes('gemini-3-pro') || model.includes('gemini-2.5'))) {
    config.thinkingConfig = { thinkingBudget: 1024 };
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: message,
      config,
    });

    for await (const chunk of responseStream) {
      yield chunk;
    }
  } catch (error) {
    omniLogger.error(LogCategory.AI, 'Stream Chat Failed', { error, model });
    throw error;
  }
}

export async function generateReportChapter(
  title: string,
  template: string,
  example: string,
  context: Record<string, unknown>,
  language: Language
): Promise<string> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const prompt = `Write a report chapter for "${title}". 
    Context: ${JSON.stringify(context)}.
    Template: ${template}
    Example style: ${example}
    Language: ${language}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || '';
}

interface SearchSource {
  uri?: string;
  title?: string;
  snippet?: string;
}

export async function performMapQuery(
  query: string,
  language: Language
): Promise<{ text: string; sources?: SearchSource[] }> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: { tools: [{ googleMaps: {} }] },
  });

  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks ||
    []) as unknown as SearchSource[];
  return { text: response.text || '', sources };
}

export async function performWebSearch(
  query: string,
  language: Language
): Promise<{ text: string; sources?: SearchSource[] }> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });

  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks ||
    []) as unknown as SearchSource[];
  return { text: response.text || '', sources };
}

export async function generateLegoImage(
  title: string,
  description: string
): Promise<string | null> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Lego set of ${title}: ${description}. High quality, photorealistic.`,
      config: { numberOfImages: 1, aspectRatio: '1:1' },
    });
    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64) throw new Error('No image generated');
    return `data:image/png;base64,${base64}`;
    return `data:image/png;base64,${base64}`;
  } catch (e) {
    omniLogger.error(LogCategory.AI, 'Lego Image Generation Failed', { error: e });
    return null;
  }
}

interface EsgQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function generateEsgQuiz(
  term: string,
  definition: string,
  language: string
): Promise<EsgQuiz | null> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const prompt = `Generate a multiple choice quiz question about "${term}" (${definition}). 
    Language: ${language}.
    Output JSON with: question, options (array of 4 strings), correctIndex (number 0-3), explanation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
}

interface TheoryOfChange {
  sdgs?: number[];
  logicModel?: {
    inputs?: string[];
    activities?: string[];
    outputs?: string[];
    outcomes?: string[];
    impact?: string[];
  };
  impactMetrics?: Array<{
    label: string;
    current: number;
    target: number;
    unit: string;
    proxy_value?: number;
  }>;
}

export async function generateProjectTheoryOfChange(
  title: string,
  desc: string,
  language: Language
): Promise<TheoryOfChange> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const prompt = `Generate a Theory of Change logic model for project: ${title} - ${desc}.
    Language: ${language}.
    Output JSON with: sdgs (array of numbers), logicModel (object with inputs, activities, outputs, outcomes, impact), impactMetrics (array of objects with label, current, target, unit, proxy_value).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {};
  }
}

export async function generateNoteSummary(
  content: string,
  language: Language,
  contextStrings: string[]
): Promise<string> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const prompt = `Summarize the following note content in ${language}. 
    Context: ${contextStrings.join(', ')}.
    Content: ${content}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || '';
}

export async function analyzeMedia(
  mediaUrl: string,
  prompt: string,
  mimeType: string
): Promise<string> {
  const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
  const ai = new GoogleGenAI(options);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || '';
}

export const JunAiKeyAPI = {
  v1: {
    manifest: {
      summarize: async (content: string) => {
        const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
        const ai = new GoogleGenAI(options);
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Summarize: ${content}`,
        });
        return { summary: response.text };
      },
    },
    cognition: {
      reason: async (prompt: string, history: ChatMessage[], thinking: boolean) => {
        const options = process.env.API_KEY ? { apiKey: process.env.API_KEY } : {};
        const ai = new GoogleGenAI(options);
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          ...(thinking ? { config: { thinkingConfig: { thinkingBudget: 1024 } } } : {}),
        });
        return { answer: response.text };
      },
    },
    intelligence: {
      search: async (query: string) => performWebSearch(query, 'en-US'),
    },
    perception: {
      analyze: async (media_base64: string, prompt: string) => {
        return { analysis: 'Image analysis simulated.' };
      },
    },
  },
};
