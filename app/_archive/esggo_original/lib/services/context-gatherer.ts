/**
 * OmniAgent | Context Gathering Service (MCP inspired)
 * Bridges AI agents with system data and external sources.
 */

import { getEnvironmentalData, getSocialMetrics } from '../db';
import { fetchOmniAgentStatus } from '../omni-gateway';
import { blueCC } from './blue-cc';

export async function gatherSystemContext() {
  const [env, soc, status, cloud] = await Promise.all([
    getEnvironmentalData(),
    getSocialMetrics(),
    fetchOmniAgentStatus(),
    blueCC.getSystemStatus()
  ]);

  return {
    timestamp: new Date().toISOString(),
    metrics: {
      environmental: env.slice(0, 5),
      social: soc.slice(0, 5)
    },
    runtime: status,
    cloud: cloud
  };
}
