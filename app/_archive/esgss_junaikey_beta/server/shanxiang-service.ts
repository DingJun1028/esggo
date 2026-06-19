// 🏫 Shan Xiang Tech - ESGss Academy Service v1.0

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const DB_PATH = path.join(__dirname, '../shan-xiang-db.json');

// Shan Xiang Academy Service
export class ESGssAcademyService {
  constructor() {
    const adapter = new JSONFile(DB_PATH);
    this.db = new Low(adapter, { courses: [], users: [], progress: [], resources: [] });
    this.init();
  }

  async init() {
    await this.db.read();
    if (!this.db.data.courses || this.db.data.courses.length === 0) {
      this.db.data.courses = this.getDefaultCourses();
      await this.db.write();
    }
  }

  getDefaultCourses() {
    return [
      {
        id: 'crewai-multiagent',
        title: 'Building Multi-Agent Systems with crewAI',
        platform: 'DeepLearning.AI',
        instructor: 'João Moura',
        duration: '2h 14m',
        level: 'Intermediate',
        category: 'AI Agents',
        description: 'Learn how to build multi-agent systems using crewAI.',
        highlights: ['crewAI Framework', 'Role-based Agents'],
        url: 'https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai',
        tags: ['crewAI', 'AI Agents'],
      },
      // ... more courses can be added here
    ];
  }

  async getCourses(filters = {}) {
    await this.db.read();
    try {
      let courses = this.db.data.courses;

      // Basic filtering
      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category);
      }

      return {
        success: true,
        data: courses,
        count: courses.length,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCourse(id) {
    await this.db.read();
    const course = this.db.data.courses.find(c => c.id === id);
    if (!course) return { success: false, error: 'Course not found' };
    return { success: true, data: course };
  }

  async searchCourses(query) {
    await this.db.read();
    if (!query) return { success: false, error: 'Query required' };

    const results = this.db.data.courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: results };
  }

  async getLearningPaths() {
    return {
      success: true,
      data: [
        {
          id: 'beginner',
          title: 'AI Agent Beginner',
          courses: ['prompt-engineering-aws'],
        },
      ],
    };
  }

  async updateProgress(userId, courseId, progressData) {
    await this.db.read();
    let userProgress = this.db.data.progress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!userProgress) {
      userProgress = {
        id: uuidv4(),
        userId,
        courseId,
        progress: 0,
        completed: false,
        lastUpdated: new Date().toISOString(),
      };
      this.db.data.progress.push(userProgress);
    }

    if (progressData.progress !== undefined) userProgress.progress = progressData.progress;
    if (progressData.completed !== undefined) userProgress.completed = progressData.completed;

    await this.db.write();
    return { success: true, data: userProgress };
  }

  async getUserProgress(userId) {
    await this.db.read();
    const userProgress = this.db.data.progress.filter(p => p.userId === userId);
    return { success: true, data: userProgress };
  }

  async healthCheck() {
    return {
      status: 'healthy',
      service: 'shan-xiang-tech',
      timestamp: new Date().toISOString(),
    };
  }
}
