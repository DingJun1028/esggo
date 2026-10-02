#!/usr/bin/env node
/**
 * 萬能圖庫索引產生器
 * 掃描 public/omni-gallery/ 目錄並產生 index.json
 */
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'public', 'omni-gallery');
const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

const index = files.map((filename, i) => {
  const filePath = path.join(galleryDir, filename);
  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  return {
    id: `IMG-${String(i + 1).padStart(3, '0')}`,
    filename,
    url: `/omni-gallery/${filename}`,
    size: stats.size,
    format: ext.replace('.', ''),
    uploadedAt: new Date().toISOString(),
  };
});

const output = {
  name: 'ESGGO 萬能圖庫',
  version: '1.0.0',
  total: index.length,
  images: index,
};

fs.writeFileSync(
  path.join(galleryDir, 'index.json'),
  JSON.stringify(output, null, 2)
);

console.log(`✓ 圖庫索引已產生：${index.length} 張圖片`);
