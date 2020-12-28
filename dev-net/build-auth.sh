#!/bin/bash
#######################################
# Build Auth-Server docker image
#######################################

if [[ ( $# -eq 1 ) && ( $1 = "-h" || $1 = "--help" ) ]]; then
  echo "Usage: ./dn-build.auth.sh"
  exit 0
fi

. ./scripts/setup.sh

SECONDS=0

./cleanup.sh
printMessage "clean up" $?

printf "Cleaning up old image $AUTH_IMAGE\n"
docker rmi $AUTH_IMAGE

printf "Creating build context of auth-server ...\n"
rm -fr $ROOT_DIR/build
mkdir -p $ROOT_DIR/build

# Building the auth package
rm -fr $ROOT_DIR/dist

set -x
$LIBS_DIR/typescript/bin/tsc -p $ROOT_DIR/tsconfig.prod.json
res=$?
set +x
printMessage "tsc tsconfig.prod.json" $res

# Packing app files
set -x
cp $ROOT_DIR/entrypoint.sh $ROOT_DIR/package.json $ROOT_DIR/package-lock.json $ROOT_DIR/build/
res=$?
set +x
printMessage "cp entrypoint.sh" $res

set -x
cp $ROOT_DIR/.env.prod $ROOT_DIR/build/.env
res=$?
set +x
printMessage "cp .env" $res

set -x
cp -R $ROOT_DIR/dist $ROOT_DIR/build/
res=$?
set +x
printMessage "cp dist" $res

sleep 1

### build image ###
cd $ROOT_DIR
set -x
DOCKER_BUILD=1 docker build --no-cache -t $AUTH_IMAGE .
res=$?
set +x
printMessage "create fabric-es/auth-server:$RELEASE image" $res

set -x
docker tag $AUTH_IMAGE fabric-es/auth-server
res=$?
set +x
printMessage "create tag fabric-es/auth-server" $res

duration=$SECONDS
printf "${GREEN}$(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed.\n\n${NC}"
