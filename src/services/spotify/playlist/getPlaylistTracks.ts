import { SPOTIFY_API_URL } from '../../../const';
import {
  SpotifyTokenType,
  SpotifyPaging,
  SpotifyPlaylistTrack
} from '../types';

interface GetSpotifyPlaylistTracksParameters {
  token: string;
  tokenType: SpotifyTokenType;
  playlistId: string;
  offset: number;
  limit: number;
}

export async function getSpotifyPlaylistTracks(
  args: GetSpotifyPlaylistTracksParameters
): Promise<SpotifyPaging<SpotifyPlaylistTrack>> {
  const url = new URL(`${SPOTIFY_API_URL}/playlists/${args.playlistId}/tracks`);
  // url.searchParams.append('fields', [].join(','));
  url.searchParams.append('market', 'from_token');
  url.searchParams.append('limit', args.limit.toString());
  url.searchParams.append('offset', args.offset.toString());

  const result = await fetch(url.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`,
      'Content-Type': 'application/json'
    }
  });
  const json = await result.json();

  if (!result.ok) {
    throw json;
  }

  return json;
}
