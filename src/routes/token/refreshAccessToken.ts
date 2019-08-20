import { RequestHandler } from 'express';
import { createAccessToken } from '../../services/jwt/manage';

const refreshAccessToken: RequestHandler = async (req, res) => {
  const { grant_type, refresh_token } = req.params;

  if (grant_type !== 'refresh_token') {
    throw new Error('Invalid grant type');
  }

  // TODO: find user
  // create new access token
  // check expiry of refresh
  //  create new refresh if needed

  // const accessToken = await createAccessToken();
};

export default [refreshAccessToken];
