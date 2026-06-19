import { Task } from './types';

export class CaseHandler {
  async route(task: Task): Promise<string> {
    // Simple routing logic based on keywords
    const content = task.content.toLowerCase();
    
    if (content.includes('優化') || content.includes('代碼') || content.includes('code')) {
      return 'CODE_OPTIMIZATION';
    }
    if (content.includes('分析') || content.includes('數據') || content.includes('data')) {
      return 'DATA_ANALYSIS';
    }
    if (content.includes('報告') || content.includes('report') || content.includes('esg')) {
      return 'REPORT_GENERATION';
    }
    
    return 'GENERAL_TASK';
  }
}
