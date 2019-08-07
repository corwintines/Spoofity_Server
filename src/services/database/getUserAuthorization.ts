import { querySingle } from '.';
import { UserAuthSchema, UserServiceSchema, UserProfileSchema } from './types';
import { refreshSpotifyToken } from '../spotify';
import { updateAuthorization } from './updateAuthorization';
import { PoolClient } from 'pg';

type UserAuthorization = UserAuthSchema & UserProfileSchema & UserServiceSchema & { is_expired: boolean };

export async function getUserAuthorization(userProfileID: string, service: string, client?: PoolClient) {
  const auth = await querySingle<UserAuthorization>(
    `
      SELECT
        user_service.service,
        user_service.service_user_data,
        user_auth.user_auth_id,
        user_auth.service,
        user_auth.token,
        user_auth.token_type,
        user_auth.refresh_token,
        user_auth.created_date,
        user_auth.expires_in,
        (now() + interval '1 minute' > user_auth.created_date + make_interval(secs := user_auth.expires_in)) as is_expired,
        user_profile.user_profile_id,
        user_profile.email
      FROM user_profile
        JOIN user_service USING (user_profile_id)
        JOIN user_auth USING (user_auth_id)
      WHERE user_profile.user_profile_id = $1
      AND user_service.service = $2
    `,
    [userProfileID, service],
    client
  );
  if (!auth) {
    throw new Error('Invalid user profile ID');
  }

  if (!auth.is_expired) return auth;

  console.log('Refreshing user authorization', userProfileID);

  switch (auth.service) {
    case 'spotify': {
      const newAuth = await refreshSpotifyToken(auth.refresh_token);
      auth.token = newAuth.access_token;
      auth.token_type = newAuth.token_type;
      auth.refresh_token = newAuth.refresh_token;
      auth.expires_in = newAuth.expires_in;

      await updateAuthorization(auth, client);
      break;
    }
  }

  return auth;
}
