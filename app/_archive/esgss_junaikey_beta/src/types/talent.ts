export interface ITalent {
  uuid: string;
  name: string;
  role: string;
  avatar_url: string;
  department: string;
  skills: string[];
}

export const MOCK_TALENT_POOL: Record<string, ITalent> = {
  'user-jun-001': {
    uuid: 'user-jun-001',
    name: 'Jun',
    role: 'CSO / Architect',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jun',
    department: 'Strategy',
    skills: ['System Architecture', 'ESG Strategy', 'Golden Entropy'],
  },
  'user-alice-002': {
    uuid: 'user-alice-002',
    name: 'Alice',
    role: 'Project Lead',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    department: 'Operations',
    skills: ['Project Management', 'Resource Planning'],
  },
  'user-bob-003': {
    uuid: 'user-bob-003',
    name: 'Bob',
    role: 'Data Scientist',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    department: 'Analytics',
    skills: ['Data Analysis', 'Impact Modeling'],
  },
};
