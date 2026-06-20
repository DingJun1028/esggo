import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 萬能元件心核全域注入宣告
const OMNI_IMPORT = "import { OmniComponentHeart } from '@esggo/types';\n";
const HEART_PROPERTY = "  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */\n  omniHeart?: OmniComponentHeart;\n";

async function awakenOmniHeart() {
  console.log("🌌 啟動「萬能元件心核全域注入計畫」...");
  
  // 鎖定所有萬能組件檔案
  const files = await glob('components/omni/**/*.{ts,tsx}');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // 1. 檢查並注入 Import 宣告（圓通：若已存在則不重複注入）
    if (!content.includes('@esggo/types') && !content.includes('OmniComponentHeart')) {
      content = OMNI_IMPORT + content;
      modified = true;
    }

    // 2. 定位 Props 介面並注入選填心核屬性 (無作：無痛相容現有程式碼)
    const propsInterfaceRegex = /(interface\s+Props\s*{|type\s+Props\s*=\s*{)/;
    
    if (propsInterfaceRegex.test(content) && !content.includes('omniHeart?:')) {
      content = content.replace(propsInterfaceRegex, `$1\n${HEART_PROPERTY}`);
      modified = true;
    } else if (!propsInterfaceRegex.test(content) && !content.includes('omniHeart?:')) {
      // 若為純函數組件且未定義 Props，自動圓通補全，為其建立專屬的擴充介面
      const sfcRegex = /(export\s+const\s+(\w+)\s*:\s*React\.FC)/;
      if (sfcRegex.test(content)) {
        const injectPropsWrapper = `interface Props {\n${HEART_PROPERTY}}\n\n`;
        content = content.replace(sfcRegex, `${injectPropsWrapper}$1<Props>`);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ [刻印成功] -> ${file}`);
    }
  }
  
  console.log("✨ 萬能心核注入完成。全域組件已臻至無作妙德之境。");
}

awakenOmniHeart().catch(console.error);
