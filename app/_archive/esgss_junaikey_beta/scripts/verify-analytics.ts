import { AnomalyDetector } from '../src/services/anomalyDetector';
import { advancedAnalyticsService, AdvancedConfig } from '../src/services/advanced-analytics';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

async function verifyAnalytics() {
  console.log('Starting verification of Analytics Hardening...');

  // 1. Verify AnomalyDetector Fault Isolation
  console.log('\n--- Verifying AnomalyDetector Fault Isolation ---');

  const detector = new AnomalyDetector();

  // Monkey-patch detectMetricAnomalies to throw for a specific metric
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalDetect = (detector as any).detectMetricAnomalies;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (detector as any).detectMetricAnomalies = async (metric: string, data: any, config: any) => {
    if (metric === 'poisoned_metric') {
      throw new Error('Simulated processing failure');
    }
    return originalDetect.call(detector, metric, data, config);
  };

  const input = {
    data: {
      valid_metric: Array(30)
        .fill(0)
        .map((_, i) => ({ date: `2024-01-${i + 1}`, value: 100 })),
      poisoned_metric: Array(30)
        .fill(0)
        .map((_, i) => ({ date: `2024-01-${i + 1}`, value: 100 })),
    },
    config: { minDataPoints: 5 },
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await detector.detect(input as any);
    console.log('AnomalyDetector.detect completed without crashing.');

    if (result && result.lastUpdated) {
      console.log('SUCCESS: AnomalyDetector survived the poisoned metric failure.');
    } else {
      console.error('FAILURE: AnomalyDetector returned invalid result.');
    }
  } catch (error) {
    console.error('FAILURE: AnomalyDetector crashed!', error);
  }

  // 2. Verify AdvancedAnalytics AI Training
  console.log('\n--- Verifying AdvancedAnalytics AI Capabilities ---');

  const experimentConfig: AdvancedConfig = {
    algorithm: 'random_forest',
    targetVariable: 'esg_score',
    features: ['carbon_emissions', 'water_usage', 'community_investment'],
    hyperparameters: { trees: 100 },
  };

  try {
    console.log('Training Model with Config:', JSON.stringify(experimentConfig));

    // Mock data
    const mockData = [
      { carbon: 10, water: 5 },
      { carbon: 12, water: 6 },
    ];

    const result = await advancedAnalyticsService.trainModel(mockData, experimentConfig);

    if (result.metrics.accuracy > 0.9) {
      console.log(`SUCCESS: Model Trained. ID: ${result.modelId}`);
      console.log(`Metrics: Accuracy=${result.metrics.accuracy}, AUC=${result.metrics.auc}`);
    } else {
      console.error('FAILURE: Model Training yielded poor metrics.');
    }

    // Test Prescriptions
    const prescriptions = await advancedAnalyticsService.generatePrescriptions(result.modelId, {});
    console.log('AI Prescriptions:', prescriptions);
  } catch (error) {
    console.error('FAILURE: AI Service Verification Failed!', error);
  }

  console.log('\n--- Verification Complete ---');
}

verifyAnalytics().catch(console.error);
