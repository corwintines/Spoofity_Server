import { PoolClient } from 'pg';

import { UserProfileSchema, UserTokenSchema } from '../types';
import { querySingle } from '..';

import { JWT_REFRESH_EXPIRES_IN } from '../../../const';

export async function insertRefreshToken(token: string, user: UserProfileSchema, client?: PoolClient) {
  return await querySingle<UserTokenSchema>(
    `
      INSERT INTO user_token (
        user_profile_id,
        refresh_token,
        created_date,
        expiry_date
      ) VALUES (
        $1,
        $2,
        now(),
        now() + interval '${JWT_REFRESH_EXPIRES_IN}'
      )
      RETURNING *
    `,
    [user.user_profile_id, token],
    client
  );
}
