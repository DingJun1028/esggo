"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcp = void 0;
const axios_1 = __importDefault(require("axios"));
const firebaseConfig_1 = require("./firebaseConfig");
const supabaseConfig_1 = require("./supabaseConfig");
const genkitClient_1 = require("./genkitClient");
const boostSpaceClient_1 = require("./boostSpaceClient");
// Simple wrapper around four MCP services
exports.mcp = {
    firebase: async (endpoint, payload) => {
        const url = `${firebaseConfig_1.firebaseConfig.baseUrl}/${endpoint}`;
        const response = await axios_1.default.post(url, payload, {
            headers: { Authorization: `Bearer ${firebaseConfig_1.firebaseConfig.accessToken}` },
        });
        return response.data;
    },
    supabase: async (query, params) => {
        const client = supabaseConfig_1.supabaseUrl;
        const { data, error } = await client.from(query).select('*', params);
        if (error)
            throw error;
        return data;
    },
    genkit: async (flowName, data) => {
        const result = await genkitClient_1.genkitClient.invoke(flowName, data);
        return result;
    },
    boostSpace: async (apiName, data) => {
        const response = await boostSpaceClient_1.boostSpaceClient.request({ apiName, data });
        return response;
    },
};
//# sourceMappingURL=mcp-proxy.js.map