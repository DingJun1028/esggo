// ============================================================
// ESGSonar Alerts API — List/create/manage alerts
// app/api/sonnar/alerts/route.ts
// ============================================================

import { NextRequest } from 'next/server';
import { jsonError, jsonResponse } from '@/lib/api-utils';

interface AlertItem {
  id: string;
  sourceId: string;
  sourceName: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  url: string;
  esgPillar: string;
  acknowledged: boolean;
  createdAt: string;
}

// In-memory alert store (replace with Prisma/DB later)
const alertStore: AlertItem[] = [
  {
    id: 'alert_001',
    sourceId: 'tw-fsc',
    sourceName: '金管會',
    alertType: 'new_regulation',
    severity: 'high',
    title: '「永續揭露準則」修正草案公告',
    summary: '金管會公告修正永續揭露準則，新增TCFD要求',
    url: 'https://www.fsc.gov.tw',
    esgPillar: 'environmental',
    acknowledged: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert_002',
    sourceId: 'eu-csrd',
    sourceName: 'EU CSRD',
    alertType: 'policy_change',
    severity: 'medium',
    title: 'CSRD EFRAG 新版指引發布',
    summary: 'ESRS 產業特定指引更新，影響台灣對歐供應鏈',
    url: 'https://finance.ec.europa.eu',
    esgPillar: 'environmental',
    acknowledged: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert_003',
    sourceId: 'tw-moenv',
    sourceName: '環境部',
    alertType: 'amended',
    severity: 'critical',
    title: '「氣候變遷因應法」子法修正',
    summary: '環境部公告修正碳費徵收標準，企業需注意時程',
    url: 'https://www.moenv.gov.tw',
    esgPillar: 'environmental',
    acknowledged: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// GET /api/sonnar/alerts — List alerts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity');
  const acknowledged = searchParams.get('acknowledged');
  const sourceId = searchParams.get('sourceId');
  const limit = parseInt(searchParams.get('limit') || '50');

  let filtered = [...alertStore];

  if (severity) filtered = filtered.filter(a => a.severity === severity);
  if (acknowledged !== null) {
    const ack = acknowledged === 'true';
    filtered = filtered.filter(a => a.acknowledged === ack);
  }
  if (sourceId) filtered = filtered.filter(a => a.sourceId === sourceId);

  return jsonResponse({
    total: filtered.length,
    alerts: filtered.slice(0, limit),
    stats: {
      critical: alertStore.filter(a => a.severity === 'critical' && !a.acknowledged).length,
      high: alertStore.filter(a => a.severity === 'high' && !a.acknowledged).length,
      medium: alertStore.filter(a => a.severity === 'medium' && !a.acknowledged).length,
      low: alertStore.filter(a => a.severity === 'low' && !a.acknowledged).length,
    },
  });
}

// POST /api/sonnar/alerts — Acknowledge an alert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alertId, action } = body;

    if (action === 'acknowledge' && alertId) {
      const alert = alertStore.find(a => a.id === alertId);
      if (!alert) {
        return jsonError('ALERT_NOT_FOUND');
      }
      alert.acknowledged = true;
      return jsonResponse({ alertId, acknowledged: true });
    }

    return jsonError('INVALID_ACTION', 'Invalid action');
  } catch {
    return jsonError('INTERNAL_ERROR', 'Server error');
  }
}
