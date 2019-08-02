import { RequestHandler } from 'express';
import { addSpotifyPlaylistTracks } from '../services/spotify';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';
import { SpotifyRoomData } from '../services/database/types';

export const addTrack: RequestHandler = async (req, res) => {
  const { room, track_uris } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    return await addSpotifyPlaylistTracks({
      playlistId: (auth.service_data as SpotifyRoomData).playlist_id,
      token: auth.token,
      tokenType: auth.token_type,
      trackUris: track_uris
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
