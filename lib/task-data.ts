/**
 * ESG GO | 任務管理與工作流數據模型
 */

export interface ESGTask {
  id: string;
  title: string;
  department: 'HR' | 'Finance' | 'EHS' | 'Admin' | 'Legal';
  griMapping: string;
  status: 'Todo' | 'Processing' | 'Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  progress: number;
}

export const departmentTasks: ESGTask[] = [
  { id: 'TSK-001', title: '範疇一直接排放量盤查', department: 'EHS', griMapping: 'GRI 305-1', status: 'Processing', priority: 'High', deadline: '2025-05-10', progress: 65 },
  { id: 'TSK-002', title: '年度員工薪酬平等性分析', department: 'HR', griMapping: 'GRI 405-2', status: 'Todo', priority: 'Medium', deadline: '2025-06-15', progress: 0 },
  { id: 'TSK-003', title: '董事會績效評估報告上傳', department: 'Legal', griMapping: 'GRI 2-18', status: 'Review', priority: 'High', deadline: '2025-05-01', progress: 90 },
  { id: 'TSK-004', title: '再生能源採購憑證 (T-REC) 匯總', department: 'Admin', griMapping: 'GRI 302-1', status: 'Completed', priority: 'Medium', deadline: '2025-04-20', progress: 100 },
  { id: 'TSK-005', title: '供應商 ESG 承諾書簽署追蹤', department: 'Finance', griMapping: 'GRI 308-1', status: 'Processing', priority: 'Low', deadline: '2025-05-30', progress: 30 },
];

export const getStatusColor = (status: string) => {
  switch (status) {\n    case 'Todo': return 'bg-slate-100 text-slate-500 border-slate-200';\n    case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';\n    case 'Review': return 'bg-amber-50 text-amber-600 border-amber-100';\n    case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';\n    default: return 'bg-slate-50 text-slate-400';\n  }\n};