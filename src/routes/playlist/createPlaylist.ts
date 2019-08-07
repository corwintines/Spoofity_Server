import * as passport from 'passport';
import { RequestHandler } from 'express';
import { querySingle, transaction } from '../../services/database';
import { createSpotifyPlaylist, getSpotifyUser } from '../../services/spotify';
import { CLIENT_URL } from '../../const';
import { getUserAuthorization } from '../../services/database/getUserAuthorization';

const createPlaylist: RequestHandler = async (req, res) => {
  const { service } = req.body;

  try {
    const response = await transaction(async (client) => {
      const auth = await getUserAuthorization(req.user.user_profile_id, service);
      if (!auth) {
        throw new Error('Invalid authorization');
      }

      // Get spotify user
      const spotifyUser = await getSpotifyUser({
        token: auth.token,
        tokenType: auth.token_type
      });

      // Generate playlist code
      const generatedCode = await querySingle<{ code: string }>(
        'SELECT generate_unique_playlist_code as code FROM generate_unique_playlist_code(4)',
        undefined,
        client
      );
      if (!generatedCode) {
        throw new Error('Failure creating playlist code');
      }

      // Create a spotify playlist
      const playlist = await createSpotifyPlaylist({
        name: generatedCode.code,
        description: `Share this playlist with ${CLIENT_URL}/${generatedCode.code}`,
        token: auth.token,
        tokenType: auth.token_type,
        userId: spotifyUser.id
      });

      await querySingle(
        `
        INSERT INTO playlist (
          user_auth_id,
          playlist_name,
          playlist_code,
          service_playlist_data
        ) VALUES (
          $1,
          $2,
          $2,
          $3
        )
      `,
        [
          auth.user_auth_id,
          generatedCode.code,
          JSON.stringify({
            id: playlist.id,
            href: playlist.href
          })
        ],
        client
      );

      return {
        code: generatedCode.code,
        href: playlist.href
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export default [passport.authenticate('jwt', { session: false }), createPlaylist];
