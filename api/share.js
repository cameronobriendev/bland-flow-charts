import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pathway, name } = req.body;

    if (!pathway || !pathway.nodes || !pathway.edges) {
      return res.status(400).json({ error: 'Invalid pathway data' });
    }

    const id = crypto.randomUUID().slice(0, 8);
    const shareData = { pathway, name: name || 'Shared Pathway' };

    const blob = await put(`pathways/${id}.json`, JSON.stringify(shareData), {
      access: 'public',
      contentType: 'application/json',
    });

    return res.status(200).json({
      id,
      url: `https://buildhelp.dev?id=${id}`,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Share error:', error);
    return res.status(500).json({ error: 'Failed to save pathway' });
  }
}
