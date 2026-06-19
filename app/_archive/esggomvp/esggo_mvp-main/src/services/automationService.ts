import { AutomationResult } from '../types/automation';

export const automationService = {
    async dispatch(payload: {
        atomId: string;
        type: string;
        data: any;
        timestamp: number;
    }): Promise<AutomationResult> {
        try {
            console.log(`[Automation] Dispatching ${payload.type} for Atom ${payload.atomId}`, payload.data);

            // In a real scenario, this calls our Vercel Secure Relay
            const response = await fetch('/api/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data,
                status: 'completed'
            };
        } catch (error: any) {
            console.warn('[Automation] Dispatch failed:', error.message);

            // Mock success for development if API is missing or in development
            if (process.env.NODE_ENV === 'development') {
                console.info('[Automation] Mocking success for development mode');
                return new Promise(resolve =>
                    setTimeout(() => resolve({
                        success: true,
                        status: 'completed',
                        data: { mock: true, timestamp: Date.now() }
                    }), 1200)
                );
            }

            return {
                success: false,
                status: 'error',
                error: error.message
            };
        }
    }
};
