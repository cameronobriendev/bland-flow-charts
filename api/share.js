import { put } from '@vercel/blob';

export default async function handler(req) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Expects: { pathway: {...}, name: "Pathway Name" }
    const { pathway, name } = await req.json();

    if (!pathway || !pathway.nodes || !pathway.edges) {
      return new Response(JSON.stringify({ error: 'Invalid pathway data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = crypto.randomUUID().slice(0, 8);
    const shareData = { pathway, name: name || 'Shared Pathway' };

    const blob = await put(`pathways/${id}.json`, JSON.stringify(shareData), {
      access: 'public',
      contentType: 'application/json',
    });

    return new Response(JSON.stringify({
      id,
      url: `https://buildhelp.dev?id=${id}`,
      blobUrl: blob.url,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Share error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save pathway' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
