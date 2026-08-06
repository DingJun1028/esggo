const fs = require('fs');
let content = fs.readFileSync('omni-server.mjs', 'utf8');

// Add import for esg-report
const importLine = "import { setupReportRoutes } from './esg-report.mjs';";
if (!content.includes('setupReportRoutes')) {
  content = content.replace(
    /import.*from.*model-router\.mjs/,
    `$&\n${importLine}`
  );
}

// Add setupReportRoutes call before httpServer.listen
if (!content.includes('setupReportRoutes(app)')) {
  content = content.replace(
    /httpServer\.listen/,
    `setupReportRoutes(app);\n\nhttpServer.listen`
  );
}

fs.writeFileSync('omni-server.mjs', content);
console.log('Updated omni-server.mjs');
