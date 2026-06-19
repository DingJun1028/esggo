import { ResilienceLab } from '../src/services/integration/ResilienceLab';
import { useESGStore } from '../src/store/useESGStore';

// Initialize mock store data
useESGStore.setState({
  totalCO2e: 1250.5,
  itEnergyKWh: 450.2,
  anchoredCount: 5,
  recentAnchors: [],
  updateMetrics: () => {},
  addAnchor: () => {},
});

async function main() {
  const lab = new ResilienceLab();
  const success = await lab.runStressTest();

  if (success) {
    console.log('✅ Resilience Lab Stress Test Passed.');
    process.exit(0);
  } else {
    console.error('❌ Resilience Lab Stress Test Failed.');
    process.exit(1);
  }
}

main();
