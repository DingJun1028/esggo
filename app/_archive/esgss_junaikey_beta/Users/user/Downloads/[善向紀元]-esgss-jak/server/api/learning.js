// Learning Management API Routes
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize AI for learning recommendations
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Mock learning data (replace with database in production)
const mockLearningPaths = {
  'user-1': {
    currentPath: 'esg-fundamentals',
    progress: 75,
    completedModules: ['environment-basics', 'social-responsibility'],
    nextModules: ['governance-ethics', 'carbon-footprint-calculation'],
    preferences: {
      learningStyle: 'interactive',
      pace: 'moderate',
      focusAreas: ['environment', 'governance']
    },
    achievements: [
      { id: 'first-lesson', name: '第一課完成', date: '2026-01-01' },
      { id: 'esg-explorer', name: 'ESG探索者', date: '2026-01-02' }
    ]
  }
};

const mockCourses = [
  {
    id: 'esg-fundamentals',
    title: 'ESG基礎課程',
    description: '了解環境、社會、治理的基本概念',
    modules: [
      { id: 'environment-basics', title: '環境基礎', duration: 30, completed: true },
      { id: 'social-responsibility', title: '社會責任', duration: 45, completed: true },
      { id: 'governance-ethics', title: '治理倫理', duration: 40, completed: false },
      { id: 'carbon-footprint-calculation', title: '碳足跡計算', duration: 60, completed: false }
    ]
  }
];

// Get personalized learning path
router.get('/path/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = mockLearningPaths[userId];

    if (!userData) {
      // Generate new learning path for new user
      const newPath = await generateLearningPath(userId);
      mockLearningPaths[userId] = newPath;
    }

    const pathData = mockLearningPaths[userId];
    const course = mockCourses.find(c => c.id === pathData.currentPath);

    res.json({
      success: true,
      data: {
        ...pathData,
        course,
        recommendations: await generateLearningRecommendations(pathData)
      }
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning path'
    });
  }
});

// Update learning progress
router.put('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { moduleId, progress, completed } = req.body;

    if (!mockLearningPaths[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User learning data not found'
      });
    }

    const userData = mockLearningPaths[userId];

    // Update module progress
    if (completed) {
      if (!userData.completedModules.includes(moduleId)) {
        userData.completedModules.push(moduleId);
      }
      // Remove from next modules
      userData.nextModules = userData.nextModules.filter(m => m !== moduleId);
    }

    // Recalculate overall progress
    const totalModules = mockCourses.find(c => c.id === userData.currentPath)?.modules.length || 1;
    userData.progress = Math.round((userData.completedModules.length / totalModules) * 100);

    // Check for achievements
    const newAchievements = await checkAchievements(userId, userData);

    res.json({
      success: true,
      data: {
        ...userData,
        newAchievements
      }
    });
  } catch (error) {
    console.error('Update learning progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update learning progress'
    });
  }
});

// Get course catalog
router.get('/courses', async (req, res) => {
  try {
    const { category, level } = req.query;

    let filteredCourses = mockCourses;

    if (category) {
      filteredCourses = filteredCourses.filter(c =>
        c.modules.some(m => m.title.toLowerCase().includes(category.toLowerCase()))
      );
    }

    res.json({
      success: true,
      data: {
        courses: filteredCourses,
        total: filteredCourses.length,
        filters: { category, level }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve courses'
    });
  }
});

// Get course details
router.get('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = mockCourses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve course details'
    });
  }
});

// Generate quiz/assessment
router.post('/assessment/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { userId } = req.body;

    const assessment = await generateAssessment(moduleId, userId);

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Generate assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate assessment'
    });
  }
});

// Get learning analytics
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = mockLearningPaths[userId];

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'User learning data not found'
      });
    }

    const analytics = await generateLearningAnalytics(userData);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get learning analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate learning analytics'
    });
  }
});

// Helper functions
async function generateLearningPath(userId) {
  // Generate personalized learning path based on user profile
  return {
    currentPath: 'esg-fundamentals',
    progress: 0,
    completedModules: [],
    nextModules: ['environment-basics', 'social-responsibility', 'governance-ethics'],
    preferences: {
      learningStyle: 'interactive',
      pace: 'moderate',
      focusAreas: ['environment', 'social']
    },
    achievements: []
  };
}

async function generateLearningRecommendations(userData) {
  try {
    const prompt = `
      基於用戶學習數據，生成個人化學習建議：

      當前進度：${userData.progress}%
      已完成模組：${userData.completedModules.join(', ')}
      學習偏好：${JSON.stringify(userData.preferences)}
      成就：${userData.achievements.map(a => a.name).join(', ')}

      請提供：
      1. 下一步學習建議
      2. 學習方法優化
      3. 進度加速策略
      4. 相關資源推薦
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return ['繼續按當前節奏學習', '多參與實作練習', '關注進度追蹤'];
  }
}

async function checkAchievements(userId, userData) {
  const newAchievements = [];

  // Check for new achievements
  if (userData.completedModules.length >= 3 && !userData.achievements.some(a => a.id === 'module-master')) {
    newAchievements.push({
      id: 'module-master',
      name: '模組大師',
      date: new Date().toISOString(),
      description: '完成3個學習模組'
    });
  }

  if (userData.progress >= 75 && !userData.achievements.some(a => a.id === 'progress-champion')) {
    newAchievements.push({
      id: 'progress-champion',
      name: '進度冠軍',
      date: new Date().toISOString(),
      description: '學習進度達到75%'
    });
  }

  userData.achievements.push(...newAchievements);
  return newAchievements;
}

async function generateAssessment(moduleId, userId) {
  // Generate mock assessment
  return {
    moduleId,
    userId,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'ESG 中的 E 代表什麼？',
        options: ['Environment', 'Economy', 'Education', 'Energy'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        type: 'true-false',
        question: '碳足跡計算包括直接排放和間接排放',
        correctAnswer: true
      }
    ],
    timeLimit: 600, // 10 minutes
    passingScore: 70
  };
}

async function generateLearningAnalytics(userData) {
  return {
    overallProgress: userData.progress,
    completionRate: userData.completedModules.length,
    averageSessionTime: 45, // minutes
    strengths: ['環境意識', '學習持續性'],
    improvementAreas: ['社會影響分析', '治理實務'],
    predictedCompletion: '2026-02-15',
    recommendations: [
      '增加社會責任模組學習',
      '參與實作項目',
      '加入學習社群討論'
    ]
  };
}

module.exports = router;