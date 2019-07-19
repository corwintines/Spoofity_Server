export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com';

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET as string;
export const AUTHORIZE_CALLBACK_URL = process.env
  .AUTHORIZE_CALLBACK_URL as string;

// https://developer.spotify.com/documentation/general/guides/scopes/
export const SPOTIFY_SCOPES = [];
