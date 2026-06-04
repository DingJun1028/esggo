import axios from 'axios';
import { firebaseConfig } from './firebaseConfig';
import { supabaseUrl } from './supabaseConfig';
import { genkitClient } from './genkitClient';
import { boostSpaceClient } from './boostSpaceClient';
// Simple wrapper around four MCP services
export const mcp = {
    firebase: async (endpoint, payload) => {
        const url = `${firebaseConfig.baseUrl}/${endpoint}`;
        const response = await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${firebaseConfig.accessToken}` },
        });
        return response.data;
    },
    supabase: async (query, params) => {
        const client = supabaseUrl;
        const { data, error } = await client.from(query).select('*', params);
        if (error)
            throw error;
        return data;
    },
    genkit: async (flowName, data) => {
        const result = await genkitClient.invoke(flowName, data);
        return result;
    },
    boostSpace: async (apiName, data) => {
        const response = await boostSpaceClient.request({ apiName, data });
        return response;
    },
};
//# sourceMappingURL=mcp-proxy.js.map