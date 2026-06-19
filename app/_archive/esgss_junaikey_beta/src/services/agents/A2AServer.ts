import express, { Request, Response } from 'express';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger.js';

import cors from 'cors';
import { SearchWorkflow } from '../../adk/workflows/SearchWorkflow.js';
import { AdkPersistenceService } from '../../adk/services/AdkPersistenceService.js';
import { coordinatorAgent } from '../../adk/agents/CoordinatorAgent.js';
import { searchAgent } from '../../adk/agents/SearchAgent.js';
import { Runner, InMemorySessionService, isFinalResponse } from '@google/adk';
import { SearchWorkflowConfig } from '../../adk/types/AdkSearchTypes.js';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

/**
 * A2A Server Implementation
 * Integrated with ADK SearchWorkflow and Sustainable Observer Loop.
 */
class A2AServer {
    private app: express.Application;
    private port: number;
    private sessionService: InMemorySessionService;
    private runner: Runner;
    private activeWorkflows: Map<string, SearchWorkflow>;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '4000', 10);

        this.app.use(cors());
        this.app.use(express.json());

        this.sessionService = new InMemorySessionService();
        this.runner = new Runner({
            appName: 'A2A_Remote_Service',
            agent: searchAgent,
            sessionService: this.sessionService,
        });

        this.activeWorkflows = new Map<string, SearchWorkflow>();

        this.setupRoutes();
    }

    private setupRoutes() {
        // A2A Well-known Metadata
        this.app.get('/.well-known/agent.json', (req, res) => {
            res.json({
                name: 'esg-adk-agent',
                description: 'ESG Sustainable Intelligence Agent (ADK-powered)',
                version: '1.0.0',
                capabilities: ['research', 'audit', 'sentience'],
                url: `http://localhost:${this.port}/agent/message`
            });
        });

        /**
         * A2A Protocol Implementation
         */
        this.app.post('/agent/message', async (req: Request, res: Response) => {
            const { id, params } = req.body;
            const { message } = params;

            omniLogger.info(LogCategory.SYSTEM, '[A2AServer] `📡 [A2A] Received message for request ${id}:`', { data: message.parts[0].text });

            const sessionId = `a2a_${id}`;
            const userId = 'remote_caller';

            try {
                await this.sessionService.createSession({ appName: 'A2A_Remote_Service', userId, sessionId });

                const eventGenerator = this.runner.runAsync({
                    sessionId,
                    userId,
                    newMessage: {
                        role: 'user',
                        parts: message.parts
                    }
                });

                let finalResponse = '';
                for await (const event of eventGenerator) {
                    if (isFinalResponse(event)) {
                        finalResponse = event.content?.parts?.[0]?.text || '';
                        break;
                    }
                }

                res.json({
                    id,
                    result: {
                        message: {
                            role: 'agent',
                            parts: [{ kind: 'text', text: finalResponse }],
                            messageId: `resp_${Date.now()}`
                        }
                    }
                });
            } catch (error: any) {
                res.status(500).json({
                    id,
                    error: { code: -32603, message: error.message }
                });
            }
        });

        /**
         * ADK Lab API - Real-time Chat with Workflow
         */
        this.app.post('/api/adk/chat', async (req: Request, res: Response) => {
            const { query, sessionId = `session_${Date.now()}` } = req.body;

            if (!query) {
                return res.status(400).json({ error: 'Query is required' });
            }

            try {
                omniLogger.info(LogCategory.SYSTEM, '[A2AServer] Info', { data: `📡 [API] Starting SearchWorkflow for: ${query}` });
                const workflow = new SearchWorkflow(query);
                this.activeWorkflows.set(sessionId, workflow);

                const result = await workflow.execute();

                return res.json({
                    success: true,
                    sessionId,
                    data: result,
                    state: workflow.getState()
                });
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, '[A2AServer] ❌ [API Error]', { error })
                return res.status(500).json({ error: 'Workflow execution failed' });
            }
        });

        /**
         * ADK Lab API - Get Workflow Status
         */
        this.app.get('/api/adk/status/:sessionId', (req: Request, res: Response) => {
            const sessionId = req.params.sessionId as string;
            const workflow = this.activeWorkflows.get(sessionId);

            if (!workflow) {
                return res.status(404).json({ error: 'Workflow not found' });
            }

            return res.json({
                success: true,
                state: workflow.getState()
            });
        });

        /**
         * ADK Lab API - Get History
         */
        this.app.get('/api/adk/history', async (req: Request, res: Response) => {
            try {
                const result = await AdkPersistenceService.listHistory();
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch history' });
            }
        });

        /**
         * ADK Lab API - Coordinate Multi-Agent (Phase 6)
         */
        this.app.post('/api/adk/coordinate', async (req: Request, res: Response) => {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: 'Query is required' });
            }

            try {
                const coordRunner = new Runner({
                    appName: 'Coordinator_Service',
                    agent: coordinatorAgent,
                    sessionService: this.sessionService,
                });

                const sessionId = `coord_${Date.now()}`;
                const userId = 'lab_user';

                await this.sessionService.createSession({ appName: 'Coordinator_Service', userId, sessionId });

                const eventGenerator = coordRunner.runAsync({
                    sessionId,
                    userId,
                    newMessage: {
                        role: 'user',
                        parts: [{ text: query }]
                    }
                });

                let finalResponse = '';
                for await (const event of eventGenerator) {
                    if (isFinalResponse(event)) {
                        finalResponse = event.content?.parts?.[0]?.text || '';
                        break;
                    }
                }

                res.json({
                    success: true,
                    response: finalResponse || '協調完成',
                    collaborators: ['SearchAgent', 'AuditorAgent']
                });
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, '[A2AServer] ❌ [Coordination Error]', { error })
                res.status(500).json({ error: 'Coordination failed' });
            }
        });

        /**
         * [NEW] 5T 感知校準終端 (Calibration - Phase 6)
         */
        this.app.post('/api/adk/calibrate', async (req: Request, res: Response) => {
            omniLogger.info(LogCategory.SYSTEM, 'Initiating Swarm 5T Calibration...');
            try {
                // 模擬三位一體協同校準
                await new Promise(resolve => setTimeout(resolve, 1500));

                res.json({
                    success: true,
                    status: 'CALIBRATED',
                    swarmHealth: 99.8,
                    calibratedAgents: ['CoordinatorAgent', 'SearchAgent', 'AuditorAgent'],
                    driftBaseline: 0.05,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({ success: false, error: String(error) });
            }
        });

        /**
         * [NEW] Swarm Real-time Stream (SSE)
         */
        this.app.get('/api/adk/swarm/stream', (req: Request, res: Response) => {
            // 1. Set Headers for SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            omniLogger.info(LogCategory.SYSTEM, '[A2AServer] 📡 [SSE] Client connected to Swarm Stream');

            // 2. Subscribe to Drift Service
            const unsubscribe = import('../AdkSentienceDriftService').then(({ adkSentienceDriftService }) => {
                return adkSentienceDriftService.subscribe((event) => {
                    const payload = JSON.stringify(event);
                    res.write(`data: ${payload}\n\n`);
                });
            });

            // 3. Handle Disconnect
            req.on('close', async () => {
                omniLogger.info(LogCategory.SYSTEM, '[A2AServer] 📡 [SSE] Client disconnected');
                const unsub = await unsubscribe;
                if (unsub) unsub();
            });
        });

        // Add recalibration trigger
        this.app.post('/api/adk/swarm/recalibrate', async (req: Request, res: Response) => {
            const { adkSentienceDriftService } = await import('../AdkSentienceDriftService');
            adkSentienceDriftService.recalibrate();
            res.json({ success: true, msg: 'Recalibration triggered' });
        });

    }

    private async startSustainableObserver() {
        omniLogger.info(LogCategory.SYSTEM, '[A2AServer] 🌱 Sustainable Observer loop started.');
        const INTERVAL = 12 * 60 * 60 * 1000;

        const runObserver = async () => {
            omniLogger.info(LogCategory.SYSTEM, '[A2AServer] 📡 Sustainable Observer: Starting periodic audit...');
            const hotTopics = [
                '全球碳交易市場趨勢 (Carbon Credit Market)',
                '歐盟供應鏈正當性審核 (EU CSRD)',
                '再生能源 Q1 投資預判 (RE Investment)',
                '台灣企業 ESG 揭露合規性評測 (Taiwan ESG Disclosure)',
            ];
            const topic = hotTopics[Math.floor(Math.random() * hotTopics.length)] as string;

            try {
                const sessionId = `obs_${Math.random().toString(36).substring(7)}`;
                omniLogger.info(LogCategory.SYSTEM, '[A2AServer] Info', { data: `🔍 Observer Auditing Topic: ${topic} (Session: ${sessionId})` });

                const workflow = new SearchWorkflow(topic);
                await workflow.execute();

                const state = workflow.getState();
                await AdkPersistenceService.saveResearch(sessionId, topic, state);
                omniLogger.info(LogCategory.SYSTEM, '[A2AServer] Info', { data: `✅ Observer Audit Complete: ${topic} | Score: ${state.sentientScore || 'N/A'}` });
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, '[A2AServer] ❌ Observer Audit Failed:', { error })
            }
        };

        runObserver();
        setInterval(runObserver, INTERVAL);
    }

    public start() {
        this.app.listen(this.port, () => {
            omniLogger.info(LogCategory.SYSTEM, '[A2AServer] Info', { data: `🚀 ADK Agent Server running at http://localhost:${this.port}` });
            this.startSustainableObserver();
        });
    }
}

const server = new A2AServer();
server.start();
