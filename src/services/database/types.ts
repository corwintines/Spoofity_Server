export type Service = 'spotify';

export interface AuthSchema {
  auth_id: string;
  service: Service;
  token: string;
  token_type: string;
  refresh_token: string;
  created_date: Date;
  expires_in: number;
}

export interface RoomSchema {
  room_id: string;
  auth_id: string;
  room_code: string;
  service_playlist_id: string;
}
