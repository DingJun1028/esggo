import express, { Request, Response } from 'express';
import os from 'os';

const router = express.Router();

// System health data
let systemMetrics = {
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  cpu: process.cpuUsage(),
  platform: os.platform(),
  arch: os.arch(),
  nodeVersion: process.version,
  lastUpdated: new Date().toISOString(),
};

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  version: string;
}

// Helper functions
function calculateHealthScore(metrics: any) {
  let score = 100;

  // Memory usage impact
  const memoryUsagePercent = (metrics.memory.heapUsed / metrics.memory.heapTotal) * 100;
  if (memoryUsagePercent > 90) score -= 30;
  else if (memoryUsagePercent > 80) score -= 15;
  else if (memoryUsagePercent > 70) score -= 5;

  // CPU usage impact (simplified)
  const cpuUsagePercent = (metrics.cpu.user + metrics.cpu.system) / 1000000; // rough estimate
  if (cpuUsagePercent > 80) score -= 20;
  else if (cpuUsagePercent > 60) score -= 10;

  // Uptime bonus
  if (metrics.uptime > 86400) score += 5; // 24+ hours

  return Math.max(0, Math.min(100, score));
}

async function getServiceStatus(): Promise<ServiceStatus[]> {
  // Mock service status (in production, check actual services)
  return [
    { name: 'api-gateway', status: 'healthy', uptime: 86400, version: '1.0.0' },
    { name: 'auth-service', status: 'healthy', uptime: 86400, version: '1.0.0' },
    { name: 'esg-service', status: 'healthy', uptime: 86400, version: '1.0.0' },
    { name: 'ai-service', status: 'healthy', uptime: 86400, version: '1.0.0' },
    { name: 'learning-service', status: 'healthy', uptime: 86400, version: '1.0.0' },
    { name: 'analytics-service', status: 'warning', uptime: 86000, version: '1.0.0' },
    { name: 'database', status: 'healthy', uptime: 86400, version: '15.0' },
    { name: 'cache', status: 'healthy', uptime: 86400, version: '7.0' },
  ];
}

async function getPerformanceMetrics() {
  // Mock performance metrics
  return {
    responseTime: {
      average: 245, // ms
      p95: 520,
      p99: 890,
    },
    throughput: {
      requestsPerSecond: 1250,
      requestsPerMinute: 75000,
    },
    errorRate: {
      totalErrors: 23,
      errorRatePercent: 0.18,
    },
    resourceUsage: {
      cpuPercent: 45.2,
      memoryPercent: 67.8,
      diskUsagePercent: 34.1,
    },
    bottlenecks: [
      { component: 'ai-service', issue: 'High latency during peak hours' },
      { component: 'database', issue: 'Query optimization needed' },
    ],
  };
}

async function getLogs(service: any, level: any, limit: number, startTime: any, endTime: any) {
  // Mock logs (in production, retrieve from logging system)
  const mockLogs = [
    {
      timestamp: new Date(Date.now() - 1000).toISOString(),
      level: 'info',
      service: 'api-gateway',
      message: 'Request processed successfully',
      requestId: 'req-123',
    },
    {
      timestamp: new Date(Date.now() - 2000).toISOString(),
      level: 'warning',
      service: 'ai-service',
      message: 'High latency detected',
      requestId: 'req-124',
    },
    {
      timestamp: new Date(Date.now() - 3000).toISOString(),
      level: 'error',
      service: 'database',
      message: 'Connection timeout',
      requestId: 'req-125',
    },
  ];

  let filteredLogs = mockLogs;

  if (service) {
    filteredLogs = filteredLogs.filter(log => log.service === service);
  }

  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }

  return filteredLogs.slice(0, limit);
}

async function createAlert(type: any, severity: any, message: any, service: any, metadata: any) {
  const alert = {
    id: `alert-${Date.now()}`,
    type,
    severity,
    message,
    service,
    metadata,
    status: 'active',
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };
  return alert;
}

async function getAlerts(status: any, severity: any, limit: number) {
  // Mock alerts
  const mockAlerts = [
    {
      id: 'alert-001',
      type: 'performance',
      severity: 'warning',
      message: 'AI service response time above threshold',
      service: 'ai-service',
      status: 'active',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: false,
    },
    {
      id: 'alert-002',
      type: 'system',
      severity: 'info',
      message: 'Scheduled maintenance completed',
      service: 'database',
      status: 'resolved',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      acknowledged: true,
    },
  ];

  let filteredAlerts = mockAlerts;

  if (status) {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
  }

  if (severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
  }

  return filteredAlerts.slice(0, limit);
}

async function getDetailedMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemoryPercent = ((totalMemory - freeMemory) / totalMemory) * 100;

  const loadAverage = os.loadavg();

  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory,
      freeMemory,
      usedMemoryPercent: usedMemoryPercent.toFixed(2),
      loadAverage,
      uptime: os.uptime(),
    },
    application: {
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
    services: await getServiceStatus(),
    performance: await getPerformanceMetrics(),
  };
}

// Get system health status
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Update metrics
    systemMetrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      lastUpdated: new Date().toISOString(),
    };

    // Calculate health score
    const healthScore = calculateHealthScore(systemMetrics);

    return res.json({
      success: true,
      data: {
        status: healthScore > 80 ? 'healthy' : healthScore > 60 ? 'warning' : 'critical',
        score: healthScore,
        metrics: systemMetrics,
        services: await getServiceStatus(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

// Get detailed system metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const detailedMetrics = await getDetailedMetrics();

    return res.json({
      success: true,
      data: {
        system: detailedMetrics.system,
        application: detailedMetrics.application,
        services: detailedMetrics.services,
        performance: detailedMetrics.performance,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve metrics',
    });
  }
});

// Get service status
router.get('/services', async (req: Request, res: Response) => {
  try {
    const services = await getServiceStatus();

    return res.json({
      success: true,
      data: {
        services,
        summary: {
          total: services.length,
          healthy: services.filter(s => s.status === 'healthy').length,
          warning: services.filter(s => s.status === 'warning').length,
          critical: services.filter(s => s.status === 'critical').length,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve service status',
    });
  }
});

// Get performance metrics
router.get('/performance', async (req: Request, res: Response) => {
  try {
    const performance = await getPerformanceMetrics();

    return res.json({
      success: true,
      data: {
        responseTime: performance.responseTime,
        throughput: performance.throughput,
        errorRate: performance.errorRate,
        resourceUsage: performance.resourceUsage,
        bottlenecks: performance.bottlenecks,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get performance error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve performance metrics',
    });
  }
});

// Get logs
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const { service, level = 'info', limit = 100, startTime, endTime } = req.query;

    const logs = await getLogs(service, level, parseInt(limit as string), startTime, endTime);

    return res.json({
      success: true,
      data: {
        logs,
        filters: { service, level, limit, startTime, endTime },
        count: logs.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve logs',
    });
  }
});

// Create alert/incident
router.post('/alerts', async (req: Request, res: Response) => {
  try {
    const { type, severity, message, service, metadata } = req.body;

    if (!type || !severity || !message) {
      return res.status(400).json({
        success: false,
        error: 'Type, severity, and message are required',
      });
    }

    const alert = await createAlert(type, severity, message, service, metadata);

    return res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error('Create alert error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create alert',
    });
  }
});

// Get alerts history
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const { status, severity, limit = 50 } = req.query;

    const alerts = await getAlerts(status, severity, parseInt(limit as string));

    return res.json({
      success: true,
      data: {
        alerts,
        filters: { status, severity, limit },
        count: alerts.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve alerts',
    });
  }
});

export default router;
