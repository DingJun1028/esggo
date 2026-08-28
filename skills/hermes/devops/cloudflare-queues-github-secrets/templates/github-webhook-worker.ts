import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

export interface Env extends CloudflareBindings {
  WEBHOOK_SECRET?: string;
  API_TOKEN?: string;
  AUTO_MERGE?: boolean;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) => c.text('ok'));

app.get('/health', (c) => c.json({
  status: 'ok',
  queue: !!c.env.QUEUE,
  webhookConfigured: !!c.env.WEBHOOK_SECRET,
  tokenConfigured: !!c.env.API_TOKEN,
}));

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<Job>, env: Env, ctx: ExecutionContext) {
    for (const msg of batch.messages) {
      try {
        await processMessage(msg.body, env);
      } catch (err) {
        console.error('Queue error:', err);
        msg.retry({ delaySeconds: 30 });
      }
    }
  },
};

interface Job {
  // Define your job structure
}

async function processMessage(job: Job, env: Env) {
  // Process the message
  console.log('Processing:', JSON.stringify(job));
}