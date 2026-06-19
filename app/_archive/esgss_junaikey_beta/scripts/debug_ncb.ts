
import dotenv from 'dotenv';
dotenv.config();

async function testNcb() {
    const url = `https://openapi.nocodebackend.com/read/esg_readings?Instance=54686_esg_junaikey_db&limit=1&secret_key=0ea9096eeb5f972d26b32782969028342635a6980ab088c42150379911e0788f`;
    const token = '0ea9096eeb5f972d26b32782969028342635a6980ab088c42150379911e0788f';

    console.log('--- Debug NCB Direct Fetch ---');
    console.log('URL:', url);
    console.log('Token (first 4):', token.substring(0, 4));

    const headers = {
        'secret_key': token,
        'Content-Type': 'application/json',
        'Origin': 'https://esgss-junaikey-beta.vercel.app'
    };

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testNcb();
