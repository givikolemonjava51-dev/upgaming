  const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // same-origin app, but keep this permissive in case the page is opened from a preview URL
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const results = (await kv.get('results')) || {};
      const updatedAt = (await kv.get('resultsUpdatedAt')) || null;
      res.status(200).json({ results, updatedAt });
    } catch (err) {
      res.status(500).json({ error: 'store_unavailable' });
    }
    return;
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};
    const password = body.password;
    const results = body.results;

    if (!process.env.ADMIN_PASSWORD) {
      res.status(500).json({ error: 'server_not_configured' });
      return;
    }
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ error: 'wrong_password' });
      return;
    }
    if (!results || typeof results !== 'object' || Array.isArray(results)) {
      res.status(400).json({ error: 'bad_results' });
      return;
    }

    try {
      await kv.set('results', results);
      await kv.set('resultsUpdatedAt', Date.now());
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'store_unavailable' });
    }
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
