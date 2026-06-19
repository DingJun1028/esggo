// Learning service for knowledge management and team learning
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  type: 'article' | 'tutorial' | 'best_practice' | 'case_study' | 'research';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedItems: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  items: string[]; // Knowledge item IDs
  estimatedHours: number;
  prerequisites: string[];
  skills: string[];
  progress: { [userId: string]: { completedItems: string[]; currentItem: string } };
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  passingScore: number;
  relatedKnowledge: string[]; // Knowledge item IDs
}

export class LearningService {
  private knowledgeBase: Map<string, KnowledgeItem> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private userProgress: Map<
    string,
    { [itemId: string]: { completed: boolean; score?: number; completedAt?: Date } }
  > = new Map();

  // Knowledge management
  addKnowledgeItem(
    item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>
  ): string {
    const id = crypto.randomUUID();
    const now = new Date();
    const fullItem: KnowledgeItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
      relatedItems: item.relatedItems || [],
    };
    this.knowledgeBase.set(id, fullItem);
    return id;
  }

  getKnowledgeItem(id: string): KnowledgeItem | undefined {
    return this.knowledgeBase.get(id);
  }

  updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): boolean {
    const item = this.knowledgeBase.get(id);
    if (!item) return false;

    this.knowledgeBase.set(id, {
      ...item,
      ...updates,
      updatedAt: new Date(),
    });
    return true;
  }

  deleteKnowledgeItem(id: string): boolean {
    return this.knowledgeBase.delete(id);
  }

  searchKnowledge(
    query: string,
    filters?: { category?: string; type?: string; difficulty?: string; tags?: string[] }
  ): KnowledgeItem[] {
    const items = Array.from(this.knowledgeBase.values());

    return items.filter(item => {
      // Text search
      const searchText = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      if (!searchText.includes(query.toLowerCase())) return false;

      // Filters
      if (filters?.category && item.category !== filters.category) return false;
      if (filters?.type && item.type !== filters.type) return false;
      if (filters?.difficulty && item.difficulty !== filters.difficulty) return false;
      if (filters?.tags && !filters.tags.some(tag => item.tags.includes(tag))) return false;

      return true;
    });
  }

  // Learning paths
  createLearningPath(path: Omit<LearningPath, 'id' | 'progress'>): string {
    const id = crypto.randomUUID();
    const fullPath: LearningPath = {
      ...path,
      id,
      progress: {},
    };
    this.learningPaths.set(id, fullPath);
    return id;
  }

  getLearningPath(id: string): LearningPath | undefined {
    return this.learningPaths.get(id);
  }

  getRecommendedPaths(userId: string, userSkills: string[]): LearningPath[] {
    const paths = Array.from(this.learningPaths.values());

    return paths
      .filter(path => {
        // Check if user has prerequisites
        const hasPrerequisites = path.prerequisites.every(skill => userSkills.includes(skill));
        // Check if path teaches new skills
        const teachesNewSkills = path.skills.some(skill => !userSkills.includes(skill));

        return hasPrerequisites && teachesNewSkills;
      })
      .sort((a, b) => {
        // Sort by number of new skills taught
        const aNewSkills = a.skills.filter(skill => !userSkills.includes(skill)).length;
        const bNewSkills = b.skills.filter(skill => !userSkills.includes(skill)).length;
        return bNewSkills - aNewSkills;
      });
  }

  // User progress tracking
  updateUserProgress(userId: string, itemId: string, completed: boolean, score?: number): void {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {});
    }

    const userProgress = this.userProgress.get(userId)!;
    userProgress[itemId] = {
      completed,
      score,
      completedAt: completed ? new Date() : undefined,
    };
  }

  getUserProgress(userId: string): {
    [itemId: string]: { completed: boolean; score?: number; completedAt?: Date };
  } {
    return this.userProgress.get(userId) || {};
  }

  getUserSkillLevel(userId: string, skill: string): number {
    const progress = this.getUserProgress(userId);
    const completedItems = Object.entries(progress)
      .filter(([, p]) => p.completed)
      .map(([id]) => this.knowledgeBase.get(id))
      .filter(item => item && item.tags.includes(skill));

    // Simple skill level calculation based on completed items
    return Math.min(completedItems.length * 10, 100);
  }

  // Quizzes and assessments
  createQuiz(quiz: Omit<Quiz, 'id'>): string {
    const id = crypto.randomUUID();
    this.quizzes.set(id, { ...quiz, id });
    return id;
  }

  takeQuiz(
    userId: string,
    quizId: string,
    answers: number[]
  ): { score: number; passed: boolean; feedback: string[] } {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let correct = 0;
    const feedback: string[] = [];

    quiz.questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        feedback.push(`Question ${index + 1}: ${q.explanation}`);
      }
    });

    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    // Update user progress
    if (passed) {
      quiz.relatedKnowledge.forEach(itemId => {
        this.updateUserProgress(userId, itemId, true, score);
      });
    }

    return { score, passed, feedback };
  }

  // Analytics and insights
  getLearningAnalytics(userId: string): {
    totalItemsCompleted: number;
    averageScore: number;
    skillsLearned: string[];
    timeSpent: number; // simulated
    learningStreak: number;
  } {
    const progress = this.getUserProgress(userId);
    const completedItems = Object.values(progress).filter(p => p.completed);

    const skills = new Set<string>();
    completedItems.forEach(() => {
      // In real implementation, extract skills from completed items
      skills.add('ESG Management');
    });

    return {
      totalItemsCompleted: completedItems.length,
      averageScore:
        completedItems.reduce((sum, p) => sum + (p.score || 0), 0) / completedItems.length || 0,
      skillsLearned: Array.from(skills),
      timeSpent: completedItems.length * 2, // simulated hours
      learningStreak: 5, // simulated
    };
  }
}

export const learningService = new LearningService();
