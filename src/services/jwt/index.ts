import { RequestHandler } from 'express';

import { querySingle } from '../database';
import { UserProfileSchema } from '../database/types';
import { verifyJWT } from './jwt';

import { JWT_TYPE } from '../../const';

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

export const validateTokenMiddleware: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new Error('Missing authorization header');
  }

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== JWT_TYPE) {
    throw new Error('Invalid token type');
  }

  const { user_profile_id } = await verifyJWT(accessToken);

  req.user = await findUserProfile(user_profile_id);

  next();
};
