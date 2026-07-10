import { NextRequest } from 'next/server';
import { getAnswersByCompany, QUESTIONS } from '@/core/repositories/sustain-write-answer-database';
import { createHash } from 'crypto';
import { jsonResponse, jsonError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');
  if (!companyId) {
    return jsonError('INVALID_PARAMS', 'Missing companyId', 400);
  }

  const answers = getAnswersByCompany(companyId);
  if (!answers || answers.length === 0) {
    return jsonResponse({ evidence: [] });
  }

  const evidenceList = answers.map((ans, index) => {
    const q = QUESTIONS.find((q) => q.questionId === ans.questionId);
    
    // HashLock for simulation of ZKP seal
    const payload = JSON.stringify({
      uuid: ans.questionId,
      timestamp: Date.now(),
      company: ans.companyId
    });
    const hashLock = createHash('sha256').update(payload).digest('hex');

    return {
      id: ans.questionId || `ev-${index}`,
      chapter: ans.chapter,
      receiptName: ans.evidence || q?.evidence || '未指定佐證文件',
      why: q?.whyToFill || '確保符合 GRI 準則與 5T 驗證標準，提升資料可溯源性。',
      what: q?.whatToFill || ans.answer?.substring(0, 50) + '...' || '無說明',
      how: q?.aiHelp || '可透過內部管理系統或第三方查驗機構取得相關數據。',
      tags: [ans.chapter.split(' ')[0], q?.griMapping || 'ESG'].filter(Boolean),
      hashLock
    };
  });

  return jsonResponse({ evidence: evidenceList });
}
