import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateHashLock(evidence) {
    return crypto.createHash('sha256').update(JSON.stringify(evidence)).digest('hex');
}

const seedData = [
  // Environmental Data (Scope 1, 2, 3)
  { domain: 'environmental', scope: 'Scope 1', source: '固定燃燒源 (發電機)', value: 1250, unit: 'tCO2e' },
  { domain: 'environmental', scope: 'Scope 1', source: '移動燃燒源 (公務車)', value: 320, unit: 'tCO2e' },
  { domain: 'environmental', scope: 'Scope 2', source: '外購電力 (總部與廠區)', value: 8450, unit: 'tCO2e' },
  { domain: 'environmental', scope: 'Scope 3', source: '員工通勤與差旅', value: 595, unit: 'tCO2e' },
  { domain: 'environmental', scope: 'Scope 3', source: '供應鏈上下游運輸', value: 2100, unit: 'tCO2e' },

  // Social Data
  { domain: 'social', category: '健康與安全', metric: '零工安事故天數', value: '342', target: '365', unit: '天' },
  { domain: 'social', category: '勞工實踐', metric: '女性管理職比例', value: '38%', target: '40%', unit: '%' },
  { domain: 'social', category: '培訓與發展', metric: '員工平均受訓時數', value: '45.5', target: '40', unit: '小時' },
  { domain: 'social', category: '社會參與', metric: '社區發展投資總額', value: 'NT$ 12.5M', target: 'NT$ 10M', unit: 'TWD' },

  // Governance Data
  { domain: 'governance', category: '董事會獨立性', policy: '獨立董事席次比例', compliance: '4/7 (57%)', target: '>50%', nextAudit: '2026-11-15' },
  { domain: 'governance', category: '商業道德', policy: '反貪腐政策簽署率', compliance: '100%', target: '100%', nextAudit: '2026-12-01' },
  { domain: 'governance', category: '風險管理', policy: '資訊安全防護演練', compliance: '已完成 (Q2)', target: '每半年一次', nextAudit: '2026-10-01' },
  { domain: 'governance', category: '供應鏈管理', policy: '供應商行為準則稽核', compliance: '85% 合格', target: '90%', nextAudit: '2026-09-30' }
];

async function seed() {
  console.log('Seeding Supabase with realistic ESG Atoms...');

  for (const item of seedData) {
      const evidence = { ...item };
      const status = Math.random() > 0.2 ? 'Trustworthy' : 'Pending';
      const hashLock = generateHashLock(evidence);
      
      const payload = {
          status,
          hash_lock: hashLock,
          evidence,
          formula: 'Manual Audit Entry',
          timestamp: Date.now()
      };

      const { error } = await supabase.from('esg_atoms').insert([payload]);
      if (error) {
          console.error('Error inserting item:', item.source || item.metric || item.policy, error.message);
      } else {
          console.log(`Inserted: ${item.source || item.metric || item.policy} (${status})`);
      }
  }
  
  console.log('Seeding complete!');
}

seed();
