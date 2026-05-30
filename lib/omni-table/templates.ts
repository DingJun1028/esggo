/**
 * ESG Datasheet Templates
 * ═══════════════════════
 * Pre-defined field structures for common ESG data collection needs.
 */

export interface ESGTemplate {
  id: string;
  name: string;
  nameZh: string;
  category: 'E' | 'S' | 'G';
  description: string;
  fields: Array<{ name: string; type: string; property?: Record<string, unknown> }>;
}

export const ESG_TEMPLATES: ESGTemplate[] = [
  {
    id: 'carbon-emissions',
    name: 'Carbon Emissions Tracker',
    nameZh: '碳排放追蹤',
    category: 'E',
    description: 'Track Scope 1/2/3 greenhouse gas emissions by facility and period',
    fields: [
      { name: 'Facility', type: 'SingleText' },
      { name: 'Reporting Period', type: 'SingleText' },
      { name: 'Scope 1 (tCO2e)', type: 'Number', property: { precision: 2 } },
      { name: 'Scope 2 (tCO2e)', type: 'Number', property: { precision: 2 } },
      { name: 'Scope 3 (tCO2e)', type: 'Number', property: { precision: 2 } },
      { name: 'Data Source', type: 'SingleText' },
      { name: 'Verified', type: 'Checkbox' },
      { name: 'Notes', type: 'Text' },
    ],
  },
  {
    id: 'energy-consumption',
    name: 'Energy Consumption',
    nameZh: '能源消耗',
    category: 'E',
    description: 'Monitor electricity, natural gas, and renewable energy usage',
    fields: [
      { name: 'Location', type: 'SingleText' },
      { name: 'Month', type: 'SingleText' },
      { name: 'Electricity (kWh)', type: 'Number', property: { precision: 0 } },
      { name: 'Natural Gas (m³)', type: 'Number', property: { precision: 0 } },
      { name: 'Renewable %', type: 'Number', property: { precision: 1 } },
      { name: 'Cost (TWD)', type: 'Currency', property: { symbol: 'NT$' } },
      { name: 'Status', type: 'SingleSelect', property: { options: [{ name: 'On Track' }, { name: 'Over Target' }, { name: 'Under Review' }] } },
    ],
  },
  {
    id: 'water-waste',
    name: 'Water & Waste Management',
    nameZh: '水資源與廢棄物',
    category: 'E',
    description: 'Track water withdrawal, discharge, and waste generation metrics',
    fields: [
      { name: 'Site', type: 'SingleText' },
      { name: 'Period', type: 'SingleText' },
      { name: 'Water Withdrawn (m³)', type: 'Number', property: { precision: 0 } },
      { name: 'Water Recycled (m³)', type: 'Number', property: { precision: 0 } },
      { name: 'Hazardous Waste (kg)', type: 'Number', property: { precision: 0 } },
      { name: 'Non-Hazardous Waste (kg)', type: 'Number', property: { precision: 0 } },
      { name: 'Recycling Rate %', type: 'Number', property: { precision: 1 } },
    ],
  },
  {
    id: 'employee-diversity',
    name: 'Employee Diversity & Inclusion',
    nameZh: '員工多元包容',
    category: 'S',
    description: 'Track workforce demographics and diversity metrics',
    fields: [
      { name: 'Department', type: 'SingleText' },
      { name: 'Total Headcount', type: 'Number', property: { precision: 0 } },
      { name: 'Female %', type: 'Number', property: { precision: 1 } },
      { name: 'Management Female %', type: 'Number', property: { precision: 1 } },
      { name: 'Disability %', type: 'Number', property: { precision: 1 } },
      { name: 'Training Hours/Person', type: 'Number', property: { precision: 1 } },
      { name: 'Turnover Rate %', type: 'Number', property: { precision: 1 } },
    ],
  },
  {
    id: 'workplace-safety',
    name: 'Workplace Safety',
    nameZh: '職場安全',
    category: 'S',
    description: 'Occupational health and safety incident tracking',
    fields: [
      { name: 'Site', type: 'SingleText' },
      { name: 'Year', type: 'SingleText' },
      { name: 'Total Working Hours', type: 'Number', property: { precision: 0 } },
      { name: 'Lost Time Injuries', type: 'Number', property: { precision: 0 } },
      { name: 'LTIFR', type: 'Number', property: { precision: 2 } },
      { name: 'Near Misses', type: 'Number', property: { precision: 0 } },
      { name: 'Fatalities', type: 'Number', property: { precision: 0 } },
      { name: 'Safety Training %', type: 'Number', property: { precision: 1 } },
    ],
  },
  {
    id: 'board-governance',
    name: 'Board Governance',
    nameZh: '董事會治理',
    category: 'G',
    description: 'Board composition, independence, and meeting metrics',
    fields: [
      { name: 'Director Name', type: 'SingleText' },
      { name: 'Role', type: 'SingleSelect', property: { options: [{ name: 'Chairman' }, { name: 'Independent Director' }, { name: 'Executive Director' }] } },
      { name: 'Independent', type: 'Checkbox' },
      { name: 'Tenure (Years)', type: 'Number', property: { precision: 0 } },
      { name: 'Meeting Attendance %', type: 'Number', property: { precision: 1 } },
      { name: 'Committee', type: 'SingleText' },
      { name: 'ESG Expertise', type: 'Checkbox' },
    ],
  },
  {
    id: 'compliance-audit',
    name: 'Compliance & Audit Log',
    nameZh: '合規審計',
    category: 'G',
    description: 'Track regulatory compliance status and audit findings',
    fields: [
      { name: 'Regulation', type: 'SingleText' },
      { name: 'Status', type: 'SingleSelect', property: { options: [{ name: 'Compliant' }, { name: 'Non-Compliant' }, { name: 'In Progress' }, { name: 'Under Review' }] } },
      { name: 'Last Audit Date', type: 'SingleText' },
      { name: 'Finding', type: 'Text' },
      { name: 'Severity', type: 'SingleSelect', property: { options: [{ name: 'Critical' }, { name: 'Major' }, { name: 'Minor' }, { name: 'Observation' }] } },
      { name: 'Corrective Action', type: 'Text' },
      { name: 'Due Date', type: 'SingleText' },
      { name: 'Resolved', type: 'Checkbox' },
    ],
  },
];

export function getTemplatesByCategory(category: 'E' | 'S' | 'G') {
  return ESG_TEMPLATES.filter(t => t.category === category);
}
