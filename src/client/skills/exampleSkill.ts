import { AtomicFunction, AtomicFunctionInput, AtomicFunctionResult } from '@/packages/types/src/AtomicFunction';

/**
 * ExampleSkill demonstrates how to implement a stateless atomic function.
 * It simply echoes the payload after a simulated processing delay.
 */
export const exampleSkill: AtomicFunction<AtomicFunctionInput, unknown> = async (
  input: AtomicFunctionInput
): Promise<AtomicFunctionResult> => {
  const start = Date.now();

  // Extract context & payload – no hidden state is used.
  const { context, payload } = input;

  // Simulate some deterministic processing.
  const processed = {
    echoed: payload,
    requestId: context.requestId,
    processedAt: new Date().toISOString()
  };

  return {
    success: true,
    data: processed,
    metadata: {
      executionTime: Date.now() - start,
      version: '1.0.0'
    }
  };
};
