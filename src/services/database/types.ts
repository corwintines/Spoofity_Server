export type Service = 'spotify';

export interface UserProfileSchema {
  user_profile_id: string;
  email: string;
}

export interface UserServiceSchema {
  user_service_id: string;
  user_profile_id: string;
  service: string;
  service_user_data: object | SpotifyUserData;
}

export interface SpotifyUserData {
  id: string;
}

export interface UserAuthSchema {
  user_auth_id: string;
  user_service_id: Service;
  token: string;
  token_type: string;
  refresh_token: string;
  created_date: Date;
  expires_in: number;
}

export interface PlaylistSchema {
  playlist_id: string;
  user_auth_id: string;
  playlist_name: string;
  playlist_code: string;
  service_playlist_data: object | SpotifyPlaylistData;
}

export interface SpotifyPlaylistData {
  playlist_id: string;
}
