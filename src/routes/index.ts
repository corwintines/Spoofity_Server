import { Express } from 'express';

// Spotify
import spotifyAuthorize from './spotify/authorize';
import spotifyLogin from './spotify/login';

// App
import search from './search';
import addTrack from './playlist/addTrack';
import getPlaylist from './playlist/getPlaylist';
import getPlaylistTracks from './playlist/getPlaylistTracks';
import createPlaylist from './playlist/createPlaylist';

export default function registerRoutes(app: Express) {
  // Spotify
  app.get('/spotify/authorize', ...spotifyAuthorize);
  app.get('/spotify/login', ...spotifyLogin);

  // Apple Music
  // $$$$$

  // App
  app.get('/search', ...search);

  app.post('/playlist', ...createPlaylist);
  app.get('/playlist/:code', ...getPlaylist);
  app.get('/playlist/:code/track', ...getPlaylistTracks);
  app.post('/playlist/:code/track', ...addTrack);
}
