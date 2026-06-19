/**
 * Application-wide constants
 * Eliminates magic numbers and centralizes configuration
 */

export const TIMEOUTS = {
    MINIMAL: 300,
    SHORT: 500,
    STANDARD: 800,
    LONG: 1000,
    EXTENDED: 1500,
    NETWORK: 2000,
    PROCESS: 3000,
    TEST_LOOP: 30000,
    DEFAULT_DELAY: 5000,
};

export const AI_CONSTANTS = {
    EMBEDDING_DIMENSIONS: 1536,
    DEFAULT_TOP_K: 5,
    CONFIDENCE: {
        DEFAULT: 0.9,
        VERIFIED: 0.95,
        ORCHESTRATED: 0.98,
        THRESHOLD: 0.7,
    },
};

export const RETRY_CONFIG = {
    MAX_RETRIES: 3,
    BACKOFF_MS: 1000,
};

export const UI_CONSTANTS = {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
};
