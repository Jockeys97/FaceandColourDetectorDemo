export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelId, versionId, payload } = req.body;

    if (!modelId || !versionId || !payload) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const clarifaiUrl = `https://api.clarifai.com/v2/models/${modelId}/versions/${versionId}/outputs`;
    
    // Use PAT from environment variable
    const PAT = process.env.CLARIFAI_PAT;
    if (!PAT) {
      return res.status(500).json({ error: 'Clarifai PAT not configured' });
    }

    const response = await fetch(clarifaiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Key ${PAT}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Clarifai API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Clarifai API error', details: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}