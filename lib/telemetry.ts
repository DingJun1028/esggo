/**
 * User Memory & Telemetry System Helper
 * Perpetuates user actions, clicks, and operations to the PostgreSQL database.
 */

export async function logUserActivity(action: string, details: Record<string, any> = {}) {
  if (typeof window === 'undefined') return; // Ensure client-side only

  try {
    fetch('/api/user/activity-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        details,
      }),
    }).catch(() => {}); // Fire and forget background log
  } catch (e) {
    console.warn('[Telemetry] Logging failed:', e);
  }
}
