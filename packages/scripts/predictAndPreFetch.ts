import { OmniCoreEcosystem } from '../src/impl/core';

(async () => {
  const eco = new OmniCoreEcosystem();
  const result = await eco.gateway.predictAndPreFetch('auto-schedule');
  console.log('PredictAndPreFetch cron run: raw result type=', typeof result, 'value=', JSON.stringify(result));
})();
