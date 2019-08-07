import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifyPlaylist } from '../types';
import { spotifyFetch } from '../fetch';

interface CreateSpotifyPlaylistParameters {
  token: string;
  tokenType: SpotifyTokenType;
  userId: string;
  name: string;
  description: string;
}

export async function createSpotifyPlaylist(args: CreateSpotifyPlaylistParameters): Promise<SpotifyPlaylist> {
  const result = await spotifyFetch(`${SPOTIFY_API_URL}/users/${args.userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`,
      'Content-Type': 'application/json'
    },
    // TODO: should this be public and collaborative?
    body: JSON.stringify({
      name: args.name,
      public: false,
      collaborative: true,
      description: args.description
    })
  });
  const json = await result.json();

  if (!result.ok) {
    throw json;
  }

  return json;
}
