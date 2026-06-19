// API Response Types
import { OmniResponseStatus, OmniTag } from '../../types/omniCore.js';

export interface ApiResponse<T = any> {
  id?: string;
  requestId?: string;
  success: boolean;
  status: OmniResponseStatus;
  content?: string;
  data?: T;
  message?: string;
  error?: string;
  generatedTags?: OmniTag[];
  executedComponents?: string[];
  invokedSkills?: string[];
  executionTime?: number;
  timestamp?: string | Date;
  // Allow for dynamic properties like arvo_analysis
  [key: string]: any;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ESG Types
export interface ESGMetric {
  id: string;
  category: 'environmental' | 'social' | 'governance';
  metricName: string;
  value: number;
  unit?: string;
  timestamp: string;
  // Extension properties - used for risk assessment and analysis
  risk_threshold?: number; // Risk threshold
  trend?: 'up' | 'down' | 'stable'; // Trend
  confidence?: number; // Confidence level (0-1)
  label?: string; // Display label
}

export interface ESGReport {
  id: string;
  userId: string;
  environmental: {
    carbonScore: number;
    energyEfficiency: number;
    wasteManagement: number;
  };
  social: {
    laborPractices: number;
    communityImpact: number;
    diversityInclusion: number;
  };
  governance: {
    boardDiversity: number;
    ethicsCompliance: number;
    transparency: number;
  };
  overallScore: number;
  generatedAt: string;
}

export interface ESGCalculateRequest {
  environmental?: Partial<ESGReport['environmental']>;
  social?: Partial<ESGReport['social']>;
  governance?: Partial<ESGReport['governance']>;
}

// AI Types
export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIChatRequest {
  message: string;
  context?: string;
}

export interface AIChatResponse {
  response: string;
  suggestions?: string[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  actionItems?: string[];
  generatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
  metrics: {
    totalProjects: number;
    completedProjects: number;
    averageESGScore: number;
    trendsData: Array<{
      date: string;
      score: number;
    }>;
  };
  period: string;
}
