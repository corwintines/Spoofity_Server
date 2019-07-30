import { RequestHandler } from 'express';
import { querySingle } from '../services/database';
import { querySpotifySearch } from '../services/spotify';
import { AuthSchema } from '../services/database/types';

export const search: RequestHandler = async (req, res) => {
  const { room, q, offset, limit } = req.query;

  try {
    const auth = await querySingle<AuthSchema>(
      `
      SELECT
        auth.service,
        auth.token,
        auth.token_type,
        auth.refresh_token,
        auth.expiry_date
      FROM room
        JOIN auth USING (auth_id)
      WHERE room.room_code = $1
    `,
      [room]
    );
    if (!auth) {
      throw new Error('Invalid room code');
    }

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
