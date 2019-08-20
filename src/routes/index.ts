import { Express } from 'express';

// Middleware
import { validateTokenMiddleware } from '../services/jwt';

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
  app.get('/search', validateTokenMiddleware, ...search);

  app.post('/playlist', validateTokenMiddleware, ...createPlaylist);
  app.get('/playlist/:code', validateTokenMiddleware, ...getPlaylist);
  app.get('/playlist/:code/track', validateTokenMiddleware, ...getPlaylistTracks);
  app.post('/playlist/:code/track', validateTokenMiddleware, ...addTrack);
}
