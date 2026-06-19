// WuTongDashboard - 無通自通可視化儀表板
// Visualizes Wu-Tong Zi-Tong philosophy in action
// [Compliance] 4+1 Protocol

import React, { useEffect, useState } from 'react';
import { omniOrchestrator } from '../../1-service/OmniOrchestrator';
import { omniKnowledgeFlow } from '../../1-service/OmniKnowledgeFlow';
import type { OmniOrchestrationState } from '../../1-service/OmniOrchestrator';
import './WuTongDashboard.css';

interface WuTongDashboardProps {
  refreshInterval?: number; // ms
}

/**
 * 🌀 無通自通儀表板
 *
 * Visualizes the Wu-Tong Zi-Tong philosophy in real-time:
 * - System resonance levels
 * - Autonomous action timeline
 * - Knowledge flow patterns
 * - Non-Action metrics
 */
export const WuTongDashboard: React.FC<WuTongDashboardProps> = ({ refreshInterval = 2000 }) => {
  const [systemState, setSystemState] = useState<OmniOrchestrationState | null>(null);
  const [knowledgeAnalytics, setKnowledgeAnalytics] = useState<any>(null);
  const [nonActionMetrics, setNonActionMetrics] = useState<any>(null);

  useEffect(() => {
    const updateDashboard = () => {
      const state = omniOrchestrator.getSystemState();
      const knowledge = omniKnowledgeFlow.getFlowAnalytics();
      const metrics = omniOrchestrator.getNonActionMetrics();

      setSystemState(state);
      setKnowledgeAnalytics(knowledge);
      setNonActionMetrics(metrics);
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (!systemState || !knowledgeAnalytics || !nonActionMetrics) {
    return <div className="wu-tong-loading">載入無通自通儀表板...</div>;
  }

  const resonanceLevel = systemState.globalResonanceLevel;
  const resonanceColor = getResonanceColor(resonanceLevel);
  const embodiesWuTong = nonActionMetrics.embodiesWuTong;

  return (
    <div className="wu-tong-dashboard">
      {/* Header */}
      <div className="wu-tong-header">
        <h1>無通自通 (Wu-Tong Zi-Tong)</h1>
        <p className="philosophy-subtitle">Non-Action, Auto-Action · 無為而自為</p>
      </div>

      {/* Main Resonance Circle */}
      <div className="resonance-circle-container">
        <svg viewBox="0 0 200 200" className="resonance-circle">
          {/* Outer ring - represents 通 (Omni Connectivity) */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={resonanceColor}
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Middle ring - represents 自 (Autonomy) */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={resonanceColor}
            strokeWidth="3"
            opacity="0.5"
          />

          {/* Inner circle - represents 無 (Non-Action) */}
          <circle cx="100" cy="100" r="50" fill={resonanceColor} opacity="0.2" />

          {/* Center dot - represents system core */}
          <circle cx="100" cy="100" r="8" fill={resonanceColor} />

          {/* Resonance level arc */}
          <path
            d={describeArc(100, 100, 85, 0, resonanceLevel * 360)}
            fill="none"
            stroke={resonanceColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        <div className="resonance-label">
          <div className="resonance-value">{(resonanceLevel * 100).toFixed(1)}%</div>
          <div className="resonance-text">全域共鳴</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Non-Action Metrics */}
        <div className="metric-card">
          <h3>無為指標</h3>
          <div className="metric-value">
            {(nonActionMetrics.autonomousResolutionRate * 100).toFixed(1)}%
          </div>
          <div className="metric-label">自主解決率</div>
          <div className="metric-detail">
            {nonActionMetrics.autonomousResolutionCount} / {nonActionMetrics.totalEvents} 事件
          </div>
        </div>

        {/* Intervention Frequency */}
        <div className="metric-card">
          <h3>干預頻率</h3>
          <div className="metric-value">{nonActionMetrics.interventionCount}</div>
          <div className="metric-label">人為干預次數</div>
          <div
            className={`metric-status ${nonActionMetrics.interventionCount < 5 ? 'good' : 'warning'}`}
          >
            {nonActionMetrics.interventionCount < 5 ? '✓ 最小干預' : '⚠ 需優化'}
          </div>
        </div>

        {/* Knowledge Flow */}
        <div className="metric-card">
          <h3>知識流動</h3>
          <div className="metric-value">{knowledgeAnalytics.totalNodes}</div>
          <div className="metric-label">知識節點</div>
          <div className="metric-detail">{knowledgeAnalytics.totalConnections} 自然連結</div>
        </div>

        {/* Service Health */}
        <div className="metric-card">
          <h3>服務狀態</h3>
          <div className="metric-value">{systemState.services.size}</div>
          <div className="metric-label">已註冊服務</div>
          <div className="metric-detail">
            {Array.from(systemState.services.values()).filter(s => s.status === 'healthy').length}{' '}
            健康
          </div>
        </div>
      </div>

      {/* Wu-Tong Embodiment Status */}
      <div className={`wu-tong-status ${embodiesWuTong ? 'embodied' : 'not-embodied'}`}>
        {embodiesWuTong ? (
          <>
            <span className="status-icon">✨</span>
            <span className="status-text">系統體現無通自通原則</span>
          </>
        ) : (
          <>
            <span className="status-icon">🌱</span>
            <span className="status-text">系統正在學習無通自通</span>
          </>
        )}
      </div>

      {/* Knowledge Flow Visualization */}
      <div className="knowledge-flow-section">
        <h2>知識流動圖譜</h2>
        <div className="flow-stats">
          <div className="flow-stat">
            <span className="stat-label">流動速度</span>
            <span className="stat-value">{knowledgeAnalytics.flowVelocity}/分鐘</span>
          </div>
          <div className="flow-stat">
            <span className="stat-label">湧現連結</span>
            <span className="stat-value">{knowledgeAnalytics.emergentFlows}</span>
          </div>
          <div className="flow-stat">
            <span className="stat-label">平均連結度</span>
            <span className="stat-value">
              {knowledgeAnalytics.avgConnectionsPerNode.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Service List */}
      {systemState.services.size > 0 && (
        <div className="services-section">
          <h2>服務共鳴狀態</h2>
          <div className="services-list">
            {Array.from(systemState.services.values()).map(service => (
              <div key={service.serviceId} className="service-item">
                <div className="service-header">
                  <span className="service-name">{service.serviceName}</span>
                  <span className={`service-status status-${service.status}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <div className="service-resonance">
                  <div className="resonance-bar-container">
                    <div
                      className="resonance-bar"
                      style={{
                        width: `${service.resonanceScore * 100}%`,
                        backgroundColor: getResonanceColor(service.resonanceScore),
                      }}
                    />
                  </div>
                  <span className="resonance-score">
                    {(service.resonanceScore * 100).toFixed(0)}%
                  </span>
                </div>
                {service.autoRegulationHistory && service.autoRegulationHistory.length > 0 && (
                  <div className="service-actions">
                    最近行動:{' '}
                    {service.autoRegulationHistory[service.autoRegulationHistory.length - 1]
                      ?.action || '無'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observation Mode Indicator */}
      {systemState.observationMode && (
        <div className="observation-mode-banner">👁️ 觀察模式啟用 - 僅記錄，不執行自主行動</div>
      )}
    </div>
  );
};

// Helper Functions

function getResonanceColor(level: number): string {
  if (level >= 0.95) return '#00ff88'; // Excellent - Green
  if (level >= 0.8) return '#ffaa00'; // Good - Orange
  if (level >= 0.6) return '#ff6600'; // Degraded - Red-Orange
  return '#ff0044'; // Critical - Red
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    healthy: '健康',
    degraded: '降級',
    critical: '危急',
    recovering: '恢復中',
  };
  return statusMap[status] || status;
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default WuTongDashboard;
