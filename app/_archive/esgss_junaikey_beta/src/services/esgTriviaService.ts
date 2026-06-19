/**
// Classified under: Platform Experience Layer & Cognitive Intelligence Layer
 * ESG Trivia Service
 *
 * Handles trivia generation, verification, and card unlocking logic
 */

import {
  type TriviaQuestion,
  TriviaDifficulty,
  type QuizChallenge,
  type OmniCard,
  PartnerRarity as Rarity,
} from '../types/aiPartner.js';
import { ESG_TRIVIA_QUESTIONS } from '../data/esgTrivia.js';
// import { partnerImport } from './partnerImportExport.js'; // Although not used directly here, simulates service interaction

export class ESGTriviaService {
  /**
   * Generates unlock challenge for a specific card
   */
  generateChallengeForCard(partnerId: string, card: OmniCard): QuizChallenge {
    const difficulty = this.getDifficultyForRarity(card.rarity);
    const questions = this.getRandomQuestions(difficulty, 3); // 3 questions

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
   * Submit answer
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

    // Record answer
    challenge.answers.push(answerIndex);
    if (isCorrect) {
      challenge.score += 1;
    }

    const explanation = currentQ.explanation;
    const totalQuestions = challenge.questions.length;

    // Check if finished
    challenge.currentQuestionIndex += 1;
    const finished = challenge.currentQuestionIndex >= totalQuestions;

    if (finished) {
      challenge.completedAt = new Date();
      // Requires all correct to unlock card (or based on settings)
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
   * Determines difficulty based on rarity
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
   * Get random questions
   */
  private getRandomQuestions(difficulty: TriviaDifficulty, count: number): TriviaQuestion[] {
    const pool = ESG_TRIVIA_QUESTIONS.filter(q => q.difficulty === difficulty);

    // If not enough questions, supplement with easy questions
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
