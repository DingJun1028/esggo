import fetch from 'node-fetch'; // Vercel environment usually has this, or use built-in fetch in Node 18+

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { provider, payload } = req.body;
  // Read server-side env vars (hidden)
  const targetUrl =
    provider === 'make' ? process.env.MAKE_WEBHOOK_URL : process.env.BOOST_SPACE_WEBHOOK_URL;

  if (!targetUrl) {
    // For demo purposes if no env var is set, log and return success mock
    console.warn('Missing Webhook URL, operating in simulation mode.');
    return res.status(200).json({ status: 'Signal Dispatched (Simulation)', payload });
  }

  try {
    const externalRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, verifiedAt: new Date().toISOString() }),
    });
    return res.status(200).json({ status: 'Signal Dispatched' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
