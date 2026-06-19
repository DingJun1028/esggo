// Service Registration Example for OmniOrchestrator
// Demonstrates how to integrate existing services with Wu-Tong architecture
// [Compliance] 5T (5 Can) Protocol

import { omniOrchestrator } from '../1-service/OmniOrchestrator';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { omniKnowledgeFlow } from '../1-service/OmniKnowledgeFlow';
import { omniSwarmInterface } from '../services/OmniSwarmInterface';

/**
 * 🌀 服務註冊範例 (Service Registration Example)
 *
 * This file demonstrates how to register services with the OmniOrchestrator
 * and integrate them into the Wu-Tong Zi-Tong ecosystem.
 */

// ==================== SERVICE REGISTRATION ====================

/**
 * Register a service with the orchestrator
 */
export function registerService(serviceId: string, serviceName: string) {
  omniOrchestrator.registerService(serviceId, serviceName);

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `✅ Service registered: ${serviceName}` });
}

/**
 * Update service health metrics
 * Call this periodically from your service (e.g., every 5 seconds)
 */
export function reportServiceHealth(
  serviceId: string,
  metrics: {
    responseTime?: number;
    errorRate?: number;
    throughput?: number;
    resourceUsage?: number;
  }
) {
  omniOrchestrator.updateServiceHealth(serviceId, metrics);
}

// ==================== KNOWLEDGE FLOW INTEGRATION ====================

/**
 * Add knowledge to the flow
 * Use this when your service generates insights, patterns, or solutions
 */
export function shareKnowledge(
  content: unknown,
  type: 'insight' | 'pattern' | 'anomaly' | 'solution' | 'metric',
  sourceService: string,
  tags: string[] = []
): string {
  const nodeId = omniKnowledgeFlow.addKnowledge(content, type, sourceService, tags);

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `📚 Knowledge shared: ${type} from ${sourceService}` });

  return nodeId;
}

/**
 * Query related knowledge
 * Use this to discover insights from other services
 */
export function discoverKnowledge(criteria: {
  tags?: string[];
  type?: 'insight' | 'pattern' | 'anomaly' | 'solution' | 'metric';
  sourceService?: string;
}) {
  const relatedNodes = omniKnowledgeFlow.queryRelatedKnowledge(criteria, 10);

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `🔍 Discovered ${relatedNodes.length} related knowledge nodes` });

  return relatedNodes;
}

// ==================== RESONANCE COMMUNICATION ====================

/**
 * Broadcast a system event
 * Use this for important system-wide notifications
 */
export function broadcastEvent(
  eventType: string,
  data: unknown,
  priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): string {
  const signalId = omniSwarmInterface.broadcastSystemEvent({
    type: eventType,
    data,
    priority,
  });

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `📡 Event broadcasted: ${eventType} (${priority})` });

  return signalId;
}

/**
 * Send message to specific service
 * Use this for targeted communication
 */
export function sendToService(
  targetServiceId: string,
  message: unknown,
  urgent: boolean = false
): string {
  const signalId = omniSwarmInterface.sendToNode(targetServiceId, message, urgent);

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `💬 Message sent to ${targetServiceId}` });

  return signalId;
}

/**
 * Share insight with emergent routing
 * Let the system decide where this insight should flow
 */
export function shareInsight(insight: unknown): string {
  const signalId = omniSwarmInterface.emergentBroadcast(insight);

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `✨ Insight shared with emergent routing` });

  return signalId;
}

// ==================== EXAMPLE USAGE ====================

/**
 * Example: Registering and monitoring a service
 */
export function exampleServiceIntegration() {
  // 1. Register the service
  registerService('my-service-001', 'MyAwesomeService');

  // 2. Set up periodic health reporting (every 5 seconds)
  setInterval(() => {
    reportServiceHealth('my-service-001', {
      responseTime: Math.random() * 100, // 0-100ms
      errorRate: Math.random() * 0.05, // 0-5%
      throughput: Math.random() * 100, // 0-100 req/s
      resourceUsage: Math.random() * 0.5, // 0-50%
    });
  }, 5000);

  // 3. Share knowledge when insights are generated
  const insightId = shareKnowledge(
    { finding: 'Carbon emissions reduced by 15%' },
    'insight',
    'MyAwesomeService',
    ['carbon', 'sustainability', 'metrics']
  );

  // 4. Discover related knowledge
  const relatedInsights = discoverKnowledge({
    tags: ['carbon', 'sustainability'],
    type: 'insight',
  });

  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `Found ${relatedInsights.length} related insights` });

  // 5. Broadcast important events
  broadcastEvent('carbon-milestone-achieved', { reduction: '15%', timestamp: new Date() }, 'high');

  // 6. Share insights with emergent routing
  shareInsight({
    pattern: 'Weekly carbon reduction trend',
    data: [12, 13, 15],
  });
}

// ==================== SYSTEM MONITORING ====================

/**
 * Get current system state
 */
export function getSystemStatus() {
  const state = omniOrchestrator.getSystemState();
  const metrics = omniOrchestrator.getNonActionMetrics();
  const knowledge = omniKnowledgeFlow.getFlowAnalytics();

  return {
    services: {
      total: state.services.size,
      healthy: Array.from(state.services.values()).filter(s => s.status === 'healthy').length,
      globalResonance: state.globalResonanceLevel,
    },
    wuTong: {
      embodied: metrics.embodiesWuTong,
      autonomousRate: metrics.autonomousResolutionRate,
      interventions: metrics.interventionCount,
    },
    knowledge: {
      nodes: knowledge.totalNodes,
      connections: knowledge.totalConnections,
      flowVelocity: knowledge.flowVelocity,
    },
  };
}

/**
 * Toggle observation mode
 * Use this for safe testing of autonomous actions
 */
export function setObservationMode(enabled: boolean) {
  omniOrchestrator.toggleObservationMode(enabled);
  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `👁️ Observation mode ${enabled ? 'enabled' : 'disabled'}` });
}

/**
 * Toggle auto-regulation
 * Use this to enable/disable autonomous system behavior
 */
export function setAutoRegulation(enabled: boolean) {
  omniOrchestrator.toggleAutoRegulation(enabled);
  omniLogger.info(LogCategory.SYSTEM, '[WuTongIntegration] Info', { data: `🤖 Auto-regulation ${enabled ? 'enabled' : 'disabled'}` });
}

// ==================== EXPORT ====================

export const WuTongIntegration = {
  // Service Management
  registerService,
  reportServiceHealth,

  // Knowledge Flow
  shareKnowledge,
  discoverKnowledge,

  // Resonance Communication
  broadcastEvent,
  sendToService,
  shareInsight,

  // System Monitoring
  getSystemStatus,
  setObservationMode,
  setAutoRegulation,

  // Example
  exampleServiceIntegration,
};

export default WuTongIntegration;
