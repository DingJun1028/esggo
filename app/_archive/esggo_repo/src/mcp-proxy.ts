import { createApiClient } from '../lib/api-client';

export const mcp = {
  async firebase(action: string, payload: any) {
    const client = createApiClient(process.env.NEXT_PUBLIC_FIREBASE_API_URL || '');
    switch (action) {
      case 'read':
        return client.get('/data', { params: payload });
      case 'write':
        return client.post('/data', payload);
      default:
        throw new Error(`Unknown Firebase action: ${action}`);
    }
  },
  
  async supabase(action: string, payload: any) {
    const client = createApiClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    switch (action) {
      case 'select':
        return client.post('/rpc/select', payload);
      case 'insert':
        return client.post('/rpc/insert', payload);
      default:
        throw new Error(`Unknown Supabase action: ${action}`);
    }
  },
  
  async genkit(action: string, payload: any) {
    const client = createApiClient(process.env.NEXT_PUBLIC_GENKIT_API_URL || '');
    switch (action) {
      case 'generate':
        return client.post('/generate', payload);
      case 'validate':
        return client.post('/validate', payload);
      default:
        throw new Error(`Unknown Genkit action: ${action}`);
    }
  },
  
  async boostSpace(action: string, payload: any) {
    const client = createApiClient(process.env.NEXT_PUBLIC_BOOSTSPACE_API_URL || '');
    switch (action) {
      case 'upload':
        return client.post('/upload', payload);
      case 'download':
        return client.post('/download', payload);
      default:
        throw new Error(`Unknown BoostSpace action: ${action}`);
    }
  }
};
