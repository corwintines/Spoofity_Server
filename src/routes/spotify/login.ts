import { RequestHandler } from 'express';
import { PoolClient } from 'pg';

import { createSpotifyToken, getSpotifyUser } from '../../services/spotify';
import { SpotifyUserProfile, SpotifyToken } from '../../services/spotify/types';
import { signJWT } from '../../services/jwt/jwt';
import { transaction, querySingle } from '../../services/database';
import { validateAuthRequest } from '../../services/database/request/validateAuthRequest';
import { insertRefreshToken } from '../../services/database/token/insertRefreshToken';
import { getRefreshToken } from '../../services/database/token/getRefreshToken';
import { UserProfileSchema, SpotifyAccountSchema } from '../../services/database/types';

import { CLIENT_URL, JWT_TYPE } from '../../const';
import { createRefreshToken, createAccessToken } from '../../services/jwt/manage';

const spotifyLogin: RequestHandler = async (req, res) => {
  const { code, state } = req.query;

  try {
    const validRequest = await validateAuthRequest(state);
    if (!validRequest) {
      throw new Error('Invalid request state');
    }

    // Get spotify auth token
    const spotifyToken = await createSpotifyToken(code);

    // Grab the user from spotify
    const spotifyUser = await getSpotifyUser({
      token: spotifyToken.access_token,
      tokenType: spotifyToken.token_type
    });

    console.log(spotifyUser);

    const [access_token, refresh_token] = await transaction(async (client) => {
      let user = await getAccount(spotifyUser, client);
      if (!user) {
        user = await insertAccount(spotifyUser, client);
      }

      await insertToken(user.external_account_id, spotifyToken, client);

      let refreshToken = await getRefreshToken(user, client);
      if (!refreshToken) {
        const token = await createRefreshToken(user);
        refreshToken = await insertRefreshToken(token, user, client);
        if (!refreshToken) {
          throw new Error('Unable to create refresh token');
        }
      }

      const accessToken = await createAccessToken(user);

      return [accessToken, refreshToken.refresh_token] as [string, string];
    });

    const url = new URL('login', CLIENT_URL);
    url.searchParams.append('token_type', JWT_TYPE);
    url.searchParams.append('access_token', access_token);
    url.searchParams.append('refresh_token', refresh_token);
    res.redirect(302, url.href);
  } catch (err) {
    const url = new URL('login', CLIENT_URL);
    url.searchParams.append('error', err.message);
    res.redirect(302, url.href);
  }
};

const getAccount = async (spotifyUser: SpotifyUserProfile, client: PoolClient) => {
  const user = await querySingle<UserProfileSchema & SpotifyAccountSchema>(
    `
      SELECT
        user_profile.*,
        spotify_account.*
      FROM user_profile
        JOIN spotify_account USING (user_profile_id)
      WHERE spotify_account.spotify_id = $1
    `,
    [spotifyUser.id],
    client
  );

  return user;
};

const insertAccount = async (spotifyUser: SpotifyUserProfile, client: PoolClient) => {
  const user = await querySingle<UserProfileSchema>(
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
  if (!user) {
    throw new Error('Unable to create user profile');
  }

  const account = await querySingle<SpotifyAccountSchema>(
    `
      INSERT INTO spotify_account (
        user_profile_id,
        spotify_id
      ) VALUES (
        $1,
        $2
      )
      RETURNING *
    `,
    [user.user_profile_id, spotifyUser.id]
  );
  if (!account) {
    throw new Error('Unable to create account');
  }

  return {
    ...user,
    ...account
  } as UserProfileSchema & SpotifyAccountSchema;
};

const insertToken = async (accountID: string, token: SpotifyToken, client: PoolClient) => {
  await querySingle(
    `
      INSERT INTO spotify_token (
        external_account_id,
        token_type,
        access_token,
        refresh_token,
        created_date,
        expiry_date
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        now(),
        now() +  make_interval(secs => $5)
      );
    `,
    [accountID, token.token_type, token.access_token, token.refresh_token, token.expires_in],
    client
  );
};

export default [spotifyLogin];
