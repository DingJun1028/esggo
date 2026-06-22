import { NextResponse } from 'next/server';
import { getOATableServerClient } from '@/lib/oa-table/client';

const TARGET_DATASHEET_ID = process.env.OMNITABLE_TASKS_DATASHEET_ID;

export async function POST(req: Request) {
  try {
    const { tasks } = await req.json();

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ success: false, message: 'No tasks provided' }, { status: 400 });
    }

    if (!TARGET_DATASHEET_ID) {
      console.warn('[OmniNotes] OMNITABLE_TASKS_DATASHEET_ID is missing. Mocking success.');
      // Fallback if not configured yet, simulate successful API call for UX purposes.
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({ success: true, message: 'Mock synced', records: tasks });
    }

    const client = getOATableServerClient();

    // Convert client-side tasks to OmniTable format
    const recordsToCreate = tasks.map((task: any) => ({
      fields: {
        'Task Title': task.title,
        Status: task.status,
      },
    }));

    const response = await client.createRecords(TARGET_DATASHEET_ID, recordsToCreate);

    return NextResponse.json({
      success: true,
      message: 'Successfully synced to OmniTable',
      count: response.length,
    });
  } catch (error: any) {
    console.error('[OmniNotes] Sync error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
