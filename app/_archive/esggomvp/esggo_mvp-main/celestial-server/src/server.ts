import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import type { ApiRequest, ApiResponse, OmniResponseStatus } from '../../shared/types';
import { OmniRequestType } from '../../shared/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🌌 Universal Heart Core Route
app.post('/api/process', async (
    req: Request<{}, {}, ApiRequest>,
    res: Response<ApiResponse>
) => {
    const { id, type, content, data } = req.body;

    console.log(`[OmniCore] Processing request: ${type} (${id})`);

    try {
        let responseContent = "";
        let responseData: any = {};
        let status: any = "success";

        switch (type) {
            case OmniRequestType.MANIFEST_AGENT:
                responseContent = `Agent manifested: ${(data as any)?.name || 'Unnamed Agent'}`;
                responseData = { sessionId: uuidv4(), status: "active" };
                break;

            case OmniRequestType.QUERY:
                responseContent = `OmniCore understands: ${content}`;
                responseData = { insight: "ESG is the foundation of sustainability." };
                break;

            case OmniRequestType.STORE_MEMORY:
                responseContent = "Memory consolidated in Eternal Memory system.";
                responseData = { memoryId: uuidv4() };
                break;

            default:
                responseContent = "Request type acknowledged.";
        }

        const response: ApiResponse = {
            id,
            status: status as any,
            content: responseContent,
            data: responseData,
            metadata: {
                timestamp: Date.now(),
                trustScore: 0.99,
                uuid: uuidv4()
            }
        };

        res.json(response);

    } catch (error: any) {
        res.status(500).json({
            id,
            status: "error" as any,
            content: "Internal OmniCore error",
            error: error.message,
            metadata: {
                timestamp: Date.now(),
                trustScore: 0,
                uuid: uuidv4()
            }
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Celestial Server (Universal Heart Core) running on port ${port}`);
});
