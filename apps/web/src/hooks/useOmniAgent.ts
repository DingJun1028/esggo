import { useState } from 'react';
import { OmniTask, OmniGatewayResponse } from '@esggo/shared';

/**
 * useOmniAgent Hook
 * Connects the ESGGO Platform to the OmniAgent Commander (Gemma 4)
 */
export const useOmniAgent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OmniGatewayResponse | null>(null);

  const executeTask = async (task: OmniTask) => {
    setLoading(true);
    setError(null);
    
    // In a production environment, this might be a full URL or an absolute path
    const GATEWAY_URL = 'http://161.118.248.180/execute'; 

    try {
      const response = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Omni-Client': 'ESGGO-Web-v4'
        },
        body: JSON.stringify({
          ...task,
          model: task.model || 'google/gemma-4-31b-it:free'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gateway Error: ${response.status} - ${errText}`);
      }

      const data: OmniGatewayResponse = await response.json();
      setResult(data);
      return data;
    } catch (err: any) {
      const msg = err.message || 'Unknown integration error';
      setError(msg);
      console.error('[OmniAgent Hook] Execution failed:', msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeTask, loading, error, result };
};
