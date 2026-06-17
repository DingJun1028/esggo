/**
 * ESG Submission Documents Overview Store
 * ESG 繳交單據總攬 - 企業永續報告、碳盤查報告、溫室氣體盤查等
 */

import { supabase } from '../db/supabase';
import { createHashLock } from '../crypto-proof';

export type DocumentType =
  | 'sustainability_report'
  | 'carbon_footprint'
  | 'ghg_inventory'
  | 'cbam_declaration'
  | 'esg_disclosure'
  | 'verification_statement'
  | 'transition_plan';

export interface ESGDocument {
  id: string;
  company_id: string;
  company_name?: string;
  document_type: DocumentType;
  gri_reference?: string;
  title: string;
  year: number;
  quarter?: number;
  status: 'draft' | 'submitted' | 'verified' | 'published';
  submission_date?: string;
  hash_lock?: string;
  evidence_url?: string;
  verifier?: string;
  verification_date?: string;
  compliance_score?: number;
  created_at?: string;
}

export interface SubmissionStats {
  total_documents: number;
  verified_count: number;
  pending_verification: number;
  compliance_rate: number;
  overdue_submissions: number;
}

export const getESGDocuments = async (companyId?: string): Promise<ESGDocument[]> => {
  try {
    let query = supabase.from('esg_submission_documents').select('*');
    if (companyId) query = query.eq('company_id', companyId);
    const { data } = await query.order('year', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
};

export const getSubmissionOverview = async (companyId: string): Promise<SubmissionStats> => {
  try {
    const { data, error } = await supabase
      .from('esg_submission_documents')
      .select('status, submission_date')
      .eq('company_id', companyId);
    if (error || !data) throw error || new Error('No data');

    const total = data.length;
    const verified = data.filter((d: any) => d.status === 'verified').length;
    const pending = data.filter((d: any) => d.status !== 'verified').length;
    const compliance = total > 0 ? (verified / total) * 100 : 0;

    const now = new Date();
    const overdue = data.filter(
      (d: any) => d.submission_date && new Date(d.submission_date) < now && d.status !== 'submitted'
    ).length;

    return {
      total_documents: total,
      verified_count: verified,
      pending_verification: pending,
      compliance_rate: Math.round(compliance * 100) / 100,
      overdue_submissions: overdue,
    };
  } catch {
    return {
      total_documents: 0,
      verified_count: 0,
      pending_verification: 0,
      compliance_rate: 0,
      overdue_submissions: 0,
    };
  }
};

export const createESGDocument = async (
  doc: Omit<ESGDocument, 'id' | 'created_at'>
): Promise<string | null> => {
  try {
    const str = `${doc.company_id}-${doc.document_type}-${doc.year}-${doc.title}`;
    const { hash } = await createHashLock(str);
    const { data, error } = await supabase
      .from('esg_submission_documents')
      .insert({ ...doc, hash_lock: hash })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

export const updateDocumentStatus = async (
  id: string,
  status: ESGDocument['status'],
  verifier?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('esg_submission_documents')
      .update({
        status,
        verifier,
        verification_date: verifier ? new Date().toISOString() : undefined,
      })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

export const getDocumentsByGRI = async (griCode: string): Promise<ESGDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('esg_submission_documents')
      .select('*')
      .eq('gri_reference', griCode);
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};
