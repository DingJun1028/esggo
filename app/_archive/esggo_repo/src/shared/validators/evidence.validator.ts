import { z } from 'zod';
import { 
  EvidenceStatus, 
  IntegrityStatus 
} from '../types/evidence.types';

export const EvidenceMetadataSchema = z.object({
  file_size: z.number().optional(),
  file_name: z.string().optional(),
  mime_type: z.string().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  duration: z.number().optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  device_info: z.object({
    user_agent: z.string(),
    ip_address: z.string().optional(),
  }).optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

export const CreateEvidenceDTOSchema = z.object({
  tag: z.string().min(1).max(200),
  content: z.string().min(1).max(10 * 1024 * 1024),
  content_type: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
  metadata: EvidenceMetadataSchema.optional(),
  expires_in_days: z.number().min(1).max(3650).optional(),
  auto_seal: z.boolean().default(false),
});

export const UpdateEvidenceDTOSchema = z.object({
  tag: z.string().min(1).max(200).optional(),
  metadata: EvidenceMetadataSchema.partial().optional(),
  status: z.nativeEnum(EvidenceStatus).optional(),
});

export const EvidenceQueryParamsSchema = z.object({
  user_id: z.string().uuid().optional(),
  status: z.union([
    z.nativeEnum(EvidenceStatus),
    z.array(z.nativeEnum(EvidenceStatus)),
  ]).optional(),
  integrity_status: z.nativeEnum(IntegrityStatus).optional(),
  created_after: z.coerce.date().optional(),
  created_before: z.coerce.date().optional(),
  tag_contains: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort_by: z.enum(['created_at', 'updated_at', 'tag']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});
