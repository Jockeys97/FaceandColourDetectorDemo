import https from 'https';

const postJson = (url, headers, body) => new Promise((resolve, reject) => {
  const request = https.request(url, { method: 'POST', headers }, (response) => {
    let raw = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { raw += chunk; });
    response.on('end', () => resolve({ status: response.statusCode || 500, body: raw }));
  });
  request.setTimeout(25000, () => request.destroy(new Error('Clarifai request timed out')));
  request.on('error', reject);
  request.write(body);
  request.end();
});

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

    const response = await postJson(clarifaiUrl, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Key ${PAT}`
    }, JSON.stringify(payload));

    if (response.status < 200 || response.status >= 300) {
      console.error('Clarifai API error:', response.status, response.body);
      return res.status(response.status).json({ error: 'Clarifai API error', details: response.body });
    }
    res.status(200).json(JSON.parse(response.body));

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
