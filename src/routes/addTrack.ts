import { RequestHandler } from 'express';
import { addSpotifyPlaylistTracks } from '../services/spotify';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';

export const addTrack: RequestHandler = async (req, res) => {
  const { room, track_uris } = req.body;

  try {
    const auth = await getRoomAuthorization(room);

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
