#!/usr/bin/env node

/**
 * ==========================================
 * 完全代主自行 - CLI 工具
 * ==========================================
 * 
 * 命令列工具 for 管理完全代主自行授權
 * 
 * 用法:
 *   esggo-delegation create --principal user-001 --permissions read,write
 *   esggo-delegation list
 *   esggo-delegation get <delegation-id>
 *   esggo-delegation terminate <delegation-id> --reason "任務完成"
 *   esggo-delegation execute <delegation-id> --intent "generate-report"
 */

import { Command } from 'commander';
import {
  createCompleteDelegationAgent,
  executeCompleteDelegationTask,
  getDelegationManager,
} from '../src/agents/complete-delegation';
import { DelegationPermission } from '../src/types/complete-delegation';

// ==========================================
// CLI 配置
// ==========================================

const program = new Command();

program
  .name('esggo-delegation')
  .description('完全代主自行 - CLI 工具')
  .version('1.0.0');

// ==========================================
// 命令: create - 創建授權
// ==========================================

program
  .command('create')
  .description('創建新的完全代主自行授權')
  .requiredOption('-p, --principal <id>', '主體 ID')
  .option('-a, --agent <id>', '代理者 ID (自動生成)')
  .option('--permissions <perms>', '權限列表 (逗號分隔)', 'read,write,execute')
  .option('--valid-until <timestamp>', '有效期 (時間戳或 "infinity")', 'infinity')
  .option('-d, --description <desc>', '授權描述')
  .action(async (options) => {
    try {
      console.log('🔮 創建完全代主自行授權...\n');

      // 解析權限
      const permissions = options.permissions.split(',') as DelegationPermission[];

      // 解析有效期
      let validUntil: number | undefined;
      if (options.validUntil !== 'infinity') {
        validUntil = parseInt(options.validUntil, 10);
        if (isNaN(validUntil)) {
          console.error('❌ 無效的有效期格式');
          process.exit(1);
        }
      }

      // 創建授權
      const agent = await createCompleteDelegationAgent({
        principalId: options.principal,
        agentId: options.agent,
        permissions,
        validUntil,
        description: options.description,
      });

      console.log('✅ 授權已創建\n');
      console.log('📋 授權資訊:');
      console.log(`   授權 ID: ${agent.delegationScope.delegationId}`);
      console.log(`   代理者 ID: ${agent.signature.uuid}`);
      console.log(`   主體 ID: ${agent.principal}`);
      console.log(`   權限: ${agent.delegationScope.permissions.join(', ')}`);
      console.log(`   有效期: ${agent.delegationScope.validUntil === Infinity ? '永久' : new Date(agent.delegationScope.validUntil).toLocaleString()}`);
      if (agent.delegationScope.description) {
        console.log(`   描述: ${agent.delegationScope.description}`);
      }
      console.log('');

    } catch (error) {
      console.error('❌ 創建授權失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 命令: list - 列出活躍授權
// ==========================================

program
  .command('list')
  .description('列出所有活躍授權')
  .option('-p, --principal <id>', '篩選主體 ID')
  .action(async (options) => {
    try {
      console.log('📋 活躍授權列表\n');

      const manager = getDelegationManager();
      const delegations = await manager.getActiveDelegations(options.principal);

      if (delegations.length === 0) {
        console.log('   暫無活躍授權\n');
        return;
      }

      console.log(`   共 ${delegations.length} 筆授權\n`);

      for (const d of delegations) {
        console.log('─'.repeat(50));
        console.log(`   授權 ID: ${d.delegationId}`);
        console.log(`   代理者 ID: ${d.agentId}`);
        console.log(`   主體 ID: ${d.principalId}`);
        console.log(`   權限: ${d.permissions.join(', ')}`);
        console.log(`   有效期: ${d.validUntil === Infinity ? '永久' : new Date(d.validUntil).toLocaleString()}`);
        if (d.description) {
          console.log(`   描述: ${d.description}`);
        }
        console.log('');
      }

    } catch (error) {
      console.error('❌ 獲取授權列表失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 命令: get - 獲取特定授權
// ==========================================

program
  .command('get <delegationId>')
  .description('獲取特定授權詳細資訊')
  .action(async (delegationId) => {
    try {
      console.log(`📋 授權詳細資訊: ${delegationId}\n`);

      const manager = getDelegationManager();
      const delegation = await manager.getDelegation(delegationId);

      if (!delegation) {
        console.error('❌ 授權不存在');
        process.exit(1);
      }

      console.log('   授權資訊:');
      console.log(`   授權 ID: ${delegation.delegationId}`);
      console.log(`   代理者 ID: ${delegation.agentId}`);
      console.log(`   主體 ID: ${delegation.principalId}`);
      console.log(`   權限: ${delegation.permissions.join(', ')}`);
      console.log(`   有效期: ${delegation.validUntil === Infinity ? '永久' : new Date(delegation.validUntil).toLocaleString()}`);
      console.log(`   創建時間: ${new Date(delegation.validFrom).toLocaleString()}`);
      if (delegation.description) {
        console.log(`   描述: ${delegation.description}`);
      }
      if (delegation.restrictions.length > 0) {
        console.log('   限制條件:');
        for (const r of delegation.restrictions) {
          console.log(`     - ${r.type}: ${r.description}`);
        }
      }
      console.log('');

    } catch (error) {
      console.error('❌ 獲取授權失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 命令: terminate - 終止授權
// ==========================================

program
  .command('terminate <delegationId>')
  .description('終止授權')
  .option('-r, --reason <reason>', '終止原因', 'User terminated')
  .action(async (delegationId, options) => {
    try {
      console.log(`🔮 終止授權: ${delegationId}\n`);

      const manager = getDelegationManager();
      const delegation = await manager.getDelegation(delegationId);

      if (!delegation) {
        console.error('❌ 授權不存在');
        process.exit(1);
      }

      await manager.terminateDelegation(delegationId, options.reason);

      console.log('✅ 授權已終止\n');
      console.log(`   授權 ID: ${delegationId}`);
      console.log(`   終止原因: ${options.reason}`);
      console.log('');

    } catch (error) {
      console.error('❌ 終止授權失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 命令: execute - 執行任務
// ==========================================

program
  .command('execute <delegationId>')
  .description('使用授權執行任務')
  .requiredOption('-i, --intent <intent>', '任務意圖')
  .option('--context <json>', '任務上下文 (JSON 格式)', '{}')
  .action(async (delegationId, options) => {
    try {
      console.log(`🔮 執行任務: ${options.intent}\n`);

      // 解析上下文
      let context: Record<string, unknown>;
      try {
        context = JSON.parse(options.context);
      } catch {
        console.error('❌ 無效的上下文 JSON 格式');
        process.exit(1);
      }

      // 獲取授權
      const manager = getDelegationManager();
      const delegation = await manager.getDelegation(delegationId);

      if (!delegation) {
        console.error('❌ 授權不存在');
        process.exit(1);
      }

      // 創建代理並執行任務
      const { CompleteDelegationAgent } = await import(
        '../agents/complete-delegation/complete-delegation-agent'
      );
      const agent = new CompleteDelegationAgent(
        delegation.principalId,
        delegation
      );

      const result = await executeCompleteDelegationTask(
        agent,
        options.intent,
        context
      );

      console.log('📊 執行結果:');
      console.log(`   成功: ${result.success ? '是' : '否'}`);
      console.log(`   執行 ID: ${result.executionId}`);
      console.log(`   耗時: ${result.duration}ms`);
      if (result.error) {
        console.log(`   錯誤: ${result.error}`);
      }
      if (result.result) {
        console.log(`   結果: ${JSON.stringify(result.result, null, 2)}`);
      }
      console.log('');

    } catch (error) {
      console.error('❌ 執行任務失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 命令: validate - 驗證授權
// ==========================================

program
  .command('validate <delegationId>')
  .description('驗證授權有效性')
  .requiredOption('--permission <perm>', '要驗證的權限')
  .action(async (delegationId, options) => {
    try {
      console.log(`🔍 驗證授權: ${delegationId}\n`);

      const manager = getDelegationManager();
      const isValid = await manager.validateDelegation(
        delegationId,
        options.permission
      );

      console.log('   驗證結果:');
      console.log(`   授權 ID: ${delegationId}`);
      console.log(`   權限: ${options.permission}`);
      console.log(`   有效: ${isValid ? '是' : '否'}`);
      console.log('');

    } catch (error) {
      console.error('❌ 驗證授權失敗:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ==========================================
// 解析並執行
// ==========================================

program.parse(process.argv);
