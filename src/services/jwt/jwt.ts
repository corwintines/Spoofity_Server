import { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';

import { JWT_SECRET, JWT_ISSUER, CLIENT_URL } from '../../const';

export async function signJWT<T extends object = object>(payload: T, options: SignOptions = {}) {
  return await new Promise<string>((resolve, reject) => {
    sign(
      payload,
      JWT_SECRET,
      {
        ...options,
        issuer: JWT_ISSUER,
        audience: CLIENT_URL
      },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

export async function verifyJWT<T extends object = object>(token: string, options: VerifyOptions = {}) {
  return await new Promise<T>((resolve, reject) => {
    verify(
      token,
      JWT_SECRET,
      {
        ...options,
        issuer: JWT_ISSUER,
        audience: CLIENT_URL
      },
      (err, payload) => {
        if (err) reject(err);
        else resolve(payload as T);
      }
    );
  });
}
