import { RequestHandler } from 'express';
import { createSpotifyToken } from '../../services/spotify';
import { CLIENT_URL } from '../../const';
import { transaction, query } from '../../services/database';
import { generateRoomCode } from '../../services/database/room';

export const spotifyLogin: RequestHandler = async (req, res) => {
  const { code, state } = req.query;

  try {
    // TODO: check state is a valid requestId

    // Get spotify auth token
    const token = await createSpotifyToken(code);

    // Store auth
    await transaction(async (client) => {
      await query(
        `
        INSERT INTO auth (
          service,
          token,
          token_type,
          refresh_token,
          expiry_date
        ) VALUES (
          'spotify',
          $1,
          $2,
          $3,
          now() + 'interval $4 seconds'
        );
      `,
        [
          token.access_token,
          token.token_type,
          token.refresh_token,
          token.expires_in
        ],
        client
      );
    });

    // Generate room code
    // This will eventually be moved to it's own route
    //  with the intoduction of a playlist manager
    const roomCode = await generateRoomCode();

    // Redirect user to the playlist
    res.redirect(302, `${CLIENT_URL}/${roomCode}`);
  } catch (err) {
    // TODO: this should probably redirect the user to an error page in the client
    res.status(500).send(err.message);
  }
};
