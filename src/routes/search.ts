import { RequestHandler } from 'express';
import { querySpotifySearch } from '../services/spotify';
import { getPlaylistAuthorization } from '../services/database/getPlaylistAuthorization';

const search: RequestHandler = async (req, res) => {
  const { code, q, offset, limit } = req.query;

  try {
    const auth = await getPlaylistAuthorization(code);

    switch (auth.service) {
      case 'spotify': {
        return await querySpotifySearch({
          limit,
          offset,
          query: q,
          token: auth.token,
          tokenType: auth.token_type
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

export default [search];
