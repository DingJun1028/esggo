// Shared types for the ESGGO monorepo

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'auditor';
}

export interface SharedESGReport {
  reportId: string;
  companyName: string;
  year: number;
  status: 'draft' | 'submitted' | 'verified';
  score: number;
}
