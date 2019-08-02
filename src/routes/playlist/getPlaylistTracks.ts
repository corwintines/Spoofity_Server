import { RequestHandler } from 'express';
import { getSpotifyPlaylistTracks } from '../../services/spotify';
import { getRoomAuthorization } from '../../services/database/getRoomAuthorization';
import { SpotifyRoomData } from '../../services/database/types';

export const getPlaylistTracks: RequestHandler = async (req, res) => {
  const { room } = req.params;
  const { offset, limit } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_data as SpotifyRoomData;

        return await getSpotifyPlaylistTracks({
          playlistId: playlist_id,
          limit,
          offset,
          token: auth.token,
          tokenType: auth.token_type,
          fields: ['items']
        });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
