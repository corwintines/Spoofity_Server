import { querySingle } from '.';
import { AuthSchema } from './types';

type UpdateAuthSchemaParams =
  | 'token'
  | 'token_type'
  | 'refresh_token'
  | 'expires_in'
  | 'auth_id';

export async function updateRoomAuthorization(
  auth: Pick<AuthSchema, UpdateAuthSchemaParams>
) {
  return await querySingle(
    `
    UPDATE auth SET
      token = $1,
      token_type = $2,
      refresh_token = $3,
      created_date = now(),
      expires_in = $4
    WHERE auth_id = $5
    RETURNING *
  `,
    [
      auth.token,
      auth.token_type,
      auth.refresh_token,
      auth.expires_in,
      auth.auth_id
    ]
  );
}
