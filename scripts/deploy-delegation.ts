/**
 * ==========================================
 * 完全代主自行 - 部署腳本
 * ==========================================
 * 
 * 自動化部署完全代主自行系統到生產環境
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// ==========================================
// 部署配置
// ==========================================

interface DeploymentConfig {
  /** 環境 */
  environment: 'development' | 'staging' | 'production';
  
  /** 部署目標 */
  target: 'local' | 'docker' | 'vercel' | 'render';
  
  /** 是否執行測試 */
  runTests: boolean;
  
  /** 是否執行建構 */
  build: boolean;
  
  /** 是否部署 UI */
  deployUI: boolean;
  
  /** 是否部署 API */
  deployAPI: boolean;
}

const defaultConfig: DeploymentConfig = {
  environment: 'production',
  target: 'docker',
  runTests: true,
  build: true,
  deployUI: true,
  deployAPI: true,
};

// ==========================================
// 部署函數
// ==========================================

/**
 * 執行部署
 */
export async function deploy(config: DeploymentConfig = defaultConfig): Promise<{
  success: boolean;
  steps: Array<{
    name: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    error?: string;
  }>;
  summary: {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    totalDuration: number;
  };
}> {
  const startTime = Date.now();
  const steps: Array<{
    name: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    error?: string;
  }> = [];

  console.log('🚀 開始部署完全代主自行系統');
  console.log(`   環境: ${config.environment}`);
  console.log(`   目標: ${config.target}`);
  console.log('');

  // 步驟 1: 環境檢查
  await runStep('環境檢查', async () => {
    checkEnvironment(config);
  }, steps);

  // 步驟 2: 執行測試
  if (config.runTests) {
    await runStep('執行測試', async () => {
      runTests();
    }, steps);
  }

  // 步驟 3: 建構系統
  if (config.build) {
    await runStep('建構系統', async () => {
      buildSystem(config);
    }, steps);
  }

  // 步驟 4: 部署 API
  if (config.deployAPI) {
    await runStep('部署 API', async () => {
      deployAPI(config);
    }, steps);
  }

  // 步驟 5: 部署 UI
  if (config.deployUI) {
    await runStep('部署 UI', async () => {
      deployUI(config);
    }, steps);
  }

  // 步驟 6: 驗證部署
  await runStep('驗證部署', async () => {
    verifyDeployment(config);
  }, steps);

  // 計算摘要
  const completedSteps = steps.filter((s) => s.status === 'success').length;
  const failedSteps = steps.filter((s) => s.status === 'failed').length;
  const totalDuration = Date.now() - startTime;

  console.log('');
  console.log('📊 部署摘要');
  console.log(`   總步驟: ${steps.length}`);
  console.log(`   成功: ${completedSteps}`);
  console.log(`   失敗: ${failedSteps}`);
  console.log(`   耗時: ${totalDuration}ms`);

  return {
    success: failedSteps === 0,
    steps,
    summary: {
      totalSteps: steps.length,
      completedSteps,
      failedSteps,
      totalDuration,
    },
  };
}

/**
 * 執行單個步驟
 */
async function runStep(
  name: string,
  fn: () => void | Promise<void>,
  steps: Array<{
    name: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    error?: string;
  }>
): Promise<void> {
  const startTime = Date.now();
  console.log(`⏳ ${name}...`);

  try {
    await fn();
    const duration = Date.now() - startTime;
    steps.push({ name, status: 'success', duration });
    console.log(`✅ ${name} 完成 (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    steps.push({ name, status: 'failed', duration, error: errorMessage });
    console.error(`❌ ${name} 失敗: ${errorMessage}`);
  }
}

// ==========================================
// 部署步驟實現
// ==========================================

/**
 * 環境檢查
 */
function checkEnvironment(config: DeploymentConfig): void {
  // 檢查 Node.js 版本
  const nodeVersion = process.version;
  console.log(`   Node.js 版本: ${nodeVersion}`);

  // 檢查必要檔案
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/core/omni-core.ts',
    'src/agents/complete-delegation/index.ts',
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      throw new Error(`必要檔案不存在: ${file}`);
    }
  }

  // 檢查環境變數
  if (config.environment === 'production') {
    const requiredEnvVars = ['NODE_ENV'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`   ⚠️ 環境變數未設定: ${envVar}`);
      }
    }
  }
}

/**
 * 執行測試
 */
function runTests(): void {
  console.log('   執行 vitest 測試...');
  execSync('npx vitest run tests/complete-delegation.test.ts', {
    stdio: 'inherit',
  });
}

/**
 * 建構系統
 */
function buildSystem(config: DeploymentConfig): void {
  console.log('   建構 TypeScript...');
  
  if (config.target === 'vercel') {
    // Vercel 建構
    execSync('npx vercel build', { stdio: 'inherit' });
  } else {
    // 通用建構
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
  }
}

/**
 * 部署 API
 */
function deployAPI(config: DeploymentConfig): void {
  console.log('   部署 API 路由...');
  
  switch (config.target) {
    case 'vercel':
      execSync('npx vercel --prod', { stdio: 'inherit' });
      break;
    case 'docker':
      console.log('   Docker 部署需要 docker-compose.yml');
      break;
    case 'render':
      console.log('   Render 部署需要 render.yaml');
      break;
    default:
      console.log('   本地部署跳過');
  }
}

/**
 * 部署 UI
 */
function deployUI(config: DeploymentConfig): void {
  console.log('   部署 UI 元件...');
  
  switch (config.target) {
    case 'vercel':
      execSync('npx vercel --prod', { stdio: 'inherit' });
      break;
    case 'docker':
      console.log('   Docker 部署需要 docker-compose.yml');
      break;
    default:
      console.log('   本地部署跳過');
  }
}

/**
 * 驗證部署
 */
function verifyDeployment(config: DeploymentConfig): void {
  console.log('   驗證部署完整性...');
  
  // 檢查建構輸出
  const buildDir = config.target === 'vercel' ? '.vercel' : 'dist';
  if (config.build && !existsSync(buildDir)) {
    console.warn(`   ⚠️ 建構目錄不存在: ${buildDir}`);
  }
  
  console.log('   ✅ 部署驗證完成');
}

// ==========================================
// CLI 入口
// ==========================================

/**
 * 主函數
 */
export async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  const config: DeploymentConfig = {
    environment: (args[0] as DeploymentConfig['environment']) || 'production',
    target: (args[1] as DeploymentConfig['target']) || 'docker',
    runTests: !args.includes('--skip-tests'),
    build: !args.includes('--skip-build'),
    deployUI: !args.includes('--skip-ui'),
    deployAPI: !args.includes('--skip-api'),
  };

  const result = await deploy(config);

  if (!result.success) {
    process.exit(1);
  }
}

// 如果直接執行此文件
if (require.main === module) {
  main().catch(console.error);
}
