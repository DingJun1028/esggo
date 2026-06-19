/**
 * Swarm Service Adapter
 * ---------------------
 * Bridges the API to the SwarmController (Omni-Swarm Intelligence).
 */

import { swarmController } from '../../src/services/ai/swarm/SwarmController.js';

export async function runSwarm(goal: string) {
  // Start the mission via the controller
  // Note: startMission is async but returns the task immediately.
  // The execution happens in background.
  // For the API response, we might want to return the task ID and initial status.

  const task = await swarmController.startMission(goal);

  return {
    taskId: task.id,
    status: task.status,
    goal: task.goal,
    message: "Swarm Mission Initiated. Check /api/swarm/mission/{id} for updates."
  };
}
