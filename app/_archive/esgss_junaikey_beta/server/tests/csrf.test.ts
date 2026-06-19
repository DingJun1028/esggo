import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import {
    csrfProtection,
    csrfTokenHandler,
    csrfErrorHandler,
    csrfProtectionWithWhitelist,
} from '../middleware/csrfProtection.js';

describe('CSRF Protection Middleware', () => {
    let app: Express;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use(csrfProtectionWithWhitelist);

        // Test routes
        app.get('/api/csrf-token', csrfTokenHandler);

        app.post('/api/test', (req, res) => {
            res.json({ success: true });
        });

        app.get('/api/safe', (req, res) => {
            res.json({ message: 'Safe endpoint' });
        });

        // Error handler must be last
        app.use(csrfErrorHandler);
    });

    it('should return CSRF token from /api/csrf-token endpoint', async () => {
        const response = await request(app).get('/api/csrf-token');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('csrfToken');
        expect(response.body).toHaveProperty('expiresIn');
        expect(typeof response.body.csrfToken).toBe('string');
    });

    it('should allow GET requests without CSRF token', async () => {
        const response = await request(app).get('/api/safe');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    it('should reject POST requests without valid CSRF token', async () => {
        const response = await request(app)
            .post('/api/test')
            .send({ data: 'test' });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Invalid CSRF token');
    });

    it('should accept POST requests with valid CSRF token', async () => {
        // First get a token
        const tokenResponse = await request(app).get('/api/csrf-token');
        const token = tokenResponse.body.csrfToken;
        const cookies = tokenResponse.headers['set-cookie'];

        // Then make a POST request with the token
        const response = await request(app)
            .post('/api/test')
            .set('Cookie', cookies)
            .set('CSRF-Token', token)
            .send({ data: 'test' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
    });
});
