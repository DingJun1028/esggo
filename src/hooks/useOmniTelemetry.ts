import useSWR from 'swr';
import type { HexaCoreTelemetry } from '../../app/api/omni-agent-api/telemetry/route';

interface TelemetryResponse {
  id: string;
  status: 'success' | 'error';
  content: string;
  data: HexaCoreTelemetry;
  timestamp: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOmniTelemetry() {
  // Polling every 3.5 seconds to simulate real-time swarm chatter & data fluctuation
  const { data, error, isLoading } = useSWR<TelemetryResponse>(
    '/api/omni-agent-api/telemetry',
    fetcher,
    { refreshInterval: 3500 }
  );

  return {
    telemetry: data?.data,
    isLoading,
    isError: error || data?.status === 'error',
    rawResponse: data,
  };
}
