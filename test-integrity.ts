import { integrityModule } from './lib/omni-core/integrity';

async function main() {
  const rawData = { metric: 'Energy Use', source: 'Meter A' };
  const crystal = await integrityModule.sacredSeal(rawData);
  const isValid = await integrityModule.verify(crystal);
  console.log('Is valid:', isValid);
}
main().catch(console.error);
