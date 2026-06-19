const http = require('http');
const https = require('https');

const PORT = 3001;
const TARGET_HOST = 'openrouter.ai';
const TARGET_PATH = '/api/v1';
const FREE_MODEL = 'mistralai/mistral-small-3.1-24b-instruct:free'; // Switching to a potentially more stable model

console.log(`[Proxy] ========================================`);
console.log(`[Proxy] ESG GO Gitclaw Debug Proxy Started`);
console.log(`[Proxy] Listening on: http://0.0.0.0:${PORT}`);
console.log(`[Proxy] Target Model: ${FREE_MODEL}`);
console.log(`[Proxy] ========================================`);

const server = http.createServer((req, res) => {
    const timestamp = new Date().toLocaleTimeString();

    if (req.url === '/' || req.url === '/v1') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "alive" }));
        return;
    }

    console.log(`[${timestamp}] Incoming: ${req.method} ${req.url}`);
    // Log headers to see what gitclaw is sending
    console.log(`[${timestamp}] Incoming Headers:`, JSON.stringify(req.headers));

    let body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
        body = Buffer.concat(body).toString();

        if (body && req.url.includes('/chat/completions')) {
            try {
                const json = JSON.parse(body);
                console.log(`[${timestamp}] Original Model: ${json.model}`);

                // Swap to free model
                json.model = FREE_MODEL;

                // Force stream: false to avoid chunked-encoding issues in gitclaw
                json.stream = false;

                body = JSON.stringify(json);
                console.log(`[${timestamp}] Swapped Body Length: ${body.length}`);
            } catch (e) {
                console.error(`[${timestamp}] Body parse error:`, e.message);
            }
        }

        const options = {
            hostname: TARGET_HOST,
            path: req.url.startsWith('/v1') ? req.url.replace('/v1', TARGET_PATH) : TARGET_PATH + req.url,
            method: req.method,
            headers: {
                ...req.headers,
                'host': TARGET_HOST,
                'HTTP-Referer': 'https://localhost',
                'X-Title': 'ESG-GO-Debug',
                'content-length': Buffer.byteLength(body)
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            console.log(`[${timestamp}] OpenRouter Status: ${proxyRes.statusCode}`);

            let resData = [];
            proxyRes.on('data', (chunk) => resData.push(chunk));
            proxyRes.on('end', () => {
                const responseBuffer = Buffer.concat(resData);
                console.log(`[${timestamp}] Sending response to Gitclaw (${responseBuffer.length} bytes)`);

                // Clean up headers for the client
                const responseHeaders = {
                    'Content-Type': 'application/json',
                    'Content-Length': responseBuffer.length
                };

                res.writeHead(proxyRes.statusCode, responseHeaders);
                res.end(responseBuffer);
            });
        });

        proxyReq.on('error', (err) => {
            console.error(`[${timestamp}] Proxy Error:`, err.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
        });

        proxyReq.write(body);
        proxyReq.end();
    });
});

server.listen(PORT, '0.0.0.0');
