import { RequestHandler } from 'express';
import { querySingle } from '../services/database';
import { AuthSchema, RoomSchema } from '../services/database/types';
import { addSpotifyPlaylistTracks } from '../services/spotify';

export const search: RequestHandler = async (req, res) => {
  const { room, track_uris } = req.query;

  try {
    const auth = await querySingle<AuthSchema & RoomSchema>(
      `
      SELECT
        auth.service,
        auth.token,
        auth.token_type,
        auth.refresh_token,
        auth.expiry_date,
        room.service_playlist_id
      FROM room
        JOIN auth USING (auth_id)
      WHERE room.room_code = $1
    `,
      [room]
    );
    if (!auth) {
      throw new Error('Invalid room code');
    }

    return await addSpotifyPlaylistTracks({
      playlistId: auth.service_playlist_id,
      token: auth.token,
      tokenType: auth.token_type,
      trackUris: track_uris
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
