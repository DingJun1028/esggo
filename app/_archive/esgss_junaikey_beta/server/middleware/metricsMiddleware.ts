import { Request, Response, NextFunction } from 'express';
import {
  httpRequestDuration,
  httpRequestTotal,
  httpRequestErrors,
} from '../metrics/prometheus.config.js';

import metricsConfig from '../metrics/prometheus.config.js';

/**
 * Prometheus Metrics Collection Middleware
 * Automatically tracks HTTP request metrics for all routes
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Capture original res.end to measure request duration
  const originalEnd = res.end.bind(res);

  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route?.path || req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Record request duration
    httpRequestDuration.labels(method, route, statusCode).observe(duration);

    // Increment request counter
    httpRequestTotal.labels(method, route, statusCode).inc();

    // Track errors (4xx and 5xx)
    if (res.statusCode >= 400) {
      httpRequestErrors.labels(method, route, res.statusCode.toString()).inc();
    }

    // Call original res.end
    return originalEnd(chunk, encoding, callback) as Response;
  };

  next();
}

/**
 * Metrics Endpoint Handler
 * Exposes Prometheus metrics at /metrics endpoint
 */
export async function metricsHandler(req: Request, res: Response) {
  try {
    res.setHeader('Content-Type', metricsConfig.contentType);
    const metrics = await metricsConfig.metrics();
    res.send(metrics);
  } catch (error) {
    console.error('❌ Failed to generate metrics:', error);
    res.status(500).send('Internal Server Error');
  }
}
