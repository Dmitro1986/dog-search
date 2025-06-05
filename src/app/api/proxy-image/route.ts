import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    
    return new Response(imageBuffer, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('Content-Type') || 'image/*',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    return new Response('Failed to fetch image', { status: 500 });
  }
}