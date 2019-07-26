import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  SPOTIFY_ACCOUNT_URL,
  AUTHORIZE_CALLBACK_URL
} from '../../../const';
import { SpotifyToken } from '../types';
import fetch from 'node-fetch';

export async function createSpotifyToken(code: string) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', AUTHORIZE_CALLBACK_URL);
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
