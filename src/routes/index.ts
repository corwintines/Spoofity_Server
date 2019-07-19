import { Express } from 'express';
import { spotifyAuthorize } from './spotify/authorize';
import { spotifyLogin } from './spotify/login';

export default function registerRoutes(app: Express) {
  // Spotify
  app.get('spotify/authorize', spotifyAuthorize);
  app.post('spotify/login', spotifyLogin);

  // Apple Music
  // $$$$$

  // App
}
