const https = require('https');
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
    try {
      const json = JSON.parse(data);
      console.log('success:', json.success);
      if (json.report) {
        console.log('totalWords:', json.report.totalWords);
        console.log('chapters:', json.report.chapters.length);
        console.log('provider:', json.report.provider);
        json.report.chapters.forEach(ch => {
          console.log(`  ${ch.title}: ${ch.wordCount} words`);
        });
      } else {
        console.log('error:', json.error);
      }
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw:', data.substring(0, 500));
    }
  });
});
req.on('error', e => console.log('Error:', e.message));
req.write(body);
req.end();
