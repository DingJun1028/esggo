
import axios from 'axios';

const BASE_URL = 'http://localhost:3006/api';

async function run() {
  console.log('Script started. Targeting:', BASE_URL);

  let success = 0;
  let rateLimited = 0;
  let errors = 0;

  const total = 250;

  console.log(`Sending ${total} requests to /news...`);

  const promises = [];

  for (let i = 0; i < total; i++) {
    const p = axios.get(`${BASE_URL}/news`, { timeout: 2000 })
      .then(res => {
        success++;
        process.stdout.write('.');
      })
      .catch(err => {
        if (err.response && err.response.status === 429) {
          rateLimited++;
          process.stdout.write('L');
        } else {
          errors++;
          process.stdout.write('E');
          // console.error(err.code, err.message);
        }
      });

    promises.push(p);
    // Tiny delay to avoid overwhelming local network stack immediately
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 5));
  }

  await Promise.allSettled(promises);

  console.log('\n\n--- Results ---');
  console.log('Success:', success);
  console.log('Rate Limited (429):', rateLimited);
  console.log('Errors:', errors);

  if (rateLimited > 0) {
    console.log('✅ Rate limiting Verified!');
  } else {
    console.log('❌ Rate limiting NOT triggered.');
  }
}

run().catch(console.error);
