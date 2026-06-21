// lib/sustain-write/templates/types.ts
// 永續資源庫型別定義

export interface TemplateSection {
  id: string;
  title: string;
  chapter: number;
  wordCount: number;
  content: string; // HTML content with embedded tables, charts, data
  placeholders: string[];
  griAlignment: string[];
  hasChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie' | 'radar';
}

export interface ReportTemplate {
  id: string;
  name: string;
  theme: 'climate' | 'social' | 'comprehensive';
  industry: string[];
  totalSections: number;
  estimatedWords: number;
  sections: TemplateSection[];
}

export interface GeneratedReport {
  templateId: string;
  templateName: string;
  companyName: string;
  industry: string;
  totalWords: number;
  chapters: GeneratedChapter[];
  generatedAt: string;
  provider: 'template' | 'ai';
}

export interface GeneratedChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  indicators: string[];
  hasChart?: boolean;
}
