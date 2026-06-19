// src/services/automationService.ts

export type AutomationProvider = 'make' | 'boost.space';

interface AutomationPayload {
  cellId: string;
  data: any;
  action?: string;
}

export const executeAutomation = async (
  provider: AutomationProvider,
  payload: AutomationPayload
) => {
  // 指向我們剛建立的 Serverless Function
  // 在本地開發時，如果是用 vercel dev 啟動，路徑也是 /api/dispatch
  // 在生產環境，路徑也是 /api/dispatch
  const endpoint = '/api/dispatch';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        payload: {
          source: 'JunAiKey_Vite_Client',
          timestamp: new Date().toISOString(),
          ...payload,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Automation Dispatch Failed');
    }

    return result;

  } catch (error) {
    console.error('[Automation Service Error]', error);
    throw error;
  }
};