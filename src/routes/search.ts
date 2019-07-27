import { RequestHandler } from 'express';
import { query } from '../services/database';

export const search: RequestHandler = async (req, res) => {
  const { room, q, offset, limit } = req.query;

  const auth = await query(
    `
    SELECT
      auth.service,
      auth.token,
      auth.token_type,
      auth.refresh_token
    FROM playlist
      JOIN auth USING (auth_id)
    WHERE playlist.room_code = $1
  `,
    [room]
  );
};
