import { z } from 'zod';

export * from './core.types.ts';
export * from './evidence.types.ts';
export * from './api.types.ts';
export * from './ucc.types.ts';
export * from './audit.types.ts';
export * from './matrix.types.ts';
export * from './omni-card.types.ts';
export * from './protocol.types.ts';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export const AuthUserSchema = z.object({
  uid: z.string(),
  email: z.string().nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().nullable(),
  emailVerified: z.boolean(),
});
