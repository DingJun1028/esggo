import axios, { AxiosInstance } from 'axios';
import omniLogger, { LogCategory } from '../../../utils/omniLogger.js';

interface OmniSpaceConfig {
    apiKey: string;
    spaceId?: string;
}

export class OmniSpaceService {
    private client: AxiosInstance;
    private readonly baseUrl = 'https://integrator.omni.space/api'; // Updated to OmniSpace

    constructor() {
        const apiKey = process.env.OMNI_SPACE_API_KEY;
        if (!apiKey) {
            omniLogger.warn(LogCategory.SYSTEM, 'OmniSpace API Key not found in environment variables.');
        }

        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 10000
        });
    }

    /**
     * Pushes an entity update to a specific OmniSpace module via Webhook URL.
     * Note: OmniSpace often uses specific Webhook URLs for ingestion.
     * This is a generic implementation assuming we might have module-specific URLs.
     */
    public async pushEntity(webhookUrl: string, data: any): Promise<boolean> {
        try {
            const response = await axios.post(webhookUrl, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            omniLogger.info(LogCategory.INTEGRATION, `Successfully pushed to OmniSpace: ${webhookUrl}`, { status: response.status });
            return true;
        } catch (error: any) {
            omniLogger.error(LogCategory.INTEGRATION, `Failed to push to OmniSpace: ${webhookUrl}`, { error: error.message });
            return false;
        }
    }

    /**
     * Generic fetch if OmniSpace exposes a REST API for reading.
     * (Placeholder for future two-way sync if API allows direct reading)
     */
    public async fetchEntity(endpoint: string): Promise<any> {
        try {
            const response = await this.client.get(endpoint);
            return response.data;
        } catch (error: any) {
            omniLogger.error(LogCategory.INTEGRATION, `Failed to fetch from OmniSpace`, { endpoint, error: error.message });
            return null;
        }
    }
}

export const omniSpaceService = new OmniSpaceService();
