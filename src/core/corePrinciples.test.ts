import { Principle, Principles, getPrincipleDescription, clampFactor, validateCorePresence } from './CorePrinciples';

// Test Principle enum
console.log('Principle:', Principle.Truth);

// Test description
console.log('Truth description:', getPrincipleDescription(Principle.Truth));

// Test clamp
console.log('clampFactor(0.5):', clampFactor(0.5));
console.log('clampFactor(1.5):', clampFactor(1.5));

// Test validation
const validCore = { uuid: 'test-123', hash_lock: 'LOCK-test' };
console.log('validateCorePresence(validCore):', validateCorePresence(validCore));
console.log('validateCorePresence({}):', validateCorePresence({}));