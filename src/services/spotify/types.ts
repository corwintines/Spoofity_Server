export type SpotifyTokenType = 'Bearer' | string;

export interface SpotifyAuthenticationError {
  error: string;
  error_description: string;
}

export interface SpotifyError {
  error: {
    status: string;
    message: string;
  };
}

export interface SpotifyToken {
  access_token: string;
  token_type: SpotifyTokenType;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyUserProfile {
  id: string;
  uri: string;
  display_name: string;
}

export interface SpotifyPublicUser {
  id: string;
  uri: string;
  display_name: string;
}

export interface SpotifyPaging<T> {
  href: string;
  items: T[];
  limit: number;
  offset: number;
  total: number;
  next: string;
  previous: string;
}

export interface SpotifyTrack {
  id: string;
  album: object;
  artists: object[];
  name: string;
  track_number: number;
  preview_url: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  is_local: boolean;
  is_playable: boolean;
}

export interface SpotifyPlaylistTrack {
  added_at: Date | null;
  added_by: SpotifyPublicUser | null;
  is_local: boolean;
  track: SpotifyTrack;
}

export interface SpotifyPlaylist {
  id: string;
  snapshot_id: string;
}
