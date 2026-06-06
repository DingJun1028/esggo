import * as fs from 'fs';
import * as path from 'path';

// FNNS Unified v4 & Legacy v3 Regex
const fnnsRegex = /([A-Z]{3}-\d{3})_([a-zA-Z0-9_]+)__([a-zA-Z0-9]+)__([a-zA-Z0-9]+)--([a-zA-Z0-9]+)/g;

interface FoundNode {
  nodeName: string;
  meceId: string;
  entity: string;
  action: string;
  protocol: string;
  isRegistered: boolean;
}

const WIKI_PATH = path.join(process.cwd(), 'wiki/OMNINODE_REGISTRY.md');
const SEARCH_DIRS = [
  path.join(process.cwd(), 'app'),
  path.join(process.cwd(), 'components')
];

function scanDirectory(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function parseMarkdownTable(markdown: string): { nodes: Set<string>, content: string, tableStart: number, tableEnd: number } {
  const lines = markdown.split('\n');
  const nodes = new Set<string>();
  let tableStart = -1;
  let tableEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('| MECE 序號 |')) {
      tableStart = i;
    } else if (tableStart !== -1 && line.startsWith('|')) {
      // It's a table row
      const match = line.match(/\| `([^`]+)` \| `([^`]+)` \|/);
      if (match) {
        nodes.add(match[2]);
      }
      tableEnd = i;
    } else if (tableStart !== -1 && line.trim() === '') {
      // End of table
      break;
    }
  }

  return { nodes, content: markdown, tableStart, tableEnd };
}

function runScanner() {
  console.log('🔍 Scanning code for FNNS nodeNames...');
  const allFiles = SEARCH_DIRS.flatMap(dir => scanDirectory(dir));
  const foundNodes = new Map<string, FoundNode>();

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = fnnsRegex.exec(content)) !== null) {
      const nodeName = match[0];
      if (!foundNodes.has(nodeName)) {
        foundNodes.set(nodeName, {
          nodeName,
          meceId: match[1],
          entity: match[3],
          action: match[4],
          protocol: match[5],
          isRegistered: false
        });
      }
    }
  });

  if (!fs.existsSync(WIKI_PATH)) {
    console.error(`Wiki file not found at ${WIKI_PATH}`);
    return;
  }

  const wikiContent = fs.readFileSync(WIKI_PATH, 'utf-8');
  const { nodes: registeredNodes, tableStart, tableEnd } = parseMarkdownTable(wikiContent);

  let newNodesAdded = 0;
  const newLines: string[] = [];

  foundNodes.forEach((node, nodeName) => {
    if (!registeredNodes.has(nodeName)) {
      // Map protocol to proper description
      let protocolDesc = node.protocol;
      if (node.protocol === 'Trustworthy') protocolDesc = '🔴 信 (Hash Lock)';
      if (node.protocol === 'Traceable') protocolDesc = '🟢 真 (溯源追蹤)';
      if (node.protocol === 'Tangible') protocolDesc = '🟢 美 (視覺呈現)';
      if (node.protocol === 'Transparent') protocolDesc = '🟢 善 (算法透明)';
      if (node.protocol === 'Trackable') protocolDesc = '🟢 通 (全生命週期追蹤)';

      const newRow = `| \`${node.meceId}\` | \`${nodeName}\` | \`${node.entity}\` | ${node.action} | ${protocolDesc} | 🟡 新發現 |`;
      newLines.push(newRow);
      newNodesAdded++;
      console.log(`✨ Found new unregistered node: ${nodeName}`);
    }
  });

  if (newNodesAdded > 0 && tableStart !== -1) {
    const lines = wikiContent.split('\n');
    lines.splice(tableEnd + 1, 0, ...newLines);
    
    // Update timestamp
    const updatedContent = lines.map(line => {
      if (line.includes('最後同步時間:')) {
        return `> *📝 最後同步時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}*`;
      }
      return line;
    }).join('\n');

    fs.writeFileSync(WIKI_PATH, updatedContent, 'utf-8');
    console.log(`✅ Successfully added ${newNodesAdded} new node(s) to OMNINODE_REGISTRY.md!`);
  } else {
    console.log('✅ No new nodes found. Wiki is up to date.');
  }
}

runScanner();
