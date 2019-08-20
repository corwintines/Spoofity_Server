import { PoolClient } from 'pg';

import { UserProfileSchema, UserTokenSchema } from '../types';
import { querySingle } from '..';

export async function getRefreshToken(user: UserProfileSchema, client?: PoolClient) {
  const token = await querySingle<UserTokenSchema>(
    `
      SELECT *
      FROM user_token
      WHERE user_profile_id = $1
      AND expiry_date < now() + interval '1 day'
    `,
    [user.user_profile_id],
    client
  );
  if (!token) {
    await querySingle(
      `
        DELETE FROM user_token
        WHERE user_profile_id = $1
      `,
      [user.user_profile_id],
      client
    );
  }

  return token;
}
