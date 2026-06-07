import { 
  upsertReportSection, 
  listReportSectionsByReport, 
  getReportByCompany, 
  upsertCompanyMetric,
  listCompanyMetrics,
  insertEternalMemory,
  listEternalMemoriesByCompany,
  upsertReport
} from '@dataconnect/generated';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SustainWriteSection {
  id?: string;
  company_id: string;
  chapter_id: string;
  chapter_name: string;
  content?: string;
  content_md?: string;
  field_values?: Record<string, unknown>;
  notes?: string;
  documents_state?: Record<string, boolean>;
  status?: 'empty' | 'draft' | 'reviewing' | 'completed';
  chapter_order?: number;
  gri_references?: string[];
  hash_lock?: string;
  updated_at?: string;
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

async function getOrCreateReportId(companyId: string): Promise<string> {
  try {
    const { dataConnect } = await import('./firebase');
    const dc = dataConnect;
    if (!dc) throw new Error('Data Connect not initialized');

    const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
    
    const { data } = await getReportByCompany(dc, { companyId: cid });
    if (data?.reports && data.reports.length > 0) {
      return data.reports[0].id;
    }

    const { data: newData } = await upsertReport(dc, {
      companyId: cid,
      templateId: 'standard-gri',
      title: '2024 年度永續報告',
      language: 'zh-TW',
      progress: 0,
      status: 'draft'
    });
    
    const { data: refetch } = await getReportByCompany(dc, { companyId: cid });
    return refetch?.reports?.[0]?.id || 'simulation-report-id';
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.warn('[DataConnect Memory] Simulation Mode Active:', errorMessage);
    return 'sim-report-123';
  }
}

// ─── Core Operations ─────────────────────────────────────────────────────────

export async function saveSustainWriteSection(params: SustainWriteSection): Promise<any> {
  try {
    const reportId = await getOrCreateReportId(params.company_id);
    const { dataConnect } = await import('./firebase');
    const dc = dataConnect;
    if (!dc) throw new Error('Simulation Persistence');

    const { data } = await upsertReportSection(dc, {
      reportId: reportId,
      sectionId: params.chapter_id,
      title: params.chapter_name,
      content: params.content,
      contentMd: params.content_md,
      fieldValuesJson: JSON.stringify(params.field_values || {}),
      notes: params.notes,
      documentsStateJson: JSON.stringify(params.documents_state || {}),
      isDone: params.status === 'completed',
      chapterOrder: params.chapter_order,
      griReferences: params.gri_references,
      hashLock: params.hash_lock,
      sourceOrigin: 'Client'
    });
    return data;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.log(`[Simulation] Saved Section: ${params.chapter_id} with hash ${params.hash_lock}`);
    return { success: true, simulated: true };
  }
}

export async function loadSustainWriteSections(companyId: string): Promise<SustainWriteSection[]> {
  const reportId = await getOrCreateReportId(companyId);
  const { dataConnect } = await import('./firebase');
  const dc = dataConnect;
  const { data } = await listReportSectionsByReport(dc, { reportId });

  if (!data?.reportSections) return [];

  return data.reportSections.map(s => ({
    id: s.id,
    company_id: companyId,
    chapter_id: s.sectionId,
    chapter_name: s.title,
    content: s.content || '',
    content_md: s.contentMd || '',
    field_values: JSON.parse(s.fieldValuesJson || '{}'),
    notes: s.notes || '',
    documents_state: JSON.parse(s.documentsStateJson || '{}'),
    status: s.isDone ? 'completed' : 'draft',
    chapter_order: s.chapterOrder || 0,
    gri_references: s.griReferences || [],
    hash_lock: s.hashLock || '',
    updated_at: s.lastUpdated
  }));
}

export async function saveMetric(companyId: string, metric: Record<string, unknown>): Promise<unknown> {
  const { dataConnect } = await import('./firebase');
  const dc = dataConnect;
  const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
  return await upsertCompanyMetric(dc, {
    companyId: cid,
    metricName: metric.name as string,
    metricValue: metric.value as number,
    unit: metric.unit as string,
    category: metric.category as string,
    verified: metric.verified || false,
    griStandard: metric.gri as string,
    sourceOrigin: metric.sourceOrigin as string,
    hashLock: metric.hashLock as string
  });
}

export async function loadMetrics(companyId: string): Promise<unknown[]> {
  const { dataConnect } = await import('./firebase');
  const dc = dataConnect;
  const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
  const { data } = await listCompanyMetrics(dc, { companyId: cid });
  return data?.companyMetrics || [];
}

export async function saveMemory(companyId: string, memory: Record<string, unknown>): Promise<unknown> {
  const { dataConnect } = await import('./firebase');
  const dc = dataConnect;
  const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
  return await insertEternalMemory(dc, {
    companyId: cid,
    type: memory.type as string,
    content: memory.content as string,
    tags: Array.isArray(memory.tags) ? memory.tags.join(',') : (memory.tags as string || ''),
    hashLock: memory.hashLock as string,
    consolidated: memory.consolidated || false,
    sourceOrigin: (memory.sourceOrigin as string) || 'Client'
  });
}

export async function loadMemories(companyId: string): Promise<unknown[]> {
  const { dataConnect } = await import('./firebase');
  const dc = dataConnect;
  const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
  const { data } = await listEternalMemoriesByCompany(dc, { companyId: cid });
  return data?.eternalMemories || [];
}
