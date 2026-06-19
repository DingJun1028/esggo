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
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' as any });
};

// Mock conversation memory (replace with database in production)
const conversationMemory = new Map<string, any[]>();

// Helper functions (defined before usage)
async function generateAIInsights(data: any, context: string) {
  try {
    const prompt = `
      You are an expert ESG Data Analyst. Analyze the provided data in the given context and provide strategic insights.

      Data: ${JSON.stringify(data)}
      Context: ${context}

      Please provide:
      1. Key Performance Indicators analysis
      2. Identified trends and patterns
      3. Strategic recommendations
      4. Potential risks and mitigation strategies
      5. Future outlook

      Format the output as a professional executive summary.
    `;

    const model = getModel();
    if (!model) return 'AI unavailable (Missing API Key)';
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI insights generation error:', error);
    return 'AI Insight generation temporarily unavailable due to system constraints.';
  }
}

async function generateConversationResponse(messages: any[], context: any) {
  try {
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    const prompt = `
      You are the ESG Sunshine JunAiKey AI Assistant, a specialized expert in Environmental, Social, and Governance topics.

      Conversation History:
      ${conversationText}

      Context: ${JSON.stringify(context)}

      Your goal is to provide helpful, accurate, and encouraging advice to the user regarding their ESG journey.
      Keep responses professional yet approachable.
    `;

    const model = getModel();
    if (!model) return 'AI Service Unavailable';
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Conversation response generation error:', error);
    return 'I apologize, but I am currently unable to process your request. Please try again later.';
  }
}

async function generatePersonalizedRecommendations(
  userProfile: any,
  context: any,
  preferences: any
) {
  try {
    const prompt = `
      Generate personalized ESG recommendations based on the user's profile and preferences.

      User Profile: ${JSON.stringify(userProfile)}
      Context: ${JSON.stringify(context)}
      Preferences: ${JSON.stringify(preferences)}

      Please provide:
      1. Top 3 recommended actions
      2. Learning path suggestions
      3. Community engagement opportunities
      4. Achievement milestones to aim for
    `;

    const model = getModel();
    if (!model) throw new Error('AI Unavailable');
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return [
      'Review your local ESG guidelines',
      'Join our community forum',
      'Start measuring your carbon footprint',
    ];
  }
}

async function analyzeTrendsAndPatterns(data: any, timeRange: any, metrics: any) {
  try {
    const prompt = `
      Analyze the following dataset for ESG trends over the specified time range.

      Data: ${JSON.stringify(data)}
      Time Range: ${JSON.stringify(timeRange)}
      Metrics: ${JSON.stringify(metrics)}

      Please identify:
      1. Significant positive trends
      2. Concerning negative trends
      3. Anomalies or outliers
      4. Forecast for the next period
    `;

    const model = getModel();
    if (!model) throw new Error('AI Unavailable');
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return {
      trends: 'Trend analysis unavailable',
      patterns: 'No patterns detected',
      anomalies: [],
      predictions: 'Insufficient data for prediction',
    };
  }
}

async function generateContent(type: any, data: any, format: any, style: any) {
  try {
    const prompt = `
      Generate ${type} content based on the following parameters:

      Data: ${JSON.stringify(data)}
      Format: ${format}
      Style: ${style}

      Ensure the content is high-quality, relevant, and matches the requested style.
    `;

    const model = getModel();
    if (!model) throw new Error('AI Unavailable');
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return `Failed to generate ${type} content. Please provide valid input data.`;
  }
}

/**
 * @openapi
 * /api/ai/generate-insights:
 *   post:
 *     tags:
 *       - AI
 *     summary: 產生 AI 洞察
 *     description: 基於輸入數據產生 ESG 相關分析與建議
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: object
 *                 description: 待分析的數據
 *               context:
 *                 type: string
 *                 default: esg_analysis
 *                 example: carbon_footprint
 *     responses:
 *       200:
 *         description: 成功產生洞察
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     insights:
 *                       type: string
 *                     generatedAt:
 *                       type: string
 *                     model:
 *                       type: string
 *       400:
 *         description: 數據缺失
 *       500:
 *         description: AI 服務錯誤
 */
// Generate AI insights from data
router.post('/generate-insights', async (req: Request, res: Response) => {
  try {
    const { data, context = 'esg_analysis' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required for insights generation',
      });
    }

    const insights = await generateAIInsights(data, context);

    return res.json({
      success: true,
      data: {
        insights,
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash',
      },
    });
  } catch (error) {
    console.error('Generate insights error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights',
    });
  }
});

/**
 * @openapi
 * /api/ai/conversation:
 *   post:
 *     tags:
 *       - AI
 *     summary: AI 對話
 *     description: 與 JunAiKey AI 進行對話式互動
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *               userId:
 *                 type: string
 *               context:
 *                 type: object
 *     responses:
 *       200:
 *         description: AI 回覆成功
 *       400:
 *         description: 訊息格式錯誤
 */
// AI conversation endpoint
router.post('/conversation', async (req: Request, res: Response) => {
  try {
    const { messages, userId, context = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required',
      });
    }

    // Get conversation history
    const conversationKey = userId || 'anonymous';
    let conversationHistory = conversationMemory.get(conversationKey) || [];

    // Add new messages to history
    conversationHistory = [...conversationHistory, ...messages];

    // Generate response
    const response = await generateConversationResponse(conversationHistory, context);

    // Update conversation memory (keep last 20 messages)
    conversationHistory = [...conversationHistory, { role: 'assistant', content: response }];
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }
    conversationMemory.set(conversationKey, conversationHistory);

    return res.json({
      success: true,
      data: {
        response,
        conversationId: conversationKey,
        messageCount: conversationHistory.length,
      },
    });
  } catch (error) {
    console.error('Conversation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process conversation',
    });
  }
});

// Generate personalized recommendations
router.post('/recommendations', async (req: Request, res: Response) => {
  try {
    const { userProfile, context, preferences } = req.body;

    const recommendations = await generatePersonalizedRecommendations(
      userProfile,
      context,
      preferences
    );

    return res.json({
      success: true,
      data: {
        recommendations,
        personalized: true,
        generatedAt: new Date().toISOString(),
        created: true,
      },
    });
  } catch (error) {
    console.error('Generate recommendations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
    });
  }
});

// Analyze trends and patterns
router.post('/analyze-trends', async (req: Request, res: Response) => {
  try {
    const { data, timeRange, metrics } = req.body;

    const analysis = await analyzeTrendsAndPatterns(data, timeRange, metrics);

    return res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analyze trends error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze trends',
    });
  }
});

// Generate content (reports, summaries, etc.)
router.post('/generate-content', async (req: Request, res: Response) => {
  try {
    const { type, data, format = 'text', style = 'professional' } = req.body;

    const content = await generateContent(type, data, format, style);

    return res.json({
      success: true,
      data: {
        content,
        type,
        format,
        style,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate content',
    });
  }
});

export default router;
