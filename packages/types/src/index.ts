import { z } from 'zod';

export * from './AtomicFunction';
export type { OmniComponentHeart } from './AtomicFunction';

/**
 * OmniCoreDataEntity defines the base properties for all data entities
 * in the ESGGO system, ensuring Data Sovereignty as per OmniCore Constitution.
 * Write operations must automatically attach these properties.
 */
export const OmniCoreDataEntitySchema = z.object({
  uuid: z.string().uuid().describe('Unique identifier for the entity.'),
  version: z.number().int().nonnegative().describe('Version number, incremented on each significant update.'),
  createdAt: z.string().datetime().describe('Timestamp of creation (ISO 8601 format).'),
  updatedAt: z.string().datetime().describe('Timestamp of last update (ISO 8601 format).'),
});

export type OmniCoreDataEntity = z.infer<typeof OmniCoreDataEntitySchema>;

/**
 * NCBDBProtocolEntity extends OmniCoreDataEntity, adding specific
 * inscription fields required by the NCBDB_PROTOCOL.md for all data writes.
 */
export const NCBDBProtocolEntitySchema = OmniCoreDataEntitySchema.extend({
  user_email: z.string().email().describe('Email of the user who performed the operation.'),
  integrity_hash: z.string().describe('Hash Lock corresponding to the original Supabase data for immutability verification.'),
});

export type NCBDBProtocolEntity = z.infer<typeof NCBDBProtocolEntitySchema>;

export const SharedUserSchema = OmniCoreDataEntitySchema.extend({
  id: z.string().describe('Keeping existing id for compatibility/primary key notion'),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'auditor']),
});

export type SharedUser = z.infer<typeof SharedUserSchema>;

export const SharedESGReportSchema = NCBDBProtocolEntitySchema.extend({
  reportId: z.string().describe('Keeping existing reportId'),
  companyName: z.string(),
  year: z.number().int(),
  status: z.enum(['draft', 'submitted', 'verified']),
  score: z.number(),
});

export type SharedESGReport = z.infer<typeof SharedESGReportSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
