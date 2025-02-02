require('dotenv').config({ path: './.env.test' });
import cookie from 'cookie';
import express from 'express';
import httpStatus from 'http-status';
import Redis from 'ioredis';
import omit from 'lodash/omit';
import request from 'supertest';
import { ApiKey } from '../entity/ApiKey';
import { Client } from '../entity/Client';
import { User } from '../entity/User';
import {
  createHttpServer,
  isAllowAccessResponse,
  isApikey,
  isAuthenticateResponse,
  isCreateClientResponse,
  isLoginResponse,
  isRefreshTokenResponse,
  isRegisterResponse,
} from '../utils';

/**
 * Pre-requisite:
 * ./dn-run.0-db-red.sh
 */

const connection = {
  name: 'default',
  type: 'postgres' as any,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: true,
  synchronize: true, // true, for dev/test
  dropSchema: true,
  entities: [ApiKey, Client, User],
  connectTimeoutMS: 10000,
};
const org_admin_secret = process.env.ORG_ADMIN_SECRET;

// let redis: Redis.Redis;
let app: express.Express;
let user_id: string;
let client_id: string;
let non_root_client_id: string;
let non_root_user_id: string;
let access_token: string;
let non_root_access_token: string;
let api_key: string;
let refresh_token: string;
let non_root_refresh_token: string;

const redis = new Redis(6379);
if (!redis) {
  console.error('🚫  Redis is undefined');
  process.exit(1);
}

beforeAll(async () => {
  try {
    app = await createHttpServer({
      connection,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiryInSec: parseInt(process.env.JWT_EXP_IN_SECOND, 10),
      refTokenExpiryInSec: parseInt(process.env.REFRESH_TOKEN_EXP_IN_SEC, 10),
      orgAdminSecret: process.env.ORG_ADMIN_SECRET,
      redis,
    });

    if (!app) {
      console.error('🚫  app is undefined');
      process.exit(1);
    }

    const user = User.create({
      email: 'tester@example.com',
      username: 'tester',
      password: 'password',
      is_admin: false,
    });
    await User.insert(user);
  } catch (e) {
    console.error(e);
    await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
    process.exit(1);
  }
});

afterAll(async () => {
  redis.disconnect();
  return new Promise<void>((done) => setTimeout(() => done(), 2000));
});

describe('Auth Tests - / and /account', () => {
  it('should fail to register user', async () =>
    request(app)
      .post('/account')
      .send({ username: 'tester02', email: 'tester01@example.com' })
      .expect(({ body }) =>
        expect(body?.error).toEqual('missing params - username, password, email')
      ));

  it('should register (org admin) user', async () =>
    request(app)
      .post('/account')
      .send({
        username: 'tester01',
        password: 'password01',
        email: 'tester01@example.com',
        org_admin_secret,
      })
      .expect(({ body }) => {
        expect(body?.username).toEqual('tester01');
        expect(isRegisterResponse(body)).toBeTruthy();
      }));

  it('should register (non-root) user', async () =>
    request(app)
      .post('/account')
      .send({ username: 'non-root', password: 'password02', email: 'non-root@example.com' })
      .expect(({ body }) => {
        expect(body?.username).toEqual('non-root');
        expect(isRegisterResponse(body)).toBeTruthy();
      }));

  it('should fail to login user with bad password', async () =>
    request(app)
      .post('/account/login')
      .send({ username: 'tester01', password: 'bad password' })
      .expect(({ body }) => expect(body?.error).toEqual('Incorrect Username / Password')));

  it('should login (org admin) user', async () =>
    request(app)
      .post('/account/login')
      .send({ username: 'tester01', password: 'password01' })
      .expect(({ body, header }) => {
        refresh_token = cookie.parse(header['set-cookie'][0]).rt;
        user_id = body.id;
        access_token = body.access_token;
        expect(!!header['set-cookie']).toBeTruthy();
        expect(isLoginResponse(body)).toBeTruthy();
      }));

  it('should login (non-root) user', async () =>
    request(app)
      .post('/account/login')
      .send({ username: 'non-root', password: 'password02' })
      .expect(({ body, header }) => {
        non_root_refresh_token = cookie.parse(header['set-cookie'][0]).rt;
        non_root_user_id = body.id;
        non_root_access_token = body.access_token;
        expect(!!body?.id).toBeTruthy();
        expect(!!header['set-cookie']).toBeTruthy();
      }));

  it('should fail get (org admin) user by (non-root) user', async () =>
    request(app)
      .get(`/account/${user_id}`)
      .set('authorization', `Bearer ${non_root_access_token}`)
      .expect(({ body }) => expect(body.error).toEqual('not authorized to retrieve user')));

  it('should get non-root user by (org admin) user', async () =>
    request(app)
      .get(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => {
        expect(body.email).toEqual('non-root@example.com');
        expect(body.username).toEqual('non-root');
        expect(body.is_admin).toBeFalsy();
        expect(body.is_deleted).toBeFalsy();
      }));

  it('should fail to update user with invalid access_token', async () =>
    request(app)
      .put(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .send({ email: 'updated@example.com', username: 'updated-non-root' })
      .expect(({ status, body }) => {
        expect(body.error).toContain('not authorized to update user');
        expect(status).toEqual(httpStatus.UNAUTHORIZED);
      }));

  it('should fail to update user without valid params', async () =>
    request(app)
      .put(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => expect(body.error).toEqual('missing params')));

  it('should update user', async () =>
    request(app)
      .put(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${non_root_access_token}`)
      .send({ email: 'updated@example.com', username: 'updated-non-root' })
      .expect(({ body }) => {
        expect(body).toEqual({
          ok: true,
          email: 'updated@example.com',
          username: 'updated-non-root',
        });
      }));

  it('should fail to delete user with invalid access_token', async () =>
    request(app)
      .delete(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ status, body }) => {
        expect(status).toEqual(httpStatus.UNAUTHORIZED);
        expect(body.error).toContain('not authorized to delete user');
      }));

  it('should delete user', async () =>
    request(app)
      .delete(`/account/${non_root_user_id}`)
      .set('authorization', `Bearer ${non_root_access_token}`)
      .expect(({ body }) => expect(body.ok).toBeTruthy()));
});

describe('Auth Tests - /client', () => {
  it('should fail to create client without application_name', async () =>
    request(app)
      .post('/client')
      .set('authorization', `Bearer ${access_token}`)
      .send({ client_secret: 'password' })
      .expect(({ status, body }) => {
        expect(status).toEqual(httpStatus.BAD_REQUEST);
        expect(body.error).toEqual('missing params');
      }));

  it('should fail to create client without client_secret', async () =>
    request(app)
      .post('/client')
      .set('authorization', `Bearer ${access_token}`)
      .send({ application_name: 'root' })
      .expect(({ status, body }) => {
        expect(status).toEqual(httpStatus.BAD_REQUEST);
        expect(body.error).toEqual('missing params');
      }));

  it('should fail to create client without access token', async () =>
    request(app)
      .post('/client')
      .send({ application_name: 'root', client_secret: 'password', is_system_app: true })
      .expect(({ status }) => expect(status).toEqual(httpStatus.UNAUTHORIZED)));

  it('should create my client by (org admin) user', async () =>
    request(app)
      .post('/client')
      .set('authorization', `Bearer ${access_token}`)
      .send({
        application_name: 'root',
        client_secret: 'password',
        redirect_uris: '',
        is_system_app: true,
      })
      .expect(({ body }) => {
        client_id = body.id;
        expect(body.application_name).toEqual('root');
        expect(isCreateClientResponse(body)).toBeTruthy();
      }));

  it('should fail to list client, without access token', async () =>
    request(app)
      .get('/client')
      .expect(({ status }) => expect(status).toEqual(httpStatus.UNAUTHORIZED)));

  it('should list all client', async () =>
    request(app)
      .get('/client')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => {
        const client: Client = body[0];
        expect(typeof client.id).toEqual('string');
        expect(client.application_name).toEqual('root');
        expect(client.is_system_app).toBeTruthy();
        expect(client.user_id).toEqual(user_id);
      }));

  it('should fail to search non-exist client', async () =>
    request(app)
      .get('/client?application_name=nope')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ status }) => expect(status).toEqual(httpStatus.BAD_REQUEST)));

  it('should search root client by application_name', async () =>
    request(app)
      .get('/client?application_name=root')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => {
        const client: Client = body;
        expect(typeof client.id).toEqual('string');
        expect(client.application_name).toEqual('root');
        expect(client.is_system_app).toBeTruthy();
        expect(client.user_id).toEqual(user_id);
      }));

  it('should fail to get root client by RESTful path', async () =>
    request(app)
      .get(`/client/abcdefg`)
      .set('authorization', `Bearer ${access_token}`)
      // it return TypeORM error
      .expect(({ body }) => expect(body.message).toContain('invalid input syntax for uuid')));

  it('should get root client by RESTful path', async () =>
    request(app)
      .get(`/client/${client_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => {
        const client: Client = body;
        expect(typeof client.id).toEqual('string');
        expect(client.application_name).toEqual('root');
        expect(client.is_system_app).toBeTruthy();
        expect(client.user_id).toEqual(user_id);
      }));

  it('should create client by non-root user', async () =>
    request(app)
      .post('/client')
      .set('authorization', `Bearer ${non_root_access_token}`)
      .send({
        application_name: 'app_created_by_non_root',
        client_secret: 'password',
        redirect_uris: 'http://example.com',
        grants: ['password'],
      })
      .expect(({ body }) => {
        non_root_client_id = body.id;
        expect(body.application_name).toEqual('app_created_by_non_root');
        expect(!!body?.id).toBeTruthy();
        expect(body.ok).toBeTruthy();
      }));

  it('should fail to update client of non-root user by (org admin) user', async () =>
    request(app)
      .put(`/client/${non_root_client_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        application_name: 'updatedapp',
        redirect_uris: 'http://example.com/callback',
        grants: ['password', 'implicit'],
      })
      .expect(({ status }) => expect(status).toEqual(httpStatus.NOT_FOUND)));

  it('should update my client by (org admin) user', async () =>
    request(app)
      .put(`/client/${non_root_client_id}`)
      .set('authorization', `Bearer ${non_root_access_token}`)
      .send({
        application_name: 'updatedapp',
        redirect_uris: 'http://example.com/callback',
        grants: ['password', 'implicit'],
      })
      .expect(({ body }) => {
        expect(body.ok).toBeTruthy();
        expect(body.application_name).toEqual('updatedapp');
        expect(body.redirect_uris).toEqual('http://example.com/callback');
        expect(body.grants).toEqual(['password', 'implicit']);
      }));

  it('should fail to update client of non-root user by (org admin) user', async () =>
    request(app)
      .delete(`/client/${non_root_client_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ status }) => expect(status).toEqual(httpStatus.NOT_FOUND)));

  it('should delete client', async () =>
    request(app)
      .delete(`/client/${non_root_client_id}`)
      .set('authorization', `Bearer ${non_root_access_token}`)
      .expect(({ body }) => expect(body.ok).toBeTruthy()));
});

describe('Auth Tests - /api', () => {
  it('should fail to retrieve user profile with invalid token', async () =>
    request(app)
      .get('/account/userinfo')
      .set('authorization', `Bearer NO-TOKEN`)
      .expect(({ error }) => {
        expect((error as any).status).toEqual(401);
      }));

  it('should retrieve user profile via access_token', async () =>
    request(app)
      .get('/account/userinfo')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => {
        expect(omit(body, 'id')).toEqual({
          email: 'tester01@example.com',
          username: 'tester01',
          is_admin: true,
          is_deleted: false,
        });
      }));
});

describe('Auth Tests - /oauth', () => {
  it('should fail to authenticate', async () =>
    request(app)
      .post('/oauth/authenticate')
      .expect(({ status }) => {
        expect(status).toEqual(httpStatus.UNAUTHORIZED);
      }));

  it('should authenticate', async () =>
    request(app)
      .post('/oauth/authenticate')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => expect(isAuthenticateResponse(body)).toBeTruthy()));

  it('should fail to exchange access_token with client_credential', async () =>
    request(app)
      .post('/oauth/token')
      .set('Context-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${client_id}&client_secret=badpassword&grant_type=client_credentials&scope=default`
      )
      .expect(({ body }) => expect(body).toEqual({})));

  it('should exchange access_token with client_credential', async () =>
    request(app)
      .post('/oauth/token')
      .set('Context-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${client_id}&client_secret=password&grant_type=client_credentials&scope=default`
      )
      .expect(({ body }) => {
        api_key = body.access_token;
        expect(typeof body?.access_token).toEqual('string');
        expect(body?.token_type).toEqual('Bearer');
      }));

  it('should get api_keys by client_id', async () =>
    request(app)
      .get(`/api_key?client_id=${client_id}`)
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body }) => body.forEach((key) => expect(isApikey(key)).toBeTruthy())));

  it('should exchange access_token with uid/pw: password grant type', async () =>
    request(app)
      .post('/oauth/token')
      .set('Context-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${client_id}&client_secret=password&username=tester01&password=password01&grant_type=password`
      )
      .expect(({ body }) => {
        expect(typeof body?.access_token).toEqual('string');
        expect(body?.token_type).toEqual('Bearer');
      }));

  it('should grant access, via client_credentials (or api key)', async () =>
    request(app)
      .post('/oauth/allow_access')
      .send({ api_key })
      .expect(({ body }) => expect(isAllowAccessResponse(body)).toBeTruthy()));

  it('should remove access - api key', async () =>
    request(app)
      .delete(`/api_key/${api_key}`)
      .expect(({ body }) => expect(body?.ok).toBeTruthy()));

  it('should refresh token', async () =>
    request(app)
      .post('/oauth/refresh_token')
      // .set('authorization', `Bearer ${access_token}`)
      .set('Context-Type', 'application/x-www-form-urlencoded')
      .send(`refresh_token=${refresh_token}&grant_type=refresh_token`)
      .expect(({ body, status }) => {
        expect(status).toEqual(200);
        expect(isRefreshTokenResponse(body)).toBeTruthy();
      }));

  it('should fail to authenicate after waiting 10s, token expires', async () => {
    const timer = new Promise((resolve) => setTimeout(() => resolve(true), 10000));
    await timer;

    return request(app)
      .post('/oauth/authenticate')
      .set('authorization', `Bearer ${access_token}`)
      .expect(({ body, status }) => {
        expect(status).toEqual(httpStatus.UNAUTHORIZED);
        expect(body).toEqual({});
      });
  });
});
