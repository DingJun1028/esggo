import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/agents/omni-commander', () => ({
  OmniCommander: class {
    command() {
      return Promise.resolve({ success: true, message: 'Mocked result' });
    }
  }
}));
vi.mock('@/lib/agents/adk-swarm', () => ({
  omniSwarm: {}
}));
vi.mock('../stream/route', () => ({
  pushBusEvent: vi.fn()
}));
vi.mock('@/lib/slack/slack-gateway', () => ({
  pushAlert: vi.fn().mockResolvedValue({})
}));
vi.mock('@/lib/slack/telegram-gateway', () => ({
  pushTelegramAlert: vi.fn().mockResolvedValue({})
}));

describe('Schedule API GET (Cron)', () => {
  it('should reject without cron secret', async () => {
    process.env.CRON_SECRET = 'secret';
    (process.env as any).NODE_ENV = 'production';

    const req = new NextRequest('http://localhost/api/omni-agent-api/schedule?mission=SECURITY_SCAN');
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it('should succeed with correct mission and cron secret', async () => {
    process.env.CRON_SECRET = 'secret';
    (process.env as any).NODE_ENV = 'production';

    const req = new NextRequest('http://localhost/api/omni-agent-api/schedule?mission=CODE_QUALITY_REPORT', {
        headers: {
            'Authorization': 'Bearer secret'
        }
    });
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.mission).toBe('CODE_QUALITY_REPORT');
    expect(data.success).toBe(true);
  });

  it('should reject invalid mission', async () => {
    process.env.CRON_SECRET = 'secret';
    (process.env as any).NODE_ENV = 'production';

    const req = new NextRequest('http://localhost/api/omni-agent-api/schedule?mission=INVALID_MISSION', {
        headers: {
            'Authorization': 'Bearer secret'
        }
    });
    const res = await GET(req);

    expect(res.status).toBe(400);
  });
});
