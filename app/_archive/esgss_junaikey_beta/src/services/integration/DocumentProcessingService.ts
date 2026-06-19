import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { v4 as uuidv4 } from 'uuid';
import { EvidenceVault } from '@/services/EvidenceVault.js';

/**
 * 📄 Document Processing Service (Unstructured + Marker Integration)
 * --------------------------------------------------
 * [Function] ESG report parsing, structured data extraction, high-precision conversion
 * [Integration] Unstructured API, Marker API/Local
 * [Purpose] Automatic processing of sustainability reports, financial reports, and supplier questionnaires
 */

// ============================================================================
// Types
// ============================================================================

export interface DocumentProcessingConfig {
  provider: 'unstructured' | 'marker' | 'local';
  apiKey?: string;
  baseUrl?: string;
  options?: ProcessingOptions;
}

export interface ProcessingOptions {
  outputFormat: 'markdown' | 'json' | 'html' | 'chunks';
  extractTables: boolean;
  extractImages: boolean;
  forceOCR: boolean;
  useLLM: boolean;
  language?: string;
  pageRange?: string;
}

export interface DocumentElement {
  id: string;
  type: ElementType;
  text: string;
  metadata: ElementMetadata;
  coordinates?: BoundingBox;
}

export type ElementType =
  | 'Title'
  | 'NarrativeText'
  | 'Table'
  | 'ListItem'
  | 'Image'
  | 'Header'
  | 'Footer'
  | 'PageNumber'
  | 'Caption'
  | 'Formula'
  | 'FigureCaption';

export interface ElementMetadata {
  pageNumber?: number;
  filename?: string;
  filetype?: string;
  languages?: string[];
  parentId?: string;
  categoryDepth?: number;
  tableData?: TableData;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  html?: string;
}

export interface ProcessedDocument {
  filename: string;
  fileType: string;
  elements: DocumentElement[];
  markdown?: string;
  html?: string;
  json?: object;
  chunks?: DocumentChunk[];
  metadata: DocumentMetadata;
  processingTime: number;
}

export interface DocumentChunk {
  id: string;
  text: string;
  elementType: ElementType;
  pageNumber?: number;
  embedding?: number[];
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  createdDate?: Date;
  pageCount: number;
  wordCount: number;
  tableCount: number;
  imageCount: number;
  language: string;
}

// ESG Specific Types
export interface ESGReportData {
  companyName?: string;
  reportYear?: number;
  reportType?: 'sustainability' | 'annual' | 'carbon' | 'tcfd' | 'other';
  frameworks?: string[]; // GRI, SASB, TCFD, etc.
  emissions?: EmissionsData;
  targets?: SustainabilityTarget[];
  highlights?: string[];
}

export interface EmissionsData {
  scope1?: number;
  scope2?: number;
  scope3?: number;
  unit: string;
  verificationStatus?: 'verified' | 'unverified' | 'third-party';
}

export interface SustainabilityTarget {
  category: string;
  target: string;
  targetYear: number;
  progress?: number;
}

// ============================================================================
// Document Processing Service
// ============================================================================

export class DocumentProcessingService {
  private config!: DocumentProcessingConfig;

  constructor(config?: Partial<DocumentProcessingConfig>) {
    const getEnv = (): any => {
      try {
        // @ts-ignore
        const meta = import.meta;
        return meta && (meta as any).env ? (meta as any).env : {};
      } catch {
        return {};
      }
    };
    const env = getEnv();

    const initialConfig: DocumentProcessingConfig = {
      provider: config?.provider || 'local',
      apiKey: config?.apiKey || env.VITE_UNSTRUCTURED_API_KEY,
      baseUrl: config?.baseUrl,
      options: {
        outputFormat: 'markdown',
        extractTables: true,
        extractImages: true,
        forceOCR: false,
        useLLM: false,
        language: 'en',
        ...(config?.options || {}),
      },
    };
    this.config = initialConfig;

    if (this.config) {
      omniLogger.info(LogCategory.INTEGRATION, 'Document processing service initialized', {
        provider: this.config.provider,
        source_origin: 'DocumentProcessingService.constructor',
      });
    }
  }

  /**
   * Process document (Main entry)
   */
  async processDocument(
    file: File | string,
    options?: Partial<ProcessingOptions>
  ): Promise<ProcessedDocument> {
    const startTime = Date.now();
    const trace_id = uuidv4();

    const defaultOptions: ProcessingOptions = {
      outputFormat: 'markdown',
      extractTables: true,
      extractImages: true,
      forceOCR: false,
      useLLM: false,
    };

    const configOptions = this.config?.options || {};
    const mergedOptions: ProcessingOptions = {
      ...defaultOptions,
      ...configOptions,
      ...options,
    };

    const filename = typeof file === 'string' ? file : file.name;

    omniLogger.info(LogCategory.INTEGRATION, `Start processing document: ${filename}`, {
      trace_id,
      provider: this.config?.provider,
      options: mergedOptions,
      source_origin: 'DocumentProcessingService.processDocument',
    });

    try {
      let result: ProcessedDocument;

      switch (this.config?.provider) {
        case 'unstructured':
          result = await this.processWithUnstructured(file, mergedOptions);
          break;
        case 'marker':
          result = await this.processWithMarker(file, mergedOptions);
          break;
        default:
          result = await this.processLocally(file, mergedOptions);
      }

      result.processingTime = Date.now() - startTime;

      // Deposit into Evidence Vault
      const evidenceContent = result.markdown || JSON.stringify(result.elements);
      const mimeType = file instanceof File ? file.type : 'text/markdown';
      await EvidenceVault.deposit(evidenceContent, result.filename, mimeType);

      omniLogger.info(LogCategory.INTEGRATION, `Document processing completed: ${filename}`, {
        trace_id,
        processingTime: result.processingTime,
        pageCount: result.metadata.pageCount,
        source_origin: 'DocumentProcessingService.processDocument',
      });

      return result;
    } catch (error) {
      omniLogger.error(LogCategory.INTEGRATION, `Document processing failed: ${filename}`, {
        trace_id,
        error: String(error),
        source_origin: 'DocumentProcessingService.processDocument',
      });
      throw error;
    }
  }

  /**
   * Process using Unstructured API
   */
  private async processWithUnstructured(
    file: File | string,
    options: ProcessingOptions
  ): Promise<ProcessedDocument> {
    const baseUrl = this.config.baseUrl || 'https://api.unstructured.io/general/v0/general';

    const formData = new FormData();

    if (typeof file === 'string') {
      // URL or path
      formData.append('url', file);
    } else {
      formData.append('files', file);
    }

    // Unstructured Parameters
    formData.append('strategy', options.forceOCR ? 'ocr_only' : 'auto');
    formData.append('languages', options.language || 'chi_tra, eng');
    formData.append('include_page_breaks', 'true');

    if (options.extractTables) {
      formData.append('extract_tables', 'true');
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'unstructured-api-key': this.config?.apiKey || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Unstructured API error: ${response.status}`);
    }

    const elements = (await response.json()) as any[];
    return this.convertUnstructuredResponse(elements, file);
  }

  /**
   * Process using Marker API
   */
  private async processWithMarker(
    file: File | string,
    options: ProcessingOptions
  ): Promise<ProcessedDocument> {
    const baseUrl = this.config.baseUrl || 'https://www.datalab.to/api/v1/marker';

    const formData = new FormData();

    if (typeof file === 'string') {
      formData.append('filepath', file);
    } else {
      formData.append('file', file);
    }

    // Marker Parameters
    formData.append('output_format', options.outputFormat);
    formData.append('force_ocr', String(options.forceOCR));
    formData.append('use_llm', String(options.useLLM));

    if (options.pageRange) {
      formData.append('page_range', options.pageRange);
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config?.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Marker API error: ${response.status}`);
    }

    const result = await response.json();
    return this.convertMarkerResponse(result, file);
  }

  /**
   * Local processing (Mock implementation)
   */
  private async processLocally(
    file: File | string,
    options: ProcessingOptions
  ): Promise<ProcessedDocument> {
    // Mock local processing - integrated with Python backend in actual use
    const filename = typeof file === 'string' ? file : file.name;
    const fileType = filename.split('.').pop() || 'unknown';

    return {
      filename,
      fileType,
      elements: [
        {
          id: 'mock-1',
          type: 'Title',
          text: '2024 Sustainability Report',
          metadata: { pageNumber: 1 },
        },
        {
          id: 'mock-2',
          type: 'NarrativeText',
          text: 'Our company is committed to environmental sustainability, actively reducing carbon emissions...',
          metadata: { pageNumber: 1 },
        },
        {
          id: 'mock-3',
          type: 'Table',
          text: '',
          metadata: {
            pageNumber: 5,
            tableData: {
              headers: ['Scope', 'Emissions (tCO2e)', 'Percentage'],
              rows: [
                ['Scope 1', '1,234', '15%'],
                ['Scope 2', '5,678', '70%'],
                ['Scope 3', '1,200', '15%'],
              ],
            },
          },
        },
      ],
      markdown: `# 2024 Sustainability Report\n\nOur company is committed to environmental sustainability, actively reducing carbon emissions...\n\n## Carbon Emission Data\n\n| Scope | Emissions (tCO2e) | Percentage |\n|------|---------------|------|\n| Scope 1 | 1,234 | 15% |\n| Scope 2 | 5,678 | 70% |\n| Scope 3 | 1,200 | 15% |`,
      metadata: {
        pageCount: 120,
        wordCount: 45000,
        tableCount: 35,
        imageCount: 50,
        language: 'zh-TW',
      },
      processingTime: 0,
    };
  }

  /**
   * Convert Unstructured response
   */
  private convertUnstructuredResponse(elements: any[], file: File | string): ProcessedDocument {
    const filename = typeof file === 'string' ? file : file.name;
    const fileType = filename.split('.').pop() || 'unknown';

    const convertedElements: DocumentElement[] = elements.map((el, idx) => ({
      id: el.element_id || `el-${idx}`,
      type: this.mapUnstructuredType(el.type),
      text: el.text || '',
      metadata: {
        pageNumber: el.metadata?.page_number,
        filename: el.metadata?.filename,
        filetype: el.metadata?.filetype,
        parentId: el.metadata?.parent_id,
      },
      coordinates: el.metadata?.coordinates
        ? {
          x1: el.metadata.coordinates.points[0][0],
          y1: el.metadata.coordinates.points[0][1],
          x2: el.metadata.coordinates.points[2][0],
          y2: el.metadata.coordinates.points[2][1],
        }
        : undefined,
    }));

    // Generate Markdown
    const markdown = convertedElements.map(el => this.elementToMarkdown(el)).join('\n\n');

    return {
      filename,
      fileType,
      elements: convertedElements,
      markdown,
      metadata: {
        pageCount: Math.max(...convertedElements.map(e => e.metadata.pageNumber || 0), 1),
        wordCount: convertedElements.reduce((sum, e) => sum + e.text.split(/\s+/).length, 0),
        tableCount: convertedElements.filter(e => e.type === 'Table').length,
        imageCount: convertedElements.filter(e => e.type === 'Image').length,
        language: 'en',
      },
      processingTime: 0,
    };
  }

  /**
   * Convert Marker response
   */
  private convertMarkerResponse(result: any, file: File | string): ProcessedDocument {
    const filename = typeof file === 'string' ? file : file.name;
    const fileType = filename.split('.').pop() || 'unknown';

    // Marker directly returns markdown/json/html
    return {
      filename,
      fileType,
      elements: result.children || [],
      markdown: result.markdown,
      html: result.html,
      json: result,
      metadata: {
        pageCount: result.metadata?.page_stats?.length || 1,
        wordCount: (result.markdown || '').split(/\s+/).length,
        tableCount: (result.markdown || '').match(/\|.*\|/g)?.length || 0,
        imageCount: (result.markdown || '').match(/!\[.*\]/g)?.length || 0,
        language: 'en',
      },
      processingTime: 0,
    };
  }

  /**
   * Map Unstructured element types
   */
  private mapUnstructuredType(type: string): ElementType {
    const typeMap: Record<string, ElementType> = {
      Title: 'Title',
      NarrativeText: 'NarrativeText',
      Table: 'Table',
      ListItem: 'ListItem',
      Image: 'Image',
      Header: 'Header',
      Footer: 'Footer',
      PageNumber: 'PageNumber',
      Caption: 'Caption',
      Formula: 'Formula',
      FigureCaption: 'FigureCaption',
    };
    return typeMap[type] || 'NarrativeText';
  }

  /**
   * Element to Markdown
   */
  private elementToMarkdown(element: DocumentElement): string {
    switch (element.type) {
      case 'Title':
        return `# ${element.text}`;
      case 'Header':
        return `## ${element.text}`;
      case 'Table':
        if (element.metadata.tableData) {
          const { headers, rows } = element.metadata.tableData;
          const headerRow = `| ${headers.join(' | ')} |`;
          const separator = `| ${headers.map(() => '---').join(' | ')} |`;
          const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');
          return `${headerRow}\n${separator}\n${dataRows}`;
        }
        return element.text;
      case 'ListItem':
        return `- ${element.text}`;
      case 'Image':
        return `![Image](${element.text})`;
      case 'Formula':
        return `$$${element.text}$$`;
      default:
        return element.text;
    }
  }

  /**
   * Extract ESG report data
   */
  async extractESGData(document: ProcessedDocument): Promise<ESGReportData> {
    // Extract key ESG data using NLP or LLM
    const text = (document as any).markdown || document.elements.map(e => e.text).join('\n');

    // Simple rule matching (actual implementation should use LLM)
    const scope1Match = text.match(/Scope\s*1[：:]\s*([\d,]+)/i);
    const scope2Match = text.match(/Scope\s*2[：:]\s*([\d,]+)/i);
    const scope3Match = text.match(/Scope\s*3[：:]\s*([\d,]+)/i);

    const frameworks: string[] = [];
    if (text.includes('GRI')) frameworks.push('GRI');
    if (text.includes('SASB')) frameworks.push('SASB');
    if (text.includes('TCFD')) frameworks.push('TCFD');
    if (text.includes('CDP')) frameworks.push('CDP');

    return {
      reportType: 'sustainability',
      frameworks,
      emissions: {
        scope1: scope1Match ? parseFloat(scope1Match[1].replace(/,/g, '')) : undefined,
        scope2: scope2Match ? parseFloat(scope2Match[1].replace(/,/g, '')) : undefined,
        scope3: scope3Match ? parseFloat(scope3Match[1].replace(/,/g, '')) : undefined,
        unit: 'tCO2e',
      },
      highlights: document.elements
        .filter(e => e.type === 'Title' || e.type === 'Header')
        .slice(0, 10)
        .map(e => e.text),
    };
  }

  /**
   * Split document into Chunks (For RAG)
   */
  chunkDocument(
    document: ProcessedDocument,
    chunkSize: number = 500,
    overlap: number = 50
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let chunkId = 0;

    for (const element of document.elements) {
      const text = element.text;

      if (text.length <= chunkSize) {
        chunks.push({
          id: `chunk-${chunkId++}`,
          text,
          elementType: element.type,
          pageNumber: element.metadata.pageNumber,
        });
      } else {
        // Split long text
        for (let i = 0; i < text.length; i += chunkSize - overlap) {
          chunks.push({
            id: `chunk-${chunkId++}`,
            text: text.slice(i, i + chunkSize),
            elementType: element.type,
            pageNumber: element.metadata.pageNumber,
          });
        }
      }
    }

    return chunks;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let documentProcessingInstance: DocumentProcessingService | null = null;

export function getDocumentProcessingService(
  config?: Partial<DocumentProcessingConfig>
): DocumentProcessingService {
  if (!documentProcessingInstance) {
    documentProcessingInstance = new DocumentProcessingService(config);
  }
  return documentProcessingInstance;
}

export default DocumentProcessingService;
