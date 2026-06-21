// lib/sustain-write/templates/index.ts
// 永續資源庫 — 預寫範本索引

import type { ReportTemplate, TemplateSection } from './types';
import { comprehensiveTemplate } from './comprehensive-template';

export type { ReportTemplate, TemplateSection };

export { comprehensiveTemplate };

export const AllTemplates: ReportTemplate[] = [
  comprehensiveTemplate,
];

export function getTemplateById(id: string): ReportTemplate | undefined {
  return AllTemplates.find(t => t.id === id);
}
