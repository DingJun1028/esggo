import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1. Security Check
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing Temporal Coordinates (URL)' });

  try {
    // 2. Cross-Dimension Fetch
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch calendar: ${response.statusText}`);

    const icsData = await response.text();

    // 3. Return raw data
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache 5 mins
    res.status(200).send(icsData);
  } catch (error) {
    console.error('Temporal Proxy Error:', error);
    res.status(500).json({ error: 'Temporal Connection Failed' });
  }
}
