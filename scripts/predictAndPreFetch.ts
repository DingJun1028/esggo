import { OmniCoreEcosystem } from '../src/impl/core';

(async () => {
  const eco = new OmniCoreEcosystem();
  const events = await eco.gateway.predictAndPreFetch('auto-schedule');
  console.log('PredictAndPreFetch cron run: returned', events.length, 'events');
})();
