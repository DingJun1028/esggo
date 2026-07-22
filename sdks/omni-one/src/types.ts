export interface IOmniTask {
  id: string;
  query: string;
  context?: Record<string, any>;
  timestamp: number;
}
export interface IRouteResult {
  category: "Knowledge" | "Action" | "Calculation" | "Unknown";
  confidence: number;
}
export interface IMemoryRecord {
  id: string;
  taskId: string;
  query: string;
  result: any;
  timestamp: number;
  tags: string[];
}
export interface IAwakeningResult {
  status: "success" | "partial" | "failed";
  data: any;
  plan: string[];
}