import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const WIKI_DIR = path.join(process.cwd(), 'docs', 'wiki_archive');
const GUIDELINES_PATH = path.join(process.cwd(), 'docs', 'wiki-guidelines.md');
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY not found in environment.');
  process.exit(1);
}

const TEMPLATE = fs.readFileSync(GUIDELINES_PATH, 'utf-8');

async function processFile(filePath: string) {
  const fileName = path.basename(filePath);
  if (!fileName.endsWith('.md')) return;
  
  console.log(`Processing: ${fileName}...`);
  const originalContent = fs.readFileSync(filePath, 'utf-8');
  
  const prompt = `
你是一位專業的 ESG SaaS 產品經理與架構師。
請根據以下「ESG GO 系統功能頁面 Wiki 撰寫規範」的 6 大結構，將我提供給你的原始 Markdown 文件內容，重新改寫並擴充為符合規範的標準格式。
如果原始內容中缺少某些欄位（例如 5T 協定或 RWD 基準），請發揮你對企業級 SaaS 的理解，**自動補齊合理且專業的內容**，確保最終輸出的每一份文件都嚴格包含這 6 個章節，且深度足夠。

【撰寫規範與結構範本】：
${TEMPLATE}

【要改寫的原始文件內容】：
${originalContent}

請直接輸出改寫後的 Markdown 內容，不要包含任何開場白或額外的說明文字。
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
        }
      })
    });
    
    if (!response.ok) {
      console.error(`API Error for ${fileName}:`, response.status, response.statusText);
      const text = await response.text();
      console.error(text);
      return;
    }
    
    const data = await response.json();
    const newContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (newContent) {
      // Clean up markdown code blocks if any
      const finalContent = newContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
      fs.writeFileSync(filePath, finalContent, 'utf-8');
      console.log(`✅ Successfully upgraded: ${fileName}`);
    } else {
      console.error(`❌ Failed to get content for: ${fileName}`);
    }
  } catch (err) {
    console.error(`❌ Network/Processing Error on ${fileName}:`, err);
  }
}

async function main() {
  const files = fs.readdirSync(WIKI_DIR);
  console.log(`Found ${files.length} files in wiki_archive. Starting batch upgrade...`);
  
  for (const file of files) {
    // Only process a few files at a time to avoid rate limits
    await processFile(path.join(WIKI_DIR, file));
    // Wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 All files have been successfully processed!');
}

main();
