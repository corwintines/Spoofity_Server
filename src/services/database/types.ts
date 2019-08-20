export type Service = 'spotify';

export interface AuthRequestSchema {
  auth_request_id: string;
  created_date: Date;
}

export interface UserProfileSchema {
  user_profile_id: string;
  email: string;
}

export interface UserTokenSchema {
  user_token_id: string;
  user_profile_id: string;
  refresh_token: string;
  created_date: Date;
  expiry_date: Date;
}

export interface ExternalAccountSchema {
  external_account_id: string;
  user_profile_id: string;
}

export interface ExternalToken {
  external_token_id: string;
  external_account_id: string;
}

export interface SpotifyAccountSchema extends ExternalAccountSchema {
  spotify_id: string;
}

export interface SpotifyTokenSchema extends ExternalToken {
  token_type: string;
  access_token: string;
  refresh_token: string;
  created_date: Date;
  expiry_date: Date;
}

// Old

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
