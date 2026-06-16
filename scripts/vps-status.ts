import net from 'net';

const SERVICES = [
  { name: 'Express API', port: 3000 },
  { name: 'Next.js UI', port: 3001 },
  { name: 'OmniAgent Gateway', port: 8642 },
  { name: 'OmniCore HTTPS', port: 8443 },
];

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const client = net.createConnection(port, '127.0.0.1');
    const timer = setTimeout(() => {
      client.destroy();
      resolve(false);
    }, 800);
    client.once('connect', () => {
      clearTimeout(timer);
      client.end();
      resolve(true);
    });
    client.once('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

(async () => {
  console.log('VPS Service Status Check');
  for (const svc of SERVICES) {
    const up = await checkPort(svc.port);
    console.log(`${up ? '🟢' : '🔴'} ${svc.name} :${svc.port} ${up ? 'UP' : 'DOWN'}`);
  }
})();
