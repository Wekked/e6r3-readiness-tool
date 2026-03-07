// Vercel API Route: proxies requests to Anthropic API
// Deploy-compatible with `vercel --prod`

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not configured. Set it in your Vercel environment variables.'
    });
  }

  try {
    const body = req.body;

    if (!body.messages || !Array.isArray(body.messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 8000,
        system: body.system || '',
        messages: body.messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || `Anthropic API error: ${response.status}`
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('API route error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};
