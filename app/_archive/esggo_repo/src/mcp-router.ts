import { mcp } from './mcp-proxy';

export async function routeMcpRequest(service: string, action: string, payload: any) {
  switch (service) {
    case 'firebase':
      return mcp.firebase(action, payload);
    case 'supabase':
      return mcp.supabase(action, payload);
    case 'genkit':
      return mcp.genkit(action, payload);
    case 'boostSpace':
      return mcp.boostSpace(action, payload);
    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}
