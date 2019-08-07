import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifyUserProfile } from '../types';
import { spotifyFetch } from '../fetch';

interface GetSpotifyUserParameters {
  token: string;
  tokenType: SpotifyTokenType;
}

export async function getSpotifyUser(args: GetSpotifyUserParameters): Promise<SpotifyUserProfile> {
  const result = await spotifyFetch(`${SPOTIFY_API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`
    }
  });

  const json = await result.json();

  if (!result.ok) {
    throw json;
  }

  return json;
}
