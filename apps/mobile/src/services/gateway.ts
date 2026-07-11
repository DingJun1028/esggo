import Constants from 'expo-constants';

// Base URL of the OmniAgent Gateway (apps/gateway/omni-server.mjs, port 8642).
// Override per-environment via app.json -> expo.extra.gatewayUrl.
const DEFAULT_URL = 'http://localhost:8642';

export const GATEWAY_URL: string =
  (Constants.expoConfig?.extra?.gatewayUrl as string | undefined) || DEFAULT_URL;

export interface GatewayHealth {
  ok: boolean;
  ts: number;
  ws_clients: number;
  errors: number;
}

export interface GatewayStatus {
  providers: {
    gemini: boolean;
    openrouter: boolean;
    groq: boolean;
    free_models: number;
    groq_models: number;
    mock_fallback: boolean;
  };
  endpoints: string[];
}

export interface SkillEntry {
  id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SwarmEvents {
  total: number;
  events: { type?: string; ts?: number; [key: string]: unknown }[];
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${GATEWAY_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Gateway ${path} responded ${res.status}`);
  }
  return (await res.json()) as T;
}

export const gateway = {
  health: () => getJson<GatewayHealth>('/health'),
  status: () => getJson<GatewayStatus>('/status'),
  skills: () => getJson<{ skills: SkillEntry[] }>('/skills'),
  swarmEvents: () => getJson<SwarmEvents>('/swarm/events'),
};
