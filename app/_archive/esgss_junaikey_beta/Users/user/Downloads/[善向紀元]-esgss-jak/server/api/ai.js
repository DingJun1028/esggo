// AI Services API Routes
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize AI models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Mock conversation memory (replace with database in production)
const conversationMemory = new Map();

// Generate AI insights from data
router.post('/generate-insights', async (req, res) => {
  try {
    const { data, context = 'esg_analysis' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required for insights generation'
      });
    }

    const insights = await generateAIInsights(data, context);

    res.json({
      success: true,
      data: {
        insights,
        generatedAt: new Date().toISOString(),
        model: 'gemini-1.5-flash'
      }
    });
  } catch (error) {
    console.error('Generate insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights'
    });
  }
});

// AI conversation endpoint
router.post('/conversation', async (req, res) => {
  try {
    const { messages, userId, context = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
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

    res.json({
      success: true,
      data: {
        response,
        conversationId: conversationKey,
        messageCount: conversationHistory.length
      }
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process conversation'
    });
  }
});

// Generate personalized recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userProfile, context, preferences } = req.body;

    const recommendations = await generatePersonalizedRecommendations(
      userProfile,
      context,
      preferences
    );

    res.json({
      success: true,
      data: {
        recommendations,
        personalized: true,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// Analyze trends and patterns
router.post('/analyze-trends', async (req, res) => {
  try {
    const { data, timeRange, metrics } = req.body;

    const analysis = await analyzeTrendsAndPatterns(data, timeRange, metrics);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analyze trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze trends'
    });
  }
});

// Generate content (reports, summaries, etc.)
router.post('/generate-content', async (req, res) => {
  try {
    const { type, data, format = 'text', style = 'professional' } = req.body;

    const content = await generateContent(type, data, format, style);

    res.json({
      success: true,
      data: {
        content,
        type,
        format,
        style,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

// Helper functions
async function generateAIInsights(data, context) {
  try {
    const prompt = `
      作為 ESG 智慧分析助手，請分析以下數據並提供深入見解：

      數據內容：${JSON.stringify(data)}
      分析上下文：${context}

      請提供：
      1. 數據關鍵發現
      2. 趨勢分析
      3. 風險識別
      4. 改進建議
      5. 預測洞察

      請用條理清晰的方式呈現分析結果。
    `;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI insights generation error:', error);
    return 'AI 分析服務暫時不可用，請稍後再試';
  }
}

async function generateConversationResponse(messages, context) {
  try {
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    const prompt = `
      你是 ESG Sunshine JunAiKey 智慧助手，請根據以下對話歷史提供有幫助的回應。

      對話歷史：
      ${conversationText}

      上下文信息：${JSON.stringify(context)}

      請提供專業、準確、有建設性的回應。關注 ESG 永續發展、AI 學習、商業價值創造等主題。
    `;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Conversation response generation error:', error);
    return '抱歉，我現在無法處理您的請求。請稍後再試。';
  }
}

async function generatePersonalizedRecommendations(userProfile, context, preferences) {
  try {
    const prompt = `
      基於用戶檔案和偏好，生成個人化推薦：

      用戶檔案：${JSON.stringify(userProfile)}
      上下文：${JSON.stringify(context)}
      偏好設定：${JSON.stringify(preferences)}

      請生成：
      1. 學習路徑推薦
      2. 內容偏好建議
      3. 互動模式推薦
      4. 進展追蹤建議
    `;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return ['繼續當前學習路徑', '增加實作練習', '參與討論交流'];
  }
}

async function analyzeTrendsAndPatterns(data, timeRange, metrics) {
  try {
    const prompt = `
      分析數據趨勢和模式：

      數據：${JSON.stringify(data)}
      時間範圍：${JSON.stringify(timeRange)}
      指標：${JSON.stringify(metrics)}

      請識別：
      1. 主要趨勢
      2. 季節性模式
      3. 異常波動
      4. 預測洞察
    `;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return {
      trends: '數據趨勢分析中',
      patterns: '模式識別進行中',
      anomalies: [],
      predictions: '預測分析服務暫時不可用'
    };
  }
}

async function generateContent(type, data, format, style) {
  try {
    const prompt = `
      生成 ${type} 內容：

      數據來源：${JSON.stringify(data)}
      格式要求：${format}
      風格設定：${style}

      請根據要求生成合適的內容。
    `;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return `無法生成 ${type} 內容，請檢查輸入數據`;
  }
}

module.exports = router;