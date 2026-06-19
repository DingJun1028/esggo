
async function testReport() {
    console.log('Testing /api/report/generate ...');
    try {
        const response = await fetch('http://localhost:3001/api/report/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer SUPER_SECRET_TOKEN'
            },
            body: JSON.stringify({
                format: 'pdf', // Requesting PDF
                scope: 'Test Enterprise',
                period: 'Q3 2025'
            })
        });

        if (!response.ok) {
            console.error('❌ Error Status:', response.status, response.statusText);
            const text = await response.text();
            console.error('❌ Error Body:', text);
            return;
        }

        const contentType = response.headers.get('content-type');
        console.log('✅ Status:', response.status);
        console.log('✅ Content-Type:', contentType);

        if (contentType === 'application/pdf') {
            const buffer = await response.arrayBuffer();
            console.log('✅ PDF Received. Size:', buffer.byteLength, 'bytes');
            const header = new Uint8Array(buffer).slice(0, 5);
            const headerStr = new TextDecoder().decode(header);
            console.log('✅ PDF Header:', headerStr);
        } else {
            console.warn('⚠️ Unexpected content type for PDF request');
        }
    } catch (error) {
        console.error('❌ Fetch failed:', error.message);
    }
}

testReport();
