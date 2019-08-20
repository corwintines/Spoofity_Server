import { querySingle } from '..';

export async function validateAuthRequest(requestID: string) {
  const result = await querySingle(
    `
      DELETE FROM auth_request
      WHERE auth_request_id = $1
      AND created_date > now() - interval '30 seconds'
      RETURNING auth_request_id
    `,
    [requestID]
  );
  return !!result;
}
