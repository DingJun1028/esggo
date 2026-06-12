// pages/api/omni-core/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { omniCoreService } from '../../../src/server/services/omniCore.service';
import { supabaseAdmin } from '../../../src/server/lib/supabaseAdmin';
import { z } from 'zod';

// Request body validation schema
const OmniCorePostSchema = z.object({
  version: z.string(),
  matrix: z.record(z.any()).optional(),
  crystal: z.record(z.any()).optional(),
  eternalMemory: z.record(z.any()).optional(),
});

/**
 * Handler for GET and POST requests on /api/omni-core/[id]
 * GET: Returns the OmniCore record for the given component ID.
 * POST: Creates or updates the OmniCore record (upsert).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const componentId = Array.isArray(id) ? id[0] : id;

  if (!componentId) {
    res.status(400).json({ error: 'Missing component ID in URL' });
    return;
  }

  try {
    if (req.method === 'GET') {
      // Use admin client for direct DB read (bypass RLS)
      const { data, error } = await supabaseAdmin
        .from('omni_core')
        .select('*')
        .eq('componentId', componentId)
        .single();
      if (error) {
        if ((error as any).code === 'PGRST116') {
          res.status(404).json({ error: 'Record not found' });
        } else {
          console.error('Supabase error (GET)', error);
          res.status(500).json({ error: 'Database error' });
        }
        return;
      }
      res.status(200).json({ record: data });
    } else if (req.method === 'POST') {
      // Validate request body
      const parseResult = OmniCorePostSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ error: 'Invalid request payload', details: parseResult.error.errors });
        return;
      }
      const { version, matrix = {}, crystal = {}, eternalMemory = {} } = parseResult.data;

      // Upsert using service which now relies on admin client internally
      const updated = await omniCoreService.upsertCore(
        componentId,
        version,
        matrix,
        crystal,
        eternalMemory
      );
      res.status(200).json({ record: updated });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('OmniCore API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
