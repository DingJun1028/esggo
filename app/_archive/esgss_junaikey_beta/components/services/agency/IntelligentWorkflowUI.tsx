// ESGss JunAiKey - Agentic Intelligence Services UI
// 4-3. 智能工作流構建器 (Intelligent Workflow Builder)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { IntelligentWorkflow, Workflow, WorkflowNode } from '../../../types/services-part4';

interface IntelligentWorkflowUIProps {
  data?: IntelligentWorkflow;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬工作流數據
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'WF-001',
    name: '碳排放自動審計流程',
    description: '當偵測到異常排放數據時，自動觸發審計並通知合規官。',
    category: 'compliance',
    version: '1.2.0',
    status: 'active',
    createdBy: 'System Admin',
    createdAt: new Date('2024-01-10'),
    nodes: [],
    connections: [],
    triggers: [],
    variables: [],
  },
  {
    id: 'WF-002',
    name: '新供應商 ESG 評估',
    description: '從提交申請到初步評分的自動化評估路徑。',
    category: 'supply_chain',
    version: '2.0.1',
    status: 'active',
    createdBy: 'Supply Chain Manager',
    createdAt: new Date('2024-01-15'),
    nodes: [],
    connections: [],
    triggers: [],
    variables: [],
  },
  {
    id: 'WF-003',
    name: '每日永續簡報生成',
    description: '蒐集每日新聞與數據，生成 CEO 簡報。',
    category: 'reporting',
    version: '0.9.5',
    status: 'draft',
    createdBy: 'AI Assistant',
    createdAt: new Date('2024-01-20'),
    nodes: [],
    connections: [],
    triggers: [],
    variables: [],
  },
];

export const IntelligentWorkflowUI: React.FC<IntelligentWorkflowUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'builder' | 'library' | 'history'>('library');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const t = {
    title: '智能工作流構建器',
    subtitle: 'Intelligent Workflow Builder',
    createFirst: '建立您的第一個工作流',
    tabs: {
      builder: '畫布構建',
      library: '工作流庫',
      history: '執行紀錄',
    },
    actions: {
      create: '建立新流程',
      import: '匯入模板',
      edit: '編輯',
      run: '執行',
      delete: '刪除',
    },
    status: {
      active: '運作中',
      draft: '草稿',
      inactive: '停用',
    },
    canvas: {
      dragText: '拖曳節點至此處開始構建',
      nodes: {
        trigger: '觸發器',
        action: '動作',
        condition: '條件判斷',
        ai: 'AI 推理',
        delay: '延遲',
      },
    },
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let color = colors.textSecondary;
    let bg = `${colors.textSecondary}22`;
    let label = status;

    switch (status) {
      case 'active':
        color = colors.success;
        bg = `${colors.success}22`;
        label = t.status.active;
        break;
      case 'draft':
        color = colors.accent;
        bg = `${colors.accent}22`;
        label = t.status.draft;
        break;
      case 'inactive':
        color = colors.error;
        bg = `${colors.error}22`;
        label = t.status.inactive;
        break;
    }

    return (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: bg,
          color: color,
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            : 'linear-gradient(135deg, #1e1e2f 0%, #252540 100%)', // 暗紫色調 (Agentic)
        color: colors.text,
        fontFamily: '"SF Pro Display", "Inter", "Noto Sans TC", sans-serif',
      }}
    >
      {/* 頂部導航 */}
      <header
        style={{
          padding: '24px 32px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{t.title}</h1>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>{t.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <GlassButton theme={theme} variant="ghost">
            {t.actions.import}
          </GlassButton>
          <GlassButton theme={theme} variant="primary" onClick={() => setIsBuilderOpen(true)}>
            + {t.actions.create}
          </GlassButton>
        </div>
      </header>

      {/* 主要內容 */}
      <main style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* 標籤切換 */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          {Object.entries(t.tabs).map(([key, label]) => (
            <GlassButton
              key={key}
              theme={theme}
              variant={activeTab === key ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(key as any)}
            >
              {label}
            </GlassButton>
          ))}
        </div>

        {/* 視圖內容 */}
        {activeTab === 'library' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {MOCK_WORKFLOWS.map(wf => (
              <GlassCard
                key={wf.id}
                theme={theme}
                style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                hover
                clickable
                onClick={() => setSelectedWorkflow(wf)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'white',
                    }}
                  >
                    ⚡
                  </div>
                  <StatusBadge status={wf.status} />
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                  {wf.name}
                </h3>
                <p
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.5',
                    height: '42px',
                    overflow: 'hidden',
                  }}
                >
                  {wf.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: colors.textSecondary,
                    borderTop: `1px solid ${colors.border}`,
                    paddingTop: '16px',
                  }}
                >
                  <span>v{wf.version}</span>
                  <span>{wf.createdAt.toLocaleDateString()}</span>
                </div>
              </GlassCard>
            ))}

            {/* 新增卡片 */}
            <GlassButton
              theme={theme}
              variant="ghost"
              onClick={() => setIsBuilderOpen(true)}
              style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '16px',
                height: '100%',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '32px', color: colors.textSecondary }}>+</span>
              <span style={{ color: colors.textSecondary }}>{t.createFirst}</span>
            </GlassButton>
          </div>
        )}

        {/* 歷史紀錄 (Placeholder) */}
        {activeTab === 'history' && (
          <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕰️</div>
            <h3>尚無執行紀錄</h3>
            <p style={{ color: colors.textSecondary }}>啟動工作流後，執行日誌將顯示於此。</p>
          </GlassCard>
        )}

        {/* 畫布構建器 (Placeholder View) */}
        {activeTab === 'builder' && (
          <div style={{ height: '600px', position: 'relative' }}>
            <GlassCard
              theme={theme}
              style={{ width: '100%', height: '100%', padding: '0', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', height: '100%' }}>
                {/* 左側工具欄 */}
                <div
                  style={{
                    width: '200px',
                    borderRight: `1px solid ${colors.border}`,
                    padding: '16px',
                    background: `${colors.background}55`,
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: colors.textSecondary,
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Nodes
                  </div>
                  {Object.entries(t.canvas.nodes).map(([key, label]) => (
                    <div
                      key={key}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        background: colors.background,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: key === 'trigger' ? colors.success : colors.primary,
                        }}
                      ></span>
                      {label}
                    </div>
                  ))}
                </div>

                {/* 中間畫布 */}
                <div
                  style={{
                    flex: 1,
                    position: 'relative',
                    background: `radial-gradient(${colors.border} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: colors.textSecondary,
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🏗️</div>
                    <p>{t.canvas.dragText}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </main>

      {/* 工作流詳細模態框 */}
      {selectedWorkflow && (
        <GlassModal
          isOpen={!!selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '24px', color: colors.text }}>
            <h2>{selectedWorkflow.name}</h2>
            <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
              {selectedWorkflow.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', color: colors.textSecondary }}>Category</label>
                <div style={{ fontWeight: '500' }}>{selectedWorkflow.category}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: colors.textSecondary }}>Author</label>
                <div style={{ fontWeight: '500' }}>{selectedWorkflow.createdBy}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedWorkflow(null)}>
                關閉
              </GlassButton>
              <GlassButton theme={theme} variant="primary">
                編輯設計
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* 全螢幕構建器模態框 */}
      {isBuilderOpen && (
        <GlassModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          theme={theme}
          size="xl"
        >
          <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <h2>🚀 工作流構建模式啟動</h2>
              <p style={{ color: colors.textSecondary }}>進階畫布功能載入中...</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '16px 0',
              }}
            >
              <GlassButton theme={theme} variant="ghost" onClick={() => setIsBuilderOpen(false)}>
                取消
              </GlassButton>
              <GlassButton theme={theme} variant="primary">
                儲存流程
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  IntelligentWorkflowUI,
};
