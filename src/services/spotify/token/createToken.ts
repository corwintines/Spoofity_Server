import { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET, SPOTIFY_ACCOUNT_URL, SERVER_URL } from '../../../const';
import { SpotifyToken } from '../types';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

export async function createSpotifyToken(code: string) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${SERVER_URL}/spotify/login`);
  params.append('client_id', SPOTIFY_CLIENT_ID);
  params.append('client_secret', SPOTIFY_SECRET);

  const result = await fetch(`${SPOTIFY_ACCOUNT_URL}/api/token`, {
    method: 'POST',
    body: params
  });

  const json = await result.json();

  if (!result.ok) {
    // TODO: better errors
    throw json;
  }

  return json as SpotifyToken;
}
