import { RequestHandler } from 'express';
import { addSpotifyPlaylistTracks } from '../../services/spotify';
import { getPlaylistAuthorization } from '../../services/database/getPlaylistAuthorization';
import { SpotifyPlaylistData } from '../../services/database/types';

const addTrack: RequestHandler = async (req, res) => {
  const { playlist } = req.params;
  const { track_uris } = req.query;

  try {
    const auth = await getPlaylistAuthorization(playlist);

    switch (auth.service) {
      case 'spotify': {
        const { playlist_id } = auth.service_playlist_data as SpotifyPlaylistData;

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

export default [addTrack];
