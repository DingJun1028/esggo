const http = require('http');

const body = JSON.stringify({
  templateId: 'TPL-COMP-01',
  companyName: '善向永續股份有限公司',
  industry: '科技業',
  customPrompt: '全面合規永續報告'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/sustain-write/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Parse SSE format properly
    const events = data.split('\n\n');
    for (const event of events) {
      const lines = event.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: {')) {
          try {
            const jsonStr = line.substring(6);
            const json = JSON.parse(jsonStr);
            if (json.report) {
              const report = json.report;
              console.log('=== REPORT GENERATED ===');
              console.log('Company:', report.companyName);
              console.log('Industry:', report.industry);
              console.log('Template:', report.templateName);
              console.log('Total Words:', report.totalWords);
              console.log('Chapters:', report.chapters.length);
              console.log('Provider:', report.provider);
              console.log('');
              report.chapters.forEach((ch, i) => {
                console.log((i+1) + '. ' + ch.title + ': ' + ch.wordCount + ' words | GRI: ' + ch.indicators.join(', '));
              });
              console.log('');
              console.log('=== SAMPLE (Ch.1 first 300 chars) ===');
              console.log(report.chapters[0].content.substring(0, 300));
            }
          } catch(e) { /* ignore non-report events */ }
        }
      }
    }
  });
});
req.on('error', e => console.log('Error:', e.message));
req.write(body);
req.end();
