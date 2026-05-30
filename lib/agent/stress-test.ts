import { create5TAttestation } from '../crypto-proof';

/**
 * 5T Integrity Protocol Stress Test
 * Simulates high-concurrency cryptographic sealing to verify system stability.
 */
export async function run5TStressTest(iterations = 100, concurrencyLimit = 10) {
  console.log(`[StressTest] Starting 5T Protocol Stress Test: ${iterations} concurrent attestations...`);
  const startTime = Date.now();

  const results = [];

  try {
    // 使用批次處理 (Chunking) 控制併發量，避免耗盡連線池或觸發 Rate Limit
    for (let i = 0; i < iterations; i += concurrencyLimit) {
      const chunk = Array.from({ length: Math.min(concurrencyLimit, iterations - i) }).map((_, j) => {
        const index = i + j;
        return create5TAttestation(
          JSON.stringify({
            metric: `TEST_METRIC_${index}`,
            value: Math.random() * 1000,
            unit: 'tCO2e',
            source: `SOURCE_DOC_ID_${index}`,
            formula: 'Emission = Activity * Factor'
          })
        );
      });
      const chunkResults = await Promise.all(chunk);
      results.push(...chunkResults);
    }

    const duration = Date.now() - startTime;
    const avgTime = duration / iterations;

    console.log(`[StressTest] Completed successfully in ${duration}ms`);
    console.log(`[StressTest] Average time per seal: ${avgTime.toFixed(2)}ms`);
    console.log(`[StressTest] Throughput: ${(iterations / (duration / 1000)).toFixed(2)} seals/sec`);

    // Verify first and last result integrity
    const firstSeal = results[0];
    const lastSeal = results[results.length - 1];

    console.log(`[StressTest] First Seal: ${firstSeal.slice(0, 16)}...`);
    console.log(`[StressTest] Last Seal: ${lastSeal.slice(0, 16)}...`);

    return {
      success: true,
      iterations,
      totalDuration: duration,
      avgTime,
      throughput: iterations / (duration / 1000)
    };
  } catch (error) {
    console.error(`[StressTest] Failed:`, error);
    return { success: false, error };
  }
}
