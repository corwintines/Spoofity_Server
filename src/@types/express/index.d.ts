import { UserProfileSchema } from '../../services/database/types';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserProfileSchema;
  }
}
