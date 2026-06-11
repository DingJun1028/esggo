export async function pushTelegramAlert(payload: { title: string; message: string; severity?: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[TelegramGateway] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.');
    return;
  }

  const emoji = payload.severity === 'critical' ? '🚨' : payload.severity === 'warning' ? '⚠️' : 'ℹ️';
  const text = `${emoji} *${payload.title}*\n\n${payload.message}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!res.ok) {
      console.error('[TelegramGateway] Failed to send message:', await res.text());
    }
  } catch (error) {
    console.error('[TelegramGateway] Exception sending message:', error);
  }
}
