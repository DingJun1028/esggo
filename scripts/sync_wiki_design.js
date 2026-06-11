const fs = require('fs');
const path = require('path');

const wikiDir = 'c:\\Project\\esggo_wiki_temp';
const appDir = 'c:\\Project\\esggo\\esggo\\app';

const routeMap = {
  'SustainWrite-永續撰寫.md': 'editor',
  'Digital-Twin-數位分身.md': 'digital-twin',
  'Health-Check-企業健檢.md': 'health-check',
  'Advisory-專家諮詢.md': 'advisory',
  'Intelligence-商情中心.md': 'intelligence',
  'Environmental-環境指揮.md': 'environmental',
  'Social-社會影響.md': 'social',
  'Governance-公司治理.md': 'governance',
  'Materiality-重大性矩陣.md': 'materiality',
  'Templates-專家模板.md': 'templates',
  'Audit-Log-審計日誌.md': 'audit-log',
  'Vault-證據金庫.md': 'vault',
  'Roadmap-淨零路徑.md': 'roadmap',
  'Publish-報告發佈.md': 'publish',
  'Reading-Room-永續閱覽室.md': 'reading-room',
  'Library-永續智庫.md': 'library',
  'Finance-永續財務.md': 'finance',
  'Supply-Chain-供應鏈透明.md': 'supply-chain',
  'Stakeholders-利害關係人.md': 'stakeholders',
  'Audit-Verify-VerifyLink.md': 'audit-verify',
  'Academy-永續學院.md': 'academy',
  'Advisors-顧問專區.md': 'advisors',
  'Agents-代理專區.md': 'agents',
  'Consulting-顧問服務.md': 'consulting',
  'AI-Platform-AI整合平台.md': 'ai-platform',
  'Tasks-任務中心.md': 'tasks',
  'Profile-企業管理.md': 'profile',
  'API-Setup-整合中心.md': 'api-setup',
  'System-Test-系統測試.md': 'system-test',
  '控制台-Dashboard.md': 'dashboard'
};

if (!fs.existsSync(path.join('c:\\Project\\esggo\\esggo', 'scripts'))) {
    fs.mkdirSync(path.join('c:\\Project\\esggo\\esggo', 'scripts'));
}

Object.entries(routeMap).forEach(([wikiFile, route]) => {
  const sourcePath = path.join(wikiDir, wikiFile);
  const targetDir = path.join(appDir, route);
  const targetPath = path.join(targetDir, 'DESIGN.md');
  
  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const content = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, content);
    console.log(`Synced ${wikiFile} -> ${route}/DESIGN.md`);
  } else {
    console.log(`Missing wiki file: ${wikiFile}`);
  }
});

console.log('Done.');
