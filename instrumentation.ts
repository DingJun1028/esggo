/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Sentry Error Monitoring:
 *   1. pnpm add @sentry/node
 *   2. Set SENTRY_DSN in .env.production
 *   3. Uncomment the Sentry block below
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // ── Sentry Error Monitoring (opt-in via SENTRY_DSN + @sentry/node) ──
    // Uncomment after installing: pnpm add @sentry/node
    //
    // if (process.env.SENTRY_DSN) {
    //   try {
    //     const Sentry = await import('@sentry/node');
    //     Sentry.init({
    //       dsn: process.env.SENTRY_DSN,
    //       environment: process.env.NODE_ENV || 'development',
    //       tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    //       enabled: process.env.NODE_ENV === 'production',
    //     });
    //     console.log('[Instrumentation] Sentry initialized');
    //   } catch {
    //     console.warn('[Instrumentation] Sentry not available, skipping');
    //   }
    // }

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
    
    // Initialize OmniCore kernel (starts cache eviction + AGNES metrics polling).
    // initialize() is idempotent, so calling it on every boot is safe.
    const { omniKernel } = await import('@/lib/omni-core/omni-kernel');
    omniKernel.initialize();

    console.log('[Instrumentation] Cron jobs + OmniKernel initialized');
  }
}
