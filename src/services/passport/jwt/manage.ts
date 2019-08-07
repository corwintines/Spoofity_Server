import { sign, verify } from 'jsonwebtoken';

import { JWT_SECRET, CLIENT_URL } from '../../../const';

export async function signJWT<T extends object = object>(payload: T) {
  return await new Promise<string>((resolve, reject) => {
    sign(
      payload,
      JWT_SECRET,
      {
        issuer: 'server',
        audience: CLIENT_URL
      },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

export async function verifyJWT<T extends object = object>(token: string) {
  return await new Promise<T>((resolve, reject) => {
    verify(
      token,
      JWT_SECRET,
      {
        issuer: 'server',
        audience: CLIENT_URL
      },
      (err, payload) => {
        if (err) reject(err);
        else resolve(payload as T);
      }
    );
  });
}
