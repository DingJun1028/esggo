import { type QPIScoreInput } from '@/lib/qpi/score';
import { computeQPIScore } from '@/lib/qpi/computation';

export const POST = async (request: Request) => {
  const body = (await request.json().catch(() => ({}))) as Partial<QPIScoreInput>;
  const categories = body.categories ?? ['E', 'S', 'G'];
  const companyId = body.companyId;
  const year = body.year ?? new Date().getFullYear();

  try {
    const result = await computeQPIScore({ categories, companyId, year });
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('[QPI] score computation failed:', error);
    return Response.json({ error: 'Failed to compute QPI score' }, { status: 500 });
  }
};
