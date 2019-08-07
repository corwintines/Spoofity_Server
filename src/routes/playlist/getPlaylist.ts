import { RequestHandler } from 'express';
import { getSpotifyPlaylist } from '../../services/spotify';
import { getPlaylistAuthorization } from '../../services/database/getPlaylistAuthorization';
import { SpotifyPlaylistData } from '../../services/database/types';

const getPlaylist: RequestHandler = async (req, res) => {
  const { code } = req.params;

  try {
    const auth = await getPlaylistAuthorization(code);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_playlist_data as SpotifyPlaylistData;

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

export default [getPlaylist];
