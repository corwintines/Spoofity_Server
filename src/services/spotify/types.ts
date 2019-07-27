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

export interface SpotifySearchResult {
  artists: SpotifyPaging<SpotifyArtist>;
  albums: SpotifyPaging<SpotifyAlbumSimplified>;
  tracks: SpotifyPaging<SpotifyTrack>;
}

export interface SpotifyTrackSimplified {
  artists: SpotifyArtistSimplified[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: object;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object;
  restrictions: object;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

export interface SpotifyTrack extends SpotifyTrackSimplified {
  album: object;
  external_ids: object;
  popularity: number;
}

export interface SpotifyArtistSimplified {
  external_urls: object;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyArtist extends SpotifyArtistSimplified {
  followers: object;
  genres: string[];
  images: object[];
  popularity: number;
}

export interface SpotifyAlbumSimplified {
  album_group?: string;
  album_type: string;
  artists: SpotifyArtistSimplified[];
  available_markets: string[];
  href: string;
  id: string;
  images: object[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: object;
  type: 'album';
  uri: string;
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
