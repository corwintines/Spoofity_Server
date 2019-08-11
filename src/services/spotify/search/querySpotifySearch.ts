import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifySearchResult } from '../types';
import { spotifyFetch } from '../fetch';

interface QuerySpotifySearchParameters {
  token: string;
  tokenType: SpotifyTokenType;
  query: string;
  limit: number;
  offset: number;
  searchType: string;
}

export async function querySpotifySearch(
  args: QuerySpotifySearchParameters
): Promise<SpotifySearchResult> {
  const url = new URL(`${SPOTIFY_API_URL}/search`);
  url.searchParams.append('type', args.searchType);
  url.searchParams.append('market', 'from_token');
  url.searchParams.append('q', args.query);
  url.searchParams.append('limit', args.limit.toString()); // 1 - 50
  url.searchParams.append('offset', args.offset.toString()); // 0 - 10,000

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
