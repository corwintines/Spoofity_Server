import { RequestHandler } from 'express';
import { querySpotifySearch } from '../services/spotify';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';

export const search: RequestHandler = async (req, res) => {
  const { room, q, offset, limit } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    const result = await querySpotifySearch({
      limit,
      offset,
      query: q,
      token: auth.token,
      tokenType: auth.token_type
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
