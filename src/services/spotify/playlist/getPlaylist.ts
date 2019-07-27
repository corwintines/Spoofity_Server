import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifyPlaylist } from '../types';
import { spotifyFetch } from '../fetch';

interface GetSpotifyPlaylistParameters {
  token: string;
  tokenType: SpotifyTokenType;
  playlistId: string;
}

export async function getSpotifyPlaylist(
  args: GetSpotifyPlaylistParameters
): Promise<SpotifyPlaylist> {
  const url = new URL(`${SPOTIFY_API_URL}/playlists/${args.playlistId}/tracks`);
  url.searchParams.append('fields', ['id', 'snapshot_id'].join(','));
  url.searchParams.append('market', 'from_token');

  const result = await spotifyFetch(url.href, {
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
