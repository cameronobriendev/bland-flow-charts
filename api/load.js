import { list } from '@vercel/blob';

export default async function handler(req) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate ID format (8 char hex)
    if (!/^[a-f0-9-]{8}$/i.test(id)) {
      return new Response(JSON.stringify({ error: 'Invalid id format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // List blobs to find the one with matching prefix
    const { blobs } = await list({ prefix: `pathways/${id}` });

    if (blobs.length === 0) {
      return new Response(JSON.stringify({ error: 'Pathway not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the blob content
    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch pathway' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Load error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load pathway' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
