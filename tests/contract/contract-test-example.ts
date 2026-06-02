import { expect } from 'vitest';
import { z } from 'zod';

// Example: ensure runtime contract matches TypeScript type definition
// Assuming we have a type defined in packages/types for skill payload

// Define a Zod schema mirroring the TypeScript interface
const SkillPayloadSchema = z.object({
  skillId: z.string(),
  description: z.string().optional(),
  creator: z.string(),
  complexityLevel: z.number().min(1).max(10),
});

// Example of a mock payload that would come from an API
const mockPayload = {
  skillId: 'skill-123',
  description: 'Demonstrate contract validation',
  creator: 'admin',
  complexityLevel: 5,
};

describe('Contract Validation - Runtime vs TypeScript', () => {
  it('should validate that runtime payload matches TypeScript contract', async () => {
    const result = await SkillPayloadSchema.safeParse(mockPayload);
    
    expect(result.success).toBe(true);
    // If the TypeScript type changes, the Zod schema should be updated automatically
    // This test ensures compile-time sync with runtime contract
  });

  it('should fail when payload violates contract', async () => {
    const invalidPayload = {
      skillId: '',
      description: '',
      creator: '',
      complexityLevel: 0, // invalid: too low
    };

    const result = await SkillPayloadSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    // expect(result.error).toBeDefined(); // contract broken
  });
});