// ============================================================
// AI 筆記 API - GET (單一) / PUT (更新) / DELETE (刪除)
// ============================================================

import { NextRequest } from 'next/server';
import { jsonResponse, jsonError, validateParams } from '@/lib/api-utils';
import { getNCBClient } from '@/lib/ncb-client';
import type { UpdateNoteInput } from '@/types/notes';

// GET /api/ai-notes/[id] - 取得單一筆記
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return jsonError('INVALID_PARAMS', 'Note ID is required', 400);
    }

    const ncb = getNCBClient();
    const note = await ncb.getNoteWithTags(id);

    return jsonResponse(note);
  } catch (error) {
    console.error('Error fetching AI note:', error);
    return jsonError('INTERNAL_ERROR', 'Failed to fetch AI note', 500);
  }
}

// PUT /api/ai-notes/[id] - 更新筆記
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, type, category, summary, tags } = body;

    if (!id) {
      return jsonError('INVALID_PARAMS', 'Note ID is required', 400);
    }

    // 驗證更新資料
    const validation = validateParams({ title, content });

    if (!validation.valid) {
      return jsonError('INVALID_PARAMS', validation.missing ? `Missing required field: ${validation.missing}` : 'Invalid params', 400);
    }

    const ncb = getNCBClient();

    // 更新筆記
    const updateInput: UpdateNoteInput = {};
    if (title) updateInput.title = title;
    if (content) updateInput.content = content;
    if (type) updateInput.type = type;
    if (category !== undefined) updateInput.category = category;
    if (summary !== undefined) updateInput.summary = summary;

    const _note = await ncb.updateNote(id, updateInput);

    // 如果有標籤，更新關聯
    if (tags) {
      // 取得現有標籤
      const existingTags = await ncb.getNoteTags(id);
      const existingTagNames = existingTags.map(t => t.name);

      // 刪除不需要的標籤
      for (const tag of existingTags) {
        if (!tags.includes(tag.name)) {
          await ncb.removeNoteTag(id, tag.id);
        }
      }

      // 新增需要的標籤
      for (const tagName of tags) {
        if (!existingTagNames.includes(tagName)) {
          let tag;
          try {
            const allTags = await ncb.getTags();
            tag = allTags.find(t => t.name === tagName);
          } catch {
            // 忽略錯誤
          }

          if (!tag) {
            tag = await ncb.createTag({ name: tagName });
          }

          await ncb.addNoteTag(id, tag.id);
        }
      }
    }

    // 取得完整筆記（含標籤）
    const noteWithTags = await ncb.getNoteWithTags(id);

    return jsonResponse(noteWithTags);
  } catch (error) {
    console.error('Error updating AI note:', error);
    return jsonError('INTERNAL_ERROR', 'Failed to update AI note', 500);
  }
}

// DELETE /api/ai-notes/[id] - 刪除筆記（軟刪除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return jsonError('INVALID_PARAMS', 'Note ID is required', 400);
    }

    const ncb = getNCBClient();
    await ncb.deleteNote(id);

    return jsonResponse({ message: 'AI note deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI note:', error);
    return jsonError('INTERNAL_ERROR', 'Failed to delete AI note', 500);
  }
}
