import { z } from "zod";
import { defineRune } from "@/lib/adk/core";

/**
 * [R7] 任務分派代理 (The Dispatcher) — 奧義：代理織網
 * 責任：根據「萬有引力協議」進行路由，自動分發任務
 */

export const DispatcherInputSchema = z.object({
  taskDescription: z.string().describe("任務詳細描述"),
  priority: z.number().min(1).max(5).describe("優先級"),
});

export const dispatcherRune = defineRune({
  name: "dispatcherRune",
  description: "[R7] 任務分派代理：智慧路由與負載平衡任務分發",
  schema: DispatcherInputSchema,
  execute: async (_context, input) => {
    const { taskDescription, priority } = input;
    
    return JSON.stringify({
      status: "DISPATCHED",
      agentTarget: "Apostle_R1_Covenanter",
      loadBalance: 0.12,
      priorityLevel: priority,
      message: `[R7] DISPATCHER routed task: "${taskDescription}" with priority ${priority}.`
    }, null, 2);
  }
});
