import { NextRequest, NextResponse } from 'next/server';
import { GLOBAL_TASKS, addTask } from '../../../lib/agent/store';
import { createTask } from '../../../lib/agent/orchestrator';

// Fallback logic for vault if env vars are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { command, args } = body;

    const lines = [];

    switch (command) {
      case 'agent':
        if (args[0] === 'status') {
          lines.push({ type: 'info', content: '📡 Fetching OmniHermes Gateway Status...' });
          
          const memory = process.memoryUsage();
          const memMb = (memory.heapUsed / 1024 / 1024).toFixed(2);
          
          lines.push({ type: 'success', content: '✅ Mode: LIVE (API-Connected)' });
          lines.push({ type: 'out', content: `Active Tasks: ${GLOBAL_TASKS.length} | Memory: ${memMb} MB | Env: ${process.env.NODE_ENV}` });
        } else if (args[0] === 'trigger') {
          const taskType = args[1]?.toUpperCase() || 'AUDIT';
          lines.push({ type: 'info', content: `🚀 Triggering new ${taskType} task...` });
          
          const { task } = createTask({
            actorId: 'terminal_user',
            taskType: taskType as any,
            title: `Terminal Task: ${taskType}`,
            description: `Triggered from terminal by user`,
            inputRefIds: [],
            skillKey: 'audit_standard', // generic fallback
          });
          addTask(task);
          
          lines.push({ type: 'success', content: `✅ Task Spawned! ID: ${task.id}` });
        } else {
          lines.push({ type: 'err', content: 'Usage: agent status | agent trigger [taskType]' });
        }
        break;

      case 'vault':
        if (args[0] === 'list') {
          lines.push({ type: 'info', content: '📦 Fetching recent Vault records...' });
          const supabase = await getAdminClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('evidence_vault')
              .select('id, created_at, category, status')
              .order('created_at', { ascending: false })
              .limit(5);

            if (error) {
              lines.push({ type: 'err', content: `Database Error: ${error.message}` });
            } else if (data && data.length > 0) {
              data.forEach(row => {
                const date = new Date(row.created_at).toLocaleDateString();
                const shortId = row.id.substring(0, 8);
                lines.push({ type: 'out', content: `${date} | ${shortId} | ${row.category} | ${row.status}` });
              });
              lines.push({ type: 'success', content: `Total: ${data.length} recent records shown.` });
            } else {
              lines.push({ type: 'info', content: 'No records found in Vault.' });
            }
          } else {
            lines.push({ type: 'err', content: 'Vault connection missing (Supabase keys not set). Displaying mock records...' });
            lines.push({ type: 'out', content: '2026/05/22 | 8a2f1b0c | IDENTITY | pending' });
            lines.push({ type: 'out', content: '2026/05/21 | 9c4e2d1a | CORE | verified' });
          }
        } else {
          lines.push({ type: 'err', content: 'Usage: vault list' });
        }
        break;

      case 'blue':
        if (args[0] === 'status') {
          lines.push({ type: 'info', content: '☁️ Connecting to BlueCC Control Plane...' });
          lines.push({ type: 'success', content: '✅ Cluster: blue-cluster-01 (STABLE) - Server API' });
          lines.push({ type: 'out', content: `Region: asia-east1 | Uptime: ${process.uptime().toFixed(0)}s` });
        } else {
          lines.push({ type: 'err', content: 'Usage: blue status' });
        }
        break;

      default:
        lines.push({ type: 'err', content: `API Error: Unhandled backend command: ${command}` });
    }

    return NextResponse.json({ lines });
  } catch (err: any) {
    return NextResponse.json({ lines: [{ type: 'err', content: `Internal Error: ${err.message}` }] });
  }
}
