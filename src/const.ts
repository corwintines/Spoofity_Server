require('dotenv').config();

export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com';

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET as string;

export const SERVER_URL = process.env.SERVER_URL as string;
export const SERVER_PORT = process.env.SERVER_PORT as string;

export const PG_URL = process.env.PG_URL as string;

export const CLIENT_URL = process.env.CLIENT_URL as string;

// https://developer.spotify.com/documentation/general/guides/scopes/
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-read-collaborative',
  'playlist-modify-public'
];
