import { RequestHandler } from 'express';
import { createSpotifyToken } from '../../services/spotify/';

export const spotifyLogin: RequestHandler = async (req, res) => {
  const { code, state } = req.query;

  // TODO: check state is a valid requestId

  const token = await createSpotifyToken(code);

  res.redirect(307, `${process.env.CLIENT_URL}/123`);
};
