import * as passport from 'passport';
import { RequestHandler } from 'express';
import { transaction, query } from '../../services/database';
import { PlaylistSchema, UserServiceSchema } from '../../services/database/types';

type PlaylistSchemaPicked = Pick<PlaylistSchema, 'playlist_id' | 'playlist_code' | 'playlist_name'>;
type UserServiceSchemaPicked = Pick<UserServiceSchema, 'service'>;
type UserPlaylists = PlaylistSchemaPicked & UserServiceSchemaPicked;

const listPlaylists: RequestHandler = async (req, res) => {
  try {
    const response = await transaction(async (client) => {
      const playlists = await query<UserPlaylists>(
        `
          SELECT
            playlist.playlist_id,
            playlist.playlist_name, 
            playlist.playlist_code,
            user_service.service
          FROM playlist
            JOIN user_auth USING (user_auth_id)
            JOIN user_service USING (user_service_id)
          WHERE user_service.user_profile_id = $1
        `,
        [req.user.user_profile_id],
        client
      );

      return playlists;
    });

    res.json(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export default [passport.authenticate('jwt', { session: false }), listPlaylists];
