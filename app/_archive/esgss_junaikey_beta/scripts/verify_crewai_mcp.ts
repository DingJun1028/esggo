
import http from 'http';

const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/sse',
    method: 'GET',
    headers: {
        'Accept': 'text/event-stream'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    if (res.statusCode === 200 && res.headers['content-type']?.includes('text/event-stream')) {
        console.log('SUCCESS: Server is running and responding with SSE stream.');
        process.exit(0);
    } else {
        console.error('FAILURE: Unexpected response status or content-type.');
        process.exit(1);
    }
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
    process.exit(1);
});

req.end();
