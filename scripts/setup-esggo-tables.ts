import 'dotenv/config';
import { supabase } from '../lib/db/supabase';
import { initializeBenchmarkTable } from '../lib/esg/esg-yearbook-store';
import { initializeGRIExpertTemplates } from '../lib/esg/gri-expert-templates-store';

async function main() {
  console.log('🚀 ESGGO Supabase Table Setup');
  console.log('='.repeat(40));

  try {
    // Initialize ESG Benchmark Enterprises
    console.log('\n📊 Setting up esg_benchmark_enterprises...');
    const benchmarkResult = await initializeBenchmarkTable();
    console.log(
      benchmarkResult ? '✅ Benchmark table initialized' : '⚠️ Benchmark table has existing data'
    );

    // Initialize GRI Expert Templates
    console.log('\n📑 Setting up gri_expert_templates...');
    const griResult = await initializeGRIExpertTemplates();
    console.log(griResult ? '✅ GRI templates initialized' : '⚠️ GRI templates have existing data');

    console.log('\n🎉 Setup complete! Run the SQL migration in Supabase dashboard if needed.');
  } catch (error: any) {
    console.error('❌ Setup failed:', error.message);
  }
}

main();
