export interface AuthSchema {
  auth_id: string;
  service: string;
  token: string;
  token_type: string;
  refresh_token: string;
  expiry_date: Date;
}

export interface RoomSchema {
  room_id: string;
  auth_id: string;
  room_code: string;
  service_playlist_id: string;
}
