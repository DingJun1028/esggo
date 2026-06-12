// lib/stitch-client.ts
import { StitchToolClient } from '@google/stitch-sdk';

const projectId = process.env.STITCH_PROJECT_ID;

if (!projectId) {
  throw new Error('STITCH_PROJECT_ID environment variable is not set.');
}

export const stitchClient = new StitchToolClient({ projectId });

// You can further configure and export specific Stitch services here if needed.
// For example:
// export const stitchScreens = stitchClient.screens();
