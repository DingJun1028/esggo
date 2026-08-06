import { IOmniTask, IRouteResult } from "./types";
export class CaseHandler {
  public async routeTask(task: IOmniTask): Promise<IRouteResult> {
    const q = task.query.toLowerCase();
    return {
      category: q.includes("計算") || q.includes("算") ? "Calculation" : q.includes("報告") || q.includes("筆記") ? "Knowledge" : "Action",
      confidence: 0.95
    };
  }
}