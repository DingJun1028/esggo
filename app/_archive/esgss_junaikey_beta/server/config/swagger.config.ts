import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JunAiKey Server API - v10.0-Omni',
            version: '10.0.0-Omni',
            description: 'API for the ESGss JunAiKey Beta (JunAiKey Server). Provides endpoints for managing ESG metrics, AI agents, knowledge base, swarm intelligence, and more, in compliance with the Omni Agent Protocol (4+1).',
            contact: {
                name: 'API Support',
                email: 'dev@esgss.example.com',
            },
        },
        servers: [
            {
                url: 'https://esg-dashboard-c3ytffo5qq-de.a.run.app',
                description: 'Production Server',
            },
            {
                url: 'http://localhost:5005',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string' },
                                message: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./server.ts', './routes/*.ts', './swagger_definitions.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
