import { RequestHandler } from 'express';
import { createSpotifyToken, getSpotifyUser } from '../../services/spotify';
import { CLIENT_URL } from '../../const';
import { transaction, querySingle } from '../../services/database';
import { signJWT } from '../../services/passport/jwt/manage';

const spotifyLogin: RequestHandler = async (req, res, next) => {
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

    // Grab the user from spotify
    const spotifyUser = await getSpotifyUser({
      token: token.access_token,
      tokenType: token.token_type
    });

    await transaction(async (client) => {
      const user = await querySingle<any>(
        `
        INSERT INTO user_profile (
          email
        ) VALUES (
          $1
        )
        RETURNING *
        `,
        [spotifyUser.email],
        client
      );
      req.user = user;

      const { user_service_id } = await querySingle<any>(
        `
        INSERT INTO user_service (
          user_profile_id,
          service,
          service_user_data
        ) VALUES (
          $1,
          'spotify',
          $2
        )
        RETURNING user_service_id
        `,
        [
          user.user_profile_id,
          JSON.stringify({
            id: spotifyUser.id,
            uri: spotifyUser.uri
          })
        ],
        client
      );

      await querySingle(
        `
        INSERT INTO user_auth (
          user_service_id,
          token,
          token_type,
          refresh_token,
          created_date,
          expires_in
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          now(),
          $5
        );
      `,
        [user_service_id, token.access_token, token.token_type, token.refresh_token, token.expires_in],
        client
      );
    });

    next();
  } catch (err) {
    const url = new URL('login', CLIENT_URL);
    url.searchParams.append('error', err.message);
    res.redirect(302, url.href);
  }
};

const appLogin: RequestHandler = async (req, res) => {
  try {
    const token = await signJWT(req.user);

    // Redirect user to login page with token data
    const url = new URL('login', CLIENT_URL);
    url.searchParams.append('token', token);
    url.searchParams.append('service', 'spotify');
    res.redirect(302, url.href);
  } catch (err) {
    const url = new URL('login', CLIENT_URL);
    url.searchParams.append('error', err.message);
    res.redirect(302, url.href);
  }
};

export default [spotifyLogin, appLogin];
