import redis from 'ioredis';

async function test() {
    console.log('Starting redis test...');
    const client = new redis();
    client.on('error', () => { }); // Ignore errors if redis is down

    console.log('Quitting...');
    await client.quit();
    console.log('Done.');
    process.exit(0);
}

test();
