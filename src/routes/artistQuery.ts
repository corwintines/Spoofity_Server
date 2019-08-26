import { RequestHandler } from 'express-serve-static-core';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';
import { queryArtist } from '../services/spotify/search/queryArtists';

export const artistQuery: RequestHandler = async (req, res) => {
  const { room, artistURI } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    const result = await queryArtist({
      token: auth.token,
      tokenType: auth.token_type,
      artistURI
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
