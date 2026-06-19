/**
 * 台灣 ESG 申報流程追蹤 UI 組件
 * =================================
 * 視覺化時程進度與法規遵循狀態
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  generateAnnualTimeline,
  getKeyMilestones,
  calculateTimelineProgress,
  getRiskAlerts,
  getTimelinePhase,
  type CompanyProfile,
  type TimelinePhase,
  type Milestone,
} from '@/config/TaiwanESGTimeline';

export default function TaiwanESGTimelineTracker() {
  const [reportYear, setReportYear] = useState(2025);
  const [company] = useState<CompanyProfile>({
    companyId: 'DEMO_001',
    companyName: '示範永續企業股份有限公司',
    stockCode: '2330',
    market: 'TWSE',
    paidInCapital: 120, // 120億
    industry: '半導體製造',
    isHighEmission: false,
  });

  const timeline = generateAnnualTimeline(company, reportYear);
  const milestones = getKeyMilestones(reportYear);
  const progress = calculateTimelineProgress(timeline);
  const alerts = getRiskAlerts(company, timeline, reportYear);
  const regulatoryPhase = getTimelinePhase(company.paidInCapital, company.isHighEmission);

  const now = new Date();
  const deadline = new Date(reportYear, 7, 31); // 8/31
  const daysToDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="taiwan-esg-timeline">
      {/* Header */}
      <div className="header">
        <div className="title-section">
          <h1>📅 永續報告書申報時程追蹤</h1>
          <p className="subtitle">依據金管會「上市櫃公司永續發展路徑圖」</p>
        </div>

        <div className="company-info">
          <div className="info-item">
            <span className="label">公司名稱</span>
            <span className="value">{company.companyName}</span>
          </div>
          <div className="info-item">
            <span className="label">股票代碼</span>
            <span className="value">{company.stockCode}</span>
          </div>
          <div className="info-item">
            <span className="label">實收資本額</span>
            <span className="value">{company.paidInCapital} 億元</span>
          </div>
          <div className="info-item">
            <span className="label">報告年度</span>
            <select
              value={reportYear}
              onChange={e => setReportYear(Number(e.target.value))}
              className="year-selector"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ 風險警示</h3>
          <div className="alerts-grid">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`alert-card ${alert.level}`}>
                <div className="alert-icon">
                  {alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-action">建議：{alert.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadline Countdown */}
      <div className="deadline-card">
        <div className="deadline-content">
          <div className="deadline-label">⏰ 法定申報截止日</div>
          <div className="deadline-date">{reportYear}年 8月 31日</div>
          <div className={`days-remaining ${daysToDeadline <= 30 ? 'urgent' : ''}`}>
            {daysToDeadline > 0 ? `剩餘 ${daysToDeadline} 天` : '已截止'}
          </div>
        </div>
        <div className="deadline-progress">
          <div className="progress-label">整體完成度</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress.overall}%` }}></div>
          </div>
          <div className="progress-text">
            {progress.overall.toFixed(0)}% ({progress.completedTasks}/{progress.totalTasks} 項任務)
          </div>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="milestones-section">
        <h3>🎯 關鍵里程碑</h3>
        <div className="milestones-timeline">
          {milestones.map((milestone, idx) => {
            const isPast = now > milestone.date;
            const isSoon =
              !isPast &&
              (milestone.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <=
                milestone.alertDaysBefore;

            return (
              <div
                key={idx}
                className={`milestone-item ${isPast ? 'past' : isSoon ? 'upcoming' : 'future'} ${milestone.type}`}
              >
                <div className="milestone-date">
                  {milestone.date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
                </div>
                <div className="milestone-marker">
                  {isPast ? '✓' : milestone.type === 'deadline' ? '!' : '○'}
                </div>
                <div className="milestone-info">
                  <div className="milestone-name">{milestone.name}</div>
                  <div className="milestone-desc">{milestone.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Progress */}
      <div className="phases-section">
        <h3>📊 各階段進度</h3>
        <div className="phases-grid">
          {timeline.map((phase, idx) => {
            const phaseProgress = progress.byPhase[phase.phase] || 0;
            const isActive = now >= phase.startDate && now <= phase.deadline;
            const isOverdue = now > phase.deadline && phase.status !== 'completed';

            return (
              <div
                key={idx}
                className={`phase-card ${phase.status} ${isActive ? 'active' : ''} ${isOverdue ? 'overdue' : ''}`}
              >
                <div className="phase-header">
                  <div className="phase-number">階段 {idx + 1}</div>
                  <div className={`phase-status ${phase.status}`}>
                    {phase.status === 'completed'
                      ? '✓ 已完成'
                      : phase.status === 'in_progress'
                        ? '⚡ 進行中'
                        : isOverdue
                          ? '⚠️ 逾期'
                          : '待開始'}
                  </div>
                </div>

                <h4>{phase.phase}</h4>
                <p className="phase-desc">{phase.description}</p>

                <div className="phase-dates">
                  <div className="date-item">
                    <span className="date-label">開始</span>
                    <span className="date-value">
                      {phase.startDate.toLocaleDateString('zh-TW', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">截止</span>
                    <span className="date-value">
                      {phase.deadline.toLocaleDateString('zh-TW', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="phase-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${phaseProgress}%` }}></div>
                  </div>
                  <div className="progress-text">{phaseProgress.toFixed(0)}%</div>
                </div>

                <div className="tasks-summary">
                  <span>
                    {phase.tasks.filter(t => t.status === 'completed').length}/{phase.tasks.length}{' '}
                    項任務
                  </span>
                </div>

                <details className="tasks-details">
                  <summary>查看任務清單</summary>
                  <div className="tasks-list">
                    {phase.tasks.map((task, tidx) => (
                      <div key={tidx} className={`task-item ${task.status}`}>
                        <div className="task-check">
                          {task.status === 'completed'
                            ? '✓'
                            : task.status === 'in_progress'
                              ? '⚡'
                              : '○'}
                        </div>
                        <div className="task-info">
                          <div className="task-name">{task.name}</div>
                          <div className="task-meta">
                            <span>負責：{task.responsible}</span>
                            <span>預估：{task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Requirements */}
      <div className="regulatory-section">
        <h3>📜 法規要求</h3>
        <div className="regulatory-grid">
          <div className="reg-card">
            <h4>🌡️ 溫室氣體盤查</h4>
            <div className="reg-timeline">
              <div className="reg-item">
                <span className="reg-label">開始年度</span>
                <span className="reg-value">{regulatoryPhase.ghgInventoryYear}</span>
              </div>
              <div className="reg-desc">
                依資本額{company.paidInCapital}億，須於 {regulatoryPhase.ghgInventoryYear} 年起揭露
                Scope 1/2/3 盤查結果
              </div>
            </div>
          </div>

          <div className="reg-card">
            <h4>✅ 第三方確信</h4>
            <div className="reg-timeline">
              <div className="reg-item">
                <span className="reg-label">開始年度</span>
                <span className="reg-value">{regulatoryPhase.ghgAssuranceYear}</span>
              </div>
              <div className="reg-desc">
                須於 {regulatoryPhase.ghgAssuranceYear} 年起取得第三方確信/保證
              </div>
            </div>
          </div>

          <div className="reg-card">
            <h4>🎯 減碳目標</h4>
            <div className="reg-timeline">
              <div className="reg-item">
                <span className="reg-label">開始年度</span>
                <span className="reg-value">{regulatoryPhase.reductionTargetYear}</span>
              </div>
              <div className="reg-desc">
                須於 {regulatoryPhase.reductionTargetYear} 年起揭露減碳目標、策略及具體行動計畫
              </div>
            </div>
          </div>

          <div className="reg-card highlighted">
            <h4>📤 申報平台</h4>
            <div className="reg-desc">證交所/櫃買中心「公開資訊觀測站 ESG數位平台」</div>
            <button className="platform-link">前往申報平台 →</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .taiwan-esg-timeline {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 32px;
          color: white;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .header {
          margin-bottom: 32px;
        }

        .title-section h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .subtitle {
          opacity: 0.9;
          font-size: 14px;
        }

        .company-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 20px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label {
          font-size: 12px;
          opacity: 0.8;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
        }

        .year-selector {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .alerts-section {
          margin-bottom: 24px;
        }

        .alerts-section h3 {
          font-size: 20px;
          margin-bottom: 16px;
        }

        .alerts-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          border-left: 4px solid;
        }

        .alert-card.critical {
          border-left-color: #ef4444;
        }

        .alert-card.warning {
          border-left-color: #f59e0b;
        }

        .alert-icon {
          font-size: 24px;
        }

        .alert-content {
          flex: 1;
          color: #1e293b;
        }

        .alert-message {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .alert-action {
          font-size: 13px;
          color: #64748b;
        }

        .deadline-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          color: #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .deadline-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .deadline-date {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .days-remaining {
          font-size: 18px;
          font-weight: 600;
          color: #10b981;
        }

        .days-remaining.urgent {
          color: #ef4444;
        }

        .deadline-progress {
          flex: 1;
        }

        .progress-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 24px;
          background: #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          text-align: right;
        }

        .milestones-section,
        .phases-section,
        .regulatory-section {
          margin-bottom: 32px;
        }

        .milestones-section h3,
        .phases-section h3,
        .regulatory-section h3 {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .milestones-timeline {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
        }

        .milestone-item {
          display: grid;
          grid-template-columns: 80px 40px 1fr;
          gap: 16px;
          padding: 16px;
          border-left: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
        }

        .milestone-item.deadline {
          border-left-color: #ef4444;
        }

        .milestone-date {
          font-size: 13px;
          opacity: 0.8;
        }

        .milestone-marker {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .milestone-item.deadline .milestone-marker {
          background: #ef4444;
        }

        .milestone-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .milestone-desc {
          font-size: 13px;
          opacity: 0.8;
        }

        .phases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .phase-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          color: #1e293b;
        }

        .phase-card.active {
          border: 2px solid #8b5cf6;
        }

        .phase-card.overdue {
          border: 2px solid #ef4444;
        }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .phase-number {
          background: #e2e8f0;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .phase-status {
          font-size: 12px;
          font-weight: 600;
        }

        .phase-status.completed {
          color: #10b981;
        }

        .phase-status.in_progress {
          color: #f59e0b;
        }

        .phase-card h4 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .phase-desc {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .phase-dates {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .date-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-label {
          font-size: 11px;
          color: #94a3b8;
        }

        .date-value {
          font-size: 13px;
          font-weight: 600;
        }

        .phase-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .phase-progress .progress-bar {
          flex: 1;
          height: 8px;
        }

        .phase-progress .progress-text {
          font-size: 12px;
        }

        .tasks-summary {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .tasks-details summary {
          cursor: pointer;
          font-size: 13px;
          color: #8b5cf6;
          font-weight: 600;
        }

        .tasks-list {
          margin-top: 12px;
        }

        .task-item {
          display: flex;
          gap: 12px;
          padding: 8px;
          margin-bottom: 4px;
          border-radius: 6px;
          background: #f8fafc;
        }

        .task-check {
          width: 20px;
          font-size: 14px;
        }

        .task-name {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .task-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #94a3b8;
        }

        .regulatory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .reg-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          color: #1e293b;
        }

        .reg-card.highlighted {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
        }

        .reg-card h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .reg-timeline {
          font-size: 13px;
        }

        .reg-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .reg-label {
          color: #64748b;
        }

        .reg-value {
          font-weight: 700;
          font-size: 16px;
          color: #8b5cf6;
        }

        .reg-desc {
          color: #64748b;
          line-height: 1.6;
        }

        .highlighted .reg-desc {
          color: rgba(255, 255, 255, 0.9);
        }

        .platform-link {
          background: white;
          color: #f59e0b;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 12px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
