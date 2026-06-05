
import { omniBlueTableService } from '../src/server/services/omni-blue-table.service';

async function syncRenderWorkflows() {
  console.log('Starting synchronization of Render Workflows Best Practices to OmniBlueTable...');
  
  console.log('Debugging Supabase Environment Variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***** (Key Loaded)' : 'NOT LOADED');
  console.log('----------------------------------------');

  try {
    const result = await omniBlueTableService.syncBestPracticesToVault();
    if (result.success) {
      console.log('Synchronization successful:', result);
    } else {
      console.error('Synchronization failed:', result.error);
    }
  } catch (error) {
    console.error('An unexpected error occurred during synchronization:', error);
  }
}

syncRenderWorkflows();
