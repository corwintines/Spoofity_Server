import { Express } from 'express';

// Spotify
import { spotifyAuthorize } from './spotify/authorize';
import { spotifyLogin } from './spotify/login';

// App
import { search } from './search';
import { addTrack } from './addTrack';

export default function registerRoutes(app: Express) {
  // Spotify
  app.get('/spotify/authorize', spotifyAuthorize);
  app.get('/spotify/login', spotifyLogin);

  // Apple Music
  // $$$$$

  // App
  app.get('/search', search);
  app.post('/track', addTrack);
}
