// Vercel Serverless Function Proxy for Automation Matrix
// Purpose: Protect API keys and provide a clean endpoint for Boost.space/Make.com integrations

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const payload = req.body;
    const BOOST_WEBHOOK_URL = process.env.BOOST_WEBHOOK_URL;
    const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

    // Primary hook is Boost.space
    const targetUrl = BOOST_WEBHOOK_URL || MAKE_WEBHOOK_URL;

    if (!targetUrl) {
        return res.status(500).json({ error: 'Automation target URL not configured' });
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Omni-Dispatch-Token': process.env.DISPATCH_SECRET || 'local-dev',
            },
            body: JSON.stringify({
                ...payload,
                metadata: {
                    dispatchedAt: Date.now(),
                    source: 'OmniEsgCell_UI',
                    environment: process.env.VERCEL_ENV || 'development'
                }
            }),
        });

        const data = await response.text();
        let result;
        try {
            result = JSON.parse(data);
        } catch (e) {
            result = { raw: data };
        }

        if (!response.ok) {
            throw new Error(`Automation provider returned ${response.status}: ${data}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Automation successfully dispatched',
            providerResponse: result
        });
    } catch (error) {
        console.error('[Dispatch Proxy Error]:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
