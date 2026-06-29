/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid edge runtime issues
    const { initCronJobs } = await import('@/lib/cron-jobs');
    
    // Initialize cron scheduler
    const stopCron = initCronJobs();
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[Instrumentation] SIGTERM received, stopping cron...');
      stopCron();
    });
    process.on('SIGINT', () => {
      console.log('[Instrumentation] SIGINT received, stopping cron...');
      stopCron();
    });
    
    console.log('[Instrumentation] Cron jobs initialized');
  }
}
