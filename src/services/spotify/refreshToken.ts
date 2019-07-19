import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  SPOTIFY_ACCOUNT_URL
} from '../../const';
import { SpotifyToken } from './types';

export async function refreshSpotifyToken(refreshToken: string) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
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

  return {
    // May or may not be a new refresh token
    refresh_token: refreshToken,
    ...json
  };
}
