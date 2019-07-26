import { RequestHandler } from 'express';
import { createSpotifyToken, getSpotifyUser } from '../../services/spotify';
import { CLIENT_URL } from '../../const';

export const spotifyLogin: RequestHandler = async (req, res) => {
  const { code, state } = req.query;

  try {
    // TODO: check state is a valid requestId

    // Get spotify auth token
    const token = await createSpotifyToken(code);

    // Get spotify user
    const user = await getSpotifyUser({
      token: token.access_token,
      tokenType: token.token_type
    });

    // TODO: store user

    // TODO: generate playlist code
    // This will eventually be moved to it's own route

    const roomCode = 'A12B';

    res.redirect(302, `${CLIENT_URL}/${roomCode}`);
  } catch (err) {
    // TODO: this should probably redirect the user to an error page in the client
    res.status(500).send(err.message);
  }
};
