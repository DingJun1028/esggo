#!/usr/bin/env tsx
/**
 * developer日記自動生成器
 *
 * 功能：
 * - 分析 Git 變更（自上次建置以來）
 * - 提取變更主題和摘要
 * - 生成結構化developer日記
 * - 整合 4T Protocol（可追溯、可追蹤、可計算、不可變）
 *
 * 使用方式：
 * - Pre-build: tsx scripts/generate-dev-diary.ts --phase=pre
 * - Post-build: tsx scripts/generate-dev-diary.ts --phase=post
 *
 * @author ESGss x JunAiKey Beta Team
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';

// ============================================================================
// 型別定義
// ============================================================================

/** BuildPhase */
type BuildPhase = 'pre' | 'post';

/** BuildStatus */
type BuildStatus = 'success' | 'failed' | 'in-progress';

/** 變更TopicType */
type TopicType = '新功能' | '錯誤修復' | '重構' | '文檔' | 'UI/UX' | '效能優化' | '安全性' | '測試';

/** Git 提交資訊 */
interface GitCommitInfo {
  sha: string;
  message: string;
  author: string;
  time: string;
}

/** Git 變更分析result */
interface GitChangeAnalysis {
  changedFiles: string[];
  linesAdded: number;
  linesDeleted: number;
  commitList: GitCommitInfo[];
  affectedModules: string[];
  topicList: TopicCategory[];
}

/** TopicCategory */
interface TopicCategory {
  type: TopicType;
  fileList: string[];
  description: string;
}

/** DiaryMetadata */
interface DiaryMetadata {
  diaryId: string;
  timestamp: string;
  buildNumber: number;
  BuildStatus: BuildStatus;
  version: string;
  GitCommitInfo: string;
  gitBranch: string;
  developer: string;
  hashLock: string;
}

/** DiaryContent */
interface DiaryContent {
  metadata: DiaryMetadata;
  executiveSummary: {
    buildObjective: string;
    keyFeatures: string[];
    resolvedIssues: string[];
  };
  TopicCategory: TopicCategory[];
  changeDetails: GitChangeAnalysis;
  nextActions: {
    todoItems: string[];
    knownIssues: string[];
    plannedImprovements: string[];
  };
  buildInfo: {
    startTime: string;
    endTime: string;
    duration: string;
    environment: string;
  };
}

// ============================================================================
// 常數定義
// ============================================================================

const PROJECT_ROOT = process.cwd();
const UNIVERSAL_NOTES_DIR = join(PROJECT_ROOT, 'docs', 'universal-notes');
const TEMPLATE_PATH = join(UNIVERSAL_NOTES_DIR, 'templates', 'diary-template.md');
const INDEX_PATH = join(UNIVERSAL_NOTES_DIR, 'diary-index.json');
const TEMP_FILE_PATH = join(UNIVERSAL_NOTES_DIR, '.build-temp.json');

// TOPIC_KEYWORD_MAP
const TOPIC_KEYWORD_MAP: Record<TopicType, string[]> = {
  新功能: ['feat', 'feature', 'add', 'implement', '新增', '實作', '功能'],
  錯誤修復: ['fix', 'bug', 'hotfix', 'patch', '修復', '修正', '錯誤'],
  重構: ['refactor', 'restructure', 'reorganize', '重構', '重組'],
  文檔: ['docs', 'documentation', 'readme', 'comment', '文檔', '註解', '說明'],
  'UI/UX': ['ui', 'ux', 'style', 'design', 'layout', 'component', '介面', '樣式', '設計'],
  效能優化: ['perf', 'performance', 'optimize', 'speed', '效能', '優化', '加速'],
  安全性: ['security', 'auth', 'permission', 'vulnerability', '安全', '權限', '驗證'],
  測試: ['test', 'spec', 'coverage', 'e2e', '測試', '驗證'],
};

// MODULE_PATH_MAP
const MODULE_PATH_MAP: Record<string, string> = {
  'src/components': 'UI 組件層',
  'src/core': '核心系統',
  'src/services': '服務層',
  'src/omni': 'Omni 奧秘系統',
  'src/store': '狀態管理',
  'src/types': '型別定義',
  'src/utils': '工具函式',
  docs: '文檔系統',
  scripts: '腳本工具',
  server: '後端服務',
};

// ============================================================================
// 工具函式
// ============================================================================

/**
 * 生成 UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * generateHashLock
 */
function generateHashLock(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * 執行 Git command
 */
function executeGitCommand(command: string): string {
  try {
    return execSync(`git ${command}`, { encoding: 'utf-8', cwd: PROJECT_ROOT }).trim();
  } catch (error) {
    console.warn(`⚠️  Git command執行失敗: ${command}`);
    return '';
  }
}

/**
 * 取得當前timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * formatTime為可讀格式
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 取得日記檔案路徑
 */
function getDiaryPath(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const filename =
    timestamp.replace(/:/g, '-').replace(/\..+/, '').replace('T', '_') + '_build-diary.md';

  const directory = join(UNIVERSAL_NOTES_DIR, String(year), month);

  // 確保directory存在
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  return join(directory, filename);
}

/**
 * 讀取 package.json 取得版本資訊
 */
function getSystemVersion(): string {
  try {
    const packageJson = JSON.parse(readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf-8'));
    return packageJson.version || '未知版本';
  } catch {
    return '未知版本';
  }
}

/**
 * getBuildNumber
 */
function getBuildNumber(): number {
  try {
    if (existsSync(INDEX_PATH)) {
      const 索引 = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
      return (索引.最新buildNumber || 0) + 1;
    }
  } catch {
    // 忽略錯誤
  }
  return 1;
}

// ============================================================================
// Git 分析功能
// ============================================================================

/**
 * 分析 Git 變更
 */
function analyzeGitChanges(自從提交?: string): GitChangeAnalysis {
  const range = 自從提交 ? `${自從提交}..HEAD` : 'HEAD';

  // 取得changedFiles
  const rawChangedFiles = executeGitCommand(`diff --name-only ${range}`);
  const changedFiles = rawChangedFiles ? rawChangedFiles.split('\n').filter(Boolean) : [];

  // 取得程式碼統計
  const rawStats = executeGitCommand(`diff --shortstat ${range}`);
  let linesAdded = 0;
  let linesDeleted = 0;

  if (rawStats) {
    const addedMatch = rawStats.match(/(\d+) insertion/);
    const deletedMatch = rawStats.match(/(\d+) deletion/);
    linesAdded = (addedMatch && addedMatch[1]) ? parseInt(addedMatch[1], 10) : 0;
    linesDeleted = (deletedMatch && deletedMatch[1]) ? parseInt(deletedMatch[1], 10) : 0;
  }

  // 取得commitList
  const rawCommits = executeGitCommand(`log ${range} --pretty=format:"%H|%s|%an|%ai"`);
  const commitList: GitCommitInfo[] = rawCommits
    ? rawCommits.split('\n').map(line => {
      const parts = line.split('|');
      return {
        sha: parts[0] || '',
        message: parts[1] || '',
        author: parts[2] || '',
        time: parts[3] || '',
      };
    })
    : [];

  // analyzeAffectedModules
  const affectedModules = analyzeAffectedModules(changedFiles);

  // extractTopics
  const topicList = extractTopics(changedFiles, commitList);

  return {
    changedFiles,
    linesAdded,
    linesDeleted,
    commitList,
    affectedModules,
    topicList,
  };
}

/**
 * 分析影響的模組
 */
function analyzeAffectedModules(fileList: string[]): string[] {
  const moduleSet = new Set<string>();

  for (const 檔案 of fileList) {
    for (const [路徑前綴, 模組名稱] of Object.entries(MODULE_PATH_MAP)) {
      if (檔案.startsWith(路徑前綴)) {
        moduleSet.add(模組名稱);
        break;
      }
    }
  }

  return Array.from(moduleSet);
}

/**
 * 提取變更主題
 */
function extractTopics(fileList: string[], commitList: GitCommitInfo[]): TopicCategory[] {
  const topicMap = new Map<TopicType, string[]>();

  // 初始化所有TopicType
  for (const type of Object.keys(TOPIC_KEYWORD_MAP) as TopicType[]) {
    topicMap.set(type, []);
  }

  // 根據檔案路徑和提交message分類
  for (const 檔案 of fileList) {
    let isCategorized = false;

    // 檢查提交message
    for (const 提交 of commitList) {
      const messageLower = 提交.message.toLowerCase();

      for (const [type, keywordsList] of Object.entries(TOPIC_KEYWORD_MAP)) {
        if (keywordsList.some(關鍵字 => messageLower.includes(關鍵字.toLowerCase()))) {
          topicMap.get(type as TopicType)?.push(檔案);
          isCategorized = true;
          break;
        }
      }

      if (isCategorized) break;
    }

    // 根據檔案路徑推斷
    if (!isCategorized) {
      if (檔案.includes('component') || 檔案.includes('ui') || 檔案.endsWith('.tsx')) {
        topicMap.get('UI/UX')?.push(檔案);
      } else if (檔案.includes('test') || 檔案.includes('spec')) {
        topicMap.get('測試')?.push(檔案);
      } else if (檔案.includes('docs') || 檔案.endsWith('.md')) {
        topicMap.get('文檔')?.push(檔案);
      } else if (檔案.includes('core')) {
        topicMap.get('新功能')?.push(檔案);
      }
    }
  }

  // 轉換為TopicCategory陣列
  const result: TopicCategory[] = [];

  for (const [type, fileList] of topicMap.entries()) {
    if (fileList.length > 0) {
      result.push({
        type,
        fileList: [...new Set(fileList)], // 去重
        description: generateTopicDescription(type, fileList),
      });
    }
  }

  return result;
}

/**
 * generateTopicDescription
 */
function generateTopicDescription(type: TopicType, fileList: string[]): string {
  const fileCount = fileList.length;
  const exampleFiles = fileList
    .slice(0, 3)
    .map(f => `\`${f}\``)
    .join(', ');

  return `本次建置包含 ${fileCount} 個${type}相關變更，主要涉及：${exampleFiles}${fileCount > 3 ? ' 等' : ''}`;
}

// ============================================================================
// 日記生成功能
// ============================================================================

/**
 * generateDiaryContent
 */
function generateDiaryContent(
  變更分析: GitChangeAnalysis,
  metadata: DiaryMetadata,
  buildInfo: DiaryContent['buildInfo']
): string {
  // 讀取模板
  let 模板content = '';
  try {
    模板content = readFileSync(TEMPLATE_PATH, 'utf-8');
  } catch {
    console.warn('⚠️  無法讀取日記模板，使用預設格式');
    模板content = generateDefaultTemplate();
  }

  // 替換metadata
  模板content = 模板content
    .replace(/{{DIARY_UUID}}/g, metadata.diaryId)
    .replace(/{{TIMESTAMP}}/g, metadata.timestamp)
    .replace(/{{BUILD_NUMBER}}/g, String(metadata.buildNumber))
    .replace(/{{BUILD_STATUS}}/g, metadata.BuildStatus)
    .replace(/{{VERSION}}/g, metadata.version)
    .replace(/{{GIT_COMMIT}}/g, metadata.GitCommitInfo)
    .replace(/{{GIT_BRANCH}}/g, metadata.gitBranch)
    .replace(/{{DEVELOPER}}/g, metadata.developer)
    .replace(/{{HASH_LOCK}}/g, metadata.hashLock)
    .replace(/{{DATE_READABLE}}/g, formatTime(metadata.timestamp));

  // 替換executiveSummary
  const buildObjective = generateBuildObjective(變更分析);
  const keyFeatures = generateKeyFeaturesList(變更分析);
  const resolvedIssues = generateResolvedIssuesList(變更分析);

  模板content = 模板content
    .replace(/{{BUILD_OBJECTIVE}}/g, buildObjective)
    .replace(/{{KEY_FEATURES}}/g, keyFeatures)
    .replace(/{{RESOLVED_ISSUES}}/g, resolvedIssues);

  // 替換TopicCategory
  for (const type of Object.keys(TOPIC_KEYWORD_MAP) as TopicType[]) {
    const 主題 = 變更分析.topicList.find(t => t.type === type);
    const content = 主題
      ? `${主題.description}\n\n${主題.fileList.map(f => `- \`${f}\``).join('\n')}`
      : '_本次建置無此類變更_';

    const placeholderMap: Record<TopicType, string> = {
      新功能: 'FEATURES_LIST',
      錯誤修復: 'BUG_FIXES_LIST',
      重構: 'REFACTORING_LIST',
      文檔: 'DOCUMENTATION_LIST',
      'UI/UX': 'UI_UX_LIST',
      效能優化: 'PERFORMANCE_LIST',
      安全性: 'SECURITY_LIST',
      測試: 'TESTING_LIST',
    };

    模板content = 模板content.replace(new RegExp(`{{${placeholderMap[type]}}}`, 'g'), content);
  }

  // 替換changeDetails
  const fileListing =
    變更分析.changedFiles.length > 0
      ? 變更分析.changedFiles.map(f => `- \`${f}\``).join('\n')
      : '_無檔案變更_';

  const affectedModules =
    變更分析.affectedModules.length > 0 ? 變更分析.affectedModules.map(m => `- ${m}`).join('\n') : '_無模組變更_';

  模板content = 模板content
    .replace(/{{FILES_CHANGED}}/g, fileListing)
    .replace(/{{LINES_ADDED}}/g, String(變更分析.linesAdded))
    .replace(/{{LINES_REMOVED}}/g, String(變更分析.linesDeleted))
    .replace(/{{NET_CHANGE}}/g, String(變更分析.linesAdded - 變更分析.linesDeleted))
    .replace(/{{FILES_COUNT}}/g, String(變更分析.changedFiles.length))
    .replace(/{{AFFECTED_MODULES}}/g, affectedModules)
    .replace(/{{MODULES_COUNT}}/g, String(變更分析.affectedModules.length));

  // 替換nextActions（從提交message中提取 TODO）
  const todoItems = extractTodoItems(變更分析);
  模板content = 模板content
    .replace(/{{TODO_ITEMS}}/g, todoItems || '_無todoItems_')
    .replace(/{{KNOWN_ISSUES}}/g, '_無knownIssues_')
    .replace(/{{PLANNED_IMPROVEMENTS}}/g, '_無plannedImprovements_');

  // 替換buildInfo
  模板content = 模板content
    .replace(/{{BUILD_START_TIME}}/g, buildInfo.startTime)
    .replace(/{{BUILD_END_TIME}}/g, buildInfo.endTime)
    .replace(/{{BUILD_DURATION}}/g, buildInfo.duration)
    .replace(/{{BUILD_ENV}}/g, buildInfo.environment);

  return 模板content;
}

/**
 * generateDefaultTemplate（當模板檔案不存在時）
 */
function generateDefaultTemplate(): string {
  return `# developer日記 - {{DATE_READABLE}}

## metadata
- diaryId: {{DIARY_UUID}}
- buildNumber: #{{BUILD_NUMBER}}
- BuildStatus: {{BUILD_STATUS}}
- Git 提交: {{GIT_COMMIT}}

## 變更摘要
{{BUILD_OBJECTIVE}}

## changedFiles
{{FILES_CHANGED}}

## 程式碼統計
- 新增: {{LINES_ADDED}} 行
- 刪除: {{LINES_REMOVED}} 行
`;
}

/**
 * generateBuildObjectivedescription
 */
function generateBuildObjective(變更分析: GitChangeAnalysis): string {
  if (變更分析.commitList.length === 0) {
    return '本次建置為常規維護建置';
  }

  const latestCommit = 變更分析.commitList[0];
  return latestCommit ? (latestCommit.message || '持續開發和改進系統功能') : '持續開發和改進系統功能';
}

/**
 * generateKeyFeaturesList
 */
function generateKeyFeaturesList(變更分析: GitChangeAnalysis): string {
  const newFeaturesTopic = 變更分析.topicList.find(t => t.type === '新功能');

  if (!newFeaturesTopic || newFeaturesTopic.fileList.length === 0) {
    return '_本次建置無新增功能_';
  }

  return newFeaturesTopic.fileList
    .slice(0, 5)
    .map(f => `- ${extractFileFunctionDescription(f)}`)
    .join('\n');
}

/**
 * generateResolvedIssuesList
 */
function generateResolvedIssuesList(變更分析: GitChangeAnalysis): string {
  const fixesTopic = 變更分析.topicList.find(t => t.type === '錯誤修復');

  if (!fixesTopic || fixesTopic.fileList.length === 0) {
    return '_本次建置無錯誤修復_';
  }

  return fixesTopic.fileList
    .slice(0, 5)
    .map(f => `- 修復 \`${f}\` 相關問題`)
    .join('\n');
}

/**
 * extractFileFunctionDescription
 */
function extractFileFunctionDescription(檔案路徑: string): string {
  const filename = 檔案路徑.split('/').pop() || 檔案路徑;
  const 模組 = analyzeAffectedModules([檔案路徑])[0] || '系統';

  return `${模組} - ${filename}`;
}

/**
 * extractTodoItems
 */
function extractTodoItems(變更分析: GitChangeAnalysis): string {
  const todos: string[] = [];

  // 從提交message中尋找 TODO
  for (const 提交 of 變更分析.commitList) {
    if (提交.message.toLowerCase().includes('todo')) {
      todos.push(`- ${提交.message}`);
    }
  }

  return todos.length > 0 ? todos.join('\n') : '';
}

/**
 * updateDiaryIndex
 */
function updateDiaryIndex(metadata: DiaryMetadata, 日記路徑: string): void {
  let indexData: any = {
    最新buildNumber: 0,
    日記列表: [],
  };

  // 讀取現有索引
  if (existsSync(INDEX_PATH)) {
    try {
      indexData = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
    } catch {
      console.warn('⚠️  索引檔案損壞，將重新建立');
    }
  }

  // 更新索引
  indexData.最新buildNumber = metadata.buildNumber;
  indexData.日記列表.unshift({
    diaryId: metadata.diaryId,
    timestamp: metadata.timestamp,
    buildNumber: metadata.buildNumber,
    BuildStatus: metadata.BuildStatus,
    GitCommitInfo: metadata.GitCommitInfo,
    檔案路徑: 日記路徑.replace(PROJECT_ROOT, '').replace(/\\/g, '/'),
  });

  // 只保留最近 100 筆
  if (indexData.日記列表.length > 100) {
    indexData.日記列表 = indexData.日記列表.slice(0, 100);
  }

  // 寫入索引
  writeFileSync(INDEX_PATH, JSON.stringify(indexData, null, 2), 'utf-8');
}

// ============================================================================
// 主要流程
// ============================================================================

/**
 * Pre-build phase：記錄建置開始
 */
function runPreBuild(): void {
  console.log('📝 Recording buildInfo...');

  const tempData = {
    startTime: getTimestamp(),
    lastCommit: executeGitCommand('rev-parse HEAD'),
  };

  writeFileSync(TEMP_FILE_PATH, JSON.stringify(tempData, null, 2), 'utf-8');
  console.log('✅ Build startTime recorded');
}

/**
 * Post-build phase：生成完整日記
 */
function runPostBuild(): void {
  console.log('📝 Generating Dev Diary...');

  // 讀取tempData
  let tempData: any = {};
  if (existsSync(TEMP_FILE_PATH)) {
    try {
      tempData = JSON.parse(readFileSync(TEMP_FILE_PATH, 'utf-8'));
    } catch {
      console.warn('⚠️  無法讀取tempData');
    }
  }

  const startTime = tempData.startTime || getTimestamp();
  const endTime = getTimestamp();
  const duration = calculateDuration(startTime, endTime);

  // 分析 Git 變更
  const 變更分析 = analyzeGitChanges(tempData.lastCommit);

  // 準備metadata
  const diaryId = generateUUID();
  const timestamp = endTime;
  const GitCommitInfo = executeGitCommand('rev-parse HEAD');
  const gitBranch = executeGitCommand('rev-parse --abbrev-ref HEAD');

  const metadata: DiaryMetadata = {
    diaryId,
    timestamp,
    buildNumber: getBuildNumber(),
    BuildStatus: 'success', // 如果執行到這裡，表示建置成功
    version: getSystemVersion(),
    GitCommitInfo,
    gitBranch,
    developer: 'system',
    hashLock: '', // 稍後計算
  };

  const buildInfo = {
    startTime: formatTime(startTime),
    endTime: formatTime(endTime),
    duration,
    environment: process.env.NODE_ENV || 'development',
  };

  // generateDiaryContent
  let DiaryContent = generateDiaryContent(變更分析, metadata, buildInfo);

  // 計算hashLock
  metadata.hashLock = generateHashLock(DiaryContent);
  DiaryContent = DiaryContent.replace(/{{HASH_LOCK}}/g, metadata.hashLock);

  // 儲存日記
  const 日記路徑 = getDiaryPath(timestamp);
  writeFileSync(日記路徑, DiaryContent, 'utf-8');

  // 更新索引
  updateDiaryIndex(metadata, 日記路徑);

  // 清理暫存檔（使用跨平台的 Node.js API 避免 Windows 編碼亂碼）
  if (existsSync(TEMP_FILE_PATH)) {
    try {
      unlinkSync(TEMP_FILE_PATH);
    } catch {
      // 忽略清理錯誤
    }
  }

  console.log('✅ Dev Diary generated successfully');
  console.log(`📄 Diary path: ${日記路徑.replace(PROJECT_ROOT, '.')}`);
  console.log(`🔢 buildNumber: #${metadata.buildNumber}`);
  console.log(`📊 Change stats: +${變更分析.linesAdded} / -${變更分析.linesDeleted} lines`);
  console.log(`📁 Files changed: ${變更分析.changedFiles.length} files`);
}

/**
 * calculateDuration
 */
function calculateDuration(開始: string, 結束: string): string {
  const startTime = new Date(開始).getTime();
  const endTime = new Date(結束).getTime();
  const diffSeconds = Math.floor((endTime - startTime) / 1000);

  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  if (minutes > 0) {
    return `${minutes} 分 ${seconds} 秒`;
  }
  return `${seconds} 秒`;
}

// ============================================================================
// 程式進入點
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const phaseArg = args.find(arg => arg.startsWith('--phase='));
  const phase: BuildPhase = (phaseArg?.split('=')[1] as BuildPhase) || 'post';

  console.log('-------------------------------------------------------');
  console.log('  Omni Notes System - Dev Diary Generator');
  console.log('  ESGss x JunAiKey Beta - Omni Key');
  console.log('-------------------------------------------------------');

  try {
    if (phase === 'pre') {
      runPreBuild();
    } else {
      runPostBuild();
    }
  } catch (error) {
    console.error('❌ 日記生成失敗:', error);
    process.exit(1);
  }

  console.log('');
}

// 執行主程式
main();
