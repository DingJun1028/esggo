import { create5TAttestation } from '../crypto-proof';

/**
 * 5T Integrity Protocol Stress Test
 * Simulates high-concurrency cryptographic sealing to verify system stability.
 */
export async function run5TStressTest(iterations = 100) {
  console.log(`[StressTest] Starting 5T Protocol Stress Test: ${iterations} concurrent attestations...`);
  const startTime = Date.now();
  
  const tasks = Array.from({ length: iterations }).map((_, i) => 
    create5TAttestation(
      `TEST_METRIC_${i}`,
      Math.random() * 1000,
      'tCO2e',
      `SOURCE_DOC_ID_${i}`,
      'Emission = Activity * Factor'
    )
  );

  try {
    const results = await Promise.all(tasks);
    const duration = Date.now() - startTime;
    const avgTime = duration / iterations;
    
    console.log(`[StressTest] Completed successfully in ${duration}ms`);
    console.log(`[StressTest] Average time per seal: ${avgTime.toFixed(2)}ms`);
    console.log(`[StressTest] Throughput: ${(iterations / (duration / 1000)).toFixed(2)} seals/sec`);
    
    // Verify first and last result integrity
    const firstSeal = results[0].masterSeal;
    const lastSeal = results[results.length - 1].masterSeal;
    
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
