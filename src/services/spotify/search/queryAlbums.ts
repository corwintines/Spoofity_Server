import { SPOTIFY_API_URL } from '../../../const';
import { spotifyFetch } from '../fetch';
import { SpotifyTokenType } from '../types';

// Interface
interface QuerySpotifyAlbumParameters {
  token: string;
  tokenType: SpotifyTokenType;
  albumURI: string;
}

export async function queryAlbum(args: QuerySpotifyAlbumParameters) {
  const url = new URL(`${SPOTIFY_API_URL}/albums/${args.albumURI}`);

  const result = await spotifyFetch(url.href, {
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
