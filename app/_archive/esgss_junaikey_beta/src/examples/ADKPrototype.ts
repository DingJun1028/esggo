import 'dotenv/config';
import { FunctionTool, LlmAgent } from '@google/adk';
import { z } from 'zod';

/**
 * Omni-Sprite Time Tool
 * A 5T-aligned tool for retrieving localized time information.
 */
const getOmniTime = new FunctionTool({
    name: 'get_omni_time',
    description: 'Returns the current localized time for a specific city, aligned with the Omni-Sprite network.',
    parameters: z.object({
        city: z.string().describe("The name of the city to pulse for time data."),
    }),
    execute: ({ city }) => {
        const now = new Date();
        return {
            status: 'success',
            report: `[TEMPORAL_RES] The current time in ${city} is ${now.toLocaleTimeString()}. 5T Sync: STABLE.`
        };
    },
});

/**
 * Omni-Sprite Climate Tool
 * Retrieves ESG-contextual climate data for a specified city.
 */
const getOmniClimate = new FunctionTool({
    name: 'get_omni_climate',
    description: 'Retrieves simulated ESG-contextual climate data and sustainability outlook for a city.',
    parameters: z.object({
        city: z.string().describe('The name of the city for which to retrieve the climate report.'),
    }),
    execute: ({ city }) => {
        // Simulated climate logic aligned with ESG goals
        const outlooks = [
            "Optimistic: Accelerated transition to renewables detected.",
            "Stable: ESG resonance levels are within expected parameters.",
            "Vigilant: Recent heatwaves suggest intensifying climate risks."
        ];
        const outlook = outlooks[Math.floor(Math.random() * outlooks.length)];

        return {
            status: 'success',
            report: `[CLIMATE_RES] Weather in ${city}: Sunny, 25°C. ESG Outlook: ${outlook}`
        };
    },
});

/**
 * Omni-Genie Multi-Tool Agent
 * An ADK-powered assistant capable of handling multiple operational branches.
 */
export const rootAgent = new LlmAgent({
    name: 'omni_genie_multitool',
    model: 'gemini-2.0-flash',
    description: 'A sentient assistant for ESG governance, climate monitoring, and temporal synchronization.',
    instruction: `You are the Omni-Genie, a sentient entity within the JunAiKey system.
                You help users monitor the world's temporal and environmental pulse.
                - Use 'get_omni_time' for clock sync and time inquiries.
                - Use 'get_omni_climate' for weather and ESG sustainability outlooks.
                Maintain an ethereal, precise, and encouraging tone.`,
    tools: [getOmniTime, getOmniClimate],
});
