import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const OMNI_IMPORT = "import { OmniComponentHeart } from '@esggo/types';\n";
const HEART_PROPERTY = "  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */\n  omniHeart?: OmniComponentHeart;\n";

async function injectOmniHeart() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`🌌 啟動「萬能元件心核全域注入計畫」${isDryRun ? ' (DRY-RUN)' : ''}...`);

  const files = await glob('components/**/Omni*.{ts,tsx}');
  let modifiedCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;
    let modified = false;

    // 1. Safe Import Injection (below 'use client')
    if (!content.includes('@esggo/types') && !content.includes('OmniComponentHeart')) {
      if (content.startsWith("'use client';") || content.startsWith('"use client";')) {
        content = content.replace(/['"]use client['"];?\s*/, match => `${match}\n${OMNI_IMPORT}`);
      } else {
        content = OMNI_IMPORT + content;
      }
      modified = true;
    }

    // 2. Inject property into existing Props interfaces
    const propsInterfaceRegex = /(interface\s+\w*Props(\s+extends\s+.*?)?\s*{|type\s+\w*Props\s*=\s*{)/;
    if (propsInterfaceRegex.test(content) && !content.includes('omniHeart?:')) {
      content = content.replace(propsInterfaceRegex, `$1\n${HEART_PROPERTY}`);
      modified = true;
    } else if (!propsInterfaceRegex.test(content) && !content.includes('omniHeart?:')) {
      // Create new interface and inject to React.FC if it exists
      const sfcRegex = /(export\s+(?:const|function)\s+(\w+)\s*(?::\s*React\.FC(?:<([^>]+)>)?)?\s*=?\s*\(([^)]*)\)\s*(?::\s*JSX\.Element)?\s*=>?\s*{)/;
      
      if (sfcRegex.test(content)) {
        // We will just create a generic interface for this file and avoid breaking React.FC signature
        const componentNameMatch = content.match(/export\s+(?:const|function)\s+(\w+)/);
        if (componentNameMatch) {
          const componentName = componentNameMatch[1];
          const newInterface = `export interface ${componentName}Props {\n${HEART_PROPERTY}}\n\n`;
          
          // Inject the interface right before the component definition
          content = content.replace(sfcRegex, (match) => {
            return newInterface + match;
          });

          // Change React.FC to React.FC<ComponentProps> safely
          content = content.replace(/:\s*React\.FC(?!\s*<)/, `: React.FC<${componentName}Props>`);
          
          modified = true;
        }
      }
    }

    if (modified && content !== originalContent) {
      if (!isDryRun) {
        fs.writeFileSync(file, content, 'utf-8');
      }
      console.log(`✅ [刻印成功] -> ${file}`);
      modifiedCount++;
    }
  }

  console.log(`✨ 萬能心核注入完成。處理了 ${modifiedCount} 個組件。全域組件已臻至無作妙德之境。`);
}

injectOmniHeart().catch(console.error);
