import { querySingle } from '.';
import { UserAuthSchema, PlaylistSchema, UserServiceSchema } from './types';
import { refreshSpotifyToken } from '../spotify';
import { updateAuthorization } from './updateAuthorization';
import { PoolClient } from 'pg';

type PlaylistAuthorization = UserAuthSchema & PlaylistSchema & UserServiceSchema & { is_expired: boolean };

export async function getPlaylistAuthorization(code: string, client?: PoolClient) {
  const auth = await querySingle<PlaylistAuthorization>(
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
      playlist.playlist_id,
      playlist.playlist_code,
      playlist.service_playlist_data
    FROM playlist
      JOIN user_auth USING (user_auth_id)
      JOIN user_service USING (user_service_id)
    WHERE playlist.playlist_code = $1
  `,
    [code],
    client
  );
  if (!auth) {
    throw new Error('Invalid or expired playlist code');
  }

  if (!auth.is_expired) return auth;

  console.log('Refreshing playlist authorization', code);

  switch (auth.service) {
    case 'spotify': {
      const newAuth = await refreshSpotifyToken(auth.refresh_token);
      auth.token = newAuth.access_token;
      auth.token_type = newAuth.token_type;
      auth.refresh_token = newAuth.refresh_token;
      auth.expires_in = newAuth.expires_in;

      await updateAuthorization(auth);
      break;
    }
  }

  return auth;
}
