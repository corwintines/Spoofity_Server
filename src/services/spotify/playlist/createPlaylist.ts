import { SPOTIFY_API_URL } from '../../../const';
import { SpotifyTokenType, SpotifyPlaylist } from '../types';

interface CreateSpotifyPlaylistParameters {
  token: string;
  tokenType: SpotifyTokenType;
  userId: string;
  roomCode: string;
}

export async function createSpotifyPlaylist(
  args: CreateSpotifyPlaylistParameters
): Promise<SpotifyPlaylist> {
  const result = await fetch(
    `${SPOTIFY_API_URL}/users/${args.userId}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `${args.tokenType} ${args.token}`,
        'Content-Type': 'application/json'
      },
      // TODO: should this be public and collaborative?
      body: JSON.stringify({
        name: args.roomCode,
        public: false,
        collaborative: true,
        description: `Share this playlist with https://localhost:8000/${
          args.roomCode
        }`
      })
    }
  );
  const json = await result.json();

  if (!result.ok) {
    throw json;
  }

  return json;
}
