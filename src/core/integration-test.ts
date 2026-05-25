// ESG GO v9.0.0 - Global Integration Test
import { EvidenceService, ContractService, GlobalStateManager } from './GlobalIntegration';
import { T5Validator } from './T5Protocol';

async function main() {
  console.log('=== ESG GO v9.0.0 Global Integration ===\n');
  
  // 1. Test 5T Validation
  console.log('1. Testing 5T Validation...');
  const testEvidence = {
    uuid: 'test-uuid-123',
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: [
      {
        id: 'ev-1',
        source_origin: 'contract-123',
        iso_standard_ref: 'ISO-14064-1',
        hash_value: 'SHA256-test',
        lifecycle_path: ['draft', 'verified', 'locked'],
      },
    ],
  };
  
  try {
    const isValid = await T5Validator.validate(testEvidence as any);
    console.log(`✅ 5T Validation passed: ${isValid}`);
  } catch (error) {
    console.error(`❌ 5T Validation failed:`, error);
  }
  
  // 2. Test Evidence Service
  console.log('\n2. Testing Evidence Service...');
  try {
    const evidence = await EvidenceService.createEvidenceRecord({
      uuid: 'test-uuid-123',
      version: '1.0.0',
      timestamp: Date.now(),
      evidence: testEvidence.evidence,
    });
    console.log(`✅ Evidence created: ${evidence.id}`);
  } catch (error) {
    console.error(`❌ Evidence creation failed:`, error);
  }
  
  // 3. Test Contract Service
  console.log('\n3. Testing Contract Service...');
  try {
    const contract = await ContractService.createContract({
      contract_code: 'CON-2025-001',
      counterparty_tax_id: '123456789',
      evidence_bundle_id: 'evidence-bundle-123',
      company_id: 'company-123',
    });
    console.log(`✅ Contract created: ${contract.id}`);
  } catch (error) {
    console.error(`❌ Contract creation failed:`, error);
  }
  
  // 4. Test Global State Manager
  console.log('\n4. Testing Global State Manager...');
  try {
    const manager = GlobalStateManager.getInstance();
    const render = manager.render(0.85);
    console.log(`✅ UI Rendered: ${render}`);
  } catch (error) {
    console.error(`❌ UI rendering failed:`, error);
  }
  
  console.log('\n=== ESG GO v9.0.0 Integration Complete ===');
}

main().catch(console.error);