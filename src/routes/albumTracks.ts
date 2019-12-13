import { RequestHandler } from 'express-serve-static-core';
import { getRoomAuthorization } from '../services/database/getRoomAuthorization';
import { queryAlbum } from '../services/spotify/search/queryAlbums';

export const albumTracks: RequestHandler = async (req, res) => {
  const { room, albumURI } = req.query;

  try {
    const auth = await getRoomAuthorization(room);

    const result = await queryAlbum({
      token: auth.token,
      tokenType: auth.token_type,
      albumURI
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
