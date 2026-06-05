import axios from 'axios';
import { firebaseConfig } from './firebaseConfig';
import { supabaseUrl, supabaseKey } from './supabaseConfig';
import {genkitClient} from './genkitClient';
import { boostSpaceClient } from './boostSpaceClient';

// Simple wrapper around four MCP services
export const mcp = {
  firebase: async (endpoint: string, payload: any) => {
    const url = `${firebaseConfig.baseUrl}/${endpoint}`;
    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${firebaseConfig.accessToken}` },
    });
    return response.data;
  },
  supabase: async (query: string, params: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const client = supabaseUrl;
    const { data, error } = await client.from(query).select('*', params);
    if (error) throw error;
    return data;
  },
  genkit: async (flowName: string, data: any) => {
    const result = await genkitClient.invoke(flowName, data);
    return result;
  },
  boostSpace: async (apiName: string, data: any) => {
    const response = await boostSpaceClient.request({ apiName, data });
    return response;
  },
};
