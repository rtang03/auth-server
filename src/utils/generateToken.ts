import { sign } from 'jsonwebtoken';
import { Client } from '../entity/Client';

export const generateToken: (option: {
  client?: Client;
  secret: string;
  user_id?: string;
  is_admin?: boolean;
  jwtExpiryInSec?: number;
}) => string = ({ client, user_id, is_admin, secret, jwtExpiryInSec }) =>
  jwtExpiryInSec
    ? sign(
        Object.assign(
          {},
          {
            expires: Date.now() + jwtExpiryInSec * 1000,
          },
          { client_id: client?.id },
          { is_admin },
          { user_id }
        ),
        secret,
        { expiresIn: jwtExpiryInSec }
      )
    : sign(
        Object.assign(
          {},
          { client_id: client?.id },
          { is_api_key: true },
          { is_admin },
          { user_id }
        ),
        secret
      );
