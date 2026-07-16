import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const appId = process.env.FACEBOOK_APP_ID;

  if (!appId) {
    return new NextResponse('FACEBOOK_APP_ID environment variable is missing on server.', { status: 400 });
  }

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/social/instagram/callback`;

  // Scope permissions for Instagram Business Content Publishing
  const scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'pages_read_engagement',
    'pages_show_list'
  ].join(',');

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
