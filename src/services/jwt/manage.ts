import { signJWT } from './jwt';
import { UserProfileSchema } from '../database/types';

import { JWT_REFRESH_EXPIRES_IN } from '../../const';

export async function createAccessToken(user: UserProfileSchema) {
  const accessToken = await signJWT(
    {
      user_profile_id: user.user_profile_id
    },
    {
      expiresIn: '1 hour'
    }
  );
  return accessToken;
}

export async function createRefreshToken(user: UserProfileSchema) {
  const refreshToken = await signJWT(
    {
      user_profile_id: user.user_profile_id
    },
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN
    }
  );
  return refreshToken;
}
