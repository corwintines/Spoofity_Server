import { querySingle } from '..';
import { AuthRequestSchema } from '../types';

export async function createAuthRequest() {
  const request = await querySingle<AuthRequestSchema>(
    `
      INSERT INTO auth_request (created_date) VALUES (now())
      RETURNING *;
    `
  );
  return request as AuthRequestSchema;
}
