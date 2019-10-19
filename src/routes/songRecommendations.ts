import { RequestHandler } from 'express';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';
import { getSongRecommendations } from '../services/spotify/recommendation/getSongRecommendations';

export const songRecommendations: RequestHandler = async (req, res) => {
  const { room } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    const result = await getSongRecommendations({
      playlistId: auth.service_playlist_id,
      token: auth.token,
      tokenType: auth.token_type
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
