// ============================================================
// OmniDB secondary Prisma client (MySQL) — lightweight stub
// ============================================================
import { PrismaClient } from '@prisma/client';

let initialized = false;

function createOmniClient() {
  // Create a separate PrismaClient bound to the `omni` datasource in schema.prisma.
  // Use OMNI_DATABASE_URL if provided.
  return new PrismaClient({
    datasources: {
      omni: {
        url: process.env.OMNI_DATABASE_URL || process.env.DATABASE_URL || '',
      },
    },
  });
}

let _omniPrisma: PrismaClient | null = null;

export function getOmniPrisma(): PrismaClient {
  if (!_omniPrisma) {
    _omniPrisma = createOmniClient();
  }
  return _omniPrisma;
}

export async function withOmni<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T> {
  if (!initialized) {
    const client = getOmniPrisma();
    await client.$connect();
    initialized = true;
    return fn(client);
  }
  return fn(getOmniPrisma());
}
