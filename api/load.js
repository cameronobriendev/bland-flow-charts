import { list } from '@vercel/blob';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    // Validate ID format (8 char hex)
    if (!/^[a-f0-9-]{8}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid id format' });
    }

    // List blobs to find the one with matching prefix
    const { blobs } = await list({ prefix: `pathways/${id}` });

    if (blobs.length === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Fetch the blob content
    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch pathway' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Load error:', error);
    return res.status(500).json({ error: 'Failed to load pathway' });
  }
}
