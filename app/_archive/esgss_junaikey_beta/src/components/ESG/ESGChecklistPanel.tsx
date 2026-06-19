/**
 * ESG 檢核清單 UI 組件
 * =====================
 * 整合單據上傳與問題回答的完整檢核界面
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ALL_DOCUMENTS,
  getDocumentsByCategory,
  getCriticalDocuments,
} from '@/config/DocumentRegistry';
import {
  ALL_QUESTIONS,
  getQuestionsByCategory,
  getRequiredQuestions,
} from '@/config/QuestionRegistry';

type TabType = 'overview' | 'documents' | 'questions' | 'progress';

export default function ESGChecklistPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  // 計算完成度
  const docProgress = (uploadedDocs.size / ALL_DOCUMENTS.filter(d => d.required).length) * 100;
  const questionProgress = (answeredQuestions.size / getRequiredQuestions().length) * 100;
  const overallProgress = (docProgress + questionProgress) / 2;

  return (
    <div className="esg-checklist-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>📋 ESG 報告書檢核清單</h2>
        <p className="subtitle">確保數據完整性與問題回答度</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 總覽
        </button>
        <button
          className={activeTab === 'documents' ? 'active' : ''}
          onClick={() => setActiveTab('documents')}
        >
          📄 單據上傳
          <span className="badge">
            {uploadedDocs.size}/{ALL_DOCUMENTS.filter(d => d.required).length}
          </span>
        </button>
        <button
          className={activeTab === 'questions' ? 'active' : ''}
          onClick={() => setActiveTab('questions')}
        >
          ❓ 問題回答
          <span className="badge">
            {answeredQuestions.size}/{getRequiredQuestions().length}
          </span>
        </button>
        <button
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => setActiveTab('progress')}
        >
          📈 進度追蹤
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab
            docProgress={docProgress}
            questionProgress={questionProgress}
            overallProgress={overallProgress}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab uploadedDocs={uploadedDocs} setUploadedDocs={setUploadedDocs} />
        )}

        {activeTab === 'questions' && (
          <QuestionsTab
            answeredQuestions={answeredQuestions}
            setAnsweredQuestions={setAnsweredQuestions}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTab uploadedDocs={uploadedDocs} answeredQuestions={answeredQuestions} />
        )}
      </div>

      <style jsx>{`
        .esg-checklist-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          min-height: 600px;
        }

        .panel-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .subtitle {
          opacity: 0.9;
          font-size: 14px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin: 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tabs button {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 12px 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tabs button:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .tabs button.active {
          color: white;
          border-bottom-color: white;
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          min-height: 400px;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}

// ==================== 總覽 Tab ====================
function OverviewTab({ docProgress, questionProgress, overallProgress }: any) {
  const criticalDocs = getCriticalDocuments();
  const requiredQuestions = getRequiredQuestions();

  return (
    <div className="overview-tab">
      <h3>📊 整體進度</h3>

      <div className="progress-card main-progress">
        <div className="progress-header">
          <span>總體完成度</span>
          <span className="percentage">{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-info">
            <div className="metric-label">單據上傳</div>
            <div className="metric-value">{docProgress.toFixed(0)}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❓</div>
          <div className="metric-info">
            <div className="metric-label">問題回答</div>
            <div className="metric-value">{questionProgress.toFixed(0)}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚠️</div>
          <div className="metric-info">
            <div className="metric-label">關鍵單據</div>
            <div className="metric-value">{criticalDocs.length} 份</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-info">
            <div className="metric-label">必答問題</div>
            <div className="metric-value">{requiredQuestions.length} 題</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h4>🚀 快速操作</h4>
        <button className="action-btn primary">上傳關鍵單據</button>
        <button className="action-btn secondary">回答必答問題</button>
        <button className="action-btn">下載檢核報告</button>
      </div>

      <style jsx>{`
        .overview-tab h3 {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .progress-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .percentage {
          font-size: 24px;
          color: #8b5cf6;
        }

        .progress-bar {
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          transition: width 0.5s ease;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1e293b;
        }

        .metric-icon {
          font-size: 32px;
        }

        .metric-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        .quick-actions {
          margin-top: 24px;
        }

        .quick-actions h4 {
          margin-bottom: 12px;
          font-size: 16px;
        }

        .action-btn {
          display: block;
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn.primary {
          background: #8b5cf6;
          color: white;
        }

        .action-btn.secondary {
          background: #ec4899;
          color: white;
        }

        .action-btn:not(.primary):not(.secondary) {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

// ==================== 單據 Tab ====================
function DocumentsTab({ uploadedDocs, setUploadedDocs }: any) {
  const [filter, setFilter] = useState<'all' | 'Environment' | 'Social' | 'Governance'>('all');

  const filteredDocs = filter === 'all' ? ALL_DOCUMENTS : getDocumentsByCategory(filter);

  const handleUpload = (docId: string) => {
    setUploadedDocs(new Set([...uploadedDocs, docId]));
  };

  return (
    <div className="documents-tab">
      <div className="filter-bar">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          全部 ({ALL_DOCUMENTS.length})
        </button>
        <button
          onClick={() => setFilter('Environment')}
          className={filter === 'Environment' ? 'active' : ''}
        >
          🌱 環境 ({getDocumentsByCategory('Environment').length})
        </button>
        <button onClick={() => setFilter('Social')} className={filter === 'Social' ? 'active' : ''}>
          👥 社會 ({getDocumentsByCategory('Social').length})
        </button>
        <button
          onClick={() => setFilter('Governance')}
          className={filter === 'Governance' ? 'active' : ''}
        >
          📊 治理 ({getDocumentsByCategory('Governance').length})
        </button>
      </div>

      <div className="documents-list">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className={`document-item ${uploadedDocs.has(doc.id) ? 'uploaded' : ''}`}
          >
            <div className="doc-header">
              <div className="doc-title">
                {uploadedDocs.has(doc.id) ? '✅' : doc.required ? '⚠️' : '📄'} {doc.name}
                {doc.urgency === 'critical' && <span className="critical-badge">關鍵</span>}
              </div>
              <div className="doc-status">
                {uploadedDocs.has(doc.id) ? (
                  <span className="status-badge uploaded">已上傳</span>
                ) : (
                  <button className="upload-btn" onClick={() => handleUpload(doc.id)}>
                    上傳
                  </button>
                )}
              </div>
            </div>
            <div className="doc-description">{doc.description}</div>
            <div className="doc-meta">
              <span>格式: {doc.acceptedFormats.join(', ')}</span>
              <span>大小上限: {doc.maxSizeMB}MB</span>
              <span>框架: {doc.requiredBy.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-bar button {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-bar button.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: white;
        }

        .documents-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .document-item {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          color: #1e293b;
          transition: all 0.3s;
        }

        .document-item.uploaded {
          border-left: 4px solid #10b981;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .doc-title {
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .critical-badge {
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
        }

        .status-badge.uploaded {
          background: #d1fae5;
          color: #065f46;
        }

        .upload-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }

        .doc-description {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .doc-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

// ==================== 問題 Tab ====================
function QuestionsTab({ answeredQuestions, setAnsweredQuestions }: any) {
  const [filter, setFilter] = useState<'all' | 'Environment' | 'Social' | 'Governance'>('all');

  const filteredQuestions = filter === 'all' ? ALL_QUESTIONS : getQuestionsByCategory(filter);

  const handleAnswer = (questionId: string) => {
    setAnsweredQuestions(new Set([...answeredQuestions, questionId]));
  };

  return (
    <div className="questions-tab">
      <div className="filter-bar">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          全部 ({ALL_QUESTIONS.length})
        </button>
        <button
          onClick={() => setFilter('Environment')}
          className={filter === 'Environment' ? 'active' : ''}
        >
          🌱 環境 ({getQuestionsByCategory('Environment').length})
        </button>
        <button onClick={() => setFilter('Social')} className={filter === 'Social' ? 'active' : ''}>
          👥 社會 ({getQuestionsByCategory('Social').length})
        </button>
        <button
          onClick={() => setFilter('Governance')}
          className={filter === 'Governance' ? 'active' : ''}
        >
          📊 治理 ({getQuestionsByCategory('Governance').length})
        </button>
      </div>

      <div className="questions-list">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className={`question-item ${answeredQuestions.has(q.id) ? 'answered' : ''}`}
          >
            <div className="question-header">
              <div className="question-number">Q{idx + 1}</div>
              <div className="question-text">
                {answeredQuestions.has(q.id) ? '✅' : q.required ? '⚠️' : '📝'} {q.question}
              </div>
            </div>
            <div className="question-meta">
              <span>類別: {q.subcategory}</span>
              <span>框架: {q.framework.join(', ')}</span>
              {q.required && <span className="required-badge">必答</span>}
            </div>
            <div className="question-guidance">💡 {q.guidance}</div>
            {!answeredQuestions.has(q.id) && (
              <button className="answer-btn" onClick={() => handleAnswer(q.id)}>
                填寫答案
              </button>
            )}
            {answeredQuestions.has(q.id) && <div className="answered-indicator">✓ 已回答</div>}
          </div>
        ))}
      </div>

      <style jsx>{`
        .questions-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .question-item {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .question-item.answered {
          border-left: 4px solid #10b981;
        }

        .question-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .question-number {
          background: #8b5cf6;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .question-text {
          font-weight: 600;
          line-height: 1.4;
        }

        .question-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .required-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .question-guidance {
          background: #f1f5f9;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          color: #475569;
          margin-bottom: 12px;
        }

        .answer-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .answered-indicator {
          color: #10b981;
          font-weight: 600;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

// ==================== 進度 Tab ====================
function ProgressTab({ uploadedDocs, answeredQuestions }: any) {
  return (
    <div className="progress-tab">
      <h3>📈 詳細進度報告</h3>

      <div className="progress-section">
        <h4>📄 單據上傳進度</h4>
        <div className="category-progress">
          <div className="category-item">
            <span>🌱 環境類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '60%' }}></div>
            </div>
            <span>60%</span>
          </div>
          <div className="category-item">
            <span>👥 社會類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '40%' }}></div>
            </div>
            <span>40%</span>
          </div>
          <div className="category-item">
            <span>📊 治理類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '80%' }}></div>
            </div>
            <span>80%</span>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h4>❓ 問題回答進度</h4>
        <div className="category-progress">
          <div className="category-item">
            <span>🌱 環境類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '50%' }}></div>
            </div>
            <span>50%</span>
          </div>
          <div className="category-item">
            <span>👥 社會類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '33%' }}></div>
            </div>
            <span>33%</span>
          </div>
          <div className="category-item">
            <span>📊 治理類</span>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: '66%' }}></div>
            </div>
            <span>66%</span>
          </div>
        </div>
      </div>

      <div className="recommendations">
        <h4>💡 建議事項</h4>
        <ul>
          <li>⚠️ 請優先上傳「溫室氣體排放清冊」等 3 份關鍵單據</li>
          <li>📝 還有 8 題必答問題待回答</li>
          <li>🎯 建議完成度達 80% 以上再生成報告</li>
        </ul>
      </div>

      <style jsx>{`
        .progress-tab h3 {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .progress-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          color: #1e293b;
        }

        .progress-section h4 {
          font-size: 16px;
          margin-bottom: 16px;
        }

        .category-progress {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-item span:first-child {
          min-width: 80px;
          font-size: 13px;
        }

        .mini-progress {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
        }

        .category-item span:last-child {
          min-width: 40px;
          text-align: right;
          font-weight: 600;
          font-size: 13px;
        }

        .recommendations {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          color: #1e293b;
        }

        .recommendations h4 {
          font-size: 16px;
          margin-bottom: 12px;
        }

        .recommendations ul {
          list-style: none;
          padding: 0;
        }

        .recommendations li {
          padding: 8px 0;
          font-size: 13px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
