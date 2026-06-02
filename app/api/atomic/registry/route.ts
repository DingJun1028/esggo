export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Supabase 直接連線配置 (零依賴 REST 連線)
const SUPABASE_URL = process.env.EXT_PUBLIC_SUPABASE_URL || 'https://yhwfmavnhaivvgzeuklx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 模擬內存狀態（Fallback 沙盒）
const mockRegistry: any[] = [];

/**
 * 透過 REST 寫入 Supabase (使用 Upsert) 或降級至內存沙盒
 */
async function persistAtomsToSupabase(atoms: any[]) {
  if (SUPABASE_SERVICE_KEY && SUPABASE_URL && !SUPABASE_URL.includes('your-project-id')) {
    try {
      // 轉換成 snake_case
      const dbPayload = atoms.map(atom => ({
        atom_id: atom.atomId,
        type: atom.type,
        version: atom.version,
        status: atom.core?.status || 'Experimental',
        specification: atom.reference?.specification || '',
        intent: atom.reference?.intent || '',
        governance_node: atom.reference?.governanceNode || ''
      }));

      // 使用 Prefer: resolution=merge-duplicates 來達到 Upsert 效果
      const response = await fetch(`${SUPABASE_URL}/rest/v1/omni_atomic_components`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=merge-duplicates'
        },
        body: JSON.stringify(dbPayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Supabase omni_atomic_components API 錯誤，自動降級至內存。錯誤內容:`, errText);
        throw new Error('Supabase request failed');
      }
      return await response.json();
    } catch (e) {
      console.warn(`無法連接至 Supabase omni_atomic_components，自動寫入本地內存陣列。`);
    }
  } else {
    console.warn(`未配置 SUPABASE_SERVICE_ROLE_KEY，自動寫入本地內存陣列。`);
  }

  // 降級處理：存入 Mock 陣列
  atoms.forEach(atom => {
    const existingIdx = mockRegistry.findIndex(m => m.atomId === atom.atomId);
    if (existingIdx >= 0) {
      mockRegistry[existingIdx] = atom;
    } else {
      mockRegistry.push(atom);
    }
  });
  return mockRegistry;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, atoms } = body;

    // 1. 同步元件陣列
    if (action === 'sync') {
      if (!atoms || !Array.isArray(atoms)) {
        return NextResponse.json({ success: false, error: '缺少 atoms 陣列' }, { status: 400 });
      }

      await persistAtomsToSupabase(atoms);
      return NextResponse.json({ success: true, count: atoms.length, persisted: true });
    }

    // 2. 獲取內存 Fallback
    if (action === 'get_registry_fallback') {
      return NextResponse.json({ success: true, registry: mockRegistry });
    }

    return NextResponse.json({ success: false, error: '未知的 action 參數' }, { status: 400 });
  } catch (error: any) {
    console.error('【萬能元件庫】同步 API 處理失敗:', error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (SUPABASE_SERVICE_KEY && SUPABASE_URL && !SUPABASE_URL.includes('your-project-id')) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/omni_atomic_components?select=*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ success: true, registry: data });
      }
    } catch (e) {
      console.warn('Supabase GET failed, falling back to mockRegistry');
    }
  }
  return NextResponse.json({ success: true, registry: mockRegistry });
}
