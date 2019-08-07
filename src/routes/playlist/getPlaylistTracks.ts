import { RequestHandler } from 'express';
import { getSpotifyPlaylistTracks } from '../../services/spotify';
import { getPlaylistAuthorization } from '../../services/database/getPlaylistAuthorization';
import { SpotifyPlaylistData } from '../../services/database/types';

const getPlaylistTracks: RequestHandler = async (req, res) => {
  const { code } = req.params;
  const { offset, limit } = req.query;

  try {
    const auth = await getPlaylistAuthorization(code);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_playlist_data as SpotifyPlaylistData;

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

export default [getPlaylistTracks];
