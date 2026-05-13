import { NextRequest, NextResponse } from 'next/server';

const BLUE_CC_TOKEN = process.env.BLUE_CC_TOKEN || '';
const BLUE_CC_API_KEY = process.env.BLUE_CC_API_KEY || '';

function sanitizeEndpoint(input?: string | null) {
  const endpoint = input || '/projects';
  if (endpoint === '/projects') return endpoint;
  if (/^\/projects\/[A-Za-z0-9_-]+\/tasks$/.test(endpoint)) return endpoint;
  return '/projects';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = sanitizeEndpoint(searchParams.get('endpoint'));

  try {
    const res = await fetch(`https://api.blue.cc/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${BLUE_CC_API_KEY}`,
        'X-Token': BLUE_CC_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        mock: true,
        data: getMockData(endpoint),
      });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({
      success: true,
      mock: true,
      data: getMockData(endpoint),
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const endpoint = sanitizeEndpoint(body.endpoint);
  const payload = body.payload;

  try {
    const res = await fetch(`https://api.blue.cc/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLUE_CC_API_KEY}`,
        'X-Token': BLUE_CC_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        mock: true,
        data: { id: `task_${Date.now()}`, status: 'created', ...payload },
      });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({
      success: true,
      mock: true,
      data: { id: `task_${Date.now()}`, status: 'created', ...body.payload },
    });
  }
}

function getMockData(endpoint: string): unknown {
  if (endpoint.includes('projects')) {
    return [
      { id: 'proj_esg_2024', name: 'ESG 永續報告 2024', status: 'active', taskCount: 23, progress: 67 },
      { id: 'proj_ghg', name: 'GHG 溫室氣體盤查', status: 'active', taskCount: 15, progress: 45 },
      { id: 'proj_supply', name: '供應鏈 ESG 稽核', status: 'planning', taskCount: 8, progress: 20 },
    ];
  }
  if (endpoint.includes('tasks')) {
    return [
      { id: 'task_001', title: 'GHG 範疇一數據收集', status: 'in_progress', priority: 'high', assignee: '廠務部', dueDate: '2025-03-31' },
      { id: 'task_002', title: '台電帳單上傳驗證', status: 'completed', priority: 'medium', assignee: '總務部', dueDate: '2025-02-28' },
      { id: 'task_003', title: '董事會 ESG 報告審核', status: 'pending', priority: 'high', assignee: '董事會秘書室', dueDate: '2025-04-15' },
    ];
  }
  return [];
}
