// 善向科技。永續學院 (ESGss Academy) - ESG Sunshine JunAiKey v1.0
// AI 代理學習平台服務

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化 Shan Xiang Tech 資料庫
const adapter = new JSONFile(path.join(__dirname, '../shan-xiang-db.json'));
const db = new Low(adapter, { courses: [], users: [], progress: [], resources: [] });

// 初始化課程數據
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

// 初始化資料庫
await db.read();
if (!db.data.courses || db.data.courses.length === 0) {
  db.data.courses = coursesData;
  await db.write();
}

// 善向科技。永續學院 (ESGss Academy) 服務類
export class ESGssAcademyService {
  constructor() {
    this.db = db;
  }

  // 獲取所有課程
  async getCourses(filters = {}) {
    try {
      let courses = this.db.data.courses;

      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category);
      }
      if (filters.level) {
        courses = courses.filter(course => course.level === filters.level);
      }
      if (filters.platform) {
        courses = courses.filter(course => course.platform === filters.platform);
      }

      return {
        success: true,
        data: courses,
        count: courses.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 獲取單個課程
  async getCourse(id) {
    try {
      const course = this.db.data.courses.find(c => c.id === id);
      if (!course) {
        return {
          success: false,
          error: '課程不存在'
        };
      }

      return {
        success: true,
        data: course
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 搜索課程
  async searchCourses(query) {
    try {
      if (!query) {
        return {
          success: false,
          error: '請提供搜索關鍵字'
        };
      }

      const results = this.db.data.courses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        success: true,
        data: results,
        count: results.length,
        query
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 獲取學習路徑
  async getLearningPaths() {
    try {
      const learningPaths = [
        {
          id: 'beginner',
          title: '初學者路徑 (4-6 周)',
          description: '適合 AI 代理初學者',
          duration: '4-6 周',
          courses: ['prompt-engineering-aws', 'langgraph-intro']
        },
        {
          id: 'intermediate',
          title: '中級路徑 (6-8 周)',
          description: '掌握多代理系統和進階框架',
          duration: '6-8 周',
          courses: ['crewai-multiagent', 'autogen-patterns']
        },
        {
          id: 'advanced',
          title: '高級路徑 (8-12 周)',
          description: '企業級應用和多模態代理',
          duration: '8-12 周',
          courses: ['multimodal-agents', 'llamaindex-rag']
        }
      ];

      return {
        success: true,
        data: learningPaths
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 更新學習進度
  async updateProgress(userId, courseId, progressData) {
    try {
      let userProgress = this.db.data.progress.find(p =>
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
        this.db.data.progress.push(userProgress);
      }

      if (progressData.progress !== undefined) {
        userProgress.progress = Math.max(0, Math.min(100, progressData.progress));
      }
      if (progressData.completed !== undefined) {
        userProgress.completed = progressData.completed;
      }
      userProgress.lastUpdated = new Date().toISOString();

      await this.db.write();

      return {
        success: true,
        data: userProgress
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 獲取用戶學習進度
  async getUserProgress(userId) {
    try {
      const userProgress = this.db.data.progress.filter(p => p.userId === userId);

      const progressWithCourses = userProgress.map(p => {
        const course = this.db.data.courses.find(c => c.id === p.courseId);
        return {
          ...p,
          course: course ? {
            title: course.title,
            platform: course.platform,
            duration: course.duration
          } : null
        };
      });

      return {
        success: true,
        data: progressWithCourses
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 健康檢查
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'shan-xiang-tech',
      version: '1.0.0-alpha',
      courses: this.db.data.courses.length,
      timestamp: new Date().toISOString()
    };
  }
}