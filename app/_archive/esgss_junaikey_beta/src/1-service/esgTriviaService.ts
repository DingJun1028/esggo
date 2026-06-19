/**
// Classified under: 平台體驗層 (Platform Experience Layer) & 靈性智能層 (Cognitive Intelligence Layer)
 * ESG 益智問答服務
 * ESG Trivia Service
 *
 * 處理問答生成、驗證與卡片解鎖邏輯
 */

import {
  type TriviaQuestion,
  TriviaDifficulty,
  type QuizChallenge,
  type OmniCard,
  Rarity,
} from '../../shared/types';
import { ESG_TRIVIA_QUESTIONS } from '../data/esgTrivia';
// import { partnerImport } from './partnerImportExport'; // 雖然這裡沒直接用，但模擬服務交互

export class ESGTriviaService {
  /**
   * 為特定卡片生成解鎖挑戰
   */
  generateChallengeForCard(partnerId: string, card: OmniCard): QuizChallenge {
    const difficulty = this.getDifficultyForRarity(card.rarity);
    const questions = this.getRandomQuestions(difficulty, 3); // 3題

    return {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      partnerId,
      targetCardId: card.id,
      difficulty,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startedAt: new Date(),
      passed: false,
    };
  }

  /**
   * 提交答案
   */
  submitAnswer(
    challenge: QuizChallenge,
    answerIndex: number
  ): {
    isCorrect: boolean;
    explanation: string;
    challenge: QuizChallenge;
    finished: boolean;
  } {
    const currentQ = challenge.questions[challenge.currentQuestionIndex];

    // Safety check
    if (!currentQ) {
      throw new Error(`Question not found at index ${challenge.currentQuestionIndex}`);
    }

    const isCorrect = currentQ.correctAnswer === answerIndex;

    // 記錄答案
    challenge.answers.push(answerIndex);
    if (isCorrect) {
      challenge.score += 1;
    }

    const explanation = currentQ.explanation;
    const totalQuestions = challenge.questions.length;

    // 檢查是否結束
    challenge.currentQuestionIndex += 1;
    const finished = challenge.currentQuestionIndex >= totalQuestions;

    if (finished) {
      challenge.completedAt = new Date();
      // 需要全對才能解鎖卡片 (或者根據設定)
      challenge.passed = challenge.score === totalQuestions;
    }

    return {
      isCorrect,
      explanation,
      challenge,
      finished,
    };
  }

  /**
   * 根據稀有度決定難度
   */
  private getDifficultyForRarity(rarity: Rarity): TriviaDifficulty {
    switch (rarity) {
      case Rarity.COMMON:
      case Rarity.UNCOMMON:
        return TriviaDifficulty.EASY;
      case Rarity.RARE:
      case Rarity.EPIC:
        return TriviaDifficulty.MEDIUM;
      case Rarity.LEGENDARY:
        return TriviaDifficulty.HARD;
      case Rarity.MYTHIC:
        return TriviaDifficulty.MASTER;
      default:
        return TriviaDifficulty.EASY;
    }
  }

  /**
   * 隨機獲取題目
   */
  private getRandomQuestions(difficulty: TriviaDifficulty, count: number): TriviaQuestion[] {
    const pool = ESG_TRIVIA_QUESTIONS.filter(q => q.difficulty === difficulty);

    // 如果題目不夠，補充簡單題目
    if (pool.length < count) {
      const easyPool = ESG_TRIVIA_QUESTIONS.filter(q => q.difficulty === TriviaDifficulty.EASY);
      pool.push(...easyPool);
    }

    // Fisher-Yates Shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i] as TriviaQuestion;
      shuffled[i] = shuffled[j] as TriviaQuestion;
      shuffled[j] = temp;
    }

    return shuffled.slice(0, count);
  }
}

export const triviaService = new ESGTriviaService();
export default triviaService;
