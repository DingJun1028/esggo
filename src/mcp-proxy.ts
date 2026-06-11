import axios from 'axios';
import { firebaseConfig } from './firebaseConfig.ts';
import { supabaseUrl, supabaseKey } from './supabaseConfig.ts';
import {genkitClient} from './genkitClient.ts';
import { boostSpaceClient } from './boostSpaceClient.ts';

import { createClient } from '@supabase/supabase-js';

// Simple wrapper around four MCP services
export const mcp = {
  firebase: async (endpoint: string, payload: Record<string, unknown>) => {
    const url = `${firebaseConfig.baseUrl}/${endpoint}`;
    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${firebaseConfig.accessToken}` },
    });
    return response.data;
  },
  supabase: async (query: string, params: Record<string, unknown>) => {
    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client.from(query).select('*', params);
    if (error) throw error;
    return data;
  },
  genkit: async (flowName: string, data: Record<string, unknown>) => {
    const result = await genkitClient.invoke(flowName, data);
    return result;
  },
  boostSpace: async (apiName: string, data: Record<string, unknown>) => {
    const response = await boostSpaceClient.request({ apiName, data });
    return response;
  },
};
