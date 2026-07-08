const https = require('node:https');
const crypto = require('node:crypto');
const fs = require('fs').promises;
const path = require('node:path');
const os = require('node:os');

const API_KEY = process.env.NVAPI_KEY || process.env.NVIDIA_API_KEY || '';
if (!API_KEY) {
  console.warn('[predictAndPreFetch] NVIDIA API key not set – returning empty predictions');
  process.exit(0);
}

const payload = JSON.stringify({ prompt: 'auto-schedule', temperature: 0.2, max_tokens: 128 });
const options = {
  hostname: 'health.api.nvidia.com',
  port: 443,
  path: '/v1/retrieval/quality/answer',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const body = Buffer.concat(chunks).toString('utf-8');
    if (res.statusCode && res.statusCode >= 400) {
      console.error(`[predictAndPreFetch] NVIDIA API HTTP ${res.statusCode}: ${body.slice(0, 500)}`);
      console.log('PredictAndPreFetch cron run: returned 0 events');
      process.exit(0);
    }
    let parsed;
    try { parsed = JSON.parse(body); } catch (e) {
      console.error('[predictAndPreFetch] Failed to parse NVIDIA response', e);
      console.log('PredictAndPreFetch cron run: returned 0 events');
      process.exit(0);
    }

    const predictions = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.predictions)
        ? parsed.predictions
        : [];

    const events = predictions.map((p, idx) => ({
      uuid: crypto.randomUUID(),
      version: '1.0.0',
      eventName: 'nvidia.prediction',
      payload: typeof p === 'object' ? p : { raw: p },
      stage: 'EMERGED',
      source_origin: 'nvidia',
      topic: 'prediction',
      evidence: {},
      lifecycle_path: [],
      hashLock: crypto.randomUUID(),
    }));

    const projectRoot = process.env.PREDICT_PROJECT_ROOT || path.resolve(process.cwd(), '..');
    const repoRoot = path.resolve(projectRoot);
    const vaultPath = path.join(repoRoot, 'secrets', 'nvidia_predictions.json');
    fs.mkdir(path.dirname(vaultPath), { recursive: true })
      .then(() => fs.writeFile(vaultPath, JSON.stringify(predictions, null, 2), 'utf8'))
      .then(() => console.info(`[predictAndPreFetch] Saved ${predictions.length} predictions to ${vaultPath}`))
      .catch((e) => console.warn('[predictAndPreFetch] Could not write to secret vault', e));

    console.log(`PredictAndPreFetch cron run: returned ${events.length} events`);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('[predictAndPreFetch] NVIDIA API call failed', err);
  console.log('PredictAndPreFetch cron run: returned 0 events');
  process.exit(0);
});

req.write(payload);
req.end();
