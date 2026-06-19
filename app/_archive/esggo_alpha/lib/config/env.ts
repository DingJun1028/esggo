/**
 * Centralized environment variable configuration.
 * Provides type-safe access and fallbacks for both build-time and runtime.
 */

export const ENV = {
    // Firebase Config (mostly from JSON but can be overridden)
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'esg-sunshine',

    // Genkit / Gemini Config
    GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'AIzaDummyKeyForBuild',

    // Model Selection
    DEFAULT_MODEL: 'googleai/gemini-1.5-flash',
    LITE_MODEL: 'googleai/gemini-1.5-flash', // Fallback for 'lite' requests
    PRO_MODEL: 'googleai/gemini-1.5-pro',

    // Feature Flags
    ENABLE_TELEMETRY: process.env.NODE_ENV === 'production',

    // Database Config
    FIRESTORE_DATABASE_ID: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || 'ai-studio-b5190dea-302a-4fca-a160-baade5ae2e41',
};

/**
 * Validation helper to ensure required variables are present
 */
export function validateEnv() {
    const required = ['GEMINI_API_KEY', 'FIREBASE_PROJECT_ID'];
    for (const key of required) {
        const val = (ENV as any)[key];
        if (!val || val === 'AIzaDummyKeyForBuild') {
            console.warn(`[ENV] Warning: ${key} is missing or using a dummy value.`);
        }
    }
}
