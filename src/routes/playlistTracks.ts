import { RequestHandler } from 'express';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';
import { getSpotifyPlaylistTracks } from '../services/spotify/playlist/getPlaylistTracks';

export const playlistTracks: RequestHandler = async (req, res) => {
  const { room, offset } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    const result = await getSpotifyPlaylistTracks({
      token: auth.token,
      tokenType: auth.token_type,
      playlistId: auth.service_playlist_id,
      offset: offset,
      limit: 100
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
