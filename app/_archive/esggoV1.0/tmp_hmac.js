const crypto = require('crypto');
const secret = 'esg_go_secret_123';
const body = JSON.stringify({ event: "TODO_UPDATED", currentValue: { id: "test_blue_001", title: "ESG Audit: Vendor A", done: true } });
const hmac = crypto.createHmac('sha256', secret);
const signature = hmac.update(body).digest('hex');
console.log(signature);
