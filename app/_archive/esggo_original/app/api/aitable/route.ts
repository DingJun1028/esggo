/**
 * AITable API Proxy Route
 * ═══════════════════════
 * Server-side API proxy that isolates the AITABLE_API_KEY
 * from the client bundle. All AITable operations flow through here.
 *
 * GET  /api/aitable?action=spaces
 * GET  /api/aitable?action=nodes&spaceId=xxx
 * GET  /api/aitable?action=records&datasheetId=xxx&pageSize=20&pageNum=1
 * GET  /api/aitable?action=fields&datasheetId=xxx
 * GET  /api/aitable?action=views&datasheetId=xxx
 * POST /api/aitable  { action, ...payload }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAITableServerClient } from '@/lib/aitable/client';

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message, timestamp: new Date().toISOString() },
    { status }
  );
}

// ── GET: Read Operations ──────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const client = getAITableServerClient();
    const { searchParams } = req.nextUrl;
    const action = searchParams.get('action');

    switch (action) {
      case 'spaces': {
        const spaces = await client.getSpaces();
        return NextResponse.json({ success: true, data: spaces });
      }

      case 'nodes': {
        const spaceId = searchParams.get('spaceId');
        if (!spaceId) return errorResponse('Missing spaceId');
        const nodes = await client.getNodes(spaceId);
        return NextResponse.json({ success: true, data: nodes });
      }

      case 'records': {
        const datasheetId = searchParams.get('datasheetId');
        if (!datasheetId) return errorResponse('Missing datasheetId');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const pageNum = parseInt(searchParams.get('pageNum') || '1');
        const viewId = searchParams.get('viewId') || undefined;
        const fieldKey = (searchParams.get('fieldKey') as 'id' | 'name') || 'name';
        const records = await client.getRecords(datasheetId, {
          pageSize,
          pageNum,
          viewId,
          fieldKey,
        });
        return NextResponse.json({ success: true, data: records });
      }

      case 'fields': {
        const datasheetId = searchParams.get('datasheetId');
        if (!datasheetId) return errorResponse('Missing datasheetId');
        const fields = await client.getFields(datasheetId);
        return NextResponse.json({ success: true, data: fields });
      }

      case 'views': {
        const datasheetId = searchParams.get('datasheetId');
        if (!datasheetId) return errorResponse('Missing datasheetId');
        const views = await client.getViews(datasheetId);
        return NextResponse.json({ success: true, data: views });
      }

      default:
        return errorResponse(`Unknown action: ${action}. Valid: spaces, nodes, records, fields, views`);
    }
  } catch (err: any) {
    console.error('[AITable API Proxy] GET error:', err);
    return errorResponse(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}

// ── POST: Write Operations ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const client = getAITableServerClient();
    const body = await req.json();
    const { action, ...payload } = body;

    switch (action) {
      case 'createRecords': {
        const { datasheetId, records, fieldKey } = payload;
        if (!datasheetId || !records) return errorResponse('Missing datasheetId or records');
        const result = await client.createRecords(datasheetId, records, fieldKey || 'name');
        return NextResponse.json({ success: true, data: result });
      }

      case 'updateRecords': {
        const { datasheetId, records, fieldKey } = payload;
        if (!datasheetId || !records) return errorResponse('Missing datasheetId or records');
        const result = await client.updateRecords(datasheetId, records, fieldKey || 'name');
        return NextResponse.json({ success: true, data: result });
      }

      case 'deleteRecords': {
        const { datasheetId, recordIds } = payload;
        if (!datasheetId || !recordIds) return errorResponse('Missing datasheetId or recordIds');
        await client.deleteRecords(datasheetId, recordIds);
        return NextResponse.json({ success: true, data: { deleted: recordIds.length } });
      }

      case 'createDatasheet': {
        const { spaceId, name, description, folderId, fields } = payload;
        if (!spaceId || !name || !fields) return errorResponse('Missing spaceId, name, or fields');
        const result = await client.createDatasheet(spaceId, { name, description, folderId, fields });
        return NextResponse.json({ success: true, data: result });
      }

      case 'createField': {
        const { datasheetId, name, type, property } = payload;
        if (!datasheetId || !name || !type) return errorResponse('Missing datasheetId, name, or type');
        const result = await client.createField(datasheetId, { name, type, property });
        return NextResponse.json({ success: true, data: result });
      }

      case 'deleteField': {
        const { datasheetId, fieldId } = payload;
        if (!datasheetId || !fieldId) return errorResponse('Missing datasheetId or fieldId');
        await client.deleteField(datasheetId, fieldId);
        return NextResponse.json({ success: true, data: { deleted: fieldId } });
      }

      case 'createEmbedLink': {
        const { spaceId, nodeId, embedPayload } = payload;
        if (!spaceId || !nodeId) return errorResponse('Missing spaceId or nodeId');
        const result = await client.createEmbedLink(spaceId, nodeId, embedPayload || {});
        return NextResponse.json({ success: true, data: result });
      }

      default:
        return errorResponse(
          `Unknown action: ${action}. Valid: createRecords, updateRecords, deleteRecords, createDatasheet, createField, deleteField, createEmbedLink`
        );
    }
  } catch (err: any) {
    console.error('[AITable API Proxy] POST error:', err);
    return errorResponse(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}
