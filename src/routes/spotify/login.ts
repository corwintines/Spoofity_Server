import { RequestHandler } from 'express';
import {
  createSpotifyToken,
  createSpotifyPlaylist,
  getSpotifyUser
} from '../../services/spotify';
import { CLIENT_URL } from '../../const';
import { transaction, querySingle } from '../../services/database';

export const spotifyLogin: RequestHandler = async (req, res) => {
  const { code, state } = req.query;

  try {
    const result = await querySingle(
      `
      DELETE FROM request
      WHERE request_id = $1
      AND created_date > now() - interval '30 seconds'
      RETURNING request_id
    `,
      [state]
    );
    if (!result) {
      throw new Error('Invalid request state');
    }

    // Get spotify auth token
    const token = await createSpotifyToken(code);

    const roomCode = await transaction(async (client) => {
      // Store auth
      const auth = await querySingle(
        `
        INSERT INTO auth (
          service,
          token,
          token_type,
          refresh_token,
          created_date,
          expires_in
        ) VALUES (
          'spotify',
          $1,
          $2,
          $3,
          now(),
          $4 
        )
        RETURNING auth_id;
      `,
        [
          token.access_token,
          token.token_type,
          token.refresh_token,
          token.expires_in
        ],
        client
      );
      if (!auth) {
        throw new Error('Failure creating authorization entry');
      }

      // Generate room code
      const roomCode = await querySingle<{ room_code: string }>(
        'SELECT generate_unique_room_code as room_code FROM generate_unique_room_code(4)',
        undefined,
        client
      ).then((result) => {
        if (!result) return result;
        return result.room_code;
      });
      if (!roomCode) {
        throw new Error('Failure creating room code');
      }

      // Grab the user from spotify
      const user = await getSpotifyUser({
        token: token.access_token,
        tokenType: token.token_type
      });

      // Create a spotify playlist
      const playlist = await createSpotifyPlaylist({
        roomCode,
        token: token.access_token,
        tokenType: token.token_type,
        userId: user.id
      });

      // Create a room
      // This will eventually be moved to it's own route
      //  with the intoduction of a playlist manager
      await querySingle(
        `
        INSERT INTO room (
          auth_id,
          room_code,
          service_data
        ) VALUES (
          $1,
          $2,
          $3
        )
      `,
        [
          auth.auth_id,
          roomCode,
          JSON.stringify({
            playlist_id: playlist.id
          })
        ],
        client
      );

      return roomCode;
    });

    console.log('Created room', roomCode);

    // Redirect user to the playlist
    res.redirect(302, `${CLIENT_URL}/${roomCode}`);
  } catch (err) {
    // TODO: this should probably redirect the user to an error page in the client
    res.status(500).send(err.message);
  }
};
