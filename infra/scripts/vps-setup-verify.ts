/**
 * ==========================================
 * 🛡️ VPS 設置驗證腳本
 * ==========================================
 * 
 * 驗證所有 VPS 相關文件和配置是否正確設置
 * 
 * 使用方式：
 *   npx tsx scripts/vps-setup-verify.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ==========================================
// 驗證結果類型
// ==========================================

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

// ==========================================
// 驗證函數
// ==========================================

function checkFileExists(filePath: string, description: string): CheckResult {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    return { name: description, status: 'pass', message: `文件存在: ${filePath}` };
  }
  return { name: description, status: 'fail', message: `文件不存在: ${filePath}` };
}

function checkFileNotEmpty(filePath: string, description: string): CheckResult {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    return { name: description, status: 'fail', message: `文件不存在: ${filePath}` };
  }
  const stats = fs.statSync(fullPath);
  if (stats.size > 0) {
    return { name: description, status: 'pass', message: `文件非空: ${filePath} (${stats.size} bytes)` };
  }
  return { name: description, status: 'warn', message: `文件為空: ${filePath}` };
}

function checkNoBOM(filePath: string, description: string): CheckResult {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    return { name: description, status: 'warn', message: `文件不存在: ${filePath}` };
  }
  const buffer = fs.readFileSync(fullPath);
  if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    return { name: description, status: 'fail', message: `文件包含 UTF-8 BOM: ${filePath}` };
  }
  return { name: description, status: 'pass', message: `無 BOM: ${filePath}` };
}

function checkNoCRLF(filePath: string, description: string): CheckResult {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    return { name: description, status: 'warn', message: `文件不存在: ${filePath}` };
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes('\r\n')) {
    return { name: description, status: 'fail', message: `文件包含 CRLF: ${filePath}` };
  }
  return { name: description, status: 'pass', message: `無 CRLF: ${filePath}` };
}

// ==========================================
// 主驗證流程
// ==========================================

async function main() {
  console.log('========================================');
  console.log('🛡️  VPS 設置驗證開始');
  console.log('========================================\n');

  const results: CheckResult[] = [];

  // 1. 檢查 VPS 目錄結構
  console.log('📁 檢查 VPS 目錄結構...');
  results.push(checkFileExists('vps/', 'VPS 主目錄'));
  results.push(checkFileExists('vps/configs/', '配置目錄'));
  results.push(checkFileExists('vps/scripts/', '腳本目錄'));
  results.push(checkFileExists('vps/monitoring/', '監控目錄'));
  results.push(checkFileExists('vps/services/', '服務目錄'));

  // 2. 檢查部署腳本
  console.log('\n📦 檢查部署腳本...');
  results.push(checkFileNotEmpty('vps/deploy-omni.sh', 'Omni 部署腳本'));
  results.push(checkFileNotEmpty('vps/deploy-production.ps1', '生產部署腳本'));
  results.push(checkFileNotEmpty('vps/deploy-vps-optimization.sh', 'VPS 優化部署腳本'));

  // 3. 檢查 Nginx 配置
  console.log('\n🌐 檢查 Nginx 配置...');
  results.push(checkFileNotEmpty('vps/nginx-esggo.conf', 'Nginx 主配置'));
  results.push(checkFileNotEmpty('vps/nginx-esggo-docker.conf', 'Nginx Docker 配置'));

  // 4. 檢查 Docker 配置
  console.log('\n🐳 檢查 Docker 配置...');
  results.push(checkFileNotEmpty('vps/docker-compose.yml', 'Docker Compose'));
  results.push(checkFileNotEmpty('vps/Dockerfile.gateway', 'Gateway Dockerfile'));
  results.push(checkFileNotEmpty('vps/package.json', 'VPS Package.json'));

  // 5. 檢查健康監控
  console.log('\n🔍 檢查健康監控...');
  results.push(checkFileNotEmpty('vps/health-monitor.sh', '健康監控腳本'));
  results.push(checkFileNotEmpty('vps/health-monitor.conf', '健康監控配置'));
  results.push(checkFileNotEmpty('vps/log-cleanup.sh', '日誌清理腳本'));

  // 6. 檢查備份系統
  console.log('\n💾 檢查備份系統...');
  results.push(checkFileNotEmpty('vps/backup.sh', '備份腳本'));
  results.push(checkFileNotEmpty('vps/scripts/backup_snapshot.sh', '快照備份腳本'));

  // 7. 檢查安全配置
  console.log('\n🔒 檢查安全配置...');
  results.push(checkFileNotEmpty('vps/configs/ufw-hardening.sh', 'UFW 加固腳本'));
  results.push(checkFileNotEmpty('vps/setup-ssl.sh', 'SSL 設置腳本'));

  // 8. 檢查編碼問題
  console.log('\n📝 檢查編碼問題...');
  results.push(checkNoBOM('vps/setup-permissions.ps1', 'setup-permissions.ps1 BOM'));
  results.push(checkNoCRLF('vps/deploy-omni.sh', 'deploy-omni.sh 行尾'));
  results.push(checkNoCRLF('vps/health-monitor.sh', 'health-monitor.sh 行尾'));
  results.push(checkNoCRLF('vps/setup-nginx.sh', 'setup-nginx.sh 行尾'));

  // 9. 檢查 VPS Agent
  console.log('\n🤖 檢查 VPS Agent...');
  results.push(checkFileNotEmpty('src/agents/vps/index.ts', 'VPS Agent 主文件'));
  results.push(checkFileNotEmpty('src/agents/vps/handlers.ts', 'VPS Agent 處理器'));
  results.push(checkFileNotEmpty('src/agents/vps/quantum-sync.ts', '量子態同步器'));
  results.push(checkFileNotEmpty('src/agents/vps/registry.ts', 'VPS Agent 註冊'));

  // 10. 檢查 OmniSoul 和 OmniSeed
  console.log('\n🔮 檢查 OmniSoul 和 OmniSeed...');
  results.push(checkFileNotEmpty('src/types/omni-soul.ts', 'OmniSoul 類型'));
  results.push(checkFileNotEmpty('src/types/omni-seed.ts', 'OmniSeed 類型'));
  results.push(checkFileNotEmpty('src/agents/omni-soul.ts', 'OmniSoul 實作'));

  // ==========================================
  // 輸出結果
  // ==========================================

  console.log('\n========================================');
  console.log('📊 驗證結果摘要');
  console.log('========================================\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;

  console.log(`✅ 通過: ${passed}`);
  console.log(`❌ 失敗: ${failed}`);
  console.log(`⚠️  警告: ${warned}`);
  console.log(`📁 總計: ${results.length}`);

  // 詳細結果
  if (failed > 0) {
    console.log('\n❌ 失敗項目:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }

  if (warned > 0) {
    console.log('\n⚠️  警告項目:');
    results.filter(r => r.status === 'warn').forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }

  // 最終狀態
  console.log('\n========================================');
  if (failed === 0) {
    console.log('🎉 VPS 設置驗證完成！所有必要文件已就緒。');
  } else {
    console.log('⚠️  VPS 設置驗證完成，但有部分問題需要修復。');
  }
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
