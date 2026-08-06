/**
 * ==========================================
 * 完全代主自行 - ESG 合規代理使用範例
 * ==========================================
 * 
 * 展示如何使用完全代主自行系統來處理 ESG 合規任務
 * 
 * 「代理者在完全授權範圍內，自主、獨立、全面地代替主體行使職權與執行行動。」
 */

import {
  createCompleteDelegationAgent,
  executeCompleteDelegationTask,
  CompleteDelegationAgent,
} from '../src/agents/complete-delegation';

// ==========================================
// 範例 1: ESG 報告生成代理
// ==========================================

/**
 * 場景：用戶授權代理者自主生成 ESG 報告
 */
export async function example1_ESGReportGeneration() {
  console.log('=== 範例 1: ESG 報告生成代理 ===\n');

  // 1. 創建完全代主自行代理
  const agent = await createCompleteDelegationAgent({
    principalId: 'user-001',
    permissions: ['read', 'write', 'execute', 'decide'],
    description: 'ESG 報告生成代理',
  });

  console.log(`代理已創建: ${agent.signature.uuid}`);
  console.log(`主體: ${agent.principal}`);
  console.log(`授權範圍: ${agent.delegationScope.permissions.join(', ')}\n`);

  // 2. 執行 ESG 報告生成任務
  const result = await executeCompleteDelegationTask(
    agent,
    'generate-esg-report',
    {
      reportType: 'annual',
      year: 2026,
      sections: ['environmental', 'social', 'governance'],
      format: 'pdf',
    }
  );

  console.log('執行結果:');
  console.log(`- 成功: ${result.success}`);
  console.log(`- 執行 ID: ${result.executionId}`);
  console.log(`- 耗時: ${result.duration}ms`);
  console.log(`- 結果:`, result.result);
  console.log('\n');
}

// ==========================================
// 範例 2: 碳排放追蹤代理
// ==========================================

/**
 * 場景：代理者自主追蹤並報告碳排放數據
 */
export async function example2_CarbonTracking() {
  console.log('=== 範例 2: 碳排放追蹤代理 ===\n');

  // 1. 創建碳排放追蹤代理
  const agent = await createCompleteDelegationAgent({
    principalId: 'company-001',
    agentId: 'carbon-tracker-001',
    permissions: ['read', 'write', 'execute'],
    description: '碳排放追蹤代理',
  });

  console.log(`碳排放追蹤代理已創建: ${agent.signature.uuid}\n`);

  // 2. 執行碳排放數據收集
  const collectResult = await executeCompleteDelegationTask(
    agent,
    'collect-carbon-data',
    {
      sources: ['electricity', 'transportation', 'manufacturing'],
      period: '2026-Q1',
      facilities: ['factory-001', 'office-001'],
    }
  );

  console.log('碳排放數據收集結果:');
  console.log(`- 成功: ${collectResult.success}`);
  console.log(`- 執行 ID: ${collectResult.executionId}\n`);

  // 3. 執行碳排放分析
  const analysisResult = await executeCompleteDelegationTask(
    agent,
    'analyze-carbon-emissions',
    {
      data: collectResult.result,
      benchmarks: ['industry-average', 'previous-year'],
      targets: ['net-zero-2030'],
    }
  );

  console.log('碳排放分析結果:');
  console.log(`- 成功: ${analysisResult.success}`);
  console.log(`- 分析結果:`, analysisResult.result);
  console.log('\n');
}

// ==========================================
// 範例 3: 供應鏈合規代理
// ==========================================

/**
 * 場景：代理者自主審計供應鏈合規性
 */
export async function example3_SupplyChainCompliance() {
  console.log('=== 範例 3: 供應鏈合規代理 ===\n');

  // 1. 創建供應鏈合規代理
  const agent = await createCompleteDelegationAgent({
    principalId: 'enterprise-001',
    permissions: ['read', 'execute', 'decide'],
    restrictions: [
      {
        type: 'scope',
        description: '僅限供應鏈合規審計',
        value: 'supply-chain-audit',
      },
    ],
    description: '供應鏈合規代理',
  });

  console.log(`供應鏈合規代理已創建: ${agent.signature.uuid}\n`);

  // 2. 執行供應鏈審計
  const auditResult = await executeCompleteDelegationTask(
    agent,
    'audit-supply-chain',
    {
      suppliers: ['supplier-001', 'supplier-002', 'supplier-003'],
      criteria: ['labor-practices', 'environmental-standards', 'ethics'],
      standards: ['ISO-14001', 'SA8000'],
    }
  );

  console.log('供應鏈審計結果:');
  console.log(`- 成功: ${auditResult.success}`);
  console.log(`- 審計結果:`, auditResult.result);
  console.log('\n');
}

// ==========================================
// 範例 4: 多步驟工作流代理
// ==========================================

/**
 * 場景：代理者執行多步驟 ESG 工作流
 */
export async function example4_MultiStepWorkflow() {
  console.log('=== 範例 4: 多步驟工作流代理 ===\n');

  // 1. 創建工作流代理
  const agent = await createCompleteDelegationAgent({
    principalId: 'organization-001',
    permissions: ['full'],
    description: 'ESG 工作流代理',
  });

  console.log(`工作流代理已創建: ${agent.signature.uuid}\n`);

  // 2. 執行完整 ESG 工作流
  const workflowResult = await executeCompleteDelegationTask(
    agent,
    'execute-esg-workflow',
    {
      steps: [
        {
          name: 'data-collection',
          action: 'collect-esg-data',
          params: { sources: ['internal', 'external'] },
        },
        {
          name: 'analysis',
          action: 'analyze-data',
          params: { methods: ['trend', 'benchmark'] },
        },
        {
          name: 'report-generation',
          action: 'generate-report',
          params: { format: 'comprehensive' },
        },
        {
          name: 'compliance-check',
          action: 'verify-compliance',
          params: ['GRI', 'SASB', 'TCFD'],
        },
      ],
      output: {
        format: 'pdf',
        distribution: ['management', 'board', 'public'],
      },
    }
  );

  console.log('工作流執行結果:');
  console.log(`- 成功: ${workflowResult.success}`);
  console.log(`- 執行 ID: ${workflowResult.executionId}`);
  console.log(`- 結果:`, workflowResult.result);
  console.log('\n');
}

// ==========================================
// 範例 5: 授權管理
// ==========================================

/**
 * 場景：管理授權生命週期
 */
export async function example5_DelegationManagement() {
  console.log('=== 範例 5: 授權管理 ===\n');

  const { getDelegationManager } = await import(
    '../agents/complete-delegation/delegation-manager'
  );
  const manager = getDelegationManager();

  // 1. 創建多個授權
  const delegation1 = await manager.createCompleteDelegation({
    principalId: 'user-001',
    agentId: 'agent-001',
    permissions: ['read', 'execute'],
    description: '讀取和執行授權',
  });

  const delegation2 = await manager.createCompleteDelegation({
    principalId: 'user-001',
    agentId: 'agent-002',
    permissions: ['full'],
    validUntil: Date.now() + 24 * 60 * 60 * 1000, // 24小時後過期
    description: '完全授權（24小時有效）',
  });

  console.log('已創建授權:');
  console.log(`- 授權 1: ${delegation1.delegationId}`);
  console.log(`- 授權 2: ${delegation2.delegationId}\n`);

  // 2. 查詢活躍授權
  const activeDelegations = await manager.getActiveDelegations('user-001');
  console.log(`活躍授權數量: ${activeDelegations.length}\n`);

  // 3. 驗證授權
  const isValid1 = await manager.validateDelegation(
    delegation1.delegationId,
    'read'
  );
  const isValid2 = await manager.validateDelegation(
    delegation1.delegationId,
    'write'
  );

  console.log('授權驗證:');
  console.log(`- 授權 1 讀取權限: ${isValid1 ? '有效' : '無效'}`);
  console.log(`- 授權 1 寫入權限: ${isValid2 ? '有效' : '無效'}\n`);

  // 4. 終止授權
  await manager.terminateDelegation(delegation1.delegationId, '任務完成');
  console.log('授權 1 已終止\n');

  // 5. 確認授權已終止
  const terminatedDelegation = await manager.getDelegation(
    delegation1.delegationId
  );
  console.log(`授權 1 狀態: ${terminatedDelegation ? '存在' : '已移除'}\n`);
}

// ==========================================
// 主函數
// ==========================================

/**
 * 執行所有範例
 */
export async function runAllExamples() {
  console.log('🔮 完全代主自行 - ESG 合規代理使用範例\n');
  console.log('='.repeat(50) + '\n');

  try {
    await example1_ESGReportGeneration();
    await example2_CarbonTracking();
    await example3_SupplyChainCompliance();
    await example4_MultiStepWorkflow();
    await example5_DelegationManagement();

    console.log('='.repeat(50));
    console.log('\n✅ 所有範例執行完成！');
  } catch (error) {
    console.error('❌ 執行錯誤:', error);
  }
}

// 如果直接執行此文件
if (require.main === module) {
  runAllExamples();
}
