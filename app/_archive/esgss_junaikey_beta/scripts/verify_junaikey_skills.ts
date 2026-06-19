
/**
 * 🧪 JunAiKey_Skills API 驗證腳本
 * 測試三個路由模組：OmniTable, OmniSync, OmniCRM
 */

import axios from 'axios';

// API URLs for the three modules
const API_URL_TABLE = 'http://localhost:5005/api/skills/omni-table';
const API_URL_SYNC = 'http://localhost:5005/api/skills/omni-sync';
const API_URL_CRM = 'http://localhost:5005/api/skills/omni-crm';

const MOCK_CONTEXT = { userId: 'ver_test_user_001' };

async function verifyOmniTableSkills() {
    console.log('\n🧪 Verifying JunAiKey_Skills (OmniTable) API...');

    try {
        // 1. Test Registry
        console.log('\n--- Test 1: Fetch OmniTable Registry ---');
        const registryRes = await axios.get(`${API_URL_TABLE}/registry`);
        if (registryRes.data.success) {
            console.log('✅ OmniTable Registry fetch success.');
            console.log('Skills:', registryRes.data.skills.map((s: any) => s.name).join(', '));
        } else {
            console.error('❌ Registry fetch failed:', registryRes.data);
        }

        // 2. Test NL Dispatch
        console.log('\n--- Test 2: OmniTable NL Dispatch (Chart) ---');
        const dispatchRes = await axios.post(`${API_URL_TABLE}/dispatch`, {
            prompt: "Generate a bar chart of Q1 revenue",
            context: MOCK_CONTEXT
        });
        if (dispatchRes.data.success) {
            console.log('✅ OmniTable Dispatch success.');
            console.log('Skill:', dispatchRes.data.skill);
        } else {
            console.error('❌ OmniTable Dispatch failed:', dispatchRes.data);
        }

        // 3. Test Sync Customer
        console.log('\n--- Test 3: OmniTable Sync Customer ---');
        const syncRes = await axios.post(`${API_URL_TABLE}/sync/customer`, {
            customerId: 'cust_001'
        });
        console.log('✅ Sync Customer Result:', syncRes.data);

    } catch (error: any) {
        console.error('❌ OmniTable Tests Failed:', error.message);
    }
}

async function verifyOmniSyncSkills() {
    console.log('\n🧪 Verifying JunAiKey_Skills (OmniSync) API...');

    try {
        // 1. Test Registry
        console.log('\n--- Test 1: Fetch OmniSync Registry ---');
        const registryRes = await axios.get(`${API_URL_SYNC}/registry`);
        if (registryRes.data.success) {
            console.log('✅ OmniSync Registry fetch success.');
            console.log('Skills:', registryRes.data.skills.map((s: any) => s.name).join(', '));
        }

        // 2. Test Status
        console.log('\n--- Test 2: OmniSync Status ---');
        const statusRes = await axios.get(`${API_URL_SYNC}/status`);
        console.log('✅ OmniSync Status:', statusRes.data);

    } catch (error: any) {
        console.error('❌ OmniSync Tests Failed:', error.message);
    }
}

async function verifyOmniCRMSkills() {
    console.log('\n🧪 Verifying JunAiKey_Skills (OmniCRM) API...');

    try {
        // 1. Test Registry
        console.log('\n--- Test 1: Fetch OmniCRM Registry ---');
        const registryRes = await axios.get(`${API_URL_CRM}/registry`);
        if (registryRes.data.success) {
            console.log('✅ OmniCRM Registry fetch success.');
            console.log('Skills:', registryRes.data.skills.map((s: any) => s.name).join(', '));
        }

        // 2. Test CRM Contact
        console.log('\n--- Test 2: OmniCRM Create Contact ---');
        const contactRes = await axios.post(`${API_URL_CRM}/contact`, {
            prompt: 'Add John Doe from Acme Corp, email john@acme.com'
        });
        console.log('✅ OmniCRM Contact Result:', contactRes.data);

        // 3. Test CRM Deal
        console.log('\n--- Test 3: OmniCRM Create Deal ---');
        const dealRes = await axios.post(`${API_URL_CRM}/deal`, {
            prompt: 'Create 50k deal with Acme Corp'
        });
        console.log('✅ OmniCRM Deal Result:', dealRes.data);

        // 4. Test BD Development
        console.log('\n--- Test 4: OmniCRM BD Development ---');
        const bdRes = await axios.post(`${API_URL_CRM}/bd`, {
            company: 'Tech Solutions',
            industry: 'Technology'
        });
        console.log('✅ OmniCRM BD Result:', bdRes.data);

    } catch (error: any) {
        console.error('❌ OmniCRM Tests Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

async function verifyAllSkills() {
    console.log('🚀 Starting JunAiKey_Skills API Verification...');
    console.log('================================================');

    await verifyOmniTableSkills();
    await verifyOmniSyncSkills();
    await verifyOmniCRMSkills();

    console.log('\n================================================');
    console.log('✅ All JunAiKey_Skills API verification completed!');
}

verifyAllSkills().catch(console.error);
