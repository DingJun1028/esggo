import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all ESG tasks
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not initialized' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('esg_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist yet, return a graceful error
      console.warn('Supabase fetch error for esg_tasks:', error.message);
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
    }

    // Convert snake_case to camelCase for the frontend
    const formattedData = data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      hashLock: task.hash_lock
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error('API /tasks GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new ESG task
export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not initialized' }, { status: 500 });
    }

    const body = await req.json();
    const { title, description, assignee, priority, status, dueDate } = body;

    const { data, error } = await supabase
      .from('esg_tasks')
      .insert([
        {
          title,
          description,
          assignee,
          priority: priority || 'Medium',
          status: status || 'Todo',
          due_date: dueDate
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API /tasks POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
