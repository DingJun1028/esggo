import { upsertReportSection, listReportSectionsByReport, getReportByCompany, upsertCompanyMetric, listCompanyMetrics, insertEternalMemory, listEternalMemoriesByCompany, upsertReport } from '@dataconnect/generated';
// ─── Internal Helpers ────────────────────────────────────────────────────────
async function getOrCreateReportId(companyId) {
    try {
        const { dataConnect } = await import('./firebase');
        if (!dataConnect)
            throw new Error('Data Connect not initialized');
        const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
        const { data } = await getReportByCompany({ companyId: cid });
        if (data?.reports && data.reports.length > 0) {
            return data.reports[0].id;
        }
        const { data: newData } = await upsertReport({
            companyId: cid,
            templateId: 'standard-gri',
            title: '2024 年度永續報告',
            language: 'zh-TW',
            progress: 0,
            status: 'draft'
        });
        const { data: refetch } = await getReportByCompany({ companyId: cid });
        return refetch?.reports?.[0]?.id || 'simulation-report-id';
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn('[DataConnect Memory] Simulation Mode Active:', errorMessage);
        return 'sim-report-123';
    }
}
// ─── Core Operations ─────────────────────────────────────────────────────────
export async function saveSustainWriteSection(params) {
    try {
        const reportId = await getOrCreateReportId(params.company_id);
        const { dataConnect } = await import('./firebase');
        if (!dataConnect)
            throw new Error('Simulation Persistence');
        const { data } = await upsertReportSection({
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
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.log(`[Simulation] Saved Section: ${params.chapter_id} with hash ${params.hash_lock}`);
        return { success: true, simulated: true };
    }
}
export async function loadSustainWriteSections(companyId) {
    const reportId = await getOrCreateReportId(companyId);
    const { data } = await listReportSectionsByReport({ reportId });
    if (!data?.reportSections)
        return [];
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
export async function saveMetric(companyId, metric) {
    const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
    return await upsertCompanyMetric({
        companyId: cid,
        metricName: metric.name,
        metricValue: metric.value,
        unit: metric.unit,
        category: metric.category,
        verified: metric.verified || false,
        griStandard: metric.gri,
        sourceOrigin: metric.sourceOrigin,
        hashLock: metric.hashLock
    });
}
export async function loadMetrics(companyId) {
    const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
    const { data } = await listCompanyMetrics({ companyId: cid });
    return data?.companyMetrics || [];
}
export async function saveMemory(companyId, memory) {
    const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
    return await insertEternalMemory({
        companyId: cid,
        type: memory.type,
        content: memory.content,
        tags: Array.isArray(memory.tags) ? memory.tags.join(',') : (memory.tags || ''),
        hashLock: memory.hashLock,
        consolidated: memory.consolidated || false,
        sourceOrigin: memory.sourceOrigin || 'Client'
    });
}
export async function loadMemories(companyId) {
    const cid = companyId === 'default' ? '00000000-0000-0000-0000-000000000000' : companyId;
    const { data } = await listEternalMemoriesByCompany({ companyId: cid });
    return data?.eternalMemories || [];
}
//# sourceMappingURL=dataconnect-memory.js.map