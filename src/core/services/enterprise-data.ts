import { sonnarClient } from './esg-sonnar-client';

export interface DocumentCollectionProgress {
  totalRequired: number;
  collected: number;
  pending: number;
  categories: {
    energy: { collected: number, required: number };
    water: { collected: number, required: number };
    waste: { collected: number, required: number };
    social: { collected: number, required: number };
  };
}

export interface EnterpriseContext {
  companyName: string;
  industry: string;
  employeeCount: number;
  revenue: string;
  headquarters: string;
  sustainabilityGoals: string[];
  documentProgress: DocumentCollectionProgress;
}

export async function fetchEnterpriseData(companyId: string): Promise<EnterpriseContext> {
  // Use ESGSonnar as the powerful backend database
  const profile = await sonnarClient.query({
    companyId,
    queryType: 'enterprise_profile'
  });

  const progress = await sonnarClient.query({
    companyId,
    queryType: 'document_progress'
  });

  return {
    ...profile,
    documentProgress: progress
  };
}
