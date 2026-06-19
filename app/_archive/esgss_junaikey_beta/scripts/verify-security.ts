import {
  securityService,
  KeyType,
  EncryptionAlgorithm,
  DataSensitivityLevel,
} from '../src/services/securityService';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

// Mock sessionStorage if running in Node environment without it
if (typeof sessionStorage === 'undefined') {
  (global as any).sessionStorage = {
    store: {} as Record<string, string>,
    getItem: function (key: string) {
      return this.store[key] || null;
    },
    setItem: function (key: string, value: string) {
      this.store[key] = value;
    },
    removeItem: function (key: string) {
      delete this.store[key];
    },
    clear: function () {
      this.store = {};
    },
  };
}

// Mock crypto if undefined (partial mock for test flow)
if (typeof crypto === 'undefined') {
  (global as any).crypto = {
    getRandomValues: (arr: Uint8Array) => arr,
    subtle: {
      generateKey: async () => ({ type: 'secret' }) as any,
      exportKey: async () => new Uint8Array([1, 2, 3]).buffer,
      encrypt: async () => new Uint8Array([4, 5, 6]).buffer,
      decrypt: async () => new Uint8Array([7, 8, 9]).buffer,
    },
  };
}

async function verifySecurity() {
  console.log('Starting verification of SecurityService Hardening...');

  // 1. Initialize & Generate Key
  console.log('\n--- Generating Test Key ---');
  const keyResult = await securityService.generateKey(
    KeyType.SYMMETRIC,
    EncryptionAlgorithm.AES_256_GCM,
    'Test Cleanup Key',
    'tester',
    DataSensitivityLevel.INTERNAL
  );

  if (!keyResult.success || !keyResult.data) {
    console.error('Failed to generate key:', keyResult.error);
    return;
  }

  const keyId = keyResult.data.id;
  console.log(`Key Generated: ${keyId}`);

  // Verify key material in storage
  const storedKey = sessionStorage.getItem(`key_${keyId}`);
  if (storedKey) {
    console.log('SUCCESS: Key material found in sessionStorage.');
  } else {
    console.error('FAILURE: Key material NOT found in sessionStorage.');
  }

  // 2. Destroy Service
  console.log('\n--- Destroying SecurityService ---');
  securityService.destroy();

  // 3. Verify Cleanup
  const storedKeyAfter = sessionStorage.getItem(`key_${keyId}`);
  if (!storedKeyAfter) {
    console.log('SUCCESS: Key material removed from sessionStorage after destroy.');
  } else {
    console.error('FAILURE: Key material STILL PRESENT in sessionStorage after destroy.');
  }

  // Verify internal state (indirectly via stats or just trusting the clear calls logs)
  // We can try to retrieve the key info using private access if we really wanted, but let's rely on public behavior.
  // Actually, we can check getSecurityStats()
  const stats = securityService.getSecurityStats();
  if (stats.totalKeys === 0 && stats.totalSecureItems === 0) {
    console.log('SUCCESS: Internal state cleared (Total Keys: 0).');
  } else {
    console.error('FAILURE: Internal state not cleared.', stats);
  }

  console.log('\n--- Verification Complete ---');
}

verifySecurity().catch(console.error);
