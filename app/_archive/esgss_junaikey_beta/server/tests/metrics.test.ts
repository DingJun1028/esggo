import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { metricsMiddleware, metricsHandler } from '../middleware/metricsMiddleware.js';
import register from '../metrics/prometheus.config.js';

describe('Prometheus Metrics Integration', () => {
    let app: Express;

    beforeEach(async () => {
        // Clear metrics before each test
        register.resetMetrics();

        // Create test app
        app = express();
        app.use(metricsMiddleware);

        // Test routes
        app.get('/test', (req, res) => {
            res.status(200).json({ message: 'OK' });
        });

        app.get('/test-error', (req, res) => {
            res.status(500).json({ error: 'Internal Server Error' });
        });

        app.get('/metrics', metricsHandler);
    });

    it('should track HTTP request metrics', async () => {
        // Make a test request
        await request(app).get('/test').expect(200);

        // Get metrics
        const metrics = await request(app).get('/metrics');

        expect(metrics.status).toBe(200);
        expect(metrics.text).toContain('infoone_http_requests_total');
        expect(metrics.text).toContain('infoone_http_request_duration_seconds');
    });

    it('should track error requests separately', async () => {
        // Make an error request
        await request(app).get('/test-error').expect(500);

        // Get metrics
        const metrics = await request(app).get('/metrics');

        expect(metrics.text).toContain('infoone_http_request_errors_total');
        expect(metrics.text).toContain('status_code="500"');
    });

    it('should expose metrics endpoint', async () => {
        const response = await request(app).get('/metrics');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('text/plain');
    });
});
