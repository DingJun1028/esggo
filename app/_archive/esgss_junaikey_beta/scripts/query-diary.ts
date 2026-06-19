/**
 * Developer Diary Query Tool
 *
 * Features:
 * - View latest diary entries
 * - Query by date range
 * - Search by theme/keyword
 * - Generate development timeline
 *
 * Usage:
 * - npm run diary:view           # View latest diary
 * - npm run diary:view -- --date=today
 * - npm run diary:search -- --keyword="ZKP"
 * - npm run diary:timeline -- --days=7
 *
 * @author ESGss x JunAiKey Beta Team
 * @version 1.0.0
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Type Definitions
// ============================================================================

interface DiaryIndexItem {
  diaryId: string;
  timestamp: string;
  buildId: number;
  buildStatus: string;
  gitCommit: string;
  filePath: string;
}

interface DiaryIndex {
  latestBuildId: number;
  diaryList: DiaryIndexItem[];
}

interface QueryOptions {
  mode: 'latest' | 'date' | 'search' | 'timeline';
  date?: string;
  keyword?: string;
  theme?: string;
  days?: number;
  limit?: number;
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_ROOT = process.cwd();
const UNIVERSAL_NOTES_DIR = join(PROJECT_ROOT, 'docs', 'universal-notes');
const INDEX_PATH = join(UNIVERSAL_NOTES_DIR, 'diary-index.json');

// ============================================================================
// 工具函式
// ============================================================================

/**
 * Read diary index
 */
function readIndex(): DiaryIndex {
  if (!existsSync(INDEX_PATH)) {
    console.error('❌ Diary index file not found');
    console.log('💡 Please run a build once to generate diaries');
    process.exit(1);
  }

  try {
    return JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
  } catch (error) {
    console.error('❌ Index file corrupted:', error);
    process.exit(1);
  }
}

/**
 * Read diary content
 */
function readDiary(filePath: string): string {
  const fullPath = join(PROJECT_ROOT, filePath);

  if (!existsSync(fullPath)) {
    return `❌ Diary file not found: ${filePath}`;
  }

  try {
    return readFileSync(fullPath, 'utf-8');
  } catch (error) {
    return `❌ Failed to read diary: ${error}`;
  }
}

/**
 * Format timestamp to readable string
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Show diary summary
 */
function showDiarySummary(item: DiaryIndexItem): void {
  console.log('─'.repeat(60));
  console.log(`📝 Build #${item.buildId} - ${formatTime(item.timestamp)}`);
  console.log(`   Status: ${item.buildStatus === 'success' ? '✅ Success' : '❌ Failure'}`);
  console.log(`   Commit: ${item.gitCommit.substring(0, 8)}`);
  console.log(`   Path: ${item.filePath}`);
}

/**
 * Show complete diary
 */
function showFullDiary(item: DiaryIndexItem): void {
  console.log('');
  console.log('═'.repeat(60));
  console.log(`  Build #${item.buildId} - ${formatTime(item.timestamp)}`);
  console.log('═'.repeat(60));
  console.log('');

  const content = readDiary(item.filePath);
  console.log(content);
  console.log('');
}

/**
 * View latest diary
 */
function viewLatestDiary(limit: number = 1): void {
  const index = readIndex();

  if (index.diaryList.length === 0) {
    console.log('📝 No diary records yet');
    return;
  }

  console.log('');
  console.log('📚 Latest Developer Diaries');
  console.log('');

  const displayItems = index.diaryList.slice(0, limit);

  if (limit === 1) {
    const latestItem = displayItems[0];
    if (latestItem) {
      showFullDiary(latestItem);
    }
  } else {
    displayItems.forEach(item => showDiarySummary(item));
    console.log('─'.repeat(60));
    console.log('');
    console.log(`💡 Use npm run diary:view -- --limit=1 to view full content`);
  }
}

/**
 * Query by date
 */
function queryByDate(dateString: string): void {
  const index = readIndex();
  let targetDate: Date;

  if (dateString === 'today') {
    targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
  } else {
    targetDate = new Date(dateString);
  }

  const results = index.diaryList.filter(item => {
    const diaryDate = new Date(item.timestamp);
    diaryDate.setHours(0, 0, 0, 0);
    return diaryDate.getTime() === targetDate.getTime();
  });

  console.log('');
  console.log(`📅 Developer Diaries for ${dateString} (Total: ${results.length})`);
  console.log('');

  if (results.length === 0) {
    console.log('📝 No diary records for this date');
    return;
  }

  results.forEach(item => showDiarySummary(item));
  console.log('─'.repeat(60));
}

/**
 * Search diaries
 */
function searchDiaries(keyword?: string, theme?: string): void {
  const index = readIndex();

  console.log('');
  console.log(
    `🔍 Searching diaries${keyword ? ` - Keyword: "${keyword}"` : ''}${theme ? ` - Theme: "${theme}"` : ''
    }`
  );
  console.log('');

  const results = index.diaryList.filter(item => {
    const content = readDiary(item.filePath);

    if (keyword && !content.includes(keyword)) {
      return false;
    }

    if (theme && !content.includes(theme)) {
      return false;
    }

    return true;
  });

  console.log(`Found ${results.length} relevant diaries`);
  console.log('');

  if (results.length === 0) {
    console.log('📝 No matching diaries found');
    return;
  }

  results.forEach(item => showDiarySummary(item));
  console.log('─'.repeat(60));
}

/**
 * Show development timeline
 */
function showTimeline(days: number = 7): void {
  const index = readIndex();
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const results = index.diaryList.filter(item => {
    const diaryDate = new Date(item.timestamp);
    return diaryDate >= startDate;
  });

  console.log('');
  console.log(`📊 Development timeline for the last ${days} days (Total: ${results.length} builds)`);
  console.log('');

  if (results.length === 0) {
    console.log('📝 No diary records for this time range');
    return;
  }

  // Group by date
  const groupedByDate = new Map<string, DiaryIndexItem[]>();

  results.forEach(item => {
    const date = new Date(item.timestamp);
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (!groupedByDate.has(dateString)) {
      groupedByDate.set(dateString, []);
    }

    groupedByDate.get(dateString)!.push(item);
  });

  // Show timeline
  const sortedDates = Array.from(groupedByDate.keys()).sort().reverse();

  sortedDates.forEach(date => {
    const dayDiaries = groupedByDate.get(date)!;
    console.log(`📅 ${date} (${dayDiaries.length} builds)`);

    dayDiaries.forEach(item => {
      const time = new Date(item.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      console.log(
        `   ${time} - Build #${item.buildId} ${item.buildStatus === 'success' ? '✅' : '❌'}`
      );
    });

    console.log('');
  });

  // Statistics
  const successCount = results.filter(item => item.buildStatus === 'success').length;
  const successRate = ((successCount / results.length) * 100).toFixed(1);

  console.log('─'.repeat(60));
  console.log(`📈 Statistics: Total builds ${results.length}, Success ${successCount} (${successRate}%)`);
  console.log('');
}

// ============================================================================
// Main Flow
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);

  // Parse arguments
  const options: QueryOptions = {
    mode: 'latest',
    limit: 1,
  };

  args.forEach(arg => {
    if (arg.startsWith('--date=')) {
      options.mode = 'date';
      options.date = arg.split('=')[1];
    } else if (arg.startsWith('--keyword=')) {
      options.mode = 'search';
      options.keyword = arg.split('=')[1];
    } else if (arg.startsWith('--theme=')) {
      options.mode = 'search';
      options.theme = arg.split('=')[1];
    } else if (arg.startsWith('--days=')) {
      options.mode = 'timeline';
      options.days = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1]);
    } else if (arg === '--latest') {
      options.mode = 'latest';
    } else if (arg === '--timeline') {
      options.mode = 'timeline';
    } else if (arg === '--search') {
      options.mode = 'search';
    }
  });

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Universal Notes System - Developer Diary Query Tool');
  console.log('  ESGss x JunAiKey Beta - Toward Sustainability & Universal Key');
  console.log('═══════════════════════════════════════════════════════');

  try {
    switch (options.mode) {
      case 'latest':
        viewLatestDiary(options.limit);
        break;

      case 'date':
        if (options.date) {
          queryByDate(options.date);
        } else {
          console.error('❌ Please specify date: --date=YYYY-MM-DD or --date=today');
        }
        break;

      case 'search':
        if (options.keyword || options.theme) {
          searchDiaries(options.keyword!, options.theme!);
        } else {
          console.error('❌ Please specify search criteria: --keyword="keyword" or --theme="theme"');
        }
        break;

      case 'timeline':
        showTimeline(options.days || 7);
        break;
    }
  } catch (error) {
    console.error('❌ Query failed:', error);
    process.exit(1);
  }

  console.log('');
}

// Execute main program
main();
