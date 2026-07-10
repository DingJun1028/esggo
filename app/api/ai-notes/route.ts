// ============================================================
// AI 筆記 API - GET (列表) / POST (建立)
// ============================================================

import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, validateParams } from '@/lib/api-utils';
import { getNCBClient } from '@/lib/ncb-client';
import type { CreateNoteInput } from '@/types/notes';

// GET /api/ai-notes - 取得筆記列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 驗證參數
    const validation = validateParams(
      { userId, page, limit },
      {
        userId: { required: true, type: 'string' },
        page: { type: 'number', min: 1 },
        limit: { type: 'number', min: 1, max: 100 },
      }
    );

    if (!validation.valid) {
      return jsonError(validation.errors!.join(', '), 400);
    }

    const ncb = getNCBClient();
    const result = await ncb.getNotes({
      user_id: userId!,
      category: category || undefined,
      page,
      limit,
    });

    return jsonResponse(result);
  } catch (error) {
    console.error('Error fetching AI notes:', error);
    return jsonError('Failed to fetch AI notes', 500);
  }
}

// POST /api/ai-notes - 建立新筆記
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, content, type, category, source, tags } = body;

    // 驗證必要欄位
    const validation = validateParams(
      { user_id, title, content },
      {
        user_id: { required: true, type: 'string' },
        title: { required: true, type: 'string', minLength: 1, maxLength: 255 },
        content: { required: true, type: 'string', minLength: 1 },
      }
    );

    if (!validation.valid) {
      return jsonError(validation.errors!.join(', '), 400);
    }

    const ncb = getNCBClient();

    // 建立筆記
    const note = await ncb.createNote({
      user_id,
      title,
      content,
      type: type || 'text',
      category,
      source: source || 'manual',
    });

    // 如果有標籤，建立關聯
    if (tags?.length) {
      for (const tagName of tags) {
        // 確保標籤存在
        let tag;
        try {
          const existingTags = await ncb.getTags();
          tag = existingTags.find(t => t.name === tagName);
        } catch {
          // 忽略錯誤
        }

        if (!tag) {
          tag = await ncb.createTag({ name: tagName });
        }

        await ncb.addNoteTag(note.id, tag.id);
      }
    }

    // 取得完整筆記（含標籤）
    const noteWithTags = await ncb.getNoteWithTags(note.id);

    return jsonResponse(noteWithTags, 201);
  } catch (error) {
    console.error('Error creating AI note:', error);
    return jsonError('Failed to create AI note', 500);
  }
}
