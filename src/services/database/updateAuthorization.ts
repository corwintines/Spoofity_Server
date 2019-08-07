import { querySingle } from '.';
import { UserAuthSchema } from './types';
import { PoolClient } from 'pg';

type UpdateAuthSchemaParams = 'token' | 'token_type' | 'refresh_token' | 'expires_in' | 'user_auth_id';

export async function updateAuthorization(auth: Pick<UserAuthSchema, UpdateAuthSchemaParams>, client?: PoolClient) {
  return await querySingle(
    `
    UPDATE user_auth SET
      token = $1,
      token_type = $2,
      refresh_token = $3,
      created_date = now(),
      expires_in = $4
    WHERE user_auth_id = $5
    RETURNING *
  `,
    [auth.token, auth.token_type, auth.refresh_token, auth.expires_in, auth.user_auth_id],
    client
  );
}
