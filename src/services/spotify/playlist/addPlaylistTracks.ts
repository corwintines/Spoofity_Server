import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifyPlaylist } from '../types';
import { spotifyFetch } from '../fetch';

interface AddSpotifyPlaylistTracksParameters {
  token: string;
  tokenType: SpotifyTokenType;
  playlistId: string;
  trackUris: string[];
}

export async function addSpotifyPlaylistTracks(
  args: AddSpotifyPlaylistTracksParameters
): Promise<Pick<SpotifyPlaylist, 'snapshot_id'>> {
  const result = await spotifyFetch(
    `${SPOTIFY_API_URL}/playlists/${args.playlistId}/tracks`,
    {
      method: 'POST',
      headers: {
        Authorization: `${args.tokenType} ${args.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: args.trackUris
      })
    }
  );
  const json = await result.json();

  if (!result.ok) {
    throw json;
  }

  return json;
}
