// ESG GO v9.0.0 - Global Integration Test
import { GlobalEvidenceService, ContractService, GlobalStateManager } from './GlobalIntegration';
import { T5Validator } from './T5Protocol';
import { IComponentCore } from '../../lib/core-types';

async function main() {
  console.log('=== ESG GO v9.0.0 Global Integration ===\n');
  
  // 1. Test 5T Validation
  console.log('1. Testing 5T Validation...');
  const testEvidence: IComponentCore = {
    uuid: 'test-uuid-123',
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: [
      {
        source_origin: 'contract-123',
        formula_ref: 'ISO-14064-1',
        tangible_metric: 'metric-1',
        lifecycle_hooks: ['draft', 'verified', 'locked'],
      },
    ],
    formula: 'test-formula',
    impact_metric: 'test-impact',
    status: 'Trustworthy',
    hash_lock: 'temp-hash'
  };
  
  try {
    const isValid = await T5Validator.validate(testEvidence);
    console.log(`✅ 5T Validation passed: ${isValid}`);
  } catch (error) {
    console.error(`❌ 5T Validation failed:`, error);
  }
  
  // 2. Test Evidence Service
  console.log('\n2. Testing Evidence Service...');
  try {
    const evidence = await GlobalEvidenceService.createEvidenceRecord({
      uuid: 'test-uuid-123',
      version: '1.0.0',
      evidence: testEvidence.evidence,
      evidence_bundle_id: 'bundle-123',
      hash_value: 'hash-123',
      source_origin: 'test',
      iso_standard_ref: 'ISO-14064',
      lifecycle_path: ['step1'],
      company_id: 'company-123'
    } as any);
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
      status: 'draft',
      created_by: 'system'
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