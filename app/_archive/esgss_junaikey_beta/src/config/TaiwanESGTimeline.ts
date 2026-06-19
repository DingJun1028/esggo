/**
 * Taiwan Sustainability Report Filing Timeline Management System
 * ==============================================================
 * Based on the FSC "Corporate Sustainability Development Roadmap" and related regulations.
 */

export interface CompanyProfile {
  companyId: string;
  companyName: string;
  stockCode: string;
  market: 'TWSE' | 'TPEx'; // TWSE/TPEx
  paidInCapital: number; // Paid-in Capital (in 100M TWD)
  industry: string;
  isHighEmission: boolean; // High-emission industry (steel, cement, etc.)
}

export interface TimelinePhase {
  phase: string;
  description: string;
  startDate: Date;
  deadline: Date;
  status: 'pending' | 'not_started' | 'in_progress' | 'completed' | 'overdue';
  tasks: TimelineTask[];
  dependencies?: string[]; // Prerequisite phases
}

export interface TimelineTask {
  id: string;
  name: string;
  description: string;
  responsible: string; // Responsible department
  estimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: Date;
  notes?: string;
}

export interface RegulatoryRequirement {
  framework: 'GRI' | 'TCFD' | 'SASB' | 'IFRS_S1' | 'IFRS_S2';
  applicableFrom: number; // Implementation year
  mandatory: boolean;
  description: string;
  references: string[]; // Legal references
}

/**
 * Determine filing timeline phase based on capital
 */
export function getTimelinePhase(
  paidInCapital: number,
  isHighEmission: boolean
): {
  ghgInventoryYear: number; // Start GHG inventory year
  ghgAssuranceYear: number; // Start GHG assurance year
  reductionTargetYear: number; // Disclose reduction targets year
} {
  // Over 10B TWD or high-emission industry
  if (paidInCapital >= 100 || isHighEmission) {
    return {
      ghgInventoryYear: 2023,
      ghgAssuranceYear: 2024,
      reductionTargetYear: 2024,
    };
  }

  // 5B - 10B TWD
  if (paidInCapital >= 50) {
    return {
      ghgInventoryYear: 2025,
      ghgAssuranceYear: 2026,
      reductionTargetYear: 2026,
    };
  }

  // Under 5B TWD
  return {
    ghgInventoryYear: 2027,
    ghgAssuranceYear: 2029,
    reductionTargetYear: 2027,
  };
}

/**
 * Generate annual report timeline
 */
export function generateAnnualTimeline(
  company: CompanyProfile,
  reportYear: number
): TimelinePhase[] {
  const isCurrentYear = reportYear === new Date().getFullYear();
  const baseYear = reportYear - 1; // Reporting content for the previous year

  return [
    {
      phase: 'Preparation & Planning',
      description: `Start ESG inventory and materiality analysis in Q4 ${baseYear}`,
      startDate: new Date(baseYear, 9, 1), // Oct 1
      deadline: new Date(baseYear, 11, 31), // Dec 31
      status:
        isCurrentYear && new Date() < new Date(baseYear, 11, 31) ? 'in_progress' : 'completed',
      tasks: [
        {
          id: 'PREP_001',
          name: 'Establish Sustainability Task Force',
          description: 'Cross-functional team: ESG, Finance, HR, EHS, Legal',
          responsible: 'Sustainability Dept',
          estimatedHours: 8,
          status: 'completed',
        },
        {
          id: 'PREP_002',
          name: 'Stakeholder Engagement & Materiality Analysis',
          description: 'Surveys, interviews, materiality matrix creation',
          responsible: 'Sustainability Dept',
          estimatedHours: 80,
          status: 'in_progress',
        },
        {
          id: 'PREP_003',
          name: 'Confirm Disclosure Frameworks & Indicators',
          description: 'Select GRI, TCFD, SASB, etc. frameworks and indicator list',
          responsible: 'Sustainability Dept',
          estimatedHours: 40,
          status: 'in_progress',
        },
        {
          id: 'PREP_004',
          name: 'Establish Data Collection Form & Timeline',
          description: 'Assign data collection responsibilities and deadlines to departments',
          responsible: 'Sustainability Dept',
          estimatedHours: 24,
          status: 'pending',
        },
      ],
    },
    {
      phase: 'Data Collection & Verification',
      description: `Complete ESG data collection and internal verification in Q1-Q2 ${reportYear}`,
      startDate: new Date(reportYear, 0, 1), // Jan 1
      deadline: new Date(reportYear, 5, 30), // Jun 30
      status: isCurrentYear && new Date() < new Date(reportYear, 5, 30) ? 'in_progress' : 'pending',
      tasks: [
        {
          id: 'DATA_001',
          name: 'GHG Inventory',
          description: 'Scope 1/2/3 emission calculation and data collection',
          responsible: 'EHS Dept',
          estimatedHours: 160,
          status: 'pending',
        },
        {
          id: 'DATA_002',
          name: 'Energy Use & Water Resources Data',
          description: 'Electricity consumption, renewable energy, water usage, recycling rates, etc.',
          responsible: 'EHS Dept',
          estimatedHours: 40,
          status: 'pending',
        },
        {
          id: 'DATA_003',
          name: 'Waste & Circular Economy Data',
          description: 'Waste generation, recycling rates, resource circularity measures',
          responsible: 'EHS Dept',
          estimatedHours: 24,
          status: 'pending',
        },
        {
          id: 'DATA_004',
          name: 'Employee Data Collection',
          description: 'Workforce structure, diversity, training, occupational health and safety data',
          responsible: 'HR Dept',
          estimatedHours: 60,
          status: 'pending',
        },
        {
          id: 'DATA_005',
          name: 'Non-Manager Full-Time Employee Salary Statistics',
          description: 'Mean, median, and changes (2025 new requirement)',
          responsible: 'HR Dept',
          estimatedHours: 40,
          status: 'pending',
        },
        {
          id: 'DATA_006',
          name: 'Supply Chain ESG Management Data',
          description: 'Supplier evaluation, auditing, improvement tracking',
          responsible: 'Procurement Dept',
          estimatedHours: 32,
          status: 'pending',
        },
        {
          id: 'DATA_007',
          name: 'Governance & Compliance Data',
          description: 'Board composition, violations, risk management',
          responsible: 'Legal Dept',
          estimatedHours: 24,
          status: 'pending',
        },
      ],
      dependencies: ['Preparation & Planning'],
    },
    {
      phase: 'Report Drafting',
      description: `Complete report first draft in Q2 ${reportYear}`,
      startDate: new Date(reportYear, 3, 1), // Apr 1
      deadline: new Date(reportYear, 5, 15), // Jun 15
      status: 'pending',
      tasks: [
        {
          id: 'WRITE_001',
          name: 'Corporate Overview & Governance Chapter',
          description: 'Organization profile, business performance, governance framework',
          responsible: 'Sustainability Dept',
          estimatedHours: 40,
          status: 'pending',
        },
        {
          id: 'WRITE_002',
          name: 'Environmental Performance Chapter',
          description: 'Climate change, energy, water, waste, circular economy',
          responsible: 'Sustainability Dept',
          estimatedHours: 60,
          status: 'pending',
        },
        {
          id: 'WRITE_003',
          name: 'Social Performance Chapter',
          description: 'Employee welfare, occupational safety, social contribution, customer relations',
          responsible: 'Sustainability Dept',
          estimatedHours: 60,
          status: 'pending',
        },
        {
          id: 'WRITE_004',
          name: 'GRI Indexing',
          description: 'Complete GRI Standards disclosure cross-reference',
          responsible: 'Sustainability Dept',
          estimatedHours: 24,
          status: 'pending',
        },
        {
          id: 'WRITE_005',
          name: 'Graphics & Visual Design',
          description: 'Data charts, infographics, photo layout',
          responsible: 'Design Dept',
          estimatedHours: 40,
          status: 'pending',
        },
      ],
      dependencies: ['Data Collection & Verification'],
    },
    {
      phase: '3rd Party Assurance/Verification',
      description: `Obtain 3rd party assurance/verification in Q2-Q3 ${reportYear}`,
      startDate: new Date(reportYear, 4, 1), // May 1
      deadline: new Date(reportYear, 6, 31), // Jul 31
      status: 'pending',
      tasks: [
        {
          id: 'ASSUR_001',
          name: 'Select Assurance/Verification Body',
          description: 'Qualified with ISO 14065, AA1000AS, or ISAE 3000',
          responsible: 'Sustainability Dept',
          estimatedHours: 16,
          status: 'pending',
        },
        {
          id: 'ASSUR_002',
          name: 'Provide Required Documents',
          description: 'Original data, calculation methods, supporting documents',
          responsible: 'Sustainability Dept',
          estimatedHours: 40,
          status: 'pending',
        },
        {
          id: 'ASSUR_003',
          name: 'Support On-site Verification',
          description: 'Arrange interviews, on-site inventory, document review',
          responsible: 'Sustainability Dept',
          estimatedHours: 80,
          status: 'pending',
        },
        {
          id: 'ASSUR_004',
          name: 'Respond to Findings',
          description: 'Address improvement suggestions and revise report',
          responsible: 'Sustainability Dept',
          estimatedHours: 32,
          status: 'pending',
        },
        {
          id: 'ASSUR_005',
          name: 'Obtain Assurance Statement',
          description: 'Limited or Reasonable assurance statement',
          responsible: 'Sustainability Dept',
          estimatedHours: 8,
          status: 'pending',
        },
      ],
      dependencies: ['Report Drafting'],
    },
    {
      phase: 'Internal Review & Board Approval',
      description: `Complete internal review and board resolution in July ${reportYear}`,
      startDate: new Date(reportYear, 6, 1), // Jul 1
      deadline: new Date(reportYear, 6, 25), // Jul 25
      status: 'pending',
      tasks: [
        {
          id: 'REVIEW_001',
          name: 'Cross-departmental Internal Review',
          description: 'Confirm data accuracy and completeness by departments',
          responsible: 'Sustainability Dept',
          estimatedHours: 40,
          status: 'pending',
        },
        {
          id: 'REVIEW_002',
          name: 'Legal Compliance Review',
          description: 'Confirm conformity with regulatory disclosure requirements',
          responsible: 'Legal Dept',
          estimatedHours: 24,
          status: 'pending',
        },
        {
          id: 'REVIEW_003',
          name: 'Executive Review',
          description: 'Review by General Manager/CSO',
          responsible: 'Management Dept',
          estimatedHours: 16,
          status: 'pending',
        },
        {
          id: 'REVIEW_004',
          name: 'Board Submission',
          description: 'Board resolution approving the sustainability report',
          responsible: 'Board Secretariat',
          estimatedHours: 8,
          status: 'pending',
        },
      ],
      dependencies: ['3rd Party Assurance/Verification'],
    },
    {
      phase: 'Public Disclosure & Filing',
      description: `Complete filing and public disclosure before August 31 ${reportYear}`,
      startDate: new Date(reportYear, 7, 1), // Aug 1
      deadline: new Date(reportYear, 7, 31), // Aug 31 ⚠️ Legal Deadline
      status: 'pending',
      tasks: [
        {
          id: 'DISC_001',
          name: 'Report Finalization & Layout',
          description: 'Final version confirmation, PDF generation',
          responsible: 'Sustainability Dept',
          estimatedHours: 16,
          status: 'pending',
        },
        {
          id: 'DISC_002',
          name: 'Upload to Official Website',
          description: 'Sustainability section or Investor Relations page',
          responsible: 'IT Dept',
          estimatedHours: 4,
          status: 'pending',
        },
        {
          id: 'DISC_003',
          name: 'MOPS Filing',
          description: 'Upload to TWSE/TPEx ESG Digital Platform',
          responsible: 'Finance Dept',
          estimatedHours: 8,
          status: 'pending',
        },
        {
          id: 'DISC_004',
          name: 'Stakeholder Communication',
          description: 'Press releases, investor conferences',
          responsible: 'PR Dept',
          estimatedHours: 16,
          status: 'pending',
        },
        {
          id: 'DISC_005',
          name: 'Completion Self-Check',
          description: 'Confirm all regulatory required items are disclosed',
          responsible: 'Sustainability Dept',
          estimatedHours: 8,
          status: 'pending',
        },
      ],
      dependencies: ['Internal Review & Board Approval'],
    },
  ];
}

/**
 * Regulatory Requirements List
 */
export const REGULATORY_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    framework: 'GRI',
    applicableFrom: 2025,
    mandatory: true,
    description: 'All listed companies must prepare sustainability reports according to GRI Standards',
    references: ['Rules Governing Preparation and Filing of Sustainability Reports by Listed Companies'],
  },
  {
    framework: 'TCFD',
    applicableFrom: 2023,
    mandatory: true,
    description: 'Companies with capital ≥ 10B TWD or in high-emission industries must disclose climate-related information',
    references: ['Corporate Sustainability Development Roadmap'],
  },
  {
    framework: 'SASB',
    applicableFrom: 2025,
    mandatory: false,
    description: 'Recommended disclosure of SASB indicators based on industry characteristics',
    references: ['FSC Sustainability Development Roadmap'],
  },
  {
    framework: 'IFRS_S1',
    applicableFrom: 2026,
    mandatory: true,
    description: 'Phased implementation of IFRS S1 General Requirements for Sustainability-related Disclosures for capital ≥ 10B TWD',
    references: ['FSC Announcement on IPC Adopting IFRS Sustainability Disclosure Standards in 2026'],
  },
  {
    framework: 'IFRS_S2',
    applicableFrom: 2026,
    mandatory: true,
    description: 'Phased implementation of IFRS S2 Climate-related Disclosures for capital ≥ 10B TWD',
    references: ['FSC Announcement on IPC Adopting IFRS Sustainability Disclosure Standards in 2026'],
  },
];

/**
 * Key Milestones Reminders
 */
export interface Milestone {
  name: string;
  date: Date;
  type: 'deadline' | 'important' | 'optional';
  description: string;
  alertDaysBefore: number; // Alerts X days before
}

export function getKeyMilestones(reportYear: number): Milestone[] {
  return [
    {
      name: 'Data Collection Completed',
      date: new Date(reportYear, 5, 30), // 6/30
      type: 'important',
      description: 'All ESG data must be collected and verified',
      alertDaysBefore: 30,
    },
    {
      name: 'Report First Draft Completed',
      date: new Date(reportYear, 6, 15), // 7/15
      type: 'important',
      description: 'Report first draft must be completed for assurance work',
      alertDaysBefore: 14,
    },
    {
      name: 'Board Review Approved',
      date: new Date(reportYear, 6, 25), // 7/25
      type: 'important',
      description: 'Report must be approved by board resolution',
      alertDaysBefore: 7,
    },
    {
      name: 'Statutory Filing Deadline',
      date: new Date(reportYear, 7, 31), // 8/31 ⚠️
      type: 'deadline',
      description: 'Deadline for MOPS filing (statutory)',
      alertDaysBefore: 14,
    },
  ];
}

/**
 * Calculate timeline progress
 */
export function calculateTimelineProgress(phases: TimelinePhase[]): {
  overall: number;
  byPhase: { [phase: string]: number };
  completedTasks: number;
  totalTasks: number;
  onSchedule: boolean;
} {
  let completedTasks = 0;
  let totalTasks = 0;
  const byPhase: { [phase: string]: number } = {};

  phases.forEach(phase => {
    const phaseCompleted = phase.tasks.filter(t => t.status === 'completed').length;
    const phaseTotal = phase.tasks.length;

    completedTasks += phaseCompleted;
    totalTasks += phaseTotal;

    byPhase[phase.phase] = phaseTotal > 0 ? (phaseCompleted / phaseTotal) * 100 : 0;
  });

  const overall = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Check if on schedule
  const now = new Date();
  const onSchedule = phases.every(phase => {
    if (now < phase.startDate) return true; // Not started
    if (now > phase.deadline && phase.status !== 'completed') return false; // Overdue
    return true;
  });

  return {
    overall,
    byPhase,
    completedTasks,
    totalTasks,
    onSchedule,
  };
}

/**
 * Risk Alerts
 */
export function getRiskAlerts(
  company: CompanyProfile,
  phases: TimelinePhase[],
  reportYear: number
): {
  level: 'critical' | 'warning' | 'info';
  message: string;
  action: string;
}[] {
  const alerts: any[] = [];
  const now = new Date();
  const deadline = new Date(reportYear, 7, 31); // 8/31
  const daysToDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Check if close to deadline
  if (daysToDeadline <= 14 && daysToDeadline > 0) {
    alerts.push({
      level: 'critical',
      message: `${daysToDeadline} days remaining until statutory filing deadline (8/31)`,
      action: 'Immediately review progress across all phases to ensure timely filing',
    });
  }

  // Check overdue phases
  const overdue = phases.filter(p => now > p.deadline && p.status !== 'completed');
  if (overdue.length > 0) {
    alerts.push({
      level: 'critical',
      message: `${overdue.length} phases are overdue: ${overdue.map(p => p.phase).join(', ')}`,
      action: 'Initiate emergency measures immediately and reallocate resources',
    });
  }

  // Check carbon inventory requirements
  const timeline = getTimelinePhase(company.paidInCapital, company.isHighEmission);
  if (reportYear >= timeline.ghgInventoryYear) {
    const ghgTask = phases.flatMap(p => p.tasks).find(t => t.id === 'DATA_001');

    if (ghgTask && ghgTask.status !== 'completed') {
      alerts.push({
        level: 'warning',
        message: `Based on capital of ${company.paidInCapital}B TWD, GHG inventory must be completed in ${reportYear}`,
        action: 'Compete Scope 1/2/3 inventory as soon as possible',
      });
    }
  }

  // Check assurance requirements
  if (reportYear >= timeline.ghgAssuranceYear) {
    const assurancePhase = phases.find(p => p.phase === '3rd Party Assurance/Verification');
    if (assurancePhase && assurancePhase.status !== 'completed') {
      alerts.push({
        level: 'warning',
        message: `As per regulations, 3rd party assurance/verification must be obtained in ${reportYear}`,
        action: 'Immediately contact qualified assurance/verification bodies to arrange查證',
      });
    }
  }

  return alerts;
}
