## Overview

Boilerplate codes for authentication server of `fabric-es` project. It is intented a sample code for implementing auth-server. 

### Features

- OAuth2 / jwt support
- docker image creation


### Technologies

- Postgres
- Redis


### Docker compose network

_dev-net_ is a core deployment network for provideing network configuration for postgres and redis. There is one compose file:

- `compose.1org.db-red.yaml` deploys 1 x postgres and 1 x redis database containers
- (TBC) as a future scenario, it may additionally a tester container, for integration test.


### Instructions for Local Developement

_Step 1: Local development mode using `dn-run.0-db-red.sh`_

- launch the local development network for local development, and running unit test.

_Step 2: Run local unit test using`run-unit-test.sh`_

- run unit tests in local machine, for unit test development, `npm run unit.test`

_Step 3: Optionally, build docker image for auth server with`build-auth.sh`_

- produce _fabric-es/auth-server:$RELEASE_ docker image. $RELEASE is defined in `dev-net/scripts/setup.sh`
  Notice that this release level is NOT used create-release workflow. It is only used for creating local machine image.


_Step 4: Run local server_

- `npm start` to launch local server at `http://localhost:8080`


### Endpoints

- GET `/healthcheck`
- GET `/account`
- GET `/account/isalive`
- GET `/account/userinfo`
- POST `/account`
- POST `/account/login`
- GET `/account/:user_id`
- PUT `/account/:user_id`
- DELETE `/account/:user_id`
- GET `/oauth/authenticate/ping`
- GET `/client`
- POST `/client`
- GET `/client/:client_id`
- PUT `/client/:client_id`
- DELETE `/client/:client_id`
- GET `/api_key`
- GET `/api_key/isalive`
- DELETE `/api_key/:api_key`
- POST `/oauth/authenticate`
- POST `/oauth/allow_access`
- POST `/oauth/refresh_token`
- POST `/oauth/token`


### TODO

- add OpenAPI v3.0


### Useful Commands

```shell script
docker rm -f \$(docker ps -aq -f status=exited)

# sometimes Postgresql fails to release the port 5432, you need to kill the process manually
sudo lsof -P -sTCP:LISTEN -i TCP -a -p 5432
sudo lsof -i :5432
```
