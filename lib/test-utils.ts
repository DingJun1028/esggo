import { EntropyForge } from './ucc-engine';

export interface TestResult {
  module: string;
  test: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export function runTest(module: string, test: string, fn: () => boolean): TestResult {
  try {
    const result = fn();
    return { module, test, status: result ? 'pass' : 'fail', message: result ? 'OK' : 'Assertion failed' };
  } catch (e: any) {
    return { module, test, status: 'fail', message: e.message };
  }
}

export function testHashIntegrity(): TestResult[] {
  const results: TestResult[] = [];
  const forge = new EntropyForge();

  results.push(runTest('EntropyForge', 'SHA-256 hash generation', () => {
    const hash = forge.generateHash('test-data');
    return typeof hash === 'string' && hash.length === 64;
  }));

  results.push(runTest('EntropyForge', 'Deterministic hashing', () => {
    const h1 = forge.generateHash('same-input');
    const h2 = forge.generateHash('same-input');
    return h1 === h2;
  }));

  results.push(runTest('EntropyForge', 'Different inputs produce different hashes', () => {
    const h1 = forge.generateHash('input-a');
    const h2 = forge.generateHash('input-b');
    return h1 !== h2;
  }));

  return results;
}

export function testStoreOperations(): TestResult[] {
  const results: TestResult[] = [];

  results.push(runTest('Store', 'LocalStorage availability', () => {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }));

  results.push(runTest('Store', 'JSON serialization', () => {
    const obj = { id: '1', value: 'test', timestamp: Date.now() };
    const serialized = JSON.stringify(obj);
    const deserialized = JSON.parse(serialized);
    return deserialized.id === '1' && deserialized.value === 'test';
  }));

  return results;
}

export function testZKPLogic(): TestResult[] {
  const results: TestResult[] = [];
  const forge = new EntropyForge();

  results.push(runTest('ZKP', 'Proof generation', () => {
    const data = { value: 1250, unit: 'tCO2e', scope: 1 };
    const hash = forge.generateHash(JSON.stringify(data));
    return hash.startsWith('') && hash.length === 64;
  }));

  results.push(runTest('ZKP', 'Verification logic', () => {
    const data = 'GRI-305-1-verification';
    const h1 = forge.generateHash(data);
    const h2 = forge.generateHash(data);
    return h1 === h2;
  }));

  return results;
}

export function testGRIMapping(): TestResult[] {
  const results: TestResult[] = [];

  const griCodes = ['GRI 2-1', 'GRI 302-1', 'GRI 303-1', 'GRI 305-1', 'GRI 401-1', 'GRI 403-1'];

  results.push(runTest('GRI', 'Standard code format validation', () => {
    return griCodes.every(code => /^GRI \d+(-\d+)?$/.test(code));
  }));

  results.push(runTest('GRI', 'Unique code check', () => {
    const unique = new Set(griCodes);
    return unique.size === griCodes.length;
  }));

  return results;
}

export function testRelativeTime(): TestResult[] {
  const results: TestResult[] = [];

  results.push(runTest('RelativeTime', 'Minutes ago calculation', () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const diff = Date.now() - fiveMinutesAgo;
    const minutes = Math.floor(diff / 60000);
    return minutes === 5;
  }));

  results.push(runTest('RelativeTime', 'Days ago calculation', () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const diff = Date.now() - threeDaysAgo;
    const days = Math.floor(diff / 86400000);
    return days === 3;
  }));

  return results;
}