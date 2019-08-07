import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { querySingle } from '../../database';

import { JWT_SECRET, CLIENT_URL } from '../../../const';
import { UserProfileSchema } from '../../database/types';

const findUserProfile = async (userProfileID: string) => {
  return await querySingle<UserProfileSchema>(
    `
    SELECT *
    FROM user_profile
    WHERE user_profile_id = $1
  `,
    [userProfileID]
  );
};

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: JWT_SECRET,
      issuer: 'server',
      audience: CLIENT_URL
    },
    async (jwtPayload, cb) => {
      try {
        console.log('jwt', jwtPayload);
        const user = await findUserProfile(jwtPayload.user_profile_id);
        if (!user) {
          cb(null, false);
          return;
        }

        cb(null, user);
      } catch (err) {
        cb(err, false);
      }
    }
  )
);
