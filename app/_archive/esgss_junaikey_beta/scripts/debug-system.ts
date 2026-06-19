console.log('--- Debug Start ---');

async function test() {
  try {
    console.log('Importing scalability...');
    const { globalCache, LoadBalancer } = await import('../src/services/scalability');
    console.log('Scalability imported.');

    globalCache.destroy();
    console.log('globalCache destroyed.');
  } catch (e) {
    console.error('Scalability failed:', e);
  }

  try {
    console.log('Importing smart-notifications...');
    const { SmartNotificationService } = await import('../src/services/smart-notifications');
    console.log('SmartNotifications imported.');

    const s = new SmartNotificationService('http://mock', 'mock');
    console.log('SmartNotificationService instantiated.');
    s.destroy();
    console.log('SmartNotificationService destroyed.');
  } catch (e) {
    console.error('SmartNotifications failed:', e);
  }

  try {
    console.log('Importing EvidenceVault...');
    const { EvidenceVault } = await import('../src/services/EvidenceVault');
    console.log('EvidenceVault imported.');
    EvidenceVault.destroy();
    console.log('EvidenceVault destroyed.');
  } catch (e) {
    console.error('EvidenceVault failed:', e);
  }
}

test().catch(e => console.error('Top level error:', e));
