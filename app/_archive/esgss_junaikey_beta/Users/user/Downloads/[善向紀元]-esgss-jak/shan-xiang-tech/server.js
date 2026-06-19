import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// 初始化 Markdown 解析器
const md = new MarkdownIt();

// 資料庫初始化
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, {
  courses: [],
  users: [],
  progress: [],
  resources: []
});

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 初始化資料庫
await db.read();

// 課程數據
const coursesData = [
  {
    id: 'crewai-multiagent',
    title: '使用 crewAI 建構多 AI 智能體系統',
    platform: 'DeepLearning.AI',
    instructor: 'João Moura',
    duration: '2 小時 14 分鐘',
    level: '中級',
    category: '多代理系統',
    description: '學習如何使用 crewAI 框架建構協作型多智能體系統，掌握智能體團隊協作和角色委派技巧。',
    highlights: [
      'crewAI 框架核心概念',
      '多智能體協作模式',
      '角色委派和任務分配',
      '實際案例實作'
    ],
    url: 'https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai',
    tags: ['crewAI', '多代理', '協作', '團隊協作']
  },
  {
    id: 'prompt-engineering-aws',
    title: '提示工程基礎（AWS）',
    platform: 'SkillBuilder.AWS',
    instructor: '亞馬遜團隊',
    duration: '3 小時 50 分鐘',
    level: '初學者',
    category: '提示工程',
    description: '掌握提示設計、上下文管理和工具使用的基本原理，為建立可靠的 LLM 代理打下堅實基礎。',
    highlights: [
      '提示設計原則',
      '上下文管理技巧',
      '工具使用最佳實務',
      'LLM 代理基礎'
    ],
    url: 'https://explore.skillbuilder.aws/learn/course/3/play/1/introduction-to-prompt-engineering',
    tags: ['提示工程', 'AWS', 'LLM', '基礎']
  },
  {
    id: 'langgraph-intro',
    title: 'LangGraph 簡介',
    platform: 'Academy.LangChain.com',
    instructor: 'Harrison Chase',
    duration: '5 小時 58 分鐘',
    level: '中級',
    category: '工作流程編排',
    description: '深入學習 LangGraph，這是一個基於圖的編排框架，用於建立複雜的代理工作流程。',
    highlights: [
      '圖基編排概念',
      '複雜工作流程設計',
      'LangGraph 實作練習',
      '真實案例應用'
    ],
    url: 'https://academy.langchain.com/courses/introduction-to-langgraph',
    tags: ['LangGraph', '工作流程', '編排', 'LangChain']
  },
  {
    id: 'llm-agents-mooc',
    title: '大型語言模型代理 MOOC',
    platform: 'LLMAgents-Learning.org',
    instructor: 'Dawn Song',
    duration: '4 小時 4 分鐘',
    level: '進階',
    category: '代理架構',
    description: '結構化介紹代理架構、決策循環和多代理協作，適合學術學習者和研究人員。',
    highlights: [
      '代理架構設計',
      '決策循環機制',
      '多代理協作模式',
      '學術研究方法'
    ],
    url: 'https://llmagents-learning.org/',
    tags: ['MOOC', '代理架構', '決策循環', '學術']
  },
  {
    id: 'ai-agents-langgraph',
    title: 'LangGraph 中的 AI 代理',
    platform: 'DeepLearning.AI',
    instructor: 'Harrison Chase',
    duration: '1 小時 32 分鐘',
    level: '中高級',
    category: '代理實作',
    description: '專注於使用記憶體、工具和回饋循環實現 LangGraph 代理，適合 LangChain 用戶。',
    highlights: [
      '記憶體管理',
      '工具整合',
      '回饋循環設計',
      'LangGraph 高級應用'
    ],
    url: 'https://learn.deeplearning.ai/courses/ai-agents-in-langgraph',
    tags: ['LangGraph', '記憶體', '工具', '回饋循環']
  },
  {
    id: 'multimodal-agents',
    title: '使用多模態模型建構 AI 智能體',
    platform: 'Learn.Nvidia.com',
    instructor: 'Nvidia',
    duration: '7 小時 10 分鐘',
    level: '高級',
    category: '多模態代理',
    description: '學習如何建立能夠處理文字、圖像和音訊的智能體，涵蓋多模態模型的整合和部署。',
    highlights: [
      '多模態數據處理',
      '圖像和音訊整合',
      '模型部署策略',
      'Nvidia 工具包應用'
    ],
    url: 'https://learn.nvidia.com/courses/building-ai-agents-with-multimodal-models',
    tags: ['多模態', 'Nvidia', '圖像處理', '音訊處理']
  },
  {
    id: 'autogen-patterns',
    title: '使用 AutoGen 建構 AI 智能體設計模式',
    platform: 'DeepLearning.AI',
    instructor: '王馳',
    duration: '1 小時 25 分鐘',
    level: '中高級',
    category: '設計模式',
    description: '探索使用 AutoGen 建構智能體的可重複使用設計模式，包括角色提示、重試循環和任務規劃。',
    highlights: [
      'AutoGen 設計模式',
      '角色提示技巧',
      '重試循環設計',
      '任務規劃方法'
    ],
    url: 'https://learn.deeplearning.ai/courses/building-agentic-rag-with-autogen',
    tags: ['AutoGen', '設計模式', '角色提示', '任務規劃']
  },
  {
    id: 'llm-memory',
    title: 'LLM 作為作業系統：智能體記憶',
    platform: 'DeepLearning.AI',
    instructor: 'Charles Packer',
    duration: '1 小時 22 分鐘',
    level: '中級',
    category: '記憶體管理',
    description: '學習如何在智能體中實現短期記憶和長期記憶，涵蓋向量儲存、情景記憶和結構化狀態檔案。',
    highlights: [
      '短期記憶實現',
      '長期記憶策略',
      '向量儲存技術',
      '狀態檔案管理'
    ],
    url: 'https://learn.deeplearning.ai/courses/llms-as-operating-systems',
    tags: ['記憶體', '向量儲存', '狀態管理', '作業系統']
  },
  {
    id: 'llamaindex-rag',
    title: '使用 LlamaIndex 建構智慧型 RAG',
    platform: 'DeepLearning.AI',
    instructor: 'Jerry Liu',
    duration: '44 分鐘',
    level: '中級',
    category: 'RAG 代理',
    description: '學習如何使用 LlamaIndex 將檢索增強生成 (RAG) 與智慧工作流程結合，適合搜尋和知識庫智能體。',
    highlights: [
      'RAG 技術原理',
      'LlamaIndex 整合',
      '智慧工作流程',
      '知識庫代理'
    ],
    url: 'https://learn.deeplearning.ai/courses/building-llm-applications-with-llamaindex',
    tags: ['LlamaIndex', 'RAG', '檢索增強', '知識庫']
  }
];

// 初始化課程數據
if (!db.data.courses || db.data.courses.length === 0) {
  db.data.courses = coursesData;
  await db.write();
}

// API 路由

// 獲取所有課程
app.get('/api/courses', async (req, res) => {
  try {
    const { category, level, platform } = req.query;
    let courses = db.data.courses;

    if (category) {
      courses = courses.filter(course => course.category === category);
    }
    if (level) {
      courses = courses.filter(course => course.level === level);
    }
    if (platform) {
      courses = courses.filter(course => course.platform === platform);
    }

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '獲取課程失敗'
    });
  }
});

// 獲取單個課程
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = db.data.courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: '課程不存在'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '獲取課程失敗'
    });
  }
});

// 搜索課程
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: '請提供搜索關鍵字'
      });
    }

    const results = db.data.courses.filter(course =>
      course.title.toLowerCase().includes(q.toLowerCase()) ||
      course.description.toLowerCase().includes(q.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
    );

    res.json({
      success: true,
      data: results,
      count: results.length,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '搜索失敗'
    });
  }
});

// 獲取學習路徑
app.get('/api/learning-paths', async (req, res) => {
  try {
    const learningPaths = [
      {
        id: 'beginner',
        title: '初學者路徑 (4-6 周)',
        description: '適合 AI 代理初學者',
        duration: '4-6 周',
        courses: [
          'prompt-engineering-aws',
          'langgraph-intro'
        ]
      },
      {
        id: 'intermediate',
        title: '中級路徑 (6-8 周)',
        description: '掌握多代理系統和進階框架',
        duration: '6-8 周',
        courses: [
          'crewai-multiagent',
          'autogen-patterns'
        ]
      },
      {
        id: 'advanced',
        title: '高級路徑 (8-12 周)',
        description: '企業級應用和多模態代理',
        duration: '8-12 周',
        courses: [
          'multimodal-agents',
          'llamaindex-rag'
        ]
      }
    ];

    res.json({
      success: true,
      data: learningPaths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '獲取學習路徑失敗'
    });
  }
});

// 用戶學習進度
app.post('/api/progress/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { completed, progress } = req.body;

    // 查找或創建進度記錄
    let userProgress = db.data.progress.find(p =>
      p.userId === userId && p.courseId === courseId
    );

    if (!userProgress) {
      userProgress = {
        id: uuidv4(),
        userId,
        courseId,
        progress: 0,
        completed: false,
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      db.data.progress.push(userProgress);
    }

    // 更新進度
    if (progress !== undefined) {
      userProgress.progress = Math.max(0, Math.min(100, progress));
    }
    if (completed !== undefined) {
      userProgress.completed = completed;
    }
    userProgress.lastUpdated = new Date().toISOString();

    await db.write();

    res.json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新進度失敗'
    });
  }
});

// 獲取用戶進度
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userProgress = db.data.progress.filter(p => p.userId === req.params.userId);

    // 附加課程信息
    const progressWithCourses = userProgress.map(p => {
      const course = db.data.courses.find(c => c.id === p.courseId);
      return {
        ...p,
        course: course ? {
          title: course.title,
          platform: course.platform,
          duration: course.duration
        } : null
      };
    });

    res.json({
      success: true,
      data: progressWithCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '獲取進度失敗'
    });
  }
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'shan-xiang-tech',
    version: '1.0.0-alpha',
    timestamp: new Date().toISOString()
  });
});

// API 健康檢查端點 (與其他服務一致)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'shan-xiang-tech',
    version: '1.0.0-alpha',
    timestamp: new Date().toISOString()
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '端點不存在',
    path: req.originalUrl
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 善向技術 AI 代理學習平台運行在端口 ${PORT}`);
  console.log(`📚 課程總數: ${db.data.courses.length}`);
  console.log(`🏥 健康檢查: http://localhost:${PORT}/health`);
});

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM，正在關閉服務器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT，正在關閉服務器...');
  process.exit(0);
});