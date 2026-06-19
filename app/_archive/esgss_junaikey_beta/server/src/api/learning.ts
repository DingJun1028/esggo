import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Lazy init wrapper
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getModel = () => {
  const genAI = getGenAI();
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// Mock learning data (replace with database in production)
const mockLearningPaths: any = {
  'user-1': {
    currentPath: 'esg-fundamentals',
    progress: 75,
    completedModules: ['environment-basics', 'social-responsibility'],
    nextModules: ['governance-ethics', 'carbon-footprint-calculation'],
    preferences: {
      learningStyle: 'interactive',
      pace: 'moderate',
      focusAreas: ['environment', 'governance'],
    },
    achievements: [
      {
        id: 'first-lesson',
        name: 'First Step',
        date: '2026-01-01',
      },
      { id: 'esg-explorer', name: 'ESG Explorer', date: '2026-01-02' },
    ],
  },
};

const mockCourses = [
  {
    id: 'esg-fundamentals',
    title: 'ESG Fundamentals',
    description:
      'A comprehensive introduction to Environmental, Social, and Governance principles.',
    modules: [
      { id: 'environment-basics', title: 'Environment Basics', duration: 30, completed: true },
      {
        id: 'social-responsibility',
        title: 'Social Responsibility',
        duration: 45,
        completed: true,
      },
      { id: 'governance-ethics', title: 'Governance & Ethics', duration: 40, completed: false },
      {
        id: 'carbon-footprint-calculation',
        title: 'Carbon Footprint Calculation',
        duration: 60,
        completed: false,
      },
    ],
  },
];

// Helper functions declared early
async function generateLearningRecommendations(userData: any) {
  try {
    const prompt = `
      Act as an ESG education expert, Awakened by the Eternal Secret.
      Core Philosophy:
      - **Self-Awareness**: Help the user reflect on their gaps.
      - **Enlightening**: Encourage sharing knowledge.
      - **Self-Reliance**: Promote independent problem solving.
      - **Altruism**: Connect learning to ecosystem benefits.

      Current Progress: ${userData.progress}%
      Completed Modules: ${userData.completedModules.join(', ')}
      Preferences: ${JSON.stringify(userData.preferences)}
      Achievements: ${userData.achievements.map((a: any) => a.name).join(', ')}

      Please provide:
      1. Next recommended module (prioritize "Governance" for stability).
      2. Motivational feedback (Enlightened tone).
      3. A fun fact (Eco-centric).
    `;

    const model = getModel();
    if (!model) return 'AI Learning Assistant Unavailable';
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Learning recommendation failed:', error);
    return [
      'Focus on Governance basics next.',
      'Keep up the great work!',
      'Did you know ESG investing is growing rapidly?',
    ];
  }
}

async function generateLearningPath(userId: string) {
  // Generate personalized learning path based on user profile
  return {
    currentPath: 'esg-fundamentals',
    progress: 0,
    completedModules: [],
    nextModules: ['environment-basics', 'social-responsibility', 'governance-ethics'],
    preferences: {
      learningStyle: 'interactive',
      pace: 'moderate',
      focusAreas: ['environment', 'social'],
    },
    achievements: [],
  };
}

async function checkAchievements(userId: string, userData: any) {
  const newAchievements: any[] = [];

  // Check for new achievements
  if (
    userData.completedModules.length >= 3 &&
    !userData.achievements.some((a: any) => a.id === 'module-master')
  ) {
    newAchievements.push({
      id: 'module-master',
      name: 'Module Master',
      date: new Date().toISOString(),
      description: 'Completed 3 modules successfully',
    });
  }

  if (
    userData.progress >= 75 &&
    !userData.achievements.some((a: any) => a.id === 'progress-champion')
  ) {
    newAchievements.push({
      id: 'progress-champion',
      name: 'Progress Champion',
      date: new Date().toISOString(),
      description: 'Reached 75% course completion',
    });
  }

  userData.achievements.push(...newAchievements);
  return newAchievements;
}

async function generateAssessment(moduleId: string, userId: string) {
  // Generate mock assessment
  return {
    moduleId,
    userId,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does the E in ESG stand for?',
        options: ['Environment', 'Economy', 'Education', 'Energy'],
        correctAnswer: 0,
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Carbon footprint calculation is essential for environmental auditing.',
        correctAnswer: true,
      },
    ],
    timeLimit: 600, // 10 minutes
    passingScore: 70,
  };
}

async function generateLearningAnalytics(userData: any) {
  return {
    overallProgress: userData.progress,
    completionRate: userData.completedModules.length,
    averageSessionTime: 45, // minutes
    strengths: ['Environmental Science', 'Social Ethics'],
    improvementAreas: ['Governance Structures', 'Carbon Auditing'],
    predictedCompletion: '2026-02-15',
    recommendations: [
      'Review Governance basics',
      'Practice Carbon calculation',
      'Read enhanced ESG reports',
    ],
  };
}

// Get personalized learning path
router.get('/path/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    let userData = mockLearningPaths[userId];

    if (!userData) {
      // Generate new learning path for new user
      const newPath = await generateLearningPath(userId);
      mockLearningPaths[userId] = newPath;
      userData = newPath;
    }

    const pathData = mockLearningPaths[userId];
    const course = mockCourses.find(c => c.id === pathData.currentPath);

    return res.json({
      success: true,
      data: {
        ...pathData,
        course,
        recommendations: await generateLearningRecommendations(pathData),
      },
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning path',
    });
  }
});

// Update learning progress
router.put('/progress/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const { moduleId, progress, completed } = req.body;

    if (!mockLearningPaths[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User learning data not found',
      });
    }

    const userData = mockLearningPaths[userId];

    // Update module progress
    if (completed) {
      if (!userData.completedModules.includes(moduleId)) {
        userData.completedModules.push(moduleId);
      }
      // Remove from next modules
      userData.nextModules = userData.nextModules.filter((m: string) => m !== moduleId);
    }

    // Recalculate overall progress
    const totalModules = mockCourses.find(c => c.id === userData.currentPath)?.modules.length || 1;
    userData.progress = Math.round((userData.completedModules.length / totalModules) * 100);

    // Check for achievements
    const newAchievements = await checkAchievements(userId, userData);

    return res.json({
      success: true,
      data: {
        ...userData,
        newAchievements,
      },
    });
  } catch (error) {
    console.error('Update learning progress error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update learning progress',
    });
  }
});

// Get course catalog
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const categoryQuery = req.query.category;
    const levelQuery = req.query.level;
    const category = Array.isArray(categoryQuery)
      ? String(categoryQuery[0])
      : String(categoryQuery || '');
    const level = Array.isArray(levelQuery) ? String(levelQuery[0]) : String(levelQuery || '');

    let filteredCourses = mockCourses;

    if (category) {
      filteredCourses = filteredCourses.filter(c =>
        c.modules.some(m => m.title.toLowerCase().includes(category.toLowerCase()))
      );
    }

    return res.json({
      success: true,
      data: {
        courses: filteredCourses,
        total: filteredCourses.length,
        filters: { category, level },
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve courses',
    });
  }
});

// Get course details
router.get('/courses/:courseId', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = mockCourses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    return res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve course details',
    });
  }
});

// Generate quiz/assessment
router.post('/assessment/:moduleId', async (req: Request, res: Response) => {
  try {
    const moduleId = String(req.params.moduleId);
    const userId = String(req.body.userId);

    const assessment = await generateAssessment(moduleId, userId);

    return res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Generate assessment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate assessment',
    });
  }
});

// Get learning analytics
router.get('/analytics/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const userData = mockLearningPaths[userId];

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'User learning data not found',
      });
    }

    const analytics = await generateLearningAnalytics(userData);

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Get learning analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate learning analytics',
    });
  }
});

export default router;
