/**
 * Shared Type Definitions for ESGSS JunAiKey Server
 * This file provides common type definitions used across server services
 */

// Express Request/Response types
import { Request, Response, NextFunction } from 'express';

// Generic API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error handling types
export interface TypedError extends Error {
  code?: string;
  statusCode?: number;
}

// Agent types
export interface AgentProfile {
  uuid: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  virtues: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

// Evidence types
export interface Evidence {
  id: string;
  uuid: string;
  content: string;
  source: string;
  status: 'pending' | 'approved' | 'rejected';
  trustworthiness?: number;
  validatorId?: string;
  createdAt: string;
  updatedAt: string;
}

// ESG Metrics types
export interface ESGMetrics {
  environmental: {
    carbonEmissions: number;
    energyConsumption: number;
    waterUsage: number;
    wasteManagement: number;
  };
  social: {
    employeeDiversity: number;
    communityImpact: number;
    healthAndSafety: number;
  };
  governance: {
    boardDiversity: number;
    ethicsPolicy: number;
    riskManagement: number;
  };
}

// Crawler types
export interface CrawlerResult {
  title: string;
  url: string;
  content: string;
  source: string;
  snippet: string;
  publishedAt?: string;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
}

// Service context types
export interface ServiceContext {
  requestId: string;
  userId?: string;
  timestamp: string;
  correlationId?: string;
}

// Analysis types
export interface AnalysisResult<T = unknown> {
  data: T;
  confidence: number;
  insights: string[];
  recommendations: string[];
}

// Event types
export interface EventPayload<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  source: string;
}

// Authentication types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

// Export handler type helper
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Controller return type helper
export type ControllerResult<T = unknown> = {
  statusCode: number;
  body: ApiResponse<T>;
};
