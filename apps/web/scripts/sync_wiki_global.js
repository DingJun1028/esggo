const fs = require('fs');
const path = require('path');

const wikiDir = 'c:\\Project\\esggo_wiki_temp';
const docsDir = 'c:\\Project\\esggo\\esggo\\docs';

const globalFiles = [
  '5T-誠信協議.md',
  '功能總覽.md',
  '品牌原子元件庫.md',
  '平台總覽.md',
  '從無到有的建置成果.md',
  '技術完整性檢查結論.md',
  '技術架構與資料設計.md',
  '系統核心架構.md',
  '資料表與邏輯資料庫.md'
];

if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

globalFiles.forEach(file => {
  const sourcePath = path.join(wikiDir, file);
  const targetPath = path.join(docsDir, file);
  if (fs.existsSync(sourcePath)) {
    const content = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, content);
    console.log(`Synced global docs: ${file}`);
  }
});
