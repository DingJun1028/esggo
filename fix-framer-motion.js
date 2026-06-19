/**
 * 批次修復 framer-motion SSR 崩潰問題
 * 將所有 components/ 目錄中的 framer-motion 替換為原生 HTML + CSS transition
 * 
 * 策略：
 * 1. 移除所有 framer-motion import
 * 2. 將 motion.X 替換為原生 X 元素，移除 framer-motion 專用屬性
 * 3. 將 AnimatePresence 替換為 div
 * 4. 保留所有 className、事件處理函數、功能邏輯
 */
const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = 'C:\\Project\\esggo\\components';

function getAllTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (item.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// framer-motion 專用屬性，需要移除
const FM_PROPS = new Set([
  'initial', 'animate', 'exit', 'whileHover', 'whileTap', 'whileDrag',
  'transition', 'layout', 'layoutId', 'drag', 'dragMomentum', 'dragElastic',
  'dragControls', 'dragConstraints', 'dragSnapToOrigin',
  'onDragStart', 'onDragEnd', 'onDrag', 'onTap', 'onTapStart', 'onTapCancel',
  'onPointerDown', 'onPointerUp', 'variants', 'initial',
  'viewport', 'onViewportEnter', 'onViewportLeave',
]);

/**
 * 解析並移除 framer-motion 專用屬性從 JSX 開頭標籤中
 * 保留 className、id、style（靜態部分）、事件處理函數等
 */
function removeFmPropsFromTag(tagContent) {
  // tagContent 是 <div className="..." initial={...} animate={...}> 中 <div 之後 > 之前的部分
  // 需要移除 initial={...}, animate={...} 等 framer-motion 屬性
  
  let result = tagContent;
  
  // 移除 framer-motion 屬性（處理多行和大括號嵌套）
  for (const prop of FM_PROPS) {
    // 匹配 propName={...} 或 propName="..." 或 propName
    // 需要處理大括號內嵌套的大括號
    const regex = new RegExp(`\\s+${prop}(?:=\\{(?:[^{}]|\\{[^{}]*\\})*\\}|="[^"]*"|=\'[^\']*\')?`, 'g');
    result = result.replace(regex, '');
  }
  
  return result;
}

/**
 * 處理單個檔案
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 檢查是否已經修復過
  if (content.includes('已移除 framer-motion 以避免 SSR 崩潰')) {
    return { changed: false, reason: 'already fixed' };
  }

  // 1. 移除 framer-motion import 行
  content = content.replace(
    /import\s*\{[^}]*\}\s*from\s*['"]framer-motion['"]\s*;\n/g,
    '// 已移除 framer-motion 以避免 SSR 崩潰，改用 CSS transition\n'
  );
  content = content.replace(/import\s+'framer-motion'\s*;\n/g, '');

  // 2. 處理 AnimatePresence → div
  content = content.replace(/<AnimatePresence\s*>/g, '<div>');
  content = content.replace(/<AnimatePresence\s+mode="[^"]*">/g, '<div>');
  content = content.replace(/<AnimatePresence\s+mode='[^']*'>/g, '<div>');
  content = content.replace(/<\/AnimatePresence>/g, '</div>');

  // 3. 處理 motion.X 標籤
  // 這是複雜的部分：需要找到每個 <motion.X ...> 標籤，移除 FM 屬性，替換為 <X ...>
  
  // 策略：逐字元解析找到 motion 標籤
  content = replaceMotionTags(content);

  // 4. 清理多餘空行
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { changed: true };
  }
  return { changed: false, reason: 'no changes needed' };
}

/**
 * 替換所有 motion.X 標籤為原生 X 標籤，移除 framer-motion 屬性
 */
function replaceMotionTags(content) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // 檢查是否包含 <motion.X
    const motionOpenMatch = line.match(/<motion\.(\w+)/);
    if (motionOpenMatch) {
      const tagName = motionOpenMatch[1];
      
      // 收集完整的開頭標籤（可能跨多行）
      let tagLines = [line];
      let fullTag = line;
      let tagEndFound = line.includes('>');
      
      if (!tagEndFound) {
        i++;
        while (i < lines.length && !tagEndFound) {
          tagLines.push(lines[i]);
          fullTag += '\n' + lines[i];
          if (lines[i].includes('>')) {
            tagEndFound = true;
          }
          i++;
        }
      }
      
      // 現在處理這個完整的開頭標籤
      // 找到標籤名稱後的屬性部分
      const tagStartMatch = fullTag.match(/<motion\.\w+/);
      if (tagStartMatch) {
        const tagStart = tagStartMatch[0];
        const afterTagName = fullTag.substring(tagStartMatch.index + tagStart.length);
        
        // 找到標籤結束位置（> 不在字串內）
        let depth = 0;
        let inString = false;
        let stringChar = '';
        let tagEndIndex = -1;
        
        for (let j = 0; j < afterTagName.length; j++) {
          const ch = afterTagName[j];
          if (inString) {
            if (ch === stringChar && afterTagName[j - 1] !== '\\') {
              inString = false;
            }
          } else {
            if (ch === '"' || ch === "'") {
              inString = true;
              stringChar = ch;
            } else if (ch === '{') {
              depth++;
            } else if (ch === '}') {
              depth--;
            } else if (ch === '>' && depth === 0) {
              tagEndIndex = j;
              break;
            }
          }
        }
        
        if (tagEndIndex >= 0) {
          const propsStr = afterTagName.substring(0, tagEndIndex);
          const afterTag = afterTagName.substring(tagEndIndex + 1); // > 之後的部分
          
          // 移除 framer-motion 屬性
          let cleanedProps = propsStr;
          for (const prop of FM_PROPS) {
            // 匹配 prop={...} 多行
            const regex = new RegExp(`\\s+${prop}(?:=\\{(?:[^{}]|\\{[^{}]*\\})*\\})?`, 'g');
            cleanedProps = cleanedProps.replace(regex, '');
          }
          
          // 檢查是否已有 style 屬性
          const hasStyle = /style=/.test(cleanedProps);
          
          // 構建新標籤
          const newTagStart = `<${tagName}`;
          let newProps = cleanedProps;
          
          if (!hasStyle) {
            // 添加 transition style
            newProps = newProps + ` style={{ transition: 'all 0.4s ease' }}`;
          }
          
          const newFullTag = newTagStart + newProps + '>' + afterTag;
          
          // 將新標籤按原行數拆分
          const newTagLines = newFullTag.split('\n');
          for (const nl of newTagLines) {
            result.push(nl);
          }
          
          // 處理結尾標籤 </motion.X>
          // 檢查下一行是否包含結尾標籤
          if (i < lines.length) {
            const nextLine = lines[i] || '';
            const closingMatch = nextLine.match(new RegExp(`</motion\\.${tagName}>`));
            if (closingMatch) {
              result.push(nextLine.replace(new RegExp(`</motion\\.${tagName}>`), `</${tagName}>`));
              i++;
            }
          }
        } else {
          // 無法解析，保留原樣但替換標籤名
          for (const tl of tagLines) {
            result.push(tl.replace(/<motion\.(\w+)/g, '<$1').replace(/<\/motion\.(\w+)>/g, '</$1>'));
          }
        }
      } else {
        for (const tl of tagLines) {
          result.push(tl);
        }
      }
    } else {
      // 處理可能包含 </motion.X> 的行
      const closingMatch = line.match(/<\/motion\.(\w+)>/);
      if (closingMatch) {
        result.push(line.replace(/<\/motion\.(\w+)>/g, '</$1>'));
      } else {
        result.push(line);
      }
    }
    
    i++;
  }
  
  return result.join('\n');
}

// 主程式
const motionFiles = [];
const allFiles = getAllTsxFiles(COMPONENTS_DIR);
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf-8');
  if (content.includes('framer-motion')) {
    motionFiles.push(f);
  }
}

console.log(`找到 ${motionFiles.length} 個使用 framer-motion 的檔案\n`);

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const filePath of motionFiles) {
  try {
    const result = processFile(filePath);
    const relPath = path.relative(COMPONENTS_DIR, filePath);
    if (result.changed) {
      fixed++;
      console.log(`✅ ${relPath}`);
    } else if (result.reason === 'already fixed') {
      skipped++;
      console.log(`⏭️  ${relPath} (已修復過)`);
    } else {
      skipped++;
      console.log(`⏭️  ${relPath} (無需變更)`);
    }
  } catch (err) {
    errors++;
    console.error(`❌ ${path.relative(COMPONENTS_DIR, filePath)}: ${err.message}`);
  }
}

console.log(`\n完成: 修復 ${fixed} 個，跳過 ${skipped} 個，錯誤 ${errors} 個`);
