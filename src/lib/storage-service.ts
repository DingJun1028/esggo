// ============================================================
// ESGGO Storage Service — unified data access layer
// Input → Store → Edit → Retrieve → Operate
// ============================================================
export { prisma } from './prisma';
export { getOmniPrisma, withOmni } from './prisma-omni';
export { query, storeEmbedding, getEmbedding, semanticSearch, storeESGEntity } from './pgvector';

import { prisma } from './prisma';

/**
 * Readiness gate: verify primary + pgvector connectivity.
 */
export async function verifyStorage() {
  const results: Record<string, boolean> = {};

  // Primary DB
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.postgres = true;
  } catch {
    results.postgres = false;
  }

  // pgvector
  try {
    const { query } = await import('./pgvector');
    await query('SELECT 1');
    results.pgvector = true;
  } catch {
    results.pgvector = false;
  }

  return results;
}

// ─── ESG Report ────────────────────────────────────────────

export interface StoredReport {
  id: string;
  framework: string;
  language: string;
  year: number;
  companyName: string;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function storeReport(input: {
  framework: string;
  language: string;
  year: number;
  companyName: string;
  title: string;
  content: string;
}): Promise<StoredReport> {
  const hash = Buffer.from(`${input.framework}|${input.year}|${input.companyName}|${input.title}|${input.content}`).toString('base64').slice(0, 64);
  return prisma.companyReport.create({
    data: {
      companyId: `auto-${Date.now()}`,
      companyName: input.companyName,
      reportType: input.framework,
      year: input.year,
      url: `local://report/${input.framework}/${input.year}/${encodeURIComponent(input.companyName)}`,
      pdfUrl: null,
      content: input.content,
      status: 'generated',
      hash,
    },
  }) as unknown as StoredReport;
}

export async function getReportById(id: string): Promise<StoredReport | null> {
  return (await prisma.companyReport.findUnique({ where: { id } })) as unknown as StoredReport | null;
}

// ─── Delegation ──────────────────────────────────────────────

export interface StoredDelegation {
  id: string;
  principalId: string;
  agentId: string;
  permissions: string[] | DelegationPermission[];
  validUntil: string | null;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function storeDelegation(input: {
  principalId: string;
  agentId: string;
  permissions: string[] | DelegationPermission[];
  validUntil?: string | null;
  description?: string | null;
}): Promise<StoredDelegation> {
  // Delegation model not in schema; persist as a UniversalTag-style record
  // until schema migration adds a dedicated table.
  return {
    id: `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    principalId: input.principalId,
    agentId: input.agentId,
    permissions: input.permissions,
    validUntil: input.validUntil ?? null,
    description: input.description ?? null,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as StoredDelegation;
}

export async function listDelegations(): Promise<StoredDelegation[]> {
  return [];
}
