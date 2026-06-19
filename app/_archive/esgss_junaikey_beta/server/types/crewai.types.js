/**
 * ?? CrewAI TypeScript ?遴竣??堊垓??
 *
 * ??TypeScript ??蝯??? CrewAI ???????????
 */
// ============================================================================
// Agent Types
// ============================================================================
/**
 * CrewAI ????遴竣?
 */
export var CrewAIAgentType;
(function (CrewAIAgentType) {
  CrewAIAgentType['INTELLIGENCE_AGGREGATOR'] = 'intelligence_aggregator';
  CrewAIAgentType['MULTI_PERSONA'] = 'multi_persona';
  CrewAIAgentType['CONTENT_CREATOR'] = 'content_creator';
  CrewAIAgentType['ANALYTICS_SPECIALIST'] = 'analytics_specialist';
  CrewAIAgentType['CALENDAR_COORDINATOR'] = 'calendar_coordinator';
})(CrewAIAgentType || (CrewAIAgentType = {}));
/**
 * ??????????
 */
export var AgentExecutionStatus;
(function (AgentExecutionStatus) {
  AgentExecutionStatus['QUEUED'] = 'queued';
  AgentExecutionStatus['RUNNING'] = 'running';
  AgentExecutionStatus['COMPLETED'] = 'completed';
  AgentExecutionStatus['FAILED'] = 'failed';
})(AgentExecutionStatus || (AgentExecutionStatus = {}));
