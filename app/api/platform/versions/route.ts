// @ts-nocheck
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read package.json for version info
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
    
    return NextResponse.json({
      versions: [
        {
          name: 'ESGGO 前端',
          version: pkg.version || '8.5.2-Alpha',
          status: 'current',
          lastUpdated: new Date().toISOString().split('T')[0],
          description: `Next.js + React + Tailwind CSS`,
          icon: 'Package',
          details: {
            'Next.js': '16.2.9',
            'React': '18.3.31',
            'TypeScript': '5.9.3',
            'UI 元件庫': 'v2.0',
          },
        },
        {
          name: 'OmniAgent',
          version: '2.0.0',
          status: 'current',
          lastUpdated: new Date().toISOString().split('T')[0],
          description: 'AI 代理控制台',
          icon: 'Cpu',
          details: {
            '聊天引擎': 'OpenRouter',
            '語音辨識': 'Whisper Large V3',
            '子代理數': '7',
          },
        },
        {
          name: '萬能元鑰',
          version: '2.0.0',
          status: 'beta',
          lastUpdated: new Date().toISOString().split('T')[0],
          description: '統一身份驗證',
          icon: 'Key',
          details: {
            '等級數': '4',
            '能力數': '6',
          },
        },
        {
          name: '5T 協議',
          version: '1.0.0',
          status: 'current',
          lastUpdated: '2026-06-18',
          description: '真善美信通',
          icon: 'Shield',
          details: {
            'Truth': '可感知',
            'Goodness': '可溯源',
            'Beauty': '可追蹤',
            'Trust': '不可篡改',
            'Transferful': '可透明驗算',
          },
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
