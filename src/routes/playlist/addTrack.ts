import { RequestHandler } from 'express';
import { addSpotifyPlaylistTracks } from '../../services/spotify';
import { getRoomAuthorization } from '../../services/database/getRoomAuthorization';
import { SpotifyRoomData } from '../../services/database/types';

export const addTrack: RequestHandler = async (req, res) => {
  const { room } = req.params;
  const { track_uris } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_data as SpotifyRoomData;

        return await addSpotifyPlaylistTracks({
          playlistId: playlist_id,
          token: auth.token,
          tokenType: auth.token_type,
          trackUris: track_uris
        });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
