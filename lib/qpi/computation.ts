import { type QPIScoreInput, type QPIScoreResult } from './score';

export async function computeQPIScore(input: QPIScoreInput): Promise<QPIScoreResult> {
  const baseScores: Record<string, number> = {
    E: Math.round(Math.random() * 30 + 50),
    S: Math.round(Math.random() * 30 + 50),
    G: Math.round(Math.random() * 30 + 50),
  };

  const categoryScores: Record<string, number> = {};
  let total = 0;

  for (const cat of input.categories ?? ['E', 'S', 'G']) {
    const score = baseScores[cat] ?? Math.round(Math.random() * 30 + 50);
    categoryScores[cat] = score;
    total += score;
  }

  const qpiScore = Math.round(total / Math.max(1, Object.keys(categoryScores).length));
  const recommendation =
    qpiScore >= 70 ? 'Continue current ESG strategy.' : 'Review and improve ESG practices.';

  return { qpiScore, categoryScores, recommendation };
}
