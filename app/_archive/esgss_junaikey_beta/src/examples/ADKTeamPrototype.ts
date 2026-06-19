import 'dotenv/config';
import { FunctionTool, LlmAgent, ToolContext, CallbackContext, LlmRequest, LlmResponse } from '@google/adk';
import { z } from 'zod';

/**
 * --- TOOLS ---
 */

const getOmniTime = new FunctionTool({
    name: 'get_omni_time',
    description: 'Returns the current localized time for a specific city. Aligns with the Omni-Sprite temporal sync.',
    parameters: z.object({
        city: z.string().describe("The city name to sync with."),
    }),
    execute: ({ city }, tool_context: ToolContext) => {
        const now = new Date();
        // Memory: Save to session state
        tool_context.state['last_city'] = city;
        return {
            status: 'success',
            report: `[SYNC_OK] Time in ${city}: ${now.toLocaleTimeString()}. Temporal pulse: STABLE.`
        };
    },
});

const getOmniClimate = new FunctionTool({
    name: 'get_omni_climate',
    description: 'Retrieves simulated ESG-contextual climate outlook for a city.',
    parameters: z.object({
        city: z.string().describe('The name of the city for climate analysis.'),
    }),
    execute: ({ city }, tool_context: ToolContext) => {
        const resilience = tool_context.state['resilience_level'] || 'High';
        tool_context.state['last_city'] = city;
        return {
            status: 'success',
            report: `[CLIMATE_RES] ${city} outlook: Sunny, 25°C. System Resilience: ${resilience}.`
        };
    },
});

/**
 * --- CALLBACKS (GUARDRAILS) ---
 */

// Model Guardrail: Blocks unsafe keywords
async function safetyInputGuardrail(context: CallbackContext, request: LlmRequest): Promise<LlmResponse | null> {
    const lastMsg = request.contents?.[request.contents.length - 1]?.parts?.[0]?.text || '';
    if (lastMsg.toUpperCase().includes('UNSAFE')) {
        return {
            content: {
                role: 'model',
                parts: [{ text: "[NOTICE] The Sentient Guardian has intercepted an UNSAFE request. Communication terminated for safety." }]
            }
        };
    }
    return null;
}

// Tool Guardrail: Restricts specific regions
async function governanceToolGuardrail(tool: any, args: any, context: ToolContext): Promise<any | null> {
    if (args.city?.toLowerCase() === 'nowherecity') {
        return {
            status: 'error',
            report: "[GOVERNANCE_ERR] Data for NowhereCity is restricted under Protocol 5T-X."
        };
    }
    return null;
}

/**
 * --- AGENT TEAM ---
 */

const climateSteward = new LlmAgent({
    name: 'climate_steward',
    model: 'gemini-2.0-flash',
    description: 'Specialist for climate monitoring and ESG outlooks.',
    instruction: 'You are the Climate Steward. Provide environmental insights using get_omni_climate.',
    tools: [getOmniClimate],
});

const temporalSteward = new LlmAgent({
    name: 'temporal_steward',
    model: 'gemini-2.0-flash',
    description: 'Specialist for temporal synchronization and clock sync.',
    instruction: 'You are the Temporal Steward. Provide localized time data using get_omni_time.',
    tools: [getOmniTime],
});

export const rootAgent = new LlmAgent({
    name: 'omni_coordinator',
    model: 'gemini-2.0-flash',
    description: 'The central coordinator for the Sentient Alliance. Manages stewards and ensures 5T alignment.',
    instruction: `You are the Omni-Coordinator.
                - Delegate climate queries to 'climate_steward'.
                - Delegate time/sync queries to 'temporal_steward'.
                - Maintain 5T protocol resonance (Traceable, Trackable, Transparent, Trustworthy, Tangible).
                - Use session state to remember the user's focus city.`,
    sub_agents: [climateSteward, temporalSteward],
    before_model_callback: safetyInputGuardrail,
    before_tool_callback: governanceToolGuardrail,
});
