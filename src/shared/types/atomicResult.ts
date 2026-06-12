export type AtomicResult<T> =
  | { success: true; data: T; metadata?: Record<string, unknown> }
  | { success: false; error: Error; metadata?: Record<string, unknown> };

export const toAtomicResult = <T>(payload: {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}): AtomicResult<T> => {
  if (payload.success) {
    return { success: true, data: payload.data as T, metadata: payload.metadata };
  }
  return { success: false, error: new Error(payload.error ?? 'Unknown error'), metadata: payload.metadata };
};
