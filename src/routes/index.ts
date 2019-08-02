import { Express } from 'express';

// Spotify
import { spotifyAuthorize } from './spotify/authorize';
import { spotifyLogin } from './spotify/login';

// App
import { search } from './search';
import { addTrack } from './playlist/addTrack';
import { getPlaylist } from './playlist/getPlaylist';
import { getPlaylistTracks } from './playlist/getPlaylistTracks';

export default function registerRoutes(app: Express) {
  // Spotify
  app.get('/spotify/authorize', spotifyAuthorize);
  app.get('/spotify/login', spotifyLogin);

  // Apple Music
  // $$$$$

  // App
  app.get('/search', search);

  app.get('/playlist/:room', getPlaylist);
  app.get('/playlist/:room/track', getPlaylistTracks);
  app.post('/playlist/:room/track', addTrack);
}
