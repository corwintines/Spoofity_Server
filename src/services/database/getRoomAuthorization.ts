import { querySingle } from '.';
import { AuthSchema, RoomSchema } from './types';
import { refreshSpotifyToken } from '../spotify';
import { updateRoomAuthorization } from './updateRoomAuthorization';

type RoomAuthorization = AuthSchema & RoomSchema & { is_expired: boolean };

export async function getRoomAuthorization(room: string) {
  const auth = await querySingle<RoomAuthorization>(
    `
    SELECT
      auth.auth_id,
      auth.service,
      auth.token,
      auth.token_type,
      auth.refresh_token,
      auth.created_date,
      auth.expires_in,
      (now() + interval '1 minute' > auth.created_date + make_interval(secs := auth.expires_in)) as is_expired,
      room.room_id,
      room.room_code,
      room.service_data
    FROM room
      JOIN auth USING (auth_id)
    WHERE room.room_code = $1
  `,
    [room]
  );
  if (!auth) {
    throw new Error('Invalid or expired room code');
  }

  if (!auth.is_expired) return auth;

  console.log('Refreshing authorization', room);

  switch (auth.service) {
    case 'spotify': {
      const newAuth = await refreshSpotifyToken(auth.refresh_token);
      console.log(newAuth);
      auth.token = newAuth.access_token;
      auth.token_type = newAuth.token_type;
      auth.refresh_token = newAuth.refresh_token;
      auth.expires_in = newAuth.expires_in;

      await updateRoomAuthorization(auth);
      break;
    }
  }

  return auth;
}
