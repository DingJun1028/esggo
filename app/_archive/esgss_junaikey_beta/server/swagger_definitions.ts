/**
 * @swagger
 * tags:
 *   - name: System
 *     description: System health and status endpoints
 *   - name: Core API
 *     description: Essential endpoints for Agent interactions and Knowledge ingestion
 *   - name: Advanced API
 *     description: High-level features like Swarm Intelligence and ZKP
 *   - name: Universal Agent Protocol
 *     description: Standardized protocol for Agent task logging and locking
 *   - name: Webhooks
 *     description: External integration webhooks
 *   - name: Other API
 *     description: Miscellaneous metrics and news endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "online"
 *             service:
 *               type: string
 *               example: "JunAiKey Neural Core"
 *             version:
 *               type: string
 *               example: "10.0.0-universe"
 *             protocol:
 *               type: string
 *               example: "5T compliant"
 *
 *     Agent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         description:
 *           type: string
 *
 *     KnowledgeIngestResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             chunkId:
 *               type: string
 *
 *     KnowledgeSearchResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             query:
 *               type: string
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   score:
 *                     type: number
 *
 *     SwarmResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             goal:
 *               type: string
 *             outcome:
 *               type: string
 *
 *     AnchorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         txHash:
 *           type: string
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System Health
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System is online
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */

/**
 * @swagger
 * /api/manifest:
 *   post:
 *     summary: Manifest AI Agent
 *     tags: [Core API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [source_agent]
 *             properties:
 *               source_agent:
 *                 type: string
 *                 description: ID or Name of the agent to manifest
 *               overrides:
 *                 type: object
 *                 description: Optional configuration overrides
 *     responses:
 *       200:
 *         description: Agent session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     agentName:
 *                       type: string
 */

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: List Available Agents
 *     tags: [Core API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agent'
 */

/**
 * @swagger
 * /api/agents/{id}:
 *   get:
 *     summary: Get Agent Details
 *     tags: [Core API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Agent'
 *       404:
 *         description: Agent not found
 */

/**
 * @swagger
 * /api/interact:
 *   get:
 *     summary: Interact with an Agent
 *     description: SSE Streaming Endpoint
 *     tags: [Core API]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: message
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream of events
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */

/**
 * @swagger
 * /api/learn:
 *   post:
 *     summary: Ingest New Knowledge
 *     tags: [Core API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *               kbId:
 *                 type: string
 *                 default: "default"
 *               source:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Knowledge ingested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KnowledgeIngestResponse'
 */

/**
 * @swagger
 * /api/knowledge/search:
 *   get:
 *     summary: Search Knowledge Base
 *     tags: [Core API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: kbId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KnowledgeSearchResult'
 */

/**
 * @swagger
 * /api/swarm:
 *   post:
 *     summary: Launch Swarm Intelligence
 *     tags: [Advanced API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [goal]
 *             properties:
 *               goal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Swarm execution result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SwarmResponse'
 */

/**
 * @swagger
 * /api/anchor:
 *   post:
 *     summary: Anchor Data Hash
 *     tags: [Advanced API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hash]
 *             properties:
 *               hash:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Anchoring result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnchorResponse'
 */

/**
 * @swagger
 * /api/zkp/verify:
 *   post:
 *     summary: Verify Zero-Knowledge Proof
 *     tags: [Advanced API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [proof, signals]
 *             properties:
 *               proof:
 *                 type: object
 *               signals:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 valid:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/report/generate:
 *   post:
 *     summary: Generate System Report
 *     tags: [Advanced API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [json, pdf]
 *               scope:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report generated
 */

/**
 * @swagger
 * /api/v1/log-step:
 *   post:
 *     summary: Log Agent Step
 *     tags: [Universal Agent Protocol]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Agent step details
 *     responses:
 *       200:
 *         description: Step logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/v1/task-finish:
 *   post:
 *     summary: Finish Agent Task
 *     tags: [Universal Agent Protocol]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Task result
 *     responses:
 *       200:
 *         description: Task finished
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/v1/project-lock:
 *   post:
 *     summary: Lock Project
 *     tags: [Universal Agent Protocol]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId]
 *             properties:
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/amice/webhook:
 *   post:
 *     summary: Amice Webhook
 *     tags: [Webhooks]
 *     parameters:
 *       - in: header
 *         name: x-amice-signature
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */

/**
 * @swagger
 * /api/esg/metrics:
 *   get:
 *     summary: Get Real-time ESG Metrics
 *     tags: [Other API]
 *     responses:
 *       200:
 *         description: ESG Metrics
 */

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get Global News Intelligence
 *     tags: [Other API]
 *     responses:
 *       200:
 *         description: News items
 */
/**
 * @swagger
 * /api/swarm/mission:
 *   post:
 *     summary: Initiate a Swarm Mission
 *     tags: [Advanced API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal
 *             properties:
 *               goal:
 *                 type: string
 *                 example: "Generate a sustainability report for Q3 and audit it for compliance."
 *     responses:
 *       200:
 *         description: Mission successfully initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "swarm-1700000000000"
 *                 status:
 *                   type: string
 *                   example: "IN_PROGRESS"
 */

/**
 * @swagger
 * /api/swarm/mission/{id}:
 *   get:
 *     summary: Get Swarm Mission Status
 *     tags: [Advanced API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 result:
 *                   type: object
 */
