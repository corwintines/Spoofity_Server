import { RequestHandler } from 'express';
import { getSpotifyPlaylist } from '../../services/spotify';
import { getRoomAuthorization } from '../../services/database/getRoomAuthorization';
import { SpotifyRoomData } from '../../services/database/types';

export const getPlaylist: RequestHandler = async (req, res) => {
  const { room } = req.params;

  try {
    const auth = await getRoomAuthorization(room);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_data as SpotifyRoomData;

        return await getSpotifyPlaylist({
          playlistId: playlist_id,
          token: auth.token,
          tokenType: auth.token_type,
          fields: ['href', 'tracks', 'images', 'name', 'uri']
        });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
